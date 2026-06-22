import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format ETH price
export function formatETH(amount: number): string {
  return `${amount.toFixed(4)} ETH`;
}

// Format USD from ETH (using env rate or default)
export function ethToUSD(ethAmount: number, rate?: number): string {
  const ethRate = rate || parseFloat(process.env.ETH_USD_RATE || '2000');
  const usdAmount = ethAmount * ethRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(usdAmount);
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// Truncate address or string
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get file extension from URL or filename
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1]!.toLowerCase() : '';
}

// Determine media type from file extension
export function getMediaType(filename: string): 'image' | 'video' | 'audio' | 'other' {
  const ext = getFileExtension(filename);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];

  if (imageExtensions.includes(ext)) return 'image';
  if (videoExtensions.includes(ext)) return 'video';
  if (audioExtensions.includes(ext)) return 'audio';
  return 'other';
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Calculate upload fee (simulated - $200 worth of ETH)
export function calculateUploadFee(ethUsdRate: number = 2000): number {
  return 200 / ethUsdRate; // Returns ETH amount equivalent to $200
}

// ─── Safe fetch helpers (shared across all pages) ────────────────────────────

function httpErrorMessage(status: number, rawMessage?: string): string {
  if (rawMessage) {
    if (/insufficient balance/i.test(rawMessage)) return 'Your balance is too low. Please add funds and try again.';
    if (/invalid.*price/i.test(rawMessage) || /\bprice\b/i.test(rawMessage)) return 'Please enter a valid price (e.g. 0.5).';
    if (/invalid.*title/i.test(rawMessage) || /\btitle\b/i.test(rawMessage)) return 'Your title is too long or contains unsupported characters.';
    if (/file.*required/i.test(rawMessage)) return 'Please select a file to upload.';
    if (/failed to upload/i.test(rawMessage)) return 'Could not process your file. Try a different format or smaller size.';
    if (/invalid input/i.test(rawMessage)) return 'Some fields have invalid values. Please review and try again.';
    if (/not found/i.test(rawMessage)) return 'Item not found.';
    if (/unauthorized|not authenticated/i.test(rawMessage)) return 'You need to be logged in. Please refresh and try again.';
  }
  if (status === 413) return 'Your file is too large. Please use a smaller file and try again.';
  if (status === 401) return 'You need to be logged in. Please refresh and try again.';
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return 'Not found. Please refresh the page and try again.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'Server error. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

/**
 * Safely reads a fetch Response — always returns a plain-English error message
 * instead of crashing when the server returns non-JSON (e.g. a plain-text 413).
 */
export async function safeFetch(
  response: Response
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  if (!response.ok) {
    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        const body = (await response.json()) as { error?: string };
        return { ok: false, error: httpErrorMessage(response.status, body.error) };
      } catch {
        return { ok: false, error: httpErrorMessage(response.status) };
      }
    }
    return { ok: false, error: httpErrorMessage(response.status) };
  }
  try {
    const data = await response.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Unexpected response from server. Please try again.' };
  }
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Create URL with query params
export function createUrl(base: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(base, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

// Categories with display names
export const NFT_CATEGORIES = [
  { value: 'ai-images', label: 'AI Images', icon: '🤖' },
  { value: 'digital-images', label: 'Digital Images', icon: '🖼️' },
  { value: 'paintings', label: 'Paintings', icon: '🎨' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'portrait', label: 'Portrait', icon: '👤' },
  { value: 'games', label: 'Games', icon: '🎮' },
  { value: 'animation', label: 'Animation', icon: '✨' },
  { value: 'street-photography', label: 'Street Photography', icon: '🏙️' },
  { value: 'landscape', label: 'Landscape', icon: '🌄' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'architecture', label: 'Architecture', icon: '🏛️' },
] as const;

// Get category label
export function getCategoryLabel(category: string): string {
  const found = NFT_CATEGORIES.find((c) => c.value === category);
  return found ? found.label : category;
}
