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
      if (user) {
        token.id = user.id;
        token.email = user.email || '';
        token.name = user.name || '';
        token.username = user.username;
        token.role = user.role;
        token.walletBalance = user.walletBalance;
        token.avatar = user.avatar;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.walletBalance = session.walletBalance ?? token.walletBalance;
        token.name = session.name ?? token.name;
        token.avatar = session.avatar ?? token.avatar;
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