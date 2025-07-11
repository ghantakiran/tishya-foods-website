'use client'

import { motion } from 'framer-motion'
import { CreditCard, Shield, Lock } from 'lucide-react'

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CreditCard className="w-12 h-12 text-green-400" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-300">
            Preparing your secure payment experience...
          </p>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          className="flex items-center justify-center space-x-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">256-bit SSL Encryption</span>
          <Lock className="w-4 h-4 text-green-400" />
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form Loading */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Shipping Information */}
              <div className="bg-gray-800/80 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div className="h-6 bg-gray-700 rounded w-40 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                      <div className="h-10 bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-800/80 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div className="h-6 bg-gray-700 rounded w-36 animate-pulse" />
                </div>
                
                {/* Payment Methods */}
                <div className="flex space-x-3 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 w-16 bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
                
                {/* Payment Form Fields */}
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
                      <div className="h-10 bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Review */}
              <div className="bg-gray-800/80 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div className="h-6 bg-gray-700 rounded w-28 animate-pulse" />
                </div>
                <div className="h-32 bg-gray-700 rounded animate-pulse" />
              </div>
            </motion.div>

            {/* Order Summary Loading */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-gray-800/80 rounded-2xl p-6 sticky top-24">
                <div className="h-6 bg-gray-700 rounded w-32 animate-pulse mb-6" />
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                      </div>
                      <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t border-gray-700 pt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-700 rounded w-20 animate-pulse" />
                      <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Place Order Button */}
                <div className="mt-6 h-12 bg-gray-700 rounded-lg animate-pulse" />

                {/* Security Info */}
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Loading Message */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-5 h-5" />
            </motion.div>
            <span>Initializing secure checkout process...</span>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex justify-center items-center space-x-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-700 rounded animate-pulse" />
          ))}
        </motion.div>
      </div>
    </div>
  )
}