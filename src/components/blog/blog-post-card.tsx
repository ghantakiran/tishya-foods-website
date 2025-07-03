'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlogPost } from '@/types/blog'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAnalytics } from '@/hooks/use-analytics'

interface BlogPostCardProps {
  post: BlogPost
  variant?: 'default' | 'featured' | 'compact'
  showExcerpt?: boolean
  showAuthor?: boolean
  showStats?: boolean
  className?: string
}

export function BlogPostCard({ 
  post, 
  variant = 'default', 
  showExcerpt = true, 
  showAuthor = true,
  showStats = true,
  className = ''
}: BlogPostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const analytics = useAnalytics()

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${post.slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url
        })
        
        analytics.trackUserAction('share', {
          element_type: 'blog_post',
          additional_data: {
            post_id: post.id,
            post_title: post.title,
            share_method: 'native'
          }
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        analytics.trackUserAction('share', {
          element_type: 'blog_post',
          additional_data: {
            post_id: post.id,
            post_title: post.title,
            share_method: 'clipboard'
          }
        })
      }
    } else {
      await navigator.clipboard.writeText(url)
      analytics.trackUserAction('share', {
        element_type: 'blog_post',
        additional_data: {
          post_id: post.id,
          post_title: post.title,
          share_method: 'clipboard'
        }
      })
    }
  }

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

  const handlePostClick = () => {
    analytics.trackUserAction('click', {
      element_type: 'blog_post_card',
      additional_data: {
        post_id: post.id,
        post_title: post.title
      }
    })
  }

  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${isFeatured ? 'lg:col-span-2' : ''} ${className}`}>
      {post.featuredImage && (
        <div className={`relative overflow-hidden ${isFeatured ? 'h-64' : isCompact ? 'h-32' : 'h-48'}`}>
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&crop=center';
            }}
          />
          {post.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
              Featured
            </Badge>
          )}
          {post.sticky && (
            <Badge className="absolute top-2 right-2 bg-blue-500">
              Pinned
            </Badge>
          )}
        </div>
      )}

      <CardHeader className={isCompact ? 'pb-2' : ''}>
        <div className="flex flex-wrap gap-1 mb-2">
          {post.categories.slice(0, 2).map((category) => (
            <Link key={category.id} href={`/blog/category/${category.slug}`}>
              <Badge 
                variant="secondary" 
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                style={{ backgroundColor: category.color ? `${category.color}20` : undefined }}
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} onClick={handlePostClick}>
          <h3 className={`font-bold group-hover:text-primary transition-colors line-clamp-2 ${
            isFeatured ? 'text-xl lg:text-2xl' : isCompact ? 'text-sm' : 'text-lg'
          }`}>
            {post.title}
          </h3>
        </Link>

        {showExcerpt && !isCompact && (
          <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
            {post.excerpt}
          </p>
        )}
      </CardHeader>

      <CardContent className={isCompact ? 'py-2' : ''}>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.publishedAt}>
              {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Draft'}
            </time>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime} min read</span>
          </div>

          {showStats && (
            <>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.viewCount.toLocaleString()}</span>
              </div>
              
              {post.commentCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.commentCount}</span>
                </div>
              )}
            </>
          )}
        </div>

        {!isCompact && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                  #{tag.name}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {(showAuthor || !isCompact) && (
        <CardFooter className="flex items-center justify-between pt-0">
          {showAuthor && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="text-xs">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium">{post.author.name}</p>
              </div>
            </div>
          )}

          {!isCompact && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-8 w-8 p-0 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`h-8 w-8 p-0 ${isBookmarked ? 'text-blue-500' : ''}`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}