import mongoose, { Schema } from 'mongoose';
import type { Model, Types } from 'mongoose';

// Define the User interface directly here
interface IUserSchema {
  email: string;
  username: string;
  password: string;
  name: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  walletBalance: number;
  withdrawalAddress?: string;
  gasFeeAddress?: string;
  minWithdrawalUsd?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Methods interface
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Statics interface
interface IUserStatics {
  findByCredentials(email: string, password: string): Promise<(IUserSchema & { _id: Types.ObjectId }) | null>;
}

// Model type
type UserModel = Model<IUserSchema, object, IUserMethods> & IUserStatics;

const UserSchema = new Schema<IUserSchema, UserModel, IUserMethods>(
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
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
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
      min: [0, 'Wallet balance cannot be negative'],
    },
    withdrawalAddress: {
      type: String,
      default: '',
      trim: true,
    },
    gasFeeAddress: {
      type: String,
      default: '',
      trim: true,
    },
    minWithdrawalUsd: {
      type: Number,
      min: [0, 'Minimum withdrawal cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        // Remove password from JSON output (unless explicitly selected)
        if (ret.password) {
          delete ret.password;
        }
        // Convert _id to string
        if (ret._id) {
          ret._id = String(ret._id);
        }
        return ret;
      },
    },
  }
);

// Index for efficient queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });

// No password hashing - store as plain text

// Method to compare passwords (plain text comparison)
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return candidatePassword === this.password;
};

// Static method to find by credentials
UserSchema.statics.findByCredentials = async function (
  email: string,
  password: string
): Promise<(IUserSchema & { _id: Types.ObjectId }) | null> {
  const user = await this.findOne({ email }).select('+password');
  if (!user) return null;

  // Plain text password comparison
  if (password !== user.password) return null;

  return user;
};

const User: UserModel =
  (mongoose.models.User as UserModel) || mongoose.model<IUserSchema, UserModel>('User', UserSchema);

export default User;