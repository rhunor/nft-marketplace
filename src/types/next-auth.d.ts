/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      role: 'user' | 'admin';
      walletBalance: number;
      avatar?: string;
      image?: string;
    };
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    role?: 'user' | 'admin';
    walletBalance?: number;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string;
    username?: string;
    role?: 'user' | 'admin';
    walletBalance?: number;
    avatar?: string;
  }
}