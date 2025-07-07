'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, RefreshCw, ShoppingCart, ArrowLeft, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CheckoutErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CheckoutError({ error, reset }: CheckoutErrorProps) {
  useEffect(() => {
    console.error('Checkout error:', error)
    
    // Track checkout-specific errors - these are critical
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Checkout page: ${error.message}`,
        fatal: true, // Checkout errors are critical
        custom_map: {
          page: 'checkout',
          funnel_step: 'checkout_error'
        }
      })
      
      // Track checkout abandonment
      (window as any).gtag('event', 'checkout_error', {
        event_category: 'ecommerce',
        event_label: 'checkout_page_error'
      })
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Checkout Error Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-red-400" />
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-100 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Checkout Error
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We encountered an issue processing your checkout. Don't worry - your cart items are still saved. No payment has been processed.
          </motion.p>

          {/* Important Notice */}
          <motion.div
            className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">Important:</h3>
            <p className="text-sm text-yellow-200">
              Your cart is safe and no payment has been charged. You can retry checkout or contact our support team for assistance.
            </p>
          </motion.div>

          {/* Suggested Actions */}
          <motion.div
            className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Next steps:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Try refreshing and starting checkout again</li>
              <li>• Check your internet connection</li>
              <li>• Review your cart and shipping information</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={reset}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Checkout</span>
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                asChild
                className="flex-1 flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Review Cart</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="flex-1 flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Link href="/contact">
                  <Phone className="w-4 h-4" />
                  <span>Get Help</span>
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="ghost"
              asChild
              className="text-gray-400 hover:text-gray-300"
            >
              <Link href="/products" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </Button>
          </motion.div>

          {/* Support Information */}
          <motion.div
            className="mt-8 p-4 bg-gray-800/30 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-xs text-gray-500 mb-2">Need immediate assistance?</p>
            <div className="text-sm text-gray-400">
              <p>📞 Support: +91 80000 12345</p>
              <p>📧 Email: support@tishyafoods.com</p>
              <p>💬 Live chat available 9 AM - 9 PM</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}