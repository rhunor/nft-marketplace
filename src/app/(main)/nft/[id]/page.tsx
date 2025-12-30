'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Heart,
  Eye,
  Share2,
  ExternalLink,
  Tag,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Button, Avatar, Badge, Card, Loading, Modal, Notification } from '@/components/ui';
import { NFTCarousel } from '@/components/nft';
import { sampleNFTs, type SampleNFT } from '@/lib/db/seed-data';
import { formatETH, ethToUSD, getCategoryLabel, formatNumber } from '@/lib/utils';

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [nft, setNft] = useState<SampleNFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    // Find the NFT from sample data
    const foundNFT = sampleNFTs.find((n) => n.id === params.id);
    if (foundNFT) {
      setNft(foundNFT);
    }
    setIsLoading(false);
  }, [params.id]);

  const handleLike = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/nft/${params.id}`);
      return;
    }
    setIsLiked(!isLiked);
    setNotification({
      type: 'success',
      title: isLiked ? 'Removed from favorites' : 'Added to favorites',
    });
  };

  const handleBuy = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/nft/${params.id}`);
      return;
    }
    setShowBuyModal(true);
  };

  const confirmPurchase = () => {
    // Simulate purchase
    setShowBuyModal(false);
    setNotification({
      type: 'success',
      title: 'Purchase Request Submitted!',
      message:
        'Your purchase is being processed. Ownership will be transferred after admin confirmation.',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: nft?.title,
          text: nft?.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setNotification({
        type: 'info',
        title: 'Link copied to clipboard!',
      });
    }
  };

  if (isLoading) {
    return <Loading text="Loading NFT..." />;
  }

  if (!nft) {
    return (
      <div className="section-container py-20 text-center">
        <h1 className="text-2xl font-bold">NFT Not Found</h1>
        <p className="mt-2 text-foreground-muted">
          The NFT you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/explore" className="mt-6 inline-block">
          <Button>Browse NFTs</Button>
        </Link>
      </div>
    );
  }

  const relatedNFTs = sampleNFTs
    .filter((n) => n.category === nft.category && n.id !== nft.id)
    .slice(0, 4);

  return (
    <div className="py-8">
      <div className="section-container">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
                <Image
                  src={nft.mediaUrl}
                  alt={nft.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Quick stats under image */}
              <div className="mt-4 flex items-center justify-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    isLiked
                      ? 'bg-error/20 text-error'
                      : 'bg-background-hover text-foreground-muted hover:text-error'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{formatNumber(nft.likes + (isLiked ? 1 : 0))}</span>
                </button>
                <div className="flex items-center gap-2 rounded-lg bg-background-hover px-4 py-2 text-foreground-muted">
                  <Eye className="h-5 w-5" />
                  <span>{formatNumber(nft.views)}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg bg-background-hover px-4 py-2 text-foreground-muted transition-colors hover:text-foreground"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <Badge variant="primary">{getCategoryLabel(nft.category)}</Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold sm:text-4xl">{nft.title}</h1>

            {/* Creator & Owner */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <Avatar
                  src={nft.creatorAvatar}
                  alt={nft.creatorName}
                  size="md"
                  fallback={nft.creatorName}
                />
                <div>
                  <p className="text-sm text-foreground-muted">Creator</p>
                  <p className="font-medium">@{nft.creatorUsername}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar
                  src={nft.ownerAvatar}
                  alt={nft.ownerName}
                  size="md"
                  fallback={nft.ownerName}
                />
                <div>
                  <p className="text-sm text-foreground-muted">Owner</p>
                  <p className="font-medium">@{nft.ownerUsername}</p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <Card className="p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Current Price</p>
                  <p className="mt-1 text-3xl font-bold text-accent-primary">
                    {formatETH(nft.price)}
                  </p>
                  <p className="text-sm text-foreground-subtle">
                    ≈ {ethToUSD(nft.price)}
                  </p>
                </div>
                <Button onClick={handleBuy} size="lg">
                  Buy Now
                </Button>
              </div>
            </Card>

            {/* Description */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="text-foreground-muted">{nft.description}</p>
            </div>

            {/* Tags */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {nft.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?q=${encodeURIComponent(tag)}`}
                    className="flex items-center gap-1 rounded-full bg-background-hover px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:bg-accent-primary/20 hover:text-accent-secondary"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Details</h2>
              <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted">Token ID</span>
                  <span className="font-mono">{nft.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted">Blockchain</span>
                  <span className="flex items-center gap-1">
                    Ethereum
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted">Media Type</span>
                  <span className="capitalize">{nft.mediaType}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related NFTs */}
        {relatedNFTs.length > 0 && (
          <section className="mt-16">
            <NFTCarousel
              nfts={relatedNFTs}
              title="More from this category"
              subtitle={`Explore more ${getCategoryLabel(nft.category)} NFTs`}
            />
          </section>
        )}
      </div>

      {/* Buy Modal */}
      <Modal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title="Confirm Purchase"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-border p-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image
                src={nft.mediaUrl}
                alt={nft.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{nft.title}</h3>
              <p className="text-sm text-foreground-muted">
                by @{nft.creatorUsername}
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-background-hover p-4">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Price</span>
              <span className="font-medium">{formatETH(nft.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Gas Fee (est.)</span>
              <span className="font-medium">~0.002 ETH</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-accent-primary">
                  {formatETH(nft.price + 0.002)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-foreground-muted">
            <Clock className="mr-1 inline h-4 w-4" />
            After purchase, ownership transfer will be processed by our admin team
            within 24 hours.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowBuyModal(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={confirmPurchase}>
              Confirm Purchase
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={!!notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
