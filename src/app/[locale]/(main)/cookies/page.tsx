import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.cookies' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal.cookies');

  const essentialItems = t.raw('s2.essential.items') as string[];
  const performanceItems = t.raw('s2.performance.items') as string[];
  const functionalityItems = t.raw('s2.functionality.items') as string[];
  const analyticsItems = t.raw('s2.analytics.items') as string[];
  const s3Items = t.raw('s3.items') as { label: string; text: string }[];
  const s4Items = t.raw('s4.items') as { label: string; text: string }[];
  const browserSettingsItems = t.raw('s5.browserSettings.items') as string[];
  const browserSpecificItems = t.raw('s5.browserSpecific.items') as {
    label: string;
    text: string;
  }[];
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
                {t('s2.essential.heading')}
              </h3>
              <p className="mt-2">{t('s2.essential.text')}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {essentialItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s2.performance.heading')}
              </h3>
              <p className="mt-2">{t('s2.performance.text')}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {performanceItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s2.functionality.heading')}
              </h3>
              <p className="mt-2">{t('s2.functionality.text')}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {functionalityItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s2.analytics.heading')}
              </h3>
              <p className="mt-2">{t('s2.analytics.text')}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {analyticsItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s3.heading')}
              </h2>
              <p className="mt-4">{t('s3.p1')}</p>
              <p className="mt-4">{t('s3.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s3Items.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}</strong> {item.text}
                  </li>
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
              <p className="mt-4">{t('s5.intro')}</p>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s5.browserSettings.heading')}
              </h3>
              <p className="mt-2">{t('s5.browserSettings.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {browserSettingsItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s5.browserSpecific.heading')}
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {browserSpecificItems.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>

              <p className="mt-4 rounded-lg bg-warning/10 p-4 text-warning">
                <strong>{t('s5.note.label')}</strong> {t('s5.note.text')}
              </p>
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
              <p className="mt-4">{t('s7.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s8.heading')}
              </h2>
              <p className="mt-4">{t('s8.intro')}</p>
              <p className="mt-2">
                <strong>{t('s8.emailLabel')}</strong>{' '}
                <a
                  href="mailto:foundationexclusivenft@gmail.com"
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
