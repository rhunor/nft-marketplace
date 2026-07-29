import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, curatedLocales } from '@/i18n/routing';
import { spaceGrotesk, inter } from '@/lib/fonts';
import { AppProviders } from '@/components/AppProviders';
import '@/styles/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foundationexclusive.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Foundation Exclusive - Premium NFT Collections',
    template: '%s | Foundation Exclusive',
  },
  description:
    'The premier destination for high-value NFT collectors and creators. Discover, create, and collect exclusive digital art and collectibles.',
  keywords: [
    'NFT',
    'Foundation',
    'exclusive',
    'digital art',
    'collectibles',
    'premium NFT',
    'crypto art',
    'blockchain',
    'ethereum',
    'high-value NFT',
    'NFT marketplace',
    'buy NFT',
    'sell NFT',
    'mint NFT',
  ],
  authors: [{ name: 'Foundation Exclusive' }],
  creator: 'Foundation Exclusive',
  publisher: 'Foundation Exclusive',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Foundation Exclusive - Premium NFT Collections',
    description:
      'The premier destination for high-value NFT collectors and creators. Discover, create, and collect exclusive digital art.',
    siteName: 'Foundation Exclusive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundation Exclusive - Premium NFT Collections',
    description:
      'The premier destination for high-value NFT collectors and creators. Discover, create, and collect exclusive digital art.',
    creator: '@foundationexcl',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// Only prerender the curated locales (real, checked-in translation files).
// Long-tail locales are intentionally excluded here so the build never triggers
// bulk DeepL calls - they're generated lazily, once, on a real visitor's first
// request (see src/i18n/loadMessages.ts) and served from cache after that.
export function generateStaticParams() {
  return curatedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider>
          <AppProviders>
            <div className="relative flex min-h-screen flex-col">{children}</div>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
