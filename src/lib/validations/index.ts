import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// NFT validations
export const nftSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z
    .number()
    .min(0.0001, 'Price must be at least 0.0001 ETH')
    .max(10000, 'Price cannot exceed 10000 ETH'),
  category: z.enum(['new', 'photography', 'digital-art', 'games', 'music', 'video'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  tags: z
    .array(z.string().max(30, 'Each tag cannot exceed 30 characters'))
    .max(10, 'Cannot have more than 10 tags')
    .optional()
    .default([]),
});

export const nftUploadSchema = nftSchema.extend({
  file: z.any().refine((file) => file instanceof File, 'Please select a file'),
});

// User profile update
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  bio: z
    .string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

// Contact form
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message cannot exceed 5000 characters'),
});

// Search/filter params
export const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.enum(['new', 'photography', 'digital-art', 'games', 'music', 'video']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price', 'createdAt', 'views', 'likes']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(12),
});

// Admin - Update user balance
export const updateBalanceSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  amount: z.number(),
  operation: z.enum(['add', 'set']),
});

// Admin - Transfer NFT ownership
export const transferOwnershipSchema = z.object({
  nftId: z.string().min(1, 'NFT ID is required'),
  newOwnerId: z.string().min(1, 'New owner ID is required'),
});

// Types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type NFTInput = z.infer<typeof nftSchema>;
export type NFTUploadInput = z.infer<typeof nftUploadSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
export type UpdateBalanceInput = z.infer<typeof updateBalanceSchema>;
export type TransferOwnershipInput = z.infer<typeof transferOwnershipSchema>;
