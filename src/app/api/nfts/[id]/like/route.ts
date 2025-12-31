import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT } from '@/lib/db/models';
import mongoose from 'mongoose';

// POST - Toggle like on an NFT
export async function POST(
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

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const likeIndex = nft.likes.findIndex(
      (like) => like.toString() === session.user.id
    );

    let liked: boolean;
    if (likeIndex === -1) {
      // Add like
      nft.likes.push(userId);
      liked = true;
    } else {
      // Remove like
      nft.likes.splice(likeIndex, 1);
      liked = false;
    }

    await nft.save();

    return NextResponse.json({
      success: true,
      data: {
        liked,
        likeCount: nft.likes.length,
      },
    });
  } catch (error) {
    console.error('NFT like error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}