import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui';
import { NFTCarousel, NFTGrid } from '@/components/nft';
import { sampleNFTs, topSellers } from '@/lib/db/seed-data';
import { NFT_CATEGORIES } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-accent-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/3 h-1/2 w-1/2 rounded-full bg-accent-secondary/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-2 text-sm text-accent-secondary">
                <Sparkles className="h-4 w-4" />
                <span>The future of digital ownership</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover, Collect & Trade{' '}
                <span className="text-gradient">Extraordinary</span> NFTs
              </h1>
              <p className="mt-6 text-lg text-foreground-muted sm:text-xl">
                The premier marketplace for unique digital assets. Join
                thousands of creators and collectors in the NFT revolution.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/explore">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Explore NFTs
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="lg">
                    Start Creating
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-bold text-accent-primary">50K+</p>
                  <p className="text-sm text-foreground-muted">NFTs Created</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-primary">12K+</p>
                  <p className="text-sm text-foreground-muted">Artists</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-primary">$10M+</p>
                  <p className="text-sm text-foreground-muted">Total Volume</p>
                </div>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="animate-float overflow-hidden rounded-2xl shadow-glow">
                    <Image
                      src={sampleNFTs[0]?.mediaUrl || ''}
                      alt="Featured NFT 1"
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="animation-delay-400 animate-float overflow-hidden rounded-2xl shadow-card">
                    <Image
                      src={sampleNFTs[1]?.mediaUrl || ''}
                      alt="Featured NFT 2"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="animation-delay-200 animate-float overflow-hidden rounded-2xl shadow-card">
                    <Image
                      src={sampleNFTs[2]?.mediaUrl || ''}
                      alt="Featured NFT 3"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="animation-delay-600 animate-float overflow-hidden rounded-2xl shadow-glow">
                    <Image
                      src={sampleNFTs[3]?.mediaUrl || ''}
                      alt="Featured NFT 4"
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Sellers Carousel */}
      <section className="py-16">
        <div className="section-container">
          <NFTCarousel
            nfts={topSellers}
            title="Top Sellers"
            subtitle="Discover the most popular NFTs on our platform"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-background-secondary py-16">
        <div className="section-container">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Browse by Category</h2>
            <p className="mt-2 text-foreground-muted">
              Explore NFTs across different categories
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {NFT_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/explore?category=${category.value}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-background-card p-6 transition-all hover:-translate-y-1 hover:border-accent-primary hover:shadow-glow-sm"
              >
                <span className="text-4xl">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="section-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">New Arrivals</h2>
              <p className="mt-2 text-foreground-muted">
                Fresh NFTs just listed on the marketplace
              </p>
            </div>
            <Link href="/explore?sortBy=createdAt&sortOrder=desc">
              <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>
          <NFTGrid nfts={sampleNFTs.slice(0, 6)} columns={3} />
        </div>
      </section>

      {/* Features */}
      <section className="bg-background-secondary py-16">
        <div className="section-container">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Why Choose FoundationExclusive?</h2>
            <p className="mt-2 text-foreground-muted">
              The most trusted platform for NFT trading
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Shield className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Secure Platform</h3>
              <p className="text-sm text-foreground-muted">
                Industry-leading security measures to protect your assets
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Zap className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Fast Transactions</h3>
              <p className="text-sm text-foreground-muted">
                Lightning-fast trades with minimal fees
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Users className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Growing Community</h3>
              <p className="text-sm text-foreground-muted">
                Join thousands of creators and collectors worldwide
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Sparkles className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Premium Quality</h3>
              <p className="text-sm text-foreground-muted">
                Curated collections from top digital artists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-primary to-accent-secondary p-8 sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Start Your NFT Journey?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Create an account today and start collecting, creating, and
                trading unique digital assets.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-accent-primary hover:bg-white/90"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
