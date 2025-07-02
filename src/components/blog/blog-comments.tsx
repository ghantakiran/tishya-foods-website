'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Heart, Reply, Flag, ThumbsUp, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAnalytics } from '@/hooks/use-analytics'

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
    isVerified?: boolean
  }
  createdAt: string
  likeCount: number
  isLiked?: boolean
  replies?: Comment[]
  parentId?: string
}

interface BlogCommentsProps {
  postId: string
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: 'This is such a comprehensive guide! I\'ve been looking for reliable information about protein sources, and this covers everything perfectly. The section on plant-based proteins is particularly helpful.',
      author: {
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
        isVerified: true
      },
      createdAt: '2024-01-16T14:30:00Z',
      likeCount: 12,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          content: 'I agree! The plant-based section really opened my eyes to quinoa as a complete protein. I never knew that before.',
          author: {
            name: 'Sarah Chen',
            avatar: '/images/avatars/sarah.jpg'
          },
          createdAt: '2024-01-16T15:15:00Z',
          likeCount: 3,
          isLiked: true,
          parentId: '1'
        }
      ]
    },
    {
      id: '2',
      content: 'Great article! I\'m curious about the triple-washing process you mentioned. Could you share more details about how this affects the nutritional value compared to regular washing?',
      author: {
        name: 'Michael Rodriguez',
        avatar: '/images/avatars/michael.jpg'
      },
      createdAt: '2024-01-16T16:45:00Z',
      likeCount: 8,
      isLiked: false
    },
    {
      id: '3',
      content: 'As someone who recently switched to a plant-based diet, this guide is exactly what I needed. The hemp seeds recommendation is something I hadn\'t considered before. Thanks for the detailed breakdown!',
      author: {
        name: 'Emily Watson',
        avatar: '/images/avatars/emily.jpg'
      },
      createdAt: '2024-01-17T09:20:00Z',
      likeCount: 15,
      isLiked: true
    }
  ])
  
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  
  const analytics = useAnalytics()

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: 'You',
        avatar: '/images/avatars/default.jpg'
      },
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false
    }

    setComments([comment, ...comments])
    setNewComment('')
    
    analytics.trackUserAction('form_submit', {
      element_type: 'blog_comment',
      additional_data: {
        post_id: postId,
        comment_length: newComment.length
      }
    })
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: {
        name: 'You',
        avatar: '/images/avatars/default.jpg'
      },
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
      parentId
    }

    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ))
    
    setReplyContent('')
    setReplyingTo(null)
    
    analytics.trackUserAction('form_submit', {
      element_type: 'blog_comment_reply',
      additional_data: {
        post_id: postId,
        parent_comment_id: parentId,
        reply_length: replyContent.length
      }
    })
  }

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies?.map(reply => 
                reply.id === commentId 
                  ? { 
                      ...reply, 
                      isLiked: !reply.isLiked,
                      likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1
                    }
                  : reply
              )
            }
          : comment
      ))
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
            }
          : comment
      ))
    }
    
    analytics.trackUserAction('click', {
      element_type: 'comment_like',
      additional_data: {
        post_id: postId,
        comment_id: commentId,
        is_reply: isReply
      }
    })
  }

  const CommentComponent = ({ comment, isReply = false, parentId }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>
            {comment.author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.author.isVerified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`flex items-center gap-1 hover:text-primary transition-colors ${
                comment.isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likeCount}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            )}
            
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Flag className="h-3 w-3" />
              Report
            </button>
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentComponent 
                  key={reply.id} 
                  comment={reply} 
                  isReply={true} 
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length + comments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0)})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts on this article..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Be respectful and constructive in your comments.
            </p>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
        
        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
        
        {comments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No comments yet</h3>
            <p>Be the first to share your thoughts on this article!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}