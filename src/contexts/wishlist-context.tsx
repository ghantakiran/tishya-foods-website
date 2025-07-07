'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/types/product'

interface WishlistState {
  items: Product[]
  isLoading: boolean
  error: string | null
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  moveToCart: (productId: string) => void
}

type WishlistAction = 
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_WISHLIST'; payload: Product[] }

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        error: null
      }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        error: null
      }

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
        error: null
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      }

    default:
      return state
  }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('tishya-wishlist')
      if (savedWishlist) {
        const items = JSON.parse(savedWishlist)
        dispatch({ type: 'LOAD_WISHLIST', payload: items })
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wishlist' })
    }
  }, [])

  // Save wishlist to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem('tishya-wishlist', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  }, [state.items])

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
    
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_wishlist', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category.name,
          price: product.price
        }]
      })
    }
  }

  const removeFromWishlist = (productId: string) => {
    const product = state.items.find(item => item.id === productId)
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
    
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag && product) {
      window.gtag('event', 'remove_from_wishlist', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category.name,
          price: product.price
        }]
      })
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const moveToCart = (productId: string) => {
    // This would integrate with cart context
    // For now, just remove from wishlist
    removeFromWishlist(productId)
  }

  const contextValue: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart
  }

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

