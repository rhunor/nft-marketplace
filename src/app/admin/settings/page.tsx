'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button, Input, Card, Notification } from '@/components/ui';

export default function AdminSettingsPage() {
  const [depositAddress, setDepositAddress] = useState('');
  const [gasFeeAddress, setGasFeeAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.success) {
        setDepositAddress(data.data.depositAddress);
        setGasFeeAddress(data.data.gasFeeAddress);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositAddress, gasFeeAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Save failed');
      }

      setNotification({ type: 'success', title: 'Settings saved successfully' });
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Failed to save settings',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-foreground-muted">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="mt-2 text-foreground-muted">
          Configure global default wallet addresses. Per-user overrides set in User Management take priority over these defaults.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Deposit Address */}
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold">Default Deposit Address</h2>
          <p className="mb-4 text-sm text-foreground-muted">
            The ETH address users send funds to when depositing. Shown on the Fund Account page.
            Users without a personal override will see this address.
          </p>
          <Input
            label="Deposit Address"
            value={depositAddress}
            onChange={(e) => setDepositAddress(e.target.value)}
            placeholder="0x..."
            hint="Must be a valid Ethereum address (0x + 40 hex characters)"
          />
        </Card>

        {/* Gas Fee Address */}
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold">Default Gas Fee Address</h2>
          <p className="mb-4 text-sm text-foreground-muted">
            The ETH address users send the withdrawal fee to. Shown in the withdrawal modal.
            Users without a personal override will see this address.
          </p>
          <Input
            label="Gas Fee Address"
            value={gasFeeAddress}
            onChange={(e) => setGasFeeAddress(e.target.value)}
            placeholder="0x..."
            hint="Must be a valid Ethereum address (0x + 40 hex characters)"
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            variant="ghost"
            onClick={fetchSettings}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset
          </Button>
        </div>
      </div>

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
