import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User, SiteSettings } from '@/lib/db/models';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    const [user, settings] = await Promise.all([
      User.findById(session.user.id).select('withdrawalAddress gasFeeAddress').lean(),
      SiteSettings.getSettings(),
    ]);

    // Per-user address takes priority; fall back to site-wide default
    const depositAddress = user?.withdrawalAddress || settings.depositAddress;
    const gasFeeAddress = user?.gasFeeAddress || settings.gasFeeAddress;

    return NextResponse.json({
      success: true,
      data: { depositAddress, gasFeeAddress },
    });
  } catch (error) {
    console.error('Settings addresses GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}
