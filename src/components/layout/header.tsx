'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { CartDrawer } from '@/features/cart/cart-drawer'
import { AuthModal } from '@/features/auth/auth-modal'

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

  return (
    <motion.header
      data-testid="main-header"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out',
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
                <Image
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
          <nav className="hidden lg:flex items-center space-x-6">
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
                  className="text-gray-100 hover:text-blue-400 font-medium transition-all duration-300 ease-out relative group px-4 py-2 rounded-xl hover:bg-gray-800/60 hover:backdrop-blur-sm"
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full hover:shadow-lg hover:shadow-blue-500/20"
                data-testid="search-button"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
            {isAuthenticated ? (
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full"></span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-600">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Profile & Preferences
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Orders
                  </Link>
                  <Link href="/loyalty" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Rewards
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)} className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full hover:shadow-lg hover:shadow-blue-500/20">
                  <User className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full hover:shadow-lg hover:shadow-blue-500/20"
                onClick={() => setIsCartOpen(true)}
                data-testid="cart-button"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.totalItems > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {cart.totalItems}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="ml-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ease-out rounded-full px-6 backdrop-blur-sm">
                Shop Now
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <Button
              data-testid="mobile-menu-toggle"
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-lg hover:shadow-lg hover:shadow-blue-500/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
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
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
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
                    className="text-gray-100 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-gray-800/60 transition-all duration-200 ease-out"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60">
                    <Search className="h-5 w-5" />
                  </Button>
                  {isAuthenticated ? (
                    <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60">
                      <User className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-fresh-500 w-3 h-3 rounded-full"></span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)} className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60">
                      <User className="h-5 w-5" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cart && cart.totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cart.totalItems}
                      </span>
                    )}
                  </Button>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
                  Shop Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </motion.header>
  )
}