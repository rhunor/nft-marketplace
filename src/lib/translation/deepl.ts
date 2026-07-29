/**
 * Thin wrapper around the DeepL API. Free-tier keys end in ":fx" and must hit
 * api-free.deepl.com; paid keys hit api.deepl.com.
 */

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

const DEEPL_BASE_URL = DEEPL_API_KEY?.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2'
  : 'https://api.deepl.com/v2';

/** Our app locale codes -> DeepL target_lang codes. */
const LOCALE_TO_DEEPL_TARGET: Record<string, string> = {
  es: 'ES',
  pt: 'PT-BR',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
  zh: 'ZH',
  ja: 'JA',
  ko: 'KO',
  ru: 'RU',
  ar: 'AR',
  nl: 'NL',
  tr: 'TR',
  pl: 'PL',
  vi: 'VI',
  id: 'ID',
  da: 'DA',
  sv: 'SV',
  nb: 'NB',
  fi: 'FI',
  cs: 'CS',
  sk: 'SK',
  sl: 'SL',
  hu: 'HU',
  ro: 'RO',
  bg: 'BG',
  el: 'EL',
  et: 'ET',
  lv: 'LV',
  lt: 'LT',
  uk: 'UK',
};

export function isDeepLSupported(locale: string): boolean {
  return locale in LOCALE_TO_DEEPL_TARGET;
}

export function deeplTargetLang(locale: string): string | undefined {
  return LOCALE_TO_DEEPL_TARGET[locale];
}

export class DeepLNotConfiguredError extends Error {
  constructor() {
    super('DEEPL_API_KEY is not set');
    this.name = 'DeepLNotConfiguredError';
  }
}

/** Translates a batch of strings in one API call. Order is preserved. */
export async function translateBatch(
  texts: string[],
  targetLocale: string,
  options?: { sourceLocale?: string; tagHandling?: 'html' }
): Promise<string[]> {
  if (texts.length === 0) return [];
  if (!DEEPL_API_KEY) throw new DeepLNotConfiguredError();

  const targetLang = deeplTargetLang(targetLocale);
  if (!targetLang) {
    throw new Error(`Locale "${targetLocale}" is not supported by DeepL`);
  }

  const body = new URLSearchParams();
  for (const text of texts) body.append('text', text);
  body.append('target_lang', targetLang);
  if (options?.sourceLocale) {
    body.append('source_lang', options.sourceLocale.toUpperCase());
  }
  if (options?.tagHandling) {
    body.append('tag_handling', options.tagHandling);
  }

  const response = await fetch(`${DEEPL_BASE_URL}/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `DeepL API error ${response.status}: ${errorBody || response.statusText}`
    );
  }

  const data = (await response.json()) as {
    translations: { text: string }[];
  };
  return data.translations.map((t) => t.text);
}

export async function translateText(
  text: string,
  targetLocale: string,
  options?: { sourceLocale?: string; tagHandling?: 'html' }
): Promise<string> {
  const [translated] = await translateBatch([text], targetLocale, options);
  if (translated === undefined) {
    throw new Error('DeepL returned no translation');
  }
  return translated;
}

/**
 * Recursively translates every string leaf in a nested messages object,
 * preserving key structure. Used to generate on-demand locale packs and to
 * bulk-translate namespace JSON files.
 */
export async function translateMessagesObject(
  messages: Record<string, unknown>,
  targetLocale: string
): Promise<Record<string, unknown>> {
  const leaves: string[] = [];
  const paths: (string | number)[][] = [];

  function collect(node: unknown, path: (string | number)[]) {
    if (typeof node === 'string') {
      leaves.push(node);
      paths.push(path);
    } else if (Array.isArray(node)) {
      node.forEach((item, i) => collect(item, [...path, i]));
    } else if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        collect(value, [...path, key]);
      }
    }
  }
  collect(messages, []);

  const translated = await translateBatch(leaves, targetLocale, {
    sourceLocale: 'en',
  });

  const result: Record<string, unknown> = JSON.parse(JSON.stringify(messages));
  paths.forEach((path, i) => {
    let cursor: Record<string, unknown> | unknown[] = result as
      | Record<string, unknown>
      | unknown[];
    for (let depth = 0; depth < path.length - 1; depth++) {
      // @ts-expect-error - dynamic path walk over a plain-JSON tree
      cursor = cursor[path[depth]];
    }
    const lastKey = path[path.length - 1];
    // @ts-expect-error - dynamic path walk over a plain-JSON tree
    cursor[lastKey] = translated[i];
  });

  return result;
}
