import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { User, NFT } from '@/lib/db/models';

// GET - Get current user profile with stats
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user
    const user = await User.findById(session.user.id)
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get NFT stats
    const [createdCount, ownedCount, listedCount] = await Promise.all([
      NFT.countDocuments({ creator: user._id }),
      NFT.countDocuments({ owner: user._id }),
      NFT.countDocuments({ owner: user._id, isListed: true }),
    ]);

    // Calculate total value of owned NFTs
    const ownedNFTs = await NFT.find({ owner: user._id }).select('price').lean();
    const totalValue = ownedNFTs.reduce((sum, nft) => sum + nft.price, 0);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          role: user.role,
          walletBalance: user.walletBalance,
          createdAt: user.createdAt,
        },
        stats: {
          created: createdCount,
          owned: ownedCount,
          listed: listedCount,
          totalValue,
        },
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH - Update current user profile
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, avatar } = body;

    await connectDB();

    // Only allow updating certain fields
    const updates: Record<string, string> = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}