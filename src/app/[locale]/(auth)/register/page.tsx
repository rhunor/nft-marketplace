import { getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/components/auth';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
