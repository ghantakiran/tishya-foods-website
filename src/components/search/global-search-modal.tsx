'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  ShoppingBag, 
  FileText, 
  ChefHat, 
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  Command
} from 'lucide-react'
import Link from 'next/link'
import { AccessibleButton, AccessibleIconButton } from '@/components/accessibility/accessible-button'
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

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  'Protein bars',
  'Organic snacks',
  'Gluten-free',
  'Healthy breakfast',
  'Post-workout',
  'Low carb',
]

const SEARCH_CATEGORIES = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'products', label: 'Products', icon: ShoppingBag },
  { key: 'blog', label: 'Blog', icon: FileText },
  { key: 'recipes', label: 'Recipes', icon: ChefHat },
] as const

type SearchCategory = typeof SEARCH_CATEGORIES[number]['key']

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tishya-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by parent component
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string, category: SearchCategory) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    
    try {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        category: category === 'all' ? '' : category,
        limit: '10'
      })

      const response = await fetch(`/api/search?${searchParams}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce search queries
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(() => {
      performSearch(query, activeCategory)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, activeCategory, performSearch])

  const handleSearchSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5)
    
    setRecentSearches(newRecentSearches)
    localStorage.setItem('tishya-recent-searches', JSON.stringify(newRecentSearches))

    // Close modal and navigate
    onClose()
    
    // Navigate to search results page
    const searchParams = new URLSearchParams({
      q: searchQuery,
      category: activeCategory === 'all' ? '' : activeCategory
    })
    window.location.href = `/search?${searchParams}`
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('tishya-recent-searches')
  }

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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <Landmark role="dialog" label="Search">
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-2xl mx-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            aria-modal="true"
            aria-labelledby="search-title"
            role="dialog"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products, blog posts, recipes..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit(query)
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      aria-label="Search input"
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <AccessibleIconButton
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 rounded-xl"
                    icon={<X className="h-5 w-5" />}
                    label="Close search"
                  />
                </div>

                {/* Search Categories */}
                <div className="flex items-center space-x-2 mt-4">
                  {SEARCH_CATEGORIES.map((category) => {
                    const Icon = category.icon
                    const isActive = activeCategory === category.key
                    
                    return (
                      <AccessibleButton
                        key={category.key}
                        onClick={() => setActiveCategory(category.key)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-200"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{category.label}</span>
                      </AccessibleButton>
                    )
                  })}
                </div>

                {/* Keyboard shortcut hint */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span>Press Enter to search all results</span>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-400">
                      <Command className="h-3 w-3 inline mr-1" />K
                    </kbd>
                    <span>to search</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() ? (
                  /* Search Results */
                  <div className="p-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                        <span className="ml-3 text-gray-400">Searching...</span>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-2">
                        {results.map((result) => {
                          const Icon = getResultIcon(result.type)
                          
                          return (
                            <Link
                              key={result.id}
                              href={result.url}
                              onClick={onClose}
                              className="block p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group"
                            >
                              <div className="flex items-start space-x-3">
                                {result.image ? (
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <AccessibleImage
                                      src={result.image}
                                      alt={result.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                                    <Icon className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-gray-100 font-medium text-sm group-hover:text-blue-400 transition-colors duration-200 truncate">
                                      {result.title}
                                    </h3>
                                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full flex-shrink-0">
                                      {getResultTypeLabel(result.type)}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-xs line-clamp-2">
                                    {result.description}
                                  </p>
                                  {result.price && (
                                    <p className="text-green-400 text-sm font-medium mt-1">
                                      {result.price}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
                              </div>
                            </Link>
                          )
                        })}
                        
                        {/* View all results */}
                        <AccessibleButton
                          onClick={() => handleSearchSubmit(query)}
                          className="w-full mt-4 p-3 border border-gray-600 rounded-lg text-gray-300 hover:text-gray-100 hover:bg-gray-800/50 transition-all duration-200 text-sm"
                        >
                          View all results for "{query}"
                          <ArrowRight className="h-4 w-4 ml-2 inline" />
                        </AccessibleButton>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-medium mb-2">No results found</h3>
                        <p className="text-gray-500 text-sm">
                          Try different keywords or browse our categories
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty State with Popular Searches and Recent */
                  <div className="p-4 space-y-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-gray-300 font-medium text-sm flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Recent Searches
                          </h3>
                          <AccessibleButton
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-500 hover:text-gray-400 bg-transparent border-none p-0"
                          >
                            Clear
                          </AccessibleButton>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <AccessibleButton
                              key={index}
                              onClick={() => {
                                setQuery(search)
                                searchInputRef.current?.focus()
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-all duration-200 text-sm bg-transparent border-none"
                            >
                              <Search className="h-4 w-4 mr-3 inline text-gray-500" />
                              {search}
                            </AccessibleButton>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <h3 className="text-gray-300 font-medium text-sm mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Popular Searches
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {POPULAR_SEARCHES.map((search) => (
                          <AccessibleButton
                            key={search}
                            onClick={() => {
                              setQuery(search)
                              searchInputRef.current?.focus()
                            }}
                            className="p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-all duration-200 text-sm text-left border-none"
                          >
                            {search}
                          </AccessibleButton>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Landmark>
    </AnimatePresence>
  )
}