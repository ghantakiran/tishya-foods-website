'use client'

import { motion } from 'framer-motion'
import { Package, Sparkles } from 'lucide-react'

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Package className="w-12 h-12 text-orange-400" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Loading Products
          </h1>
          <p className="text-lg text-gray-300">
            Discovering the best nutrition for you...
          </p>
        </motion.div>

        {/* Filters Loading Skeleton */}
        <motion.div
          className="bg-gray-800/80 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Search Skeleton */}
            <div className="lg:col-span-2">
              <div className="h-10 bg-gray-700 rounded-lg animate-pulse" />
            </div>
            {/* Filter Skeletons */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </motion.div>

        {/* Product Grid Loading */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(12)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/80 rounded-2xl p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* Image Placeholder */}
              <div className="aspect-square bg-gray-700 rounded-xl animate-pulse relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.1
                  }}
                />
              </div>
              
              {/* Title */}
              <div className="h-6 bg-gray-700 rounded animate-pulse" />
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
              </div>
              
              {/* Price */}
              <div className="h-8 bg-gray-700 rounded animate-pulse" />
              
              {/* Tags */}
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-700 rounded-full w-16 animate-pulse" />
                <div className="h-6 bg-gray-700 rounded-full w-20 animate-pulse" />
              </div>
              
              {/* Button */}
              <div className="h-10 bg-gray-700 rounded-lg animate-pulse" />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Curating premium nutrition products for you...</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}