import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT } from '@/lib/db/models';

// GET - Get single NFT
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const nft = await NFT.findById(id)
      .populate('creator', 'username name avatar')
      .populate('owner', 'username name avatar')
      .lean();

    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    // Increment views
    await NFT.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: nft,
    });
  } catch (error) {
    console.error('NFT fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFT' },
      { status: 500 }
    );
  }
}

// PATCH - Update NFT (owner only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const nft = await NFT.findById(id);
    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (nft.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not own this NFT' },
        { status: 403 }
      );
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'price', 'tags', 'isListed'];
    const updates: Record<string, unknown> = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const updatedNFT = await NFT.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    )
      .populate('creator', 'username name avatar')
      .populate('owner', 'username name avatar');

    return NextResponse.json({
      success: true,
      data: updatedNFT,
    });
  } catch (error) {
    console.error('NFT update error:', error);
    return NextResponse.json(
      { error: 'Failed to update NFT' },
      { status: 500 }
    );
  }
}

// DELETE - Delete NFT (owner only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const nft = await NFT.findById(id);
    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    // Check ownership or admin
    if (nft.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not own this NFT' },
        { status: 403 }
      );
    }

    await NFT.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'NFT deleted successfully',
    });
  } catch (error) {
    console.error('NFT delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete NFT' },
      { status: 500 }
    );
  }
}
