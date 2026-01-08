import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth';
import { EthPriceProvider, SessionRefreshProvider } from '@/contexts';
import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AuthProvider>
          <SessionRefreshProvider>
            <EthPriceProvider>
              <div className="relative flex min-h-screen flex-col">
                {children}
              </div>
            </EthPriceProvider>
          </SessionRefreshProvider>
        </AuthProvider>
      </body>
    </html>
  );
}