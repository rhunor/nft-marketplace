import type { Document, Types } from 'mongoose';

// ============================================
// Database Document Interfaces (Mongoose)
// ============================================

// User Types
export interface IUser {
  email: string;
  username: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  walletBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// NFT Types
export type NFTCategory = 'digital-art' | 'photography' | 'games' | 'music' | 'video' | 'collectibles';

export interface INFT {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  price: number;
  category: string;
  tags: string[];
  creator: Types.ObjectId;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  views: number;
  isListed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INFTDocument extends INFT, Document {
  _id: Types.ObjectId;
  toggleLike(userId: string): Promise<boolean>;
  incrementViews(): Promise<void>;
}

// Transaction Types
export interface ITransaction {
  type: 'deposit' | 'purchase' | 'upload_fee' | 'withdrawal';
  user: Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  nft?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionDocument extends ITransaction, Document {
  _id: Types.ObjectId;
}

// ============================================
// API Response Types (Frontend/Serialized)
// ============================================

// Safe user type for API responses (without password)
export interface SafeUser {
  _id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  walletBalance: number;
  createdAt?: string;
  updatedAt?: string;
}

// NFT with populated user data for API responses
export interface NFTWithUser {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  price: number;
  category: string;
  tags: string[];
  creator: SafeUser;
  owner: SafeUser;
  likes: string[];
  views: number;
  isListed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Transaction with populated data for API responses
export interface TransactionWithDetails {
  _id: string;
  type: 'deposit' | 'purchase' | 'upload_fee' | 'withdrawal';
  user: SafeUser;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  nft?: NFTWithUser;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NFTFilters {
  category?: NFTCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  creator?: string;
  owner?: string;
}

// ============================================
// Auth Types
// ============================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  username: string;
  name: string;
}

// NextAuth session extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      role: 'user' | 'admin';
      walletBalance: number;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    role: 'user' | 'admin';
    walletBalance: number;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    username: string;
    role: 'user' | 'admin';
    walletBalance: number;
    avatar?: string;
  }
}