import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT } from '@/lib/db/models';

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

    return NextResponse.json({
      success: true,
      data: {
        items: nfts,
        totalItems,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('User NFTs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}