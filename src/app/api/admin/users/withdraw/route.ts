import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models';

const WITHDRAWAL_FEE_PERCENT = 10; // 10% withdrawal fee
const FALLBACK_ETH_PRICE = 3500;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { walletAddress, amount } = body;

    // Validate wallet address (basic Ethereum address validation)
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address. Please provide a valid Ethereum address.' },
        { status: 400 }
      );
    }

    // Validate amount
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid withdrawal amount' },
        { status: 400 }
      );
    }

    let ethPriceUsd = FALLBACK_ETH_PRICE;
    try {
      const priceResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/eth-price`);
      if (priceResponse.ok) {
        const priceData = await priceResponse.json() as { data: { price: number } };
        ethPriceUsd = priceData.data.price;
      }
    } catch { /* use fallback */ }

    if (withdrawAmount * ethPriceUsd < 5000) {
      return NextResponse.json(
        { error: 'Withdrawal amount is too low to process' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user and check balance
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has sufficient balance
    if (user.walletBalance < withdrawAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Calculate fee and net amount
    const feeAmount = withdrawAmount * (WITHDRAWAL_FEE_PERCENT / 100);
    const netAmount = withdrawAmount - feeAmount;

    // Deduct from user's balance
    user.walletBalance -= withdrawAmount;
    await user.save();

    // In a real application, you would:
    // 1. Create a withdrawal record in the database
    // 2. Queue the transaction for processing
    // 3. Integrate with actual blockchain/payment processor
    // For now, we'll simulate a successful withdrawal

    return NextResponse.json({
      success: true,
      data: {
        transactionId: `WD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        walletAddress,
        requestedAmount: withdrawAmount,
        feePercent: WITHDRAWAL_FEE_PERCENT,
        feeAmount,
        netAmount,
        newBalance: user.walletBalance,
        status: 'pending',
        estimatedTime: '24-48 hours',
        message: 'Your withdrawal request has been submitted and is being processed.',
      },
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}