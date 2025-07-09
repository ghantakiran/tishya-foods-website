'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle, Package, MapPin, CreditCard, Calendar, Truck, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Cart } from '@/types/cart'
import { PaymentAddress, PaymentMethod } from '@/types/payment'

interface OrderConfirmationProps {
  cart: Cart
  shippingAddress: PaymentAddress
  paymentMethod: PaymentMethod
}

export function OrderConfirmation({
  cart,
  shippingAddress,
  paymentMethod
}: OrderConfirmationProps) {
  const orderId = `TF${Date.now().toString().slice(-8)}`
  const estimatedDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    console.log('Downloading invoice...')
  }

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Tishya Foods Order Confirmation',
        text: `Order #${orderId} has been successfully placed!`,
        url: window.location.href
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`Order #${orderId} placed successfully at Tishya Foods!`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      {/* Success Icon and Message */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-cream-100 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-earth-600">
            Thank you for choosing Tishya Foods. Your order has been confirmed and is being processed.
          </p>
        </motion.div>
      </div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-earth-800 border rounded-lg p-6 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <Badge variant="success">Confirmed</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-earth-500" />
              <span className="text-sm text-earth-600">Order ID:</span>
              <span className="font-mono font-medium">#{orderId}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-earth-500" />
              <span className="text-sm text-earth-600">Order Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-earth-500" />
              <span className="text-sm text-earth-600">Expected Delivery:</span>
              <span className="font-medium text-green-600">
                {estimatedDeliveryDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-earth-500" />
              <span className="text-sm text-earth-600">Payment Method:</span>
              <span className="font-medium">{paymentMethod.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-earth-600">Total Amount:</span>
              <span className="font-bold text-lg text-primary-600">
                {formatPrice(cart.finalTotal)}
              </span>
            </div>

            {paymentMethod.type === 'cod' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                <p className="text-xs text-yellow-800">
                  Cash on Delivery - Pay when your order arrives
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Ordered Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-earth-800 border rounded-lg p-6 text-left"
      >
        <h3 className="text-lg font-semibold mb-4">Ordered Items</h3>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-earth-500">Quantity: {item.quantity}</p>
                <p className="text-sm text-green-600">{item.nutritionalInfo.protein}g protein</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-sm text-earth-500">{formatPrice(item.price)} each</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-earth-800 border rounded-lg p-6 text-left"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Shipping Address
        </h3>
        <div className="text-earth-700">
          <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
          <p>{shippingAddress.line1}</p>
          {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
          <p>{shippingAddress.country}</p>
          <p className="mt-2">
            <span className="text-sm text-earth-500">Phone:</span> {shippingAddress.phone}
          </p>
          <p>
            <span className="text-sm text-earth-500">Email:</span> {shippingAddress.email}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
      >
        <Button onClick={handleDownloadInvoice} variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download Invoice</span>
        </Button>

        <Button onClick={handleShareOrder} variant="outline" className="flex items-center space-x-2">
          <Share2 className="h-4 w-4" />
          <span>Share Order</span>
        </Button>

        <Button className="flex items-center space-x-2">
          <Package className="h-4 w-4" />
          <span>Track Order</span>
        </Button>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">We'll send you an email confirmation with tracking details</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">Your order will be packed and shipped within 1-2 business days</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">You'll receive SMS updates about your delivery status</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">Expected delivery: {estimatedDeliveryDate.toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Continue Shopping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        <Button size="lg" variant="outline" className="px-8">
          Continue Shopping
        </Button>
      </motion.div>
    </motion.div>
  )
}