'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ImageOff } from 'lucide-react';

interface NFTImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function NFTImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className = '',
  priority = false,
}: NFTImageProps) {
  const t = useTranslations('common.nftImage');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-background-secondary ${className}`}>
        <div className="flex flex-col items-center text-foreground-muted">
          <ImageOff className="h-8 w-8 mb-2" />
          <span className="text-xs">{t('unavailable')}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse bg-background-secondary ${className}`} />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        priority={priority}
        unoptimized={src.includes('unsplash.com')} // Skip optimization for external images
      />
    </>
  );
}