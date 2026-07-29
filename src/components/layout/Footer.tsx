'use client';

import { Link } from '@/i18n/navigation';
// import { Twitter, MessageCircle, Mail } from 'lucide-react';
import {siX, siGmail,siTelegram} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

// Simple reusable component to render SimpleIcon as SVG
function IconComponent({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={`#${icon.hex}`}
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations('common');

  const footerLinks = {
    marketplace: [
      { label: t('footer.sections.marketplace.exploreCollections'), href: '/explore' },
      { label: t('footer.sections.marketplace.howItWorks'), href: '/help' },
      { label: t('footer.sections.marketplace.create'), href: '/upload' },
    ],
    resources: [
      { label: t('footer.sections.resources.helpCenter'), href: '/help' },
      { label: t('footer.sections.resources.contactUs'), href: '/contact' },
      { label: t('footer.sections.resources.faq'), href: '/help#faq' },
    ],
    company: [
      { label: t('footer.sections.company.aboutUs'), href: '/about' },
      { label: t('footer.sections.company.termsOfService'), href: '/terms' },
      { label: t('footer.sections.company.privacyPolicy'), href: '/privacy' },
      { label: t('footer.sections.company.cookiePolicy'), href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: siX, href: 'https://x.com/foundation', label: t('footer.social.twitter') },
    { icon: siTelegram, href: 'https://t.me/foundationexclusive', label: t('footer.social.telegram') },
    { icon: siGmail, href: 'mailto:foundationexclusivenft@gmail.com', label: t('footer.social.email') },
  ];

  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="section-container">
        {/* Main Footer */}
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo.svg"
                alt={t('footer.logoAlt')}
                className="h-8 w-auto invert"
              />
              <span className="text-xl font-bold">
                {t('footer.brandPrimary')}<span className="text-accent-primary">{t('footer.brandAccent')}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-foreground-muted">
              {t('footer.description')}
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-foreground-subtle invert transition-colors hover:bg-background-hover hover:text-foreground"
                  aria-label={social.label}
                >
                  <IconComponent icon={social.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
              {t('footer.sections.marketplace.heading')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
              {t('footer.sections.resources.heading')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
              {t('footer.sections.company.heading')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
          <p className="text-sm text-foreground-subtle">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              {t('footer.bottomLinks.terms')}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              {t('footer.bottomLinks.privacy')}
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              {t('footer.bottomLinks.cookies')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}