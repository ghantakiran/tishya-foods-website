'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, MapPin, CreditCard, Download, Share2, Phone, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Order, PaymentStatus } from '@/types'
import { OrderService } from '@/lib/order-service'
import { formatPrice } from '@/lib/utils'
// import { useToast } from '@/hooks/use-toast'

interface OrderConfirmationEnhancedProps {
  order: Order
  onContinueShopping: () => void
}

export function OrderConfirmationEnhanced({ 
  order: initialOrder, 
  onContinueShopping 
}: OrderConfirmationEnhancedProps) {
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(false)
  // const { toast } = useToast()

  // Poll for order updates
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const updatedOrder = await OrderService.getOrder(order.id)
        if (updatedOrder && updatedOrder.updatedAt !== order.updatedAt) {
          setOrder(updatedOrder)
          
          // Show notification for status changes
          if (updatedOrder.status !== order.status) {
            const statusInfo = OrderService.getOrderStatusDisplay(updatedOrder.status)
            console.log('Order Status Updated:', `Your order is now ${statusInfo.label.toLowerCase()}`)
            // toast({
            //   title: 'Order Status Updated',
            //   description: `Your order is now ${statusInfo.label.toLowerCase()}`,
            // })
          }
        }
      } catch (error) {
        console.error('Error polling order status:', error)
      }
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(pollInterval)
  }, [order.id, order.updatedAt, order.status])

  const statusInfo = OrderService.getOrderStatusDisplay(order.status)
  const formattedOrder = OrderService.formatOrderForDisplay(order)

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    console.log('Download Started: Your invoice will be downloaded shortly.')
    // toast({
    //   title: 'Download Started',
    //   description: 'Your invoice will be downloaded shortly.',
    // })
    console.log('Downloading invoice for order:', order.id)
  }

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${order.id}`,
        text: `I just placed an order with Tishya Foods! Order total: ${formattedOrder.formattedTotal}`,
        url: window.location.href,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      console.log('Link Copied: Order link copied to clipboard.')
      // toast({
      //   title: 'Link Copied',
      //   description: 'Order link copied to clipboard.',
      // })
    }
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case 'confirmed':
      case 'processing':
        return <Package className="w-8 h-8 text-blue-400" />
      case 'shipped':
        return <Truck className="w-8 h-8 text-purple-400" />
      case 'delivered':
        return <CheckCircle className="w-8 h-8 text-green-400" />
      default:
        return <Package className="w-8 h-8 text-yellow-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mb-4">
            {getStatusIcon()}
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Order {order.status === 'pending' ? 'Received' : 'Confirmed'}!
          </h1>
          <p className="text-gray-400">
            Thank you for your order. We'll send you updates as your order progresses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-100">
                  <span>Order Status</span>
                  <Badge className={`${statusInfo.color} bg-transparent border`}>
                    {statusInfo.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300">{statusInfo.description}</p>
                  
                  {order.orderNumber && (
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Order Number:</span>
                      <span className="font-mono text-sm text-gray-200">{order.orderNumber}</span>
                    </div>
                  )}
                  
                  {order.estimatedDelivery && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Estimated Delivery:</span>
                      <span className="text-sm text-gray-200">{formattedOrder.estimatedDeliveryFormatted}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-200">Product #{item.productId}</h4>
                        {item.variant && (
                          <div className="text-sm text-gray-400 mt-1">
                            {item.variant.size && <span>Size: {item.variant.size}</span>}
                            {item.variant.size && item.variant.flavor && <span> • </span>}
                            {item.variant.flavor && <span>Flavor: {item.variant.flavor}</span>}
                          </div>
                        )}
                        <div className="text-sm text-gray-400">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-200">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-100">
                  <MapPin className="w-5 h-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300">
                  <div className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                  <div>{order.shippingAddress.line1}</div>
                  {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                  <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
                  <div>{order.shippingAddress.country}</div>
                  {order.shippingAddress.phone && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Order ID</span>
                    <span className="font-mono text-gray-200">{order.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Order Date</span>
                    <span className="text-gray-200">{formattedOrder.formattedDate}</span>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-200">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-gray-200">
                      {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-gray-200">{formatPrice(order.taxes)}</span>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-100">Total</span>
                    <span className="text-gray-100">{formattedOrder.formattedTotal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-100">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300">
                  <div className="font-medium">{order.paymentMethod}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Transaction ID: {order.transactionId}
                  </div>
                  <Badge 
                    className={`mt-2 ${
                      order.paymentStatus === PaymentStatus.PAID
                        ? 'bg-green-900 text-green-200 border-green-600' 
                        : 'bg-yellow-900 text-yellow-200 border-yellow-600'
                    }`}
                  >
                    {order.paymentStatus === PaymentStatus.PAID ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              
              <Button
                onClick={handleShareOrder}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Order
              </Button>
              
              <Button
                onClick={onContinueShopping}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Contact Support */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href="mailto:support@tishyafoods.com" className="text-blue-400 hover:text-blue-300">
                    support@tishyafoods.com
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href="tel:+1-800-TISHYA" className="text-blue-400 hover:text-blue-300">
                    +1-800-TISHYA
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}