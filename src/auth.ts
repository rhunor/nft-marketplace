import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { authConfig } from './auth.config';

/**
 * Full auth configuration with database access.
 * This file imports mongoose and should NOT be used in middleware.
 * The middleware uses auth.config.ts instead.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
          console.log('[Auth] Missing credentials');
          throw new Error('Email and password are required');
        }
        try {
          await connectDB();
          console.log('[Auth] Connected to DB, looking for user:', credentials.email);
          const user = await User.findOne({ email: credentials.email }).select('+password');
          if (!user) {
            console.log('[Auth] User not found');
            throw new Error('Invalid email or password');
          }

          // Plain text comparison — passwords are stored as plain strings
          if (user.password !== credentials.password) {
            console.log('[Auth] Invalid password');
            throw new Error('Invalid email or password');
          }

          console.log('[Auth] User authenticated successfully:', user.email, 'Role:', user.role);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role as 'user' | 'admin',
            walletBalance: user.walletBalance,
            avatar: user.avatar || '',
          };
        } catch (error) {
          console.error('[Auth] Error during authentication:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      console.log('[Auth] SignIn callback - provider:', account?.provider);

      // Handle Google OAuth sign in
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
              // Random plain-text string as password (never used for Google login)
              password: crypto.randomUUID(),
              avatar: user.image || '',
              role: 'user',
              walletBalance: 0,
            });
            user.id = newUser._id.toString();
            user.username = newUser.username;
            user.role = newUser.role as 'user' | 'admin';
            user.walletBalance = newUser.walletBalance;
          } else {
            user.id = existingUser._id.toString();
            user.username = existingUser.username;
            user.role = existingUser.role as 'user' | 'admin';
            user.walletBalance = existingUser.walletBalance;
            user.avatar = existingUser.avatar;
          }
        } catch (error) {
          console.error('[Auth] Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});