import { AuthProvider } from '@/components/auth';
import { EthPriceProvider, SessionRefreshProvider } from '@/contexts';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionRefreshProvider>
        <EthPriceProvider>{children}</EthPriceProvider>
      </SessionRefreshProvider>
    </AuthProvider>
  );
}
