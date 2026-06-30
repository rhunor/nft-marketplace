'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  Settings,
  Mail,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/ui';

const adminNavItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/nfts',
    label: 'NFTs',
    icon: ImageIcon,
  },
  {
    href: '/admin/email',
    label: 'Mass Email',
    icon: Mail,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === 'loading') {
    return <Loading fullScreen />;
  }

  if (!session?.user || session.user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-foreground-muted">
            You don&apos;t have permission to access this page.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-accent-primary hover:underline"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Header Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background-secondary px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="font-bold">Admin Panel</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground-muted hover:bg-background-hover hover:text-foreground"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background-secondary transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo - hidden on mobile since we have the top bar */}
          <div className="hidden h-16 items-center border-b border-border px-6 lg:flex">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <span className="font-bold">Admin Panel</span>
            </Link>
          </div>

          {/* Spacer for mobile top bar */}
          <div className="h-14 lg:hidden" />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Back to site */}
          <div className="border-t border-border p-4">
            <Link
              href="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background lg:ml-64">
        {/* Mobile top bar spacer */}
        <div className="h-14 lg:hidden" />
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
