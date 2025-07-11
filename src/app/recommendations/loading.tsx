'use client'

import { motion } from 'framer-motion'
import { Sparkles, Brain, Target, TrendingUp } from 'lucide-react'

export default function RecommendationsLoading() {
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
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-16 h-16 text-purple-400" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            AI Recommendations
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our AI is analyzing your preferences and nutrition goals...
          </p>
        </motion.div>

        {/* AI Status Indicators */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: Target, label: "Analyzing Goals", color: "text-blue-400" },
            { icon: TrendingUp, label: "Processing Data", color: "text-green-400" },
            { icon: Sparkles, label: "Generating Recommendations", color: "text-purple-400" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/80 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                className="flex justify-center mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </motion.div>
              <div className="h-5 bg-gray-700 rounded w-32 mx-auto animate-pulse" />
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, delay: index * 0.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendations Categories Loading */}
        <div className="space-y-8">
          {/* Personalized Picks */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <div className="h-7 bg-gray-700 rounded w-48 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/80 rounded-2xl p-4 space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {/* AI Badge */}
                  <div className="flex justify-between items-start">
                    <div className="h-6 bg-purple-600/50 rounded-full w-16 animate-pulse" />
                    <div className="h-6 bg-gray-700 rounded w-12 animate-pulse" />
                  </div>
                  
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-700 rounded-xl animate-pulse relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: index * 0.2
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                    <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse" />
                  </div>
                  
                  {/* Match Score */}
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${70 + index * 5}%` }}
                        transition={{ duration: 2, delay: 1 + index * 0.2 }}
                      />
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="h-10 bg-purple-600/50 rounded-lg animate-pulse" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Based on Your Goals */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-blue-400" />
              <div className="h-7 bg-gray-700 rounded w-52 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/80 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  {/* Goal Category */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600/50 rounded-full animate-pulse" />
                    <div className="h-5 bg-gray-700 rounded w-24 animate-pulse" />
                  </div>
                  
                  {/* Products List */}
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-700 rounded mb-1 animate-pulse" />
                          <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                        </div>
                        <div className="h-3 bg-gray-700 rounded w-12 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Loading Message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-6 h-6 text-purple-400" />
            </motion.div>
            <span className="text-lg">AI is crafting your personalized nutrition recommendations...</span>
          </div>
          
          {/* Processing Steps */}
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            {[
              "Analyzing dietary preferences",
              "Matching with nutritional goals", 
              "Calculating compatibility scores"
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}