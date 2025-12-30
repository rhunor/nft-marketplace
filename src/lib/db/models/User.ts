import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';
import type { IUserDocument } from '@/types';

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Password is not returned by default in queries
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Static method to find a user by email and password (plain text comparison)
// This replaces the bcrypt-based findByCredentials
UserSchema.statics.findByCredentials = async function (
  email: string,
  password: string
): Promise<IUserDocument | null> {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    return null;
  }

  // Direct plain-text comparison (no hashing)
  if (user.password !== password) {
    return null;
  }

  return user;
};

// Safe model getter that works in Edge runtime
const User: Model<IUserDocument> =
  (mongoose.models?.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>('User', UserSchema);

export default User;