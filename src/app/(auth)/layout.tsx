import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="section-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold">
              NFT<span className="text-accent-primary">Market</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="relative w-full">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-accent-primary/10 blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-accent-secondary/10 blur-3xl" />
          </div>
          
          <div className="relative flex justify-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
