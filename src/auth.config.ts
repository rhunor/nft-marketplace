import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible auth configuration.
 * This file should NOT import any database/mongoose code.
 * It's used by the middleware which runs on Edge Runtime.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Required for Vercel deployment
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnUpload = nextUrl.pathname.startsWith('/upload');
      const isOnSettings = nextUrl.pathname.startsWith('/settings');
      
      const protectedRoutes = isOnDashboard || isOnAdmin || isOnUpload || isOnSettings;
      
      if (protectedRoutes) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    // These callbacks are needed for the middleware to access user role
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email || '';
        token.name = user.name || '';
        token.username = user.username;
        token.role = user.role;
        token.walletBalance = user.walletBalance;
        token.avatar = user.avatar;
      }

      // Handle session updates from client
      // The session parameter contains the data passed to update()
      if (trigger === 'update' && session) {
        // Update token with new values from session
        if (session.walletBalance !== undefined) {
          token.walletBalance = session.walletBalance;
        }
        if (session.name !== undefined) {
          token.name = session.name;
        }
        if (session.avatar !== undefined) {
          token.avatar = session.avatar;
        }
        if (session.role !== undefined) {
          token.role = session.role;
        }
        // Flag to indicate a refresh is needed
        if (session.refresh === true) {
          token.needsRefresh = true;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || '';
        session.user.email = (token.email as string) || '';
        session.user.name = (token.name as string) || '';
        session.user.username = (token.username as string) || '';
        session.user.role = (token.role as 'user' | 'admin') || 'user';
        session.user.walletBalance = (token.walletBalance as number) || 0;
        session.user.avatar = (token.avatar as string) || '';
      }
      return session;
    },
  },
  providers: [], // Providers are added in auth.ts
};