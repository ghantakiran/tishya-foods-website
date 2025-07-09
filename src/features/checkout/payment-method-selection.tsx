'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Choose Payment Method</h2>
      
      <fieldset className="border border-gray-600 rounded-lg p-6 bg-gray-800">
        <legend className="text-lg font-medium px-2 text-gray-100">Available Payment Options</legend>
        <div className="space-y-4 mt-4">
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
                  ? 'border-earth-600 hover:border-earth-600'
                  : 'border-cream-100 bg-earth-900'
              }`}
            >
              <label
                htmlFor={`payment-${method.id}`}
                className={`flex items-center p-4 cursor-pointer ${
                  !isAvailable ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                <input
                  id={`payment-${method.id}`}
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => isAvailable && onSelect(method.id)}
                  disabled={!isAvailable}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                  aria-describedby={`payment-${method.id}-description ${!isAvailable ? `payment-${method.id}-unavailable` : ''}`}
                />

                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${isAvailable ? 'text-earth-700' : 'text-earth-400'}`}>
                        {getMethodIcon(method.type)}
                      </div>
                      <div>
                        <h3 className={`font-medium ${isAvailable ? 'text-gray-100' : 'text-gray-500'}`}>
                          {method.name}
                        </h3>
                        <p id={`payment-${method.id}-description`} className={`text-sm ${isAvailable ? 'text-gray-300' : 'text-gray-400'}`}>
                          {method.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {method.processingFee > 0 && (
                        <p className="text-sm text-earth-500">
                          +{typeof method.processingFee === 'number' && method.processingFee < 5 
                            ? `${method.processingFee}%` 
                            : formatPrice(method.processingFee)
                          } fee
                        </p>
                      )}
                      {!isAvailable && (
                        <p id={`payment-${method.id}-unavailable`} className="text-xs text-red-400 mt-1" role="alert">
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
                          isAvailable ? 'text-gray-300' : 'text-gray-400'
                        }`}
                        aria-label={feature.text}
                      >
                        <span aria-hidden="true">{feature.icon}</span>
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
                  className="border-t bg-gray-900 px-4 py-3"
                  role="region"
                  aria-labelledby={`payment-${method.id}-details`}
                >
                  {method.type === 'card' && (
                    <div className="space-y-3">
                      <h4 id={`payment-${method.id}-details`} className="sr-only">Credit/Debit Card Details</h4>
                      <p className="text-sm text-gray-300">
                        Accepted cards: Visa, Mastercard, American Express, RuPay
                      </p>
                      <div className="flex space-x-2">
                        <Image src="/icons/payment/visa.svg" alt="Visa" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/mastercard.svg" alt="Mastercard" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/amex.svg" alt="American Express" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/rupay.svg" alt="RuPay" width={24} height={24} className="h-6" />
                      </div>
                    </div>
                  )}

                  {method.type === 'upi' && (
                    <div className="space-y-3">
                      <h4 id={`payment-${method.id}-details`} className="sr-only">UPI Payment Details</h4>
                      <p className="text-sm text-gray-300">
                        Pay using any UPI app on your phone
                      </p>
                      <div className="flex space-x-2">
                        <Image src="/icons/payment/gpay.svg" alt="Google Pay" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/phonepe.svg" alt="PhonePe" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/paytm.svg" alt="Paytm" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/bhim.svg" alt="BHIM" width={24} height={24} className="h-6" />
                      </div>
                    </div>
                  )}

                  {method.type === 'netbanking' && (
                    <div className="space-y-3">
                      <h4 id={`payment-${method.id}-details`} className="sr-only">Net Banking Details</h4>
                      <p className="text-sm text-gray-300">
                        Support for 50+ banks including SBI, HDFC, ICICI, Axis
                      </p>
                    </div>
                  )}

                  {method.type === 'wallet' && (
                    <div className="space-y-3">
                      <h4 id={`payment-${method.id}-details`} className="sr-only">Digital Wallet Details</h4>
                      <p className="text-sm text-gray-300">
                        Pay using your digital wallet balance
                      </p>
                      <div className="flex space-x-2">
                        <Image src="/icons/payment/paytm.svg" alt="Paytm" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/phonepe.svg" alt="PhonePe" width={24} height={24} className="h-6" />
                        <Image src="/icons/payment/amazon-pay.svg" alt="Amazon Pay" width={24} height={24} className="h-6" />
                      </div>
                    </div>
                  )}

                  {method.type === 'cod' && (
                    <div className="space-y-3">
                      <h4 id={`payment-${method.id}-details`} className="sr-only">Cash on Delivery Details</h4>
                      <p className="text-sm text-gray-300">
                        Pay cash when your order is delivered to your doorstep
                      </p>
                      <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-md p-3" role="note">
                        <p className="text-xs text-yellow-300">
                          <strong>Note:</strong> Cash on delivery orders may take an additional 1-2 days for processing.
                          A convenience fee of ₹{method.processingFee} will be added to your order total.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-3 flex items-center space-x-2 text-xs text-green-300 bg-green-600/20 border border-green-500/30 rounded-md p-2" role="note">
                    <Shield className="h-4 w-4" aria-hidden="true" />
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
      </fieldset>

      {/* Payment Security Info */}
      <div className="mt-6 p-4 bg-gray-900 border border-gray-600 rounded-lg" role="complementary" aria-labelledby="security-heading">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-400 mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <h4 id="security-heading" className="font-medium text-gray-100 mb-1">Secure Payments</h4>
            <p className="text-gray-300">
              Your payment information is encrypted and processed securely. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}