'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

// Types
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  basePrice: number
  discount: number
  minProducts: number
  maxProducts: number
  features: string[]
  benefits: {
    freeShipping: boolean
    prioritySupport: boolean
    exclusiveProducts: boolean
    nutritionConsults: boolean
    flexibleScheduling: boolean
  }
  popular?: boolean
  customizable: boolean
}

export interface Subscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'paused' | 'cancelled' | 'pending'
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  nextDelivery: Date
  lastDelivery?: Date
  products: Array<{ product: Product; quantity: number }>
  totalPrice: number
  discount: number
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: 'card' | 'upi' | 'wallet'
    last4: string
    brand: string
  }
  preferences: {
    dietaryRestrictions: string[]
    nutritionGoal: string
    specialInstructions: string
    allergies: string[]
  }
  createdAt: Date
  updatedAt: Date
  upcomingSkips: Date[]
  billingHistory: BillingRecord[]
  deliveryHistory: DeliveryRecord[]
}

export interface BillingRecord {
  id: string
  subscriptionId: string
  amount: number
  date: Date
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  invoiceUrl?: string
}

export interface DeliveryRecord {
  id: string
  subscriptionId: string
  deliveryDate: Date
  status: 'scheduled' | 'preparing' | 'shipped' | 'delivered' | 'failed'
  products: Array<{ product: Product; quantity: number }>
  totalPrice: number
  trackingNumber?: string
  courierService?: string
  deliveryNotes?: string
}

// State and Actions
interface SubscriptionState {
  subscriptions: Subscription[]
  activeSubscription: Subscription | null
  loading: boolean
  error: string | null
}

type SubscriptionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
  | { type: 'SET_ACTIVE_SUBSCRIPTION'; payload: Subscription | null }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: { id: string; updates: Partial<Subscription> } }
  | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
  | { type: 'PAUSE_SUBSCRIPTION'; payload: string }
  | { type: 'RESUME_SUBSCRIPTION'; payload: string }
  | { type: 'CANCEL_SUBSCRIPTION'; payload: string }
  | { type: 'UPDATE_PRODUCTS'; payload: { id: string; products: Array<{ product: Product; quantity: number }> } }
  | { type: 'UPDATE_FREQUENCY'; payload: { id: string; frequency: string } }
  | { type: 'SKIP_DELIVERY'; payload: { id: string; date: Date } }
  | { type: 'UPDATE_PREFERENCES'; payload: { id: string; preferences: Partial<Subscription['preferences']> } }

const initialState: SubscriptionState = {
  subscriptions: [],
  activeSubscription: null,
  loading: false,
  error: null
}

