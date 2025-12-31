'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { loginSchema, type LoginInput } from '@/lib/validations';

export function LoginForm() {
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
      console.log('[Login] Attempting sign in for:', formData.email);
      
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('[Login] Sign in response:', response);

      if (response?.error) {
        console.log('[Login] Sign in error:', response.error);
        setAuthError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (response?.ok) {
        console.log('[Login] Sign in successful, redirecting to:', callbackUrl);
        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push(callbackUrl);
        router.refresh();
      } else {
        console.log('[Login] Sign in not ok:', response);
        setAuthError('Login failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[Login] Sign in exception:', error);
      setAuthError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setAuthError('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-foreground-muted">
          Sign in to continue to Foundation Exclusive
        </p>
      </div>

      {authError && (
        <div className="mb-6 rounded-xl border border-error/50 bg-error/10 p-4 text-sm text-error">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
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
            <span className="text-foreground-muted">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-accent-primary hover:text-accent-secondary"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background-card px-4 text-foreground-subtle">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </Button>

      <p className="mt-8 text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-accent-primary hover:text-accent-secondary"
        >
          Sign up for free
        </Link>
      </p>
    </Card>
  );
}