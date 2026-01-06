import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT } from '@/lib/db/models';
import type { Types } from 'mongoose';

// GET - Get current user's NFTs (created or owned)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'owned'; // 'owned', 'created', 'listed'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    await connectDB();

    // Build query based on type
    const query: Record<string, unknown> = {};
    
    switch (type) {
      case 'created':
        query.creator = session.user.id;
        break;
      case 'listed':
        query.owner = session.user.id;
        query.isListed = true;
        break;
      case 'owned':
      default:
        query.owner = session.user.id;
        break;
    }

    const skip = (page - 1) * limit;

    const [nfts, totalItems] = await Promise.all([
      NFT.find(query)
        .populate('creator', 'username name avatar')
        .populate('owner', 'username name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NFT.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    // Helper function to serialize user
    const serializeUser = (user: unknown) => {
      if (!user || typeof user !== 'object') return null;
      const u = user as { _id?: Types.ObjectId; username?: string; name?: string; avatar?: string };
      if (!u._id || !u.username || !u.name) return null;
      return {
        _id: u._id.toString(),
        username: u.username,
        name: u.name,
        avatar: u.avatar || '',
      };
    };

    // Serialize NFTs properly
    const serializedNFTs = nfts.map((nft) => ({
      _id: nft._id.toString(),
      title: nft.title,
      description: nft.description,
      mediaUrl: nft.mediaUrl,
      mediaType: nft.mediaType,
      thumbnailUrl: nft.thumbnailUrl || nft.mediaUrl,
      price: nft.price,
      category: nft.category,
      tags: nft.tags || [],
      creator: serializeUser(nft.creator),
      owner: serializeUser(nft.owner),
      likes: (nft.likes || []).map((l: Types.ObjectId) => l.toString()),
      views: nft.views || 0,
      isListed: nft.isListed,
      createdAt: nft.createdAt,
      updatedAt: nft.updatedAt,
    }));

    const response = NextResponse.json({
      success: true,
      data: {
        items: serializedNFTs,
        totalItems,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    
    return response;
  } catch (error) {
    console.error('User NFTs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}