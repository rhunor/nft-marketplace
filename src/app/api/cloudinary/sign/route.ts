import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateSignature } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json(
        { error: 'Parameters to sign are required' },
        { status: 400 }
      );
    }

    // Generate signature
    const signature = generateSignature(paramsToSign);

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Signature generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}