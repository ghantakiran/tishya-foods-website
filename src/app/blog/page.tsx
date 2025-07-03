'use client'

import { BlogProvider, useBlog } from '@/contexts/blog-context'
import { BlogList } from '@/components/blog/blog-list'
import { BlogFilters } from '@/components/blog/blog-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

const blogStats = [
  {
    icon: BookOpen,
    label: 'Articles Published',
    value: '120+',
    description: 'Expert-written content'
  },
  {
    icon: Users,
    label: 'Expert Authors',
    value: '8',
    description: 'Nutrition specialists'
  },
  {
    icon: TrendingUp,
    label: 'Monthly Readers',
    value: '50K+',
    description: 'Growing community'
  },
  {
    icon: Calendar,
    label: 'Updated',
    value: 'Weekly',
    description: 'Fresh content regularly'
  }
]

const featuredCategories = [
  {
    id: '1',
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'Science-backed nutrition guidance',
    postCount: 24,
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Health',
    slug: 'health',
    description: 'Holistic health and wellness',
    postCount: 18,
    color: '#3B82F6'
  },
  {
    id: '4',
    name: 'Recipes',
    slug: 'recipes',
    description: 'Healthy and delicious recipes',
    postCount: 15,
    color: '#F59E0B'
  },
  {
    id: '3',
    name: 'Sustainability',
    slug: 'sustainability',
    description: 'Sustainable food practices',
    postCount: 12,
    color: '#059669'
  }
]

function BlogPageContent() {
  const { categories, tags, fetchCategories, fetchTags } = useBlog()

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [fetchCategories, fetchTags])

  return (
    <div className="min-h-screen bg-earth-900">
      {/* Hero Section */}
      <div className="bg-earth-800 border-b border-earth-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-cream-100 mb-6">
              Nutrition & Wellness
              <span className="block text-primary">Knowledge Hub</span>
            </h1>
            <p className="text-xl text-cream-300 mb-8 leading-relaxed">
              Discover expert insights on nutrition, health, and sustainable living. 
              Our team of nutrition specialists shares science-backed advice to help you make informed choices about your health and wellness.
            </p>
            
            {/* Blog Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {blogStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-cream-100 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-cream-300 mb-1">{stat.label}</div>
                  <div className="text-xs text-earth-400">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Featured Categories - Use real categories or fallback to mock */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {(categories.length > 0 ? categories.slice(0, 4) : featuredCategories).map((category) => (
                <Link key={category.id} href={`/blog/category/${category.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full bg-earth-700 border-earth-600">
                    <CardContent className="p-4 text-center">
                      <div 
                        className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${category.color || '#10B981'}20` }}
                      >
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: category.color || '#10B981' }}
                        />
                      </div>
                      <h3 className="font-semibold text-sm mb-1 text-cream-100">{category.name}</h3>
                      <p className="text-xs text-earth-400 mb-2 line-clamp-2">
                        {category.description}
                      </p>
                      <Badge variant="secondary" className="text-xs bg-earth-600 text-cream-200">
                        {category.postCount || 0} articles
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BlogFilters 
                filters={{}}
                categories={categories}
                tags={tags}
                onFilterChange={() => {}}
                onClear={() => {}}
              />
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:col-span-3">
            <BlogList />
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Our Latest Articles
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Get weekly nutrition tips, health insights, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-cream-100 bg-earth-800 placeholder-earth-400 border-earth-600"
              />
              <Button 
                variant="secondary" 
                className="px-8 py-3 bg-earth-800 text-primary hover:bg-cream-100"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <BlogProvider>
      <BlogPageContent />
    </BlogProvider>
  )
}