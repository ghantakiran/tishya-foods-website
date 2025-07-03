'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Gift, 
  Coins, 
  TrendingUp, 
  X, 
  ExternalLink,
  Crown,
  Award,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatPrice, cn } from '@/lib/utils'
import Link from 'next/link'

interface LoyaltyWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  autoShow?: boolean
  minimized?: boolean
}

interface MockLoyaltyData {
  currentPoints: number
  currentTier: string
  nextTier: string
  pointsToNextTier: number
  recentEarning?: {
    points: number
    reason: string
    date: Date
  }
}

const mockData: MockLoyaltyData = {
  currentPoints: 1850,
  currentTier: 'Silver Member',
  nextTier: 'Gold Member',
  pointsToNextTier: 650,
  recentEarning: {
    points: 150,
    reason: 'Order #TF-12345',
    date: new Date()
  }
}

const tierColors = {
  'Bronze Member': 'bg-amber-600',
  'Silver Member': 'bg-earth-400',
  'Gold Member': 'bg-yellow-500',
  'Platinum Elite': 'bg-purple-600'
}

const tierIcons = {
  'Bronze Member': Star,
  'Silver Member': Award,
  'Gold Member': Crown,
  'Platinum Elite': Zap
}

export function LoyaltyWidget({ 
  position = 'bottom-right',
  autoShow = true,
  minimized: initialMinimized = false 
}: LoyaltyWidgetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(initialMinimized)
  const [showRecentEarning, setShowRecentEarning] = useState(false)

  useEffect(() => {
    if (autoShow) {
      // Show widget after a delay
      const timer = setTimeout(() => {
        setIsVisible(true)
        
        // Show recent earning notification if available
        if (mockData.recentEarning) {
          setTimeout(() => setShowRecentEarning(true), 1000)
        }
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [autoShow])

  useEffect(() => {
    if (showRecentEarning) {
      // Auto-hide recent earning after 5 seconds
      const timer = setTimeout(() => {
        setShowRecentEarning(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [showRecentEarning])

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4'
      case 'top-right': return 'top-4 right-4'
      case 'bottom-left': return 'bottom-4 left-4'
      case 'bottom-right': return 'bottom-4 right-4'
      default: return 'bottom-4 right-4'
    }
  }

  const progressPercentage = (mockData.currentPoints / (mockData.currentPoints + mockData.pointsToNextTier)) * 100

  const TierIcon = tierIcons[mockData.currentTier as keyof typeof tierIcons] || Star
  const tierColor = tierColors[mockData.currentTier as keyof typeof tierColors] || 'bg-earth-400'

  if (!isVisible) return null

  return (
    <>
      {/* Recent Earning Notification */}
      <AnimatePresence>
        {showRecentEarning && mockData.recentEarning && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed ${getPositionClasses()} z-50 mb-20`}
          >
            <Card className="p-4 bg-green-50 border-green-200 shadow-lg max-w-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Coins className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">
                      +{mockData.recentEarning.points} Points Earned!
                    </p>
                    <p className="text-sm text-green-600">
                      {mockData.recentEarning.reason}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentEarning(false)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Widget */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`fixed ${getPositionClasses()} z-40`}
      >
        <AnimatePresence mode="wait">
          {isMinimized ? (
            <motion.button
              key="minimized"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={() => setIsMinimized(false)}
              className={cn(
                'p-4 rounded-full text-white shadow-lg hover:scale-105 transition-transform duration-200',
                tierColor
              )}
            >
              <TierIcon className="h-6 w-6" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="w-80 bg-earth-800/95 backdrop-blur-sm border shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-full text-white', tierColor)}>
                      <TierIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-earth-800 text-sm">
                        {mockData.currentTier}
                      </h3>
                      <p className="text-xs text-earth-600">
                        {mockData.currentPoints.toLocaleString()} points
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(true)}
                      className="h-6 w-6 p-0"
                    >
                      <TrendingUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsVisible(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Progress to Next Tier */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-earth-800">
                      Progress to {mockData.nextTier}
                    </span>
                    <span className="text-xs text-earth-600">
                      {mockData.pointsToNextTier} points to go
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <p className="text-xs text-earth-600">
                    Earn {mockData.pointsToNextTier} more points to unlock better benefits!
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="p-4 border-b">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-earth-800">
                        {mockData.currentPoints}
                      </div>
                      <div className="text-xs text-earth-600">Available Points</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-earth-800">15%</div>
                      <div className="text-xs text-earth-600">Current Discount</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 space-y-2">
                  <Link href="/loyalty" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 hover:bg-earth-50"
                    >
                      <Gift className="h-3 w-3 mr-2" />
                      View Rewards
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </Link>
                  
                  <Link href="/loyalty" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 hover:bg-earth-50"
                    >
                      <TrendingUp className="h-3 w-3 mr-2" />
                      Full Dashboard
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </Link>
                </div>

                {/* Tier Benefits Preview */}
                <div className="p-4 bg-earth-50 border-t">
                  <h4 className="text-xs font-semibold text-earth-800 mb-2">
                    Your Benefits
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <Star className="h-3 w-3 text-gold" />
                      <span className="text-earth-700">8% off all orders</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Gift className="h-3 w-3 text-blue-500" />
                      <span className="text-earth-700">Free shipping on ₹599+</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Zap className="h-3 w-3 text-purple-500" />
                      <span className="text-earth-700">Early access to sales</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// Hook to show loyalty widget conditionally
export function useLoyaltyWidget() {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    // Show widget based on user behavior, subscription status, etc.
    const checkConditions = () => {
      // Example conditions:
      // - User has made purchases
      // - User is logged in
      // - User hasn't dismissed widget recently
      const hasSeenWidget = localStorage.getItem('loyalty_widget_seen')
      const isLoggedIn = true // Get from auth context
      
      if (isLoggedIn && !hasSeenWidget) {
        setShouldShow(true)
      }
    }

    checkConditions()
  }, [])

  const hideWidget = () => {
    setShouldShow(false)
    localStorage.setItem('loyalty_widget_seen', 'true')
  }

  return { shouldShow, hideWidget }
}