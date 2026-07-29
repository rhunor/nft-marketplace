'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Copy, Check, Clock, AlertCircle, Wallet, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button, Card, Input, Badge, Notification } from '@/components/ui';
import { formatETH } from '@/lib/utils';
import { useEthPrice } from '@/contexts/EthPriceContext';

const FALLBACK_DEPOSIT_ADDRESS = process.env.NEXT_PUBLIC_ETH_ADDRESS || '0x9D5f4DFEFDFc77B8ec36E980BDBE1a2900a4aC20';

export default function FundPage() {
  const t = useTranslations('fund');
  const { data: session } = useSession();
  const { ethPrice, formatEthToUsd, isLoading: priceLoading, refreshPrice } = useEthPrice();
  const [amount, setAmount] = useState('0.1');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState(FALLBACK_DEPOSIT_ADDRESS);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    title: string;
    message?: string;
  } | null>(null);

  // Fetch the deposit address assigned to this user (falls back to site default)
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch('/api/settings/addresses');
        const data = await response.json();
        if (data.success && data.data?.depositAddress) {
          setDepositAddress(data.data.depositAddress);
        }
      } catch {
        // Keep the fallback address
      }
    };
    if (session?.user) {
      fetchAddress();
    }
  }, [session?.user]);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(depositAddress, {
          width: 200,
          margin: 2,
          color: {
            dark: '#ffffff',
            light: '#00000000',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR Code generation failed:', err);
      }
    };
    generateQR();
  }, [depositAddress]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = depositAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFundRequest = () => {
    setNotification({
      type: 'info',
      title: t('notification.title'),
      message: t('notification.message', { amount }),
    });
  };

  const presetAmounts = ['0.1', '0.5', '1', '2', '5'];

  return (
    <div className="py-8">
      <div className="section-container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('header.title')}</h1>
          <p className="mt-2 text-foreground-muted">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Current Balance */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">{t('balance.label')}</p>
              <p className="mt-1 text-3xl font-bold text-accent-primary">
                {formatETH(session?.user.walletBalance || 0)}
              </p>
              <p className="text-sm text-foreground-subtle">
                ≈ {formatEthToUsd(session?.user.walletBalance || 0)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="rounded-xl bg-accent-primary/20 p-4">
                <Wallet className="h-8 w-8 text-accent-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground-subtle">
                <span>{t('balance.ethRate', { price: ethPrice.toLocaleString() })}</span>
                <button
                  onClick={refreshPrice}
                  className="p-1 hover:text-foreground transition-colors"
                  title={t('balance.refreshTitle')}
                >
                  <RefreshCw className={`h-3 w-3 ${priceLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Amount Selection */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('amount.heading')}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  amount === preset
                    ? 'bg-accent-primary text-white'
                    : 'bg-background-hover text-foreground-muted hover:text-foreground'
                }`}
              >
                {t('amount.preset', { value: preset })}
              </button>
            ))}
          </div>
          <Input
            label={t('amount.customLabel')}
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            hint={`≈ ${formatEthToUsd(parseFloat(amount) || 0)}`}
          />
        </Card>

        {/* Deposit Address */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('deposit.heading')}</h2>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* QR Code */}
            <div className="flex-shrink-0">
              {qrCodeUrl ? (
                <div className="rounded-xl border border-border bg-background-secondary p-4">
                  <img
                    src={qrCodeUrl}
                    alt={t('deposit.qrAlt')}
                    className="h-40 w-40"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-border bg-background-secondary">
                  <span className="text-foreground-subtle">{t('deposit.loading')}</span>
                </div>
              )}
            </div>

            {/* Address and Copy */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="mb-2 text-sm text-foreground-muted">
                  {t('deposit.sendTo')}
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary p-3">
                  <code className="flex-1 break-all font-mono text-sm">
                    {depositAddress}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="rounded-lg p-2 text-foreground-subtle transition-colors hover:bg-background-hover hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-success" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-sm text-success">
                    {t('deposit.copied')}
                  </p>
                )}
              </div>

              <Badge variant="warning" className="inline-flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {t('deposit.networkWarning')}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="mb-6 border-border bg-background-secondary p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-accent-primary" />
            <div>
              <h3 className="font-semibold">{t('notice.heading')}</h3>
              <p className="mt-1 text-sm text-foreground-muted">
                {t.rich('notice.text', { strong: (chunks) => <strong>{chunks}</strong> })}
              </p>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('howItWorks.heading')}</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                1
              </span>
              <div>
                <p className="font-medium">{t('howItWorks.steps.select.title')}</p>
                <p className="text-sm text-foreground-muted">
                  {t('howItWorks.steps.select.text')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                2
              </span>
              <div>
                <p className="font-medium">{t('howItWorks.steps.send.title')}</p>
                <p className="text-sm text-foreground-muted">
                  {t('howItWorks.steps.send.text')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                3
              </span>
              <div>
                <p className="font-medium">{t('howItWorks.steps.confirm.title')}</p>
                <p className="text-sm text-foreground-muted">
                  {t('howItWorks.steps.confirm.text')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                4
              </span>
              <div>
                <p className="font-medium">{t('howItWorks.steps.start.title')}</p>
                <p className="text-sm text-foreground-muted">
                  {t('howItWorks.steps.start.text')}
                </p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Action Button */}
        <Button onClick={handleFundRequest} className="w-full" size="lg">
          {t('action.button', { amount })}
        </Button>

        <p className="mt-4 text-center text-sm text-foreground-subtle">
          {t('action.help')}<Link href="/contact" className="text-accent-primary hover:underline">{t('action.contactSupport')}</Link>
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={!!notification}
          onClose={() => setNotification(null)}
          duration={10000}
        />
      )}
    </div>
  );
}