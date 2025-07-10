'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Menu, User, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
// Unused imports removed for bundle optimization
import { AccessibleImage } from '@/components/accessibility/accessible-image'
import { MobileNavigation } from './mobile-navigation'
import { MobileCart } from './mobile-cart'
import { GlobalSearchModal } from '@/components/search/global-search-modal'
import { useMobilePerformance, useMobileEvents, useMobileKeyboard } from '@/hooks/use-mobile-performance'

interface MobileHeaderProps {
  showBackButton?: boolean
  title?: string
  transparent?: boolean
  onBack?: () => void
}

export function MobileHeader({ 
  showBackButton = false, 
  title, 
  transparent = false,
  onBack 
}: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const router = useRouter()
  const { cart } = useCart()
  const { isAuthenticated } = useAuth()

  // Mobile performance optimizations
  const { optimizeScroll } = useMobilePerformance({
    enableTouchCallouts: false,
    enableUserSelect: false,
    enableScrollBounce: false,
    enableZoom: false
  })
  useMobileEvents()
  useMobileKeyboard()

  useEffect(() => {
    const handleScroll = () => {
      optimizeScroll(() => {
        const currentScrollY = window.scrollY
        setScrollY(currentScrollY)
        setIsScrolled(currentScrollY > 20)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [optimizeScroll])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300
    ${transparent && !isScrolled 
      ? 'bg-transparent' 
      : 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/40'
    }
  `

  return (
    <>
      <motion.header
        className={headerClasses}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ 
          paddingTop: 'env(safe-area-inset-top)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-3">
              {showBackButton ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNavigation(true)}
                  className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </motion.button>
              )}

              {/* Logo or Title */}
              {title ? (
                <h1 className="text-lg font-bold text-gray-100 truncate">
                  {title}
                </h1>
              ) : (
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 relative">
                    <AccessibleImage
                      src="/logo.png"
                      alt="Tishya Foods Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-100">
                      Tishya Foods
                    </span>
                    <span className="text-xs text-gray-400 -mt-1">
                      Health At Home!
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGlobalSearch(true)}
                className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Search products, blog posts, and recipes"
              >
                <Search size={20} />
              </motion.button>

              {isAuthenticated ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                  aria-label="User account"
                >
                  <User size={20} />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                  aria-label="Sign in"
                >
                  <User size={20} />
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cart && cart.totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {cart.totalItems > 99 ? '99+' : cart.totalItems}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 pb-3 border-t border-gray-700/40"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-10 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSearch(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  <X size={16} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        onSearchClick={() => setShowGlobalSearch(true)}
        onCartClick={() => setShowCart(true)}
      />

      {/* Mobile Cart */}
      <MobileCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
      />
    </>
  )
}