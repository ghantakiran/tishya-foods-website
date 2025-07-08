'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Building2, Wallet, Truck, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Label } from '@/components/ui/label'
import { StripePaymentForm } from './stripe-payment-form'
import { PaymentService, PaymentData } from '@/lib/payment-service'
import { PaymentResult } from '@/types/payment'
import { formatPrice } from '@/lib/utils'
// import { useToast } from '@/hooks/use-toast'

interface IntegratedPaymentFormProps {
  amount: number
  currency: string
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
  onSuccess: (paymentResult: PaymentResult) => void
  onError: (error: string) => void
  metadata?: Record<string, string>
}

export function IntegratedPaymentForm({
  amount,
  currency,
  customerInfo,
  billingAddress,
  onSuccess,
  onError,
  metadata
}: IntegratedPaymentFormProps) {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('stripe_card')
  const [processing, setProcessing] = useState(false)
  // const { toast } = useToast()

  const paymentMethods = [
    {
      id: 'stripe_card',
      type: 'card' as const,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-6 w-6" />,
      fee: amount * 0.029 + 3,
      minAmount: 1,
      maxAmount: 100000,
      features: [
        { icon: <Shield className="h-4 w-4" />, text: 'Secure SSL encryption' },
        { icon: <Clock className="h-4 w-4" />, text: 'Instant confirmation' },
        { icon: <CheckCircle className="h-4 w-4" />, text: 'Worldwide acceptance' }
      ]
    },
    {
      id: 'upi',
      type: 'upi' as const,
      name: 'UPI Payment',
      description: 'Google Pay, PhonePe, Paytm, BHIM',
      icon: <Smartphone className="h-6 w-6" />,
      fee: 0,
      minAmount: 1,
      maxAmount: 100000,
      features: [
        { icon: <Shield className="h-4 w-4" />, text: 'No additional fees' },
        { icon: <Clock className="h-4 w-4" />, text: 'Instant payment' },
        { icon: <CheckCircle className="h-4 w-4" />, text: 'UPI PIN security' }
      ]
    },
    {
      id: 'netbanking',
      type: 'netbanking' as const,
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: <Building2 className="h-6 w-6" />,
      fee: amount > 2000 ? 0 : 20,
      minAmount: 1,
      maxAmount: 500000,
      features: [
        { icon: <Shield className="h-4 w-4" />, text: 'Bank-level security' },
        { icon: <Clock className="h-4 w-4" />, text: 'Real-time transfer' },
        { icon: <CheckCircle className="h-4 w-4" />, text: '50+ banks supported' }
      ]
    },
    {
      id: 'wallet',
      type: 'wallet' as const,
      name: 'Digital Wallet',
      description: 'Paytm, PhonePe, Amazon Pay',
      icon: <Wallet className="h-6 w-6" />,
      fee: amount * 0.018,
      minAmount: 1,
      maxAmount: 50000,
      features: [
        { icon: <Shield className="h-4 w-4" />, text: 'One-click payment' },
        { icon: <Clock className="h-4 w-4" />, text: 'Instant confirmation' },
        { icon: <CheckCircle className="h-4 w-4" />, text: 'Cashback offers' }
      ]
    },
    {
      id: 'cod',
      type: 'cod' as const,
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <Truck className="h-6 w-6" />,
      fee: 40,
      minAmount: 1,
      maxAmount: 10000,
      features: [
        { icon: <Truck className="h-4 w-4" />, text: 'Pay on delivery' },
        { icon: <Clock className="h-4 w-4" />, text: 'No advance payment' },
        { icon: <CheckCircle className="h-4 w-4" />, text: 'Extra convenience fee applies' }
      ]
    }
  ]

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentType)
  const totalWithFees = amount + (selectedMethod?.fee || 0)

  const handleNonStripePayment = async () => {
    if (!selectedMethod) return

    setProcessing(true)

    try {
      const paymentData: PaymentData = {
        amount: totalWithFees,
        currency,
        paymentMethod: {
          id: selectedMethod.id,
          type: selectedMethod.type,
          provider: selectedMethod.name,
        },
        customerInfo,
        billingAddress,
        metadata: {
          ...metadata,
          paymentMethodType: selectedMethod.type,
          feeAmount: selectedMethod.fee.toString(),
        }
      }

      const result = await PaymentService.processPayment(paymentData)

      if (result.success) {
        onSuccess(result)
        console.log('Payment Successful', `Your payment of ${formatPrice(totalWithFees)} has been processed.`)
        // toast({
        //   title: 'Payment Successful',
        //   description: `Your payment of ${formatPrice(totalWithFees)} has been processed.`,
        // })
      } else {
        onError(result.error || 'Payment failed')
        console.log('Payment Failed', result.error || 'Unable to process payment. Please try again.')
        // toast({
        //   title: 'Payment Failed',
        //   description: result.error || 'Unable to process payment. Please try again.',
        //   variant: 'destructive',
        // })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed'
      onError(errorMessage)
      console.log('Payment Error', errorMessage)
      // toast({
      //   title: 'Payment Error',
      //   description: errorMessage,
      //   variant: 'destructive',
      // })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Choose Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPaymentType === method.id
                  ? 'border-blue-500 bg-blue-950/20'
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedPaymentType(method.id)}
            >
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentType === method.id}
                  onChange={() => setSelectedPaymentType(method.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-400">{method.icon}</div>
                      <div>
                        <div className="font-medium text-gray-100">{method.name}</div>
                        <div className="text-sm text-gray-400">{method.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-100">
                        {method.fee > 0 ? `+${formatPrice(method.fee)}` : 'Free'}
                      </div>
                      {method.fee > 0 && (
                        <div className="text-xs text-gray-400">Processing fee</div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
              
              {selectedPaymentType === method.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                        <div className="text-green-400">{feature.icon}</div>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h4 className="font-medium text-gray-100 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-200">{formatPrice(amount)}</span>
          </div>
          {selectedMethod && selectedMethod.fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Processing Fee</span>
              <span className="text-gray-200">{formatPrice(selectedMethod.fee)}</span>
            </div>
          )}
          <div className="border-t border-gray-600 pt-2">
            <div className="flex justify-between font-medium">
              <span className="text-gray-100">Total</span>
              <span className="text-gray-100">{formatPrice(totalWithFees)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div>
        {selectedPaymentType === 'stripe_card' ? (
          <StripePaymentForm
            amount={totalWithFees}
            currency={currency}
            onSuccess={onSuccess}
            onError={onError}
            metadata={{
              ...metadata,
              customerEmail: customerInfo.email,
              customerName: customerInfo.name,
            }}
          />
        ) : (
          <div className="space-y-4">
            {selectedPaymentType === 'upi' && (
              <div className="text-center p-6 bg-gray-800 border border-gray-600 rounded-lg">
                <Smartphone className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-gray-300 mb-4">
                  You will be redirected to your UPI app to complete the payment
                </p>
              </div>
            )}
            
            {selectedPaymentType === 'cod' && (
              <div className="bg-amber-950/20 border border-amber-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-200">Cash on Delivery</div>
                    <div className="text-sm text-amber-300 mt-1">
                      Please keep exact change ready. A convenience fee of {formatPrice(40)} will be added to your order total.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleNonStripePayment}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(totalWithFees)}`
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
        <Shield className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>
    </div>
  )
}