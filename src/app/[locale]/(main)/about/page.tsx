import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Shield, Users, Gem, Award, ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui';

const valueIcons = [Shield, Gem, Users, Award];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const stats = t.raw('stats') as { value: string; label: string }[];
  const values = t.raw('values.items') as { title: string; description: string }[];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background-secondary py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-2 text-sm text-accent-secondary">
              <Gem className="h-4 w-4" />
              <span>{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.rich('hero.heading', {
                gradient: (chunks) => (
                  <span className="text-gradient">{chunks}</span>
                ),
              })}
            </h1>
            <p className="mt-6 text-lg text-foreground-muted sm:text-xl">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-accent-primary/5 blur-3xl" />
          <div className="absolute -right-1/4 top-1/3 h-1/2 w-1/2 rounded-full bg-accent-secondary/5 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-background-secondary py-12">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-accent-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-foreground-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">{t('story.heading')}</h2>
              <div className="mt-6 space-y-4 text-foreground-muted">
                <p>{t('story.p1')}</p>
                <p>{t('story.p2')}</p>
                <p>{t('story.p3')}</p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80"
                alt={t('story.imageAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-lg font-semibold text-white">
                  {t('story.imageCaption')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-background-secondary py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">{t('values.heading')}</h2>
            <p className="mt-4 text-foreground-muted">{t('values.subtitle')}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = valueIcons[i] ?? Shield;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border bg-background-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                    <Icon className="h-6 w-6 text-accent-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm text-foreground-muted">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t('membership.heading')}
            </h2>
            <p className="mt-4 text-foreground-muted">
              {t('membership.text')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  {t('membership.becomeMember')}
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg">
                  {t('membership.exploreCollections')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-primary to-accent-secondary p-8 sm:p-12">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t('cta.heading')}
              </h2>
              <p className="mt-4 text-lg text-white/80">
                {t('cta.text')}
              </p>
              <div className="mt-8">
                <Link href="/explore">
                  <Button
                    size="lg"
                    className="bg-white text-accent-primary hover:bg-white/90"
                  >
                    {t('cta.viewCollections')}
                  </Button>
                </Link>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
