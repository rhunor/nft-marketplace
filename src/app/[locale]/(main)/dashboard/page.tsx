'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Wallet,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Heart,
  Eye,
  ArrowDownToLine,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  Loader2,
  Lock,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { Button, Card, Badge, Loading, Modal, Input, Notification } from '@/components/ui';
import { formatETH, getCategoryLabel, safeFetch } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import { changePasswordSchema } from '@/lib/validations';
import type { NFTWithUser, PaginatedResponse } from '@/types';

const WITHDRAWAL_FEE_PERCENT = 10;
const FALLBACK_FEE_WALLET = '0x64d21986178f6Ab43A755378194DF3C8E4eed613';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: session, status, update: updateSession } = useSession();
  const { formatEthToUsd, ethPrice } = useEthPrice();
  const [activeTab, setActiveTab] = useState<'owned' | 'created' | 'listed'>('owned');
  const [dbNFTs, setDbNFTs] = useState<NFTWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    owned: 0,
    created: 0,
    listed: 0,
    totalValue: 0,
  });
  const [minWithdrawalUsd, setMinWithdrawalUsd] = useState(5000);

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'form' | 'fee' | 'processing' | 'success'>('form');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawResult, setWithdrawResult] = useState<{
    transactionId: string;
    netAmount: number;
    feeAmount: number;
    newBalance: number;
  } | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);
  
  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  // Fee payment wallet address — fetched per-user with fallback to site default
  const [feeWalletAddress, setFeeWalletAddress] = useState(FALLBACK_FEE_WALLET);

  // Change password modal state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<{
    currentPassword?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', title: t('avatar.invalidType') });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({ type: 'error', title: t('avatar.tooLarge') });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/users/me/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await safeFetch(response);

      if (!result.ok) {
        throw new Error(result.error);
      }

      const data = result.data as { data: { avatar: string } };
      // Update session with new avatar
      await updateSession({ avatar: data.data.avatar });
      setNotification({ type: 'success', title: t('avatar.uploadSuccess') });
    } catch (err) {
      setNotification({
        type: 'error',
        title: t('avatar.uploadFailedTitle'),
        message: err instanceof Error ? err.message : t('avatar.uploadFailedDefault')
      });
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Fetch user's real NFTs from database
  const fetchNFTs = useCallback(async (type: string) => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/me/nfts?type=${type}&limit=12&_t=${Date.now()}`, {
        cache: 'no-store',
      });
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
      const response = await fetch(`/api/users/me?_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      
      if (data.success) {
        setStats({
          owned: data.data.stats.owned,
          created: data.data.stats.created,
          listed: data.data.stats.listed,
          totalValue: data.data.stats.totalValue,
        });
        setMinWithdrawalUsd(data.data.user.minWithdrawalUsd ?? 5000);
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

  // Fetch fee wallet address assigned to this user (falls back to site default)
  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/settings/addresses')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.gasFeeAddress) {
          setFeeWalletAddress(data.data.gasFeeAddress);
        }
      })
      .catch(() => {/* keep fallback */});
  }, [session?.user]);

  // Withdraw functions
  const resetWithdrawModal = () => {
    setWithdrawStep('form');
    setWalletAddress('');
    setWithdrawAmount('');
    setWithdrawError('');
    setWithdrawResult(null);
  };

  const openWithdrawModal = () => {
    resetWithdrawModal();
    setShowWithdrawModal(true);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    resetWithdrawModal();
  };

  const calculateWithdrawDetails = () => {
    const amount = parseFloat(withdrawAmount) || 0;
    const fee = amount * (WITHDRAWAL_FEE_PERCENT / 100);
    // User receives full withdrawal amount, fee is paid separately to fee wallet
    return { amount, fee, amountToReceive: amount };
  };

  const validateWithdraw = (): boolean => {
    setWithdrawError('');

    // Validate wallet address
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setWithdrawError(t('withdrawModal.errors.invalidAddress'));
      return false;
    }

    // Validate amount
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError(t('withdrawModal.errors.invalidAmount'));
      return false;
    }

    if (amount * ethPrice < minWithdrawalUsd) {
      setWithdrawError(t('withdrawModal.errors.minWithdrawal', { minAmount: minWithdrawalUsd.toLocaleString() }));
      return false;
    }

    // Check balance
    if (amount > (session?.user?.walletBalance || 0)) {
      setWithdrawError(t('withdrawModal.errors.insufficientBalance'));
      return false;
    }

    return true;
  };

  const handleWithdrawSubmit = () => {
    if (validateWithdraw()) {
      setWithdrawStep('fee');
    }
  };

  const processWithdrawal = async () => {
    setWithdrawStep('processing');
    setWithdrawError('');

    try {
      const response = await fetch('/api/users/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          amount: parseFloat(withdrawAmount),
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(t('withdrawModal.errors.serverError'));
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('withdrawModal.errors.withdrawalFailed'));
      }

      if (!data.success || !data.data) {
        throw new Error(t('withdrawModal.errors.invalidResponse'));
      }

      // Update session with new balance
      await updateSession({
        walletBalance: data.data.newBalance,
      });

      setWithdrawResult({
        transactionId: data.data.transactionId,
        netAmount: data.data.amountToReceive || data.data.withdrawAmount,
        feeAmount: data.data.feeAmount,
        newBalance: data.data.newBalance,
      });

      setWithdrawStep('success');
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawError(error instanceof Error ? error.message : t('withdrawModal.errors.withdrawalFailedRetry'));
      setWithdrawStep('fee');
    }
  };

  // Change password functions
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordFieldErrors({});
    setPasswordError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordFieldErrors({});

    const result = changePasswordSchema.safeParse({
      currentPassword,
      password: newPassword,
      confirmPassword: confirmNewPassword,
    });

    if (!result.success) {
      const errors: typeof passwordFieldErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0];
        if (key === 'currentPassword') errors.currentPassword = err.message;
        if (key === 'password') errors.password = err.message;
        if (key === 'confirmPassword') errors.confirmPassword = err.message;
      });
      setPasswordFieldErrors(errors);
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('security.changePassword.errors.somethingWentWrong'));
      }

      closeChangePasswordModal();
      setNotification({
        type: 'success',
        title: t('security.changePassword.successTitle'),
        message: t('security.changePassword.successMessage'),
      });
    } catch (err) {
      setPasswordError(
        err instanceof Error && err.message
          ? err.message
          : t('security.changePassword.errors.somethingWentWrong')
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (status === 'loading') {
    return <Loading text={t('loading')} />;
  }

  if (!session) {
    return null; // Middleware will redirect
  }

  const statCards = [
    {
      label: t('stats.walletBalance'),
      value: formatETH(session.user.walletBalance),
      subValue: formatEthToUsd(session.user.walletBalance),
      icon: Wallet,
      color: 'text-accent-primary',
    },
    {
      label: t('stats.nftsOwned'),
      value: stats.owned.toString(),
      icon: ImageIcon,
      color: 'text-success',
    },
    {
      label: t('stats.nftsCreated'),
      value: stats.created.toString(),
      icon: Upload,
      color: 'text-warning',
    },
    {
      label: t('stats.totalValue'),
      value: formatETH(stats.totalValue),
      subValue: formatEthToUsd(stats.totalValue),
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
            {/* Editable Avatar */}
            <div className="relative">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-4 border-border bg-background-secondary">
                {(avatarPreview || session.user.avatar) ? (
                  <Image
                    src={avatarPreview || session.user.avatar || ''}
                    alt={session.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-primary to-accent-secondary text-xl font-bold text-white">
                    {session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                )}
                
                {/* Loading overlay */}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* Camera button */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary text-white shadow-lg hover:bg-accent-secondary disabled:opacity-50 transition-colors"
                title={t('avatar.changePicture')}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              
              {/* Hidden file input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {t('welcome', { name: session.user.name })}
              </h1>
              <p className="text-foreground-muted">@{session.user.username}</p>
              {session.user.role === 'admin' && (
                <Badge variant="primary" className="mt-1">
                  {t('adminBadge')}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/fund">
              <Button variant="secondary" leftIcon={<Wallet className="h-4 w-4" />}>
                {t('fundAccount')}
              </Button>
            </Link>
            <Link href="/upload">
              <Button leftIcon={<Plus className="h-4 w-4" />}>{t('createNft')}</Button>
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
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/explore">
            <Card
              hover
              className="flex items-center gap-4 p-6 transition-all hover:border-accent-primary"
            >
              <div className="rounded-xl bg-accent-primary/20 p-3">
                <ImageIcon className="h-6 w-6 text-accent-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t('quickActions.explore.title')}</h3>
                <p className="text-sm text-foreground-muted">
                  {t('quickActions.explore.subtitle')}
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
                <h3 className="font-semibold">{t('quickActions.create.title')}</h3>
                <p className="text-sm text-foreground-muted">
                  {t('quickActions.create.subtitle')}
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
                <h3 className="font-semibold">{t('quickActions.fund.title')}</h3>
                <p className="text-sm text-foreground-muted">
                  {t('quickActions.fund.subtitle')}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-foreground-subtle" />
            </Card>
          </Link>
          <Card
            hover
            className="flex cursor-pointer items-center gap-4 p-6 transition-all hover:border-accent-primary"
            onClick={openWithdrawModal}
          >
            <div className="rounded-xl bg-error/20 p-3">
              <ArrowDownToLine className="h-6 w-6 text-error" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('quickActions.withdraw.title')}</h3>
              <p className="text-sm text-foreground-muted">
                {t('quickActions.withdraw.subtitle')}
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-foreground-subtle" />
          </Card>
        </div>

        {/* Security */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{t('security.title')}</h2>
          <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-accent-primary/20 p-3">
                <ShieldCheck className="h-6 w-6 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('security.changePassword.title')}</h3>
                <p className="text-sm text-foreground-muted">
                  {t('security.changePassword.description')}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setShowChangePasswordModal(true)}
            >
              {t('security.changePassword.button')}
            </Button>
          </Card>
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
            {t('tabs.owned', { count: stats.owned })}
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'created'
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            {t('tabs.created', { count: stats.created })}
          </button>
          <button
            onClick={() => setActiveTab('listed')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'listed'
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            {t('tabs.listed', { count: stats.listed })}
          </button>
        </div>

        {/* NFTs Display */}
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
        ) : dbNFTs.length > 0 ? (
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

                    {activeTab === 'created' && (
                      <Badge
                        variant="primary"
                        className="absolute right-3 top-3"
                      >
                        {t('nftCard.created')}
                      </Badge>
                    )}

                    {!nft.isListed && (
                      <Badge
                        variant="default"
                        className="absolute left-3 bottom-3 bg-foreground-muted/80 text-white"
                      >
                        {t('nftCard.notListed')}
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
                        <p className="text-xs text-foreground-subtle">{t('nftCard.price')}</p>
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
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            {activeTab === 'owned' ? (
              <>
                <ImageIcon className="mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="text-lg font-semibold">{t('emptyState.owned.title')}</h3>
                <p className="mt-2 text-foreground-muted">
                  {t('emptyState.owned.text')}
                </p>
                <Link href="/explore" className="mt-6">
                  <Button>{t('emptyState.owned.button')}</Button>
                </Link>
              </>
            ) : activeTab === 'created' ? (
              <>
                <Upload className="mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="text-lg font-semibold">{t('emptyState.created.title')}</h3>
                <p className="mt-2 text-foreground-muted">
                  {t('emptyState.created.text')}
                </p>
                <Link href="/upload" className="mt-6">
                  <Button>{t('emptyState.created.button')}</Button>
                </Link>
              </>
            ) : (
              <>
                <ImageIcon className="mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="text-lg font-semibold">{t('emptyState.listed.title')}</h3>
                <p className="mt-2 text-foreground-muted">
                  {t('emptyState.listed.text')}
                </p>
              </>
            )}
          </Card>
        )}
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={closeWithdrawModal}
        title={
          withdrawStep === 'success'
            ? t('withdrawModal.title.success')
            : withdrawStep === 'processing'
            ? t('withdrawModal.title.processing')
            : withdrawStep === 'fee'
            ? t('withdrawModal.title.fee')
            : t('withdrawModal.title.default')
        }
      >
        {withdrawStep === 'form' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Balance Display */}
            <div className="rounded-xl border border-border bg-background-secondary p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-foreground-muted">{t('withdrawModal.form.availableBalance')}</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-accent-primary">
                {formatETH(session?.user?.walletBalance || 0)}
              </p>
              <p className="text-xs sm:text-sm text-foreground-subtle">
                ≈ {formatEthToUsd(session?.user?.walletBalance || 0)}
              </p>
            </div>

            {/* Wallet Address Input */}
            <Input
              label={t('withdrawModal.form.walletAddressLabel')}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder={t('withdrawModal.form.walletAddressPlaceholder')}
              hint={t('withdrawModal.form.walletAddressHint')}
            />

            {/* Amount Input */}
            <div>
              <Input
                label={t('withdrawModal.form.amountLabel')}
                type="number"
                step="any"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={t('withdrawModal.form.amountPlaceholder')}
                hint={t('withdrawModal.form.amountHint', { minAmount: minWithdrawalUsd.toLocaleString() })}
              />
              <button
                type="button"
                className="mt-2 text-xs sm:text-sm text-accent-primary hover:underline"
                onClick={() => setWithdrawAmount(String(session?.user?.walletBalance || 0))}
              >
                {t('withdrawModal.form.withdrawMax')}
              </button>
            </div>

            {/* Error */}
            {withdrawError && (
              <p className="text-xs sm:text-sm text-error">{withdrawError}</p>
            )}

            {/* Submit Button */}
            <Button
              className="w-full"
              onClick={handleWithdrawSubmit}
              disabled={!walletAddress || !withdrawAmount}
            >
              {t('withdrawModal.form.continue')}
            </Button>
          </div>
        )}

        {withdrawStep === 'fee' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Fee Notice */}
            <div className="flex gap-2 sm:gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3 sm:p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-warning">{t('withdrawModal.fee.noticeTitle')}</p>
                <p className="mt-1 text-foreground-muted">
                  {t('withdrawModal.fee.noticeText', {
                    percent: WITHDRAWAL_FEE_PERCENT,
                    amount: formatETH(calculateWithdrawDetails().fee),
                  })}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-background-secondary p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-foreground-muted">{t('withdrawModal.fee.walletLabel')}</p>
                <p className="mt-1 font-mono text-xs sm:text-sm break-all">{walletAddress}</p>
              </div>
              <div className="border-t border-border pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">{t('withdrawModal.fee.withdrawalAmount')}</span>
                  <span className="font-medium">{formatETH(parseFloat(withdrawAmount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">{t('withdrawModal.fee.feeToSend', { percent: WITHDRAWAL_FEE_PERCENT })}</span>
                  <span className="text-warning font-medium">{formatETH(calculateWithdrawDetails().fee)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold border-t border-border pt-2 mt-2">
                  <span>{t('withdrawModal.fee.youllReceive')}</span>
                  <span className="text-success">{formatETH(calculateWithdrawDetails().amountToReceive)}</span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="rounded-xl border border-border bg-background-hover p-4 sm:p-6">
              <p className="text-sm font-medium text-center mb-2">{t('withdrawModal.fee.sendFeeTo')}</p>
              <p className="text-xs text-foreground-muted text-center mb-4">
                {t('withdrawModal.fee.sendExactly', { amount: formatETH(calculateWithdrawDetails().fee) })}
              </p>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-xl">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${feeWalletAddress}`}
                    alt={t('withdrawModal.fee.qrAlt')}
                    width={180}
                    height={180}
                    className="rounded"
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="bg-background-secondary rounded-lg p-3">
                <p className="text-xs text-foreground-muted text-center mb-1">{t('withdrawModal.fee.walletAddressLabel')}</p>
                <p className="font-mono text-xs sm:text-sm break-all text-center select-all">
                  {feeWalletAddress}
                </p>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                className="mt-3 w-full text-sm text-accent-primary hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText(feeWalletAddress);
                  setNotification({
                    type: 'info',
                    title: t('withdrawModal.fee.copiedNotification'),
                  });
                }}
              >
                {t('withdrawModal.fee.copyAddress')}
              </button>
            </div>

            {/* Warning */}
            <div className="flex gap-2 sm:gap-3 rounded-xl border border-border bg-background-hover p-3 sm:p-4">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-foreground-muted" />
              <p className="text-xs sm:text-sm text-foreground-muted">
                {t('withdrawModal.fee.warning', {
                  feeAmount: formatETH(calculateWithdrawDetails().fee),
                  receiveAmount: formatETH(calculateWithdrawDetails().amountToReceive),
                })}
              </p>
            </div>

            {/* Error */}
            {withdrawError && (
              <p className="text-xs sm:text-sm text-error">{withdrawError}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="secondary"
                className="w-full sm:flex-1"
                onClick={() => setWithdrawStep('form')}
              >
                {t('withdrawModal.fee.back')}
              </Button>
              <Button
                className="w-full sm:flex-1"
                onClick={processWithdrawal}
              >
                {t('withdrawModal.fee.confirmPayment')}
              </Button>
            </div>
          </div>
        )}

        {withdrawStep === 'processing' && (
          <div className="py-6 sm:py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
            <h3 className="text-base sm:text-lg font-semibold">{t('withdrawModal.processing.title')}</h3>
            <p className="mt-2 text-sm text-foreground-muted">
              {t('withdrawModal.processing.text')}
            </p>
          </div>
        )}

        {withdrawStep === 'success' && withdrawResult && (
          <div className="space-y-4 sm:space-y-6">
            {/* Success Icon */}
            <div className="text-center">
              <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-success/20">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold">{t('withdrawModal.success.title')}</h3>
              <p className="mt-1 sm:mt-2 text-sm text-foreground-muted">
                {t('withdrawModal.success.subtitle')}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="rounded-xl border border-border bg-background-secondary p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-foreground-muted">{t('withdrawModal.success.transactionId')}</span>
                <span className="font-mono text-xs truncate ml-2 max-w-[120px] sm:max-w-none">{withdrawResult.transactionId}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-foreground-muted">{t('withdrawModal.success.amountReceived')}</span>
                <span className="font-medium text-success">
                  {formatETH(withdrawResult.netAmount)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-foreground-muted">{t('withdrawModal.success.feePaid')}</span>
                <span>{formatETH(withdrawResult.feeAmount)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-foreground-muted">{t('withdrawModal.success.newBalance')}</span>
                <span className="font-medium">{formatETH(withdrawResult.newBalance)}</span>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border bg-background-hover p-3 sm:p-4">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-foreground-muted" />
              <div>
                <p className="text-sm font-medium">{t('withdrawModal.success.estimatedTime')}</p>
                <p className="text-xs sm:text-sm text-foreground-muted">{t('withdrawModal.success.estimatedTimeValue')}</p>
              </div>
            </div>

            {/* Close Button */}
            <Button className="w-full" onClick={closeWithdrawModal}>
              {t('withdrawModal.success.done')}
            </Button>
          </div>
        )}
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={closeChangePasswordModal}
        title={t('security.changePassword.modalTitle')}
      >
        <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5">
          <Input
            label={t('security.changePassword.currentPasswordLabel')}
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setPasswordFieldErrors((prev) => ({ ...prev, currentPassword: '' }));
            }}
            error={passwordFieldErrors.currentPassword}
            placeholder={t('security.changePassword.currentPasswordPlaceholder')}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-foreground-subtle hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            autoComplete="current-password"
          />

          <Input
            label={t('security.changePassword.newPasswordLabel')}
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordFieldErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={passwordFieldErrors.password}
            placeholder={t('security.changePassword.newPasswordPlaceholder')}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-foreground-subtle hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            autoComplete="new-password"
          />

          <Input
            label={t('security.changePassword.confirmPasswordLabel')}
            type={showNewPassword ? 'text' : 'password'}
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              setPasswordFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={passwordFieldErrors.confirmPassword}
            placeholder={t('security.changePassword.confirmPasswordPlaceholder')}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
          />

          {passwordError && (
            <p className="text-xs sm:text-sm text-error">{passwordError}</p>
          )}

          <Button type="submit" className="w-full" isLoading={isChangingPassword}>
            {t('security.changePassword.submit')}
          </Button>
        </form>
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