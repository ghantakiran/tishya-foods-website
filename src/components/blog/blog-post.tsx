'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { BlogPost as BlogPostType } from '@/types/blog'
import { BlogComments } from './blog-comments'
import { BlogSidebar } from './blog-sidebar'
import { ShareButtons } from './share-buttons'
import { ReadingProgress } from './reading-progress'
import { TableOfContents } from './table-of-contents'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  ArrowLeft,
  Bookmark,
  BookmarkCheck
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAnalytics } from '@/hooks/use-analytics'
import { useBlog } from '@/contexts/blog-context'

interface BlogPostProps {
  post: BlogPostType
}

export function BlogPost({ post }: BlogPostProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; title: string; level: number }>>([])
  
  const analytics = useAnalytics()
  const { incrementViewCount } = useBlog()

  useEffect(() => {
    // Track page view
    incrementViewCount(post.id)
    
    // Generate table of contents
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const toc = headings.map((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) heading.id = id
      
      return {
        id,
        title: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      }
    })
    setTableOfContents(toc)

    // Track reading progress
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setReadingProgress(progress)

      // Track reading milestones
      if (progress >= 25 && progress < 26) {
        analytics.trackEngagement('scroll_depth', { percentage: 25 })
      } else if (progress >= 50 && progress < 51) {
        analytics.trackEngagement('scroll_depth', { percentage: 50 })
      } else if (progress >= 75 && progress < 76) {
        analytics.trackEngagement('scroll_depth', { percentage: 75 })
      } else if (progress >= 90 && progress < 91) {
        analytics.trackEngagement('scroll_depth', { percentage: 90 })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [post.id, analytics, incrementViewCount])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    analytics.trackUserAction('click', {
      element_type: 'bookmark_button',
      additional_data: {
        post_id: post.id,
        bookmarked: !isBookmarked
      }
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    analytics.trackUserAction('click', {
      element_type: 'like_button',
      additional_data: {
        post_id: post.id,
        liked: !isLiked
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ReadingProgress progress={readingProgress} />
      
      {/* Header */}
      <div className="bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link key={category.id} href={`/blog/category/${category.slug}`}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground">
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-100 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publishedAt}>
                        {formatDistanceToNow(new Date(post.publishedAt!), { addSuffix: true })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentCount}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'text-blue-500 border-blue-500' : ''}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 mr-2 fill-current" />
                  ) : (
                    <Bookmark className="h-4 w-4 mr-2" />
                  )}
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {post.featuredImage && (
                  <div className="relative h-64 lg:h-96 mb-8">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                      priority
                    />
                  </div>
                )}

                <div className="p-8">
                  {/* Table of Contents */}
                  {tableOfContents.length > 0 && (
                    <TableOfContents items={tableOfContents} />
                  )}

                  {/* Content */}
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                              #{tag.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share */}
                  <div className="mt-8 pt-6 border-t">
                    <ShareButtons post={post} />
                  </div>

                  {/* Author Bio */}
                  {post.author.bio && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">About {post.author.name}</h3>
                          <p className="text-muted-foreground mb-3">{post.author.bio}</p>
                          {post.author.socialLinks && (
                            <div className="flex gap-2">
                              {post.author.socialLinks.website && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={post.author.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                    Website
                                  </a>
                                </Button>
                              )}
                              {post.author.socialLinks.twitter && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={post.author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                    Twitter
                                  </a>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <div className="mt-8">
              <BlogComments postId={post.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar currentPost={post} />
          </div>
        </div>
      </div>
    </div>
  )
}