'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Select, Badge, Avatar, Card } from '@/components/ui';
import { sampleCollections, type SampleNFTCollection } from '@/lib/db/seed-data';
import { NFT_CATEGORIES, getCategoryLabel, debounce, formatETH } from '@/lib/utils';

const sortOptions = [
  { value: 'volume-desc', label: 'Highest Volume' },
  { value: 'volume-asc', label: 'Lowest Volume' },
  { value: 'floor-asc', label: 'Floor: Low to High' },
  { value: 'floor-desc', label: 'Floor: High to Low' },
  { value: 'items-desc', label: 'Most Items' },
  { value: 'items-asc', label: 'Fewest Items' },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sort') || 'volume-desc'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState<SampleNFTCollection[]>(sampleCollections);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort collections
  const filterCollections = useCallback(() => {
    setIsLoading(true);
    let result = [...sampleCollections];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (collection) =>
          collection.name.toLowerCase().includes(query) ||
          collection.description.toLowerCase().includes(query) ||
          collection.creatorName.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((collection) => collection.category === selectedCategory);
    }

    // Sorting
    const [sortField, sortOrder] = sortBy.split('-');
    result.sort((a, b) => {
      let aVal = 0;
      let bVal = 0;

      switch (sortField) {
        case 'floor':
          aVal = a.floorPrice;
          bVal = b.floorPrice;
          break;
        case 'items':
          aVal = a.totalItems;
          bVal = b.totalItems;
          break;
        case 'volume':
        default:
          aVal = a.totalVolume;
          bVal = b.totalVolume;
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : 1;
      }
      return aVal > bVal ? -1 : 1;
    });

    // Simulate loading
    setTimeout(() => {
      setFilteredCollections(result);
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
    filterCollections();
  }, [filterCollections]);

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

  return (
    <div className="py-8">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Explore Collections</h1>
          <p className="mt-2 text-foreground-muted">
            Discover exclusive NFT collections from world-class digital artists
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
              placeholder="Search collections or creators..."
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
                    <span className="text-foreground-subtle">{sampleCollections.length}</span>
                  </button>
                  {NFT_CATEGORIES.map((category) => {
                    const count = sampleCollections.filter(
                      (c) => c.category === category.value
                    ).length;
                    if (count === 0) return null;
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
                    {NFT_CATEGORIES.map((category) => {
                      const count = sampleCollections.filter(
                        (c) => c.category === category.value
                      ).length;
                      if (count === 0) return null;
                      return (
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
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collections Grid */}
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
              Showing {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}
            </p>

            {/* Collections Grid */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredCollections.map((collection) => (
                  <Link key={collection.id} href={`/collection/${collection.id}`}>
                    <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={collection.coverImage}
                          alt={collection.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white">{collection.name}</h3>
                          <p className="mt-1 text-sm text-white/80 line-clamp-1">
                            {collection.totalItems} items
                          </p>
                        </div>
                        <Badge
                          variant="default"
                          className="absolute right-3 top-3 bg-black/50 text-white"
                        >
                          {getCategoryLabel(collection.category)}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                          {collection.description}
                        </p>
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
                        <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                          <div>
                            <span className="text-foreground-muted">Volume: </span>
                            <span className="font-medium">{formatETH(collection.totalVolume)}</span>
                          </div>
                          <div>
                            <span className="text-foreground-muted">Items: </span>
                            <span className="font-medium">{collection.totalItems}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-foreground-muted">No collections found matching your criteria</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
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
    <Suspense fallback={<div className="section-container py-8">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}