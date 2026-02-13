import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User, Transaction } from '@/lib/db/models';

const WITHDRAWAL_FEE_PERCENT = 10; // 10% withdrawal fee (paid externally to fee wallet)

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

    // Minimum withdrawal amount
    const MIN_WITHDRAWAL = 0.01;
    if (withdrawAmount < MIN_WITHDRAWAL) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount is ${MIN_WITHDRAWAL} ETH` },
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

    // Check if user has sufficient balance for withdrawal
    if (user.walletBalance < withdrawAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Calculate fee amount (user pays this externally to fee wallet)
    const feeAmount = withdrawAmount * (WITHDRAWAL_FEE_PERCENT / 100);

    // Deduct ONLY the withdrawal amount from user's balance
    // The fee is paid externally by the user to the fee wallet address
    user.walletBalance -= withdrawAmount;
    await user.save();

    // Create withdrawal transaction record
    const transaction = await Transaction.create({
      type: 'withdrawal',
      user: user._id,
      amount: withdrawAmount,
      status: 'pending',
      metadata: {
        walletAddress,
        feePercent: WITHDRAWAL_FEE_PERCENT,
        feeAmount,
        amountToReceive: withdrawAmount,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction._id.toString(),
        walletAddress,
        withdrawAmount,
        feePercent: WITHDRAWAL_FEE_PERCENT,
        feeAmount,
        amountToReceive: withdrawAmount,
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