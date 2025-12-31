'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Copy, Check, Clock, AlertCircle, Wallet, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { Button, Card, Input, Badge, Notification } from '@/components/ui';
import { formatETH } from '@/lib/utils';
import { useEthPrice } from '@/contexts/EthPriceContext';

const ETH_DEPOSIT_ADDRESS = process.env.NEXT_PUBLIC_ETH_ADDRESS || '0x9D5f4DFEFDFc77B8ec36E980BDBE1a2900a4aC20';

export default function FundPage() {
  const { data: session } = useSession();
  const { ethPrice, formatEthToUsd, isLoading: priceLoading, refreshPrice } = useEthPrice();
  const [amount, setAmount] = useState('0.1');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    title: string;
    message?: string;
  } | null>(null);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(ETH_DEPOSIT_ADDRESS, {
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
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ETH_DEPOSIT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = ETH_DEPOSIT_ADDRESS;
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
      title: 'Payment Instructions',
      message: `Send ${amount} ETH to the address shown. Your balance will be updated within ~10 minutes after confirmation.`,
    });
  };

  const presetAmounts = ['0.1', '0.5', '1', '2', '5'];

  return (
    <div className="py-8">
      <div className="section-container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Fund Account</h1>
          <p className="mt-2 text-foreground-muted">
            Add ETH to your wallet to create and purchase NFTs
          </p>
        </div>

        {/* Current Balance */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Current Balance</p>
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
                <span>1 ETH = ${ethPrice.toLocaleString()}</span>
                <button 
                  onClick={refreshPrice}
                  className="p-1 hover:text-foreground transition-colors"
                  title="Refresh price"
                >
                  <RefreshCw className={`h-3 w-3 ${priceLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Amount Selection */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">Select Amount</h2>
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
                {preset} ETH
              </button>
            ))}
          </div>
          <Input
            label="Custom Amount (ETH)"
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
          <h2 className="mb-4 text-lg font-semibold">Deposit Address</h2>
          
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* QR Code */}
            <div className="flex-shrink-0">
              {qrCodeUrl ? (
                <div className="rounded-xl border border-border bg-background-secondary p-4">
                  <img
                    src={qrCodeUrl}
                    alt="Deposit QR Code"
                    className="h-40 w-40"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-border bg-background-secondary">
                  <span className="text-foreground-subtle">Loading...</span>
                </div>
              )}
            </div>

            {/* Address and Copy */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="mb-2 text-sm text-foreground-muted">
                  Send ETH to this address:
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary p-3">
                  <code className="flex-1 break-all font-mono text-sm">
                    {ETH_DEPOSIT_ADDRESS}
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
                    Address copied to clipboard!
                  </p>
                )}
              </div>

              <Badge variant="warning" className="inline-flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Only send ETH on Ethereum network
              </Badge>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="mb-6 border-border bg-background-secondary p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-accent-primary" />
            <div>
              <h3 className="font-semibold">Processing Time</h3>
              <p className="mt-1 text-sm text-foreground-muted">
                After sending payment, it takes approximately <strong>10 minutes</strong> for 
                your balance to reflect in your account. This allows time for blockchain 
                confirmations and our admin team to verify the transaction.
              </p>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                1
              </span>
              <div>
                <p className="font-medium">Select Amount</p>
                <p className="text-sm text-foreground-muted">
                  Choose how much ETH you want to add to your account
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                2
              </span>
              <div>
                <p className="font-medium">Send Payment</p>
                <p className="text-sm text-foreground-muted">
                  Transfer ETH to the deposit address shown above
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                3
              </span>
              <div>
                <p className="font-medium">Wait for Confirmation</p>
                <p className="text-sm text-foreground-muted">
                  Your balance will be updated within ~10 minutes
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-bold text-white">
                4
              </span>
              <div>
                <p className="font-medium">Start Creating & Collecting</p>
                <p className="text-sm text-foreground-muted">
                  Use your balance to create and purchase NFTs
                </p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Action Button */}
        <Button onClick={handleFundRequest} className="w-full" size="lg">
          I&apos;ve Sent {amount} ETH
        </Button>

        <p className="mt-4 text-center text-sm text-foreground-subtle">
          Need help? <a href="/contact" className="text-accent-primary hover:underline">Contact support</a>
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