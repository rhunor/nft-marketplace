'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Image as ImageIcon, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, Loading, Avatar } from '@/components/ui';
import { formatETH, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  totalNFTs: number;
  totalTransactions: number;
}

interface RecentUser {
  _id: string;
  email: string;
  username: string;
  name: string;
  walletBalance: number;
  createdAt: string;
}

interface RecentNFT {
  _id: string;
  title: string;
  price: number;
  creator: { username: string; name: string };
  owner: { username: string; name: string };
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentNFTs, setRecentNFTs] = useState<RecentNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin');
        const data = await response.json();

        if (data.success) {
          setStats(data.data.stats);
          setRecentUsers(data.data.recentUsers);
          setRecentNFTs(data.data.recentNFTs);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/20',
    },
    {
      label: 'Total NFTs',
      value: stats?.totalNFTs || 0,
      icon: ImageIcon,
      color: 'text-success',
      bgColor: 'bg-success/20',
    },
    {
      label: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      label: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/20',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-foreground-muted">
          Overview of your NFT marketplace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground-muted">{stat.label}</p>
                <p className={`mt-1 text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Users */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link
              href="/admin/users"
              className="flex items-center gap-1 text-sm text-accent-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar fallback={user.name} size="sm" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-foreground-muted">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatETH(user.walletBalance)}
                    </p>
                    <p className="text-xs text-foreground-subtle">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-foreground-muted">No users yet</p>
            )}
          </div>
        </Card>

        {/* Recent NFTs */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent NFTs</h2>
            <Link
              href="/admin/nfts"
              className="flex items-center gap-1 text-sm text-accent-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentNFTs.length > 0 ? (
              recentNFTs.map((nft) => (
                <div
                  key={nft._id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{nft.title}</p>
                    <p className="text-sm text-foreground-muted">
                      by @{nft.creator?.username || 'unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent-primary">
                      {formatETH(nft.price)}
                    </p>
                    <p className="text-xs text-foreground-subtle">
                      {formatDate(nft.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-foreground-muted">No NFTs yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
