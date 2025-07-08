'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, GitCompare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { WishlistButton } from '@/components/ui/wishlist-button'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import { AccessibleButton, AccessibleIconButton } from '@/components/accessibility/accessible-button'
import { AccessibleImage } from '@/components/accessibility/accessible-image'
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
    <motion.article
      data-testid="product-card"
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
        variant === 'grid' 
          ? 'flex flex-col bg-gray-800 border border-gray-700' 
          : 'flex flex-row bg-gray-800 border border-gray-700'
      }`}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role="article"
      aria-labelledby={`product-${product.id}-title`}
      aria-describedby={`product-${product.id}-description`}
    >
      {/* Product Image Container */}
      <div className={`relative overflow-hidden ${
        variant === 'grid' 
          ? 'aspect-square' 
          : 'w-48 flex-shrink-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10" />
        
        <AccessibleImage
          src={product.images[0]}
          alt={`${product.name} - ${product.description}`}
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
            <span className="text-gray-100 font-bold text-lg text-center px-4">
              {product.name}
            </span>
          </div>
        )}

        {/* Product Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {product.featured && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-3 py-1 text-xs shadow-lg">
              Featured
            </Badge>
          )}
          {product.isOrganic && (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-3 py-1 text-xs shadow-lg">
              Organic
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          {onQuickView && (
            <AccessibleIconButton
              icon={<Eye className="h-4 w-4" />}
              label={`Quick view ${product.name}`}
              variant="secondary"
              size="icon"
              className="bg-gray-100/90 hover:bg-gray-100 text-gray-800 hover:text-gray-900 shadow-lg backdrop-blur-sm"
              onClick={() => onQuickView(product)}
            />
          )}
          
          {onCompare && (
            <AccessibleIconButton
              icon={<GitCompare className="h-4 w-4" />}
              label={`Add ${product.name} to comparison`}
              variant="secondary"
              size="icon"
              className="bg-gray-100/90 hover:bg-gray-100 text-gray-800 hover:text-gray-900 shadow-lg backdrop-blur-sm"
              onClick={() => onCompare(product)}
            />
          )}
          
          <WishlistButton product={product} variant="icon" size="sm" />
        </div>
      </div>

      {/* Product Information */}
      <div className={`p-6 ${variant === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 id={`product-${product.id}-title`} className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>

        <p id={`product-${product.id}-description`} className="text-gray-300 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Nutritional Highlights */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 font-medium px-3 py-1 text-xs border border-blue-500/30">
            {product.nutritionalInfo.protein}g Protein
          </Badge>
          <Badge className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 font-medium px-3 py-1 text-xs border border-green-500/30">
            {product.nutritionalInfo.calories} Cal
          </Badge>
        </div>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.isGlutenFree && (
            <Badge className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 font-medium px-2 py-1 text-xs border border-purple-500/30">
              Gluten Free
            </Badge>
          )}
          {product.isVegan && (
            <Badge className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 font-medium px-2 py-1 text-xs border border-emerald-500/30">
              Vegan
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock > 10 ? (
            <span className="text-green-400 font-medium text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" aria-hidden="true"></div>
              In Stock
            </span>
          ) : product.stock > 0 ? (
            <span className="text-yellow-400 font-medium text-sm flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" aria-hidden="true"></div>
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-red-400 font-medium text-sm flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" aria-hidden="true"></div>
              Out of Stock
            </span>
          )}
        </div>

        {/* Cart Status or Add to Cart Button */}
        <AccessibleButton
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          loadingText={isLoading ? 'Adding to cart...' : undefined}
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </AccessibleButton>
      </div>
    </motion.article>
  )
}