'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products, productCategories } from '@/lib/products-data'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ProductImage } from '@/components/optimization/image-optimizer'
import { VirtualGrid } from '@/components/performance/virtual-list'
import { useRoutePerformance } from '@/components/performance/performance-init'
import { useDebounce } from '@/hooks/use-debounce'

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
  useRoutePerformance('products')
  
  // Debounce search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

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
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 font-montserrat">
            Our Products
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our complete range of protein-rich, natural foods crafted with care
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilters.includes(filter.key)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300">
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
              className={`bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Product Image */}
              <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'} relative overflow-hidden`}>
                <ProductImage
                  productId={product.id}
                  alt={product.name}
                  variant={viewMode === 'list' ? 'thumbnail' : 'card'}
                  priority={index < 4} // Prioritize first 4 images
                />
                
                {/* Fallback for missing images */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 opacity-0 hover:opacity-90 transition-opacity">
                  <span className="text-gray-100 font-bold text-lg">
                    {product.name}
                  </span>
                </div>
                
                {/* Product Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                  {product.isOrganic && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Organic
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="bg-gray-800/80 hover:bg-gray-800">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-100">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Nutritional Highlights */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-300">
                  <span className="bg-primary-100 px-2 py-1 rounded-full">
                    {product.nutritionalInfo.protein}g Protein
                  </span>
                  <span className="bg-primary-100 px-2 py-1 rounded-full">
                    {product.nutritionalInfo.calories} Cal
                  </span>
                </div>

                {/* Product Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.isGlutenFree && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Gluten Free
                    </span>
                  )}
                  {product.isVegan && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Vegan
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 10 ? (
                    <span className="text-green-600 text-sm">In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-600 text-sm">Only {product.stock} left</span>
                  ) : (
                    <span className="text-red-600 text-sm">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full group-hover:bg-primary-600 transition-colors">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
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
            <div className="text-gray-300 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No products found matching your criteria</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
            <Button 
              variant="outline" 
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