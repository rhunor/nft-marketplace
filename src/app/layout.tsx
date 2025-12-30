import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth';
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
    default: 'FoundationExclusive - Discover, Collect & Trade NFTs',
    template: '%s | FoundationExclusive',
  },
  description:
    'The premier destination for discovering, collecting, and trading unique digital assets. Join thousands of creators and collectors in the NFT revolution.',
  keywords: [
    'NFT',
    'marketplace',
    'digital art',
    'collectibles',
    'crypto',
    'blockchain',
    'ethereum',
  ],
  authors: [{ name: 'FoundationExclusive' }],
  creator: 'FoundationExclusive',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'FoundationExclusive - Discover, Collect & Trade NFTs',
    description:
      'The premier destination for discovering, collecting, and trading unique digital assets.',
    siteName: 'FoundationExclusive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FoundationExclusive - Discover, Collect & Trade NFTs',
    description:
      'The premier destination for discovering, collecting, and trading unique digital assets.',
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
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
