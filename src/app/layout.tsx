import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth';
import { EthPriceProvider } from '@/contexts/EthPriceContext';
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

export const metadata: Metadata = {
  title: {
    default: 'Foundation Exclusive - Premium NFT Collections',
    template: '%s | Foundation Exclusive',
  },
  description:
    'An extension of Foundation - the premier destination for high-value NFT collectors and creators. Join our exclusive community of discerning collectors.',
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
  ],
  authors: [{ name: 'Foundation Exclusive' }],
  creator: 'Foundation Exclusive',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Foundation Exclusive - Premium NFT Collections',
    description:
      'An extension of Foundation - the premier destination for high-value NFT collectors and creators.',
    siteName: 'Foundation Exclusive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundation Exclusive - Premium NFT Collections',
    description:
      'An extension of Foundation - the premier destination for high-value NFT collectors and creators.',
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
          <EthPriceProvider>
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
          </EthPriceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}