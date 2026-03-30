import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { Collection, NFT, User, Transaction } from '@/lib/db/models';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { Types } from 'mongoose';
import type { NFTCategory } from '@/types';

// GET - List collections
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const creator = searchParams.get('creator');
    const search = searchParams.get('q');

    await connectDB();

    const query: Record<string, unknown> = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (creator) {
      query.creator = creator;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      Collection.find(query)
        .populate('creator', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Collection.countDocuments(query),
    ]);

    // Serialize collections for response
    const serializedCollections = collections.map((c) => {
      // After populate, creator is an object, not ObjectId
      const creatorObj = c.creator as unknown as { _id: Types.ObjectId; name: string; username: string; avatar?: string } | null;
      return {
        _id: c._id.toString(),
        name: c.name,
        description: c.description,
        coverImage: c.coverImage,
        category: c.category,
        creator: creatorObj ? {
          _id: creatorObj._id.toString(),
          name: creatorObj.name,
          username: creatorObj.username,
          avatar: creatorObj.avatar || '',
        } : null,
        nfts: c.nfts?.map((n: Types.ObjectId) => n.toString()) || [],
        floorPrice: c.floorPrice,
        totalVolume: c.totalVolume,
        totalItems: c.nfts?.length || 0,
        isPublished: c.isPublished,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: serializedCollections,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Collections fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST - Create a new collection with multiple NFTs
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'One or more files are too large. Please use smaller files and try again.' },
        { status: 413 }
      );
    }

    // Collection data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as NFTCategory;
    const coverImageFile = formData.get('coverImage') as File | null;
    const collectionPriceStr = formData.get('collectionPrice') as string | null;
    const collectionPrice = collectionPriceStr ? parseFloat(collectionPriceStr) : 0;

    // NFT items data (JSON string)
    const itemsJson = formData.get('items') as string;
    let items: Array<{
      title: string;
      description: string;
      price: number;
      tags: string[];
    }> = [];

    try {
      items = JSON.parse(itemsJson);
    } catch {
      return NextResponse.json(
        { error: 'Invalid items data' },
        { status: 400 }
      );
    }

    // Validate collection data
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      );
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Collection description is required' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    if (!items || items.length < 2) {
      return NextResponse.json(
        { error: 'A collection must have at least 2 items' },
        { status: 400 }
      );
    }

    if (items.length > 20) {
      return NextResponse.json(
        { error: 'A collection cannot have more than 20 items' },
        { status: 400 }
      );
    }

    // Get NFT files - validate all files exist first
    const nftFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const file = formData.get(`file_${i}`);
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: `Missing file for item ${i + 1}` },
          { status: 400 }
        );
      }
      nftFiles.push(file);
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

    // Calculate upload fee - $200 per photo
    const PRICE_PER_PHOTO_USD = 200;
    const FALLBACK_ETH_PRICE = 3500;
    
    // Try to get current ETH price
    let ethPriceUsd = FALLBACK_ETH_PRICE;
    try {
      const priceResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/eth-price`);
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        if (priceData.success && priceData.data?.price) {
          ethPriceUsd = priceData.data.price;
        }
      }
    } catch {
      // Use fallback price
    }
    
    const pricePerPhotoInEth = PRICE_PER_PHOTO_USD / ethPriceUsd;
    const totalFee = pricePerPhotoInEth * items.length;

    // Allow a $5 USD tolerance to absorb ETH price volatility between UI check and API check
    const bufferInEth = 5 / ethPriceUsd;
    if (user.walletBalance < (totalFee - bufferInEth)) {
      return NextResponse.json(
        { error: `Insufficient balance. Required: ${totalFee.toFixed(4)} ETH ($${(items.length * PRICE_PER_PHOTO_USD).toLocaleString()})` },
        { status: 400 }
      );
    }

    // Upload cover image
    let coverImageUrl = '';
    let coverImagePublicId = '';

    if (coverImageFile && coverImageFile.size > 0) {
      const coverResult = await uploadToCloudinary(coverImageFile, 'collection-covers');
      if (!coverResult.success || !coverResult.url) {
        return NextResponse.json(
          { error: 'Failed to upload cover image' },
          { status: 500 }
        );
      }
      coverImageUrl = coverResult.url;
      coverImagePublicId = coverResult.publicId || '';
    } else {
      // Use first NFT image as cover
      const firstFile = nftFiles[0];
      if (firstFile) {
        const firstFileResult = await uploadToCloudinary(firstFile, 'nft-uploads');
        if (!firstFileResult.success || !firstFileResult.url) {
          return NextResponse.json(
            { error: 'Failed to upload first file' },
            { status: 500 }
          );
        }
        coverImageUrl = firstFileResult.url;
        coverImagePublicId = firstFileResult.publicId || '';
      }
    }

    // Create the collection first
    const collection = await Collection.create({
      name: name.trim(),
      description: description.trim(),
      coverImage: coverImageUrl,
      coverImagePublicId,
      category,
      creator: user._id,
      nfts: [],
      collectionPrice: collectionPrice || Math.min(...items.map((item) => item.price)) * items.length,
      floorPrice: Math.min(...items.map((item) => item.price)),
      totalVolume: 0,
      isPublished: true,
    });

    // Upload all NFT files and create NFTs
    const createdNFTIds: Types.ObjectId[] = [];
    const createdNFTPrices: number[] = [];
    const uploadErrors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const file = nftFiles[i];

      // TypeScript safety - we already validated these exist
      if (!item || !file) {
        uploadErrors.push(`Item ${i + 1}: Missing data`);
        continue;
      }

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(file, `collections/${collection._id}`);

        if (!uploadResult.success || !uploadResult.url) {
          uploadErrors.push(`Item ${i + 1}: ${item.title} - Upload failed`);
          continue;
        }

        // Determine media type
        let mediaType: 'image' | 'video' | 'audio' | 'other' = 'image';
        if (file.type.startsWith('video/')) {
          mediaType = 'video';
        } else if (file.type.startsWith('audio/')) {
          mediaType = 'audio';
        }

        // Create NFT
        const nft = await NFT.create({
          title: item.title.trim(),
          description: item.description.trim(),
          mediaUrl: uploadResult.url,
          mediaType,
          thumbnailUrl: uploadResult.thumbnailUrl || uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId || '',
          price: item.price,
          category,
          tags: item.tags || [],
          creator: user._id,
          owner: user._id,
          nftCollection: collection._id,
          likes: [],
          views: 0,
          isListed: true,
        });

        createdNFTIds.push(nft._id);
        createdNFTPrices.push(nft.price);
      } catch (error) {
        console.error(`Error uploading item ${i}:`, error);
        uploadErrors.push(`Item ${i + 1}: ${item.title}`);
      }
    }

    // Update collection with NFT IDs
    collection.nfts = createdNFTIds;
    if (createdNFTPrices.length > 0) {
      collection.floorPrice = Math.min(...createdNFTPrices);
    }
    await collection.save();

    // Deduct fee from user balance (clamp to 0 in case buffer was applied)
    user.walletBalance = Math.max(0, user.walletBalance - totalFee);
    await user.save();

    // Create transaction record
    await Transaction.create({
      type: 'upload_fee',
      user: user._id,
      amount: totalFee,
      status: 'completed',
      metadata: {
        collectionId: collection._id.toString(),
        collectionName: collection.name,
        nftCount: createdNFTIds.length,
      },
    });

    // Populate creator for response
    const populatedCollection = await Collection.findById(collection._id)
      .populate('creator', 'name username avatar')
      .populate({
        path: 'nfts',
        populate: {
          path: 'creator owner',
          select: 'name username avatar',
        },
      })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        collection: populatedCollection ? {
          ...populatedCollection,
          _id: populatedCollection._id.toString(),
          totalItems: createdNFTIds.length,
        } : null,
        uploadedCount: createdNFTIds.length,
        errors: uploadErrors,
        fee: totalFee,
        newBalance: user.walletBalance,
      },
    });
  } catch (error) {
    console.error('Collection creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}