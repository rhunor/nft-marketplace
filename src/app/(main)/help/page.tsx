import Link from 'next/link';
import {
  HelpCircle,
  Wallet,
  Upload,
  ShoppingCart,
  Shield,
  Clock,
  CreditCard,
  Image as ImageIcon,
  ChevronRight,
} from 'lucide-react';
import { Card, Button } from '@/components/ui';

const faqItems = [
  {
    question: 'What is an NFT?',
    answer:
      'NFT stands for Non-Fungible Token. It\'s a unique digital asset stored on a blockchain that represents ownership of digital items like art, music, videos, and more. Unlike cryptocurrencies, each NFT is unique and cannot be exchanged on a one-to-one basis.',
  },
  {
    question: 'How do I create an NFT?',
    answer:
      'To create an NFT, first sign up and fund your account with at least 0.1 ETH (~$200). Then go to the "Create" page, upload your digital file (image, video, or audio), add details like title, description, and price, then submit. Your NFT will be minted and listed on the marketplace.',
  },
  {
    question: 'How do I buy an NFT?',
    answer:
      'Browse the marketplace to find NFTs you like. Click on any NFT to view its details, then click "Buy Now" to purchase. Make sure you have sufficient balance in your wallet. After purchase, ownership will be transferred to you after admin confirmation.',
  },
  {
    question: 'How do I fund my account?',
    answer:
      'Go to the "Fund Account" page from your dashboard. You\'ll see a QR code and wallet address. Send ETH from your external wallet to this address. Your balance will be updated within approximately 10 minutes after the transaction is confirmed.',
  },
  {
    question: 'What are the fees?',
    answer:
      'Creating an NFT costs approximately 0.1 ETH (~$200) which covers gas fees. Purchasing NFTs only requires the listed price. There are no hidden fees or commissions on sales.',
  },
  {
    question: 'How long does it take to process transactions?',
    answer:
      'Funding your account takes about 10 minutes for the balance to reflect. NFT purchases are processed within 24 hours as our admin team verifies each transaction to ensure security.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'We support various file formats including images (JPG, PNG, GIF, WEBP), videos (MP4, WEBM), and audio files (MP3, WAV, OGG). Maximum file size is 100MB.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we use industry-standard security measures to protect your data. All transactions are verified, and we never share your personal information with third parties.',
  },
];

const helpTopics = [
  {
    icon: Wallet,
    title: 'Wallet & Balance',
    description: 'Learn how to fund your account and manage your ETH balance',
    href: '#funding',
  },
  {
    icon: Upload,
    title: 'Creating NFTs',
    description: 'Step-by-step guide to minting your first NFT',
    href: '#creating',
  },
  {
    icon: ShoppingCart,
    title: 'Buying NFTs',
    description: 'How to browse, purchase, and collect NFTs',
    href: '#buying',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Keeping your account and assets safe',
    href: '#security',
  },
];

export default function HelpPage() {
  return (
    <div className="py-8">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Help Center</h1>
          <p className="mt-4 text-lg text-foreground-muted">
            Everything you need to know about using FoundationExclusive
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {helpTopics.map((topic) => (
            <a key={topic.title} href={topic.href}>
              <Card hover className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <topic.icon className="h-6 w-6 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-foreground-muted">
                    {topic.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-foreground-subtle" />
              </Card>
            </a>
          ))}
        </div>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Getting Started</h2>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Create an Account</h3>
                  <p className="mt-1 text-foreground-muted">
                    Sign up with your email or Google account. It&apos;s free and takes
                    less than a minute.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Fund Your Wallet</h3>
                  <p className="mt-1 text-foreground-muted">
                    Add ETH to your account to start creating or purchasing NFTs.
                    Go to Dashboard → Fund Account.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Explore & Collect</h3>
                  <p className="mt-1 text-foreground-muted">
                    Browse thousands of unique NFTs, or create your own digital
                    masterpiece.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6">
                <h3 className="flex items-start gap-3 font-semibold">
                  <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-primary" />
                  {item.question}
                </h3>
                <p className="mt-3 pl-8 text-foreground-muted">{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Information */}
        <section id="funding" className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Key Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <Clock className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Processing Times</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• Balance updates: ~10 minutes</li>
                <li>• NFT purchases: Within 24 hours</li>
                <li>• NFT creation: Instant listing</li>
              </ul>
            </Card>
            <Card className="p-6">
              <CreditCard className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Fees</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• NFT creation: ~0.1 ETH (~$200)</li>
                <li>• Purchasing: Listed price only</li>
                <li>• No hidden fees</li>
              </ul>
            </Card>
            <Card className="p-6">
              <ImageIcon className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Supported Formats</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• Images: JPG, PNG, GIF, WEBP</li>
                <li>• Video: MP4, WEBM</li>
                <li>• Audio: MP3, WAV, OGG</li>
                <li>• Max size: 100MB</li>
              </ul>
            </Card>
            <Card className="p-6">
              <Shield className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Security Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• Never share your password</li>
                <li>• Verify wallet addresses carefully</li>
                <li>• Enable 2FA when available</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 p-8 text-center">
          <h2 className="text-2xl font-bold">Still Have Questions?</h2>
          <p className="mt-2 text-foreground-muted">
            Our support team is here to help you
          </p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg">Contact Support</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
