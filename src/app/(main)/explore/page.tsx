'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Select, Badge } from '@/components/ui';
import { NFTGrid } from '@/components/nft';
import { sampleNFTs, type SampleNFT } from '@/lib/db/seed-data';
import { NFT_CATEGORIES, getCategoryLabel, debounce } from '@/lib/utils';

const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'views-desc', label: 'Most Viewed' },
  { value: 'likes-desc', label: 'Most Liked' },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [sortBy, setSortBy] = useState(
    `${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('sortOrder') || 'desc'}`
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filteredNFTs, setFilteredNFTs] = useState<SampleNFT[]>(sampleNFTs);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort NFTs
  const filterNFTs = useCallback(() => {
    setIsLoading(true);
    let result = [...sampleNFTs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (nft) =>
          nft.title.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query) ||
          nft.creatorName.toLowerCase().includes(query) ||
          nft.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((nft) => nft.category === selectedCategory);
    }

    // Sorting
    const [sortField, sortOrder] = sortBy.split('-');
    result.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'views':
          aVal = a.views;
          bVal = b.views;
          break;
        case 'likes':
          aVal = a.likes;
          bVal = b.likes;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : 1;
      }
      return aVal > bVal ? -1 : 1;
    });

    // Simulate loading
    setTimeout(() => {
      setFilteredNFTs(result);
      setIsLoading(false);
    }, 300);
  }, [searchQuery, selectedCategory, sortBy]);

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
    filterNFTs();
  }, [filterNFTs]);

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
    const [field, order] = value.split('-');
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', field || 'createdAt');
    params.set('sortOrder', order || 'desc');
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('createdAt-desc');
    router.push('/explore', { scroll: false });
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="py-8">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Explore NFTs</h1>
          <p className="mt-2 text-foreground-muted">
            Discover unique digital collectibles from creators around the world
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, creator, or tags..."
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

          {/* Sort and Filter buttons */}
          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              className="w-48"
            />
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
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-accent-primary/20 text-accent-secondary'
                        : 'text-foreground-muted hover:bg-background-hover'
                    }`}
                  >
                    All Categories
                    <span className="text-foreground-subtle">{sampleNFTs.length}</span>
                  </button>
                  {NFT_CATEGORIES.map((category) => {
                    const count = sampleNFTs.filter(
                      (nft) => nft.category === category.value
                    ).length;
                    return (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          selectedCategory === category.value
                            ? 'bg-accent-primary/20 text-accent-secondary'
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
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full"
                >
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
                        variant={
                          selectedCategory === category.value
                            ? 'primary'
                            : 'default'
                        }
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

          {/* NFT Grid */}
          <div className="flex-1">
            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground-muted">
                  Active filters:
                </span>
                {searchQuery && (
                  <Badge variant="primary" className="gap-1">
                    Search: {searchQuery}
                    <button onClick={() => {
                      setSearchQuery('');
                      debouncedSearch('');
                    }}>
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
              Showing {filteredNFTs.length} results
            </p>

            {/* NFT Grid */}
            <NFTGrid
              nfts={filteredNFTs}
              isLoading={isLoading}
              emptyMessage="No NFTs found matching your criteria"
              columns={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="section-container py-8">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
