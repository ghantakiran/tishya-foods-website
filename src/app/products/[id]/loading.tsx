import { motion } from 'framer-motion'
import { Package, Star, Heart, ShoppingCart } from 'lucide-react'

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Loading */}
        <motion.div
          className="flex items-center space-x-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
              {i < 3 && <span className="mx-2 text-gray-500">/</span>}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Loading */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Main Image */}
            <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {/* Image placeholder icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-600" />
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-square bg-gray-700 rounded-lg animate-pulse"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Product Info Loading */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Category */}
            <div className="h-5 bg-gray-700 rounded w-24 animate-pulse" />
            
            {/* Product Title */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gray-600" />
                ))}
              </div>
              <div className="h-4 bg-gray-700 rounded w-20 animate-pulse" />
            </div>
            
            {/* Price */}
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-6 bg-gray-700 rounded w-20 animate-pulse" />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse" />
            </div>
            
            {/* Key Features/Tags */}
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-700 rounded-full w-16 animate-pulse" />
              ))}
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-700 rounded animate-pulse" />
                <div className="w-16 h-10 bg-gray-700 rounded animate-pulse" />
                <div className="w-10 h-10 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <div className="flex-1 h-12 bg-blue-600/50 rounded-lg animate-pulse" />
              <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse" />
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded flex-1 animate-pulse" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs Loading */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Tab Headers */}
          <div className="flex space-x-8 border-b border-gray-700 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-700 rounded w-20 animate-pulse" />
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
          </div>
        </motion.div>

        {/* Nutrition Info Loading */}
        <motion.div
          className="mt-12 bg-gray-800/80 rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="h-6 bg-gray-700 rounded w-40 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-700 rounded w-16 mx-auto mb-2 animate-pulse" />
                <div className="h-4 bg-gray-700 rounded w-20 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Products Loading */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="h-7 bg-gray-700 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-gray-800/80 rounded-2xl p-4 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.1 }}
              >
                <div className="aspect-square bg-gray-700 rounded-xl animate-pulse" />
                <div className="h-5 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse" />
                <div className="h-10 bg-gray-700 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading Message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Package className="w-5 h-5" />
            </motion.div>
            <span>Loading product details and recommendations...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}