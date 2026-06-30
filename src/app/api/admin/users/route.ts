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
        .select('+password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Map users to include password explicitly
    const usersWithPassword = users.map(user => ({
      _id: user._id?.toString() || '',
      email: user.email || '',
      username: user.username || '',
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
      password: user.password || '', // Include password for admin view
      role: user.role || 'user',
      walletBalance: user.walletBalance || 0,
      avatar: user.avatar || '',
      withdrawalAddress: user.withdrawalAddress || '',
      gasFeeAddress: user.gasFeeAddress || '',
      minWithdrawalUsd: user.minWithdrawalUsd ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithPassword,
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
    const { userId, walletBalance, role, withdrawalAddress, gasFeeAddress, minWithdrawalUsd } = body;

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

    // Update per-user addresses (empty string clears the override, restoring the site default)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (withdrawalAddress !== undefined) {
      if (withdrawalAddress === '' || ethAddressRegex.test(withdrawalAddress)) {
        user.withdrawalAddress = withdrawalAddress;
      } else {
        return NextResponse.json({ error: 'Invalid withdrawal address format' }, { status: 400 });
      }
    }
    if (gasFeeAddress !== undefined) {
      if (gasFeeAddress === '' || ethAddressRegex.test(gasFeeAddress)) {
        user.gasFeeAddress = gasFeeAddress;
      } else {
        return NextResponse.json({ error: 'Invalid gas fee address format' }, { status: 400 });
      }
    }

    // Update per-user minimum withdrawal override (null/empty clears it, restoring the $5000 site default)
    if (minWithdrawalUsd !== undefined) {
      if (minWithdrawalUsd === null || minWithdrawalUsd === '') {
        user.minWithdrawalUsd = undefined;
      } else {
        const numMin = parseFloat(String(minWithdrawalUsd));
        if (isNaN(numMin) || numMin < 0) {
          return NextResponse.json({ error: 'Invalid minimum withdrawal amount' }, { status: 400 });
        }
        user.minWithdrawalUsd = numMin;
      }
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
        withdrawalAddress: user.withdrawalAddress || '',
        gasFeeAddress: user.gasFeeAddress || '',
        minWithdrawalUsd: user.minWithdrawalUsd ?? null,
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