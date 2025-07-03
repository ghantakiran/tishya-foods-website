'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Gift, Users, TrendingUp } from 'lucide-react'
import { LoyaltyDashboard } from '@/components/loyalty/loyalty-dashboard'
import { ReferralProgram } from '@/components/loyalty/referral-program'
import { useRoutePerformance } from '@/components/performance/performance-init'
import { cn } from '@/lib/utils'

type LoyaltyView = 'dashboard' | 'referrals'

export default function LoyaltyPage() {
  const [activeView, setActiveView] = useState<LoyaltyView>('dashboard')
  
  // Performance tracking
  useRoutePerformance('loyalty')

  const views = [
    { 
      id: 'dashboard', 
      name: 'Loyalty Dashboard', 
      icon: Trophy,
      description: 'View your points, tier status, and rewards'
    },
    { 
      id: 'referrals', 
      name: 'Refer Friends', 
      icon: Users,
      description: 'Invite friends and earn bonus points'
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-earth-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-100 mb-4 font-montserrat">
            Tishya Rewards
          </h1>
          <p className="text-lg text-cream-300 max-w-2xl mx-auto">
            Earn points with every purchase, unlock exclusive rewards, and enjoy member-only benefits. 
            The more you shop, the more you save!
          </p>
        </motion.div>

        {/* View Selector */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-earth-800 rounded-2xl p-2 shadow-lg border">
            <div className="flex space-x-1">
              {views.map((view) => {
                const Icon = view.icon
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id as LoyaltyView)}
                    className={cn(
                      'flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      activeView === view.id
                        ? 'bg-earth-800 text-cream-100 shadow-md'
                        : 'text-cream-300 hover:bg-earth-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">{view.name}</div>
                      <div className="text-xs opacity-75">{view.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <LoyaltyDashboard />
            </motion.div>
          )}

          {activeView === 'referrals' && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ReferralProgram />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits Overview */}
        <motion.div 
          className="mt-16 relative bg-gradient-to-r from-earth-50 to-primary-50 rounded-2xl p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1585500976406-9ea7b5f01fd5?w=800&h=400&fit=crop&crop=center" 
              alt="Rewards and benefits"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
          <h2 className="text-2xl font-bold text-cream-100 mb-6 text-center">
            Why Join Tishya Rewards?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-earth-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="font-semibold text-cream-100 mb-2">Earn While You Shop</h3>
              <p className="text-sm text-cream-300">
                Get points for every purchase and watch your savings grow
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-earth-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="font-semibold text-cream-100 mb-2">Exclusive Rewards</h3>
              <p className="text-sm text-cream-300">
                Redeem points for discounts, free products, and special experiences
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-earth-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-gold" />
              </div>
              <h3 className="font-semibold text-cream-100 mb-2">Tier Benefits</h3>
              <p className="text-sm text-cream-300">
                Unlock higher tiers for bigger discounts and premium perks
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-earth-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="font-semibold text-cream-100 mb-2">Refer & Earn</h3>
              <p className="text-sm text-cream-300">
                Share with friends and earn bonus points for every referral
              </p>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-cream-100 mb-6">
            Ready to Start Earning Rewards?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="text-left">
                <h4 className="font-semibold text-cream-100">Shop & Earn</h4>
                <p className="text-sm text-cream-300">Make purchases and automatically earn points</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div className="text-left">
                <h4 className="font-semibold text-cream-100">Unlock Tiers</h4>
                <p className="text-sm text-cream-300">Accumulate points to reach higher tiers with better benefits</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div className="text-left">
                <h4 className="font-semibold text-cream-100">Redeem Rewards</h4>
                <p className="text-sm text-cream-300">Use points for discounts, free products, and exclusive experiences</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}