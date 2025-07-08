'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      title: 'Excellent quality!',
      content: 'This product exceeded my expectations. The quality is outstanding and it arrived quickly.',
      date: '2024-01-15',
      verified: true,
      helpful: 12
    },
    {
      id: '2',
      author: 'Mike R.',
      rating: 4,
      title: 'Good value for money',
      content: 'Great product overall. Would recommend to others looking for quality natural foods.',
      date: '2024-01-10',
      verified: true,
      helpful: 8
    }
  ])

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }))

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-400">
              Based on {reviews.length} reviews
            </div>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-300">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400 w-8">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{review.author}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                
                <h4 className="font-medium text-white mb-2">{review.title}</h4>
                <p className="text-gray-300 mb-4">{review.content}</p>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Not helpful
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review CTA */}
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Share your experience
        </h3>
        <p className="text-gray-400 mb-4">
          Help other customers by writing a review
        </p>
        <Button className="bg-green-600 hover:bg-green-700">
          Write a Review
        </Button>
      </div>
    </div>
  )
}