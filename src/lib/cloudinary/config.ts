import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Type definitions for Cloudinary upload response
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  duration?: number;
  created_at: string;
  thumbnail_url?: string;
}

export interface CloudinarySignatureParams {
  timestamp: number;
  folder?: string;
  upload_preset?: string;
  [key: string]: string | number | undefined;
}