// Reducer
function subscriptionReducer(state: SubscriptionState, action: SubscriptionAction): SubscriptionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_SUBSCRIPTIONS':
      return { 
        ...state, 
        subscriptions: action.payload,
        activeSubscription: action.payload.find(s => s.status === 'active') || null,
        loading: false 
      }

    case 'SET_ACTIVE_SUBSCRIPTION':
      return { ...state, activeSubscription: action.payload }

    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
        activeSubscription: action.payload.status === 'active' ? action.payload : state.activeSubscription
      }

    case 'UPDATE_SUBSCRIPTION': {
      const updatedSubscriptions = state.subscriptions.map(sub =>
        sub.id === action.payload.id 
          ? { ...sub, ...action.payload.updates, updatedAt: new Date() }
          : sub
      )
      return {
        ...state,
        subscriptions: updatedSubscriptions,
        activeSubscription: state.activeSubscription?.id === action.payload.id
          ? { ...state.activeSubscription, ...action.payload.updates, updatedAt: new Date() }
          : state.activeSubscription
      }
    }

    case 'REMOVE_SUBSCRIPTION': {
      const filteredSubscriptions = state.subscriptions.filter(sub => sub.id !== action.payload)
      return {
        ...state,
        subscriptions: filteredSubscriptions,
        activeSubscription: state.activeSubscription?.id === action.payload ? null : state.activeSubscription
      }
    }

    case 'PAUSE_SUBSCRIPTION':
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { id: action.payload, updates: { status: 'paused' } }
      })

    case 'RESUME_SUBSCRIPTION':
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { id: action.payload, updates: { status: 'active' } }
      })

    case 'CANCEL_SUBSCRIPTION':
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { id: action.payload, updates: { status: 'cancelled' } }
      })

    case 'UPDATE_PRODUCTS':
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { 
          id: action.payload.id, 
          updates: { 
            products: action.payload.products,
            totalPrice: action.payload.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          } 
        }
      })

    case 'UPDATE_FREQUENCY':
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { id: action.payload.id, updates: { frequency: action.payload.frequency as any } }
      })

    case 'SKIP_DELIVERY': {
      const subscription = state.subscriptions.find(s => s.id === action.payload.id)
      if (!subscription) return state
      
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { 
          id: action.payload.id, 
          updates: { 
            upcomingSkips: [...subscription.upcomingSkips, action.payload.date] 
          } 
        }
      })
    }

    case 'UPDATE_PREFERENCES':
      // Ensure preferences object includes all required fields
      const completePreferences = {
        dietaryRestrictions: action.payload.preferences.dietaryRestrictions || [],
        nutritionGoal: action.payload.preferences.nutritionGoal || '',
        specialInstructions: action.payload.preferences.specialInstructions || '',
        allergies: action.payload.preferences.allergies || [],
      }
      return subscriptionReducer(state, {
        type: 'UPDATE_SUBSCRIPTION',
        payload: { 
          id: action.payload.id, 
          updates: { 
            preferences: completePreferences 
          } 
        }
      })

    default:
      return state
  }
}

// Context
interface SubscriptionContextType {
  state: SubscriptionState
  
  // Subscription Management
  createSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>
  deleteSubscription: (id: string) => Promise<void>
  
  // Subscription Actions
  pauseSubscription: (id: string) => Promise<void>
  resumeSubscription: (id: string) => Promise<void>
  cancelSubscription: (id: string) => Promise<void>
  
  // Product Management
  updateProducts: (id: string, products: Array<{ product: Product; quantity: number }>) => Promise<void>
  
  // Scheduling
  updateFrequency: (id: string, frequency: string) => Promise<void>
  skipNextDelivery: (id: string) => Promise<void>
  skipDeliveryDate: (id: string, date: Date) => Promise<void>
  
  // Preferences
  updatePreferences: (id: string, preferences: Partial<Subscription['preferences']>) => Promise<void>
  updateDeliveryAddress: (id: string, address: Subscription['deliveryAddress']) => Promise<void>
  updatePaymentMethod: (id: string, paymentMethod: Subscription['paymentMethod']) => Promise<void>
  
  // Data Fetching
  fetchSubscriptions: () => Promise<void>
  fetchSubscription: (id: string) => Promise<Subscription | null>
  
  // Utility
  getNextDeliveryDate: (subscription: Subscription) => Date
  calculateSavings: (subscription: Subscription) => number
  isEligibleForSkip: (subscription: Subscription, date: Date) => boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Provider Component
interface SubscriptionProviderProps {
  children: ReactNode
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState)

  // Load subscriptions on mount
  useEffect(() => {
    fetchSubscriptions()
  }, [])

