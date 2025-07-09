'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Gift, 
  Trophy, 
  Crown, 
  Coins,
  ShoppingBag,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatPrice, cn } from '@/lib/utils'

// Types
export interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  color: string
  icon: React.ComponentType<{ className?: string }>
  benefits: {
    discountPercentage: number
    freeShippingThreshold: number
    earlyAccess: boolean
    personalShopper: boolean
    birthdayBonus: number
    referralBonus: number
  }
  perks: string[]
}

export interface LoyaltyMember {
  id: string
  userId: string
  currentPoints: number
  lifetimePoints: number
  currentTier: string
  nextTier?: string
  pointsToNextTier: number
  joinDate: Date
  lastActivity: Date
  streakDays: number
  totalOrders: number
  totalSpent: number
  referrals: number
  achievements: string[]
}

export interface PointsTransaction {
  id: string
  memberId: string
  type: 'earned' | 'redeemed' | 'expired' | 'bonus'
  points: number
  reason: string
  orderId?: string
  date: Date
  expiryDate?: Date
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  type: 'discount' | 'product' | 'experience' | 'shipping'
  value: number
  category: string
  imageUrl?: string
  availability: number
  restrictions?: string[]
  validUntil?: Date
  tierRequired?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  category: 'orders' | 'spending' | 'referrals' | 'streak' | 'special'
  requirement: number
  unlocked: boolean
}

