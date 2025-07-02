'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity, applyCoupon, removeCoupon, isLoading } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    await applyCoupon(couponCode)
    setCouponCode('')
    setIsApplyingCoupon(false)
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Shopping Cart ({cart?.totalItems || 0})
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add some delicious protein-rich foods to get started!
                  </p>
                  <Button onClick={onClose} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-gray-400">
                            {item.variant.size && `Size: ${item.variant.size}`}
                            {item.variant.flavor && ` • Flavor: ${item.variant.flavor}`}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-green-600 mt-1">
                          <span>{item.nutritionalInfo.protein}g protein</span>
                          <span className="mx-1">•</span>
                          <span>{item.nutritionalInfo.calories} cal</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Coupon Section */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="h-4 w-4 text-primary-600" />
                      <span className="text-sm font-medium">Coupon Code</span>
                    </div>
                    
                    {cart.appliedCoupons.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {cart.appliedCoupons.map((coupon) => (
                          <div
                            key={coupon}
                            className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm"
                          >
                            <span>{coupon} Applied</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCoupon(coupon)}
                              className="h-auto p-0 text-green-600 hover:text-green-800"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || isApplyingCoupon}
                        loading={isApplyingCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {cart.shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(cart.shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{formatPrice(cart.finalTotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/checkout" onClick={onClose}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/cart" onClick={onClose}>
                      View Cart Details
                    </Link>
                  </Button>
                </div>

                {/* Free Shipping Notice */}
                {cart.totalPrice < 500 && (
                  <div className="text-xs text-center text-gray-500 bg-yellow-50 p-2 rounded-md">
                    Add {formatPrice(500 - cart.totalPrice)} more for free shipping!
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}