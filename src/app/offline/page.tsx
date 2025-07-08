'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Home, ShoppingCart, Book } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <WifiOff className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-400 text-lg">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still browse some cached content!
          </p>
        </div>

        {isOnline ? (
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Connection restored!</span>
            </div>
            <button
              onClick={refreshPage}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-orange-400">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Still offline</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Check your internet connection and try refreshing the page.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            What you can still do:
          </h2>
          
          <div className="grid gap-3">
            <Link 
              href="/"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              <Home className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <div className="font-medium text-white">Browse Homepage</div>
                <div className="text-gray-400 text-sm">View featured products and content</div>
              </div>
            </Link>

            <Link 
              href="/products"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="font-medium text-white">Product Catalog</div>
                <div className="text-gray-400 text-sm">Browse cached products</div>
              </div>
            </Link>

            <Link 
              href="/recipes"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              <Book className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="font-medium text-white">Recipe Collection</div>
                <div className="text-gray-400 text-sm">View saved recipes</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-medium text-white mb-2">💡 Pro Tip</h3>
          <p className="text-gray-400 text-sm">
            Install our app for better offline experience! Look for the install button in your browser.
          </p>
        </div>
      </div>
    </div>
  )
}