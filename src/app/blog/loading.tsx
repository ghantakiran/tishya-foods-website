import { motion } from 'framer-motion'
import { BookOpen, PenTool } from 'lucide-react'

export default function BlogLoading() {
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
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <BookOpen className="w-12 h-12 text-blue-400" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Loading Blog
          </h1>
          <p className="text-lg text-gray-300">
            Preparing fresh nutrition insights...
          </p>
        </motion.div>

        {/* Categories/Tags Loading */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-8 w-20 bg-gray-700 rounded-full animate-pulse"
            />
          ))}
        </motion.div>

        {/* Blog Posts Grid Loading */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(9)].map((_, index) => (
            <motion.article
              key={index}
              className="bg-gray-800/80 rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* Featured Image Placeholder */}
              <div className="h-48 bg-gray-700 animate-pulse relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.2
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Category */}
                <div className="h-5 bg-gray-700 rounded w-24 animate-pulse" />
                
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-6 bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 bg-gray-700 rounded w-4/5 animate-pulse" />
                </div>
                
                {/* Excerpt */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>
                
                {/* Meta */}
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-700 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
                </div>
                
                {/* Tags */}
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-700 rounded-full w-12 animate-pulse" />
                  <div className="h-6 bg-gray-700 rounded-full w-16 animate-pulse" />
                  <div className="h-6 bg-gray-700 rounded-full w-14 animate-pulse" />
                </div>
              </div>
            </motion.article>
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
            <PenTool className="w-5 h-5 animate-pulse" />
            <span>Loading the latest nutrition articles and insights...</span>
          </div>
        </motion.div>

        {/* Pagination Loading */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-10 h-10 bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}