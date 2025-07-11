'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Star, Plus, Minus, Check, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types/product'
import Image from 'next/image'

interface ProductDetailPageProps {
  product: Product
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('description')
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleAddToCart = () => {
    console.log('Add to cart:', { product: product.name, quantity })
  }

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    console.log(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist', product.name)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    }
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square relative bg-gray-800 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-24 w-24 text-gray-500" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {product.category.name}
                  </Badge>
                  {product.featured && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-gray-300 text-lg">{product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-300">
                  {product.averageRating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-white">
                ₹{product.price.toLocaleString()}
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-600 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 text-gray-300 hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-white">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-2 text-gray-300 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  className={`border-gray-600 ${
                    isInWishlist ? 'text-red-400 border-red-400' : 'text-gray-300'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Quality Assured</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Easy Returns</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8">
                {['description', 'nutrition', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      selectedTab === tab
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8">
              {selectedTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-white mb-4">Product Description</h3>
                  <p className="text-gray-300">{product.description}</p>
                  
                  <h4 className="text-lg font-semibold text-white mt-6 mb-3">Ingredients</h4>
                  <ul className="text-gray-300">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>• {ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTab === 'nutrition' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Nutritional Information</h3>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{product.nutritionalInfo.calories}</div>
                        <div className="text-gray-400">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{product.nutritionalInfo.protein}g</div>
                        <div className="text-gray-400">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{product.nutritionalInfo.carbs}g</div>
                        <div className="text-gray-400">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{product.nutritionalInfo.fat}g</div>
                        <div className="text-gray-400">Fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-gray-300">John D.</span>
                      </div>
                      <p className="text-gray-300">
                        Great product! High quality ingredients and excellent taste. 
                        Would definitely recommend to anyone looking for healthy snack options.
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-gray-300">Sarah M.</span>
                      </div>
                      <p className="text-gray-300">
                        Good product overall. The packaging could be improved but the taste is excellent.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}