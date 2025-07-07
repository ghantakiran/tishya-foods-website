'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Cart, CartItem, CartState, CartActions } from '@/types/cart'
import { useAnalytics } from '@/hooks/use-analytics'

type CartContextType = CartState & CartActions
export type CartContextValue = CartContextType & {
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined)

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: string }
  | { type: 'REMOVE_COUPON'; payload: string }

const createEmptyCart = (): Cart => ({
  id: crypto.randomUUID(),
  items: [],
  totalItems: 0,
  totalPrice: 0,
  discountAmount: 0,
  shippingCost: 0,
  finalTotal: 0,
  appliedCoupons: [],
})

const calculateCartTotals = (cart: Cart): Cart => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate shipping (free shipping over ₹500)
  const shippingCost = totalPrice >= 500 ? 0 : 50
  
  // Apply discount logic (can be enhanced with coupon validation)
  let discountAmount = 0
  if (cart.appliedCoupons.includes('WELCOME10')) {
    discountAmount = Math.min(totalPrice * 0.1, 100) // 10% off, max ₹100
  }
  
  const finalTotal = totalPrice - discountAmount + shippingCost

  return {
    ...cart,
    totalItems,
    totalPrice,
    discountAmount,
    shippingCost,
    finalTotal,
  }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_CART':
      return { ...state, cart: calculateCartTotals(action.payload) }
    
    case 'ADD_ITEM': {
      if (!state.cart) return state
      
      const existingItemIndex = state.cart.items.findIndex(
        item => item.productId === action.payload.productId &&
                JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
      )
      
      let updatedItems
      if (existingItemIndex >= 0) {
        updatedItems = [...state.cart.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
      } else {
        const newItem: CartItem = {
          ...action.payload,
          id: crypto.randomUUID(),
        }
        updatedItems = [...state.cart.items, newItem]
      }
      
      const updatedCart = calculateCartTotals({
        ...state.cart,
        items: updatedItems,
      })
      
      return { ...state, cart: updatedCart }
    }
    
    case 'REMOVE_ITEM': {
      if (!state.cart) return state
      
      const updatedItems = state.cart.items.filter(item => item.id !== action.payload)
      const updatedCart = calculateCartTotals({
        ...state.cart,
        items: updatedItems,
      })
      
      return { ...state, cart: updatedCart }
    }
    
    case 'UPDATE_QUANTITY': {
      if (!state.cart) return state
      
      const updatedItems = state.cart.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      
      const updatedCart = calculateCartTotals({
        ...state.cart,
        items: updatedItems,
      })
      
      return { ...state, cart: updatedCart }
    }
    
    case 'CLEAR_CART':
      return { ...state, cart: createEmptyCart() }
    
    case 'APPLY_COUPON': {
      if (!state.cart) return state
      
      if (state.cart.appliedCoupons.includes(action.payload)) {
        return state
      }
      
      const updatedCart = calculateCartTotals({
        ...state.cart,
        appliedCoupons: [...state.cart.appliedCoupons, action.payload],
      })
      
      return { ...state, cart: updatedCart }
    }
    
    case 'REMOVE_COUPON': {
      if (!state.cart) return state
      
      const updatedCart = calculateCartTotals({
        ...state.cart,
        appliedCoupons: state.cart.appliedCoupons.filter(code => code !== action.payload),
      })
      
      return { ...state, cart: updatedCart }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
}

function CartProviderInner({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const analytics = useAnalytics()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('tishya-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'SET_CART', payload: parsedCart })
      } catch {
        dispatch({ type: 'SET_CART', payload: createEmptyCart() })
      }
    } else {
      dispatch({ type: 'SET_CART', payload: createEmptyCart() })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.cart) {
      localStorage.setItem('tishya-cart', JSON.stringify(state.cart))
    }
  }, [state.cart])

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success(`${item.name} added to cart!`)
    
    // Track add to cart event
    analytics.trackProductAddToCart(
      item.productId,
      item.name,
      'Unknown',
      item.price,
      item.quantity
    )
  }

  const removeItem = (itemId: string) => {
    // Find the item before removing to track analytics
    const item = state.cart?.items.find(i => i.id === itemId)
    
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
    toast.success('Item removed from cart')
    
    // Track remove from cart event
    if (item) {
      analytics.trackProductRemoveFromCart(
        item.productId,
        item.name,
        'Unknown',
        item.price,
        item.quantity
      )
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
    
    // Track cart clear event
    analytics.trackUserAction('click', {
      element_type: 'button',
      additional_data: {
        action: 'clear_cart',
        items_count: state.cart?.items.length || 0
      }
    })
  }

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call for coupon validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simple coupon validation (can be enhanced with API)
      const validCoupons = ['WELCOME10', 'HEALTH20', 'FIRST15']
      
      if (validCoupons.includes(couponCode.toUpperCase())) {
        dispatch({ type: 'APPLY_COUPON', payload: couponCode.toUpperCase() })
        toast.success('Coupon applied successfully!')
        
        // Track coupon application
        analytics.trackUserAction('form_submit', {
          element_type: 'coupon_form',
          additional_data: {
            coupon_code: couponCode.toUpperCase(),
            success: true
          }
        })
        
        return true
      } else {
        toast.error('Invalid coupon code')
        
        // Track failed coupon attempt
        analytics.trackFormError('coupon_form', 'Invalid coupon code', 'coupon_code')
        
        return false
      }
    } catch (error) {
      toast.error('Failed to apply coupon')
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeCoupon = (couponCode: string) => {
    dispatch({ type: 'REMOVE_COUPON', payload: couponCode })
    toast.success('Coupon removed')
  }

  const calculateTotals = () => {
    if (state.cart) {
      dispatch({ type: 'SET_CART', payload: state.cart })
    }
  }

  // Add isInCart and getItemQuantity utilities
  const isInCart = (productId: string) => {
    return state.cart?.items.some(item => item.productId === productId) ?? false;
  };

  const getItemQuantity = (productId: string) => {
    return state.cart?.items.find(item => item.productId === productId)?.quantity ?? 0;
  };

  const value: CartContextValue = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateTotals,
    isInCart,
    getItemQuantity,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <CartProviderInner>{children}</CartProviderInner>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}