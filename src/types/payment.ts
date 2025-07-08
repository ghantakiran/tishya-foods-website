export interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod'
  name: string
  description: string
  icon: string
  enabled: boolean
  processingFee?: number
  minAmount?: number
  maxAmount?: number
}

export interface PaymentDetails {
  id: string
  orderId: string
  amount: number
  currency: 'INR' | 'USD'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  method: PaymentMethod
  gateway: 'razorpay' | 'stripe' | 'paytm' | 'phonepe'
  transactionId?: string
  gatewayTransactionId?: string
  failureReason?: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface PaymentAddress {
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

export interface CheckoutData {
  cartId: string
  items: CartItem[]
  subtotal: number
  taxes: number
  shipping: number
  discount: number
  total: number
  currency: 'INR' | 'USD'
  billingAddress: PaymentAddress
  shippingAddress: PaymentAddress
  sameAsShipping: boolean
  paymentMethod: PaymentMethod
  notes?: string
}

export interface PaymentState {
  methods: PaymentMethod[]
  currentPayment: PaymentDetails | null
  isProcessing: boolean
  error: string | null
}

export interface PaymentActions {
  initializePayment: (checkoutData: CheckoutData) => Promise<string>
  processPayment: (paymentId: string, paymentData: Record<string, unknown>) => Promise<boolean>
  verifyPayment: (paymentId: string, signature: string) => Promise<boolean>
  cancelPayment: (paymentId: string) => Promise<void>
  refundPayment: (paymentId: string, amount?: number) => Promise<boolean>
  getPaymentStatus: (paymentId: string) => Promise<PaymentDetails>
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  amount?: number
  currency?: string
  paymentMethod?: PaymentMethod
  timestamp: string
  error?: string
  metadata?: Record<string, string>
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    size?: string
    flavor?: string
  }
}