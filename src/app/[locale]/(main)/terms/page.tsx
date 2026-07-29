import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal.terms');

  const s2Items = t.raw('s2.items') as string[];
  const s3Items = t.raw('s3.items') as string[];
  const s4PurchasingItems = t.raw('s4.purchasing.items') as string[];
  const s4CreatingItems = t.raw('s4.creating.items') as string[];
  const s5Items = t.raw('s5.items') as { label: string; text: string }[];
  const s6Items = t.raw('s6.items') as string[];
  const s7CreatorItems = t.raw('s7.creatorRights.items') as string[];

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
              <p className="mt-4">{t('s2.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s2Items.map((item, i) => (
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
              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s4.purchasing.heading')}
              </h3>
              <p className="mt-2">{t('s4.purchasing.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s4PurchasingItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s4.creating.heading')}
              </h3>
              <p className="mt-2">{t('s4.creating.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s4CreatingItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s5.heading')}
              </h2>
              <p className="mt-4">{t('s5.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s5Items.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
              <p className="mt-4">{t('s5.outro')}</p>
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
              <p className="mt-4">{t('s7.intro')}</p>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s7.buying.heading')}
              </h3>
              <p className="mt-2">{t('s7.buying.text')}</p>

              <h3 className="mt-4 text-lg font-medium text-foreground">
                {t('s7.creatorRights.heading')}
              </h3>
              <p className="mt-2">{t('s7.creatorRights.intro')}</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {s7CreatorItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mt-4">{t('s7.creatorRights.outro')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s8.heading')}
              </h2>
              <p className="mt-4">{t('s8.p1')}</p>
              <p className="mt-4">{t('s8.p2')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s9.heading')}
              </h2>
              <p className="mt-4">{t('s9.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s10.heading')}
              </h2>
              <p className="mt-4">
                {t('s10.p1')}
                <br />
                <br />
                {t('s10.p2')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s11.heading')}
              </h2>
              <p className="mt-4">{t('s11.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s12.heading')}
              </h2>
              <p className="mt-4">{t('s12.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s13.heading')}
              </h2>
              <p className="mt-4">{t('s13.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('s14.heading')}
              </h2>
              <p className="mt-4">{t('s14.intro')}</p>
              <p className="mt-2">
                <strong>{t('s14.emailLabel')}</strong>{' '}
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
