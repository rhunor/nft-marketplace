'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Play,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { Button, Avatar, Badge, Card, Loading, Modal, Notification } from '@/components/ui';
import { NFTCarousel } from '@/components/nft';
import { sampleNFTs, type SampleNFT } from '@/lib/db/seed-data';
import { formatETH, getCategoryLabel, formatNumber, formatDate } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import type { NFTWithUser } from '@/types';

// Check if ID looks like a MongoDB ObjectId (24 hex characters)
function isMongoId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { formatEthToUsd } = useEthPrice();
  
  // State for database NFT
  const [dbNft, setDbNft] = useState<NFTWithUser | null>(null);
  // State for sample NFT
  const [sampleNft, setSampleNft] = useState<SampleNFT | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
  } | null>(null);

  const nftId = params.id as string;
  const isDbNft = isMongoId(nftId);

  // Fetch NFT data
  const fetchNFT = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isDbNft) {
        // Fetch from database
        const response = await fetch(`/api/nfts/${nftId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch NFT');
        }

        setDbNft(data.data);
        setLikeCount(data.data.likes?.length || 0);

        // Check if current user has liked this NFT
        if (session?.user?.id && data.data.likes) {
          setIsLiked(data.data.likes.includes(session.user.id));
        }
      } else {
        // Find in sample data
        const foundNft = sampleNFTs.find((n) => n.id === nftId);
        if (foundNft) {
          setSampleNft(foundNft);
          setLikeCount(foundNft.likes);
        } else {
          throw new Error('NFT not found');
        }
      }
    } catch (err) {
      console.error('Error fetching NFT:', err);
      setError(err instanceof Error ? err.message : 'Failed to load NFT');
    } finally {
      setIsLoading(false);
    }
  }, [nftId, isDbNft, session?.user?.id]);

  useEffect(() => {
    fetchNFT();
  }, [fetchNFT]);

  const handleLike = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/nft/${nftId}`);
      return;
    }

    if (isDbNft) {
      // Real like functionality for database NFTs
      try {
        const response = await fetch(`/api/nfts/${nftId}/like`, {
          method: 'POST',
        });

        const data = await response.json();

        if (response.ok) {
          setIsLiked(data.data.liked);
          setLikeCount(data.data.likeCount);
          setNotification({
            type: 'success',
            title: data.data.liked ? 'Added to favorites' : 'Removed from favorites',
          });
        }
      } catch {
        setNotification({
          type: 'error',
          title: 'Failed to update like',
        });
      }
    } else {
      // Simulated like for sample NFTs
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setNotification({
        type: 'success',
        title: isLiked ? 'Removed from favorites' : 'Added to favorites',
      });
    }
  };

  const handleBuy = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/nft/${nftId}`);
      return;
    }
    setShowBuyModal(true);
  };

  const confirmPurchase = async () => {
    if (isDbNft && dbNft) {
      // Real purchase for database NFTs
      setIsPurchasing(true);

      try {
        const response = await fetch(`/api/nfts/${nftId}/purchase`, {
          method: 'POST',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to purchase NFT');
        }

        // Update session balance
        if (session?.user) {
          const newBalance = session.user.walletBalance - data.data.transaction.totalCost;
          await updateSession({
            walletBalance: newBalance,
          });
        }

        setShowBuyModal(false);
        setNotification({
          type: 'success',
          title: 'Purchase Successful!',
          message: 'You are now the owner of this NFT.',
        });

        // Refresh NFT data to show updated owner
        await fetchNFT();
      } catch (err) {
        setNotification({
          type: 'error',
          title: 'Purchase Failed',
          message: err instanceof Error ? err.message : 'Something went wrong',
        });
      } finally {
        setIsPurchasing(false);
      }
    } else {
      // Simulated purchase for sample NFTs
      setShowBuyModal(false);
      setNotification({
        type: 'success',
        title: 'Purchase Request Submitted!',
        message: 'Your purchase is being processed. Ownership will be transferred after admin confirmation.',
      });
    }
  };

  const handleShare = async () => {
    const title = isDbNft ? dbNft?.title : sampleNft?.title;
    const description = isDbNft ? dbNft?.description : sampleNft?.description;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
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

  if (error || (!dbNft && !sampleNft)) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-error" />
        <h1 className="mt-4 text-2xl font-bold">NFT Not Found</h1>
        <p className="mt-2 text-foreground-muted">
          {error || "The NFT you're looking for doesn't exist or has been removed."}
        </p>
        <Link href="/explore" className="mt-6 inline-block">
          <Button>Browse NFTs</Button>
        </Link>
      </div>
    );
  }

  // Normalize NFT data for display
  const nft = isDbNft && dbNft
    ? {
        id: dbNft._id,
        title: dbNft.title,
        description: dbNft.description,
        mediaUrl: dbNft.mediaUrl,
        thumbnailUrl: dbNft.thumbnailUrl,
        mediaType: dbNft.mediaType,
        price: dbNft.price,
        category: dbNft.category,
        tags: dbNft.tags,
        creatorName: dbNft.creator.name,
        creatorUsername: dbNft.creator.username,
        creatorAvatar: dbNft.creator.avatar || '',
        creatorId: dbNft.creator._id,
        ownerName: dbNft.owner.name,
        ownerUsername: dbNft.owner.username,
        ownerAvatar: dbNft.owner.avatar || '',
        ownerId: dbNft.owner._id,
        views: dbNft.views,
        isListed: dbNft.isListed,
        createdAt: dbNft.createdAt,
        isFromDatabase: true,
      }
    : sampleNft
    ? {
        id: sampleNft.id,
        title: sampleNft.title,
        description: sampleNft.description,
        mediaUrl: sampleNft.mediaUrl,
        thumbnailUrl: sampleNft.mediaUrl,
        mediaType: sampleNft.mediaType,
        price: sampleNft.price,
        category: sampleNft.category,
        tags: sampleNft.tags,
        creatorName: sampleNft.creatorName,
        creatorUsername: sampleNft.creatorUsername,
        creatorAvatar: sampleNft.creatorAvatar,
        creatorId: null,
        ownerName: sampleNft.ownerName,
        ownerUsername: sampleNft.ownerUsername,
        ownerAvatar: sampleNft.ownerAvatar,
        ownerId: null,
        views: sampleNft.views,
        isListed: true,
        createdAt: null,
        isFromDatabase: false,
      }
    : null;

  if (!nft) {
    return null;
  }

  const isOwner = isDbNft && session?.user?.id === nft.ownerId;
  const isCreator = isDbNft && session?.user?.id === nft.creatorId;
  const canBuy = session?.user && !isOwner && nft.isListed;
  const platformFee = nft.price * 0.025;
  const totalCost = nft.price + platformFee;
  const hasInsufficientBalance = session?.user && session.user.walletBalance < totalCost;

  // Get related NFTs from sample data
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
          {/* Left: Image/Media */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-background-secondary">
                {nft.mediaType === 'video' ? (
                  <video
                    src={nft.mediaUrl}
                    controls
                    poster={nft.thumbnailUrl}
                    className="h-full w-full object-contain"
                  />
                ) : nft.mediaType === 'audio' ? (
                  <div className="flex h-full flex-col items-center justify-center p-8">
                    <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-accent-primary/20">
                      <Volume2 className="h-16 w-16 text-accent-primary" />
                    </div>
                    <audio src={nft.mediaUrl} controls className="w-full" />
                  </div>
                ) : (
                  <Image
                    src={nft.mediaUrl}
                    alt={nft.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}

                {/* Media type indicator */}
                {nft.mediaType !== 'image' && (
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-white backdrop-blur-sm">
                    {nft.mediaType === 'video' && <Play className="h-4 w-4" />}
                    {nft.mediaType === 'audio' && <Volume2 className="h-4 w-4" />}
                    <span className="text-sm capitalize">{nft.mediaType}</span>
                  </div>
                )}
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
                  <span>{formatNumber(likeCount)}</span>
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
            {/* Category Badge & Status */}
            <div className="flex items-center gap-3">
              <Badge variant="primary">{getCategoryLabel(nft.category)}</Badge>
              {!nft.isListed && (
                <Badge variant="default">Not for Sale</Badge>
              )}
              {isOwner && (
                <Badge variant="success">You Own This</Badge>
              )}
              {nft.isFromDatabase && (
                <Badge variant="primary">Marketplace NFT</Badge>
              )}
            </div>

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
                  <p className="font-medium">
                    @{nft.creatorUsername}
                    {isCreator && <span className="ml-1 text-accent-primary">(You)</span>}
                  </p>
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
                  <p className="font-medium">
                    @{nft.ownerUsername}
                    {isOwner && <span className="ml-1 text-accent-primary">(You)</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <Card className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Current Price</p>
                  <p className="mt-1 text-3xl font-bold text-accent-primary">
                    {formatETH(nft.price)}
                  </p>
                  <p className="text-sm text-foreground-subtle">
                    ≈ {formatEthToUsd(nft.price)}
                  </p>
                </div>
                {nft.isListed && !isOwner && (
                  <div className="flex flex-col gap-2">
                    {hasInsufficientBalance && (
                      <p className="text-sm text-error">
                        Insufficient balance
                      </p>
                    )}
                    <Button 
                      onClick={handleBuy} 
                      size="lg" 
                      disabled={!canBuy || !!hasInsufficientBalance}
                    >
                      Buy Now
                    </Button>
                  </div>
                )}
                {isOwner && nft.isListed && nft.isFromDatabase && (
                  <Button variant="secondary" size="lg" onClick={() => router.push(`/nft/${nft.id}/edit`)}>
                    Edit Listing
                  </Button>
                )}
              </div>
            </Card>

            {/* Description */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-wrap text-foreground-muted">{nft.description}</p>
            </div>

            {/* Tags */}
            {nft.tags && nft.tags.length > 0 && (
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
            )}

            {/* Details */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Details</h2>
              <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted">Token ID</span>
                  <span className="font-mono text-sm">{nft.id}</span>
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
                {nft.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Created</span>
                    <span>{formatDate(nft.createdAt)}</span>
                  </div>
                )}
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
        onClose={() => !isPurchasing && setShowBuyModal(false)}
        title="Confirm Purchase"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-border p-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              {nft.mediaType === 'image' ? (
                <Image
                  src={nft.mediaUrl}
                  alt={nft.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-background-hover">
                  {nft.mediaType === 'video' ? (
                    <Play className="h-8 w-8 text-foreground-muted" />
                  ) : (
                    <Volume2 className="h-8 w-8 text-foreground-muted" />
                  )}
                </div>
              )}
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
              <span className="text-foreground-muted">
                {nft.isFromDatabase ? 'Platform Fee (2.5%)' : 'Gas Fee (est.)'}
              </span>
              <span className="font-medium">{formatETH(platformFee)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-accent-primary">
                  {formatETH(totalCost)}
                </span>
              </div>
              <p className="mt-1 text-right text-sm text-foreground-subtle">
                ≈ {formatEthToUsd(totalCost)}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-background-secondary p-4">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Your Balance</span>
              <span className={hasInsufficientBalance ? 'text-error' : 'text-success'}>
                {formatETH(session?.user?.walletBalance || 0)}
              </span>
            </div>
            {hasInsufficientBalance && (
              <p className="mt-2 flex items-center gap-1 text-sm text-error">
                <AlertCircle className="h-4 w-4" />
                Insufficient balance. Please fund your account.
              </p>
            )}
          </div>

          <p className="text-sm text-foreground-muted">
            <Clock className="mr-1 inline h-4 w-4" />
            {nft.isFromDatabase 
              ? 'Ownership will be transferred immediately after confirmation.'
              : 'After purchase, ownership transfer will be processed by our admin team within 24 hours.'}
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowBuyModal(false)}
              disabled={isPurchasing}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={confirmPurchase}
              isLoading={isPurchasing}
              disabled={!!hasInsufficientBalance || isPurchasing}
            >
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