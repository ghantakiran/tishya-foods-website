'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter, TrendingUp, Package, Tag, Leaf } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProductSearch } from '@/hooks/use-product-search'
import { SearchSuggestion } from '@/types/product'

interface ProductSearchProps {
  onOpenFilters?: () => void
  showFilters?: boolean
}

export function ProductSearch({ onOpenFilters, showFilters = true }: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
  const {
    filters,
    suggestions,
    updateFilters,
    searchByCategory,
    searchByIngredient,
    filteredCount,
    totalProducts
  } = useProductSearch()

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value })
    setShowSuggestions(value.length >= 2)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'product':
        // Navigate to product or add to search
        updateFilters({ search: suggestion.label })
        break
      case 'category':
        searchByCategory(suggestion.value)
        break
      case 'ingredient':
        searchByIngredient(suggestion.value)
        break
      case 'nutrition':
        updateFilters({ search: suggestion.value })
        break
    }
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    updateFilters({ search: '' })
    setShowSuggestions(false)
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />
      case 'category':
        return <Tag className="h-4 w-4" />
      case 'ingredient':
        return <Leaf className="h-4 w-4" />
      case 'nutrition':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getSuggestionTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return 'Product'
      case 'category':
        return 'Category'
      case 'ingredient':
        return 'Ingredient'
      case 'nutrition':
        return 'Nutrition'
      default:
        return ''
    }
  }

  const activeFiltersCount = 
    filters.categories.length +
    filters.nutritionalGoals.length +
    filters.dietaryRestrictions.length +
    filters.allergens.length +
    filters.certifications.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-earth-400" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products, ingredients, or categories..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            if (filters.search.length >= 2) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => setIsFocused(false)}
          className={`pl-10 pr-20 h-12 text-base transition-all duration-200 ${
            isFocused ? 'ring-2 ring-primary-500 border-primary-500' : ''
          }`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-cream-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenFilters}
              className={`h-8 px-2 ${activeFiltersCount > 0 ? 'text-primary-600' : ''}`}
            >
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-xs">
                {activeFiltersCount > 0 ? `${activeFiltersCount}` : 'Filter'}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-earth-800 rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-cream-200 mb-2 px-2">
                Search Suggestions
              </div>
              
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-earth-900 rounded-md transition-colors"
                >
                  <div className="text-earth-400">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-cream-100 truncate">
                        {suggestion.label}
                      </span>
                      {suggestion.count && (
                        <span className="text-xs text-cream-300">
                          ({suggestion.count})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-cream-300">
                      {getSuggestionTypeLabel(suggestion.type)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className="flex items-center justify-between mt-4 text-sm text-earth-600">
        <div>
          Showing {filteredCount.toLocaleString()} of {totalProducts.toLocaleString()} products
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2">
            <span>Active filters:</span>
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          </div>
        )}
      </div>

      {/* Quick Filter Tags */}
      {filters.search.length === 0 && (
        <div className="mt-4">
          <div className="text-xs font-medium text-earth-500 mb-2">Popular searches:</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'High Protein', action: () => updateFilters({ nutritionalGoals: ['high-protein'] }) },
              { label: 'Vegan', action: () => updateFilters({ dietaryRestrictions: ['vegan'] }) },
              { label: 'Gluten-Free', action: () => updateFilters({ dietaryRestrictions: ['gluten-free'] }) },
              { label: 'Organic', action: () => updateFilters({ dietaryRestrictions: ['organic'] }) },
              { label: 'Sweet Treats', action: () => searchByCategory('sweet-treats') },
              { label: 'Quinoa', action: () => handleSearchChange('quinoa') },
            ].map((tag) => (
              <button
                key={tag.label}
                onClick={tag.action}
                className="px-3 py-1 text-xs bg-cream-100 hover:bg-cream-200 rounded-full transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}