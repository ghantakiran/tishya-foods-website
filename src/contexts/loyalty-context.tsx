'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

// Types
export interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  color: string
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
  referralCode: string
}

export interface PointsTransaction {
  id: string
  memberId: string
  type: 'earned' | 'redeemed' | 'expired' | 'bonus' | 'referral'
  points: number
  reason: string
  orderId?: string
  referralId?: string
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
  unlockedAt?: Date
}

export interface Referral {
  id: string
  referrerId: string
  friendEmail: string
  friendName?: string
  status: 'pending' | 'registered' | 'first_order' | 'completed'
  dateReferred: Date
  dateCompleted?: Date
  bonusEarned: number
  friendBonus: number
}

// State
interface LoyaltyState {
  member: LoyaltyMember | null
  tiers: LoyaltyTier[]
  transactions: PointsTransaction[]
  rewards: Reward[]
  achievements: Achievement[]
  referrals: Referral[]
  loading: boolean
  error: string | null
}

// Actions
type LoyaltyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MEMBER'; payload: LoyaltyMember | null }
  | { type: 'SET_TRANSACTIONS'; payload: PointsTransaction[] }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'SET_REFERRALS'; payload: Referral[] }
  | { type: 'ADD_POINTS'; payload: { points: number; reason: string; orderId?: string } }
  | { type: 'REDEEM_POINTS'; payload: { points: number; rewardId: string } }
  | { type: 'UPDATE_TIER'; payload: string }
  | { type: 'ADD_REFERRAL'; payload: Referral }
  | { type: 'UPDATE_REFERRAL'; payload: { id: string; updates: Partial<Referral> } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_STREAK'; payload: number }

const initialState: LoyaltyState = {
  member: null,
  tiers: [],
  transactions: [],
  rewards: [],
  achievements: [],
  referrals: [],
  loading: false,
  error: null
}

// Loyalty Tiers Data
const defaultTiers: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Member',
    minPoints: 0,
    color: 'bg-amber-600',
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

// Reducer
function loyaltyReducer(state: LoyaltyState, action: LoyaltyAction): LoyaltyState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_MEMBER':
      return { ...state, member: action.payload, loading: false }

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }

    case 'SET_REWARDS':
      return { ...state, rewards: action.payload }

    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload }

    case 'SET_REFERRALS':
      return { ...state, referrals: action.payload }

    case 'ADD_POINTS': {
      if (!state.member) return state
      
      const newPoints = state.member.currentPoints + action.payload.points
      const newLifetimePoints = state.member.lifetimePoints + action.payload.points
      
      // Check for tier upgrade
      const newTier = calculateTier(newPoints, state.tiers)
      const nextTier = getNextTier(newTier.id, state.tiers)
      
      const transaction: PointsTransaction = {
        id: 'tx_' + Math.random().toString(36).substr(2, 9),
        memberId: state.member.id,
        type: 'earned',
        points: action.payload.points,
        reason: action.payload.reason,
        orderId: action.payload.orderId,
        date: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }

      return {
        ...state,
        member: {
          ...state.member,
          currentPoints: newPoints,
          lifetimePoints: newLifetimePoints,
          currentTier: newTier.id,
          nextTier: nextTier?.id,
          pointsToNextTier: nextTier ? nextTier.minPoints - newPoints : 0,
          lastActivity: new Date()
        },
        transactions: [transaction, ...state.transactions]
      }
    }

    case 'REDEEM_POINTS': {
      if (!state.member) return state
      
      const newPoints = state.member.currentPoints - action.payload.points
      
      const transaction: PointsTransaction = {
        id: 'tx_' + Math.random().toString(36).substr(2, 9),
        memberId: state.member.id,
        type: 'redeemed',
        points: action.payload.points,
        reason: `Redeemed reward: ${action.payload.rewardId}`,
        date: new Date()
      }

      return {
        ...state,
        member: {
          ...state.member,
          currentPoints: newPoints,
          lastActivity: new Date()
        },
        transactions: [transaction, ...state.transactions]
      }
    }

    case 'UPDATE_TIER':
      return state.member ? {
        ...state,
        member: {
          ...state.member,
          currentTier: action.payload
        }
      } : state

    case 'ADD_REFERRAL':
      return {
        ...state,
        referrals: [action.payload, ...state.referrals]
      }

    case 'UPDATE_REFERRAL': {
      const updatedReferrals = state.referrals.map(ref =>
        ref.id === action.payload.id ? { ...ref, ...action.payload.updates } : ref
      )
      return {
        ...state,
        referrals: updatedReferrals
      }
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const updatedAchievements = state.achievements.map(achievement =>
        achievement.id === action.payload 
          ? { ...achievement, unlocked: true, unlockedAt: new Date() }
          : achievement
      )
      return {
        ...state,
        achievements: updatedAchievements
      }
    }

    case 'UPDATE_STREAK':
      return state.member ? {
        ...state,
        member: {
          ...state.member,
          streakDays: action.payload
        }
      } : state

    default:
      return state
  }
}

