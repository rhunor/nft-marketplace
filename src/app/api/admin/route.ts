import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User, NFT, Transaction } from '@/lib/db/models';

// Middleware to check admin role
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }
  return session;
}

// GET - Dashboard stats
export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalUsers,
      totalNFTs,
      totalTransactions,
      recentUsers,
      recentNFTs,
    ] = await Promise.all([
      User.countDocuments(),
      NFT.countDocuments(),
      Transaction.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).lean(),
      NFT.find()
        .populate('creator', 'username name')
        .populate('owner', 'username name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalNFTs,
          totalTransactions,
        },
        recentUsers,
        recentNFTs,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
