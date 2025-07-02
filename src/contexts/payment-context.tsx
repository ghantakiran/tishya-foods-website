'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { PaymentMethod, PaymentDetails, PaymentState, PaymentActions, CheckoutData } from '@/types/payment'

type PaymentContextType = PaymentState & PaymentActions

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

type PaymentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_METHODS'; payload: PaymentMethod[] }
  | { type: 'SET_CURRENT_PAYMENT'; payload: PaymentDetails | null }

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isProcessing: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_METHODS':
      return { ...state, methods: action.payload }
    
    case 'SET_CURRENT_PAYMENT':
      return { ...state, currentPayment: action.payload }
    
    default:
      return state
  }
}

const initialState: PaymentState = {
  methods: [],
  currentPayment: null,
  isProcessing: false,
  error: null,
}

// Mock payment methods - in real app, these would come from API
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'razorpay-card',
    type: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: '/icons/payment/card.svg',
    enabled: true,
    processingFee: 2.5,
    minAmount: 1,
    maxAmount: 200000
  },
  {
    id: 'razorpay-upi',
    type: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: '/icons/payment/upi.svg',
    enabled: true,
    processingFee: 0,
    minAmount: 1,
    maxAmount: 100000
  },
  {
    id: 'razorpay-netbanking',
    type: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: '/icons/payment/netbanking.svg',
    enabled: true,
    processingFee: 1.5,
    minAmount: 1,
    maxAmount: 500000
  },
  {
    id: 'razorpay-wallet',
    type: 'wallet',
    name: 'Digital Wallets',
    description: 'Paytm, PhonePe, Amazon Pay',
    icon: '/icons/payment/wallet.svg',
    enabled: true,
    processingFee: 1.0,
    minAmount: 1,
    maxAmount: 50000
  },
  {
    id: 'cod',
    type: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: '/icons/payment/cod.svg',
    enabled: true,
    processingFee: 25,
    minAmount: 100,
    maxAmount: 2000
  }
]

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState)

  // Load payment methods on mount
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        dispatch({ type: 'SET_METHODS', payload: mockPaymentMethods })
      } catch (error) {
        console.error('Failed to load payment methods:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load payment methods' })
      }
    }

    loadPaymentMethods()
  }, [])

  const initializePayment = async (checkoutData: CheckoutData): Promise<string> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Simulate API call to create payment
      await new Promise(resolve => setTimeout(resolve, 1500))

      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const paymentDetails: PaymentDetails = {
        id: paymentId,
        orderId: `order_${Date.now()}`,
        amount: checkoutData.total,
        currency: checkoutData.currency,
        status: 'pending',
        method: checkoutData.paymentMethod,
        gateway: checkoutData.paymentMethod.type === 'cod' ? 'razorpay' : 'razorpay',
        metadata: {
          checkoutData,
          items: checkoutData.items
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      dispatch({ type: 'SET_CURRENT_PAYMENT', payload: paymentDetails })
      
      // For COD, mark as completed immediately
      if (checkoutData.paymentMethod.type === 'cod') {
        paymentDetails.status = 'completed'
        toast.success('Order placed successfully! You can pay when it arrives.')
      }

      return paymentId
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment initialization failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const processPayment = async (paymentId: string, paymentData: any): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock success/failure based on amount (for demo)
      const success = Math.random() > 0.1 // 90% success rate

      if (success) {
        const updatedPayment: PaymentDetails = {
          ...state.currentPayment!,
          status: 'completed',
          transactionId: `txn_${Date.now()}`,
          gatewayTransactionId: `gw_${Date.now()}`,
          updatedAt: new Date().toISOString()
        }

        dispatch({ type: 'SET_CURRENT_PAYMENT', payload: updatedPayment })
        toast.success('Payment completed successfully!')
        return true
      } else {
        const updatedPayment: PaymentDetails = {
          ...state.currentPayment!,
          status: 'failed',
          failureReason: 'Insufficient funds or card declined',
          updatedAt: new Date().toISOString()
        }

        dispatch({ type: 'SET_CURRENT_PAYMENT', payload: updatedPayment })
        toast.error('Payment failed. Please try again with a different payment method.')
        return false
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment processing failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verifyPayment = async (paymentId: string, signature: string): Promise<boolean> => {
    try {
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock verification logic
      const isValid = signature.length > 10 // Simple validation for demo
      
      if (isValid && state.currentPayment) {
        const updatedPayment: PaymentDetails = {
          ...state.currentPayment,
          status: 'completed',
          updatedAt: new Date().toISOString()
        }
        dispatch({ type: 'SET_CURRENT_PAYMENT', payload: updatedPayment })
      }

      return isValid
    } catch (error) {
      console.error('Payment verification failed:', error)
      return false
    }
  }

  const cancelPayment = async (paymentId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (state.currentPayment) {
        const updatedPayment: PaymentDetails = {
          ...state.currentPayment,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        }
        dispatch({ type: 'SET_CURRENT_PAYMENT', payload: updatedPayment })
      }

      toast.success('Payment cancelled successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel payment'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const refundPayment = async (paymentId: string, amount?: number): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (state.currentPayment) {
        const updatedPayment: PaymentDetails = {
          ...state.currentPayment,
          status: 'refunded',
          updatedAt: new Date().toISOString()
        }
        dispatch({ type: 'SET_CURRENT_PAYMENT', payload: updatedPayment })
      }

      const refundAmount = amount || state.currentPayment?.amount || 0
      toast.success(`Refund of ₹${refundAmount} initiated successfully`)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Refund failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getPaymentStatus = async (paymentId: string): Promise<PaymentDetails> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      if (state.currentPayment && state.currentPayment.id === paymentId) {
        return state.currentPayment
      }

      // Mock payment details if not found in state
      const mockPayment: PaymentDetails = {
        id: paymentId,
        orderId: `order_${Date.now()}`,
        amount: 299,
        currency: 'INR',
        status: 'completed',
        method: mockPaymentMethods[0],
        gateway: 'razorpay',
        transactionId: `txn_${Date.now()}`,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return mockPayment
    } catch (error) {
      throw new Error('Failed to fetch payment status')
    }
  }

  const value: PaymentContextType = {
    ...state,
    initializePayment,
    processPayment,
    verifyPayment,
    cancelPayment,
    refundPayment,
    getPaymentStatus,
  }

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}