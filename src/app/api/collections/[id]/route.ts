import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Collection } from '@/lib/db/models';
import { Types } from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Type for populated NFT
interface PopulatedNFT {
  _id: Types.ObjectId;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  thumbnailUrl?: string;
  price: number;
  category: string;
  tags: string[];
  creator: {
    _id: Types.ObjectId;
    name: string;
    username: string;
    avatar?: string;
  };
  owner: {
    _id: Types.ObjectId;
    name: string;
    username: string;
    avatar?: string;
  };
  likes: Types.ObjectId[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type for populated collection
interface PopulatedCollection {
  _id: Types.ObjectId;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  creator: {
    _id: Types.ObjectId;
    name: string;
    username: string;
    avatar?: string;
  };
  nfts: PopulatedNFT[];
  floorPrice: number;
  totalVolume: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Get single collection with all its NFTs
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid collection ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const collection = await Collection.findById(id)
      .populate('creator', 'name username avatar')
      .populate({
        path: 'nfts',
        populate: [
          { path: 'creator', select: 'name username avatar' },
          { path: 'owner', select: 'name username avatar' },
        ],
      })
      .lean() as PopulatedCollection | null;

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Serialize the collection
    const serializedCollection = {
      ...collection,
      _id: collection._id.toString(),
      creator: {
        ...collection.creator,
        _id: collection.creator._id.toString(),
      },
      nfts: collection.nfts.map((nft) => ({
        ...nft,
        _id: nft._id.toString(),
        creator: {
          ...nft.creator,
          _id: nft.creator._id.toString(),
        },
        owner: {
          ...nft.owner,
          _id: nft.owner._id.toString(),
        },
        likes: nft.likes?.map((l) => l.toString()) || [],
      })),
      totalItems: collection.nfts?.length || 0,
    };

    return NextResponse.json({
      success: true,
      data: serializedCollection,
    });
  } catch (error) {
    console.error('Collection fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}