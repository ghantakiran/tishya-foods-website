'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, ShoppingCart, Star, Badge, Plus, Scale, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products, productCategories } from '@/lib/products-data'
import { Product } from '@/types/product'
import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'

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
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [compareList, setCompareList] = useState<Product[]>([])
  const { addItem } = useCart()

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return []
    
    const productSuggestions = products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
      .map(product => product.name)
    
    return productSuggestions
  }, [searchTerm])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory
      const matchesFilters = selectedFilters.every(filter => 
        product[filter as keyof Product] === true
      )
      
      return matchesSearch && matchesCategory && matchesFilters
    })

    // Sort products
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [searchTerm, selectedCategory, selectedFilters, sortBy])

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedFilters([])
    setSortBy('featured')
  }

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const isInList = prev.some(p => p.id === product.id)
      if (isInList) {
        return prev.filter(p => p.id !== product.id)
      } else if (prev.length < 4) {
        return [...prev, product]
      }
      return prev
    })
  }

  const clearCompare = () => {
    setCompareList([])
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
          className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                data-testid="product-search-input"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
              />
              {/* Search Suggestions */}
              {suggestions.length > 0 && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(suggestion)}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <select
              data-testid="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
              className="px-4 py-2 bg-gray-900 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode and Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
                title="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
                title="Product comparison"
              >
                <Link href="/compare">
                  <Scale className="mr-2 h-4 w-4" />
                  Compare
                </Link>
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-t border-gray-700 pt-6"
            >
              <div className="flex flex-wrap gap-3">
                {filterOptions.map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => toggleFilter(filter.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedFilters.includes(filter.key)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-md border border-gray-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count and Compare Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center space-x-4">
            {(searchTerm || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Clear Filters
              </Button>
            )}
            {compareList.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  {compareList.length}/4 selected for comparison
                </span>
                <Button 
                  size="sm"
                  onClick={clearCompare}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Clear
                </Button>
                <Button 
                  size="sm"
                  asChild
                  disabled={compareList.length < 2}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                >
                  <Link href={`/compare?products=${compareList.map(p => p.id).join(',')}`}>
                    <Scale className="mr-2 h-4 w-4" />
                    Compare ({compareList.length})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid/List */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div 
                data-testid="product-card"
                className={`bg-gray-800/80 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600 group ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : 'flex flex-col'
                }`}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 ${
                  viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48 mb-4'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-300 font-bold text-lg text-center px-4">
                      {product.name}
                    </span>
                  </div>
                  {/* Product badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.featured && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Organic
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-right ml-4">
                      <span className="text-2xl font-bold text-blue-400">₹{product.price}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  </div>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.isGlutenFree && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                        Gluten Free
                      </span>
                    )}
                    {product.isVegan && (
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                        Vegan
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                        Organic
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => addItem({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.images[0] || '/images/placeholder.jpg',
                          variant: undefined,
                          nutritionalInfo: {
                            protein: product.nutritionalInfo?.protein || 0,
                            calories: product.nutritionalInfo?.calories || 0,
                            servingSize: product.nutritionalInfo?.servingSize || '100g'
                          }
                        })}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => toggleCompare(product)}
                        variant={compareList.some(p => p.id === product.id) ? 'default' : 'outline'}
                        size="icon"
                        disabled={!compareList.some(p => p.id === product.id) && compareList.length >= 4}
                        className={`${
                          compareList.some(p => p.id === product.id)
                            ? 'bg-orange-600 hover:bg-orange-700 text-white border-0'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                        title={compareList.some(p => p.id === product.id) ? 'Remove from comparison' : 'Add to comparison'}
                      >
                        {compareList.some(p => p.id === product.id) ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {compareList.some(p => p.id === product.id) && (
                      <p className="text-xs text-orange-400 text-center">
                        Added to comparison
                      </p>
                    )}
                    
                    {!compareList.some(p => p.id === product.id) && compareList.length >= 4 && (
                      <p className="text-xs text-gray-500 text-center">
                        Max 4 products for comparison
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-gray-300 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
              <p className="text-lg font-medium">No products found matching your criteria</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
        {/* Floating Compare Button */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-gray-800 border border-gray-600 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-300 font-medium">
                  {compareList.length}/4 Products Selected
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {compareList.map((product) => (
                    <div key={product.id} className="relative">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-300 border border-gray-600">
                        {product.name.charAt(0)}
                      </div>
                      <button
                        onClick={() => toggleCompare(product)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                        title={`Remove ${product.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearCompare}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  asChild
                  disabled={compareList.length < 2}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-0"
                >
                  <Link href={`/compare?products=${compareList.map(p => p.id).join(',')}`}>
                    <Scale className="mr-2 h-4 w-4" />
                    Compare Now
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}