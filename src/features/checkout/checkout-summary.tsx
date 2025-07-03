'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Tag, Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Cart } from '@/types/cart'

interface CheckoutSummaryProps {
  cart: Cart
}

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-earth-800 rounded-lg shadow-sm border p-6 sticky top-24"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingBag className="h-5 w-5 mr-2" />
        Order Summary
      </h3>

      {/* Items Count */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <span className="text-earth-600">Items ({cart.totalItems})</span>
        <span className="font-medium">{formatPrice(cart.totalPrice)}</span>
      </div>

      {/* Applied Coupons */}
      {cart.appliedCoupons.length > 0 && (
        <div className="mb-4 pb-4 border-b">
          <h4 className="text-sm font-medium text-earth-700 mb-2 flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            Applied Coupons
          </h4>
          <div className="space-y-2">
            {cart.appliedCoupons.map((coupon) => (
              <div key={coupon} className="flex items-center justify-between">
                <Badge variant="success" className="text-xs">
                  {coupon}
                </Badge>
                <span className="text-green-600 text-sm font-medium">
                  -{formatPrice(cart.discountAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex items-center justify-between text-sm">
          <span className="text-earth-600">Subtotal</span>
          <span>{formatPrice(cart.totalPrice)}</span>
        </div>

        {cart.discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-earth-600">Discount</span>
            <span className="text-green-600">-{formatPrice(cart.discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-1 text-earth-400" />
            <span className="text-earth-600">Shipping</span>
          </div>
          <span className={cart.shippingCost === 0 ? 'text-green-600' : ''}>
            {cart.shippingCost === 0 ? 'FREE' : formatPrice(cart.shippingCost)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calculator className="h-4 w-4 mr-1 text-earth-400" />
            <span className="text-earth-600">Taxes</span>
          </div>
          <span>Included</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span className="text-primary-600">{formatPrice(cart.finalTotal)}</span>
      </div>

      {/* Free Shipping Progress */}
      {cart.totalPrice < 500 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm">
            <p className="text-yellow-800 font-medium">
              Add {formatPrice(500 - cart.totalPrice)} more for free shipping!
            </p>
            <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(cart.totalPrice / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-earth-900 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-earth-800 rounded-full mx-auto mt-1" />
          </div>
          <div className="text-xs text-earth-600">
            <p className="font-medium">Secure Checkout</p>
            <p>Your payment information is encrypted and secure.</p>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Truck className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-800">
            <p className="font-medium">Estimated Delivery</p>
            <p>3-5 business days</p>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="mt-4 text-xs text-earth-500 text-center">
        <p>30-day return policy • Free returns</p>
      </div>
    </motion.div>
  )
}