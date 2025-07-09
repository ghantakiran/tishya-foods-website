'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Package, 
  Truck, 
  MapPin, 
  Clock,
  Phone,
  Mail,
  Copy,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useOrders } from '@/contexts/order-context'
import { Order, TrackingInfo, OrderStatus } from '@/types/order'
import { formatPrice } from '@/lib/utils'
import { LoadingSpinner } from '@/components/loading/loading-skeleton'

interface OrderTrackingProps {
  orderId: string
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const { fetchOrderById, trackOrder } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState<TrackingInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const orderData = await fetchOrderById(orderId)
        if (orderData) {
          setOrder(orderData)
          const trackingData = await trackOrder(orderId)
          setTracking(trackingData)
        } else {
          setError('Order not found')
        }
      } catch {
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderData()
  }, [orderId, fetchOrderById, trackOrder])

  const copyTrackingNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber)
    }
  }

  const getTrackingSteps = () => {
    const allSteps = [
      { status: OrderStatus.CONFIRMED, label: 'Order Confirmed', icon: CheckCircle },
      { status: OrderStatus.PROCESSING, label: 'Processing', icon: Package },
      { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
      { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: Truck },
      { status: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle },
    ]

    return allSteps.map(step => {
      const trackingInfo = tracking.find(t => t.status === step.status)
      return {
        ...step,
        isCompleted: trackingInfo?.isCompleted || false,
        trackingInfo
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-cream-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-cream-100 mb-2">Order not found</h3>
        <p className="text-earth-600">{error || 'The order you are looking for does not exist.'}</p>
      </div>
    )
  }

  const trackingSteps = getTrackingSteps()
  const currentStepIndex = trackingSteps.findIndex(step => step.isCompleted) + 1

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-earth-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-cream-100">Order Tracking</h1>
            <p className="text-earth-600">Track your order status and delivery progress</p>
          </div>
          <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'default'} className="text-sm">
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-earth-600">Order Number</p>
            <div className="flex items-center space-x-2">
              <p className="font-mono font-semibold">{order.orderNumber}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyTrackingNumber}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-earth-600">Order Date</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-earth-600">Total Amount</p>
            <p className="font-semibold text-primary-600">{formatPrice(order.total)}</p>
          </div>
        </div>

        {order.estimatedDelivery && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {order.status === OrderStatus.DELIVERED ? 'Delivered on' : 'Estimated delivery'}:
              </span>
              <span className="text-sm text-blue-800">
                {new Date(order.actualDelivery || order.estimatedDelivery).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="bg-earth-800 rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-6">Tracking Progress</h2>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-cream-200" />
          <div 
            className="absolute left-6 top-0 w-0.5 bg-green-500 transition-all duration-1000"
            style={{ height: `${(currentStepIndex / trackingSteps.length) * 100}%` }}
          />

          {/* Tracking Steps */}
          <div className="space-y-8">
            {trackingSteps.map((step, index) => (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Step Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                  step.isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-earth-800 border-earth-600 text-earth-400'
                }`}>
                  {step.isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${step.isCompleted ? 'text-cream-100' : 'text-earth-500'}`}>
                      {step.label}
                    </h3>
                    {step.trackingInfo && (
                      <p className="text-sm text-earth-500">
                        {new Date(step.trackingInfo.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {step.trackingInfo && (
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-earth-600">{step.trackingInfo.message}</p>
                      {step.trackingInfo.location && (
                        <div className="flex items-center space-x-1 text-xs text-earth-500">
                          <MapPin className="h-3 w-3" />
                          <span>{step.trackingInfo.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-earth-800 rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium text-cream-100">{item.name}</h3>
                <p className="text-sm text-earth-600">{item.description}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-earth-500">
                  <span>{item.nutritionalInfo.protein}g protein</span>
                  <span>{item.nutritionalInfo.calories} cal</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-sm text-earth-500">{formatPrice(item.price)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-earth-800 rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Delivery Address
        </h2>
        <div className="text-earth-700">
          <p className="font-medium">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p>{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{order.shippingAddress.phone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{order.shippingAddress.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 text-sm mb-4">
          If you have any questions about your order or delivery, our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Call Support</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email Support</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <ExternalLink className="h-4 w-4" />
            <span>Live Chat</span>
          </Button>
        </div>
      </div>
    </div>
  )
}