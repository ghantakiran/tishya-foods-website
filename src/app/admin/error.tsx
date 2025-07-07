'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, RefreshCw, Settings, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AdminErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error('Admin panel error:', error)
    
    // Track admin-specific errors
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Admin panel: ${error.message}`,
        fatal: false,
        custom_map: {
          page: 'admin',
          user_type: 'admin'
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
          {/* Admin Error Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-purple-400" />
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-100 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Admin Panel Error
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The admin panel encountered an unexpected error. This could be due to a system issue, permission problem, or data inconsistency.
          </motion.p>

          {/* Security Notice */}
          <motion.div
            className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-400">Security Notice</h3>
            </div>
            <p className="text-sm text-amber-200">
              This error has been logged for security monitoring. If you suspect unauthorized access, please contact IT support immediately.
            </p>
          </motion.div>

          {/* Troubleshooting Steps */}
          <motion.div
            className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Troubleshooting:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Verify your admin permissions</li>
              <li>• Check if you're still logged in</li>
              <li>• Clear browser cache and cookies</li>
              <li>• Try accessing from a different browser</li>
              <li>• Contact system administrator if needed</li>
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
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Admin Panel</span>
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                asChild
                className="flex-1 flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Link href="/admin">
                  <Settings className="w-4 h-4" />
                  <span>Admin Home</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="flex-1 flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Link href="/profile">
                  <Shield className="w-4 h-4" />
                  <span>My Profile</span>
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
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Admin Panel</span>
              </Link>
            </Button>
          </motion.div>

          {/* System Information */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              className="mt-8 p-4 bg-gray-800/30 rounded-lg text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Debug Information:</h4>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Error: {error.message}</p>
                {error.digest && <p>Digest: {error.digest}</p>}
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}