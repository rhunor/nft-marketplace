'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Eye, Play, Volume2 } from 'lucide-react';
import { cn, formatETH, formatNumber, getCategoryLabel } from '@/lib/utils';
import { Avatar, Badge } from '@/components/ui';
import type { SampleNFT } from '@/lib/db/seed-data';

interface NFTCardProps {
  nft: SampleNFT;
  index?: number;
}

export function NFTCard({ nft, index = 0 }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/nft/${nft.id}`}>
        <article className="nft-card group">
          {/* Image Container */}
          <div className="nft-card-image relative">
            {/* Loading shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-background-hover" />
            )}
            
            <Image
              src={nft.mediaUrl}
              alt={nft.title}
              fill
              className={cn(
                'object-cover transition-all duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Media type indicator */}
            {nft.mediaType !== 'image' && (
              <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                {nft.mediaType === 'video' && <Play className="h-4 w-4 text-white" />}
                {nft.mediaType === 'audio' && <Volume2 className="h-4 w-4 text-white" />}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Quick actions on hover */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <button
                onClick={handleLike}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors',
                  isLiked
                    ? 'bg-error text-white'
                    : 'bg-black/60 text-white hover:bg-error'
                )}
              >
                <Heart
                  className={cn('h-4 w-4', isLiked && 'fill-current')}
                />
              </button>
            </div>

            {/* Category badge */}
            <div className="absolute left-3 top-3">
              <Badge variant="primary" size="sm">
                {getCategoryLabel(nft.category)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-accent-primary">
              {nft.title}
            </h3>

            {/* Creator */}
            <div className="mt-3 flex items-center gap-2">
              <Avatar
                src={nft.creatorAvatar}
                alt={nft.creatorName}
                size="xs"
                fallback={nft.creatorName}
              />
              <span className="text-sm text-foreground-muted">
                by <span className="text-foreground">@{nft.creatorUsername}</span>
              </span>
            </div>

            {/* Price and stats */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground-subtle">Current Price</p>
                <p className="text-lg font-bold text-accent-primary">
                  {formatETH(nft.price)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-foreground-subtle">
                <span className="flex items-center gap-1 text-sm">
                  <Heart className="h-3.5 w-3.5" />
                  {formatNumber(nft.likes)}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(nft.views)}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
