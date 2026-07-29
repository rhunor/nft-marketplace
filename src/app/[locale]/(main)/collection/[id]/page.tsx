'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Heart, Eye, Grid, Share2 } from 'lucide-react';
import { Button, Card, Avatar, Badge, Loading } from '@/components/ui';
import { sampleCollections } from '@/lib/db/seed-data';
import { formatETH, getCategoryLabel } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import type { NFTCategory, SafeUser } from '@/types';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

// Local types for this page
interface NFTItem {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  price: number;
  category: string;
  tags: string[];
  creator: SafeUser;
  owner: SafeUser;
  likes: string[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionData {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  category: NFTCategory;
  creator: SafeUser;
  nfts: NFTItem[];
  floorPrice: number;
  totalVolume: number;
  totalItems: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Check if ID is a MongoDB ObjectId
const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export default function CollectionDetailPage({ params }: PageProps) {
  const t = useTranslations('collection');
  const { id } = use(params);
  const router = useRouter();
  const { formatEthToUsd } = useEthPrice();

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if it's a database collection or sample collection
        if (isMongoId(id)) {
          // Fetch from database
          const response = await fetch(`/api/collections/${id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || t('notFound.collectionNotFoundError'));
          }

          setCollection(data.data);
        } else {
          // Find in sample collections
          const sampleCollection = sampleCollections.find((c) => c.id === id);

          if (!sampleCollection) {
            throw new Error(t('notFound.collectionNotFoundError'));
          }

          // Convert sample collection to CollectionData format
          const converted: CollectionData = {
            _id: sampleCollection.id,
            name: sampleCollection.name,
            description: sampleCollection.description,
            coverImage: sampleCollection.coverImage,
            category: sampleCollection.category,
            creator: {
              _id: `creator-${sampleCollection.creatorUsername}`,
              email: `${sampleCollection.creatorUsername}@example.com`,
              username: sampleCollection.creatorUsername,
              name: sampleCollection.creatorName,
              avatar: sampleCollection.creatorAvatar,
              role: 'user',
              walletBalance: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            nfts: sampleCollection.items.map((item) => ({
              _id: item.id,
              title: item.title,
              description: item.description,
              mediaUrl: item.mediaUrl,
              mediaType: item.mediaType,
              price: item.price,
              category: item.category,
              tags: item.tags,
              creator: {
                _id: `creator-${item.creatorUsername}`,
                email: `${item.creatorUsername}@example.com`,
                username: item.creatorUsername,
                name: item.creatorName,
                avatar: item.creatorAvatar,
                role: 'user',
                walletBalance: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              owner: {
                _id: `owner-${item.ownerUsername}`,
                email: `${item.ownerUsername}@example.com`,
                username: item.ownerUsername,
                name: item.ownerName,
                avatar: item.ownerAvatar,
                role: 'user',
                walletBalance: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              likes: [],
              views: item.views,
              isListed: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
            floorPrice: sampleCollection.floorPrice,
            totalVolume: sampleCollection.totalVolume,
            totalItems: sampleCollection.totalItems,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setCollection(converted);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('notFound.loadFailedError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [id, t]);

  if (isLoading) {
    return <Loading text={t('loading')} />;
  }

  if (error || !collection) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t('notFound.heading')}</h1>
        <p className="mt-2 text-foreground-muted">{error || t('notFound.genericMessage')}</p>
        <Button onClick={() => router.push('/explore')} className="mt-6">
          {t('notFound.backToExplore')}
        </Button>
      </div>
    );
  }

  const nfts = collection.nfts || [];

  return (
    <div className="py-6 sm:py-8">
      <div className="section-container">
        {/* Back Button */}
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-foreground-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{t('back')}</span>
        </button>

        {/* Collection Header */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Cover Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-1">
            <Image src={collection.coverImage} alt={collection.name} fill className="object-cover" />
          </div>

          {/* Collection Info */}
          <div className="lg:col-span-2">
            <Badge variant="default" className="mb-3">
              {getCategoryLabel(collection.category)}
            </Badge>
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{collection.name}</h1>
            <p className="mt-3 text-foreground-muted">{collection.description}</p>

            {/* Creator */}
            <div className="mt-4 flex items-center gap-3">
              <Avatar
                src={collection.creator.avatar}
                alt={collection.creator.name}
                size="md"
                fallback={collection.creator.name}
              />
              <div>
                <p className="text-sm text-foreground-muted">{t('createdBy')}</p>
                <p className="font-semibold">@{collection.creator.username}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-border bg-background-card p-4">
              <div>
                <p className="text-xs sm:text-sm text-foreground-muted">{t('stats.items')}</p>
                <p className="text-lg sm:text-xl font-bold">{collection.totalItems || nfts.length}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-foreground-muted">{t('stats.floorPrice')}</p>
                <p className="text-lg sm:text-xl font-bold text-accent-primary">{formatETH(collection.floorPrice)}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-foreground-muted">{t('stats.totalVolume')}</p>
                <p className="text-lg sm:text-xl font-bold">{formatETH(collection.totalVolume)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" leftIcon={<Share2 className="h-4 w-4" />}>
                {t('share')}
              </Button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">{t('itemsHeading', { count: nfts.length })}</h2>
            <div className="flex items-center gap-2 text-foreground-muted">
              <Grid className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nfts.map((nft) => (
              <Link key={nft._id} href={`/nft/${nft._id}`}>
                <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={nft.mediaUrl}
                      alt={nft.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-3 text-white">
                        <span className="flex items-center gap-1 text-sm">
                          <Heart className="h-4 w-4" />
                          {Array.isArray(nft.likes) ? nft.likes.length : 0}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4" />
                          {nft.views}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 font-semibold group-hover:text-accent-primary">{nft.title}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-foreground-subtle">{t('price')}</p>
                        <p className="font-bold text-accent-primary">{formatETH(nft.price)}</p>
                      </div>
                      <p className="text-xs text-foreground-muted">{formatEthToUsd(nft.price)}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {nfts.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background-card py-16">
              <Grid className="mb-4 h-12 w-12 text-foreground-subtle" />
              <h3 className="text-lg font-semibold">{t('empty.heading')}</h3>
              <p className="mt-2 text-foreground-muted">{t('empty.message')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
