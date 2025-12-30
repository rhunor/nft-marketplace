# NFT Marketplace

A full-featured NFT marketplace built with Next.js 15, TypeScript, MongoDB, and AWS S3. This platform allows users to discover, create, and trade digital collectibles.

## Features

### For Users
- 🏠 **Browse & Discover**: Explore NFTs with filtering by category, price, and search
- 🔐 **Authentication**: Sign in with email/password or Google OAuth
- 💰 **Wallet System**: Simulated ETH wallet with deposit functionality
- 🎨 **Create NFTs**: Upload and mint your digital artwork
- 🛒 **Purchase NFTs**: Buy NFTs from other creators
- 📊 **Dashboard**: View owned and created NFTs

### For Admins
- 👥 **User Management**: View, edit, and manage all users
- 💵 **Balance Management**: Manually update user wallet balances
- 🖼️ **NFT Management**: View, transfer ownership, and delete NFTs
- 📈 **Dashboard**: Overview stats and recent activity

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **File Storage**: AWS S3
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- AWS account (for S3)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nft-marketplace.git
cd nft-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
# Authentication
AUTH_SECRET=your-auth-secret-here
AUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://...

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket

# ETH Address for deposits
ETH_DEPOSIT_ADDRESS=0x...

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

The application will automatically connect to MongoDB when you start it. For initial data:

1. Register a new user account
2. Use the admin panel to set up initial NFTs
3. Or run the seed script (if available)

### Creating an Admin User

1. Register a normal user account
2. Connect to your MongoDB database
3. Update the user's role to "admin":
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Main pages with header/footer
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Header, Footer
│   ├── nft/              # NFT-specific components
│   └── auth/             # Auth components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database connection and models
│   ├── utils/            # Helper functions
│   └── validations/      # Zod schemas
├── types/                 # TypeScript type definitions
└── styles/               # Global styles
```

## Key Features Explained

### Simulated Blockchain

This marketplace simulates blockchain functionality:
- **No real ETH transactions**: All balances are managed in the database
- **Gas fees**: Upload fee (~$200 worth of ETH) is deducted from balance
- **Deposits**: Users send ETH to a provided address, admin manually updates balance
- **Purchases**: Ownership transfer is manual via admin panel

### Authentication Flow

1. Users can register with email/password or Google
2. Sessions are managed with JWT
3. Protected routes require authentication
4. Admin routes require admin role

### File Upload

1. Files are uploaded to AWS S3
2. Supported formats: images, videos, audio
3. Max file size: 100MB
4. URLs are stored in MongoDB

## API Endpoints

### Public
- `GET /api/nfts` - List NFTs with filters
- `GET /api/nfts/[id]` - Get single NFT

### Protected (requires auth)
- `POST /api/nfts` - Create NFT
- `PATCH /api/nfts/[id]` - Update NFT
- `DELETE /api/nfts/[id]` - Delete NFT

### Admin Only
- `GET /api/admin` - Dashboard stats
- `GET/PATCH /api/admin/users` - User management
- `GET/PATCH /api/admin/nfts` - NFT management

## Scripts

```bash
npm run dev        # Start development server (Turbopack)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run test       # Run tests
npm run type-check # TypeScript check
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure you set all environment variables and have Node.js 18+ available.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://authjs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
