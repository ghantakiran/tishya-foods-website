'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WishlistButton } from '@/components/ui/wishlist-button'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import { OptimizedImage } from '@/components/optimization/image-optimizer'
import { useCart } from '@/contexts/cart-context'
import { createCartItemFromProduct } from '@/lib/cart-utils'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
  onQuickView?: (product: Product) => void
  onCompare?: (product: Product) => void
  priority?: boolean
}

export function ProductCard({ 
  product, 
  variant = 'grid',
  onQuickView,
  onCompare,
  priority = false 
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    if (product.stock <= 0) return
    setIsLoading(true)
    try {
      await addItem(createCartItemFromProduct(product, 1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const isOutOfStock = product.stock <= 0
  // const isLowStock = product.stock > 0 && product.stock <= 10  // Not currently used

  return (
    <motion.div
      data-testid="product-card"
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
        variant === 'grid' 
          ? 'flex flex-col bg-gradient-to-br from-cream-50 to-cream-100 border border-cream-200' 
          : 'flex flex-row bg-gradient-to-r from-cream-50 to-cream-100 border border-cream-200'
      }`}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Product Image Container */}
      <div className={`relative overflow-hidden ${
        variant === 'grid' 
          ? 'aspect-square' 
          : 'w-48 flex-shrink-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-fresh-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10" />
        
        <OptimizedImage
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={400}
          priority={priority}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={handleImageLoad}
        />
        
        {/* Image Overlay with Product Name (Fallback) */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-200 to-fresh-200">
            <span className="text-primary-800 font-bold text-lg text-center px-4">
              {product.name}
            </span>
          </div>
        )}

        {/* Product Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {product.featured && (
            <Badge className="bg-gradient-to-r from-citrus-500 to-citrus-600 text-white font-semibold px-3 py-1 text-xs shadow-lg">
              Featured
            </Badge>
          )}
          {product.isOrganic && (
            <Badge className="bg-gradient-to-r from-fresh-500 to-fresh-600 text-white font-semibold px-3 py-1 text-xs shadow-lg">
              Organic
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          {onQuickView && (
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white text-primary-700 hover:text-primary-800 shadow-lg backdrop-blur-sm"
              onClick={() => onQuickView(product)}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          {onCompare && (
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white text-primary-700 hover:text-primary-800 shadow-lg backdrop-blur-sm"
              onClick={() => onCompare(product)}
              aria-label="Compare"
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          )}
          
          <WishlistButton product={product} variant="icon" size="sm" />
        </div>
      </div>

      {/* Product Information */}
      <div className={`p-6 ${variant === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-earth-800 group-hover:text-primary-700 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-primary-700 mb-1">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>

        <p className="text-earth-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Nutritional Highlights */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 font-medium px-3 py-1 text-xs border border-primary-300">
            {product.nutritionalInfo.protein}g Protein
          </Badge>
          <Badge className="bg-gradient-to-r from-citrus-100 to-citrus-200 text-citrus-800 font-medium px-3 py-1 text-xs border border-citrus-300">
            {product.nutritionalInfo.calories} Cal
          </Badge>
        </div>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.isGlutenFree && (
            <Badge className="bg-gradient-to-r from-fresh-100 to-fresh-200 text-fresh-800 font-medium px-2 py-1 text-xs border border-fresh-300">
              Gluten Free
            </Badge>
          )}
          {product.isVegan && (
            <Badge className="bg-gradient-to-r from-earth-100 to-earth-200 text-earth-800 font-medium px-2 py-1 text-xs border border-earth-300">
              Vegan
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock > 10 ? (
            <span className="text-fresh-600 font-medium text-sm flex items-center">
              <div className="w-2 h-2 bg-fresh-500 rounded-full mr-2"></div>
              In Stock
            </span>
          ) : product.stock > 0 ? (
            <span className="text-citrus-600 font-medium text-sm flex items-center">
              <div className="w-2 h-2 bg-citrus-500 rounded-full mr-2"></div>
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-berry-600 font-medium text-sm flex items-center">
              <div className="w-2 h-2 bg-berry-500 rounded-full mr-2"></div>
              Out of Stock
            </span>
          )}
        </div>

        {/* Cart Status or Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  )
}