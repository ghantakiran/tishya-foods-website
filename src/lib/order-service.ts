import { Order, OrderStatus, PaymentStatus, PaymentResult, Address, OrderItem, TrackingInfo } from '@/types'

export interface CreateOrderData {
  items: Array<{
    productId: string
    name: string
    description: string
    image: string
    quantity: number
    price: number
    variant?: {
      size?: string
      flavor?: string
    }
    nutritionalInfo: {
      protein: number
      calories: number
      servingSize: string
    }
  }>
  shippingAddress: Address
  billingAddress?: Address
  paymentResult: PaymentResult
  notes?: string
  appliedCoupons?: string[]
}

export class OrderService {
  private static orders: Map<string, Order> = new Map()

  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const orderNumber = `TF${Date.now().toString().slice(-8)}`
    
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal >= 500 ? 0 : 50 // Free shipping over ₹500
    const taxes = Math.round(subtotal * 0.18 * 100) / 100 // 18% GST
    const discount = 0 // TODO: Calculate based on coupons
    const total = subtotal + shipping + taxes - discount

    const orderItems: OrderItem[] = orderData.items.map(item => ({
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      productId: item.productId,
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      variant: item.variant,
      nutritionalInfo: item.nutritionalInfo,
    }))

    const tracking: TrackingInfo[] = [{
      status: OrderStatus.PENDING,
      message: 'Order placed successfully',
      timestamp: new Date().toISOString(),
      isCompleted: true,
    }]

    const order: Order = {
      id: orderId,
      orderNumber,
      userId: 'guest', // In real app, get from auth context
      status: orderData.paymentResult.success ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
      items: orderItems,
      subtotal,
      taxes,
      shipping,
      discount,
      total,
      currency: (orderData.paymentResult.currency as 'INR' | 'USD') || 'USD',
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      paymentMethod: 'Credit Card', // Simplified for now
      paymentStatus: orderData.paymentResult.success ? PaymentStatus.PAID : PaymentStatus.PENDING,
      transactionId: orderData.paymentResult.transactionId,
      tracking,
      estimatedDelivery: this.calculateEstimatedDelivery(),
      notes: orderData.notes,
      appliedCoupons: orderData.appliedCoupons || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store in memory (in real app, this would be a database)
    this.orders.set(orderId, order)

    // Simulate order processing workflow
    if (order.status === OrderStatus.CONFIRMED) {
      this.startOrderProcessing(orderId)
    }

    console.log('Order created:', order)
    return order
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = this.orders.get(orderId)
    if (!order) return null

    order.status = status
    order.updatedAt = new Date().toISOString()

    // Add tracking entry
    const trackingEntry: TrackingInfo = {
      status,
      message: this.getStatusMessage(status),
      timestamp: new Date().toISOString(),
      isCompleted: true,
    }

    order.tracking.push(trackingEntry)

    // Update specific fields based on status
    switch (status) {
      case OrderStatus.SHIPPED:
        order.estimatedDelivery = this.calculateEstimatedDelivery()
        break
      case OrderStatus.DELIVERED:
        order.actualDelivery = new Date().toISOString()
        break
    }

    this.orders.set(orderId, order)
    console.log(`Order ${orderId} status updated to ${status}`)
    
    return order
  }

  static async cancelOrder(orderId: string, reason?: string): Promise<Order | null> {
    const order = this.orders.get(orderId)
    if (!order) return null

    if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
      throw new Error('Cannot cancel order that has already been shipped')
    }

    order.status = OrderStatus.CANCELLED
    order.updatedAt = new Date().toISOString()
    order.notes = order.notes ? `${order.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`

    // Add cancellation tracking
    order.tracking.push({
      status: OrderStatus.CANCELLED,
      message: `Order cancelled. Reason: ${reason || 'No reason provided'}`,
      timestamp: new Date().toISOString(),
      isCompleted: true,
    })

    this.orders.set(orderId, order)
    
    // In real app, initiate refund process here
    console.log(`Order ${orderId} cancelled. Reason: ${reason}`)
    
    return order
  }

  private static calculateEstimatedDelivery(): string {
    // Add 3-5 business days for delivery
    const today = new Date()
    const deliveryDays = Math.floor(Math.random() * 3) + 3 // 3-5 days
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + deliveryDays)
    
    return deliveryDate.toISOString()
  }

  private static getStatusMessage(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Order placed, awaiting payment confirmation'
      case OrderStatus.CONFIRMED:
        return 'Payment confirmed, order being prepared'
      case OrderStatus.PROCESSING:
        return 'Order is being processed'
      case OrderStatus.SHIPPED:
        return 'Order has been shipped'
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'Order is out for delivery'
      case OrderStatus.DELIVERED:
        return 'Order delivered successfully'
      case OrderStatus.CANCELLED:
        return 'Order has been cancelled'
      case OrderStatus.RETURNED:
        return 'Order has been returned'
      case OrderStatus.REFUNDED:
        return 'Order has been refunded'
      default:
        return 'Status update'
    }
  }

  private static async startOrderProcessing(orderId: string) {
    // Simulate order processing workflow
    setTimeout(async () => {
      await this.updateOrderStatus(orderId, OrderStatus.PROCESSING)
      
      // Simulate preparation time (1-2 hours)
      setTimeout(async () => {
        await this.updateOrderStatus(orderId, OrderStatus.SHIPPED)
      }, Math.random() * 2 * 60 * 60 * 1000) // 1-2 hours in ms
    }, 30000) // 30 seconds delay to show pending status
  }

  static getOrderStatusDisplay(status: OrderStatus): {
    label: string
    color: string
    description: string
  } {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          label: 'Order Pending',
          color: 'text-yellow-400',
          description: 'Waiting for payment confirmation'
        }
      case OrderStatus.CONFIRMED:
        return {
          label: 'Order Confirmed',
          color: 'text-blue-400',
          description: 'Payment received, preparing your order'
        }
      case OrderStatus.PROCESSING:
        return {
          label: 'Processing',
          color: 'text-orange-400',
          description: 'Your order is being prepared'
        }
      case OrderStatus.SHIPPED:
        return {
          label: 'Shipped',
          color: 'text-purple-400',
          description: 'Your order is on the way'
        }
      case OrderStatus.OUT_FOR_DELIVERY:
        return {
          label: 'Out for Delivery',
          color: 'text-indigo-400',
          description: 'Your order will be delivered today'
        }
      case OrderStatus.DELIVERED:
        return {
          label: 'Delivered',
          color: 'text-green-400',
          description: 'Order delivered successfully'
        }
      case OrderStatus.CANCELLED:
        return {
          label: 'Cancelled',
          color: 'text-red-400',
          description: 'Order has been cancelled'
        }
      case OrderStatus.RETURNED:
        return {
          label: 'Returned',
          color: 'text-gray-400',
          description: 'Order has been returned'
        }
      case OrderStatus.REFUNDED:
        return {
          label: 'Refunded',
          color: 'text-blue-400',
          description: 'Order has been refunded'
        }
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-400',
          description: 'Status unknown'
        }
    }
  }

  static async getOrderAnalytics(): Promise<{
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    statusBreakdown: Record<string, number>
  }> {
    const orders = Array.from(this.orders.values())
    
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter(order => order.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
    }
  }

  // Utility method to format order for display
  static formatOrderForDisplay(order: Order) {
    const statusInfo = this.getOrderStatusDisplay(order.status)
    
    return {
      ...order,
      statusInfo,
      formattedTotal: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: order.currency,
      }).format(order.total),
      formattedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      estimatedDeliveryFormatted: new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }
  }
}