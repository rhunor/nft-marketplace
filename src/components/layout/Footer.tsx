'use client';

import Link from 'next/link';
// import { Twitter, MessageCircle, Mail } from 'lucide-react';
import {siX, siGmail,siTelegram} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

const footerLinks = {
  marketplace: [
    { label: 'Explore Collections', href: '/explore' },
    { label: 'How it Works', href: '/help' },
    { label: 'Create', href: '/upload' },
  ],
  resources: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/help#faq' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: siX, href: 'https://x.com/foundation', label: 'Twitter' },
  { icon: siTelegram, href: 'https://telegram.com', label: 'Telegram' },
  { icon: siGmail, href: 'mailto:hello@foundationexclusive.com', label: 'Email' },
];

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
                alt="Foundation Exclusive" 
                className="h-8 w-auto invert"
              />
              <span className="text-xl font-bold">
                Foundation<span className="text-accent-primary">Exclusive</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-foreground-muted">
              An extension of Foundation - the premier destination for high-value 
              NFT collectors and creators. Join our exclusive community of 
              discerning collectors.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-foreground-subtle transition-colors hover:bg-background-hover hover:text-foreground"
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
              Marketplace
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
              Resources
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
              Company
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
            © {new Date().getFullYear()} Foundation Exclusive. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}