import { PaymentResult } from '@/types/payment'

export interface PaymentData {
  amount: number
  currency: string
  paymentMethod: {
    id: string
    type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod'
    provider: string
    cardNumber?: string
    expiryMonth?: string
    expiryYear?: string
    cvv?: string
    upiId?: string
    bankCode?: string
    walletProvider?: string
  }
  customerInfo: {
    email: string
    name: string
    phone?: string
  }
  billingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  metadata?: Record<string, string>
}

export class PaymentService {
  static async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      // For demo/testing without real Stripe keys, fall back to mock
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
        
        console.log('Using mock payment processing (no production Stripe keys found)')
        return this.mockPaymentProcess(paymentData)
      }

      // Real Stripe processing would happen here
      // This would typically be handled by the StripePaymentForm component
      throw new Error('Real Stripe processing should be handled by StripePaymentForm component')
      
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
        transactionId: `failed_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    }
  }

  private static getPaymentMethodIcon(type: string): string {
    const icons: Record<string, string> = {
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      wallet: '👛',
      cod: '💵'
    }
    return icons[type] || '💳'
  }

  private static async mockPaymentProcess(paymentData: PaymentData): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate success/failure rates
    const isSuccess = Math.random() > 0.05 // 95% success rate for demo

    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: {
          ...paymentData.paymentMethod,
          name: `${paymentData.paymentMethod.type.toUpperCase()} Payment`,
          description: `Payment via ${paymentData.paymentMethod.provider}`,
          icon: this.getPaymentMethodIcon(paymentData.paymentMethod.type),
          enabled: true
        },
        timestamp: new Date().toISOString(),
        metadata: {
          ...paymentData.metadata,
          processingMethod: 'mock',
          customerEmail: paymentData.customerInfo.email,
        }
      }
    } else {
      // Simulate different types of failures
      const failures = [
        'Insufficient funds',
        'Card declined',
        'Invalid card number',
        'Card expired',
        'Security code incorrect',
        'Network error',
      ]
      
      const randomFailure = failures[Math.floor(Math.random() * failures.length)]
      
      return {
        success: false,
        error: randomFailure,
        transactionId: `failed_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    }
  }

  static async validatePaymentMethod(paymentMethod: PaymentData['paymentMethod']): Promise<boolean> {
    // Basic validation logic
    switch (paymentMethod.type) {
      case 'card':
        return this.validateCard(paymentMethod)
      case 'upi':
        return this.validateUPI(paymentMethod)
      case 'netbanking':
        return this.validateNetBanking(paymentMethod)
      case 'wallet':
        return this.validateWallet(paymentMethod)
      case 'cod':
        return true // COD is always valid
      default:
        return false
    }
  }

  private static validateCard(paymentMethod: PaymentData['paymentMethod']): boolean {
    if (!paymentMethod.cardNumber || !paymentMethod.expiryMonth || 
        !paymentMethod.expiryYear || !paymentMethod.cvv) {
      return false
    }

    // Basic card number validation (Luhn algorithm would be ideal)
    const cardNumber = paymentMethod.cardNumber.replace(/\s/g, '')
    return cardNumber.length >= 13 && cardNumber.length <= 19 && /^\d+$/.test(cardNumber)
  }

  private static validateUPI(paymentMethod: PaymentData['paymentMethod']): boolean {
    if (!paymentMethod.upiId) return false
    
    // Basic UPI ID validation
    const upiPattern = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z]{2,64}$/
    return upiPattern.test(paymentMethod.upiId)
  }

  private static validateNetBanking(paymentMethod: PaymentData['paymentMethod']): boolean {
    return !!paymentMethod.bankCode
  }

  private static validateWallet(paymentMethod: PaymentData['paymentMethod']): boolean {
    return !!paymentMethod.walletProvider
  }

  static calculateFees(amount: number, paymentMethod: PaymentData['paymentMethod']): number {
    // Different payment methods have different fee structures
    switch (paymentMethod.type) {
      case 'card':
        // Typical card processing fee: 2.9% + ₹3
        return Math.round((amount * 0.029 + 3) * 100) / 100
      case 'upi':
        // UPI is usually free for customers, but merchants pay
        return 0
      case 'netbanking':
        // Fixed fee for net banking
        return amount > 2000 ? 0 : 20
      case 'wallet':
        // Wallet providers often have lower fees
        return Math.round((amount * 0.018) * 100) / 100
      case 'cod':
        // COD handling fee
        return 40
      default:
        return 0
    }
  }

  static getPaymentMethodDisplayName(paymentMethod: PaymentData['paymentMethod']): string {
    switch (paymentMethod.type) {
      case 'card':
        return `**** **** **** ${paymentMethod.cardNumber?.slice(-4) || '****'}`
      case 'upi':
        return paymentMethod.upiId || 'UPI Payment'
      case 'netbanking':
        return `Net Banking - ${paymentMethod.bankCode || 'Unknown Bank'}`
      case 'wallet':
        return `${paymentMethod.walletProvider || 'Digital Wallet'}`
      case 'cod':
        return 'Cash on Delivery'
      default:
        return 'Unknown Payment Method'
    }
  }

  static async getPaymentStatus(transactionId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    amount?: number
    currency?: string
    timestamp?: string
  }> {
    // In a real implementation, this would query the payment provider
    // For now, simulate a status check
    
    if (transactionId.startsWith('failed_')) {
      return { status: 'failed' }
    }
    
    if (transactionId.startsWith('txn_')) {
      return { 
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    }
    
    return { status: 'pending' }
  }
}