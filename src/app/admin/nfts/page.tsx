'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRightLeft, Trash2, ExternalLink } from 'lucide-react';
import { Button, Input, Card, Badge, Modal, Select, Notification } from '@/components/ui';
import { formatETH, formatDate, getCategoryLabel } from '@/lib/utils';

interface NFT {
  _id: string;
  title: string;
  mediaUrl: string;
  price: number;
  category: string;
  isListed: boolean;
  creator: { _id: string; username: string; name: string };
  owner: { _id: string; username: string; name: string };
  views: number;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
}

export default function AdminNFTsPage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [newOwnerId, setNewOwnerId] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  const fetchNFTs = async () => {
    try {
      const response = await fetch(`/api/admin/nfts?search=${search}`);
      const data = await response.json();
      if (data.success) {
        setNfts(data.data.nfts);
      }
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users?limit=100');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
    fetchUsers();
  }, [search]);

  const transferOwnership = async () => {
    if (!selectedNFT || !newOwnerId) return;

    try {
      const response = await fetch('/api/admin/nfts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nftId: selectedNFT._id,
          newOwnerId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'Ownership Transferred',
          message: data.message,
        });
        setShowTransferModal(false);
        setSelectedNFT(null);
        setNewOwnerId('');
        fetchNFTs();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Transfer Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const deleteNFT = async (nftId: string) => {
    if (!confirm('Are you sure you want to delete this NFT?')) return;

    try {
      const response = await fetch(`/api/nfts/${nftId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'NFT Deleted',
        });
        fetchNFTs();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const userOptions = users.map((user) => ({
    value: user._id,
    label: `@${user.username} - ${user.name}`,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">NFT Management</h1>
        <p className="mt-2 text-foreground-muted">
          Manage NFTs and transfer ownership
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search NFTs by title..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* NFTs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nfts.map((nft) => (
          <Card key={nft._id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={nft.mediaUrl}
                alt={nft.title}
                fill
                className="object-cover"
              />
              {!nft.isListed && (
                <Badge
                  variant="warning"
                  className="absolute right-2 top-2"
                >
                  Unlisted
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{nft.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-foreground-muted">
                <p>Creator: @{nft.creator?.username || 'unknown'}</p>
                <p>Owner: @{nft.owner?.username || 'unknown'}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-accent-primary">
                  {formatETH(nft.price)}
                </span>
                <Badge variant="default" size="sm">
                  {getCategoryLabel(nft.category)}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-foreground-subtle">
                <span>{nft.views} views</span>
                <span>{formatDate(nft.createdAt)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedNFT(nft);
                    setShowTransferModal(true);
                  }}
                  leftIcon={<ArrowRightLeft className="h-4 w-4" />}
                >
                  Transfer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNFT(nft._id)}
                >
                  <Trash2 className="h-4 w-4 text-error" />
                </Button>
                <a
                  href={`/nft/${nft._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {nfts.length === 0 && !isLoading && (
        <div className="py-12 text-center text-foreground-muted">
          No NFTs found
        </div>
      )}

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setSelectedNFT(null);
          setNewOwnerId('');
        }}
        title="Transfer NFT Ownership"
      >
        {selectedNFT && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-border p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={selectedNFT.mediaUrl}
                  alt={selectedNFT.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedNFT.title}</p>
                <p className="text-sm text-foreground-muted">
                  Current owner: @{selectedNFT.owner?.username || 'unknown'}
                </p>
              </div>
            </div>

            <Select
              label="New Owner"
              value={newOwnerId}
              onChange={(e) => setNewOwnerId(e.target.value)}
              options={userOptions}
              placeholder="Select a user"
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedNFT(null);
                  setNewOwnerId('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={transferOwnership}
                disabled={!newOwnerId}
              >
                Transfer Ownership
              </Button>
            </div>
          </div>
        )}
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
