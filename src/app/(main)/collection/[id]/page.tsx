'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Eye } from 'lucide-react';
import { Button, Avatar, Badge, Card } from '@/components/ui';
import { getCollectionById } from '@/lib/db/seed-data';
import { formatETH, formatNumber } from '@/lib/utils';

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as string;
  const collection = getCollectionById(collectionId);

  if (!collection) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Collection Not Found</h1>
          <p className="mt-2 text-foreground-muted">
            The collection you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/explore">
            <Button className="mt-4">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section with Cover Image */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="section-container -mt-20 relative z-10">
        {/* Back Button */}
        <Link href="/explore">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="mb-6"
          >
            Back to Explore
          </Button>
        </Link>

        {/* Collection Info */}
        <div className="rounded-2xl border border-border bg-background-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <Badge variant="primary" className="mb-4">
                {collection.totalItems} Items
              </Badge>
              <h1 className="text-3xl font-bold sm:text-4xl">{collection.name}</h1>
              <p className="mt-4 max-w-2xl text-foreground-muted">
                {collection.description}
              </p>

              {/* Creator */}
              <div className="mt-6 flex items-center gap-3">
                <Avatar
                  src={collection.creatorAvatar}
                  alt={collection.creatorName}
                  fallback={collection.creatorName}
                  size="md"
                />
                <div>
                  <p className="text-sm text-foreground-muted">Created by</p>
                  <p className="font-medium">@{collection.creatorUsername}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-primary">
                  {formatETH(collection.floorPrice)}
                </p>
                <p className="text-sm text-foreground-muted">Floor Price</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatETH(collection.totalVolume)}
                </p>
                <p className="text-sm text-foreground-muted">Total Volume</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{collection.totalItems}</p>
                <p className="text-sm text-foreground-muted">Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFTs in Collection */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Items in Collection</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collection.items.map((nft) => (
              <Card key={nft.id} className="group overflow-hidden">
                <Link href={`/nft/${nft.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={nft.mediaUrl}
                      alt={nft.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    {/* Stats overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-3 text-white">
                        <span className="flex items-center gap-1 text-sm">
                          <Heart className="h-4 w-4" />
                          {formatNumber(nft.likes)}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4" />
                          {formatNumber(nft.views)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/nft/${nft.id}`}>
                    <h3 className="font-semibold transition-colors hover:text-accent-primary line-clamp-1">
                      {nft.title}
                    </h3>
                  </Link>
                  
                  <p className="mt-1 text-sm text-foreground-muted line-clamp-2">
                    {nft.description}
                  </p>

                  {/* Owner */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={nft.ownerAvatar}
                        alt={nft.ownerName}
                        fallback={nft.ownerName}
                        size="xs"
                      />
                      <span className="text-xs text-foreground-muted">
                        Owned by @{nft.ownerUsername}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-foreground-muted">Price</p>
                      <p className="font-bold text-accent-primary">
                        {formatETH(nft.price)}
                      </p>
                    </div>
                    <Link href={`/nft/${nft.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}