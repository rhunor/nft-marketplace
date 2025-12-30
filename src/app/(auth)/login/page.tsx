import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth';
import { Loading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your NFTMarket account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
