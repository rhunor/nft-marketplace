import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models';
import { sendMassEmail } from '@/lib/email/send';
import { buildEmailLayout } from '@/lib/email/templates';

// GET - Recipient counts for the compose screen
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const [all, admins, users] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'user' }),
    ]);

    return NextResponse.json({ success: true, data: { all, admins, users } });
  } catch (error) {
    console.error('Admin email recipient count error:', error);
    return NextResponse.json({ error: 'Failed to load recipient counts' }, { status: 500 });
  }
}

// POST - Send a mass email via Resend
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { subject, message, audience } = body as {
      subject?: string;
      message?: string;
      audience?: 'all' | 'admin' | 'user';
    };

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    await connectDB();

    const query = audience === 'admin' || audience === 'user' ? { role: audience } : {};
    const recipients = await User.find(query).select('email').lean();
    const emails = recipients.map((r) => r.email).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ error: 'No recipients match that audience' }, { status: 400 });
    }

    const bodyHtml = message
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => `<p style="margin:0 0 14px;">${line}</p>`)
      .join('');

    const html = buildEmailLayout({ heading: subject, bodyHtml });

    const result = await sendMassEmail({ recipients: emails, subject, html });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Admin mass email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
