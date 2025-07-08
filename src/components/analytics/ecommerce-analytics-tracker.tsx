'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from './analytics-provider'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'

interface ProductInteraction {
  productId: string
  productName: string
  productCategory: string
  productPrice: number
  interactionType: 'view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'compare' | 'wishlist'
  timestamp: number
}

interface CheckoutStep {
  step: number
  stepName: string
  timestamp: number
  cartValue: number
  itemCount: number
}

export function EcommerceAnalyticsTracker() {
  const analytics = useAnalytics()
  const { cart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const previousCartRef = useRef<typeof cart>(null)
  const checkoutStepsRef = useRef<CheckoutStep[]>([])
  const sessionStartRef = useRef<number>(Date.now())
  const productInteractionsRef = useRef<ProductInteraction[]>([])

  // Track cart changes
  useEffect(() => {
    if (!cart || !previousCartRef.current) {
      previousCartRef.current = cart
      return
    }

    const previousCart = previousCartRef.current
    const currentCart = cart

    // Check for added items
    if (currentCart.items.length > previousCart.items.length) {
      const addedItems = currentCart.items.filter(
        currentItem => !previousCart.items.some(prevItem => prevItem.id === currentItem.id)
      )

      addedItems.forEach(item => {
        analytics.trackAddToCart({
          item_id: item.productId,
          item_name: item.name,
          category: 'food_products',
          quantity: item.quantity,
          price: item.price
        })

        // Track detailed product interaction
        const interaction: ProductInteraction = {
          productId: item.productId,
          productName: item.name,
          productCategory: 'food_products',
          productPrice: item.price,
          interactionType: 'add_to_cart',
          timestamp: Date.now()
        }
        productInteractionsRef.current.push(interaction)

        // Track custom add to cart event with additional data
        analytics.trackEvent({
          event: 'add_to_cart_detailed',
          category: 'ecommerce',
          properties: {
            product_id: item.productId,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            cart_total_before: previousCart.totalPrice,
            cart_total_after: currentCart.totalPrice,
            cart_items_before: previousCart.items.length,
            cart_items_after: currentCart.items.length,
            user_id: user?.id,
            session_duration: Date.now() - sessionStartRef.current,
            timestamp: Date.now()
          }
        })
      })
    }

    // Check for removed items
    if (currentCart.items.length < previousCart.items.length) {
      const removedItems = previousCart.items.filter(
        prevItem => !currentCart.items.some(currentItem => currentItem.id === prevItem.id)
      )

      removedItems.forEach(item => {
        analytics.trackRemoveFromCart({
          item_id: item.productId,
          item_name: item.name,
          category: 'food_products',
          quantity: item.quantity,
          price: item.price
        })

        // Track detailed product interaction
        const interaction: ProductInteraction = {
          productId: item.productId,
          productName: item.name,
          productCategory: 'food_products',
          productPrice: item.price,
          interactionType: 'remove_from_cart',
          timestamp: Date.now()
        }
        productInteractionsRef.current.push(interaction)

        // Track custom remove from cart event
        analytics.trackEvent({
          event: 'remove_from_cart_detailed',
          category: 'ecommerce',
          properties: {
            product_id: item.productId,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            cart_total_before: previousCart.totalPrice,
            cart_total_after: currentCart.totalPrice,
            cart_items_before: previousCart.items.length,
            cart_items_after: currentCart.items.length,
            removal_reason: 'user_action', // Could be expanded to track specific reasons
            user_id: user?.id,
            session_duration: Date.now() - sessionStartRef.current,
            timestamp: Date.now()
          }
        })
      })
    }

    // Check for quantity changes
    currentCart.items.forEach(currentItem => {
      const previousItem = previousCart.items.find(item => item.id === currentItem.id)
      if (previousItem && previousItem.quantity !== currentItem.quantity) {
        const quantityDiff = currentItem.quantity - previousItem.quantity
        
        analytics.trackEvent({
          event: 'cart_quantity_change',
          category: 'ecommerce',
          properties: {
            product_id: currentItem.productId,
            product_name: currentItem.name,
            previous_quantity: previousItem.quantity,
            new_quantity: currentItem.quantity,
            quantity_change: quantityDiff,
            price_per_unit: currentItem.price,
            total_price_change: quantityDiff * currentItem.price,
            user_id: user?.id,
            timestamp: Date.now()
          }
        })
      }
    })

    previousCartRef.current = currentCart
  }, [cart, analytics, user?.id])

  // Track checkout process
  useEffect(() => {
    if (typeof window === 'undefined') return

    const trackCheckoutStep = (step: number, stepName: string) => {
      if (!cart || cart.items.length === 0) return

      const checkoutStep: CheckoutStep = {
        step,
        stepName,
        timestamp: Date.now(),
        cartValue: cart.totalPrice,
        itemCount: cart.items.length
      }

      checkoutStepsRef.current.push(checkoutStep)

      analytics.trackBeginCheckout(cart.totalPrice, cart.items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        category: 'food_products',
        quantity: item.quantity,
        price: item.price
      })))

      analytics.trackEvent({
        event: 'checkout_step',
        category: 'ecommerce',
        properties: {
          step_number: step,
          step_name: stepName,
          cart_value: cart.totalPrice,
          item_count: cart.items.length,
          items: cart.items.map(item => ({
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          user_id: user?.id,
          session_duration: Date.now() - sessionStartRef.current,
          timestamp: Date.now()
        }
      })
    }

    // Listen for checkout events
    const handleCheckoutStart = () => trackCheckoutStep(1, 'checkout_start')
    const handleShippingInfo = () => trackCheckoutStep(2, 'shipping_info')
    const handlePaymentInfo = () => trackCheckoutStep(3, 'payment_info')
    const handleOrderReview = () => trackCheckoutStep(4, 'order_review')
    const handleOrderComplete = () => trackCheckoutStep(5, 'order_complete')

    // Custom event listeners for checkout steps
    window.addEventListener('checkout_start', handleCheckoutStart)
    window.addEventListener('checkout_shipping', handleShippingInfo)
    window.addEventListener('checkout_payment', handlePaymentInfo)
    window.addEventListener('checkout_review', handleOrderReview)
    window.addEventListener('checkout_complete', handleOrderComplete)

    return () => {
      window.removeEventListener('checkout_start', handleCheckoutStart)
      window.removeEventListener('checkout_shipping', handleShippingInfo)
      window.removeEventListener('checkout_payment', handlePaymentInfo)
      window.removeEventListener('checkout_review', handleOrderReview)
      window.removeEventListener('checkout_complete', handleOrderComplete)
    }
  }, [cart, analytics, user?.id])

  // Track product views
  useEffect(() => {
    if (typeof window === 'undefined') return

    const trackProductView = (event: CustomEvent) => {
      const { productId, productName, productCategory, productPrice } = event.detail

      analytics.trackViewItem({
        item_id: productId,
        item_name: productName,
        category: productCategory,
        price: productPrice,
        quantity: 1
      })

      // Track detailed product interaction
      const interaction: ProductInteraction = {
        productId,
        productName,
        productCategory,
        productPrice,
        interactionType: 'view',
        timestamp: Date.now()
      }
      productInteractionsRef.current.push(interaction)

      // Track custom product view event
      analytics.trackEvent({
        event: 'product_view_detailed',
        category: 'ecommerce',
        properties: {
          product_id: productId,
          product_name: productName,
          product_category: productCategory,
          product_price: productPrice,
          view_source: event.detail.source || 'unknown',
          user_id: user?.id,
          session_duration: Date.now() - sessionStartRef.current,
          timestamp: Date.now()
        }
      })
    }

    window.addEventListener('product_view', trackProductView as EventListener)
    return () => window.removeEventListener('product_view', trackProductView as EventListener)
  }, [analytics, user?.id])

  // Track search events
  useEffect(() => {
    if (typeof window === 'undefined') return

    const trackSearchEvent = (event: CustomEvent) => {
      const { searchTerm, searchResults, searchFilters } = event.detail

      analytics.trackSearch(searchTerm, searchResults?.length || 0)

      analytics.trackEvent({
        event: 'search_detailed',
        category: 'user_action',
        properties: {
          search_term: searchTerm,
          results_count: searchResults?.length || 0,
          filters: searchFilters,
          user_id: user?.id,
          session_duration: Date.now() - sessionStartRef.current,
          timestamp: Date.now()
        }
      })
    }

    window.addEventListener('search_performed', trackSearchEvent as EventListener)
    return () => window.removeEventListener('search_performed', trackSearchEvent as EventListener)
  }, [analytics, user?.id])

  // Track abandoned cart
  useEffect(() => {
    if (typeof window === 'undefined') return

    let abandonedCartTimer: NodeJS.Timeout | null = null

    const resetAbandonedCartTimer = () => {
      if (abandonedCartTimer) {
        clearTimeout(abandonedCartTimer)
      }

      if (cart && cart.items.length > 0) {
        abandonedCartTimer = setTimeout(() => {
          analytics.trackEvent({
            event: 'cart_abandoned',
            category: 'ecommerce',
            properties: {
              cart_value: cart.totalPrice,
              item_count: cart.items.length,
              items: cart.items.map(item => ({
                product_id: item.productId,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              abandonment_time: 15 * 60 * 1000, // 15 minutes
              user_id: user?.id,
              session_duration: Date.now() - sessionStartRef.current,
              timestamp: Date.now()
            }
          })
        }, 15 * 60 * 1000) // 15 minutes
      }
    }

    const handleUserActivity = () => {
      resetAbandonedCartTimer()
    }

    // Reset timer on user activity
    document.addEventListener('mousedown', handleUserActivity)
    document.addEventListener('keypress', handleUserActivity)
    document.addEventListener('scroll', handleUserActivity)
    document.addEventListener('touchstart', handleUserActivity)

    resetAbandonedCartTimer()

    return () => {
      if (abandonedCartTimer) {
        clearTimeout(abandonedCartTimer)
      }
      document.removeEventListener('mousedown', handleUserActivity)
      document.removeEventListener('keypress', handleUserActivity)
      document.removeEventListener('scroll', handleUserActivity)
      document.removeEventListener('touchstart', handleUserActivity)
    }
  }, [cart, analytics, user?.id])

  // Track session summary on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartRef.current
      
      analytics.trackEvent({
        event: 'session_summary',
        category: 'engagement',
        properties: {
          session_duration: sessionDuration,
          product_interactions: productInteractionsRef.current.length,
          checkout_steps_completed: checkoutStepsRef.current.length,
          cart_final_value: cart?.totalPrice || 0,
          cart_final_items: cart?.items.length || 0,
          user_id: user?.id,
          timestamp: Date.now()
        }
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [analytics, cart, user?.id])

  return null // This component doesn't render anything
}

// Helper functions to dispatch custom events
export const trackProductView = (productId: string, productName: string, productCategory: string, productPrice: number, source?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('product_view', {
      detail: { productId, productName, productCategory, productPrice, source }
    }))
  }
}

export const trackSearchPerformed = (searchTerm: string, searchResults: any[], searchFilters: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('search_performed', {
      detail: { searchTerm, searchResults, searchFilters }
    }))
  }
}

export const trackCheckoutStart = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('checkout_start'))
  }
}

export const trackCheckoutStep = (step: 'shipping' | 'payment' | 'review' | 'complete') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`checkout_${step}`))
  }
}