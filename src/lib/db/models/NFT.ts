import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';
import type { INFTDocument } from '@/types';

const NFTSchema = new Schema<INFTDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio', 'other'],
      default: 'image',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['digital-art', 'photography', 'music', 'video', 'games', 'collectibles'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Maximum 10 tags allowed',
      },
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for like count
NFTSchema.virtual('likeCount').get(function () {
  return this.likes?.length || 0;
});

// Method to toggle like
NFTSchema.methods.toggleLike = async function (userId: string): Promise<boolean> {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  await this.save();
  return index === -1;
};

// Method to increment views
NFTSchema.methods.incrementViews = async function (): Promise<void> {
  this.views += 1;
  await this.save();
};

// Safe model getter that works in Edge runtime
const NFT: Model<INFTDocument> = 
  (mongoose.models?.NFT as Model<INFTDocument>) || 
  mongoose.model<INFTDocument>('NFT', NFTSchema);

export default NFT;