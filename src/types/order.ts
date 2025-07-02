export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  taxes: number
  shipping: number
  discount: number
  total: number
  currency: 'INR' | 'USD'
  
  // Addresses
  shippingAddress: Address
  billingAddress: Address
  
  // Payment
  paymentMethod: string
  paymentStatus: PaymentStatus
  paymentId?: string
  transactionId?: string
  
  // Fulfillment
  tracking: TrackingInfo[]
  estimatedDelivery: string
  actualDelivery?: string
  
  // Metadata
  notes?: string
  appliedCoupons: string[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  description: string
  image: string
  price: number
  quantity: number
  variant?: {
    size?: string
    flavor?: string
  }
  nutritionalInfo: {
    protein: number
    calories: number
    servingSize: string
  }
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface TrackingInfo {
  status: OrderStatus
  message: string
  location?: string
  timestamp: string
  isCompleted: boolean
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  dateRange?: {
    start: string
    end: string
  }
  search?: string
  sortBy?: 'date' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  filters: OrderFilters
}

export interface OrderActions {
  fetchOrders: (filters?: OrderFilters) => Promise<void>
  fetchOrderById: (orderId: string) => Promise<Order | null>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  cancelOrder: (orderId: string, reason?: string) => Promise<void>
  requestReturn: (orderId: string, items: string[], reason: string) => Promise<void>
  reorder: (orderId: string) => Promise<void>
  downloadInvoice: (orderId: string) => Promise<void>
  trackOrder: (orderId: string) => Promise<TrackingInfo[]>
}

export interface ReturnRequest {
  id: string
  orderId: string
  items: OrderItem[]
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requestedAt: string
  processedAt?: string
  refundAmount: number
  notes?: string
}