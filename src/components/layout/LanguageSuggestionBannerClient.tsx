'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export function LanguageSuggestionBannerClient({
  suggestedLocale,
  message,
  switchLabel,
  dismissLabel,
  dismissCookieName,
}: {
  suggestedLocale: Locale;
  suggestedLanguageName: string;
  message: string;
  switchLabel: string;
  dismissLabel: string;
  dismissCookieName: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function dismiss() {
    document.cookie = `${dismissCookieName}=${suggestedLocale}; path=/; max-age=${60 * 60 * 24 * 30}`;
    setDismissed(true);
  }

  function switchLocale() {
    document.cookie = `${dismissCookieName}=${suggestedLocale}; path=/; max-age=${60 * 60 * 24 * 30}`;
    router.replace(pathname, { locale: suggestedLocale });
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-border bg-background-secondary"
        >
          <div className="section-container flex items-center justify-between gap-4 py-2.5 text-sm">
            <div className="flex items-center gap-2 text-foreground-muted">
              <Globe className="h-4 w-4 shrink-0 text-accent-primary" />
              <span>{message}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={switchLocale}
                className="font-medium text-accent-primary hover:underline"
              >
                {switchLabel}
              </button>
              <button
                onClick={dismiss}
                aria-label={dismissLabel}
                className="text-foreground-subtle hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
