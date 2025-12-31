import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models';

// GET - List all users
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    await connectDB();

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// PATCH - Update user (balance, role)
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
    const { userId, walletBalance, role } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update balance - handle both object format and direct number
    if (walletBalance !== undefined) {
      if (typeof walletBalance === 'object' && walletBalance !== null) {
        // Handle object format: { operation: 'add' | 'set', amount: number }
        const { operation, amount } = walletBalance as { operation: string; amount: number };
        const numAmount = parseFloat(String(amount)) || 0;
        
        if (operation === 'add') {
          user.walletBalance = (user.walletBalance || 0) + numAmount;
        } else if (operation === 'subtract') {
          user.walletBalance = Math.max(0, (user.walletBalance || 0) - numAmount);
        } else {
          // 'set' or default
          user.walletBalance = numAmount;
        }
      } else {
        // Handle direct number format
        const numBalance = parseFloat(String(walletBalance)) || 0;
        user.walletBalance = numBalance;
      }
      
      // Ensure balance is never negative
      if (user.walletBalance < 0) {
        user.walletBalance = 0;
      }
    }

    // Update role
    if (role && ['user', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}