'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, Home, ShoppingBag, User, Search, Heart } from 'lucide-react'
import Link from 'next/link'
import { useTouchGestures } from '@/lib/touch'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: ShoppingBag },
  { name: 'Compare', href: '/compare', icon: Search },
  { name: 'Subscription', href: '/subscription', icon: Heart },
  { name: 'Rewards', href: '/loyalty', icon: Heart },
  { name: 'Blog', href: '/blog', icon: Search },
  { name: 'Nutrition', href: '/nutrition', icon: Heart },
  { name: 'About', href: '/about', icon: User },
  { name: 'Contact', href: '/contact', icon: User },
]

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { cart } = useCart()
  const { isAuthenticated, user } = useAuth()

  // Handle swipe to close
  useTouchGestures(
    menuRef,
    {
      onSwipeLeft: () => onClose(),
      onSwipeRight: () => {}, // Prevent accidental opening
    },
    { swipeThreshold: 50 }
  )

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 z-[70] lg:hidden overflow-y-auto"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-100">Tishya Foods</h2>
                  <p className="text-xs text-gray-400">Health At Home!</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* User Section */}
            {isAuthenticated && user && (
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-100 font-medium">{user.firstName || 'User'}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-800 rounded-lg p-3 text-center"
                  >
                    <Heart size={20} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Wishlist</p>
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-800 rounded-lg p-3 text-center"
                  >
                    <ShoppingBag size={20} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">
                      Cart ({cart?.totalItems || 0})
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="py-4">
              {navigationItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleItemClick(item.name)}
                      className={`flex items-center justify-between px-6 py-4 text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 ${
                        activeItem === item.name ? 'bg-gray-800 text-white' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-500" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Auth Section */}
            {!isAuthenticated && (
              <div className="p-6 border-t border-gray-700">
                <div className="space-y-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Create Account
                  </motion.button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 mt-auto">
              <div className="text-center text-gray-400 text-sm">
                <p>© 2024 Tishya Foods</p>
                <p className="mt-1">Health At Home!</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}