import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
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

// PATCH - Transfer ownership or edit NFT fields (createdAt, views)
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
    const { nftId, newOwnerId, createdAt, views } = body;

    if (!nftId) {
      return NextResponse.json(
        { error: 'NFT ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Edit createdAt / views
    if (createdAt !== undefined || views !== undefined) {
      const $set: Record<string, unknown> = {};
      if (createdAt !== undefined) {
        const d = new Date(createdAt);
        if (isNaN(d.getTime())) {
          return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }
        $set.createdAt = d;
      }
      if (views !== undefined) {
        const v = parseInt(String(views), 10);
        if (isNaN(v) || v < 0) {
          return NextResponse.json({ error: 'Views must be a non-negative number' }, { status: 400 });
        }
        $set.views = v;
      }
      // Use direct collection update to bypass Mongoose timestamps protection
      await NFT.collection.updateOne({ _id: new Types.ObjectId(nftId) }, { $set });

      const updated = await NFT.findById(nftId)
        .populate('creator', 'username name')
        .populate('owner', 'username name')
        .lean();

      return NextResponse.json({ success: true, data: updated, message: 'NFT updated' });
    }

    // Transfer ownership
    if (!newOwnerId) {
      return NextResponse.json(
        { error: 'NFT ID and new owner ID are required' },
        { status: 400 }
      );
    }

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

    nft.owner = newOwner._id;
    await nft.save();

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
      { error: 'Failed to update NFT' },
      { status: 500 }
    );
  }
}
