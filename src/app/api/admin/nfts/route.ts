import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT, User } from '@/lib/db/models';

// GET - List all NFTs with admin details
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
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [nfts, total] = await Promise.all([
      NFT.find(query)
        .populate('creator', 'username name email')
        .populate('owner', 'username name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NFT.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        nfts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin NFTs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

// PATCH - Transfer ownership
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
    const { nftId, newOwnerId } = body;

    if (!nftId || !newOwnerId) {
      return NextResponse.json(
        { error: 'NFT ID and new owner ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const [nft, newOwner] = await Promise.all([
      NFT.findById(nftId),
      User.findById(newOwnerId),
    ]);

    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    if (!newOwner) {
      return NextResponse.json(
        { error: 'New owner not found' },
        { status: 404 }
      );
    }

    // Transfer ownership
    nft.owner = newOwner._id;
    await nft.save();

    // Populate the updated NFT
    await nft.populate('creator', 'username name');
    await nft.populate('owner', 'username name');

    return NextResponse.json({
      success: true,
      data: nft,
      message: `Ownership transferred to @${newOwner.username}`,
    });
  } catch (error) {
    console.error('Admin NFT transfer error:', error);
    return NextResponse.json(
      { error: 'Failed to transfer ownership' },
      { status: 500 }
    );
  }
}