// Loyalty Tiers
const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Member',
    minPoints: 0,
    color: 'bg-amber-600',
    icon: Star,
    benefits: {
      discountPercentage: 5,
      freeShippingThreshold: 999,
      earlyAccess: false,
      personalShopper: false,
      birthdayBonus: 100,
      referralBonus: 50
    },
    perks: [
      '5% off all orders',
      'Free shipping on ₹999+',
      '1 point per ₹10 spent',
      'Birthday bonus points'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Member',
    minPoints: 1000,
    color: 'bg-earth-400',
    icon: Trophy,
    benefits: {
      discountPercentage: 8,
      freeShippingThreshold: 599,
      earlyAccess: true,
      personalShopper: false,
      birthdayBonus: 200,
      referralBonus: 75
    },
    perks: [
      '8% off all orders',
      'Free shipping on ₹599+',
      '1.2 points per ₹10 spent',
      'Early access to sales',
      'Priority customer support'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Member',
    minPoints: 2500,
    color: 'bg-yellow-500',
    icon: Award,
    benefits: {
      discountPercentage: 12,
      freeShippingThreshold: 299,
      earlyAccess: true,
      personalShopper: true,
      birthdayBonus: 500,
      referralBonus: 100
    },
    perks: [
      '12% off all orders',
      'Free shipping on ₹299+',
      '1.5 points per ₹10 spent',
      'Personal nutrition consultant',
      'Exclusive products access',
      'Monthly surprise gifts'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Elite',
    minPoints: 5000,
    color: 'bg-purple-600',
    icon: Crown,
    benefits: {
      discountPercentage: 15,
      freeShippingThreshold: 0,
      earlyAccess: true,
      personalShopper: true,
      birthdayBonus: 1000,
      referralBonus: 150
    },
    perks: [
      '15% off all orders',
      'Always free shipping',
      '2 points per ₹10 spent',
      'Dedicated account manager',
      'VIP events and tastings',
      'Custom meal planning',
      'Annual wellness consultation'
    ]
  }
]

// Mock data
const mockMember: LoyaltyMember = {
  id: 'mem_001',
  userId: 'user_001',
  currentPoints: 1850,
  lifetimePoints: 3200,
  currentTier: 'silver',
  nextTier: 'gold',
  pointsToNextTier: 650,
  joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
  lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  streakDays: 15,
  totalOrders: 24,
  totalSpent: 18500,
  referrals: 3,
  achievements: ['first-order', 'referral-master', 'streak-champion']
}

const mockRewards: Reward[] = [
  {
    id: 'rew_001',
    name: '₹100 Off Next Order',
    description: 'Get ₹100 discount on your next purchase',
    pointsCost: 500,
    type: 'discount',
    value: 100,
    category: 'discount',
    availability: 50
  },
  {
    id: 'rew_002',
    name: 'Free Premium Protein Mix',
    description: 'Complimentary 500g premium protein mix',
    pointsCost: 800,
    type: 'product',
    value: 599,
    category: 'product',
    availability: 20
  },
  {
    id: 'rew_003',
    name: 'Free Delivery for 1 Month',
    description: 'Unlimited free delivery for 30 days',
    pointsCost: 1200,
    type: 'shipping',
    value: 300,
    category: 'shipping',
    availability: 25
  },
  {
    id: 'rew_004',
    name: 'VIP Nutrition Consultation',
    description: '1-hour session with certified nutritionist',
    pointsCost: 2000,
    type: 'experience',
    value: 1500,
    category: 'experience',
    availability: 5,
    tierRequired: 'gold'
  }
]

const mockAchievements: Achievement[] = [
  {
    id: 'first-order',
    name: 'First Steps',
    description: 'Complete your first order',
    icon: '🎯',
    points: 100,
    category: 'orders',
    requirement: 1,
    unlocked: true
  },
  {
    id: 'big-spender',
    name: 'Big Spender',
    description: 'Spend ₹10,000 in total',
    icon: '💰',
    points: 500,
    category: 'spending',
    requirement: 10000,
    unlocked: true
  },
  {
    id: 'referral-master',
    name: 'Referral Master',
    description: 'Refer 5 friends successfully',
    icon: '👥',
    points: 300,
    category: 'referrals',
    requirement: 5,
    unlocked: false
  },
  {
    id: 'streak-champion',
    name: 'Streak Champion',
    description: 'Order every month for 6 months',
    icon: '🔥',
    points: 750,
    category: 'streak',
    requirement: 6,
    unlocked: false
  }
]

interface LoyaltyDashboardProps {
  member?: LoyaltyMember
}

export function LoyaltyDashboard({ member = mockMember }: LoyaltyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'achievements' | 'history'>('overview')

  const currentTier = loyaltyTiers.find(tier => tier.id === member.currentTier)
  const nextTier = loyaltyTiers.find(tier => tier.id === member.nextTier)
  const progressPercentage = nextTier 
    ? ((member.currentPoints - currentTier!.minPoints) / (nextTier.minPoints - currentTier!.minPoints)) * 100
    : 100

  const getRewardCategoryIcon = (category: string) => {
    switch (category) {
      case 'discount': return <Coins className="h-4 w-4" />
      case 'product': return <Gift className="h-4 w-4" />
      case 'shipping': return <ShoppingBag className="h-4 w-4" />
      case 'experience': return <Star className="h-4 w-4" />
      default: return <Gift className="h-4 w-4" />
    }
  }

  const canRedeemReward = (reward: Reward) => {
    if (member.currentPoints < reward.pointsCost) return false
    if (reward.tierRequired && !loyaltyTiers.find(t => t.id === reward.tierRequired && loyaltyTiers.findIndex(tier => tier.id === member.currentTier) >= loyaltyTiers.findIndex(tier => tier.id === reward.tierRequired))) return false
    return true
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Trophy },
    { id: 'rewards', name: 'Rewards', icon: Gift },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'history', name: 'History', icon: Clock }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Tier Status */}
      <Card className="p-6 bg-gradient-to-r from-earth-50 to-primary-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className={cn(
              'p-4 rounded-full text-white',
              currentTier?.color
            )}>
              {currentTier?.icon && <currentTier.icon className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-earth-800">
                {currentTier?.name}
              </h1>
              <p className="text-earth-600">
                {member.currentPoints.toLocaleString()} points available
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-earth-800">{member.totalOrders}</div>
              <div className="text-xs text-earth-600">Orders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-earth-800">{formatPrice(member.totalSpent)}</div>
              <div className="text-xs text-earth-600">Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-earth-800">{member.referrals}</div>
              <div className="text-xs text-earth-600">Referrals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-earth-800">{member.streakDays}</div>
              <div className="text-xs text-earth-600">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-earth-800">
                Progress to {nextTier.name}
              </span>
              <span className="text-sm text-earth-600">
                {member.pointsToNextTier} points to go
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-earth-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-earth-800 text-earth-800'
                    : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Current Tier Benefits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-earth-800 mb-4 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Your Benefits
              </h3>
              <div className="space-y-3">
                {currentTier?.perks.map((perk, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-earth-700">{perk}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-earth-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                  <Share2 className="h-4 w-4" />
                  <span>Refer Friend</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                  <Gift className="h-4 w-4" />
                  <span>View Rewards</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                  <TrendingUp className="h-4 w-4" />
                  <span>Tier Progress</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                  <Users className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-earth-800 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Coins className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-earth-800">Earned 150 points</p>
                      <p className="text-sm text-earth-600">Order #TF-12345 • 2 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+150</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-earth-800">Achievement unlocked</p>
                      <p className="text-sm text-earth-600">Big Spender • 5 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">+500</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRewards.map((reward) => (
                <Card 
                  key={reward.id} 
                  className={cn(
                    'p-6 transition-all duration-200 cursor-pointer hover:shadow-lg',
                    canRedeemReward(reward) ? 'border-green-200' : 'border-earth-200 opacity-75'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getRewardCategoryIcon(reward.category)}
                      <h4 className="font-semibold text-earth-800">{reward.name}</h4>
                    </div>
                    {canRedeemReward(reward) ? (
                      <Unlock className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-earth-400" />
                    )}
                  </div>
                  
                  <p className="text-sm text-earth-600 mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-earth-600" />
                      <span className="font-bold text-earth-800">{reward.pointsCost}</span>
                    </div>
                    <Badge variant="outline">{reward.availability} left</Badge>
                  </div>
                  
                  {reward.tierRequired && (
                    <Badge className="mb-3" variant="secondary">
                      {loyaltyTiers.find(t => t.id === reward.tierRequired)?.name} Required
                    </Badge>
                  )}
                  
                  <Button 
                    className="w-full"
                    disabled={!canRedeemReward(reward)}
                    variant={canRedeemReward(reward) ? "default" : "outline"}
                  >
                    {canRedeemReward(reward) ? 'Redeem' : 'Not Available'}
                  </Button>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={cn(
                    'p-6 transition-all duration-200',
                    achievement.unlocked ? 'border-gold bg-yellow-50' : 'border-earth-200'
                  )}
                >
                  <div className="text-center">
                    <div className={cn(
                      'text-4xl mb-3',
                      achievement.unlocked ? 'grayscale-0' : 'grayscale'
                    )}>
                      {achievement.icon}
                    </div>
                    <h4 className="font-semibold text-earth-800 mb-2">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-earth-600 mb-4">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <Coins className="h-4 w-4 text-earth-600" />
                      <span className="font-bold text-earth-800">
                        {achievement.points} points
                      </span>
                    </div>
                    {achievement.unlocked ? (
                      <Badge className="mt-3 bg-green-100 text-green-800">
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge className="mt-3" variant="outline">
                        Locked
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-earth-800 mb-6">
                Points History
              </h3>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        i % 2 === 0 ? 'bg-green-100' : 'bg-red-100'
                      )}>
                        {i % 2 === 0 ? (
                          <Coins className="h-4 w-4 text-green-600" />
                        ) : (
                          <Gift className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-earth-800">
                          {i % 2 === 0 ? 'Points earned from order' : 'Points redeemed for reward'}
                        </p>
                        <p className="text-sm text-earth-600">
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        'font-bold',
                        i % 2 === 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {i % 2 === 0 ? '+' : '-'}{Math.floor(Math.random() * 500 + 50)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}