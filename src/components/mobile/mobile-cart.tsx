'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useTouchGestures } from '@/lib/touch'
import { formatPrice } from '@/lib/utils'
import { AccessibleButton } from '@/components/accessibility/accessible-button'
import { AccessibleImage } from '@/components/accessibility/accessible-image'

interface MobileCartProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileCart({ isOpen, onClose }: MobileCartProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  // Handle swipe to close
  useTouchGestures(
    cartRef,
    {
      onSwipeDown: (gesture) => {
        if (gesture.distance > 100) {
          onClose()
        }
      },
    },
    { swipeThreshold: 50 }
  )

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId)
    } else {
      await updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleCheckout = () => {
    onClose()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  if (!cart || cart.items.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={onClose}
            />

            {/* Empty Cart */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-[70] lg:hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-100">Cart</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    aria-label="Close cart"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Add some delicious items to get started!
                  </p>
                  <AccessibleButton
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </AccessibleButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            onClick={onClose}
          />

          {/* Cart Panel */}
          <motion.div
            ref={cartRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-[70] lg:hidden max-h-[90vh] overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-100">Cart</h2>
                <p className="text-sm text-gray-400">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 max-h-[50vh]">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-4 bg-gray-800 rounded-lg p-4"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <AccessibleImage
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-100 text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatPrice(item.price)} each
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </motion.button>
                          <span className="text-gray-100 font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                          >
                            <Plus size={14} />
                          </motion.button>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-bold text-gray-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{cart.shippingCost > 0 ? formatPrice(cart.shippingCost) : 'Free'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-100 pt-3 border-t border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(cart.finalTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Checkout</span>
                  <ArrowRight size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}