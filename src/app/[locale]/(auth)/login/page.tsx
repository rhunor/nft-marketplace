import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/auth';
import { Loading } from '@/components/ui';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.login' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
