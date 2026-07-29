'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('nftDetail.export');
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
      setError(t('cannotExport'));
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/nfts/${nftId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('fetchFailed'));
      setNft(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [nftId, t]);

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
      title: t('notification.title'),
      message: t('notification.message'),
    });
  };

  if (isLoading) return <Loading text={t('loading')} />;

  if (error || !nft) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-error" />
        <h1 className="mt-4 text-2xl font-bold">{t('cannotExportHeading')}</h1>
        <p className="mt-2 text-foreground-muted">{error ?? t('nftNotFound')}</p>
        <Link href="/explore" className="mt-6 inline-block">
          <Button>{t('browseButton')}</Button>
        </Link>
      </div>
    );
  }

  const isOwner = session?.user?.id === nft.owner._id;

  if (!isOwner) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-error" />
        <h1 className="mt-4 text-2xl font-bold">{t('accessDenied.heading')}</h1>
        <p className="mt-2 text-foreground-muted">{t('accessDenied.message')}</p>
        <Link href={`/nft/${nftId}`} className="mt-6 inline-block">
          <Button>{t('accessDenied.backButton')}</Button>
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
          {t('back')}
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
            <Download className="h-6 w-6 text-accent-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('heading')}</h1>
            <p className="mt-1 text-foreground-muted">
              {t('subheading')}
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
              <p className="text-sm text-foreground-muted">{t('by', { username: nft.creator.username })}</p>
              <Badge variant="primary" className="mt-1">
                {nft.category}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Export Fee */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('fee.heading')}</h2>
          <div className="rounded-xl bg-background-secondary p-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">{t('fee.amountLabel')}</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent-primary">
                  {exportFeeEth > 0 ? formatETH(exportFeeEth) : t('fee.loadingAmount')}
                </p>
                <p className="text-sm text-foreground-subtle">{t('fee.approxUsd', { amount: EXPORT_FEE_USD })}</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">
            {t('fee.note')}
          </p>
        </Card>

        {/* Wallet Address */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('payment.heading')}</h2>
          <p className="mb-3 text-sm text-foreground-muted">
            {t('payment.instruction')}{' '}
            <strong>
              {exportFeeEth > 0 ? formatETH(exportFeeEth) : '—'}
            </strong>{' '}
            {t('payment.instructionSuffix')}
          </p>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary p-3">
            <code className="flex-1 break-all font-mono text-sm">{depositAddress}</code>
            <button
              onClick={copyAddress}
              className="rounded-lg p-2 text-foreground-subtle transition-colors hover:bg-background-hover hover:text-foreground"
              title={t('payment.copyAddress')}
            >
              {copied ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="mt-1 text-sm text-success">{t('payment.addressCopied')}</p>
          )}

          <Badge variant="warning" className="mt-3 inline-flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {t('payment.networkWarning')}
          </Badge>
        </Card>

        {/* Processing Info */}
        <Card className="mb-6 border-border bg-background-secondary p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-accent-primary" />
            <div>
              <h3 className="font-semibold">{t('processing.heading')}</h3>
              <p className="mt-1 text-sm text-foreground-muted">
                {t('processing.message', { hours: t('processing.hours') })}
              </p>
            </div>
          </div>
        </Card>

        {/* Steps */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('steps.heading')}</h2>
          <ol className="space-y-4">
            {[
              [t('steps.step1.title'), t('steps.step1.description')],
              [
                t('steps.step2.title', {
                  amount: exportFeeEth > 0 ? formatETH(exportFeeEth) : t('steps.step2.fallbackAmount'),
                }),
                t('steps.step2.description'),
              ],
              [t('steps.step3.title'), t('steps.step3.description')],
              [t('steps.step4.title'), t('steps.step4.description')],
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
            <h3 className="font-semibold text-success">{t('paidConfirmation.heading')}</h3>
            <p className="mt-1 text-sm text-foreground-muted">
              {t('paidConfirmation.message')}
            </p>
            <Link href={`/nft/${nftId}`} className="mt-4 inline-block">
              <Button variant="secondary">{t('paidConfirmation.backButton')}</Button>
            </Link>
          </div>
        ) : (
          <Button onClick={handlePaid} className="w-full" size="lg">
            {t('paidButton')}
          </Button>
        )}

        <p className="mt-4 text-center text-sm text-foreground-subtle">
          {t('helpText')}{' '}
          <Link href="/contact" className="text-accent-primary hover:underline">
            {t('contactSupport')}
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
