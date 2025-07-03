'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  RotateCcw, 
  X, 
  Package, 
  Truck, 
  MapPin,
  Calendar,
  CreditCard,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Order, OrderStatus } from '@/types/order'

interface OrderCardProps {
  order: Order
  onDownloadInvoice: () => void
  onReorder: () => void
  onCancel: (reason?: string) => void
}

export function OrderCard({ order, onDownloadInvoice, onReorder, onCancel }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'success'
      case OrderStatus.SHIPPED:
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'default'
      case OrderStatus.PROCESSING:
        return 'secondary'
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pending'
      case OrderStatus.CONFIRMED:
        return 'Confirmed'
      case OrderStatus.PROCESSING:
        return 'Processing'
      case OrderStatus.SHIPPED:
        return 'Shipped'
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'Out for Delivery'
      case OrderStatus.DELIVERED:
        return 'Delivered'
      case OrderStatus.CANCELLED:
        return 'Cancelled'
      case OrderStatus.RETURNED:
        return 'Returned'
      case OrderStatus.REFUNDED:
        return 'Refunded'
      default:
        return status
    }
  }

  const canCancel = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING].includes(order.status)
  const canReorder = [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)

  const handleCancelSubmit = () => {
    onCancel(cancelReason)
    setShowCancelModal(false)
    setCancelReason('')
  }

  return (
    <>
      <div className="bg-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {/* Card Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-semibold text-gray-100">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-primary-600">
                {formatPrice(order.total)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1"
              >
                <span className="text-sm">Details</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Card Body - Order Items Preview */}
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="text-sm text-gray-500">
                +{order.items.length - 3} more items
              </div>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t bg-gray-900"
            >
              <div className="p-4 space-y-6">
                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-100 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Order Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono">{order.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Est. Delivery:</span>
                          <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-100 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-100">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.line1}</p>
                      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                {/* All Items */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-100">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-100">{item.name}</h5>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{item.nutritionalInfo.protein}g protein</span>
                            <span>{item.nutritionalInfo.calories} cal</span>
                            <span>Serving: {item.nutritionalInfo.servingSize}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total Breakdown */}
                <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-gray-100 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes:</span>
                      <span>{order.taxes === 0 ? 'Included' : formatPrice(order.taxes)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Footer - Actions */}
        <div className="p-4 border-t bg-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </Button>
            </Link>

            <Link href={`/orders/${order.id}/track`}>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Track Order</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadInvoice}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Invoice</span>
            </Button>

            {canReorder && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReorder}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reorder</span>
              </Button>
            )}

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelModal(true)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel order #{order.orderNumber}?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Please let us know why you're cancelling..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubmit}
              >
                Cancel Order
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}