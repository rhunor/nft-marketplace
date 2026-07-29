import { cookies, headers } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { countryToLocale } from '@/i18n/geoLocaleMap';
import { localeNames } from '@/i18n/localeNames';
import type { Locale } from '@/i18n/routing';
import { LanguageSuggestionBannerClient } from './LanguageSuggestionBannerClient';

const DISMISS_COOKIE = 'geo_banner_dismissed';

/**
 * Suggests switching locale based on the visitor's IP-derived country -
 * purely a suggestion (never a forced redirect), since the browser's own
 * language preference (handled in middleware) is the primary signal.
 */
export async function LanguageSuggestionBanner() {
  const [headerList, cookieList, activeLocale] = await Promise.all([
    headers(),
    cookies(),
    getLocale(),
  ]);

  const country = headerList.get('x-vercel-ip-country');
  const suggestedLocale = countryToLocale(country);

  if (!suggestedLocale || suggestedLocale === activeLocale) return null;
  if (cookieList.get(DISMISS_COOKIE)?.value === suggestedLocale) return null;

  const t = await getTranslations('common.languageBanner');

  return (
    <LanguageSuggestionBannerClient
      suggestedLocale={suggestedLocale as Locale}
      suggestedLanguageName={localeNames[suggestedLocale]}
      message={t('message', { language: localeNames[suggestedLocale] })}
      switchLabel={t('switch')}
      dismissLabel={t('dismiss')}
      dismissCookieName={DISMISS_COOKIE}
    />
  );
}
