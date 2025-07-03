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
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
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
              <span className="text-primary-600 text-xs lg:text-sm -mt-1">
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
                className="text-gray-100 hover:text-primary-400 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-100 hover:text-primary-400 hover:bg-gray-800">
              <Search className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative text-gray-100 hover:text-primary-400 hover:bg-gray-800">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full"></span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-700">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    Orders
                  </Link>
                  <Link href="/preferences" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    Preferences
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)} className="text-gray-100 hover:text-primary-400 hover:bg-gray-800">
                <User className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-100 hover:text-primary-400 hover:bg-gray-800"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Button>
            <Button className="ml-4">
              Shop Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-100 hover:text-primary-400 hover:bg-gray-800"
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
            className="lg:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-100 hover:text-primary-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="text-gray-100 hover:text-primary-400 hover:bg-gray-800">
                    <Search className="h-5 w-5" />
                  </Button>
                  {isAuthenticated ? (
                    <Button variant="ghost" size="icon" className="relative text-gray-100 hover:text-primary-400 hover:bg-gray-800">
                      <User className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full"></span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)} className="text-gray-100 hover:text-primary-400 hover:bg-gray-800">
                      <User className="h-5 w-5" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-gray-100 hover:text-primary-400 hover:bg-gray-800"
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
                <Button>
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