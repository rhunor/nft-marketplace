import type { NFTCategory } from '@/types';

// Sample NFT Collection data
export interface SampleNFTCollection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  totalItems: number;
  floorPrice: number;
  totalVolume: number;
  category: NFTCategory;
  items: SampleNFT[];
}

// Sample NFT data for initial display
export interface SampleNFT {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  price: number;
  category: NFTCategory;
  tags: string[];
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  ownerName: string;
  ownerUsername: string;
  ownerAvatar: string;
  likes: number;
  views: number;
  collectionId: string;
}

// Creator data
const creators = [
  { creatorName: 'Astrid Nova', creatorUsername: 'astridnova', creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { creatorName: 'Marcus Chen', creatorUsername: 'marcuschen', creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { creatorName: 'Kai Rodriguez', creatorUsername: 'kairodriguez', creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { creatorName: 'Sofia Andersson', creatorUsername: 'sofiaandersson', creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { creatorName: 'Digital Dreams Studio', creatorUsername: 'digitaldreams', creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
  { creatorName: 'Luna Martinez', creatorUsername: 'lunamartinez', creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { creatorName: 'Oliver Kim', creatorUsername: 'oliverkim', creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
  { creatorName: 'Aria Thompson', creatorUsername: 'ariathompson', creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { creatorName: 'Neo Collective', creatorUsername: 'neocollective', creatorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80' },
  { creatorName: 'Zara Williams', creatorUsername: 'zarawilliams', creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { creatorName: 'Pixel Masters', creatorUsername: 'pixelmasters', creatorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80' },
  { creatorName: 'Elena Frost', creatorUsername: 'elenafrost', creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
];

// Owner data
const owners = [
  { ownerName: 'Elena Voss', ownerUsername: 'elenavoss', ownerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { ownerName: 'James Wilson', ownerUsername: 'jameswilson', ownerAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80' },
  { ownerName: 'Alex Turner', ownerUsername: 'alexturner', ownerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&q=80' },
  { ownerName: 'Nathan Park', ownerUsername: 'nathanpark', ownerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80' },
  { ownerName: 'Lily Patel', ownerUsername: 'lilypatel', ownerAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80' },
  { ownerName: 'David Chang', ownerUsername: 'davidchang', ownerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { ownerName: 'Maya Johnson', ownerUsername: 'mayajohnson', ownerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { ownerName: 'Chris Anderson', ownerUsername: 'chrisanderson', ownerAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80' },
  { ownerName: 'Sarah Mitchell', ownerUsername: 'sarahmitchell', ownerAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&q=80' },
  { ownerName: 'Ryan Cooper', ownerUsername: 'ryancooper', ownerAvatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&q=80' },
];

// Helper functions
const getCreator = (index: number) => creators[index % creators.length]!;
const getOwner = (index: number) => owners[index % owners.length]!;

// NFT Collections - 29 total
export const sampleCollections: SampleNFTCollection[] = [
  // Collection 1: Cosmic Dreamscapes
  {
    id: 'collection-1',
    name: 'Cosmic Dreamscapes',
    description: 'A mesmerizing journey through the cosmos, featuring vibrant nebulae and distant galaxies.',
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
    creatorName: 'Astrid Nova',
    creatorUsername: 'astridnova',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    totalItems: 4,
    floorPrice: 12.5,
    totalVolume: 156.8,
    category: 'digital-art',
    items: [
      { id: '1', title: 'Cosmic Dreamscape #001', description: 'A vibrant nebula captured in digital form.', mediaUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80', mediaType: 'image', price: 12.5, category: 'digital-art', tags: ['space', 'cosmic'], ...getCreator(0), ...getOwner(0), likes: 1342, views: 7523, collectionId: 'collection-1' },
      { id: '2', title: 'Cosmic Dreamscape #002', description: 'Swirling galaxies in eternal dance.', mediaUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80', mediaType: 'image', price: 15.0, category: 'digital-art', tags: ['galaxy', 'stars'], ...getCreator(0), ...getOwner(1), likes: 987, views: 5234, collectionId: 'collection-1' },
      { id: '3', title: 'Cosmic Dreamscape #003', description: 'Stellar nursery in magnificent colors.', mediaUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80', mediaType: 'image', price: 18.5, category: 'digital-art', tags: ['nebula', 'birth'], ...getCreator(0), ...getOwner(2), likes: 1567, views: 8901, collectionId: 'collection-1' },
      { id: '4', title: 'Cosmic Dreamscape #004', description: 'Edge of the universe.', mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', mediaType: 'image', price: 22.0, category: 'digital-art', tags: ['universe', 'infinity'], ...getCreator(0), ...getOwner(3), likes: 2134, views: 12456, collectionId: 'collection-1' },
    ],
  },
  // Collection 2: Urban Decay
  {
    id: 'collection-2',
    name: 'Urban Decay Series',
    description: 'Street photography capturing the raw beauty of abandoned urban spaces.',
    coverImage: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800&q=80',
    creatorName: 'Marcus Chen',
    creatorUsername: 'marcuschen',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    totalItems: 3,
    floorPrice: 4.0,
    totalVolume: 89.5,
    category: 'photography',
    items: [
      { id: '5', title: 'Urban Decay #001', description: 'Abandoned factory in Detroit.', mediaUrl: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800&q=80', mediaType: 'image', price: 4.0, category: 'photography', tags: ['urban', 'abandoned'], ...getCreator(1), ...getOwner(4), likes: 789, views: 4567, collectionId: 'collection-2' },
      { id: '6', title: 'Urban Decay #002', description: 'Graffiti walls of Berlin.', mediaUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80', mediaType: 'image', price: 5.5, category: 'photography', tags: ['graffiti', 'street'], ...getCreator(1), ...getOwner(5), likes: 654, views: 3890, collectionId: 'collection-2' },
      { id: '7', title: 'Urban Decay #003', description: 'Neon lights in Tokyo alleys.', mediaUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', mediaType: 'image', price: 6.75, category: 'photography', tags: ['tokyo', 'neon'], ...getCreator(1), ...getOwner(6), likes: 1123, views: 6234, collectionId: 'collection-2' },
    ],
  },
  // Collection 3: Cyber Genesis
  {
    id: 'collection-3',
    name: 'Cyber Genesis',
    description: 'Futuristic character designs with cybernetic enhancements.',
    coverImage: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80',
    creatorName: 'Kai Rodriguez',
    creatorUsername: 'kairodriguez',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    totalItems: 4,
    floorPrice: 26.0,
    totalVolume: 234.5,
    category: 'games',
    items: [
      { id: '8', title: 'Cyber Genesis - Hacker', description: 'Elite hacker with neural implants.', mediaUrl: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80', mediaType: 'image', price: 26.0, category: 'games', tags: ['cyberpunk', 'hacker'], ...getCreator(2), ...getOwner(7), likes: 2567, views: 14341, collectionId: 'collection-3' },
      { id: '9', title: 'Cyber Genesis - Enforcer', description: 'Combat unit with cybernetic armor.', mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', mediaType: 'image', price: 32.0, category: 'games', tags: ['combat', 'armor'], ...getCreator(2), ...getOwner(8), likes: 1987, views: 11234, collectionId: 'collection-3' },
      { id: '10', title: 'Cyber Genesis - Medic', description: 'Field medic with nanobots.', mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', mediaType: 'image', price: 28.5, category: 'games', tags: ['medic', 'tech'], ...getCreator(2), ...getOwner(9), likes: 1654, views: 9876, collectionId: 'collection-3' },
      { id: '11', title: 'Cyber Genesis - Scout', description: 'Stealth operative with camouflage.', mediaUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80', mediaType: 'image', price: 35.0, category: 'games', tags: ['stealth', 'scout'], ...getCreator(2), ...getOwner(0), likes: 2890, views: 16543, collectionId: 'collection-3' },
    ],
  },
  // Collection 4: Neon Dreams
  {
    id: 'collection-4',
    name: 'Neon Dreams',
    description: 'Abstract digital art with flowing neon colors and geometric patterns.',
    coverImage: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80',
    creatorName: 'Digital Dreams Studio',
    creatorUsername: 'digitaldreams',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    totalItems: 3,
    floorPrice: 18.5,
    totalVolume: 178.9,
    category: 'digital-art',
    items: [
      { id: '12', title: 'Neon Dreams - Pulse', description: 'Rhythmic waves of neon light.', mediaUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80', mediaType: 'image', price: 18.5, category: 'digital-art', tags: ['neon', 'pulse'], ...getCreator(4), ...getOwner(1), likes: 4892, views: 23456, collectionId: 'collection-4' },
      { id: '13', title: 'Neon Dreams - Cascade', description: 'Cascading colors through geometry.', mediaUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80', mediaType: 'image', price: 22.0, category: 'digital-art', tags: ['cascade', 'geometric'], ...getCreator(4), ...getOwner(2), likes: 3456, views: 18765, collectionId: 'collection-4' },
      { id: '14', title: 'Neon Dreams - Synthesis', description: 'Perfect synthesis of color and form.', mediaUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', mediaType: 'image', price: 25.0, category: 'digital-art', tags: ['synthesis', 'harmony'], ...getCreator(4), ...getOwner(3), likes: 5678, views: 28901, collectionId: 'collection-4' },
    ],
  },
  // Collection 5: Ocean Ethereal
  {
    id: 'collection-5',
    name: 'Ocean Ethereal',
    description: 'Long exposure ocean photography under moonlight and golden hour.',
    coverImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    creatorName: 'Sofia Andersson',
    creatorUsername: 'sofiaandersson',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    totalItems: 3,
    floorPrice: 6.0,
    totalVolume: 67.5,
    category: 'photography',
    items: [
      { id: '15', title: 'Ocean Ethereal - Midnight', description: 'Waves under full moon.', mediaUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', mediaType: 'image', price: 6.0, category: 'photography', tags: ['ocean', 'night'], ...getCreator(3), ...getOwner(4), likes: 2123, views: 11987, collectionId: 'collection-5' },
      { id: '16', title: 'Ocean Ethereal - Golden', description: 'Sunset transforms ocean to gold.', mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', mediaType: 'image', price: 7.5, category: 'photography', tags: ['sunset', 'golden'], ...getCreator(3), ...getOwner(5), likes: 1876, views: 9654, collectionId: 'collection-5' },
      { id: '17', title: 'Ocean Ethereal - Storm', description: 'Raw power of nature.', mediaUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80', mediaType: 'image', price: 9.0, category: 'photography', tags: ['storm', 'power'], ...getCreator(3), ...getOwner(6), likes: 2456, views: 13456, collectionId: 'collection-5' },
    ],
  },
  // Collection 6: Abstract Minds
  {
    id: 'collection-6',
    name: 'Abstract Minds',
    description: 'Psychological landscapes rendered in vivid abstract forms.',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    creatorName: 'Luna Martinez',
    creatorUsername: 'lunamartinez',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    totalItems: 4,
    floorPrice: 8.5,
    totalVolume: 112.3,
    category: 'digital-art',
    items: [
      { id: '18', title: 'Abstract Mind #001', description: 'Thoughts in motion.', mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', mediaType: 'image', price: 8.5, category: 'digital-art', tags: ['abstract', 'mind'], ...getCreator(5), ...getOwner(7), likes: 1234, views: 6789, collectionId: 'collection-6' },
      { id: '19', title: 'Abstract Mind #002', description: 'Dreams manifested.', mediaUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80', mediaType: 'image', price: 10.0, category: 'digital-art', tags: ['dreams', 'colors'], ...getCreator(5), ...getOwner(8), likes: 1567, views: 8234, collectionId: 'collection-6' },
      { id: '20', title: 'Abstract Mind #003', description: 'Consciousness explored.', mediaUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', mediaType: 'image', price: 11.5, category: 'digital-art', tags: ['consciousness', 'explore'], ...getCreator(5), ...getOwner(9), likes: 1890, views: 9567, collectionId: 'collection-6' },
      { id: '21', title: 'Abstract Mind #004', description: 'Inner universe.', mediaUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80', mediaType: 'image', price: 13.0, category: 'digital-art', tags: ['inner', 'universe'], ...getCreator(5), ...getOwner(0), likes: 2134, views: 11234, collectionId: 'collection-6' },
    ],
  },
  // Collection 7: Nature's Geometry
  {
    id: 'collection-7',
    name: 'Nature\'s Geometry',
    description: 'Mathematical patterns found in the natural world.',
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    creatorName: 'Oliver Kim',
    creatorUsername: 'oliverkim',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    totalItems: 3,
    floorPrice: 5.5,
    totalVolume: 78.4,
    category: 'photography',
    items: [
      { id: '22', title: 'Fibonacci Bloom', description: 'Sunflower spiral perfection.', mediaUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', mediaType: 'image', price: 5.5, category: 'photography', tags: ['fibonacci', 'nature'], ...getCreator(6), ...getOwner(1), likes: 987, views: 5432, collectionId: 'collection-7' },
      { id: '23', title: 'Crystal Formation', description: 'Ice crystals under microscope.', mediaUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80', mediaType: 'image', price: 7.0, category: 'photography', tags: ['crystal', 'ice'], ...getCreator(6), ...getOwner(2), likes: 1234, views: 6789, collectionId: 'collection-7' },
      { id: '24', title: 'Leaf Veins', description: 'Intricate network of life.', mediaUrl: 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=800&q=80', mediaType: 'image', price: 6.5, category: 'photography', tags: ['leaf', 'macro'], ...getCreator(6), ...getOwner(3), likes: 1456, views: 7890, collectionId: 'collection-7' },
    ],
  },
  // Collection 8: Digital Portraits
  {
    id: 'collection-8',
    name: 'Digital Portraits',
    description: 'Stylized digital portraits with unique artistic treatments.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    creatorName: 'Aria Thompson',
    creatorUsername: 'ariathompson',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    totalItems: 4,
    floorPrice: 15.0,
    totalVolume: 198.7,
    category: 'digital-art',
    items: [
      { id: '25', title: 'Portrait in Blue', description: 'Melancholy rendered in azure.', mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', mediaType: 'image', price: 15.0, category: 'digital-art', tags: ['portrait', 'blue'], ...getCreator(7), ...getOwner(4), likes: 2345, views: 12567, collectionId: 'collection-8' },
      { id: '26', title: 'Golden Visage', description: 'Royalty in digital form.', mediaUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', mediaType: 'image', price: 18.0, category: 'digital-art', tags: ['gold', 'royal'], ...getCreator(7), ...getOwner(5), likes: 2678, views: 14321, collectionId: 'collection-8' },
      { id: '27', title: 'Neon Soul', description: 'Identity in electric light.', mediaUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', mediaType: 'image', price: 20.0, category: 'digital-art', tags: ['neon', 'soul'], ...getCreator(7), ...getOwner(6), likes: 2890, views: 15678, collectionId: 'collection-8' },
      { id: '28', title: 'Shadow Self', description: 'The other side revealed.', mediaUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80', mediaType: 'image', price: 22.0, category: 'digital-art', tags: ['shadow', 'dark'], ...getCreator(7), ...getOwner(7), likes: 3123, views: 17890, collectionId: 'collection-8' },
    ],
  },
  // Collection 9: Retro Futures
  {
    id: 'collection-9',
    name: 'Retro Futures',
    description: 'Nostalgic visions of tomorrow from the past.',
    coverImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    creatorName: 'Neo Collective',
    creatorUsername: 'neocollective',
    creatorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80',
    totalItems: 3,
    floorPrice: 9.0,
    totalVolume: 87.6,
    category: 'digital-art',
    items: [
      { id: '29', title: 'Synthwave City', description: '80s dream of 2020.', mediaUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80', mediaType: 'image', price: 9.0, category: 'digital-art', tags: ['synthwave', 'retro'], ...getCreator(8), ...getOwner(8), likes: 1567, views: 8765, collectionId: 'collection-9' },
      { id: '30', title: 'Chrome Dreams', description: 'Metallic visions.', mediaUrl: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&q=80', mediaType: 'image', price: 11.0, category: 'digital-art', tags: ['chrome', 'future'], ...getCreator(8), ...getOwner(9), likes: 1890, views: 9876, collectionId: 'collection-9' },
      { id: '31', title: 'Neon Highway', description: 'Endless roads ahead.', mediaUrl: 'https://images.unsplash.com/photo-1520262454473-a1a82276a574?w=800&q=80', mediaType: 'image', price: 12.5, category: 'digital-art', tags: ['highway', 'neon'], ...getCreator(8), ...getOwner(0), likes: 2123, views: 11234, collectionId: 'collection-9' },
    ],
  },
  // Collection 10: Wildlife Majesty
  {
    id: 'collection-10',
    name: 'Wildlife Majesty',
    description: 'Powerful portraits of the animal kingdom.',
    coverImage: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
    creatorName: 'Zara Williams',
    creatorUsername: 'zarawilliams',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    totalItems: 4,
    floorPrice: 7.5,
    totalVolume: 145.8,
    category: 'photography',
    items: [
      { id: '32', title: 'King of the Savanna', description: 'Lion in golden light.', mediaUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80', mediaType: 'image', price: 7.5, category: 'photography', tags: ['lion', 'wildlife'], ...getCreator(9), ...getOwner(1), likes: 3456, views: 18765, collectionId: 'collection-10' },
      { id: '33', title: 'Ocean Hunter', description: 'Great white in motion.', mediaUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800&q=80', mediaType: 'image', price: 9.0, category: 'photography', tags: ['shark', 'ocean'], ...getCreator(9), ...getOwner(2), likes: 2890, views: 15432, collectionId: 'collection-10' },
      { id: '34', title: 'Arctic Spirit', description: 'Polar bear in snow.', mediaUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80', mediaType: 'image', price: 8.5, category: 'photography', tags: ['polar', 'arctic'], ...getCreator(9), ...getOwner(3), likes: 2567, views: 13678, collectionId: 'collection-10' },
      { id: '35', title: 'Sky Sovereign', description: 'Eagle against blue sky.', mediaUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80', mediaType: 'image', price: 10.0, category: 'photography', tags: ['eagle', 'bird'], ...getCreator(9), ...getOwner(4), likes: 3123, views: 16890, collectionId: 'collection-10' },
    ],
  },
  // Collection 11: Minimal Spaces
  {
    id: 'collection-11',
    name: 'Minimal Spaces',
    description: 'Architectural photography celebrating clean lines and empty spaces.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    creatorName: 'Pixel Masters',
    creatorUsername: 'pixelmasters',
    creatorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80',
    totalItems: 3,
    floorPrice: 6.0,
    totalVolume: 72.4,
    category: 'photography',
    items: [
      { id: '36', title: 'White Cube', description: 'Pure geometric space.', mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', mediaType: 'image', price: 6.0, category: 'photography', tags: ['minimal', 'architecture'], ...getCreator(10), ...getOwner(5), likes: 1234, views: 6789, collectionId: 'collection-11' },
      { id: '37', title: 'Shadow Lines', description: 'Light and dark divide.', mediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', mediaType: 'image', price: 7.5, category: 'photography', tags: ['shadow', 'lines'], ...getCreator(10), ...getOwner(6), likes: 1456, views: 7890, collectionId: 'collection-11' },
      { id: '38', title: 'Concrete Poetry', description: 'Brutalism refined.', mediaUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&q=80', mediaType: 'image', price: 8.0, category: 'photography', tags: ['concrete', 'brutalist'], ...getCreator(10), ...getOwner(7), likes: 1678, views: 8765, collectionId: 'collection-11' },
    ],
  },
  // Collection 12: Liquid Metal
  {
    id: 'collection-12',
    name: 'Liquid Metal',
    description: 'Molten metallic textures and fluid chrome aesthetics.',
    coverImage: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=800&q=80',
    creatorName: 'Elena Frost',
    creatorUsername: 'elenafrost',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    totalItems: 4,
    floorPrice: 14.0,
    totalVolume: 167.8,
    category: 'digital-art',
    items: [
      { id: '39', title: 'Mercury Flow', description: 'Liquid silver in motion.', mediaUrl: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=800&q=80', mediaType: 'image', price: 14.0, category: 'digital-art', tags: ['mercury', 'liquid'], ...getCreator(11), ...getOwner(8), likes: 2345, views: 12678, collectionId: 'collection-12' },
      { id: '40', title: 'Golden Ripple', description: 'Molten gold waves.', mediaUrl: 'https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?w=800&q=80', mediaType: 'image', price: 16.0, category: 'digital-art', tags: ['gold', 'ripple'], ...getCreator(11), ...getOwner(9), likes: 2678, views: 14321, collectionId: 'collection-12' },
      { id: '41', title: 'Chrome Reflection', description: 'Mirror world distorted.', mediaUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80', mediaType: 'image', price: 18.0, category: 'digital-art', tags: ['chrome', 'mirror'], ...getCreator(11), ...getOwner(0), likes: 2890, views: 15678, collectionId: 'collection-12' },
      { id: '42', title: 'Copper Dreams', description: 'Oxidized beauty.', mediaUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', mediaType: 'image', price: 15.0, category: 'digital-art', tags: ['copper', 'oxidized'], ...getCreator(11), ...getOwner(1), likes: 2456, views: 13456, collectionId: 'collection-12' },
    ],
  },
  // Collection 13: Digital Flora
  {
    id: 'collection-13',
    name: 'Digital Flora',
    description: 'Botanical illustrations reimagined in digital medium.',
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    creatorName: 'Astrid Nova',
    creatorUsername: 'astridnova',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    totalItems: 3,
    floorPrice: 5.0,
    totalVolume: 54.3,
    category: 'digital-art',
    items: [
      { id: '43', title: 'Neon Orchid', description: 'Exotic bloom in electric colors.', mediaUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', mediaType: 'image', price: 5.0, category: 'digital-art', tags: ['orchid', 'neon'], ...getCreator(0), ...getOwner(2), likes: 987, views: 5432, collectionId: 'collection-13' },
      { id: '44', title: 'Cyber Rose', description: 'Classic beauty digitized.', mediaUrl: 'https://images.unsplash.com/photo-1518882605630-8eb372d4eb82?w=800&q=80', mediaType: 'image', price: 6.5, category: 'digital-art', tags: ['rose', 'cyber'], ...getCreator(0), ...getOwner(3), likes: 1234, views: 6789, collectionId: 'collection-13' },
      { id: '45', title: 'Holographic Lily', description: 'Pure light petals.', mediaUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80', mediaType: 'image', price: 7.0, category: 'digital-art', tags: ['lily', 'holographic'], ...getCreator(0), ...getOwner(4), likes: 1456, views: 7890, collectionId: 'collection-13' },
    ],
  },
  // Collection 14: Pixel Warriors
  {
    id: 'collection-14',
    name: 'Pixel Warriors',
    description: 'Retro gaming characters in high-resolution pixel art.',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    creatorName: 'Kai Rodriguez',
    creatorUsername: 'kairodriguez',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    totalItems: 4,
    floorPrice: 12.0,
    totalVolume: 156.7,
    category: 'games',
    items: [
      { id: '46', title: 'Pixel Knight', description: 'Sword and shield in 8-bit glory.', mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', mediaType: 'image', price: 12.0, category: 'games', tags: ['pixel', 'knight'], ...getCreator(2), ...getOwner(5), likes: 2345, views: 12567, collectionId: 'collection-14' },
      { id: '47', title: 'Pixel Mage', description: 'Arcane power rendered.', mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', mediaType: 'image', price: 14.0, category: 'games', tags: ['pixel', 'mage'], ...getCreator(2), ...getOwner(6), likes: 2678, views: 14321, collectionId: 'collection-14' },
      { id: '48', title: 'Pixel Rogue', description: 'Shadows in squares.', mediaUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&q=80', mediaType: 'image', price: 13.0, category: 'games', tags: ['pixel', 'rogue'], ...getCreator(2), ...getOwner(7), likes: 2456, views: 13456, collectionId: 'collection-14' },
      { id: '49', title: 'Pixel Archer', description: 'Perfect aim pixelated.', mediaUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80', mediaType: 'image', price: 15.0, category: 'games', tags: ['pixel', 'archer'], ...getCreator(2), ...getOwner(8), likes: 2890, views: 15678, collectionId: 'collection-14' },
    ],
  },
  // Collection 15: Mystic Portals
  {
    id: 'collection-15',
    name: 'Mystic Portals',
    description: 'Gateways to otherworldly dimensions.',
    coverImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80',
    creatorName: 'Luna Martinez',
    creatorUsername: 'lunamartinez',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    totalItems: 3,
    floorPrice: 20.0,
    totalVolume: 189.4,
    category: 'digital-art',
    items: [
      { id: '50', title: 'Portal of Light', description: 'Gateway to pure energy.', mediaUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80', mediaType: 'image', price: 20.0, category: 'digital-art', tags: ['portal', 'light'], ...getCreator(5), ...getOwner(9), likes: 3456, views: 18765, collectionId: 'collection-15' },
      { id: '51', title: 'Void Gate', description: 'Door to nothingness.', mediaUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&q=80', mediaType: 'image', price: 24.0, category: 'digital-art', tags: ['void', 'dark'], ...getCreator(5), ...getOwner(0), likes: 3789, views: 20543, collectionId: 'collection-15' },
      { id: '52', title: 'Cosmic Doorway', description: 'Entrance to stars.', mediaUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80', mediaType: 'image', price: 22.0, category: 'digital-art', tags: ['cosmic', 'doorway'], ...getCreator(5), ...getOwner(1), likes: 3234, views: 17654, collectionId: 'collection-15' },
    ],
  },
  // Collection 16: Street Pulse
  {
    id: 'collection-16',
    name: 'Street Pulse',
    description: 'The heartbeat of urban life captured in photographs.',
    coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    creatorName: 'Marcus Chen',
    creatorUsername: 'marcuschen',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    totalItems: 4,
    floorPrice: 4.5,
    totalVolume: 67.8,
    category: 'photography',
    items: [
      { id: '53', title: 'Rush Hour', description: 'City in motion.', mediaUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80', mediaType: 'image', price: 4.5, category: 'photography', tags: ['city', 'rush'], ...getCreator(1), ...getOwner(2), likes: 1234, views: 6789, collectionId: 'collection-16' },
      { id: '54', title: 'Subway Stories', description: 'Underground tales.', mediaUrl: 'https://images.unsplash.com/photo-1515861461225-1488dfdaf838?w=800&q=80', mediaType: 'image', price: 5.5, category: 'photography', tags: ['subway', 'underground'], ...getCreator(1), ...getOwner(3), likes: 1456, views: 7890, collectionId: 'collection-16' },
      { id: '55', title: 'Market Life', description: 'Commerce and culture.', mediaUrl: 'https://images.unsplash.com/photo-1555529771-7888783a18d3?w=800&q=80', mediaType: 'image', price: 5.0, category: 'photography', tags: ['market', 'life'], ...getCreator(1), ...getOwner(4), likes: 1345, views: 7234, collectionId: 'collection-16' },
      { id: '56', title: 'Night Vendor', description: 'After dark economy.', mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', mediaType: 'image', price: 6.0, category: 'photography', tags: ['night', 'vendor'], ...getCreator(1), ...getOwner(5), likes: 1567, views: 8456, collectionId: 'collection-16' },
    ],
  },
  // Collection 17: Glitch Aesthetics
  {
    id: 'collection-17',
    name: 'Glitch Aesthetics',
    description: 'Beauty in digital errors and data corruption.',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    creatorName: 'Digital Dreams Studio',
    creatorUsername: 'digitaldreams',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    totalItems: 3,
    floorPrice: 11.0,
    totalVolume: 98.7,
    category: 'digital-art',
    items: [
      { id: '57', title: 'Corrupted Beauty', description: 'Error as art.', mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', mediaType: 'image', price: 11.0, category: 'digital-art', tags: ['glitch', 'error'], ...getCreator(4), ...getOwner(6), likes: 1890, views: 9876, collectionId: 'collection-17' },
      { id: '58', title: 'Data Storm', description: 'Information overload.', mediaUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80', mediaType: 'image', price: 13.0, category: 'digital-art', tags: ['data', 'storm'], ...getCreator(4), ...getOwner(7), likes: 2123, views: 11234, collectionId: 'collection-17' },
      { id: '59', title: 'Signal Lost', description: 'Between transmissions.', mediaUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80', mediaType: 'image', price: 12.0, category: 'digital-art', tags: ['signal', 'lost'], ...getCreator(4), ...getOwner(8), likes: 1987, views: 10567, collectionId: 'collection-17' },
    ],
  },
  // Collection 18: Ethereal Beings
  {
    id: 'collection-18',
    name: 'Ethereal Beings',
    description: 'Otherworldly creatures from imagination.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    creatorName: 'Aria Thompson',
    creatorUsername: 'ariathompson',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    totalItems: 4,
    floorPrice: 16.0,
    totalVolume: 187.6,
    category: 'digital-art',
    items: [
      { id: '60', title: 'Light Spirit', description: 'Pure energy entity.', mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', mediaType: 'image', price: 16.0, category: 'digital-art', tags: ['spirit', 'light'], ...getCreator(7), ...getOwner(9), likes: 2567, views: 13890, collectionId: 'collection-18' },
      { id: '61', title: 'Shadow Dancer', description: 'Moving in darkness.', mediaUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80', mediaType: 'image', price: 18.0, category: 'digital-art', tags: ['shadow', 'dancer'], ...getCreator(7), ...getOwner(0), likes: 2890, views: 15432, collectionId: 'collection-18' },
      { id: '62', title: 'Crystal Guardian', description: 'Protector of gems.', mediaUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80', mediaType: 'image', price: 20.0, category: 'digital-art', tags: ['crystal', 'guardian'], ...getCreator(7), ...getOwner(1), likes: 3123, views: 16789, collectionId: 'collection-18' },
      { id: '63', title: 'Void Walker', description: 'Between dimensions.', mediaUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80', mediaType: 'image', price: 22.0, category: 'digital-art', tags: ['void', 'walker'], ...getCreator(7), ...getOwner(2), likes: 3456, views: 18234, collectionId: 'collection-18' },
    ],
  },
  // Collection 19: Macro Worlds
  {
    id: 'collection-19',
    name: 'Macro Worlds',
    description: 'The hidden universe in tiny details.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    creatorName: 'Oliver Kim',
    creatorUsername: 'oliverkim',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    totalItems: 3,
    floorPrice: 5.5,
    totalVolume: 56.8,
    category: 'photography',
    items: [
      { id: '64', title: 'Dewdrop Universe', description: 'World in a drop.', mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', mediaType: 'image', price: 5.5, category: 'photography', tags: ['macro', 'water'], ...getCreator(6), ...getOwner(3), likes: 1234, views: 6789, collectionId: 'collection-19' },
      { id: '65', title: 'Insect Eyes', description: 'Compound vision.', mediaUrl: 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=800&q=80', mediaType: 'image', price: 6.5, category: 'photography', tags: ['insect', 'eyes'], ...getCreator(6), ...getOwner(4), likes: 1456, views: 7890, collectionId: 'collection-19' },
      { id: '66', title: 'Texture Tales', description: 'Surface stories.', mediaUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80', mediaType: 'image', price: 7.0, category: 'photography', tags: ['texture', 'macro'], ...getCreator(6), ...getOwner(5), likes: 1567, views: 8234, collectionId: 'collection-19' },
    ],
  },
  // Collection 20: Cyberpunk Nights
  {
    id: 'collection-20',
    name: 'Cyberpunk Nights',
    description: 'Neon-soaked urban dystopia.',
    coverImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    creatorName: 'Neo Collective',
    creatorUsername: 'neocollective',
    creatorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80',
    totalItems: 4,
    floorPrice: 10.0,
    totalVolume: 134.5,
    category: 'photography',
    items: [
      { id: '67', title: 'Neon District', description: 'Electric streets.', mediaUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80', mediaType: 'image', price: 10.0, category: 'photography', tags: ['neon', 'city'], ...getCreator(8), ...getOwner(6), likes: 2345, views: 12567, collectionId: 'collection-20' },
      { id: '68', title: 'Rain City', description: 'Wet reflections.', mediaUrl: 'https://images.unsplash.com/photo-1515861461225-1488dfdaf838?w=800&q=80', mediaType: 'image', price: 12.0, category: 'photography', tags: ['rain', 'night'], ...getCreator(8), ...getOwner(7), likes: 2678, views: 14321, collectionId: 'collection-20' },
      { id: '69', title: 'Hologram Alley', description: 'Digital advertisements.', mediaUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80', mediaType: 'image', price: 11.0, category: 'photography', tags: ['hologram', 'alley'], ...getCreator(8), ...getOwner(8), likes: 2456, views: 13456, collectionId: 'collection-20' },
      { id: '70', title: 'Tech Noir', description: 'Dark future.', mediaUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', mediaType: 'image', price: 13.0, category: 'photography', tags: ['tech', 'noir'], ...getCreator(8), ...getOwner(9), likes: 2890, views: 15678, collectionId: 'collection-20' },
    ],
  },
  // Collection 21: Sacred Geometry
  {
    id: 'collection-21',
    name: 'Sacred Geometry',
    description: 'Mathematical patterns with spiritual significance.',
    coverImage: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80',
    creatorName: 'Luna Martinez',
    creatorUsername: 'lunamartinez',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    totalItems: 3,
    floorPrice: 15.0,
    totalVolume: 145.6,
    category: 'digital-art',
    items: [
      { id: '71', title: 'Flower of Life', description: 'Creation pattern.', mediaUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80', mediaType: 'image', price: 15.0, category: 'digital-art', tags: ['sacred', 'flower'], ...getCreator(5), ...getOwner(0), likes: 2567, views: 13890, collectionId: 'collection-21' },
      { id: '72', title: 'Metatron\'s Cube', description: 'Universal blueprint.', mediaUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80', mediaType: 'image', price: 18.0, category: 'digital-art', tags: ['metatron', 'cube'], ...getCreator(5), ...getOwner(1), likes: 2890, views: 15432, collectionId: 'collection-21' },
      { id: '73', title: 'Golden Spiral', description: 'Fibonacci manifest.', mediaUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80', mediaType: 'image', price: 17.0, category: 'digital-art', tags: ['golden', 'spiral'], ...getCreator(5), ...getOwner(2), likes: 2678, views: 14321, collectionId: 'collection-21' },
    ],
  },
  // Collection 22: Fantasy Realms
  {
    id: 'collection-22',
    name: 'Fantasy Realms',
    description: 'Magical landscapes from imagination.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    creatorName: 'Elena Frost',
    creatorUsername: 'elenafrost',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    totalItems: 4,
    floorPrice: 19.0,
    totalVolume: 212.4,
    category: 'games',
    items: [
      { id: '74', title: 'Dragon Peak', description: 'Where legends live.', mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', mediaType: 'image', price: 19.0, category: 'games', tags: ['dragon', 'fantasy'], ...getCreator(11), ...getOwner(3), likes: 3456, views: 18765, collectionId: 'collection-22' },
      { id: '75', title: 'Enchanted Forest', description: 'Magic in every tree.', mediaUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', mediaType: 'image', price: 22.0, category: 'games', tags: ['forest', 'enchanted'], ...getCreator(11), ...getOwner(4), likes: 3789, views: 20543, collectionId: 'collection-22' },
      { id: '76', title: 'Crystal Caverns', description: 'Underground wonders.', mediaUrl: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=800&q=80', mediaType: 'image', price: 21.0, category: 'games', tags: ['crystal', 'cavern'], ...getCreator(11), ...getOwner(5), likes: 3567, views: 19234, collectionId: 'collection-22' },
      { id: '77', title: 'Floating Islands', description: 'Gravity defied.', mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', mediaType: 'image', price: 24.0, category: 'games', tags: ['floating', 'islands'], ...getCreator(11), ...getOwner(6), likes: 4012, views: 21678, collectionId: 'collection-22' },
    ],
  },
  // Collection 23: Monochrome Dreams
  {
    id: 'collection-23',
    name: 'Monochrome Dreams',
    description: 'The beauty of black and white.',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80',
    creatorName: 'Zara Williams',
    creatorUsername: 'zarawilliams',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    totalItems: 3,
    floorPrice: 6.5,
    totalVolume: 67.8,
    category: 'photography',
    items: [
      { id: '78', title: 'Shadow Play', description: 'Light and dark dance.', mediaUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80', mediaType: 'image', price: 6.5, category: 'photography', tags: ['shadow', 'monochrome'], ...getCreator(9), ...getOwner(7), likes: 1234, views: 6789, collectionId: 'collection-23' },
      { id: '79', title: 'Contrast Study', description: 'Extremes meet.', mediaUrl: 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=800&q=80', mediaType: 'image', price: 7.5, category: 'photography', tags: ['contrast', 'study'], ...getCreator(9), ...getOwner(8), likes: 1456, views: 7890, collectionId: 'collection-23' },
      { id: '80', title: 'Grey Tones', description: 'Subtle gradients.', mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', mediaType: 'image', price: 8.0, category: 'photography', tags: ['grey', 'tones'], ...getCreator(9), ...getOwner(9), likes: 1567, views: 8234, collectionId: 'collection-23' },
    ],
  },
  // Collection 24: Future Vehicles
  {
    id: 'collection-24',
    name: 'Future Vehicles',
    description: 'Transportation concepts from tomorrow.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    creatorName: 'Kai Rodriguez',
    creatorUsername: 'kairodriguez',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    totalItems: 4,
    floorPrice: 25.0,
    totalVolume: 278.9,
    category: 'games',
    items: [
      { id: '81', title: 'Hover Bike', description: 'Anti-gravity personal transport.', mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', mediaType: 'image', price: 25.0, category: 'games', tags: ['hover', 'bike'], ...getCreator(2), ...getOwner(0), likes: 3456, views: 18765, collectionId: 'collection-24' },
      { id: '82', title: 'Sky Cruiser', description: 'Luxury in the clouds.', mediaUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80', mediaType: 'image', price: 30.0, category: 'games', tags: ['sky', 'cruiser'], ...getCreator(2), ...getOwner(1), likes: 3890, views: 21234, collectionId: 'collection-24' },
      { id: '83', title: 'Deep Runner', description: 'Submarine racer.', mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', mediaType: 'image', price: 28.0, category: 'games', tags: ['submarine', 'racer'], ...getCreator(2), ...getOwner(2), likes: 3567, views: 19567, collectionId: 'collection-24' },
      { id: '84', title: 'Space Runner', description: 'Between planets.', mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', mediaType: 'image', price: 35.0, category: 'games', tags: ['space', 'runner'], ...getCreator(2), ...getOwner(3), likes: 4234, views: 23456, collectionId: 'collection-24' },
    ],
  },
  // Collection 25: Surreal Landscapes
  {
    id: 'collection-25',
    name: 'Surreal Landscapes',
    description: 'Impossible terrains from the subconscious.',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    creatorName: 'Aria Thompson',
    creatorUsername: 'ariathompson',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    totalItems: 3,
    floorPrice: 14.0,
    totalVolume: 134.5,
    category: 'digital-art',
    items: [
      { id: '85', title: 'Melting Mountains', description: 'Solid becomes fluid.', mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', mediaType: 'image', price: 14.0, category: 'digital-art', tags: ['surreal', 'mountains'], ...getCreator(7), ...getOwner(4), likes: 2345, views: 12567, collectionId: 'collection-25' },
      { id: '86', title: 'Inverted Ocean', description: 'Sky below water.', mediaUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80', mediaType: 'image', price: 16.0, category: 'digital-art', tags: ['inverted', 'ocean'], ...getCreator(7), ...getOwner(5), likes: 2678, views: 14321, collectionId: 'collection-25' },
      { id: '87', title: 'Desert Bloom', description: 'Life in abstraction.', mediaUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', mediaType: 'image', price: 15.0, category: 'digital-art', tags: ['desert', 'bloom'], ...getCreator(7), ...getOwner(6), likes: 2456, views: 13456, collectionId: 'collection-25' },
    ],
  },
  // Collection 26: Sound Waves
  {
    id: 'collection-26',
    name: 'Sound Waves',
    description: 'Visual representations of music and sound.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    creatorName: 'Pixel Masters',
    creatorUsername: 'pixelmasters',
    creatorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80',
    totalItems: 4,
    floorPrice: 8.0,
    totalVolume: 98.7,
    category: 'music',
    items: [
      { id: '88', title: 'Bass Drop', description: 'Low frequency visual.', mediaUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', mediaType: 'image', price: 8.0, category: 'music', tags: ['bass', 'music'], ...getCreator(10), ...getOwner(7), likes: 1567, views: 8456, collectionId: 'collection-26' },
      { id: '89', title: 'Treble Rise', description: 'High notes visualized.', mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', mediaType: 'image', price: 9.0, category: 'music', tags: ['treble', 'high'], ...getCreator(10), ...getOwner(8), likes: 1789, views: 9234, collectionId: 'collection-26' },
      { id: '90', title: 'Rhythm Pattern', description: 'Beat made visible.', mediaUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', mediaType: 'image', price: 10.0, category: 'music', tags: ['rhythm', 'pattern'], ...getCreator(10), ...getOwner(9), likes: 1890, views: 10123, collectionId: 'collection-26' },
      { id: '91', title: 'Harmony Blend', description: 'Colors of chords.', mediaUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', mediaType: 'image', price: 11.0, category: 'music', tags: ['harmony', 'blend'], ...getCreator(10), ...getOwner(0), likes: 2012, views: 10876, collectionId: 'collection-26' },
    ],
  },
  // Collection 27: Astral Journeys
  {
    id: 'collection-27',
    name: 'Astral Journeys',
    description: 'Transcendent experiences in visual form.',
    coverImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80',
    creatorName: 'Astrid Nova',
    creatorUsername: 'astridnova',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    totalItems: 3,
    floorPrice: 22.0,
    totalVolume: 198.4,
    category: 'digital-art',
    items: [
      { id: '92', title: 'Third Eye', description: 'Inner vision opened.', mediaUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80', mediaType: 'image', price: 22.0, category: 'digital-art', tags: ['third', 'eye'], ...getCreator(0), ...getOwner(1), likes: 3456, views: 18765, collectionId: 'collection-27' },
      { id: '93', title: 'Soul Travel', description: 'Beyond the body.', mediaUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80', mediaType: 'image', price: 26.0, category: 'digital-art', tags: ['soul', 'travel'], ...getCreator(0), ...getOwner(2), likes: 3890, views: 21234, collectionId: 'collection-27' },
      { id: '94', title: 'Cosmic Self', description: 'Universal consciousness.', mediaUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&q=80', mediaType: 'image', price: 24.0, category: 'digital-art', tags: ['cosmic', 'self'], ...getCreator(0), ...getOwner(3), likes: 3678, views: 19876, collectionId: 'collection-27' },
    ],
  },
  // Collection 28: Urban Wildlife
  {
    id: 'collection-28',
    name: 'Urban Wildlife',
    description: 'Nature adapting to city life.',
    coverImage: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
    creatorName: 'Sofia Andersson',
    creatorUsername: 'sofiaandersson',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    totalItems: 4,
    floorPrice: 5.0,
    totalVolume: 67.8,
    category: 'photography',
    items: [
      { id: '95', title: 'City Fox', description: 'Cunning survivor.', mediaUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80', mediaType: 'image', price: 5.0, category: 'photography', tags: ['fox', 'urban'], ...getCreator(3), ...getOwner(4), likes: 1234, views: 6789, collectionId: 'collection-28' },
      { id: '96', title: 'Rooftop Falcon', description: 'Predator above.', mediaUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80', mediaType: 'image', price: 6.0, category: 'photography', tags: ['falcon', 'rooftop'], ...getCreator(3), ...getOwner(5), likes: 1456, views: 7890, collectionId: 'collection-28' },
      { id: '97', title: 'Park Squirrel', description: 'Tiny acrobat.', mediaUrl: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=800&q=80', mediaType: 'image', price: 5.5, category: 'photography', tags: ['squirrel', 'park'], ...getCreator(3), ...getOwner(6), likes: 1345, views: 7234, collectionId: 'collection-28' },
      { id: '98', title: 'Canal Heron', description: 'Patient fisher.', mediaUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80', mediaType: 'image', price: 6.5, category: 'photography', tags: ['heron', 'canal'], ...getCreator(3), ...getOwner(7), likes: 1567, views: 8456, collectionId: 'collection-28' },
    ],
  },
  // Collection 29: Quantum Visions
  {
    id: 'collection-29',
    name: 'Quantum Visions',
    description: 'The subatomic world visualized.',
    coverImage: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80',
    creatorName: 'Digital Dreams Studio',
    creatorUsername: 'digitaldreams',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    totalItems: 3,
    floorPrice: 28.0,
    totalVolume: 256.7,
    category: 'digital-art',
    items: [
      { id: '99', title: 'Particle Dance', description: 'Quarks in motion.', mediaUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80', mediaType: 'image', price: 28.0, category: 'digital-art', tags: ['particle', 'quantum'], ...getCreator(4), ...getOwner(8), likes: 4567, views: 24567, collectionId: 'collection-29' },
      { id: '100', title: 'Wave Function', description: 'Probability visualized.', mediaUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80', mediaType: 'image', price: 32.0, category: 'digital-art', tags: ['wave', 'function'], ...getCreator(4), ...getOwner(9), likes: 4890, views: 26789, collectionId: 'collection-29' },
      { id: '101', title: 'Entanglement', description: 'Spooky action.', mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', mediaType: 'image', price: 30.0, category: 'digital-art', tags: ['entangle', 'quantum'], ...getCreator(4), ...getOwner(0), likes: 4678, views: 25432, collectionId: 'collection-29' },
    ],
  },
];

// Flatten all NFTs from collections for backward compatibility
export const sampleNFTs: SampleNFT[] = sampleCollections.flatMap(
  (collection) => collection.items
);

// Top sellers (highest volume collections)
export const topSellers = [...sampleCollections]
  .sort((a, b) => b.totalVolume - a.totalVolume)
  .slice(0, 6);

// Get collection by ID
export function getCollectionById(id: string): SampleNFTCollection | undefined {
  return sampleCollections.find((collection) => collection.id === id);
}

// Get NFT by ID
export function getNFTById(id: string): SampleNFT | undefined {
  return sampleNFTs.find((nft) => nft.id === id);
}

// Get NFTs by collection ID
export function getNFTsByCollectionId(collectionId: string): SampleNFT[] {
  return sampleNFTs.filter((nft) => nft.collectionId === collectionId);
}

// Featured collections by category
export const featuredByCategory = {
  'digital-art': sampleCollections.filter((c) => c.category === 'digital-art'),
  photography: sampleCollections.filter((c) => c.category === 'photography'),
  games: sampleCollections.filter((c) => c.category === 'games'),
  music: sampleCollections.filter((c) => c.category === 'music'),
};