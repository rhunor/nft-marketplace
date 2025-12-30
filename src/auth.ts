import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import type { NextAuthConfig } from 'next-auth';

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Plain text string comparison (passwords are stored as plain strings)
          if (user.password !== credentials.password) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            walletBalance: user.walletBalance,
            avatar: user.avatar,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  callbacks: {
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

      // Handle manual session updates
      if (trigger === 'update' && session) {
        token.walletBalance = session.walletBalance ?? token.walletBalance;
        token.name = session.name ?? token.name;
        token.avatar = session.avatar ?? token.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.walletBalance = token.walletBalance;
        session.user.avatar = token.avatar;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        try {
          await connectDB();

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user from Google account
            const username =
              user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_') ||
              `user_${Date.now()}`;

            const newUser = await User.create({
              email: user.email,
              username,
              name: user.name || username,
              // Store a random plain-text string as password (never used for Google login)
              password: crypto.randomUUID(),
              avatar: user.image || '',
              role: 'user',
              walletBalance: 0,
            });

            user.id = newUser._id.toString();
            user.username = newUser.username;
            user.role = newUser.role;
            user.walletBalance = newUser.walletBalance;
          } else {
            user.id = existingUser._id.toString();
            user.username = existingUser.username;
            user.role = existingUser.role;
            user.walletBalance = existingUser.walletBalance;
            user.avatar = existingUser.avatar;
          }
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);