// Helper functions
function calculateTier(points: number, tiers: LoyaltyTier[]): LoyaltyTier {
  const sortedTiers = [...tiers].sort((a, b) => b.minPoints - a.minPoints)
  return sortedTiers.find(tier => points >= tier.minPoints) || tiers[0]
}

function getNextTier(currentTierId: string, tiers: LoyaltyTier[]): LoyaltyTier | null {
  const currentTierIndex = tiers.findIndex(tier => tier.id === currentTierId)
  return currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null
}

// Context
interface LoyaltyContextType {
  state: LoyaltyState
  
  // Member Management
  initializeMember: (userId: string) => Promise<void>
  getMember: () => LoyaltyMember | null
  
  // Points Management
  addPoints: (points: number, reason: string, orderId?: string) => Promise<void>
  redeemReward: (rewardId: string, pointsCost: number) => Promise<void>
  getPointsBalance: () => number
  
  // Transactions
  getTransactionHistory: () => PointsTransaction[]
  
  // Rewards
  getAvailableRewards: () => Reward[]
  canRedeemReward: (reward: Reward) => boolean
  
  // Achievements
  getAchievements: () => Achievement[]
  checkAndUnlockAchievements: () => Promise<void>
  
  // Referrals
  createReferral: (friendEmail: string, friendName?: string) => Promise<Referral>
  updateReferralStatus: (referralId: string, status: Referral['status']) => Promise<void>
  getReferrals: () => Referral[]
  getReferralStats: () => {
    total: number
    successful: number
    pending: number
    totalEarned: number
  }
  
  // Tiers
  getCurrentTier: () => LoyaltyTier | null
  getNextTier: () => LoyaltyTier | null
  getProgressToNextTier: () => number
  
  // Utilities
  calculatePointsForOrder: (orderAmount: number) => number
  isEligibleForReward: (rewardId: string) => boolean
  updateStreak: () => Promise<void>
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined)

// Provider Component
interface LoyaltyProviderProps {
  children: ReactNode
}

