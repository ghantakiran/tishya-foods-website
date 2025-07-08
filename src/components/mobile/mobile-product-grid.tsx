'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Filter, SortAsc, Grid, List } from 'lucide-react'
import { Product } from '@/types/product'
import { ProductCard } from '@/components/product/product-card'
import { useTouchGestures } from '@/lib/touch'
import { AccessibleButton } from '@/components/accessibility/accessible-button'

interface MobileProductGridProps {
  products: Product[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  onFilterChange?: (filters: any) => void
  onSortChange?: (sort: string) => void
  currentSort?: string
}

interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

const sortOptions: FilterOption[] = [
  { id: 'featured', label: 'Featured', value: 'featured' },
  { id: 'newest', label: 'Newest', value: 'newest' },
  { id: 'price-low', label: 'Price: Low to High', value: 'price-asc' },
  { id: 'price-high', label: 'Price: High to Low', value: 'price-desc' },
  { id: 'rating', label: 'Customer Rating', value: 'rating' },
]

const filterCategories = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'protein', label: 'Protein Rich', value: 'protein', count: 24 },
      { id: 'organic', label: 'Organic', value: 'organic', count: 18 },
      { id: 'gluten-free', label: 'Gluten Free', value: 'gluten-free', count: 15 },
      { id: 'vegan', label: 'Vegan', value: 'vegan', count: 12 },
    ]
  },
  {
    id: 'price',
    label: 'Price Range',
    options: [
      { id: 'under-500', label: 'Under ₹500', value: '0-500', count: 32 },
      { id: '500-1000', label: '₹500 - ₹1000', value: '500-1000', count: 28 },
      { id: '1000-2000', label: '₹1000 - ₹2000', value: '1000-2000', count: 15 },
      { id: 'over-2000', label: 'Over ₹2000', value: '2000+', count: 8 },
    ]
  }
]

export function MobileProductGrid({ 
  products, 
  loading = false, 
  onLoadMore, 
  hasMore = false,
  onFilterChange,
  onSortChange,
  currentSort = 'featured'
}: MobileProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  // Handle pull-to-refresh
  const [pullOffset, setPullOffset] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  useTouchGestures(
    scrollRef,
    {
      onSwipeDown: (gesture) => {
        if (scrollRef.current && scrollRef.current.scrollTop === 0) {
          setPullOffset(Math.min(gesture.distance / 3, 60))
          setIsPulling(true)
          
          if (gesture.distance > 100) {
            // Trigger refresh
            window.location.reload()
          }
        }
      },
    },
    { swipeThreshold: 30 }
  )

  // Handle infinite scroll
  useEffect(() => {
    if (!scrollRef.current || !onLoadMore || !hasMore) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current!
      
      if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoadingMore) {
        setIsLoadingMore(true)
        onLoadMore()
      }
    }

    const scrollElement = scrollRef.current
    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [onLoadMore, hasMore, isLoadingMore])

  // Reset loading state when products change
  useEffect(() => {
    setIsLoadingMore(false)
  }, [products])

  const handleFilterChange = (categoryId: string, value: string) => {
    const newFilters = { ...activeFilters }
    
    if (!newFilters[categoryId]) {
      newFilters[categoryId] = []
    }
    
    const index = newFilters[categoryId].indexOf(value)
    if (index > -1) {
      newFilters[categoryId].splice(index, 1)
    } else {
      newFilters[categoryId].push(value)
    }
    
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSortChange = (sortValue: string) => {
    onSortChange?.(sortValue)
    setShowSort(false)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    onFilterChange?.({})
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).flat().length
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <AccessibleButton
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-colors"
          >
            <Filter size={16} />
            <span className="text-sm">Filter</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => setShowSort(true)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-colors"
          >
            <SortAsc size={16} />
            <span className="text-sm">Sort</span>
            <ChevronDown size={14} />
          </AccessibleButton>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Grid size={16} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <List size={16} />
          </motion.button>
        </div>
      </div>

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {isPulling && pullOffset > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-2 bg-gray-800 text-gray-300 text-sm"
          >
            Pull to refresh
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <motion.div
          layout
          className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' 
              : 'space-y-4'
          }`}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                variant={viewMode}
                priority={index < 4}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading more products...</p>
          </div>
        )}

        {/* No more products */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>You've reached the end!</p>
          </div>
        )}
      </div>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              ref={filtersRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-[70] max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-100">Filters</h3>
                  <div className="flex items-center space-x-2">
                    <AccessibleButton
                      onClick={clearAllFilters}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Clear All
                    </AccessibleButton>
                    <AccessibleButton
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-300 text-sm"
                    >
                      Done
                    </AccessibleButton>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {filterCategories.map((category) => (
                  <div key={category.id} className="p-4 border-b border-gray-700">
                    <h4 className="font-medium text-gray-100 mb-3">{category.label}</h4>
                    <div className="space-y-2">
                      {category.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={activeFilters[category.id]?.includes(option.value) || false}
                              onChange={() => handleFilterChange(category.id, option.value)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-300">{option.label}</span>
                          </div>
                          <span className="text-gray-500 text-sm">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sort Modal */}
      <AnimatePresence>
        {showSort && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setShowSort(false)}
            />
            <motion.div
              ref={sortRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-[70]"
            >
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">Sort by</h3>
              </div>
              <div className="p-4 space-y-2">
                {sortOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentSort === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}