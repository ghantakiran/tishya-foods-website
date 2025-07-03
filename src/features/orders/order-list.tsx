'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Package, Eye, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useOrders } from '@/contexts/order-context'
import { OrderCard } from './order-card'
import { OrderFilters as OrderFiltersType, OrderStatus, PaymentStatus } from '@/types/order'
import { LoadingSpinner } from '@/components/loading/loading-skeleton'

export function OrderList() {
  const {
    orders,
    isLoading,
    error,
    filters,
    fetchOrders,
    downloadInvoice,
    reorder,
    cancelOrder
  } = useOrders()

  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tempFilters, setTempFilters] = useState<OrderFiltersType>({})

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchOrders({ ...filters, search: query })
  }

  const handleApplyFilters = () => {
    fetchOrders(tempFilters)
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    setTempFilters({})
    fetchOrders({})
    setShowFilters(false)
  }

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

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(Boolean).length
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">Error loading orders</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => fetchOrders()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search orders by order number or product name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border rounded-lg p-4 bg-gray-900"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={tempFilters.status || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value as OrderStatus })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All statuses</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                <option value={OrderStatus.PROCESSING}>Processing</option>
                <option value={OrderStatus.SHIPPED}>Shipped</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={tempFilters.paymentStatus || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, paymentStatus: e.target.value as PaymentStatus })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All payments</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.PAID}>Paid</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.REFUNDED}>Refunded</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={tempFilters.sortBy || 'date'}
                onChange={(e) => setTempFilters({ ...tempFilters, sortBy: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="date">Order Date</option>
                <option value="total">Total Amount</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Orders List */}
      {!isLoading && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-100 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || Object.keys(filters).length > 0
                  ? 'Try adjusting your search or filters'
                  : "You haven't placed any orders yet"
                }
              </p>
              <Button>
                Start Shopping
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <OrderCard
                    order={order}
                    onDownloadInvoice={() => downloadInvoice(order.id)}
                    onReorder={() => reorder(order.id)}
                    onCancel={(reason) => cancelOrder(order.id, reason)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Load More Button (if pagination is needed) */}
      {orders.length > 0 && orders.length % 10 === 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Orders
          </Button>
        </div>
      )}
    </div>
  )
}