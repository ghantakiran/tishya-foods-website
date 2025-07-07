'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BlogErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BlogError({ error, reset }: BlogErrorProps) {
  useEffect(() => {
    console.error('Blog page error:', error)
    
    // Track blog-specific errors
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Blog page: ${error.message}`,
        fatal: false,
        custom_map: {
          page: 'blog'
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
          {/* Blog Error Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-100 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Blog Content Unavailable
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're experiencing issues loading our blog content. This might be due to a temporary server problem or content management system issue.
          </motion.p>

          {/* Suggested Actions */}
          <motion.div
            className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Try these alternatives:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Refresh to reload blog posts</li>
              <li>• Check our recipe collection</li>
              <li>• Browse our product catalog</li>
              <li>• Visit our social media for updates</li>
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
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Blog</span>
            </Button>

            <Button
              variant="outline"
              asChild
              className="flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Link href="/recipes">
                <BookOpen className="w-4 h-4" />
                <span>View Recipes</span>
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