import mongoose, { Schema, Types } from 'mongoose';
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
      enum: ['new', 'photography', 'digital-art', 'games', 'music', 'video', 'collectibles'],
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

const NFT: Model<INFTDocument> =
  mongoose.models.NFT || mongoose.model<INFTDocument>('NFT', NFTSchema);

export default NFT;