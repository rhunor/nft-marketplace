'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { resetPasswordSchema } from '@/lib/validations';

type Status = 'verifying' | 'invalid' | 'form' | 'success';

export function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword');
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<Status>('verifying');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => setStatus(data.valid ? 'form' : 'invalid'))
      .catch(() => setStatus('invalid'));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const result = resetPasswordSchema.safeParse({ token, password, confirmPassword });
    if (!result.success) {
      const errors: { password?: string; confirmPassword?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'password') errors.password = err.message;
        if (err.path[0] === 'confirmPassword') errors.confirmPassword = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error?.toLowerCase().includes('expired')) {
          setStatus('invalid');
          return;
        }
        throw new Error(data.error);
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('errors.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'verifying') {
    return (
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
          <p className="mt-4 text-foreground-muted">{t('verifying')}</p>
        </div>
      </Card>
    );
  }

  if (status === 'invalid') {
    return (
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <XCircle className="h-8 w-8 text-error" />
          </div>
          <h1 className="text-2xl font-bold">{t('invalidTokenHeading')}</h1>
          <p className="mt-2 text-foreground-muted">{t('invalidTokenMessage')}</p>
          <Link href="/forgot-password" className="mt-8 inline-block">
            <Button>{t('requestNewLink')}</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">{t('successHeading')}</h1>
          <p className="mt-2 text-foreground-muted">{t('successMessage')}</p>
          <Link href="/login" className="mt-8 inline-block">
            <Button>{t('goToSignIn')}</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t('heading')}</h1>
        <p className="mt-2 text-foreground-muted">{t('subheading')}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-error/50 bg-error/10 p-4 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('newPasswordLabel')}
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={fieldErrors.password}
          placeholder={t('newPasswordPlaceholder')}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-foreground-subtle hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          autoComplete="new-password"
        />

        <Input
          label={t('confirmPasswordLabel')}
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          error={fieldErrors.confirmPassword}
          placeholder={t('confirmPasswordPlaceholder')}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {t('submit')}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-8 flex items-center justify-center gap-2 text-sm text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToSignIn')}
      </Link>
    </Card>
  );
}
