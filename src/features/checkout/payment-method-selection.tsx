'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Building2, Wallet, Truck, Shield, Clock } from 'lucide-react'
import { PaymentMethod } from '@/types/payment'
import { formatPrice } from '@/lib/utils'

interface PaymentMethodSelectionProps {
  methods: PaymentMethod[]
  selectedMethod: string | null
  onSelect: (methodId: string) => void
  orderTotal: number
}

export function PaymentMethodSelection({
  methods,
  selectedMethod,
  onSelect,
  orderTotal
}: PaymentMethodSelectionProps) {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-6 w-6" />
      case 'upi':
        return <Smartphone className="h-6 w-6" />
      case 'netbanking':
        return <Building2 className="h-6 w-6" />
      case 'wallet':
        return <Wallet className="h-6 w-6" />
      case 'cod':
        return <Truck className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  const getMethodFeatures = (method: PaymentMethod) => {
    const features = []

    if (method.type === 'cod') {
      features.push({ icon: <Truck className="h-4 w-4" />, text: 'Pay on delivery' })
      features.push({ icon: <Clock className="h-4 w-4" />, text: 'No advance payment' })
    } else {
      features.push({ icon: <Shield className="h-4 w-4" />, text: 'Secure payment' })
      features.push({ icon: <Clock className="h-4 w-4" />, text: 'Instant confirmation' })
    }

    if (method.processingFee === 0) {
      features.push({ icon: <CreditCard className="h-4 w-4" />, text: 'No processing fee' })
    }

    return features
  }

  const isMethodAvailable = (method: PaymentMethod) => {
    if (!method.enabled) return false
    if (method.minAmount && orderTotal < method.minAmount) return false
    if (method.maxAmount && orderTotal > method.maxAmount) return false
    return true
  }

  const getUnavailableReason = (method: PaymentMethod) => {
    if (!method.enabled) return 'Currently unavailable'
    if (method.minAmount && orderTotal < method.minAmount) {
      return `Minimum order: ${formatPrice(method.minAmount)}`
    }
    if (method.maxAmount && orderTotal > method.maxAmount) {
      return `Maximum order: ${formatPrice(method.maxAmount)}`
    }
    return ''
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Choose Payment Method</h2>
      
      <div className="space-y-4">
        {methods.map((method) => {
          const isAvailable = isMethodAvailable(method)
          const isSelected = selectedMethod === method.id
          const isExpanded = expandedMethod === method.id

          return (
            <motion.div
              key={method.id}
              layout
              className={`border rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : isAvailable
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <label
                className={`flex items-center p-4 cursor-pointer ${
                  !isAvailable ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => isAvailable && onSelect(method.id)}
                  disabled={!isAvailable}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />

                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${isAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                        {getMethodIcon(method.type)}
                      </div>
                      <div>
                        <h3 className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                          {method.name}
                        </h3>
                        <p className={`text-sm ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                          {method.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {method.processingFee > 0 && (
                        <p className="text-sm text-gray-500">
                          +{typeof method.processingFee === 'number' && method.processingFee < 5 
                            ? `${method.processingFee}%` 
                            : formatPrice(method.processingFee)
                          } fee
                        </p>
                      )}
                      {!isAvailable && (
                        <p className="text-xs text-red-500 mt-1">
                          {getUnavailableReason(method)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Method Features */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {getMethodFeatures(method).map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-1 text-xs ${
                          isAvailable ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {feature.icon}
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </label>

              {/* Expanded Details */}
              {isSelected && isAvailable && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t bg-white px-4 py-3"
                >
                  {method.type === 'card' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        Accepted cards: Visa, Mastercard, American Express, RuPay
                      </p>
                      <div className="flex space-x-2">
                        <img src="/icons/payment/visa.svg" alt="Visa" className="h-6" />
                        <img src="/icons/payment/mastercard.svg" alt="Mastercard" className="h-6" />
                        <img src="/icons/payment/amex.svg" alt="American Express" className="h-6" />
                        <img src="/icons/payment/rupay.svg" alt="RuPay" className="h-6" />
                      </div>
                    </div>
                  )}

                  {method.type === 'upi' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        Pay using any UPI app on your phone
                      </p>
                      <div className="flex space-x-2">
                        <img src="/icons/payment/gpay.svg" alt="Google Pay" className="h-6" />
                        <img src="/icons/payment/phonepe.svg" alt="PhonePe" className="h-6" />
                        <img src="/icons/payment/paytm.svg" alt="Paytm" className="h-6" />
                        <img src="/icons/payment/bhim.svg" alt="BHIM" className="h-6" />
                      </div>
                    </div>
                  )}

                  {method.type === 'netbanking' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        Support for 50+ banks including SBI, HDFC, ICICI, Axis
                      </p>
                    </div>
                  )}

                  {method.type === 'wallet' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        Pay using your digital wallet balance
                      </p>
                      <div className="flex space-x-2">
                        <img src="/icons/payment/paytm.svg" alt="Paytm" className="h-6" />
                        <img src="/icons/payment/phonepe.svg" alt="PhonePe" className="h-6" />
                        <img src="/icons/payment/amazon-pay.svg" alt="Amazon Pay" className="h-6" />
                      </div>
                    </div>
                  )}

                  {method.type === 'cod' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        Pay cash when your order is delivered to your doorstep
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> Cash on delivery orders may take an additional 1-2 days for processing.
                          A convenience fee of ₹{method.processingFee} will be added to your order total.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-3 flex items-center space-x-2 text-xs text-green-700 bg-green-50 rounded-md p-2">
                    <Shield className="h-4 w-4" />
                    <span>
                      {method.type === 'cod' 
                        ? 'No online payment required. Pay safely at delivery.'
                        : '256-bit SSL encryption ensures your payment is secure.'
                      }
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Payment Security Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-medium text-gray-900 mb-1">Secure Payments</h4>
            <p className="text-gray-600">
              Your payment information is encrypted and processed securely. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}