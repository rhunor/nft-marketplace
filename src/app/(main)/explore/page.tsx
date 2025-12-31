'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, Heart, Eye, Grid, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Select, Badge, Avatar, Card, Loading } from '@/components/ui';
import { sampleCollections, sampleNFTs} from '@/lib/db/seed-data';
import { NFT_CATEGORIES, getCategoryLabel, debounce, formatETH } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import type { NFTWithUser } from '@/types';

const sortOptions = [
  { value: 'volume-desc', label: 'Highest Volume' },
  { value: 'volume-asc', label: 'Lowest Volume' },
  { value: 'floor-asc', label: 'Floor: Low to High' },
  { value: 'floor-desc', label: 'Floor: High to Low' },
  { value: 'items-desc', label: 'Most Items' },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatEthToUsd } = useEthPrice();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'volume-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'collections' | 'items'>('collections');
  const [dbNFTs, setDbNFTs] = useState<NFTWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch new NFTs from database
  const fetchNFTs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');

      if (searchQuery && viewMode === 'items') {
        params.set('q', searchQuery);
      }
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }

      const response = await fetch(`/api/nfts?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDbNFTs(data.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, viewMode]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      router.push(`/explore?${params.toString()}`, { scroll: false });
    }, 300),
    [searchParams, router]
  );

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let collections = [...sampleCollections];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      collections = collections.filter(
        (collection) =>
          collection.name.toLowerCase().includes(query) ||
          collection.description.toLowerCase().includes(query) ||
          collection.creatorName.toLowerCase().includes(query) ||
          collection.creatorUsername.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      collections = collections.filter(
        (collection) => collection.category === selectedCategory
      );
    }

    // Sort collections
    const [sortField, sortOrder] = sortBy.split('-');
    collections.sort((a, b) => {
      let aVal: number = 0;
      let bVal: number = 0;

      switch (sortField) {
        case 'volume':
          aVal = a.totalVolume;
          bVal = b.totalVolume;
          break;
        case 'floor':
          aVal = a.floorPrice;
          bVal = b.floorPrice;
          break;
        case 'items':
          aVal = a.totalItems;
          bVal = b.totalItems;
          break;
        default:
          aVal = a.totalVolume;
          bVal = b.totalVolume;
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return collections;
  }, [searchQuery, selectedCategory, sortBy]);

  // Filter sample NFTs for items view
  const filteredNFTs = useMemo(() => {
    let nfts = [...sampleNFTs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nfts = nfts.filter(
        (nft) =>
          nft.title.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query) ||
          nft.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          nft.creatorName.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      nfts = nfts.filter((nft) => nft.category === selectedCategory);
    }

    return nfts;
  }, [searchQuery, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('volume-desc');
    router.push('/explore', { scroll: false });
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  // Count collections per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sampleCollections.forEach((collection) => {
      counts[collection.category] = (counts[collection.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="py-8">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Explore</h1>
          <p className="mt-2 text-foreground-muted">
            Discover exclusive collections from world-class digital artists
          </p>
        </div>

        {/* New Uploads from Database */}
        {dbNFTs.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/20">
                <Sparkles className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">New Uploads</h2>
                <p className="text-sm text-foreground-muted">
                  Fresh NFTs from our marketplace creators
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dbNFTs.slice(0, 4).map((nft) => (
                <Link key={nft._id} href={`/nft/${nft._id}`}>
                  <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={nft.thumbnailUrl || nft.mediaUrl}
                        alt={nft.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <Badge variant="primary" className="absolute right-3 top-3">
                        New
                      </Badge>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-3 text-white">
                          <span className="flex items-center gap-1 text-sm">
                            <Heart className="h-4 w-4" />
                            {nft.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <Eye className="h-4 w-4" />
                            {nft.views}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-1 font-semibold group-hover:text-accent-primary">
                        {nft.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <Avatar
                          src={nft.creator.avatar}
                          alt={nft.creator.name}
                          size="xs"
                          fallback={nft.creator.name}
                        />
                        <span className="text-sm text-foreground-muted">
                          @{nft.creator.username}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-foreground-subtle">Price</p>
                          <p className="font-bold text-accent-primary">
                            {formatETH(nft.price)}
                          </p>
                        </div>
                        <Badge variant="default" size="sm">
                          {getCategoryLabel(nft.category)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            {dbNFTs.length > 4 && (
              <div className="mt-4 text-center">
                <Button
                  variant="secondary"
                  onClick={() => setViewMode('items')}
                >
                  View All New Uploads ({dbNFTs.length})
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Search and Filters Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={viewMode === 'collections' ? 'Search collections...' : 'Search NFTs...'}
              className="w-full rounded-xl border border-border bg-background-secondary py-3 pl-10 pr-4 text-sm placeholder:text-foreground-subtle focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  debouncedSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort, View mode, and Filter buttons */}
          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              className="w-48"
            />
            <div className="hidden items-center gap-1 rounded-lg border border-border p-1 sm:flex">
              <button
                onClick={() => setViewMode('collections')}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === 'collections'
                    ? 'bg-accent-primary text-white'
                    : 'text-foreground-muted hover:bg-background-hover'
                }`}
                title="View Collections"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('items')}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === 'items'
                    ? 'bg-accent-primary text-white'
                    : 'text-foreground-muted hover:bg-background-hover'
                }`}
                title="View Individual Items"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="mb-3 font-semibold">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-accent-primary/10 text-accent-secondary'
                        : 'text-foreground-muted hover:bg-background-hover'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-foreground-subtle">
                      {sampleCollections.length}
                    </span>
                  </button>
                  {NFT_CATEGORIES.map((category) => {
                    const count = categoryCounts[category.value] || 0;
                    return (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedCategory === category.value
                            ? 'bg-accent-primary/10 text-accent-secondary'
                            : 'text-foreground-muted hover:bg-background-hover'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </span>
                        <span className="text-foreground-subtle">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 w-full lg:hidden"
              >
                <div className="rounded-xl border border-border bg-background-secondary p-4">
                  <h3 className="mb-3 font-semibold">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={!selectedCategory ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => handleCategoryChange('')}
                    >
                      All
                    </Badge>
                    {NFT_CATEGORIES.map((category) => (
                      <Badge
                        key={category.value}
                        variant={selectedCategory === category.value ? 'primary' : 'default'}
                        className="cursor-pointer"
                        onClick={() => handleCategoryChange(category.value)}
                      >
                        {category.icon} {category.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid */}
          <div className="flex-1">
            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground-muted">Active filters:</span>
                {searchQuery && (
                  <Badge variant="primary" className="gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        debouncedSearch('');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="primary" className="gap-1">
                    {getCategoryLabel(selectedCategory)}
                    <button onClick={() => handleCategoryChange('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results count */}
            <p className="mb-6 text-sm text-foreground-muted">
              {viewMode === 'collections' 
                ? `Showing ${filteredCollections.length} collection${filteredCollections.length !== 1 ? 's' : ''}`
                : `Showing ${filteredNFTs.length + dbNFTs.length} NFT${filteredNFTs.length + dbNFTs.length !== 1 ? 's' : ''}`
              }
            </p>

            {/* Collections View */}
            {viewMode === 'collections' ? (
              isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-border bg-background-card"
                    >
                      <div className="aspect-[4/3] bg-background-hover" />
                      <div className="p-4">
                        <div className="h-6 w-3/4 rounded bg-background-hover" />
                        <div className="mt-2 h-4 w-1/2 rounded bg-background-hover" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCollections.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCollections.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link href={`/collection/${collection.id}`}>
                        <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={collection.coverImage}
                              alt={collection.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <Badge
                              variant="default"
                              className="absolute left-3 top-3 bg-black/50 text-white"
                            >
                              {getCategoryLabel(collection.category)}
                            </Badge>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold text-white">
                                {collection.name}
                              </h3>
                              <p className="mt-1 text-sm text-white/80">
                                {collection.totalItems} items
                              </p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar
                                  src={collection.creatorAvatar}
                                  alt={collection.creatorName}
                                  fallback={collection.creatorName}
                                  size="sm"
                                />
                                <span className="text-sm text-foreground-muted">
                                  @{collection.creatorUsername}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-foreground-muted">Floor</p>
                                <p className="font-bold text-accent-primary">
                                  {formatETH(collection.floorPrice)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                              <div>
                                <p className="text-xs text-foreground-muted">Total Volume</p>
                                <p className="font-semibold">{formatETH(collection.totalVolume)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-foreground-muted">USD</p>
                                <p className="text-sm text-foreground-subtle">
                                  {formatEthToUsd(collection.totalVolume)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-lg text-foreground-muted">
                    No collections found matching your criteria
                  </p>
                  <Button onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              )
            ) : (
              /* Items View */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Database NFTs first */}
                {dbNFTs.map((nft, index) => (
                  <motion.div
                    key={`db-${nft._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <Link href={`/nft/${nft._id}`}>
                      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={nft.thumbnailUrl || nft.mediaUrl}
                            alt={nft.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <Badge variant="primary" className="absolute right-3 top-3">
                            New
                          </Badge>
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="flex items-center gap-1 text-sm text-white">
                              <Heart className="h-4 w-4" />
                              {nft.likes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-white">
                              <Eye className="h-4 w-4" />
                              {nft.views}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-1 font-semibold group-hover:text-accent-primary">
                            {nft.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <Avatar
                              src={nft.creator.avatar}
                              alt={nft.creator.name}
                              size="xs"
                              fallback={nft.creator.name}
                            />
                            <span className="text-sm text-foreground-muted">
                              @{nft.creator.username}
                            </span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-foreground-subtle">Price</p>
                            <p className="font-bold text-accent-primary">
                              {formatETH(nft.price)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Sample NFTs */}
                {filteredNFTs.map((nft, index) => (
                  <motion.div
                    key={`sample-${nft.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (dbNFTs.length + index) * 0.02 }}
                  >
                    <Link href={`/nft/${nft.id}`}>
                      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={nft.mediaUrl}
                            alt={nft.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="flex items-center gap-1 text-sm text-white">
                              <Heart className="h-4 w-4" />
                              {nft.likes}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-white">
                              <Eye className="h-4 w-4" />
                              {nft.views}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-1 font-semibold group-hover:text-accent-primary">
                            {nft.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <Avatar
                              src={nft.creatorAvatar}
                              alt={nft.creatorName}
                              size="xs"
                              fallback={nft.creatorName}
                            />
                            <span className="text-sm text-foreground-muted">
                              @{nft.creatorUsername}
                            </span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-foreground-subtle">Price</p>
                            <p className="font-bold text-accent-primary">
                              {formatETH(nft.price)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<Loading text="Loading collections..." />}>
      <ExploreContent />
    </Suspense>
  );
}