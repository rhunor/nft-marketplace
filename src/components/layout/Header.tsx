'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  Search,
  Wallet,
  LogOut,
  Upload,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { cn, formatETH } from '@/lib/utils';
import { Button, Avatar } from '@/components/ui';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/help', label: 'Help' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/images/logo.svg" 
              alt="Foundation Exclusive" 
              className="h-8 w-auto invert"
            />
            <span className="hidden text-xl font-bold sm:inline-block">
              Foundation<span className="text-accent-primary">Exclusive</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-background-hover text-foreground'
                    : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-md lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
              <input
                type="text"
                placeholder="Search NFTs, creators..."
                className="w-full rounded-xl border border-border bg-background-secondary py-2 pl-10 pr-4 text-sm placeholder:text-foreground-subtle focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {status === 'loading' ? (
              <div className="h-10 w-24 animate-pulse rounded-xl bg-background-hover" />
            ) : session ? (
              <>
                {/* Wallet Balance */}
                <div className="hidden items-center gap-2 rounded-xl border border-border bg-background-secondary px-3 py-2 sm:flex">
                  <Wallet className="h-4 w-4 text-accent-primary" />
                  <span className="text-sm font-medium">
                    {formatETH(session.user.walletBalance)}
                  </span>
                </div>

                {/* Upload Button */}
                <Link href="/upload" className="hidden sm:block">
                  <Button size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                    Create
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary p-1.5 transition-colors hover:border-border-light"
                  >
                    <Avatar
                      src={session.user.avatar}
                      alt={session.user.name}
                      size="sm"
                      fallback={session.user.name}
                    />
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-foreground-subtle transition-transform',
                        isUserMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background-secondary p-2 shadow-xl"
                        >
                          <div className="border-b border-border px-3 py-2">
                            <p className="font-medium">{session.user.name}</p>
                            <p className="text-sm text-foreground-subtle">
                              @{session.user.username}
                            </p>
                          </div>
                          <div className="py-2">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <Link
                              href="/upload"
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground sm:hidden"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Upload className="h-4 w-4" />
                              Create NFT
                            </Link>
                            <Link
                              href="/fund"
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Wallet className="h-4 w-4" />
                              Fund Account
                            </Link>
                            {session.user.role === 'admin' && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Settings className="h-4 w-4" />
                                Admin Panel
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-border pt-2">
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                signOut({ callbackUrl: '/' });
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-background-hover lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border lg:hidden"
          >
            <div className="section-container py-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <input
                  type="text"
                  placeholder="Search NFTs, creators..."
                  className="w-full rounded-xl border border-border bg-background-secondary py-2.5 pl-10 pr-4 text-sm placeholder:text-foreground-subtle focus:border-accent-primary focus:outline-none"
                />
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-background-hover text-foreground'
                        : 'text-foreground-muted hover:bg-background-hover'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              {!session && (
                <div className="mt-4 flex gap-3 border-t border-border pt-4">
                  <Link href="/login" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}