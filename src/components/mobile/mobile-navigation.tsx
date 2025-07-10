'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  ChevronRight, 
  Home, 
  ShoppingBag, 
  User, 
  Search, 
  Heart,
  FileText,
  ChefHat,
  Gift,
  Info,
  MessageCircle,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useTouchGestures } from '@/lib/touch'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { MobileQuickActions } from './mobile-quick-actions'

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  onSearchClick?: () => void
  onCartClick?: () => void
}

const navigationItems = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home, 
    description: 'Homepage and featured products',
    category: 'main'
  },
  { 
    name: 'Products', 
    href: '/products', 
    icon: ShoppingBag, 
    description: 'Browse our health food catalog',
    category: 'main'
  },
  { 
    name: 'Compare', 
    href: '/compare', 
    icon: Zap, 
    description: 'Compare product features',
    category: 'tools'
  },
  { 
    name: 'Recipes', 
    href: '/recipes', 
    icon: ChefHat, 
    description: 'Healthy recipe collection',
    category: 'content'
  },
  { 
    name: 'Blog', 
    href: '/blog', 
    icon: FileText, 
    description: 'Health tips and articles',
    category: 'content'
  },
  { 
    name: 'Nutrition', 
    href: '/nutrition', 
    icon: Heart, 
    description: 'Track your nutrition goals',
    category: 'tools'
  },
  { 
    name: 'Subscription', 
    href: '/subscription', 
    icon: Gift, 
    description: 'Monthly health food delivery',
    category: 'services'
  },
  { 
    name: 'Rewards', 
    href: '/loyalty', 
    icon: Gift, 
    description: 'Earn points and rewards',
    category: 'services'
  },
  { 
    name: 'About', 
    href: '/about', 
    icon: Info, 
    description: 'Our story and mission',
    category: 'info'
  },
  { 
    name: 'Contact', 
    href: '/contact', 
    icon: MessageCircle, 
    description: 'Get in touch with us',
    category: 'info'
  },
]

const categoryLabels = {
  main: 'Main',
  tools: 'Tools & Features',
  content: 'Content & Recipes',
  services: 'Services',
  info: 'Information'
}

export function MobileNavigation({ isOpen, onClose, onSearchClick, onCartClick }: MobileNavigationProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('main')
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

  const handleItemClick = useCallback((itemName: string) => {
    setActiveItem(itemName)
    // Add haptic feedback for supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    setTimeout(() => {
      onClose()
    }, 200)
  }, [onClose])

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }, [expandedCategory])

  // Group navigation items by category
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof navigationItems>)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

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

            {/* Navigation Items - Categorized */}
            <div className="py-4 flex-1 overflow-y-auto">
              {Object.entries(groupedItems).map(([category, items], categoryIndex) => (
                <div key={category} className="mb-6">
                  {/* Category Header */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-6 py-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedCategory === category ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  </motion.button>

                  {/* Category Items */}
                  <AnimatePresence>
                    {expandedCategory === category && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {items.map((item, itemIndex) => {
                          const Icon = item.icon
                          const isActive = activeItem === item.name
                          
                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => handleItemClick(item.name)}
                                className={`flex items-center justify-between px-6 py-4 ml-4 mr-2 rounded-lg transition-all duration-200 group ${
                                  isActive 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg transition-colors ${
                                    isActive 
                                      ? 'bg-blue-500/20' 
                                      : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                                  }`}>
                                    <Icon size={18} />
                                  </div>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{item.name}</span>
                                    <span className={`text-xs ${
                                      isActive 
                                        ? 'text-blue-100' 
                                        : 'text-gray-500 group-hover:text-gray-400'
                                    }`}>
                                      {item.description}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight 
                                  size={16} 
                                  className={`transition-transform group-hover:translate-x-1 ${
                                    isActive ? 'text-blue-200' : 'text-gray-500'
                                  }`} 
                                />
                              </Link>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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

            {/* Quick Actions */}
            <MobileQuickActions
              onSearchClick={() => {
                onSearchClick?.()
                onClose()
              }}
              onCartClick={() => {
                onCartClick?.()
                onClose()
              }}
            />

            {/* Footer */}
            <div className="p-6 border-t border-gray-700">
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