'use client'

import { Button } from '@/components/ui/button'
import { BlogPost } from '@/types/blog'
import { Facebook, Twitter, Linkedin, Link, MessageCircle } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'

interface ShareButtonsProps {
  post: BlogPost
}

export function ShareButtons({ post }: ShareButtonsProps) {
  const analytics = useAnalytics()
  const postUrl = `${window.location.origin}/blog/${post.slug}`

  const handleShare = (platform: string, url: string) => {
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    
    analytics.trackUserAction('share', {
      element_type: 'blog_post',
      additional_data: {
        post_id: post.id,
        post_title: post.title,
        share_method: platform
      }
    })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      
      analytics.trackUserAction('share', {
        element_type: 'blog_post',
        additional_data: {
          post_id: post.id,
          post_title: post.title,
          share_method: 'copy_link'
        }
      })
      
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${postUrl}`)}`
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter', shareUrls.twitter)}
          className="flex items-center gap-2"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook', shareUrls.facebook)}
          className="flex items-center gap-2"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin', shareUrls.linkedin)}
          className="flex items-center gap-2"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('whatsapp', shareUrls.whatsapp)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          <Link className="h-4 w-4" />
          Copy Link
        </Button>
      </div>
    </div>
  )
}