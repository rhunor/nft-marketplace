'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { cn } from '@/lib/utils';
import type { SampleNFT } from '@/lib/db/seed-data';

interface NFTCarouselProps {
  nfts: SampleNFT[];
  title?: string;
  subtitle?: string;
}

export function NFTCarousel({ nfts, title, subtitle }: NFTCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6 flex items-end justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-1 text-foreground-muted">{subtitle}</p>
            )}
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all',
                canScrollLeft
                  ? 'hover:border-accent-primary hover:text-accent-primary'
                  : 'cursor-not-allowed opacity-50'
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all',
                canScrollRight
                  ? 'hover:border-accent-primary hover:text-accent-primary'
                  : 'cursor-not-allowed opacity-50'
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Carousel */}
      <div className="relative -mx-4 px-4">
        <motion.div
          ref={scrollRef}
          onScroll={checkScroll}
          className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4"
        >
          {nfts.map((nft, index) => (
            <div key={nft.id} className="w-[300px] flex-shrink-0 sm:w-[340px]">
              <NFTCard nft={nft} index={index} />
            </div>
          ))}
        </motion.div>

        {/* Gradient overlays */}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent transition-opacity',
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent transition-opacity',
            canScrollRight ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
    </div>
  );
}
