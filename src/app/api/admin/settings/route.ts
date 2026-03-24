import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { SiteSettings } from '@/lib/db/models';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const settings = await SiteSettings.getSettings();

    return NextResponse.json({
      success: true,
      data: {
        depositAddress: settings.depositAddress,
        gasFeeAddress: settings.gasFeeAddress,
      },
    });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { depositAddress, gasFeeAddress } = body;

    // Validate any provided addresses
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (depositAddress !== undefined && depositAddress !== '' && !ethAddressRegex.test(depositAddress)) {
      return NextResponse.json({ error: 'Invalid deposit address format' }, { status: 400 });
    }
    if (gasFeeAddress !== undefined && gasFeeAddress !== '' && !ethAddressRegex.test(gasFeeAddress)) {
      return NextResponse.json({ error: 'Invalid gas fee address format' }, { status: 400 });
    }

    await connectDB();
    const settings = await SiteSettings.getSettings();

    if (depositAddress !== undefined) settings.depositAddress = depositAddress;
    if (gasFeeAddress !== undefined) settings.gasFeeAddress = gasFeeAddress;

    await settings.save();

    return NextResponse.json({
      success: true,
      data: {
        depositAddress: settings.depositAddress,
        gasFeeAddress: settings.gasFeeAddress,
      },
    });
  } catch (error) {
    console.error('Admin settings PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
