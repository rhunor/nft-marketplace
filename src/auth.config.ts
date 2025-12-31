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
  },
  providers: [], // Providers are added in auth.ts
};