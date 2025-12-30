import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';
import type { ITransactionDocument } from '@/types';

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    type: {
      type: String,
      enum: ['deposit', 'purchase', 'upload_fee', 'withdrawal'],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    nft: {
      type: Schema.Types.ObjectId,
      ref: 'NFT',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Safe model getter that works in Edge runtime
const Transaction: Model<ITransactionDocument> = 
  (mongoose.models?.Transaction as Model<ITransactionDocument>) || 
  mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);

export default Transaction;