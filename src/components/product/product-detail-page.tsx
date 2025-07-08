'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Star, Plus, Minus, Check, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { ProductImageGallery } from './product-image-gallery'
import ProductNutritionInfo from './product-nutrition-info'
import ProductReviews from './product-reviews'
import RelatedProducts from './related-products'
import { ProductStructuredData } from '@/components/seo/product-structured-data'

interface ProductDetailPageProps {
  product: Product
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('description')
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      <ProductStructuredData product={product} />
      
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Product Images */}
            <div className="space-y-4">
              <ProductImageGallery 
                images={product.images || ['/images/products/default.jpg']}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    {product.category}
                  </Badge>
                  {product.isOrganic && (
                    <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                      Organic
                    </Badge>
                  )}
                  {product.isGlutenFree && (
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                      Gluten-Free
                    </Badge>
                  )}
                  {product.isVegan && (
                    <Badge variant="secondary" className="bg-orange-900/30 text-orange-300">
                      Vegan
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 ml-2">
                      ({product.rating?.toFixed(1)}) • {product.reviewCount || 0} reviews
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-green-400">
                    ${product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <Badge 
                    variant={product.inStock ? 'default' : 'destructive'}
                    className={product.inStock ? 'bg-green-900/30 text-green-300' : ''}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>

                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-600 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-white font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <span className="text-gray-400">
                    Total: <span className="text-white font-semibold">${(product.price * quantity).toFixed(2)}</span>
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className={`border-gray-600 ${
                      isInWishlist(product.id)
                        ? 'bg-red-900/30 text-red-300 border-red-600'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={shareProduct}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">30-Day Returns</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'nutrition', label: 'Nutrition' },
                  { id: 'reviews', label: 'Reviews' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-green-500 text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {selectedTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {product.longDescription || product.description}
                  </p>
                  {product.benefits && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Key Benefits</h3>
                      <ul className="space-y-2">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'nutrition' && (
                <ProductNutritionInfo nutrition={product.nutrition} />
              )}

              {selectedTab === 'reviews' && (
                <ProductReviews productId={product.id} />
              )}
            </div>
          </motion.div>

          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <RelatedProducts 
              currentProduct={product}
              category={product.category}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}