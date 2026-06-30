import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Gem, Users, Award } from 'lucide-react';
import { Button, Avatar, Card } from '@/components/ui';
import { sampleCollections } from '@/lib/db/seed-data';
import { formatETH, NFT_CATEGORIES } from '@/lib/utils';
import connectDB from '@/lib/db/connection';
import NFTModel from '@/lib/db/models/NFT';
import CollectionModel from '@/lib/db/models/Collection';

export const dynamic = 'force-dynamic';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function getRandomNFTImages(count: number): Promise<string[]> {
  try {
    await connectDB();
    const nfts = await NFTModel.find({ isListed: true, mediaType: 'image' })
      .select('mediaUrl thumbnailUrl')
      .limit(100)
      .lean();
    if (nfts.length === 0) return [];
    return shuffle(nfts)
      .slice(0, count)
      .map((n) => (n as { thumbnailUrl?: string; mediaUrl: string }).thumbnailUrl || (n as { mediaUrl: string }).mediaUrl);
  } catch {
    return [];
  }
}

interface DBCollection {
  _id: unknown;
  name: string;
  description: string;
  coverImage: string;
  nfts: unknown[];
  floorPrice: number;
  totalVolume: number;
  creator: { name: string; username: string; avatar?: string };
}

async function getRandomCollections(count: number): Promise<DBCollection[]> {
  try {
    await connectDB();
    const cols = await CollectionModel.find({ isPublished: true })
      .populate('creator', 'name username avatar')
      .limit(100)
      .lean();
    if (cols.length === 0) return [];
    return shuffle(cols as unknown as DBCollection[]).slice(0, count);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // Pull one shuffled pool of real NFT images from the site: 4 for the hero
  // grid + 5 for the collection cards below, so every image on the page is
  // sourced from actual uploads rather than static stock photos.
  const [nftImagePool, featuredCols, moreCols] = await Promise.all([
    getRandomNFTImages(9),
    getRandomCollections(3),
    getRandomCollections(5),
  ]);

  // Use real NFT images if available, else fall back to sample data
  const heroSrcs =
    nftImagePool.length >= 4
      ? nftImagePool.slice(0, 4)
      : sampleCollections.slice(0, 4).map((c) => c.coverImage);

  const cardImagePool = nftImagePool.slice(4);

  // Normalise DB collections to the shape expected by the cards
  const toCard = (c: DBCollection, randomImage?: string) => ({
    id: String(c._id),
    name: c.name,
    description: c.description,
    coverImage: randomImage || c.coverImage,
    creatorName: c.creator?.name ?? '',
    creatorUsername: c.creator?.username ?? '',
    creatorAvatar: c.creator?.avatar ?? '',
    totalItems: c.nfts?.length ?? 0,
    floorPrice: c.floorPrice ?? 0,
    totalVolume: c.totalVolume ?? 0,
    isFromDB: true,
  });

  const featuredCards =
    featuredCols.length > 0
      ? featuredCols.map((c, i) => toCard(c, cardImagePool[i]))
      : sampleCollections.slice(0, 3).map((c, i) => ({
          ...c,
          coverImage: cardImagePool[i] || c.coverImage,
          isFromDB: false,
        }));

  // exclude collections already used in featured
  const featuredIds = new Set(featuredCards.map((c) => c.id));
  const moreCards =
    moreCols.length > 0
      ? moreCols
          .filter((c) => !featuredIds.has(String(c._id)))
          .slice(0, 2)
          .map((c, i) => toCard(c, cardImagePool[3 + i]))
      : sampleCollections.slice(3, 5).map((c, i) => ({
          ...c,
          coverImage: cardImagePool[3 + i] || c.coverImage,
          isFromDB: false,
        }));

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
                <Gem className="h-4 w-4" />
                <span>An Extension of Foundation</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover{' '}
                <span className="text-gradient">Exclusive</span> NFT Collections
              </h1>
              <p className="mt-6 text-lg text-foreground-muted sm:text-xl">
                Foundation Exclusive is the premier destination for high-value NFT
                collectors. Join an exclusive community where exceptional digital
                art finds its rightful collectors.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/explore">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Explore Collections
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-bold text-accent-primary">150+</p>
                  <p className="text-sm text-foreground-muted">Curated Collections</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-primary">50+</p>
                  <p className="text-sm text-foreground-muted">Elite Artists</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-primary">$45M+</p>
                  <p className="text-sm text-foreground-muted">Total Volume</p>
                </div>
              </div>
            </div>

            {/* Hero Image Grid — random NFT images */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="animate-float overflow-hidden rounded-2xl shadow-glow">
                    <Image
                      src={heroSrcs[0] ?? ''}
                      alt="Featured NFT 1"
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="animation-delay-400 animate-float overflow-hidden rounded-2xl shadow-card">
                    <Image
                      src={heroSrcs[1] ?? ''}
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
                      src={heroSrcs[2] ?? ''}
                      alt="Featured NFT 3"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="animation-delay-600 animate-float overflow-hidden rounded-2xl shadow-glow">
                    <Image
                      src={heroSrcs[3] ?? ''}
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

      {/* Featured Collections */}
      <section className="py-16">
        <div className="section-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Featured Collections</h2>
              <p className="mt-2 text-foreground-muted">
                Hand-picked collections from our exclusive artists
              </p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCards.map((collection) => (
              <Link key={collection.id} href={`/collection/${collection.id}`}>
                <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={collection.coverImage}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{collection.name}</h3>
                      <p className="mt-1 text-sm text-white/80 line-clamp-1">
                        {collection.totalItems} items
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={collection.creatorAvatar}
                          alt={collection.creatorName}
                          fallback={collection.creatorName}
                          size="sm"
                        />
                        <span className="text-sm text-foreground-muted">
                          @{collection.creatorUsername}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-foreground-muted">Floor</p>
                        <p className="font-bold text-accent-primary">
                          {formatETH(collection.floorPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section Brief */}
      <section className="bg-background-secondary py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <Gem className="mx-auto h-12 w-12 text-accent-primary" />
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
              The Exclusive Community
            </h2>
            <p className="mt-4 text-foreground-muted">
              Foundation Exclusive is an extension of Foundation, created for serious
              collectors who understand the true value of exceptional digital art.
              Our curated platform ensures every piece meets the highest standards
              of quality and authenticity.
            </p>
            <Link href="/about">
              <Button className="mt-6" variant="secondary">
                Learn About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="section-container">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Browse by Category</h2>
            <p className="mt-2 text-foreground-muted">
              Explore collections across different categories
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {NFT_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/explore?category=${category.value}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-background-card p-6 transition-all hover:-translate-y-1 hover:border-accent-primary hover:shadow-glow-sm"
              >
                <span className="text-4xl">{category.icon}</span>
                <span className="text-center font-medium text-sm">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* More Collections */}
      <section className="bg-background-secondary py-16">
        <div className="section-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">More Collections</h2>
              <p className="mt-2 text-foreground-muted">
                Discover more exclusive collections
              </p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {moreCards.map((collection) => (
              <Link key={collection.id} href={`/collection/${collection.id}`}>
                <Card className="group flex overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-square w-1/3 overflow-hidden">
                    <Image
                      src={collection.coverImage}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-bold">{collection.name}</h3>
                      <p className="mt-1 text-sm text-foreground-muted line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={collection.creatorAvatar}
                          alt={collection.creatorName}
                          fallback={collection.creatorName}
                          size="xs"
                        />
                        <span className="text-xs text-foreground-muted">
                          @{collection.creatorUsername}
                        </span>
                      </div>
                      <p className="font-bold text-accent-primary">
                        {formatETH(collection.floorPrice)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="section-container">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Why Choose Foundation Exclusive?</h2>
            <p className="mt-2 text-foreground-muted">
              The most trusted platform for premium NFT collectors
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Shield className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Verified Authenticity</h3>
              <p className="text-sm text-foreground-muted">
                Every piece undergoes rigorous verification for authenticity
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Gem className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Premium Quality</h3>
              <p className="text-sm text-foreground-muted">
                Curated collections from world-class digital artists
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Users className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Exclusive Community</h3>
              <p className="text-sm text-foreground-muted">
                Join a selective network of serious collectors
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                <Award className="h-6 w-6 text-accent-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Investment Grade</h3>
              <p className="text-sm text-foreground-muted">
                NFTs priced to reflect their true market value
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
                Ready to Join the Exclusive?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Become a member of Foundation Exclusive and gain access to
                premium collections, exclusive drops, and a community of
                like-minded collectors.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-accent-primary hover:bg-white/90"
                  >
                    Become a Member
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Explore Collections
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
