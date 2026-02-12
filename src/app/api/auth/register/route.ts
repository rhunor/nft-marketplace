import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, name, password, phoneNumber, captchaToken } = body;

    // Verify reCAPTCHA if secret key is configured
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && recaptchaSecret !== 'your-recaptcha-secret-key') {
      if (!captchaToken) {
        return NextResponse.json(
          { error: 'CAPTCHA verification is required' },
          { status: 400 }
        );
      }

      const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecret}&response=${captchaToken}`,
      });
      const captchaData = await captchaResponse.json();

      if (!captchaData.success) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Basic validation
    if (!email || !username || !name || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      name,
      password,
      phoneNumber: phoneNumber || '',
      role: 'user',
      walletBalance: 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}