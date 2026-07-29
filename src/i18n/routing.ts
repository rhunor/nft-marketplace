import { defineRouting } from 'next-intl/routing';

/**
 * Locales with hand-authored, checked-in translation files under /messages.
 * These are statically prerendered and never touch the DeepL API at request time.
 */
export const curatedLocales = [
  'en',
  'es',
  'pt',
  'fr',
  'de',
  'it',
  'zh',
  'ja',
  'ko',
  'ru',
  'ar',
  'nl',
  'tr',
  'pl',
  'vi',
  'id',
] as const;

/**
 * Remaining DeepL-supported target languages. No checked-in message files —
 * translated on demand from the `en` source and cached in MongoDB
 * (see src/lib/db/models/UiTranslationCache.ts + src/i18n/request.ts).
 */
export const longTailLocales = [
  'da',
  'sv',
  'nb',
  'fi',
  'cs',
  'sk',
  'sl',
  'hu',
  'ro',
  'bg',
  'el',
  'et',
  'lv',
  'lt',
  'uk',
] as const;

export const locales = [...curatedLocales, ...longTailLocales] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isCuratedLocale(locale: string): boolean {
  return (curatedLocales as readonly string[]).includes(locale);
}

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
  },
});
