import mongoose, { Schema } from 'mongoose';
import type { Model, Types } from 'mongoose';
import type { NFTCategory } from '@/types';

// Define the Collection interface directly here
interface ICollectionSchema {
  name: string;
  description: string;
  coverImage: string;
  coverImagePublicId?: string;
  category: NFTCategory;
  creator: Types.ObjectId;
  nfts: Types.ObjectId[];
  collectionPrice: number; // Price for the entire collection
  floorPrice: number;
  totalVolume: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Methods interface
interface ICollectionMethods {
  updateFloorPrice(): Promise<void>;
}

// Model type
type CollectionModel = Model<ICollectionSchema, object, ICollectionMethods>;

const CollectionSchema = new Schema<ICollectionSchema, CollectionModel, ICollectionMethods>(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
      maxlength: [100, 'Collection name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Collection description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    coverImagePublicId: {
      type: String,
    },
    category: {
      type: String,
      enum: ['ai-images', 'digital-images', 'paintings', 'photography', 'portrait', 'games', 'animation', 'street-photography', 'landscape', 'nature', 'architecture'],
      required: [true, 'Category is required'],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nfts: [{
      type: Schema.Types.ObjectId,
      ref: 'NFT',
    }],
    collectionPrice: {
      type: Number,
      default: 0,
      min: [0, 'Collection price cannot be negative'],
    },
    floorPrice: {
      type: Number,
      default: 0,
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
CollectionSchema.index({ creator: 1, createdAt: -1 });
CollectionSchema.index({ category: 1 });
CollectionSchema.index({ isPublished: 1 });
CollectionSchema.index({ name: 'text', description: 'text' });

// Virtual for NFT count
CollectionSchema.virtual('totalItems').get(function () {
  return this.nfts?.length || 0;
});

// Enable virtuals in JSON
CollectionSchema.set('toJSON', { virtuals: true });
CollectionSchema.set('toObject', { virtuals: true });

// Update floor price when accessed
CollectionSchema.methods.updateFloorPrice = async function () {
  if (this.nfts && this.nfts.length > 0) {
    const NFT = mongoose.model('NFT');
    const nfts = await NFT.find({ 
      _id: { $in: this.nfts }, 
      isListed: true 
    }).select('price');
    
    if (nfts.length > 0) {
      this.floorPrice = Math.min(...nfts.map(n => n.price));
      await this.save();
    }
  }
};

const Collection: CollectionModel =
  (mongoose.models.Collection as CollectionModel) || mongoose.model<ICollectionSchema, CollectionModel>('Collection', CollectionSchema);

export default Collection;