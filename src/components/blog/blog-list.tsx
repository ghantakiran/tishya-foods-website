'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPostCard } from './blog-post-card'
import { BlogFilters } from './blog-filters'
import { BlogSearch } from './blog-search'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlog } from '@/contexts/blog-context'
import { BlogFilters as BlogFiltersType } from '@/types/blog'
import { useAnalytics } from '@/hooks/use-analytics'
import { Grid, List, SlidersHorizontal } from 'lucide-react'

interface BlogListProps {
  initialFilters?: BlogFiltersType
  showSearch?: boolean
  showFilters?: boolean
  showViewToggle?: boolean
}

export function BlogList({ 
  initialFilters = {}, 
  showSearch = true, 
  showFilters = true,
  showViewToggle = true 
}: BlogListProps) {
  const { posts, fetchPosts, isLoading, categories, tags, fetchCategories, fetchTags } = useBlog()
  const analytics = useAnalytics()
  
  const [filters, setFilters] = useState<BlogFiltersType>({
    page: 1,
    limit: 12,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    ...initialFilters
  })
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [fetchCategories, fetchTags])

  const loadPosts = useCallback(async () => {
    try {
      await fetchPosts(filters)
      
      // Simple pagination check - in real app, this would come from API response
      setHasMore(posts.length === (filters.limit || 12))
      
      analytics.trackUserAction('filter', {
        element_type: 'blog_filters',
        additional_data: {
          filters: Object.keys(filters).filter(key => filters[key as keyof BlogFiltersType]),
          result_count: posts.length
        }
      })
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }, [fetchPosts, filters, posts.length, analytics])

  useEffect(() => {
    loadPosts()
  }, [filters, loadPosts])

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm, page: 1 })
    analytics.trackSearchQuery(searchTerm, posts.length)
  }

  const handleFilterChange = (newFilters: Partial<BlogFiltersType>) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }

  const handleLoadMore = () => {
    setFilters({ ...filters, page: (filters.page || 1) + 1 })
    analytics.trackUserAction('click', {
      element_type: 'load_more_button',
      additional_data: {
        current_page: filters.page || 1
      }
    })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    analytics.trackUserAction('click', {
      element_type: 'view_toggle',
      additional_data: {
        view_mode: mode
      }
    })
  }

  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {showSearch && (
          <div className="w-full max-w-md">
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        {showSearch && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <BlogSearch onSearch={handleSearch} initialValue={filters.search} />
            
            <div className="flex items-center gap-2">
              {showViewToggle && (
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {showFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {showFilters && showFiltersPanel && (
          <BlogFilters
            filters={filters}
            categories={categories}
            tags={tags}
            onFilterChange={handleFilterChange}
            onClear={() => setFilters({ page: 1, limit: 12, sortBy: 'publishedAt', sortOrder: 'desc' })}
          />
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {filters.search ? `Search results for "${filters.search}"` : 'All posts'}
          {posts.length > 0 && ` (${posts.length} ${posts.length === 1 ? 'post' : 'posts'})`}
        </p>
        
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange({ search: undefined })}
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && !filters.search && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Featured Posts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.slice(0, 2).map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                variant="featured"
                showExcerpt={true}
                showAuthor={true}
                showStats={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 ? (
        <div className="space-y-4">
          {featuredPosts.length > 0 && !filters.search && (
            <h2 className="text-xl font-bold">Latest Posts</h2>
          )}
          
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {regularPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                showExcerpt={viewMode !== 'list'}
                showAuthor={true}
                showStats={true}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                {isLoading ? 'Loading...' : 'Load More Posts'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        !isLoading && (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search 
                ? `No posts match your search for "${filters.search}"`
                : 'No posts available at the moment'
              }
            </p>
            {filters.search && (
              <Button onClick={() => handleFilterChange({ search: undefined })}>
                View all posts
              </Button>
            )}
          </Card>
        )
      )}
    </div>
  )
}