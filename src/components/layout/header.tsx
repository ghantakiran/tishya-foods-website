'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react'
import { AccessibleButton, AccessibleIconButton } from '@/components/accessibility/accessible-button'
import { AccessibleImage } from '@/components/accessibility/accessible-image'
import { Landmark } from '@/components/accessibility/screen-reader'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { CartDrawer } from '@/features/cart/cart-drawer'
import { AuthModal } from '@/features/auth/auth-modal'
import { MobileHeader } from '@/components/mobile/mobile-header'
import { GlobalSearchModal } from '@/components/search/global-search-modal'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Compare', href: '/compare' },
  { name: 'Subscription', href: '/subscription' },
  { name: 'Rewards', href: '/loyalty' },
  { name: 'Blog', href: '/blog' },
  { name: 'Nutrition', href: '/nutrition' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cart } = useCart()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Header */}
      <Landmark role="banner" label="Site header">
      <motion.header
      data-testid="main-header"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out hidden lg:block',
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-700/40 supports-[backdrop-filter]:bg-gray-900/90'
          : 'bg-gray-900/70 backdrop-blur-lg supports-[backdrop-filter]:bg-gray-900/50'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: isScrolled ? 0.98 : 1
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] // Apple's signature easing curve
      }}
      style={{
        backdropFilter: `blur(${isScrolled ? 25 : 15}px) saturate(${isScrolled ? 200 : 140}%)`,
        WebkitBackdropFilter: `blur(${isScrolled ? 25 : 15}px) saturate(${isScrolled ? 200 : 140}%)`,
        transform: `translateY(${Math.min(scrollY * 0.1, 5)}px)`,
        boxShadow: isScrolled 
          ? '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)' 
          : '0 4px 16px rgba(0,0,0,0.1)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            animate={{
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <motion.div 
                className={cn(
                  "relative transition-all duration-300",
                  isScrolled ? "w-10 h-10 lg:w-12 lg:h-12" : "w-12 h-12 lg:w-14 lg:h-14"
                )}
                animate={{
                  rotate: isScrolled ? 2 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <AccessibleImage
                  src="/logo.png"
                  alt="Tishya Foods Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <motion.div 
                className="flex flex-col"
                animate={{
                  opacity: isScrolled ? 0.9 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={cn(
                  "text-gray-100 font-bold font-montserrat transition-all duration-300",
                  isScrolled ? "text-base lg:text-lg" : "text-lg lg:text-xl"
                )}>
                  Tishya Foods
                </span>
                <span className={cn(
                  "text-gray-300 -mt-1 font-medium transition-all duration-300",
                  isScrolled ? "text-xs lg:text-xs" : "text-xs lg:text-sm"
                )}>
                  Health At Home!
                </span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <Landmark role="navigation" label="Main navigation">
            <nav id="main-navigation" className="hidden lg:flex items-center space-x-6">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <Link
                  href={item.href}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                  className="text-gray-100 hover:text-blue-400 font-medium transition-all duration-300 ease-out relative group px-4 py-2 rounded-xl hover:bg-gray-800/60 hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-current={typeof window !== 'undefined' && window.location.pathname === item.href ? 'page' : undefined}
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.span 
                    className="absolute inset-x-2 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
            </nav>
          </Landmark>

          {/* Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AccessibleIconButton 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full hover:shadow-lg hover:shadow-blue-500/20 focus:ring-offset-gray-900"
                data-testid="search-button"
                icon={<Search className="h-5 w-5" />}
                label="Search products, blog posts, and recipes"
              />
            </motion.div>
            {isAuthenticated ? (
              <div className="relative">
                <div className="relative">
                  <AccessibleIconButton 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full focus:ring-offset-gray-900" 
                    icon={<User className="h-5 w-5" />}
                    label="User account menu"
                  />
                  <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full" aria-hidden="true"></span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-600" role="menu" aria-label="User account menu">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" role="menuitem">
                    Profile & Preferences
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" role="menuitem">
                    Orders
                  </Link>
                  <Link href="/loyalty" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" role="menuitem">
                    Rewards
                  </Link>
                  <AccessibleButton
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 bg-transparent border-none"
                    role="menuitem"
                  >
                    Sign Out
                  </AccessibleButton>
                </div>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AccessibleIconButton 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAuthOpen(true)} 
                  className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full hover:shadow-lg hover:shadow-blue-500/20 focus:ring-offset-gray-900" 
                  icon={<User className="h-5 w-5" />}
                  label="Sign in or create account"
                />
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <AccessibleIconButton 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full hover:shadow-lg hover:shadow-blue-500/20 focus:ring-offset-gray-900"
                onClick={() => setIsCartOpen(true)}
                data-testid="cart-button"
                icon={<ShoppingCart className="h-5 w-5" />}
                label={`Shopping cart ${cart && cart.totalItems > 0 ? `with ${cart.totalItems} items` : '(empty)'}`}
              />
              {cart && cart.totalItems > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  aria-hidden="true"
                >
                  {cart.totalItems}
                </motion.span>
              )}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AccessibleButton className="ml-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ease-out rounded-full px-6 backdrop-blur-sm focus:ring-offset-gray-900">
                Shop Now
              </AccessibleButton>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <AccessibleIconButton
              data-testid="mobile-menu-toggle"
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-lg hover:shadow-lg hover:shadow-blue-500/20 focus:ring-offset-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              icon={
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              }
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Landmark role="navigation" label="Mobile navigation">
            <motion.div
              id="mobile-menu"
              data-testid="mobile-menu"
              className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/30 shadow-lg supports-[backdrop-filter]:bg-gray-900/90"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)'
            }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    className="text-gray-100 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-gray-800/60 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={typeof window !== 'undefined' && window.location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <AccessibleIconButton 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 focus:ring-offset-gray-900"
                    icon={<Search className="h-5 w-5" />}
                    label="Search products, blog posts, and recipes"
                  />
                  {isAuthenticated ? (
                    <div className="relative">
                      <AccessibleIconButton 
                        variant="ghost" 
                        size="icon" 
                        className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 focus:ring-offset-gray-900"
                        icon={<User className="h-5 w-5" />}
                        label="User account"
                      />
                      <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full" aria-hidden="true"></span>
                    </div>
                  ) : (
                    <AccessibleIconButton 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsAuthOpen(true)} 
                      className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 focus:ring-offset-gray-900"
                      icon={<User className="h-5 w-5" />}
                      label="Sign in or create account"
                    />
                  )}
                  <div className="relative">
                    <AccessibleIconButton 
                      variant="ghost" 
                      size="icon" 
                      className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 focus:ring-offset-gray-900"
                      onClick={() => setIsCartOpen(true)}
                      icon={<ShoppingCart className="h-5 w-5" />}
                      label={`Shopping cart ${cart && cart.totalItems > 0 ? `with ${cart.totalItems} items` : '(empty)'}`}
                    />
                    {cart && cart.totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center" aria-hidden="true">
                        {cart.totalItems}
                      </span>
                    )}
                  </div>
                </div>
                <AccessibleButton className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-offset-gray-900">
                  Shop Now
                </AccessibleButton>
              </div>
            </div>
            </motion.div>
          </Landmark>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </motion.header>
      </Landmark>
    </>
  )
}