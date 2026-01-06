import type { Types } from 'mongoose';

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

// For Mongoose documents, use HydratedDocument<IUser> instead of extending Document
export type IUserDocument = IUser & { _id: Types.ObjectId };

export type SafeUser = Omit<IUser, 'password' | '_id'> & {
  _id: string;
};

// NFT Types
export type NFTCategory = 'new' | 'photography' | 'digital-art' | 'games' | 'music' | 'video' | 'collectibles';

export interface INFT {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
  price: number; // in ETH
  category: NFTCategory;
  tags: string[];
  creator: Types.ObjectId | IUser;
  owner: Types.ObjectId | IUser;
  nftCollection?: Types.ObjectId | null; // renamed to avoid conflict with mongoose reserved 'collection'
  likes: Types.ObjectId[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For Mongoose documents, use HydratedDocument<INFT> instead of extending Document
export type INFTDocument = INFT & { _id: Types.ObjectId };

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
  nftCollection?: string | null;
  likes: string[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Collection Types
export interface ICollection {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  coverImage: string;
  coverImagePublicId?: string;
  category: NFTCategory;
  creator: Types.ObjectId | IUser;
  nfts: Types.ObjectId[];
  floorPrice: number;
  totalVolume: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For Mongoose documents, use HydratedDocument<ICollection> instead of extending Document
export type ICollectionDocument = ICollection & { _id: Types.ObjectId };

// Collection with populated creator (serialized for API responses)
export interface CollectionWithCreator {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  category: NFTCategory;
  creator: SafeUser;
  nfts: NFTWithUser[];
  floorPrice: number;
  totalVolume: number;
  totalItems: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface ITransaction {
  _id?: Types.ObjectId;
  type: 'deposit' | 'purchase' | 'upload_fee' | 'withdrawal';
  user: Types.ObjectId | IUser;
  amount: number; // in ETH
  status: 'pending' | 'completed' | 'failed';
  nft?: Types.ObjectId | INFT;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// For Mongoose documents, use HydratedDocument<ITransaction> instead of extending Document
export type ITransactionDocument = ITransaction & { _id: Types.ObjectId };

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

// Upload Types
export interface CollectionUploadData {
  name: string;
  description: string;
  category: NFTCategory;
  items: {
    title: string;
    description: string;
    price: number;
    tags: string[];
    file: File;
  }[];
}