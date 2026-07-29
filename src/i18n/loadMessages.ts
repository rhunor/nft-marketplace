import crypto from 'crypto';
import { namespaces } from './namespaces';
import { isCuratedLocale, defaultLocale } from './routing';
import { isDeepLSupported, translateMessagesObject } from '@/lib/translation/deepl';

type Messages = Record<string, Record<string, unknown>>;

async function loadNamespaceFile(
  locale: string,
  namespace: string
): Promise<Record<string, unknown>> {
  const mod = (await import(`../../messages/${locale}/${namespace}.json`)) as {
    default: Record<string, unknown>;
  };
  return mod.default;
}

async function loadCuratedMessages(locale: string): Promise<Messages> {
  const entries = await Promise.all(
    namespaces.map(async (ns) => [ns, await loadNamespaceFile(locale, ns)] as const)
  );
  return Object.fromEntries(entries);
}

function hashContent(content: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');
}

async function loadLongTailMessages(locale: string): Promise<Messages> {
  const enMessages = await loadCuratedMessages(defaultLocale);

  if (!isDeepLSupported(locale)) {
    // Not covered by DeepL at all - fall back to English (documented limitation).
    return enMessages;
  }

  // Mongo access + DeepL calls only happen for long-tail locales, so curated
  // locales (the common case) never pay this cost.
  const [{ default: connectDB }, { default: UiTranslationCache }] = await Promise.all([
    import('@/lib/db/connection'),
    import('@/lib/db/models/UiTranslationCache'),
  ]);
  await connectDB();

  const result: Messages = {};

  await Promise.all(
    namespaces.map(async (ns) => {
      const source = enMessages[ns] ?? {};
      const contentHash = hashContent(source);

      const cached = await UiTranslationCache.findOne({ locale, namespace: ns }).lean();
      if (cached && cached.contentHash === contentHash) {
        result[ns] = cached.messages as Record<string, unknown>;
        return;
      }

      try {
        const translated = await translateMessagesObject(source, locale);
        result[ns] = translated;
        await UiTranslationCache.updateOne(
          { locale, namespace: ns },
          { locale, namespace: ns, contentHash, messages: translated, generatedAt: new Date() },
          { upsert: true }
        );
      } catch (err) {
        console.error(`[i18n] Failed to generate "${locale}/${ns}" via DeepL:`, err);
        // Serve stale cache if we have one, otherwise English.
        result[ns] = (cached?.messages as Record<string, unknown>) ?? source;
      }
    })
  );

  return result;
}

export async function loadMessages(locale: string): Promise<Messages> {
  if (isCuratedLocale(locale)) {
    return loadCuratedMessages(locale);
  }
  return loadLongTailMessages(locale);
}
