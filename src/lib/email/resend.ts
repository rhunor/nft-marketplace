import { Resend } from 'resend';

let client: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}

export function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || 'support@foundationexclusive.app';
}

export const APP_NAME = 'Foundation Exclusive';
