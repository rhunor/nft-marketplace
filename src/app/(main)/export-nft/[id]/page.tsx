'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Copy, Check, AlertCircle, ArrowLeft, Download, Clock } from 'lucide-react';
import { Button, Card, Badge, Loading, Notification } from '@/components/ui';
import { formatETH } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import type { NFTWithUser } from '@/types';

const FALLBACK_DEPOSIT_ADDRESS =
  process.env.NEXT_PUBLIC_ETH_ADDRESS || '0x9D5f4DFEFDFc77B8ec36E980BDBE1a2900a4aC20';

const EXPORT_FEE_USD = 100;

function isMongoId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function ExportNFTPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { ethPrice } = useEthPrice();

  const nftId = params.id as string;

  const [nft, setNft] = useState<NFTWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositAddress, setDepositAddress] = useState(FALLBACK_DEPOSIT_ADDRESS);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  // ETH equivalent of $100
  const exportFeeEth = ethPrice > 0 ? EXPORT_FEE_USD / ethPrice : 0;

  const fetchNFT = useCallback(async () => {
    if (!isMongoId(nftId)) {
      setError('This NFT cannot be exported.');
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/nfts/${nftId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch NFT');
      setNft(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load NFT');
    } finally {
      setIsLoading(false);
    }
  }, [nftId]);

  const fetchDepositAddress = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/addresses');
      const data = await res.json();
      if (data.success && data.data?.depositAddress) {
        setDepositAddress(data.data.depositAddress);
      }
    } catch {
      // keep fallback
    }
  }, []);

  useEffect(() => {
    fetchNFT();
    if (session?.user) fetchDepositAddress();
  }, [fetchNFT, fetchDepositAddress, session?.user]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
    } catch {
      const el = document.createElement('textarea');
      el.value = depositAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = () => {
    setPaid(true);
    setNotification({
      type: 'success',
      title: 'Payment Submitted',
      message:
        'Thank you! Your export request has been received. Our team will process it within 24 hours and send the NFT file to your registered email.',
    });
  };

  if (isLoading) return <Loading text="Loading NFT..." />;

  if (error || !nft) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-error" />
        <h1 className="mt-4 text-2xl font-bold">Cannot Export NFT</h1>
        <p className="mt-2 text-foreground-muted">{error ?? 'NFT not found.'}</p>
        <Link href="/explore" className="mt-6 inline-block">
          <Button>Browse NFTs</Button>
        </Link>
      </div>
    );
  }

  const isOwner = session?.user?.id === nft.owner._id;

  if (!isOwner) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-error" />
        <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-foreground-muted">Only the owner of this NFT can export it.</p>
        <Link href={`/nft/${nftId}`} className="mt-6 inline-block">
          <Button>Back to NFT</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="section-container max-w-2xl">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
            <Download className="h-6 w-6 text-accent-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Export NFT</h1>
            <p className="mt-1 text-foreground-muted">
              Export your NFT to your personal wallet
            </p>
          </div>
        </div>

        {/* NFT Preview */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border">
              <Image
                src={nft.thumbnailUrl || nft.mediaUrl}
                alt={nft.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">{nft.title}</h2>
              <p className="text-sm text-foreground-muted">by @{nft.creator.username}</p>
              <Badge variant="primary" className="mt-1">
                {nft.category}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Export Fee */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">Export Fee</h2>
          <div className="rounded-xl bg-background-secondary p-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Amount to send</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent-primary">
                  {exportFeeEth > 0 ? formatETH(exportFeeEth) : 'Loading...'}
                </p>
                <p className="text-sm text-foreground-subtle">≈ ${EXPORT_FEE_USD} USD</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">
            This one-time fee covers the gas costs and processing required to export your NFT
            to an external wallet.
          </p>
        </Card>

        {/* Wallet Address */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">Send Payment To</h2>
          <p className="mb-3 text-sm text-foreground-muted">
            Transfer exactly{' '}
            <strong>
              {exportFeeEth > 0 ? formatETH(exportFeeEth) : '—'}
            </strong>{' '}
            to the Ethereum address below:
          </p>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary p-3">
            <code className="flex-1 break-all font-mono text-sm">{depositAddress}</code>
            <button
              onClick={copyAddress}
              className="rounded-lg p-2 text-foreground-subtle transition-colors hover:bg-background-hover hover:text-foreground"
              title="Copy address"
            >
              {copied ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="mt-1 text-sm text-success">Address copied to clipboard!</p>
          )}

          <Badge variant="warning" className="mt-3 inline-flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Only send ETH on the Ethereum network
          </Badge>
        </Card>

        {/* Processing Info */}
        <Card className="mb-6 border-border bg-background-secondary p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-accent-primary" />
            <div>
              <h3 className="font-semibold">Processing Time</h3>
              <p className="mt-1 text-sm text-foreground-muted">
                After payment is confirmed, your NFT export will be processed within{' '}
                <strong>24 hours</strong>. The exported file will be delivered to your
                registered email address.
              </p>
            </div>
          </div>
        </Card>

        {/* Steps */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">How It Works</h2>
          <ol className="space-y-4">
            {[
              ['Copy the wallet address above', 'Use any Ethereum-compatible wallet to initiate the transfer.'],
              [`Send ${exportFeeEth > 0 ? formatETH(exportFeeEth) : '$100 worth of ETH'}`, 'Make sure to send on the Ethereum mainnet.'],
              ['Click "Paid" below', 'Notify us once payment has been sent.'],
              ['Receive your NFT export', 'We will process and deliver within 24 hours.'],
            ].map(([title, desc], i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-foreground-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {/* Paid Button */}
        {paid ? (
          <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
            <Check className="mx-auto mb-3 h-10 w-10 text-success" />
            <h3 className="font-semibold text-success">Payment Submitted</h3>
            <p className="mt-1 text-sm text-foreground-muted">
              We will process your export request within 24 hours.
            </p>
            <Link href={`/nft/${nftId}`} className="mt-4 inline-block">
              <Button variant="secondary">Back to NFT</Button>
            </Link>
          </div>
        ) : (
          <Button onClick={handlePaid} className="w-full" size="lg">
            Paid
          </Button>
        )}

        <p className="mt-4 text-center text-sm text-foreground-subtle">
          Need help?{' '}
          <Link href="/contact" className="text-accent-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={!!notification}
          onClose={() => setNotification(null)}
          duration={12000}
        />
      )}
    </div>
  );
}
