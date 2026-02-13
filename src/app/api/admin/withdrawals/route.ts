import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { Transaction } from '@/lib/db/models';

// GET - List all withdrawal transactions for admin
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    await connectDB();

    const query: Record<string, unknown> = { type: 'withdrawal' };
    if (status && ['pending', 'completed', 'failed'].includes(status)) {
      query.status = status;
    }

    const withdrawals = await Transaction.find(query)
      .populate('user', 'name username email avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: { withdrawals },
    });
  } catch (error) {
    console.error('Admin withdrawals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}

// PATCH - Update withdrawal status
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { transactionId, status } = body;

    if (!transactionId || !status || !['completed', 'failed'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid transaction ID and status (completed/failed) are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, type: 'withdrawal' },
      { status },
      { new: true }
    ).populate('user', 'name username email');

    if (!transaction) {
      return NextResponse.json(
        { error: 'Withdrawal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Admin withdrawal update error:', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal' },
      { status: 500 }
    );
  }
}
