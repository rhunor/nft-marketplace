import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connection';
import { NFT, User } from '@/lib/db/models';
import { nftSchema } from '@/lib/validations';
import { uploadToS3, validateFile } from '@/lib/utils/s3';
import { calculateUploadFee, getMediaType } from '@/lib/utils';

// GET - List NFTs with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('q');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const creator = searchParams.get('creator');
    const owner = searchParams.get('owner');

    await connectDB();

    // Build query
    const query: Record<string, unknown> = { isListed: true };

    if (category) {
      query.category = category;
    }

    if (creator) {
      query.creator = creator;
    }

    if (owner) {
      query.owner = owner;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const skip = (page - 1) * limit;
    const [nfts, totalItems] = await Promise.all([
      NFT.find(query)
        .populate('creator', 'username name avatar')
        .populate('owner', 'username name avatar')
        .sort(sort)
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
    console.error('NFT list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

// POST - Create new NFT
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Validate form data
    const formValidation = nftSchema.safeParse({
      title,
      description,
      price,
      category,
      tags,
    });

    if (!formValidation.success) {
      return NextResponse.json(
        { error: formValidation.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check user balance
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const uploadFee = calculateUploadFee();
    if (user.walletBalance < uploadFee) {
      return NextResponse.json(
        { error: 'Insufficient balance for upload fee' },
        { status: 400 }
      );
    }

    // Upload to S3
    const uploadResult = await uploadToS3(file);
    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Create NFT
    const nft = await NFT.create({
      title,
      description,
      mediaUrl: uploadResult.url,
      mediaType: getMediaType(file.name),
      price,
      category,
      tags,
      creator: user._id,
      owner: user._id,
      isListed: true,
    });

    // Deduct upload fee
    user.walletBalance -= uploadFee;
    await user.save();

    // Populate creator and owner
    await nft.populate('creator', 'username name avatar');
    await nft.populate('owner', 'username name avatar');

    return NextResponse.json(
      {
        success: true,
        data: nft,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('NFT creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create NFT' },
      { status: 500 }
    );
  }
}
