import { cloudinary, type CloudinaryUploadResult } from './config';
import { getMediaType } from '@/lib/utils';

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  thumbnailUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'other';
  error?: string;
}

/**
 * Upload a file to Cloudinary from the server
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'nft-uploads'
): Promise<UploadResult> {
  try {
    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataURI = `data:${mimeType};base64,${base64}`;

    // Determine resource type based on file type
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
    if (mimeType.startsWith('image/')) {
      resourceType = 'image';
    } else if (mimeType.startsWith('video/')) {
      resourceType = 'video';
    } else if (mimeType.startsWith('audio/')) {
      resourceType = 'video'; // Cloudinary treats audio as video resource type
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'wav', 'ogg'],
    }) as CloudinaryUploadResult;

    // Generate thumbnail URL for videos
    let thumbnailUrl: string | undefined;
    if (resourceType === 'video') {
      thumbnailUrl = cloudinary.url(result.public_id, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { start_offset: '0' },
        ],
      });
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl,
      mediaType: getMediaType(file.name),
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload to Cloudinary',
    };
  }
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Generate a signature for client-side signed uploads
 */
export function generateSignature(paramsToSign: Record<string, string | number>): string {
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return signature;
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  const { width = 800, height = 800, quality = 'auto', format = 'auto' } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop: 'fill',
        gravity: 'auto',
        quality,
        fetch_format: format,
      },
    ],
  });
}

/**
 * Validate file type and size for upload
 */
export function validateFile(
  file: File,
  maxSize: number = 100 * 1024 * 1024, // 100MB default
  allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ]
): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${Math.round(maxSize / (1024 * 1024))}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}