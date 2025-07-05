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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { cart } = useCart()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      data-testid="main-header"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        isScrolled
          ? 'bg-gray-900/90 backdrop-blur-xl shadow-sm border-b border-gray-700/30 supports-[backdrop-filter]:bg-gray-900/80'
          : 'bg-gray-900/60 backdrop-blur-md supports-[backdrop-filter]:bg-gray-900/40'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] // Apple's signature easing curve
      }}
      style={{
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(10px) saturate(120%)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(10px) saturate(120%)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 lg:w-14 lg:h-14">
              <Image
                src="/logo.png"
                alt="Tishya Foods Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-100 font-bold text-lg lg:text-xl font-montserrat">
                Tishya Foods
              </span>
              <span className="text-gray-300 text-xs lg:text-sm -mt-1 font-medium">
                Health At Home!
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`nav-${item.name.toLowerCase()}`}
                className="text-gray-100 hover:text-blue-400 font-medium transition-all duration-300 ease-out relative group px-3 py-2 rounded-lg hover:bg-gray-800/50"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 origin-center" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full"
              data-testid="search-button"
            >
              <Search className="h-5 w-5" />
            </Button>
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
              <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)} className="text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full">
                <User className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-full"
              onClick={() => setIsCartOpen(true)}
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Button>
            <Button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 ease-out rounded-full px-6">
              Shop Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            data-testid="mobile-menu-toggle"
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-300 hover:text-blue-400 hover:bg-gray-800/60 transition-all duration-200 ease-out rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
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