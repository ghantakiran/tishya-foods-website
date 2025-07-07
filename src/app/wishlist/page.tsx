'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, X, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWishlist } from '@/contexts/wishlist-context'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, isLoading } = useWishlist()
  const { addItem } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleAddToCart = (productId: string) => {
    const product = items.find(item => item.id === productId)
    if (product) {
      // Convert Product to CartItem format
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        variant: undefined,
        nutritionalInfo: {
          protein: product.nutritionalInfo.protein,
          calories: product.nutritionalInfo.calories,
          servingSize: product.nutritionalInfo.servingSize
        }
      }
      addItem(cartItem)
      removeFromWishlist(productId)
    }
  }

  const handleClearWishlist = () => {
    clearWishlist()
    setShowClearConfirm(false)
  }

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center">
              <Heart className="h-8 w-8 mr-3 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-300 mt-2">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-400 mb-6">
                Start adding products you love to keep track of them
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/products">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Wishlist Items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-700 rounded-t-lg relative overflow-hidden">
                        <Image
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        {/* Stock Status */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <CardContent className="p-4">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-gray-100 mb-2 hover:text-green-400 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price and Category */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-xl font-bold text-gray-100">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {product.category.name}
                          </Badge>
                        </div>

                        {/* Dietary Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.isVegan && (
                            <Badge className="text-xs bg-green-600">Vegan</Badge>
                          )}
                          {product.isGlutenFree && (
                            <Badge className="text-xs bg-orange-600">Gluten-Free</Badge>
                          )}
                          {product.isOrganic && (
                            <Badge className="text-xs bg-emerald-600">Organic</Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product.id)}
                            disabled={product.stock === 0}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => removeFromWishlist(product.id)}
                            className="px-3 border-gray-600 hover:bg-gray-700"
                          >
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-lg p-6 max-w-md mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Clear Wishlist
                </h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 border-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearWishlist}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-600 hover:bg-gray-800"
            >
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}