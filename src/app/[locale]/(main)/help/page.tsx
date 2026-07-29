'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  HelpCircle,
  Wallet,
  Upload,
  ShoppingCart,
  Shield,
  Clock,
  CreditCard,
  Image as ImageIcon,
  ChevronRight,
  ArrowDownToLine,
  DollarSign,
  Search,
} from 'lucide-react';
import { Card, Button, Loading } from '@/components/ui';

const helpTopicsMeta = [
  { key: 'wallet', icon: Wallet, href: '#wallet-balance' },
  { key: 'creating', icon: Upload, href: '#creating-nfts' },
  { key: 'buying', icon: ShoppingCart, href: '#buying-nfts' },
  { key: 'withdrawals', icon: ArrowDownToLine, href: '#withdrawals' },
  { key: 'security', icon: Shield, href: '#security' },
  { key: 'exploring', icon: Search, href: '#exploring' },
] as const;

const richComponents = {
  b: (chunks: ReactNode) => <strong>{chunks}</strong>,
};

function HelpContent() {
  const t = useTranslations('help');
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [searchParams]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    }
  };

  const faqItems = t.raw('faq.items') as { question: string; answer: string }[];
  const walletNotes = t.raw('wallet.notes') as string[];
  const creatingAfter = t.raw('buying.after') as string[];
  const withdrawalsInfo = t.raw('withdrawals.info') as { label: string; text: string }[];
  const exploringTips = t.raw('exploring.tips') as string[];
  const securityItems = t.raw('security.items') as { label: string; text: string }[];
  const quickRefProcessing = t.raw('quickRef.processingTimes.items') as string[];
  const quickRefFees = t.raw('quickRef.fees.items') as string[];
  const quickRefFormats = t.raw('quickRef.formats.items') as string[];
  const quickRefMinimums = t.raw('quickRef.minimums.items') as string[];

  const walletSteps = [1, 2, 3, 4, 5].map((n) =>
    t.rich(`wallet.steps.step${n}`, richComponents)
  );
  const creatingSingleSteps = [1, 2, 3, 4, 5, 6].map((n) =>
    t.rich(`creating.singleSteps.step${n}`, richComponents)
  );
  const creatingCollectionSteps = [1, 2, 3, 4].map((n) =>
    t.rich(`creating.collectionSteps.step${n}`, richComponents)
  );
  const buyingSteps = [1, 2, 3, 4, 5, 6].map((n) =>
    t.rich(`buying.steps.step${n}`, richComponents)
  );
  const withdrawalsSteps = [1, 2, 3, 4, 5, 6, 7].map((n) =>
    t.rich(`withdrawals.steps.step${n}`, richComponents)
  );
  const exploringSteps = [1, 2, 3, 4, 5].map((n) =>
    t.rich(`exploring.steps.step${n}`, richComponents)
  );

  return (
    <div className="py-8">
      <div className="section-container max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{t('header.heading')}</h1>
          <p className="mt-4 text-lg text-foreground-muted">
            {t('header.subtitle')}
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {helpTopicsMeta.map((topic) => (
            <a key={topic.key} href={topic.href} onClick={(e) => scrollToSection(e, topic.href)} className="block">
              <Card hover className="flex items-center gap-4 p-6 h-full">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <topic.icon className="h-6 w-6 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{t(`topics.${topic.key}.title`)}</h3>
                  <p className="text-sm text-foreground-muted">
                    {t(`topics.${topic.key}.description`)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-foreground-subtle" />
              </Card>
            </a>
          ))}
        </div>

        {/* Wallet & Balance Section */}
        <section id="wallet-balance" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Wallet className="h-7 w-7 text-accent-primary" />
            {t('wallet.heading')}
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">{t('wallet.cardHeading')}</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              {walletSteps.map((step, i) => (
                <li key={i}>
                  <span className="font-bold text-accent-primary">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">{t('wallet.notesHeading')}</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                {walletNotes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* Creating NFTs Section */}
        <section id="creating-nfts" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Upload className="h-7 w-7 text-accent-primary" />
            {t('creating.heading')}
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">{t('creating.singleCardHeading')}</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              {creatingSingleSteps.map((step, i) => (
                <li key={i}>
                  <span className="font-bold text-accent-primary">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <div className="border-t border-border pt-4 mb-4">
              <h4 className="font-semibold mb-2">{t('creating.collectionCardHeading')}</h4>
              <ol className="space-y-2 text-foreground-muted">
                {creatingCollectionSteps.map((step, i) => (
                  <li key={i}>
                    <span className="font-bold text-accent-primary">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-t border-border pt-4 bg-accent-primary/10 -mx-6 px-6 py-3 rounded-b-xl">
              <h4 className="font-semibold mb-1">{t('creating.feesHeading')}</h4>
              <p className="text-sm text-foreground-muted">{t('creating.feesText')}</p>
            </div>
          </Card>
        </section>

        {/* Buying NFTs Section */}
        <section id="buying-nfts" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-7 w-7 text-accent-primary" />
            {t('buying.heading')}
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">{t('buying.cardHeading')}</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              {buyingSteps.map((step, i) => (
                <li key={i}>
                  <span className="font-bold text-accent-primary">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">{t('buying.afterHeading')}</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                {creatingAfter.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* Withdrawals Section */}
        <section id="withdrawals" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <ArrowDownToLine className="h-7 w-7 text-accent-primary" />
            {t('withdrawals.heading')}
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">{t('withdrawals.cardHeading')}</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              {withdrawalsSteps.map((step, i) => (
                <li key={i}>
                  <span className="font-bold text-accent-primary">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <div className="border-t border-border pt-4 mb-4">
              <h4 className="font-semibold mb-2">{t('withdrawals.infoHeading')}</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                {withdrawalsInfo.map((item, i) => (
                  <li key={i}>
                    • <strong>{item.label}</strong> {item.text}
                  </li>
                ))}
                <li>• {t('withdrawals.infoPlain')}</li>
              </ul>
            </div>
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
              <h4 className="font-semibold text-warning mb-2">
                {t('withdrawals.feeWarningHeading')}
              </h4>
              <p className="text-sm text-foreground-muted">
                {t.rich('withdrawals.feeWarningText', richComponents)}
              </p>
            </div>
          </Card>
        </section>

        {/* Exploring Section */}
        <section id="exploring" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Search className="h-7 w-7 text-accent-primary" />
            {t('exploring.heading')}
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">{t('exploring.cardHeading')}</h3>
            <ol className="space-y-3 text-foreground-muted mb-6">
              {exploringSteps.map((step, i) => (
                <li key={i}>
                  <span className="font-bold text-accent-primary">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">{t('exploring.tipsHeading')}</h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                {exploringTips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* Security Section */}
        <section id="security" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
            <Shield className="h-7 w-7 text-accent-primary" />
            {t('security.heading')}
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">{t('security.cardHeading')}</h3>
            <ul className="space-y-3 text-foreground-muted">
              {securityItems.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <Shield className="h-5 w-5 text-accent-primary flex-shrink-0" />
                  <span>
                    <strong>{item.label}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold">{t('faq.heading')}</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6">
                <h3 className="flex items-start gap-3 font-semibold">
                  <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-primary" />
                  {item.question}
                </h3>
                <p className="mt-3 pl-8 text-foreground-muted">{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Reference */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{t('quickRef.heading')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <Clock className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">{t('quickRef.processingTimes.heading')}</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                {quickRefProcessing.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <CreditCard className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">{t('quickRef.fees.heading')}</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                {quickRefFees.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <ImageIcon className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">{t('quickRef.formats.heading')}</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                {quickRefFormats.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <DollarSign className="mb-3 h-8 w-8 text-accent-primary" />
              <h3 className="font-semibold">{t('quickRef.minimums.heading')}</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                {quickRefMinimums.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 p-8 text-center">
          <h2 className="text-2xl font-bold">{t('contactCta.heading')}</h2>
          <p className="mt-2 text-foreground-muted">{t('contactCta.text')}</p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg">{t('contactCta.button')}</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<Loading text="Loading help center..." />}>
      <HelpContent />
    </Suspense>
  );
}
