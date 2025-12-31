import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT, User, Transaction } from '@/lib/db/models';
import mongoose from 'mongoose';

// POST - Purchase an NFT
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Start a MongoDB session for transaction
  const mongoSession = await mongoose.startSession();

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    // Start transaction
    mongoSession.startTransaction();

    // Find the NFT
    const nft = await NFT.findById(id).session(mongoSession);
    if (!nft) {
      await mongoSession.abortTransaction();
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    // Check if NFT is listed for sale
    if (!nft.isListed) {
      await mongoSession.abortTransaction();
      return NextResponse.json(
        { error: 'This NFT is not available for sale' },
        { status: 400 }
      );
    }

    // Check if buyer is not the current owner
    if (nft.owner.toString() === session.user.id) {
      await mongoSession.abortTransaction();
      return NextResponse.json(
        { error: 'You already own this NFT' },
        { status: 400 }
      );
    }

    // Get buyer
    const buyer = await User.findById(session.user.id).session(mongoSession);
    if (!buyer) {
      await mongoSession.abortTransaction();
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    // Get seller
    const seller = await User.findById(nft.owner).session(mongoSession);
    if (!seller) {
      await mongoSession.abortTransaction();
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Calculate total cost (price + platform fee)
    const platformFeePercent = 0.025; // 2.5% platform fee
    const platformFee = nft.price * platformFeePercent;
    const totalCost = nft.price + platformFee;

    // Check buyer has sufficient balance
    if (buyer.walletBalance < totalCost) {
      await mongoSession.abortTransaction();
      return NextResponse.json(
        { 
          error: 'Insufficient balance',
          required: totalCost,
          available: buyer.walletBalance,
        },
        { status: 400 }
      );
    }

    // Perform the transaction
    // 1. Deduct from buyer
    buyer.walletBalance -= totalCost;
    await buyer.save({ session: mongoSession });

    // 2. Add to seller (minus platform fee)
    const sellerReceives = nft.price - (nft.price * platformFeePercent);
    seller.walletBalance += sellerReceives;
    await seller.save({ session: mongoSession });

    // 3. Transfer ownership
    const previousOwner = nft.owner;
    nft.owner = buyer._id;
    nft.isListed = false; // Automatically delist after purchase
    await nft.save({ session: mongoSession });

    // 4. Create transaction record
    await Transaction.create([{
      type: 'purchase',
      user: buyer._id,
      amount: totalCost,
      status: 'completed',
      nft: nft._id,
      metadata: {
        seller: seller._id,
        previousOwner,
        platformFee,
        sellerReceived: sellerReceives,
        priceAtPurchase: nft.price,
      },
    }], { session: mongoSession });

    // Commit transaction
    await mongoSession.commitTransaction();

    // Populate the NFT with user data for response
    await nft.populate('creator', 'username name avatar');
    await nft.populate('owner', 'username name avatar');

    return NextResponse.json({
      success: true,
      data: {
        nft,
        transaction: {
          totalCost,
          platformFee,
          sellerReceived: sellerReceives,
        },
      },
      message: 'NFT purchased successfully!',
    });
  } catch (error) {
    // Abort transaction on error
    await mongoSession.abortTransaction();
    console.error('NFT purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to complete purchase' },
      { status: 500 }
    );
  } finally {
    mongoSession.endSession();
  }
}