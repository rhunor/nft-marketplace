import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal.privacy');

  const s2PersonalItems = t.raw('s2.personal.items') as string[];
  const s2TechnicalItems = t.raw('s2.technical.items') as string[];
  const s3Items = t.raw('s3.items') as string[];
  const s4Items = t.raw('s4.items') as { label: string; text: string }[];
  const s6Items = t.raw('s6.items') as string[];

  return (
    <div className="min-h-screen py-16">
      <div className="section-container">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">{t('heading')}</h1>
          <p className="mt-4 text-foreground-muted">{t('lastUpdated')}</p>

          <div className="mt-12 space-y-8 text-foreground-muted">
            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s1.heading')}
              </h2>
              <p className="mt-4">{t('s1.p1')}</p>
              <p className="mt-4">{t('s1.p2')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s2.heading')}
              </h2>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s2.personal.heading')}
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s2PersonalItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s2.technical.heading')}
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s2TechnicalItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s3.heading')}
              </h2>
              <p className="mt-4">{t('s3.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s3Items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s4.heading')}
              </h2>
              <p className="mt-4">{t('s4.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s4Items.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s5.heading')}
              </h2>
              <p className="mt-4">{t('s5.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s6.heading')}
              </h2>
              <p className="mt-4">{t('s6.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s6Items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s7.heading')}
              </h2>
              <p className="mt-4">
                {t.rich('s7.text', {
                  cookieLink: (chunks) => (
                    <Link href="/cookies" className="text-accent-primary hover:underline">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s8.heading')}
              </h2>
              <p className="mt-4">{t('s8.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s9.heading')}
              </h2>
              <p className="mt-4">{t('s9.intro')}</p>
              <p className="mt-2">
                <strong>{t('s9.emailLabel')}</strong>{' '}
                <a
                  href="mailto:privacy@foundationexclusive.com"
                  className="text-accent-primary hover:underline"
                >
                  foundationexclusivenft@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
