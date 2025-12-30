import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in your environment');
  process.exit(1);
}

// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// NFT Schema
const NFTSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video', 'audio', 'other'] },
    thumbnailUrl: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    isListed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const NFT = mongoose.models.NFT || mongoose.model('NFT', NFTSchema);

// Sample data
const sampleUsers = [
  {
    email: 'admin@nftmarket.com',
    username: 'admin',
    name: 'Admin User',
    password: 'AdminPassword123!',
    role: 'admin',
    walletBalance: 100,
  },
  {
    email: 'astrid@example.com',
    username: 'astridnova',
    name: 'Astrid Nova',
    password: 'UserPassword123!',
    role: 'user',
    walletBalance: 5.5,
  },
  {
    email: 'marcus@example.com',
    username: 'marcuschen',
    name: 'Marcus Chen',
    password: 'UserPassword123!',
    role: 'user',
    walletBalance: 3.2,
  },
  {
    email: 'kai@example.com',
    username: 'kairodriguez',
    name: 'Kai Rodriguez',
    password: 'UserPassword123!',
    role: 'user',
    walletBalance: 8.7,
  },
];

const sampleNFTs = [
  {
    title: 'Cosmic Dreamscape #001',
    description: 'A mesmerizing journey through the cosmos, featuring vibrant nebulae and distant galaxies.',
    mediaUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
    mediaType: 'image',
    price: 2.5,
    category: 'digital-art',
    tags: ['space', 'cosmic', 'abstract', 'nebula'],
    views: 1523,
  },
  {
    title: 'Urban Decay Series #12',
    description: 'Street photography capturing the raw beauty of abandoned urban spaces.',
    mediaUrl: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800&q=80',
    mediaType: 'image',
    price: 0.8,
    category: 'photography',
    tags: ['urban', 'street', 'abandoned', 'architecture'],
    views: 876,
  },
  {
    title: 'Cyber Genesis Avatar',
    description: 'A futuristic character design for the Cyber Genesis gaming universe.',
    mediaUrl: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80',
    mediaType: 'image',
    price: 5.2,
    category: 'games',
    tags: ['gaming', 'character', 'cyberpunk', 'avatar'],
    views: 2341,
  },
  {
    title: 'Midnight Ocean Waves',
    description: 'Long exposure photography of ocean waves under moonlight.',
    mediaUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    mediaType: 'image',
    price: 1.2,
    category: 'photography',
    tags: ['ocean', 'night', 'long-exposure', 'nature'],
    views: 1987,
  },
  {
    title: 'Neon Dreams Collection',
    description: 'Abstract digital art piece featuring flowing neon colors and geometric patterns.',
    mediaUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80',
    mediaType: 'image',
    price: 3.7,
    category: 'digital-art',
    tags: ['neon', 'abstract', 'geometric', 'vibrant'],
    views: 3456,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await NFT.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`  Created user: ${user.email}`);
    }

    // Create NFTs
    console.log('Creating NFTs...');
    for (let i = 0; i < sampleNFTs.length; i++) {
      const nftData = sampleNFTs[i];
      const creatorIndex = (i % (createdUsers.length - 1)) + 1; // Skip admin
      const creator = createdUsers[creatorIndex];

      const nft = await NFT.create({
        ...nftData,
        creator: creator!._id,
        owner: creator!._id,
        isListed: true,
      });
      console.log(`  Created NFT: ${nft.title}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('  Email: admin@nftmarket.com');
    console.log('  Password: AdminPassword123!');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
