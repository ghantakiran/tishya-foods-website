'use client'

import { motion } from 'framer-motion'
import { MapPin, Plus, Home } from 'lucide-react'

export default function AddressesLoading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-6 h-6 text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-100">
                  Delivery Addresses
                </h1>
              </div>
              <p className="text-gray-300">
                Loading your saved addresses...
              </p>
            </div>
            <div className="h-10 w-32 bg-blue-600/50 rounded-lg animate-pulse" />
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Add New Address Card Loading */}
          <motion.div
            className="bg-gray-800/80 rounded-2xl p-6 mb-6 border-2 border-dashed border-gray-600"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Plus className="w-12 h-12 text-gray-500" />
                </motion.div>
              </div>
              <div className="h-5 bg-gray-700 rounded w-40 mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-64 mx-auto animate-pulse" />
            </div>
          </motion.div>

          {/* Address Cards Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/80 rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {/* Address Type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-blue-400" />
                    <div className="h-5 bg-gray-700 rounded w-16 animate-pulse" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-3">
                  {/* Name */}
                  <div className="h-5 bg-gray-700 rounded w-32 animate-pulse" />
                  
                  {/* Address Lines */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                  </div>

                  {/* Phone */}
                  <div className="h-4 bg-gray-700 rounded w-28 animate-pulse" />
                </div>

                {/* Default Badge */}
                {index === 0 && (
                  <div className="mt-4">
                    <div className="h-6 bg-green-600/50 rounded-full w-20 animate-pulse" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <div className="h-9 bg-blue-600/50 rounded flex-1 animate-pulse" />
                  <div className="h-9 bg-gray-700 rounded w-20 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State Loading (shown as one of the cards) */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="h-5 bg-gray-700 rounded w-48 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-64 mx-auto animate-pulse" />
          </motion.div>

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
                <MapPin className="w-5 h-5" />
              </motion.div>
              <span>Loading your delivery addresses...</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}