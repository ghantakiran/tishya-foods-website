'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Order, OrderState, OrderActions, OrderFilters, OrderStatus, PaymentStatus, TrackingInfo } from '@/types/order'

type OrderContextType = OrderState & OrderActions

const OrderContext = createContext<OrderContextType | undefined>(undefined)

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_FILTERS'; payload: OrderFilters }

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload }
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id ? action.payload : state.currentOrder
      }
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    
    default:
      return state
  }
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  filters: {}
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'TF20241201001',
    userId: '1',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Protein Rich Quinoa Mix',
        description: 'High-protein quinoa blend with nuts and seeds',
        image: '/images/products/quinoa-mix.jpg',
        price: 299,
        quantity: 2,
        nutritionalInfo: {
          protein: 8,
          calories: 150,
          servingSize: '30g'
        }
      }
    ],
    subtotal: 598,
    taxes: 0,
    shipping: 0,
    discount: 60,
    total: 538,
    currency: 'INR',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      line1: '123 Green Avenue',
      line2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      line1: '123 Green Avenue',
      line2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    paymentMethod: 'UPI',
    paymentId: 'pay_123456789',
    transactionId: 'txn_987654321',
    tracking: [
      {
        status: OrderStatus.CONFIRMED,
        message: 'Order confirmed and payment received',
        timestamp: '2024-01-01T10:00:00Z',
        isCompleted: true
      },
      {
        status: OrderStatus.PROCESSING,
        message: 'Order is being prepared for shipment',
        timestamp: '2024-01-01T14:00:00Z',
        isCompleted: true
      },
      {
        status: OrderStatus.SHIPPED,
        message: 'Order shipped from Mumbai warehouse',
        location: 'Mumbai, Maharashtra',
        timestamp: '2024-01-02T09:00:00Z',
        isCompleted: true
      },
      {
        status: OrderStatus.DELIVERED,
        message: 'Order delivered successfully',
        location: 'Mumbai, Maharashtra',
        timestamp: '2024-01-03T16:30:00Z',
        isCompleted: true
      }
    ],
    estimatedDelivery: '2024-01-03T18:00:00Z',
    actualDelivery: '2024-01-03T16:30:00Z',
    appliedCoupons: ['WELCOME10'],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-03T16:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'TF20241202001',
    userId: '1',
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    items: [
      {
        id: '2',
        productId: '2',
        name: 'Sweet Protein Balls',
        description: 'Delicious protein-packed energy balls',
        image: '/images/products/protein-balls.jpg',
        price: 199,
        quantity: 3,
        nutritionalInfo: {
          protein: 6,
          calories: 120,
          servingSize: '25g'
        }
      }
    ],
    subtotal: 597,
    taxes: 0,
    shipping: 50,
    discount: 0,
    total: 647,
    currency: 'INR',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      line1: '123 Green Avenue',
      line2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      line1: '123 Green Avenue',
      line2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    paymentMethod: 'Credit Card',
    paymentId: 'pay_234567890',
    transactionId: 'txn_876543210',
    tracking: [
      {
        status: OrderStatus.CONFIRMED,
        message: 'Order confirmed and payment received',
        timestamp: '2024-01-02T11:00:00Z',
        isCompleted: true
      },
      {
        status: OrderStatus.PROCESSING,
        message: 'Order is being prepared for shipment',
        timestamp: '2024-01-02T15:00:00Z',
        isCompleted: true
      },
      {
        status: OrderStatus.SHIPPED,
        message: 'Order shipped from Mumbai warehouse',
        location: 'Mumbai, Maharashtra',
        timestamp: '2024-01-03T10:00:00Z',
        isCompleted: true
      }
    ],
    estimatedDelivery: '2024-01-05T18:00:00Z',
    appliedCoupons: [],
    createdAt: '2024-01-02T11:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z'
  }
]

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  const fetchOrders = useCallback(async (filters?: OrderFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      let filteredOrders = [...mockOrders]

      if (filters) {
        if (filters.status) {
          filteredOrders = filteredOrders.filter(order => order.status === filters.status)
        }
        if (filters.paymentStatus) {
          filteredOrders = filteredOrders.filter(order => order.paymentStatus === filters.paymentStatus)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredOrders = filteredOrders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.items.some(item => item.name.toLowerCase().includes(searchLower))
          )
        }
        if (filters.dateRange) {
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.createdAt)
            const startDate = new Date(filters.dateRange!.start)
            const endDate = new Date(filters.dateRange!.end)
            return orderDate >= startDate && orderDate <= endDate
          })
        }

        // Sorting
        if (filters.sortBy) {
          filteredOrders.sort((a, b) => {
            let aValue, bValue
            switch (filters.sortBy) {
              case 'date':
                aValue = new Date(a.createdAt).getTime()
                bValue = new Date(b.createdAt).getTime()
                break
              case 'total':
                aValue = a.total
                bValue = b.total
                break
              case 'status':
                aValue = a.status
                bValue = b.status
                break
              default:
                return 0
            }

            if (filters.sortOrder === 'desc') {
              return bValue > aValue ? 1 : -1
            }
            return aValue > bValue ? 1 : -1
          })
        }

        dispatch({ type: 'SET_FILTERS', payload: filters })
      }

      dispatch({ type: 'SET_ORDERS', payload: filteredOrders })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const fetchOrderById = useCallback(async (orderId: string): Promise<Order | null> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const order = mockOrders.find(o => o.id === orderId)
      if (order) {
        dispatch({ type: 'SET_CURRENT_ORDER', payload: order })
        return order
      }

      throw new Error('Order not found')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch order'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const order = state.orders.find(o => o.id === orderId)
      if (order) {
        const updatedOrder = {
          ...order,
          status,
          updatedAt: new Date().toISOString()
        }
        dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder })
        toast.success(`Order status updated to ${status}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update order status'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    }
  }, [state.orders])

  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const order = state.orders.find(o => o.id === orderId)
      if (order) {
        if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
          throw new Error('Cannot cancel order that has been shipped')
        }

        const updatedOrder = {
          ...order,
          status: OrderStatus.CANCELLED,
          notes: reason ? `Cancelled: ${reason}` : 'Cancelled by customer',
          updatedAt: new Date().toISOString()
        }
        dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder })
        toast.success('Order cancelled successfully')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel order'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.orders])

  const requestReturn = useCallback(async (orderId: string, items: string[], reason: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Return request submitted successfully. We will process it within 2-3 business days.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit return request'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const reorder = useCallback(async (orderId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const order = state.orders.find(o => o.id === orderId)
      if (order) {
        // In a real app, this would add items to cart and redirect to cart
        toast.success('Items added to cart! You can review and place the order.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reorder'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    }
  }, [state.orders])

  const downloadInvoice = useCallback(async (orderId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // In a real app, this would generate and download a PDF
      toast.success('Invoice download started')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download invoice'
      toast.error(message)
    }
  }, [])

  const trackOrder = useCallback(async (orderId: string): Promise<TrackingInfo[]> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const order = state.orders.find(o => o.id === orderId)
      return order?.tracking || []
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tracking info'
      toast.error(message)
      return []
    }
  }, [state.orders])

  const value: OrderContextType = {
    ...state,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    cancelOrder,
    requestReturn,
    reorder,
    downloadInvoice,
    trackOrder,
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}