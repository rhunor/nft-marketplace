import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { sendPasswordResetEmail } from '@/lib/email/send';
import { forgotPasswordSchema } from '@/lib/validations';
import { defaultLocale, isCuratedLocale } from '@/i18n/routing';

export const runtime = 'nodejs';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// POST - Request a password reset link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid email' },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const locale = typeof body.locale === 'string' && isCuratedLocale(body.locale) ? body.locale : defaultLocale;

    await connectDB();

    // Always respond with the same generic message, whether or not the
    // account exists, so this endpoint can't be used to enumerate emails.
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOneAndUpdate(
      { email },
      {
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
      { new: true }
    );

    if (user) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
      const resetUrl = `${appUrl}${localePrefix}/reset-password?token=${rawToken}`;

      sendPasswordResetEmail(user.email, user.name, resetUrl).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists for that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
