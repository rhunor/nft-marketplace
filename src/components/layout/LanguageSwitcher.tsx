'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { curatedLocales, longTailLocales, type Locale } from '@/i18n/routing';
import { localeNames } from '@/i18n/localeNames';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('common.languageSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function selectLocale(next: Locale) {
    setIsOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:border-border-light hover:text-foreground"
        aria-label={t('label')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[locale as Locale]}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-border bg-background-secondary p-2 shadow-xl"
            >
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                {t('popular')}
              </p>
              {curatedLocales.map((code) => (
                <LocaleOption
                  key={code}
                  code={code}
                  active={code === locale}
                  onSelect={selectLocale}
                />
              ))}

              <p className="mt-2 border-t border-border px-3 py-1.5 pt-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                {t('more')}
              </p>
              {longTailLocales.map((code) => (
                <LocaleOption
                  key={code}
                  code={code}
                  active={code === locale}
                  onSelect={selectLocale}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function LocaleOption({
  code,
  active,
  onSelect,
}: {
  code: Locale;
  active: boolean;
  onSelect: (code: Locale) => void;
}) {
  return (
    <button
      onClick={() => onSelect(code)}
      className={cn(
        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-accent-primary/20 text-accent-primary'
          : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
      )}
    >
      {localeNames[code]}
      {active && <Check className="h-4 w-4" />}
    </button>
  );
}
