'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  Wallet,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Heart,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Loading } from '@/components/ui';
import { NFTGrid } from '@/components/nft';
import { sampleNFTs } from '@/lib/db/seed-data';
import { formatETH, getCategoryLabel } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import type { NFTWithUser, PaginatedResponse } from '@/types';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { formatEthToUsd } = useEthPrice();
  const [activeTab, setActiveTab] = useState<'owned' | 'created' | 'listed'>('owned');
  const [dbNFTs, setDbNFTs] = useState<NFTWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    owned: 0,
    created: 0,
    listed: 0,
    totalValue: 0,
  });

  // Sample NFTs for the user (simulated ownership)
  const sampleOwnedNFTs = sampleNFTs.slice(0, 3);
  const sampleCreatedNFTs = sampleNFTs.slice(3, 5);

  // Fetch user's real NFTs from database
  const fetchNFTs = useCallback(async (type: string) => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/me/nfts?type=${type}&limit=12`);
      const data = await response.json();
      
      if (data.success) {
        const paginatedData = data.data as PaginatedResponse<NFTWithUser>;
        setDbNFTs(paginatedData.items);
      }
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  // Fetch user profile with stats
  const fetchProfile = useCallback(async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/users/me');
      const data = await response.json();
      
      if (data.success) {
        setStats({
          owned: data.data.stats.owned,
          created: data.data.stats.created,
          listed: data.data.stats.listed,
          totalValue: data.data.stats.totalValue,
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchNFTs(activeTab);
  }, [activeTab, fetchNFTs]);

  if (status === 'loading') {
    return <Loading text="Loading dashboard..." />;
  }

  if (!session) {
    return null; // Middleware will redirect
  }

  // Combine stats: real database stats + sample stats
  const combinedStats = {
    owned: stats.owned + sampleOwnedNFTs.length,
    created: stats.created + sampleCreatedNFTs.length,
    listed: stats.listed,
    totalValue: stats.totalValue + sampleOwnedNFTs.reduce((sum, nft) => sum + nft.price, 0),
  };

  const statCards = [
    {
      label: 'Wallet Balance',
      value: formatETH(session.user.walletBalance),
      subValue: formatEthToUsd(session.user.walletBalance),
      icon: Wallet,
      color: 'text-accent-primary',
    },
    {
      label: 'NFTs Owned',
      value: combinedStats.owned.toString(),
      icon: ImageIcon,
      color: 'text-success',
    },
    {
      label: 'NFTs Created',
      value: combinedStats.created.toString(),
      icon: Upload,
      color: 'text-warning',
    },
    {
      label: 'Total Value',
      value: formatETH(combinedStats.totalValue),
      subValue: formatEthToUsd(combinedStats.totalValue),
      icon: TrendingUp,
      color: 'text-accent-secondary',
    },
  ];

  // Get the sample NFTs to display based on active tab
  const getSampleNFTs = () => {
    if (activeTab === 'owned') {
      return sampleOwnedNFTs;
    } else if (activeTab === 'created') {
      return sampleCreatedNFTs;
    }
    return [];
  };

  const displaySampleNFTs = getSampleNFTs();

  return (
    <div className="py-8">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={session.user.avatar}
              alt={session.user.name}
              size="xl"
              fallback={session.user.name}
            />
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-foreground-muted">@{session.user.username}</p>
              {session.user.role === 'admin' && (
                <Badge variant="primary" className="mt-1">
                  Admin
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/fund">
              <Button variant="secondary" leftIcon={<Wallet className="h-4 w-4" />}>
                Fund Account
              </Button>
            </Link>
            <Link href="/upload">
              <Button leftIcon={<Plus className="h-4 w-4" />}>Create NFT</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-sm text-foreground-subtle">
                      ≈ {stat.subValue}
                    </p>
                  )}
                </div>
                <div
                  className={`rounded-xl bg-background-hover p-3 ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/explore">
            <Card
              hover
              className="flex items-center gap-4 p-6 transition-all hover:border-accent-primary"
            >
              <div className="rounded-xl bg-accent-primary/20 p-3">
                <ImageIcon className="h-6 w-6 text-accent-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Explore Collections</h3>
                <p className="text-sm text-foreground-muted">
                  Discover new collectibles
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-foreground-subtle" />
            </Card>
          </Link>
          <Link href="/upload">
            <Card
              hover
              className="flex items-center gap-4 p-6 transition-all hover:border-accent-primary"
            >
              <div className="rounded-xl bg-success/20 p-3">
                <Upload className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Create NFT</h3>
                <p className="text-sm text-foreground-muted">
                  Upload your artwork
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-foreground-subtle" />
            </Card>
          </Link>
          <Link href="/fund">
            <Card
              hover
              className="flex items-center gap-4 p-6 transition-all hover:border-accent-primary"
            >
              <div className="rounded-xl bg-warning/20 p-3">
                <Wallet className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Fund Account</h3>
                <p className="text-sm text-foreground-muted">
                  Add ETH to your wallet
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-foreground-subtle" />
            </Card>
          </Link>
        </div>

        {/* NFT Tabs */}
        <div className="mb-6 flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab('owned')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'owned'
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            Owned ({combinedStats.owned})
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'created'
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            Created ({combinedStats.created})
          </button>
          <button
            onClick={() => setActiveTab('listed')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'listed'
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            Listed ({stats.listed})
          </button>
        </div>

        {/* Your Uploads Section (from database) */}
        {dbNFTs.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/20">
                <Sparkles className="h-4 w-4 text-accent-primary" />
              </div>
              <h3 className="font-semibold">Your Uploads</h3>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dbNFTs.map((nft) => (
                <Link key={nft._id} href={`/nft/${nft._id}`}>
                  <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={nft.thumbnailUrl || nft.mediaUrl}
                        alt={nft.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      <Badge
                        variant="default"
                        className="absolute left-3 top-3 bg-black/50 text-white"
                      >
                        {getCategoryLabel(nft.category)}
                      </Badge>

                      <Badge
                        variant="primary"
                        className="absolute right-3 top-3"
                      >
                        Your Upload
                      </Badge>

                      {!nft.isListed && (
                        <Badge
                          variant="default"
                          className="absolute left-3 bottom-3 bg-foreground-muted/80 text-white"
                        >
                          Not Listed
                        </Badge>
                      )}

                      <div className="absolute bottom-3 right-3 flex items-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex items-center gap-1 text-sm text-white">
                          <Heart className="h-4 w-4" />
                          {nft.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-white">
                          <Eye className="h-4 w-4" />
                          {nft.views}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-accent-primary">
                        {nft.title}
                      </h3>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-foreground-subtle">Price</p>
                          <p className="text-lg font-bold text-accent-primary">
                            {formatETH(nft.price)}
                          </p>
                          <p className="text-xs text-foreground-subtle">
                            {formatEthToUsd(nft.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sample NFTs Grid (Collection style) */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-border bg-background-card"
              >
                <div className="aspect-square bg-background-hover" />
                <div className="p-4">
                  <div className="h-6 w-3/4 rounded bg-background-hover" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-background-hover" />
                </div>
              </div>
            ))}
          </div>
        ) : displaySampleNFTs.length > 0 ? (
          <>
            {activeTab !== 'listed' && (
              <div className="mb-4">
                <h3 className="font-semibold text-foreground-muted">From Collections</h3>
              </div>
            )}
            <NFTGrid nfts={displaySampleNFTs} columns={3} />
          </>
        ) : dbNFTs.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            {activeTab === 'owned' ? (
              <>
                <ImageIcon className="mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="text-lg font-semibold">No NFTs Owned Yet</h3>
                <p className="mt-2 text-foreground-muted">
                  Start collecting unique digital assets from our marketplace
                </p>
                <Link href="/explore" className="mt-6">
                  <Button>Explore Collections</Button>
                </Link>
              </>
            ) : activeTab === 'created' ? (
              <>
                <Upload className="mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="text-lg font-semibold">No NFTs Created Yet</h3>
                <p className="mt-2 text-foreground-muted">
                  Create your first NFT and share it with the world
                </p>
                <Link href="/upload" className="mt-6">
                  <Button>Create NFT</Button>
                </Link>
              </>
            ) : (
              <>
                <ImageIcon className="mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="text-lg font-semibold">No NFTs Listed</h3>
                <p className="mt-2 text-foreground-muted">
                  You don&apos;t have any NFTs listed for sale
                </p>
              </>
            )}
          </Card>
        ) : null}
      </div>
    </div>
  );
}