export function LoyaltyProvider({ children }: LoyaltyProviderProps) {
  const [state, dispatch] = useReducer(loyaltyReducer, {
    ...initialState,
    tiers: defaultTiers
  })

  // Initialize member data on mount
  useEffect(() => {
    // In a real app, you'd get the user ID from auth context
    // initializeMember('current-user-id')
  }, [])

  // API Functions
  const initializeMember = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Check if member exists in localStorage
      const stored = localStorage.getItem(`loyalty_member_${userId}`)
      
      if (stored) {
        const member = JSON.parse(stored)
        dispatch({ type: 'SET_MEMBER', payload: member })
      } else {
        // Create new member
        const newMember: LoyaltyMember = {
          id: 'mem_' + Math.random().toString(36).substr(2, 9),
          userId,
          currentPoints: 0,
          lifetimePoints: 0,
          currentTier: 'bronze',
          pointsToNextTier: 1000,
          joinDate: new Date(),
          lastActivity: new Date(),
          streakDays: 0,
          totalOrders: 0,
          totalSpent: 0,
          referrals: 0,
          achievements: [],
          referralCode: `TISHYA-${userId.toUpperCase().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        }
        
        dispatch({ type: 'SET_MEMBER', payload: newMember })
        localStorage.setItem(`loyalty_member_${userId}`, JSON.stringify(newMember))
      }
      
      // Load related data
      loadTransactions(userId)
      loadAchievements(userId)
      loadReferrals(userId)
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize loyalty member' })
    }
  }

  const loadTransactions = (userId: string) => {
    const stored = localStorage.getItem(`loyalty_transactions_${userId}`)
    const transactions = stored ? JSON.parse(stored) : []
    dispatch({ type: 'SET_TRANSACTIONS', payload: transactions })
  }

  const loadAchievements = (userId: string) => {
    // Default achievements - in real app, load from API
    const defaultAchievements: Achievement[] = [
      {
        id: 'first-order',
        name: 'First Steps',
        description: 'Complete your first order',
        icon: '🎯',
        points: 100,
        category: 'orders',
        requirement: 1,
        unlocked: false
      },
      {
        id: 'big-spender',
        name: 'Big Spender',
        description: 'Spend ₹10,000 in total',
        icon: '💰',
        points: 500,
        category: 'spending',
        requirement: 10000,
        unlocked: false
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
      }
    ]
    
    const stored = localStorage.getItem(`loyalty_achievements_${userId}`)
    const achievements = stored ? JSON.parse(stored) : defaultAchievements
    dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements })
  }

  const loadReferrals = (userId: string) => {
    const stored = localStorage.getItem(`loyalty_referrals_${userId}`)
    const referrals = stored ? JSON.parse(stored) : []
    dispatch({ type: 'SET_REFERRALS', payload: referrals })
  }

  const addPoints = async (points: number, reason: string, orderId?: string) => {
    if (!state.member) return
    
    dispatch({ type: 'ADD_POINTS', payload: { points, reason, orderId } })
    
    // Update localStorage
    const updatedMember = {
      ...state.member,
      currentPoints: state.member.currentPoints + points,
      lifetimePoints: state.member.lifetimePoints + points,
      lastActivity: new Date()
    }
    localStorage.setItem(`loyalty_member_${state.member.userId}`, JSON.stringify(updatedMember))
    
    // Check for achievements
    await checkAndUnlockAchievements()
  }

  const redeemReward = async (rewardId: string, pointsCost: number) => {
    if (!state.member || state.member.currentPoints < pointsCost) {
      throw new Error('Insufficient points')
    }
    
    dispatch({ type: 'REDEEM_POINTS', payload: { points: pointsCost, rewardId } })
    
    // Update localStorage
    const updatedMember = {
      ...state.member,
      currentPoints: state.member.currentPoints - pointsCost,
      lastActivity: new Date()
    }
    localStorage.setItem(`loyalty_member_${state.member.userId}`, JSON.stringify(updatedMember))
  }

  const createReferral = async (friendEmail: string, friendName?: string): Promise<Referral> => {
    if (!state.member) throw new Error('No member found')
    
    const referral: Referral = {
      id: 'ref_' + Math.random().toString(36).substr(2, 9),
      referrerId: state.member.id,
      friendEmail,
      friendName,
      status: 'pending',
      dateReferred: new Date(),
      bonusEarned: 0,
      friendBonus: 200
    }
    
    dispatch({ type: 'ADD_REFERRAL', payload: referral })
    
    // Update localStorage
    const updatedReferrals = [referral, ...state.referrals]
    localStorage.setItem(`loyalty_referrals_${state.member.userId}`, JSON.stringify(updatedReferrals))
    
    return referral
  }

  const updateReferralStatus = async (referralId: string, status: Referral['status']) => {
    const referral = state.referrals.find(ref => ref.id === referralId)
    if (!referral || !state.member) return
    
    let bonusEarned = 0
    
    // Calculate bonus based on status and tier
    if (status === 'completed') {
      const currentTier = state.tiers.find(tier => tier.id === state.member!.currentTier)
      bonusEarned = currentTier?.benefits.referralBonus || 50
    }
    
    const updates: Partial<Referral> = {
      status,
      bonusEarned,
      dateCompleted: status === 'completed' ? new Date() : undefined
    }
    
    dispatch({ type: 'UPDATE_REFERRAL', payload: { id: referralId, updates } })
    
    // Award points if completed
    if (status === 'completed' && bonusEarned > 0) {
      await addPoints(bonusEarned, `Referral bonus: ${referral.friendEmail}`, referralId)
    }
  }

  const checkAndUnlockAchievements = async () => {
    if (!state.member) return
    
    state.achievements.forEach(achievement => {
      if (achievement.unlocked) return
      
      let qualified = false
      
      switch (achievement.category) {
        case 'orders':
          qualified = state.member!.totalOrders >= achievement.requirement
          break
        case 'spending':
          qualified = state.member!.totalSpent >= achievement.requirement
          break
        case 'referrals':
          const successfulReferrals = state.referrals.filter(ref => ref.status === 'completed').length
          qualified = successfulReferrals >= achievement.requirement
          break
        case 'streak':
          qualified = state.member!.streakDays >= achievement.requirement
          break
      }
      
      if (qualified) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id })
        addPoints(achievement.points, `Achievement unlocked: ${achievement.name}`)
      }
    })
  }

  const updateStreak = async () => {
    if (!state.member) return
    
    const lastActivity = new Date(state.member.lastActivity)
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    
    let newStreak = state.member.streakDays
    
    if (daysDiff === 1) {
      // Consecutive day - increase streak
      newStreak += 1
    } else if (daysDiff > 1) {
      // Missed days - reset streak
      newStreak = 1
    }
    // Same day - keep current streak
    
    dispatch({ type: 'UPDATE_STREAK', payload: newStreak })
  }

  // Utility functions
  const getMember = () => state.member
  const getPointsBalance = () => state.member?.currentPoints || 0
  const getTransactionHistory = () => state.transactions
  const getAvailableRewards = () => state.rewards
  const getAchievements = () => state.achievements
  const getReferrals = () => state.referrals

  const canRedeemReward = (reward: Reward) => {
    if (!state.member) return false
    if (state.member.currentPoints < reward.pointsCost) return false
    if (reward.tierRequired) {
      const currentTierIndex = state.tiers.findIndex(tier => tier.id === state.member!.currentTier)
      const requiredTierIndex = state.tiers.findIndex(tier => tier.id === reward.tierRequired)
      if (currentTierIndex < requiredTierIndex) return false
    }
    return true
  }

  const getCurrentTier = () => state.tiers.find(tier => tier.id === state.member?.currentTier) || null
  const getNextTier = () => {
    const currentTierIndex = state.tiers.findIndex(tier => tier.id === state.member?.currentTier)
    return currentTierIndex < state.tiers.length - 1 ? state.tiers[currentTierIndex + 1] : null
  }

  const getProgressToNextTier = () => {
    const currentTier = getCurrentTier()
    const nextTier = getNextTier()
    if (!currentTier || !nextTier || !state.member) return 100
    
    const progress = ((state.member.currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const calculatePointsForOrder = (orderAmount: number) => {
    const currentTier = getCurrentTier()
    if (!currentTier) return Math.floor(orderAmount / 10)
    
    // Different point rates based on tier
    const multipliers = {
      bronze: 1,
      silver: 1.2,
      gold: 1.5,
      platinum: 2
    }
    
    const multiplier = multipliers[currentTier.id as keyof typeof multipliers] || 1
    return Math.floor((orderAmount / 10) * multiplier)
  }

  const isEligibleForReward = (rewardId: string) => {
    const reward = state.rewards.find(r => r.id === rewardId)
    return reward ? canRedeemReward(reward) : false
  }

  const getReferralStats = () => {
    const total = state.referrals.length
    const successful = state.referrals.filter(ref => ref.status === 'completed').length
    const pending = state.referrals.filter(ref => ref.status === 'pending').length
    const totalEarned = state.referrals.reduce((sum, ref) => sum + ref.bonusEarned, 0)
    
    return { total, successful, pending, totalEarned }
  }

  const contextValue: LoyaltyContextType = {
    state,
    initializeMember,
    getMember,
    addPoints,
    redeemReward,
    getPointsBalance,
    getTransactionHistory,
    getAvailableRewards,
    canRedeemReward,
    getAchievements,
    checkAndUnlockAchievements,
    createReferral,
    updateReferralStatus,
    getReferrals,
    getReferralStats,
    getCurrentTier,
    getNextTier,
    getProgressToNextTier,
    calculatePointsForOrder,
    isEligibleForReward,
    updateStreak
  }

  return (
    <LoyaltyContext.Provider value={contextValue}>
      {children}
    </LoyaltyContext.Provider>
  )
}

// Hook
export function useLoyalty() {
  const context = useContext(LoyaltyContext)
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider')
  }
  return context
}