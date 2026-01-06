'use client';

import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface SessionRefreshContextType {
  refreshSession: () => Promise<void>;
}

const SessionRefreshContext = createContext<SessionRefreshContextType | undefined>(undefined);

const REFRESH_INTERVAL = 30000; // 30 seconds - check for updates periodically

export function SessionRefreshProvider({ children }: { children: ReactNode }) {
  const { data: session, update: updateSession, status } = useSession();

  // Function to fetch fresh user data and update session
  const refreshSession = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      return;
    }

    try {
      const response = await fetch('/api/users/me/refresh');
      
      if (!response.ok) {
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        const freshData = data.data;
        const currentBalance = session.user.walletBalance;
        const currentRole = session.user.role;

        // Only update if data has actually changed
        const balanceChanged = freshData.walletBalance !== currentBalance;
        const roleChanged = freshData.role !== currentRole;
        const nameChanged = freshData.name !== session.user.name;
        const avatarChanged = freshData.avatar !== session.user.avatar;

        if (balanceChanged || roleChanged || nameChanged || avatarChanged) {
          // Update the session with fresh data
          await updateSession({
            walletBalance: freshData.walletBalance,
            role: freshData.role,
            name: freshData.name,
            avatar: freshData.avatar,
          });
        }
      }
    } catch {
      // Silently fail - this is background sync
    }
  }, [session, status, updateSession]);

  // Set up periodic refresh
  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    // Initial refresh after mount
    const initialTimeout = setTimeout(() => {
      refreshSession();
    }, 1000);

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      refreshSession();
    }, REFRESH_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [status, refreshSession]);

  // Also refresh when window gains focus
  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const handleFocus = () => {
      refreshSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [status, refreshSession]);

  return (
    <SessionRefreshContext.Provider value={{ refreshSession }}>
      {children}
    </SessionRefreshContext.Provider>
  );
}

export function useSessionRefresh() {
  const context = useContext(SessionRefreshContext);
  if (context === undefined) {
    throw new Error('useSessionRefresh must be used within a SessionRefreshProvider');
  }
  return context;
}