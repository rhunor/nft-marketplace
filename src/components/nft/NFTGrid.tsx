'use client';

import { NFTCard } from './NFTCard';
import { NFTCardSkeleton } from '@/components/ui';
import type { SampleNFT } from '@/lib/db/seed-data';

interface NFTGridProps {
  nfts: SampleNFT[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
}

export function NFTGrid({
  nfts,
  isLoading = false,
  emptyMessage = 'No NFTs found',
  columns = 3,
}: NFTGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid gap-6 ${columnClasses[columns]}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <NFTCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background-secondary/50 p-8 text-center">
        <p className="text-lg text-foreground-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columnClasses[columns]}`}>
      {nfts.map((nft, index) => (
        <NFTCard key={nft.id} nft={nft} index={index} />
      ))}
    </div>
  );
}
