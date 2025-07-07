'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/contexts/wishlist-context'
import { Product } from '@/types/product'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  product: Product
  variant?: 'default' | 'icon' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export function WishlistButton({ 
  product, 
  variant = 'default',
  size = 'md',
  className,
  showText = true 
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const inWishlist = isInWishlist(product.id)

  const handleClick = () => {
    setIsAnimating(true)
    
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn(
          'p-2 hover:bg-gray-700/50 transition-colors',
          className
        )}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <motion.div
          animate={{ 
            scale: isAnimating ? [1, 1.2, 1] : 1,
            rotate: isAnimating ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            className={cn(
              iconSizes[size],
              inWishlist 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 hover:text-red-400'
            )} 
          />
        </motion.div>
      </Button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'p-1 rounded-full hover:bg-gray-700/50 transition-colors',
          className
        )}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <motion.div
          animate={{ 
            scale: isAnimating ? [1, 1.3, 1] : 1 
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            className={cn(
              iconSizes[size],
              inWishlist 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 hover:text-red-400'
            )} 
          />
        </motion.div>
      </button>
    )
  }

  return (
    <Button
      variant={inWishlist ? 'default' : 'outline'}
      onClick={handleClick}
      className={cn(
        sizeClasses[size],
        inWishlist 
          ? 'bg-red-600 hover:bg-red-700 border-red-600' 
          : 'border-gray-600 hover:bg-gray-700 hover:border-red-400',
        'transition-all duration-200',
        className
      )}
    >
      <motion.div
        animate={{ 
          scale: isAnimating ? [1, 1.2, 1] : 1,
          rotate: isAnimating ? [0, -5, 5, 0] : 0
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <Heart 
          className={cn(
            iconSizes[size],
            inWishlist ? 'fill-current' : ''
          )} 
        />
        {showText && (
          <span>
            {inWishlist ? 'Saved' : 'Save'}
          </span>
        )}
      </motion.div>
    </Button>
  )
}