'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products, productCategories } from '@/lib/products-data'
import { Product } from '@/types'
// import { ProductCard } from '@/components/product/product-card'
// import { VirtualGrid } from '@/components/performance/virtual-list'
// import { useRoutePerformance } from '@/components/performance/performance-init'
// import { useDebounce } from '@/hooks/use-debounce'

const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured' },
]

const filterOptions = [
  { key: 'isGlutenFree', label: 'Gluten Free' },
  { key: 'isVegan', label: 'Vegan' },
  { key: 'isOrganic', label: 'Organic' },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Performance tracking
  // useRoutePerformance('products')
  
  // Debounce search for better performance
  // const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const debouncedSearchTerm = searchTerm

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory
    const matchesFilters = selectedFilters.every(filter => 
      product[filter as keyof Product] === true
    )
    
    return matchesSearch && matchesCategory && matchesFilters
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'featured':
        return b.featured ? 1 : -1
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-cream-50 via-primary-50 to-fresh-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-800 mb-4 font-montserrat">
            Our Products
          </h1>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto">
            Discover our complete range of protein-rich, natural foods crafted with care
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-cream-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-500 h-5 w-5" />
              <input
                data-testid="product-search-input"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-cream-300 text-earth-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder-earth-500"
              />
            </div>

            {/* Category Filter */}
            <select
              data-testid="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-cream-300 text-earth-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">All Categories</option>
              {productCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-cream-300 text-earth-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filterOptions.map(filter => (
              <button
                key={filter.key}
                onClick={() => toggleFilter(filter.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilters.includes(filter.key)
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'bg-cream-200 text-earth-700 hover:bg-cream-300 hover:shadow-md'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-earth-700 font-medium">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div 
                data-testid="product-card"
                className="bg-gradient-to-br from-cream-50 to-cream-100 border border-cream-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-fresh-100 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-primary-800 font-bold text-lg">{product.name}</span>
                </div>
                <h3 className="text-xl font-bold text-primary-800 mb-2">{product.name}</h3>
                <p className="text-earth-700 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">₹{product.price}</span>
                  <button 
                    data-testid="add-to-cart-button"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-earth-700 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50 text-earth-500" />
              <p className="text-lg font-medium">No products found matching your criteria</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
            <Button 
              variant="outline" 
              className="border-primary-500 text-primary-700 hover:bg-primary-50"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedFilters([])
              }}
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}