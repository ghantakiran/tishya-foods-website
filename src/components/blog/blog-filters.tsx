'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { BlogFilters as BlogFiltersType, BlogCategory, BlogTag } from '@/types/blog'
import { X, Filter } from 'lucide-react'

interface BlogFiltersProps {
  filters: BlogFiltersType
  categories: BlogCategory[]
  tags: BlogTag[]
  onFilterChange: (filters: Partial<BlogFiltersType>) => void
  onClear: () => void
}

export function BlogFilters({ 
  filters, 
  categories, 
  tags, 
  onFilterChange, 
  onClear 
}: BlogFiltersProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = filters.category?.split(',') || []
    let updatedCategories: string[]

    if (checked) {
      updatedCategories = [...currentCategories, categoryId]
    } else {
      updatedCategories = currentCategories.filter(id => id !== categoryId)
    }

    onFilterChange({
      category: updatedCategories.length > 0 ? updatedCategories.join(',') : undefined
    })
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    const currentTags = filters.tag?.split(',') || []
    let updatedTags: string[]

    if (checked) {
      updatedTags = [...currentTags, tagId]
    } else {
      updatedTags = currentTags.filter(id => id !== tagId)
    }

    onFilterChange({
      tag: updatedTags.length > 0 ? updatedTags.join(',') : undefined
    })
  }

  const selectedCategories = filters.category?.split(',') || []
  const selectedTags = filters.tag?.split(',') || []
  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0 || 
                          filters.sortBy !== 'publishedAt' || filters.sortOrder !== 'desc'

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sort Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sort by</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={filters.sortBy || 'publishedAt'}
              onValueChange={(value) => onFilterChange({ sortBy: value as any })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedAt">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="viewCount">Views</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortOrder || 'desc'}
              onValueChange={(value) => onFilterChange({ sortOrder: value as 'asc' | 'desc' })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                  >
                    {category.name}
                    {category.postCount && (
                      <Badge variant="secondary" className="text-xs">
                        {category.postCount}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tags.slice(0, 10).map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={(checked) => 
                      handleTagChange(tag.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                  >
                    #{tag.name}
                    {tag.postCount && (
                      <Badge variant="secondary" className="text-xs">
                        {tag.postCount}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Status Filter (for admin) */}
        {filters.status && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange({ status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Featured Posts Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.featured || false}
            onCheckedChange={(checked) => 
              onFilterChange({ featured: checked ? true : undefined })
            }
          />
          <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
            Featured posts only
          </Label>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-3 border-t">
            <Label className="text-sm font-medium mb-2 block">Active filters</Label>
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId)
                if (!category) return null
                
                return (
                  <Badge 
                    key={categoryId} 
                    variant="secondary" 
                    className="text-xs flex items-center gap-1"
                  >
                    {category.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCategoryChange(categoryId, false)}
                    />
                  </Badge>
                )
              })}
              
              {selectedTags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId)
                if (!tag) return null
                
                return (
                  <Badge 
                    key={tagId} 
                    variant="secondary" 
                    className="text-xs flex items-center gap-1"
                  >
                    #{tag.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagChange(tagId, false)}
                    />
                  </Badge>
                )
              })}
              
              {filters.featured && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  Featured
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange({ featured: undefined })}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}