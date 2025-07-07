'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, RefreshCw, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProductsErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  useEffect(() => {
    console.error('Products page error:', error)
    
    // Track product-specific errors
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Products page: ${error.message}`,
        fatal: false,
        custom_map: {
          page: 'products'
        }
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
          {/* Products Error Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-orange-400" />
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-100 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Products Not Available
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're having trouble loading our products right now. This could be due to a temporary server issue or connectivity problem.
          </motion.p>

          {/* Suggested Actions */}
          <motion.div
            className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-3">You can try:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Refreshing the page</li>
              <li>• Checking your internet connection</li>
              <li>• Browsing other categories</li>
              <li>• Trying again in a few minutes</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={reset}
              className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Products</span>
            </Button>

            <Button
              variant="outline"
              asChild
              className="flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Link href="/recipes">
                <Search className="w-4 h-4" />
                <span>Browse Recipes</span>
              </Link>
            </Button>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="ghost"
              asChild
              className="text-gray-400 hover:text-gray-300"
            >
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homepage</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}