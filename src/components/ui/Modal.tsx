'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal container - allows scrolling */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full rounded-2xl border border-border bg-background-secondary p-4 sm:p-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto',
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="mb-4 flex items-start justify-between gap-4 sticky top-0 bg-background-secondary pb-2 -mt-1 pt-1">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-foreground-muted">
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="shrink-0 rounded-lg p-1.5 text-foreground-subtle transition-colors hover:bg-background-hover hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Notification / Toast ────────────────────────────────────────────────────

import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface NotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Notification({
  type = 'info',
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bar: 'bg-success',
      iconClass: 'text-success',
      border: 'border-success/30',
      bg: 'bg-[#0d1f0d]',
    },
    error: {
      icon: AlertCircle,
      bar: 'bg-error',
      iconClass: 'text-error',
      border: 'border-error/30',
      bg: 'bg-[#1f0d0d]',
    },
    warning: {
      icon: AlertTriangle,
      bar: 'bg-warning',
      iconClass: 'text-warning',
      border: 'border-warning/30',
      bg: 'bg-[#1f180d]',
    },
    info: {
      icon: Info,
      bar: 'bg-accent-primary',
      iconClass: 'text-accent-primary',
      border: 'border-accent-primary/30',
      bg: 'bg-[#0d0d1f]',
    },
  } as const;

  const { icon: Icon, bar, iconClass, border, bg } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          // Bottom-center on mobile, bottom-right on desktop
          className="fixed bottom-6 left-1/2 z-[60] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
          role="alert"
          aria-live="assertive"
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl border shadow-2xl',
              bg,
              border
            )}
          >
            {/* Accent bar on the left */}
            <div className={cn('absolute inset-y-0 left-0 w-1 rounded-l-2xl', bar)} />

            <div className="flex items-start gap-3 px-4 py-3 pl-5">
              {/* Icon */}
              <div className={cn('mt-0.5 shrink-0', iconClass)}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
                {message && (
                  <p className="mt-0.5 text-xs text-foreground-muted leading-relaxed">{message}</p>
                )}
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Dismiss"
                className="shrink-0 rounded-lg p-1 text-foreground-subtle transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Auto-dismiss progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                style={{ originX: 0 }}
                className={cn('h-0.5 w-full', bar, 'opacity-40')}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}