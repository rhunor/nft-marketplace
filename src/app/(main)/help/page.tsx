'use client';

import Link from 'next/link';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  ArrowDownToLine,
  DollarSign,
  Search,
} from 'lucide-react';
import { Card, Button, Loading } from '@/components/ui';

const faqItems = [
  {
    question: 'What is an NFT?',
    answer:
      'NFT stands for Non-Fungible Token. It\'s a unique digital asset stored on a blockchain that represents ownership of digital items like art, music, videos, and more.',
  },
  {
    question: 'How do I create an NFT?',
    answer:
      'Fund your account with at least $200 worth of ETH, go to the Create page, upload your file, add details, and submit.',
  },
  {
    question: 'What are the fees?',
    answer:
      'Creating an NFT costs $200 per item. Purchasing NFTs only requires the listed price. Withdrawals require a 10% fee paid separately.',
  },
  {
    question: 'How long does it take to process transactions?',
    answer:
      'Funding: ~10 minutes. NFT purchases: Within 24 hours. Withdrawals: 24-48 hours.',
  },
];

const helpTopics = [
  { icon: Wallet, title: 'Wallet & Balance', description: 'Fund your account and manage ETH', href: '#wallet-balance' },
  { icon: Upload, title: 'Creating NFTs', description: 'Mint your first NFT', href: '#creating-nfts' },
  { icon: ShoppingCart, title: 'Buying NFTs', description: 'Purchase and collect NFTs', href: '#buying-nfts' },
  { icon: ArrowDownToLine, title: 'Withdrawals', description: 'Withdraw funds from your account', href: '#withdrawals' },
  { icon: Shield, title: 'Security', description: 'Keep your account safe', href: '#security' },
  { icon: Search, title: 'Exploring NFTs', description: 'Browse and discover collections', href: '#exploring' },
];

function HelpContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [searchParams]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <div className="py-8">
      <div className="section-container max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Help Center</h1>
          <p className="mt-4 text-lg text-foreground-muted">
            Everything you need to know about using Foundation Exclusive
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {helpTopics.map((topic) => (
            <a key={topic.title} href={topic.href} onClick={(e) => scrollToSection(e, topic.href)} className="block">
              <Card hover className="flex items-center gap-4 p-6 h-full">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <topic.icon className="h-6 w-6 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-foreground-muted">{topic.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-foreground-subtle" />
              </Card>
            </a>
          ))}
        </div>

        {/* Wallet & Balance Section */}
        <section id="wallet-balance" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Wallet className="h-7 w-7 text-accent-primary" />
            Wallet & Balance
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">How to Fund Your Account</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              <li><span className="font-bold text-accent-primary">1.</span> Log in and go to your <strong>Dashboard</strong></li>
              <li><span className="font-bold text-accent-primary">2.</span> Click <strong>&quot;Fund Account&quot;</strong></li>
              <li><span className="font-bold text-accent-primary">3.</span> You&apos;ll see a QR code and ETH wallet address</li>
              <li><span className="font-bold text-accent-primary">4.</span> Send ETH from your external wallet to this address</li>
              <li><span className="font-bold text-accent-primary">5.</span> Wait ~10 minutes for balance to update</li>
            </ol>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">Important Notes</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                <li>• Only send ETH (Ethereum) to the provided address</li>
                <li>• Double-check the wallet address before sending</li>
                <li>• Keep your transaction hash for reference</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Creating NFTs Section */}
        <section id="creating-nfts" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Upload className="h-7 w-7 text-accent-primary" />
            Creating NFTs
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">How to Create a Single NFT</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              <li><span className="font-bold text-accent-primary">1.</span> Ensure you have at least <strong>$200 worth of ETH</strong></li>
              <li><span className="font-bold text-accent-primary">2.</span> Go to <strong>Create</strong> page</li>
              <li><span className="font-bold text-accent-primary">3.</span> Select <strong>&quot;Single NFT&quot;</strong> mode</li>
              <li><span className="font-bold text-accent-primary">4.</span> Upload your media file (max 100MB)</li>
              <li><span className="font-bold text-accent-primary">5.</span> Fill in title, price, and category</li>
              <li><span className="font-bold text-accent-primary">6.</span> Click <strong>&quot;Create NFT&quot;</strong></li>
            </ol>
            <div className="border-t border-border pt-4 mb-4">
              <h4 className="font-semibold mb-2">How to Create a Collection</h4>
              <ol className="space-y-2 text-foreground-muted">
                <li><span className="font-bold text-accent-primary">1.</span> Select <strong>&quot;Collection&quot;</strong> mode on Create page</li>
                <li><span className="font-bold text-accent-primary">2.</span> Add collection name, description, and cover image</li>
                <li><span className="font-bold text-accent-primary">3.</span> Add 2-20 items to your collection</li>
                <li><span className="font-bold text-accent-primary">4.</span> Set the collection price (<strong>$200 per item</strong>)</li>
              </ol>
            </div>
            <div className="border-t border-border pt-4 bg-accent-primary/10 -mx-6 px-6 py-3 rounded-b-xl">
              <h4 className="font-semibold mb-1">Upload Fees</h4>
              <p className="text-sm text-foreground-muted">Single NFT: $200 | Collection: $200 per item</p>
            </div>
          </Card>
        </section>

        {/* Buying NFTs Section */}
        <section id="buying-nfts" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-7 w-7 text-accent-primary" />
            Buying NFTs
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">How to Purchase an NFT</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              <li><span className="font-bold text-accent-primary">1.</span> Browse the <strong>Explore</strong> page</li>
              <li><span className="font-bold text-accent-primary">2.</span> Use filters to find what you want</li>
              <li><span className="font-bold text-accent-primary">3.</span> Click on an NFT to view details</li>
              <li><span className="font-bold text-accent-primary">4.</span> Click <strong>&quot;Buy Now&quot;</strong></li>
              <li><span className="font-bold text-accent-primary">5.</span> Confirm the purchase</li>
              <li><span className="font-bold text-accent-primary">6.</span> Wait for admin confirmation (within 24 hours)</li>
            </ol>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">After Purchase</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                <li>• NFT appears in your Dashboard under &quot;Owned&quot;</li>
                <li>• No additional fees for purchasing</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Withdrawals Section */}
        <section id="withdrawals" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <ArrowDownToLine className="h-7 w-7 text-accent-primary" />
            Withdrawals
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">How to Withdraw Funds</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              <li><span className="font-bold text-accent-primary">1.</span> Go to <strong>Dashboard</strong> and click <strong>&quot;Withdraw&quot;</strong></li>
              <li><span className="font-bold text-accent-primary">2.</span> Enter your external ETH wallet address (0x...)</li>
              <li><span className="font-bold text-accent-primary">3.</span> Enter the withdrawal amount</li>
              <li><span className="font-bold text-accent-primary">4.</span> Click <strong>&quot;Continue&quot;</strong></li>
              <li><span className="font-bold text-accent-primary">5.</span> Send the <strong>10% fee</strong> to the provided wallet address</li>
              <li><span className="font-bold text-accent-primary">6.</span> Click <strong>&quot;Confirm Payment&quot;</strong></li>
              <li><span className="font-bold text-accent-primary">7.</span> Withdrawal processed in <strong>24-48 hours</strong></li>
            </ol>
            <div className="border-t border-border pt-4 mb-4">
              <h4 className="font-semibold mb-2">Important Information</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                <li>• <strong>Minimum withdrawal:</strong> 0.01 ETH</li>
                <li>• <strong>Fee:</strong> 10% (paid separately to fee wallet)</li>
                <li>• <strong>Processing time:</strong> 24-48 hours</li>
                <li>• You receive the FULL withdrawal amount after paying the fee</li>
              </ul>
            </div>
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
              <h4 className="font-semibold text-warning mb-2">⚠️ Fee Payment</h4>
              <p className="text-sm text-foreground-muted">
                The 10% fee must be sent to our fee wallet <strong>before</strong> your withdrawal is processed.
                For example: withdraw 1 ETH → send 0.1 ETH fee → receive 1 ETH to your wallet.
              </p>
            </div>
          </Card>
        </section>

        {/* Exploring Section */}
        <section id="exploring" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Search className="h-7 w-7 text-accent-primary" />
            Exploring NFTs
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">How to Browse NFTs</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              <li><span className="font-bold text-accent-primary">1.</span> Go to <strong>Explore</strong> page</li>
              <li><span className="font-bold text-accent-primary">2.</span> Browse collections or switch to items view</li>
              <li><span className="font-bold text-accent-primary">3.</span> Use the <strong>search bar</strong> to find specific NFTs</li>
              <li><span className="font-bold text-accent-primary">4.</span> Filter by <strong>category</strong></li>
              <li><span className="font-bold text-accent-primary">5.</span> Sort by volume, floor price, or items</li>
            </ol>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">Search Tips</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                <li>• Search by title, description, or creator name</li>
                <li>• Use tags like &quot;abstract&quot;, &quot;space&quot;, &quot;nature&quot;</li>
                <li>• Click on a collection to view all items</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Security Section */}
        <section id="security" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Shield className="h-7 w-7 text-accent-primary" />
            Security
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Keeping Your Account Safe</h3>
            <ul className="space-y-3 text-foreground-muted">
              <li className="flex gap-3">
                <Shield className="h-5 w-5 text-accent-primary flex-shrink-0" />
                <span><strong>Use a strong password:</strong> At least 8 characters</span>
              </li>
              <li className="flex gap-3">
                <Shield className="h-5 w-5 text-accent-primary flex-shrink-0" />
                <span><strong>Never share your password:</strong> We will never ask for it</span>
              </li>
              <li className="flex gap-3">
                <Shield className="h-5 w-5 text-accent-primary flex-shrink-0" />
                <span><strong>Verify wallet addresses:</strong> Double-check before sending</span>
              </li>
              <li className="flex gap-3">
                <Shield className="h-5 w-5 text-accent-primary flex-shrink-0" />
                <span><strong>Beware of scams:</strong> We never DM asking for payments</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-12 scroll-mt-24">
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

        {/* Quick Reference */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Quick Reference</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <Clock className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Processing Times</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• Balance updates: ~10 minutes</li>
                <li>• NFT purchases: Within 24 hours</li>
                <li>• Withdrawals: 24-48 hours</li>
              </ul>
            </Card>
            <Card className="p-6">
              <CreditCard className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Fees</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• NFT creation: $200 per item</li>
                <li>• Purchasing: Listed price only</li>
                <li>• Withdrawals: 10% (paid separately)</li>
              </ul>
            </Card>
            <Card className="p-6">
              <ImageIcon className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Supported Formats</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• Images: JPG, PNG, GIF, WEBP</li>
                <li>• Video: MP4, WEBM</li>
                <li>• Audio: MP3, WAV, OGG</li>
              </ul>
            </Card>
            <Card className="p-6">
              <DollarSign className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">Minimum Amounts</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>• Min withdrawal: 0.01 ETH</li>
                <li>• Min NFT price: 0.001 ETH</li>
                <li>• Collection: 2-20 items</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 p-8 text-center">
          <h2 className="text-2xl font-bold">Still Have Questions?</h2>
          <p className="mt-2 text-foreground-muted">Our support team is here to help you</p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg">Contact Support</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<Loading text="Loading help center..." />}>
      <HelpContent />
    </Suspense>
  );
}