'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { loginSchema, type LoginInput } from '@/lib/validations';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    // Validate form
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<LoginInput> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (response?.error) {
        setAuthError(t('errors.invalidCredentials'));
        setIsLoading(false);
        return;
      }

      if (response?.ok) {
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push(callbackUrl);
        router.refresh();
      } else {
        setAuthError(t('errors.loginFailed'));
        setIsLoading(false);
      }
    } catch {
      setAuthError(t('errors.somethingWentWrong'));
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t('heading')}</h1>
        <p className="mt-2 text-foreground-muted">{t('subheading')}</p>
      </div>

      {authError && (
        <div className="mb-6 rounded-xl border border-error/50 bg-error/10 p-4 text-sm text-error">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('emailLabel')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={t('emailPlaceholder')}
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />

        <Input
          label={t('passwordLabel')}
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder={t('passwordPlaceholder')}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-foreground-subtle hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-background-secondary text-accent-primary focus:ring-accent-primary"
            />
            <span className="text-foreground-muted">{t('rememberMe')}</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-accent-primary hover:text-accent-secondary"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {t('submit')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground-muted">
        {t('noAccount')}{' '}
        <Link
          href="/register"
          className="font-medium text-accent-primary hover:text-accent-secondary"
        >
          {t('signUpLink')}
        </Link>
      </p>
    </Card>
  );
}