import type { Document, Types } from 'mongoose';

// User Types
export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  walletBalance: number; // in ETH
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export type SafeUser = Omit<IUser, 'password' | '_id'> & {
  _id: string;
};

// NFT Types
export type NFTCategory = 'new' | 'photography' | 'digital-art' | 'games' | 'music' | 'video';

export interface INFT {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  price: number; // in ETH
  category: NFTCategory;
  tags: string[];
  creator: Types.ObjectId | IUser;
  owner: Types.ObjectId | IUser;
  likes: Types.ObjectId[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INFTDocument extends INFT, Document {
  _id: Types.ObjectId;
}

// NFT with populated user data (serialized for API responses)
export interface NFTWithUser {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  price: number;
  category: NFTCategory;
  tags: string[];
  creator: SafeUser;
  owner: SafeUser;
  likes: string[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface ITransaction {
  _id?: Types.ObjectId;
  type: 'deposit' | 'purchase' | 'upload_fee';
  user: Types.ObjectId | IUser;
  amount: number; // in ETH
  status: 'pending' | 'completed' | 'failed';
  nft?: Types.ObjectId | INFT;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {
  _id: Types.ObjectId;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
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

// Search & Filter Types
export interface NFTFilters {
  category?: NFTCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  creator?: string;
  owner?: string;
}

// Auth Types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  username: string;
  name: string;
}