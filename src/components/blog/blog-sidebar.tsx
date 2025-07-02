'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BlogPost } from '@/types/blog'
import { 
  Search, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Clock,
  Tag,
  User,
  Mail,
  ArrowRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAnalytics } from '@/hooks/use-analytics'

interface BlogSidebarProps {
  currentPost?: BlogPost
}

export function BlogSidebar({ currentPost }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const analytics = useAnalytics()

  const relatedPosts = [
    {
      id: '2',
      title: 'Essential Vitamins and Minerals for Daily Health',
      slug: 'essential-vitamins-minerals-daily-health',
      excerpt: 'Learn about the key vitamins and minerals your body needs every day for optimal function.',
      featuredImage: '/images/blog/vitamins-minerals.jpg',
      publishedAt: '2024-01-10T10:00:00Z',
      readingTime: 6,
      viewCount: 892,
      author: {
        id: '2',
        name: 'Dr. Michael Health',
        email: 'michael@tishyafoods.com',
        avatar: '/images/authors/michael.jpg'
      },
      categories: [
        { id: '1', name: 'Nutrition', slug: 'nutrition', description: 'All about nutrition and healthy eating' }
      ]
    },
    {
      id: '3',
      title: 'Sustainable Farming Practices for Better Nutrition',
      slug: 'sustainable-farming-practices-better-nutrition',
      excerpt: 'Discover how sustainable farming methods lead to more nutritious and flavorful foods.',
      featuredImage: '/images/blog/sustainable-farming.jpg',
      publishedAt: '2024-01-08T14:00:00Z',
      readingTime: 10,
      viewCount: 654,
      author: {
        id: '3',
        name: 'Emma Farmer',
        email: 'emma@tishyafoods.com',
        avatar: '/images/authors/emma.jpg'
      },
      categories: [
        { id: '3', name: 'Sustainability', slug: 'sustainability', description: 'Sustainable practices and environmental impact' }
      ]
    },
    {
      id: '4',
      title: 'Ancient Grains: Rediscovering Nutritional Treasures',
      slug: 'ancient-grains-nutritional-treasures',
      excerpt: 'Explore the nutritional benefits of ancient grains and how to incorporate them into modern diets.',
      featuredImage: '/images/blog/ancient-grains.jpg',
      publishedAt: '2024-01-05T12:00:00Z',
      readingTime: 7,
      viewCount: 1123,
      author: {
        id: '1',
        name: 'Dr. Sarah Nutrition',
        email: 'sarah@tishyafoods.com',
        avatar: '/images/authors/sarah.jpg'
      },
      categories: [
        { id: '1', name: 'Nutrition', slug: 'nutrition', description: 'All about nutrition and healthy eating' },
        { id: '4', name: 'Recipes', slug: 'recipes', description: 'Healthy recipes and cooking tips' }
      ]
    }
  ]

  const popularPosts = [
    {
      id: '5',
      title: 'The Science Behind Fermented Foods',
      slug: 'science-behind-fermented-foods',
      viewCount: 2341,
      publishedAt: '2023-12-28T10:00:00Z'
    },
    {
      id: '6',
      title: 'Superfoods That Actually Live Up to the Hype',
      slug: 'superfoods-live-up-to-hype',
      viewCount: 1987,
      publishedAt: '2023-12-25T15:00:00Z'
    },
    {
      id: '7',
      title: 'Building a Balanced Meal: The Ultimate Guide',
      slug: 'building-balanced-meal-ultimate-guide',
      viewCount: 1765,
      publishedAt: '2023-12-22T11:00:00Z'
    },
    {
      id: '8',
      title: 'Hydration Beyond Water: Natural Alternatives',
      slug: 'hydration-beyond-water-natural-alternatives',
      viewCount: 1543,
      publishedAt: '2023-12-20T09:00:00Z'
    }
  ]

  const categories = [
    { id: '1', name: 'Nutrition', slug: 'nutrition', count: 24 },
    { id: '2', name: 'Health', slug: 'health', count: 18 },
    { id: '3', name: 'Sustainability', slug: 'sustainability', count: 12 },
    { id: '4', name: 'Recipes', slug: 'recipes', count: 15 },
    { id: '5', name: 'Wellness', slug: 'wellness', count: 9 }
  ]

  const popularTags = [
    { id: '1', name: 'protein', slug: 'protein', count: 15 },
    { id: '2', name: 'healthy-eating', slug: 'healthy-eating', count: 22 },
    { id: '3', name: 'plant-based', slug: 'plant-based', count: 18 },
    { id: '4', name: 'organic', slug: 'organic', count: 12 },
    { id: '5', name: 'superfoods', slug: 'superfoods', count: 9 },
    { id: '6', name: 'vitamins', slug: 'vitamins', count: 11 },
    { id: '7', name: 'minerals', slug: 'minerals', count: 8 },
    { id: '8', name: 'antioxidants', slug: 'antioxidants', count: 7 }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      analytics.trackUserAction('search', {
        element_type: 'blog_sidebar',
        additional_data: {
          search_query: searchQuery,
          search_location: 'sidebar'
        }
      })
      // Navigate to search results (would be implemented with router)
      console.log('Searching for:', searchQuery)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      analytics.trackUserAction('subscribe', {
        element_type: 'newsletter_signup',
        additional_data: {
          email_domain: email.split('@')[1],
          signup_location: 'blog_sidebar'
        }
      })
      setEmail('')
      // Handle newsletter subscription
      console.log('Newsletter subscription:', email)
    }
  }

  const handlePostClick = (postId: string, postTitle: string, section: string) => {
    analytics.trackUserAction('click', {
      element_type: 'related_post',
      additional_data: {
        post_id: postId,
        post_title: postTitle,
        section,
        current_post_id: currentPost?.id
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Blog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest articles and nutrition tips delivered to your inbox weekly.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="sm">
              Subscribe
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            No spam, unsubscribe anytime.
          </p>
        </CardContent>
      </Card>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Articles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <Link 
                  href={`/blog/${post.slug}`}
                  onClick={() => handlePostClick(post.id, post.title, 'related')}
                  className="group block"
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <time>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readingTime} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Popular Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularPosts.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              onClick={() => handlePostClick(post.id, post.title, 'popular')}
              className="block group"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.viewCount.toLocaleString()}</span>
                    </div>
                    <time>
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-sm group-hover:text-primary">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <Badge 
                  variant="outline" 
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  #{tag.name}
                  <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author Bio (if current post exists) */}
      {currentPost && currentPost.author.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              About the Author
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 relative overflow-hidden">
                <Image
                  src={currentPost.author.avatar || '/images/authors/default.jpg'}
                  alt={currentPost.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold mb-2">{currentPost.author.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {currentPost.author.bio}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/blog/author/${currentPost.author.id}`}>
                  View All Articles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}