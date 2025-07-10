'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  FileText, 
  ChefHat,
  Grid,
  List,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { AccessibleButton } from '@/components/accessibility/accessible-button'
import { AccessibleImage } from '@/components/accessibility/accessible-image'
import { Landmark } from '@/components/accessibility/screen-reader'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  type: 'product' | 'blog' | 'recipe'
  description: string
  url: string
  image?: string
  price?: string
  category?: string
  tags?: string[]
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  category: string
  suggestions?: string[]
}

const SEARCH_CATEGORIES = [
  { key: 'all', label: 'All Results', icon: Search },
  { key: 'products', label: 'Products', icon: ShoppingBag },
  { key: 'blog', label: 'Blog Posts', icon: FileText },
  { key: 'recipes', label: 'Recipes', icon: ChefHat },
] as const

type SearchCategory = typeof SEARCH_CATEGORIES[number]['key']
type ViewMode = 'grid' | 'list'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = (searchParams.get('category') || 'all') as SearchCategory

  const [query, setQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState<SearchCategory>(initialCategory)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Perform search
  const performSearch = async (searchQuery: string, category: SearchCategory) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotalResults(0)
      setSuggestions([])
      return
    }

    setIsLoading(true)
    
    try {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        category: category === 'all' ? '' : category,
        limit: '50'
      })

      const response = await fetch(`/api/search?${searchParams}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data.results || [])
        setTotalResults(data.total || 0)
        setSuggestions(data.suggestions || [])
      } else {
        setResults([])
        setTotalResults(0)
        setSuggestions([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotalResults(0)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Search when query or category changes
  useEffect(() => {
    performSearch(query, activeCategory)
  }, [query, activeCategory])

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (activeCategory !== 'all') params.set('category', activeCategory)
    
    const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [query, activeCategory])

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'product': return ShoppingBag
      case 'blog': return FileText
      case 'recipe': return ChefHat
      default: return Search
    }
  }

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'product': return 'Product'
      case 'blog': return 'Blog Post'
      case 'recipe': return 'Recipe'
      default: return 'Result'
    }
  }

  const getCategoryResults = (type: SearchResult['type']) => {
    return results.filter(result => result.type === type)
  }

  return (
    <Landmark role="main" label="Search results">
      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-6">
              Search Results
            </h1>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, blog posts, recipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                aria-label="Search input"
              />
            </div>

            {/* Search Categories */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {SEARCH_CATEGORIES.map((category) => {
                const Icon = category.icon
                const isActive = activeCategory === category.key
                const categoryCount = category.key === 'all' 
                  ? totalResults 
                  : getCategoryResults(category.key as any).length
                
                return (
                  <AccessibleButton
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                    {categoryCount > 0 && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      )}>
                        {categoryCount}
                      </span>
                    )}
                  </AccessibleButton>
                )
              })}
            </div>

            {/* Results Summary and Controls */}
            <div className="flex items-center justify-between">
              <div className="text-gray-400">
                {query && (
                  <>
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Searching...
                      </span>
                    ) : (
                      <span>
                        {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {results.length > 0 && (
                <div className="flex items-center space-x-2">
                  <AccessibleButton
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      viewMode === 'grid'
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-gray-200"
                    )}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </AccessibleButton>
                  <AccessibleButton
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      viewMode === 'list'
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-gray-200"
                    )}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </AccessibleButton>
                </div>
              )}
            </div>
          </motion.div>

          {/* Search Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-400 text-lg">Searching...</span>
              </div>
            ) : query && results.length > 0 ? (
              <div className={cn(
                "gap-6",
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "space-y-4"
              )}>
                {results.map((result, index) => {
                  const Icon = getResultIcon(result.type)
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link
                        href={result.url}
                        className={cn(
                          "block p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-200 group",
                          viewMode === 'list' && "flex items-start space-x-6"
                        )}
                      >
                        <div className={cn(
                          "relative mb-4 rounded-lg overflow-hidden",
                          viewMode === 'grid' 
                            ? "w-full h-48" 
                            : "w-24 h-24 flex-shrink-0 mb-0"
                        )}>
                          {result.image ? (
                            <AccessibleImage
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <Icon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                              {getResultTypeLabel(result.type)}
                            </span>
                            {result.category && (
                              <span className="text-xs text-gray-500">
                                {result.category}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors duration-200">
                            {result.title}
                          </h3>
                          
                          <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                            {result.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {result.price && (
                              <span className="text-green-400 font-semibold">
                                {result.price}
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            ) : query && !isLoading ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                  No results found for "{query}"
                </h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Try different keywords, check your spelling, or browse our categories.
                </p>
                
                {suggestions.length > 0 && (
                  <div className="max-w-md mx-auto">
                    <p className="text-gray-400 text-sm mb-3">Did you mean:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion) => (
                        <AccessibleButton
                          key={suggestion}
                          onClick={() => setQuery(suggestion)}
                          className="px-3 py-1 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-200 rounded-lg text-sm transition-all duration-200 border-none"
                        >
                          {suggestion}
                        </AccessibleButton>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                  Start your search
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Enter keywords to search across our products, blog posts, and recipes.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Landmark>
  )
}

export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-900 pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}