'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,

  ArrowLeft,
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
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background-secondary">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <span className="font-bold">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-background">
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}