  // API Functions (mock implementations)
  const createSubscription = async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newSubscription: Subscription = {
        ...subscriptionData,
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      dispatch({ type: 'ADD_SUBSCRIPTION', payload: newSubscription })
      
      // Save to localStorage for demo
      const stored = localStorage.getItem('tishya_subscriptions')
      const subscriptions = stored ? JSON.parse(stored) : []
      subscriptions.push(newSubscription)
      localStorage.setItem('tishya_subscriptions', JSON.stringify(subscriptions))
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create subscription' })
    }
  }

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: { id, updates } })
      
      // Update localStorage
      const stored = localStorage.getItem('tishya_subscriptions')
      if (stored) {
        const subscriptions = JSON.parse(stored).map((sub: Subscription) =>
          sub.id === id ? { ...sub, ...updates, updatedAt: new Date() } : sub
        )
        localStorage.setItem('tishya_subscriptions', JSON.stringify(subscriptions))
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update subscription' })
    }
  }

  const deleteSubscription = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: id })
      
      // Update localStorage
      const stored = localStorage.getItem('tishya_subscriptions')
      if (stored) {
        const subscriptions = JSON.parse(stored).filter((sub: Subscription) => sub.id !== id)
        localStorage.setItem('tishya_subscriptions', JSON.stringify(subscriptions))
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete subscription' })
    }
  }

  const pauseSubscription = async (id: string) => {
    await updateSubscription(id, { status: 'paused' })
  }

  const resumeSubscription = async (id: string) => {
    await updateSubscription(id, { status: 'active' })
  }

  const cancelSubscription = async (id: string) => {
    await updateSubscription(id, { status: 'cancelled' })
  }

  const updateProducts = async (id: string, products: Array<{ product: Product; quantity: number }>) => {
    const totalPrice = products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    await updateSubscription(id, { products, totalPrice })
  }

  const updateFrequency = async (id: string, frequency: string) => {
    await updateSubscription(id, { frequency: frequency as any })
  }

  const skipNextDelivery = async (id: string) => {
    const subscription = state.subscriptions.find(s => s.id === id)
    if (subscription) {
      const nextDeliveryDate = getNextDeliveryDate(subscription)
      await skipDeliveryDate(id, nextDeliveryDate)
    }
  }

  const skipDeliveryDate = async (id: string, date: Date) => {
    dispatch({ type: 'SKIP_DELIVERY', payload: { id, date } })
  }

  const updatePreferences = async (id: string, preferences: Partial<Subscription['preferences']>) => {
    // Ensure preferences object includes all required fields
    const completePreferences = {
      dietaryRestrictions: preferences.dietaryRestrictions || [],
      nutritionGoal: preferences.nutritionGoal || '',
      specialInstructions: preferences.specialInstructions || '',
      allergies: preferences.allergies || [],
    }
    await updateSubscription(id, { preferences: completePreferences })
  }

  const updateDeliveryAddress = async (id: string, address: Subscription['deliveryAddress']) => {
    await updateSubscription(id, { deliveryAddress: address })
  }

  const updatePaymentMethod = async (id: string, paymentMethod: Subscription['paymentMethod']) => {
    await updateSubscription(id, { paymentMethod })
  }

  const fetchSubscriptions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Load from localStorage for demo
      const stored = localStorage.getItem('tishya_subscriptions')
      const subscriptions = stored ? JSON.parse(stored) : []
      
      dispatch({ type: 'SET_SUBSCRIPTIONS', payload: subscriptions })
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch subscriptions' })
    }
  }

  const fetchSubscription = async (id: string): Promise<Subscription | null> => {
    const stored = localStorage.getItem('tishya_subscriptions')
    if (stored) {
      const subscriptions = JSON.parse(stored)
      return subscriptions.find((sub: Subscription) => sub.id === id) || null
    }
    return null
  }

  // Utility Functions
  const getNextDeliveryDate = (subscription: Subscription): Date => {
    const lastDelivery = subscription.lastDelivery || subscription.createdAt
    const nextDate = new Date(lastDelivery)
    
    switch (subscription.frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14)
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3)
        break
    }
    
    return nextDate
  }

  const calculateSavings = (subscription: Subscription): number => {
    const regularPrice = subscription.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    return regularPrice * (subscription.discount / 100)
  }

  const isEligibleForSkip = (subscription: Subscription, date: Date): boolean => {
    const daysDiff = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff >= 2 // Must be at least 2 days in advance
  }

  const contextValue: SubscriptionContextType = {
    state,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    updateProducts,
    updateFrequency,
    skipNextDelivery,
    skipDeliveryDate,
    updatePreferences,
    updateDeliveryAddress,
    updatePaymentMethod,
    fetchSubscriptions,
    fetchSubscription,
    getNextDeliveryDate,
    calculateSavings,
    isEligibleForSkip
  }

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// Hook
export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}