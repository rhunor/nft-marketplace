//src/app/(main)/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Wallet,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Loading } from '@/components/ui';
import { NFTGrid } from '@/components/nft';
import { formatETH, ethToUSD } from '@/lib/utils';
import { sampleNFTs } from '@/lib/db/seed-data';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'owned' | 'created'>('owned');

  if (status === 'loading') {
    return <Loading text="Loading dashboard..." />;
  }

  if (!session) {
    return null; // Middleware will redirect
  }

  // Simulate user's NFTs (in real app, fetch from API)
  const userNFTs = sampleNFTs.slice(0, 3);
  const createdNFTs = sampleNFTs.slice(3, 5);

  const stats = [
    {
      label: 'Wallet Balance',
      value: formatETH(session.user.walletBalance),
      subValue: ethToUSD(session.user.walletBalance),
      icon: Wallet,
      color: 'text-accent-primary',
    },
    {
      label: 'NFTs Owned',
      value: userNFTs.length.toString(),
      icon: ImageIcon,
      color: 'text-success',
    },
    {
      label: 'NFTs Created',
      value: createdNFTs.length.toString(),
      icon: Upload,
      color: 'text-warning',
    },
    {
      label: 'Total Value',
      value: formatETH(userNFTs.reduce((sum, nft) => sum + nft.price, 0)),
      icon: TrendingUp,
      color: 'text-accent-secondary',
    },
  ];

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
          {stats.map((stat) => (
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
                <h3 className="font-semibold">Explore NFTs</h3>
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
            Owned ({userNFTs.length})
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'created'
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            Created ({createdNFTs.length})
          </button>
        </div>

        {/* NFT Grid */}
        {activeTab === 'owned' ? (
          userNFTs.length > 0 ? (
            <NFTGrid nfts={userNFTs} columns={3} />
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <ImageIcon className="mb-4 h-12 w-12 text-foreground-subtle" />
              <h3 className="text-lg font-semibold">No NFTs Owned Yet</h3>
              <p className="mt-2 text-foreground-muted">
                Start collecting unique digital assets from our marketplace
              </p>
              <Link href="/explore" className="mt-6">
                <Button>Explore NFTs</Button>
              </Link>
            </Card>
          )
        ) : createdNFTs.length > 0 ? (
          <NFTGrid nfts={createdNFTs} columns={3} />
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Upload className="mb-4 h-12 w-12 text-foreground-subtle" />
            <h3 className="text-lg font-semibold">No NFTs Created Yet</h3>
            <p className="mt-2 text-foreground-muted">
              Create your first NFT and share it with the world
            </p>
            <Link href="/upload" className="mt-6">
              <Button>Create NFT</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
