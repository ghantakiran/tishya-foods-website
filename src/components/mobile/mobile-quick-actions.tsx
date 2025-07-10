'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Search, Zap, Gift, User } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'

interface MobileQuickActionsProps {
  onSearchClick: () => void
  onCartClick: () => void
}

const quickActions = [
  {
    id: 'search',
    icon: Search,
    label: 'Search',
    color: 'from-blue-500 to-blue-600',
    action: 'search'
  },
  {
    id: 'cart',
    icon: ShoppingBag,
    label: 'Cart',
    color: 'from-green-500 to-green-600', 
    action: 'cart'
  },
  {
    id: 'wishlist',
    icon: Heart,
    label: 'Wishlist',
    color: 'from-red-500 to-red-600',
    action: 'wishlist'
  },
  {
    id: 'compare',
    icon: Zap,
    label: 'Compare',
    color: 'from-purple-500 to-purple-600',
    action: 'compare'
  },
  {
    id: 'rewards',
    icon: Gift,
    label: 'Rewards',
    color: 'from-yellow-500 to-yellow-600',
    action: 'rewards'
  },
  {
    id: 'profile',
    icon: User,
    label: 'Profile',
    color: 'from-gray-500 to-gray-600',
    action: 'profile'
  }
]

export function MobileQuickActions({ onSearchClick, onCartClick }: MobileQuickActionsProps) {
  const { cart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleActionClick = (action: string) => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }

    switch (action) {
      case 'search':
        onSearchClick()
        break
      case 'cart':
        onCartClick()
        break
      case 'wishlist':
        // Navigate to wishlist
        window.location.href = '/wishlist'
        break
      case 'compare':
        window.location.href = '/compare'
        break
      case 'rewards':
        window.location.href = '/loyalty'
        break
      case 'profile':
        if (isAuthenticated) {
          window.location.href = '/profile'
        } else {
          // Trigger auth modal
          window.location.href = '/auth'
        }
        break
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3 p-6 border-t border-gray-700">
      {quickActions.map((action, index) => {
        const Icon = action.icon
        let badgeCount = 0
        
        if (action.id === 'cart' && cart?.totalItems) {
          badgeCount = cart.totalItems
        }

        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleActionClick(action.action)}
            className={`relative p-4 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 group`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Icon size={24} className="group-hover:scale-110 transition-transform duration-200" />
                {badgeCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </motion.div>
                )}
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}