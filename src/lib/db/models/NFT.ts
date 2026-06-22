import mongoose, { Schema, Types } from 'mongoose';
import type { Model } from 'mongoose';

// Define the NFT interface directly here to avoid TypeScript conflicts with Document.collection
interface INFTSchema {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
  price: number;
  category: string;
  tags: string[];
  creator: Types.ObjectId;
  owner: Types.ObjectId;
  nftCollection?: Types.ObjectId | null;
  likes: Types.ObjectId[];
  views: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Methods interface
interface INFTMethods {
  toggleLike(userId: Types.ObjectId | string): Promise<INFTSchema>;
  incrementViews(): Promise<INFTSchema>;
}

// Model type
type NFTModel = Model<INFTSchema, object, INFTMethods>;

const NFTSchema = new Schema<INFTSchema, NFTModel, INFTMethods>(
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
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio', 'other'],
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
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
      enum: ['ai-images', 'digital-images', 'paintings', 'photography', 'portrait', 'games', 'animation', 'street-photography', 'landscape', 'nature', 'architecture'],
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
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
    nftCollection: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
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
      min: 0,
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

// Indexes for efficient queries
NFTSchema.index({ title: 'text', description: 'text', tags: 'text' });
NFTSchema.index({ category: 1 });
NFTSchema.index({ price: 1 });
NFTSchema.index({ creator: 1 });
NFTSchema.index({ owner: 1 });
NFTSchema.index({ nftCollection: 1 });
NFTSchema.index({ createdAt: -1 });
NFTSchema.index({ views: -1 });
NFTSchema.index({ isListed: 1 });

// Virtual for like count
NFTSchema.virtual('likeCount').get(function () {
  return this.likes?.length || 0;
});

// Instance method to toggle like
NFTSchema.methods.toggleLike = async function (userId: Types.ObjectId | string) {
  const userIdStr = typeof userId === 'string' ? userId : userId.toString();
  const index = this.likes.findIndex(
    (like: Types.ObjectId) => like.toString() === userIdStr
  );
  if (index === -1) {
    this.likes.push(new Types.ObjectId(userIdStr));
  } else {
    this.likes.splice(index, 1);
  }
  return this.save();
};

// Instance method to increment views
NFTSchema.methods.incrementViews = async function () {
  this.views += 1;
  return this.save();
};

// Ensure virtuals are included when converting to JSON/Object
NFTSchema.set('toJSON', { virtuals: true });
NFTSchema.set('toObject', { virtuals: true });

const NFT: NFTModel =
  (mongoose.models.NFT as NFTModel) || mongoose.model<INFTSchema, NFTModel>('NFT', NFTSchema);

export default NFT;