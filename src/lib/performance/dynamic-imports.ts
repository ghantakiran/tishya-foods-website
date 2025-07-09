import { lazy, ComponentType } from 'react'

// Lazy load heavy components to improve initial bundle size
export const LazyAnalyticsDashboard = lazy(
  () => import('@/components/analytics/analytics-dashboard')
)

export const LazyProductComparison = lazy(
  () => import('@/components/product/product-comparison')
)

export const LazySubscriptionDashboard = lazy(
  () => import('@/components/subscription/subscription-dashboard')
)

export const LazyCheckoutForm = lazy(
  () => import('@/features/checkout/checkout-form')
)

export const LazyNutritionTracker = lazy(
  () => import('@/components/nutrition/nutrition-tracker')
)

export const LazyLoyaltyDashboard = lazy(
  () => import('@/components/loyalty/loyalty-dashboard')
)

export const LazyProduct360Viewer = lazy(
  () => import('@/components/product/product-360-viewer')
)

export const LazyPaymentForm = lazy(
  () => import('@/components/payment/stripe-payment-form')
)

// Utility to preload components based on route
export const preloadComponents = {
  '/dashboard': [LazyAnalyticsDashboard],
  '/products/compare': [LazyProductComparison],
  '/subscription': [LazySubscriptionDashboard],
  '/checkout': [LazyCheckoutForm, LazyPaymentForm],
  '/nutrition': [LazyNutritionTracker],
  '/loyalty': [LazyLoyaltyDashboard],
  '/products/[id]': [LazyProduct360Viewer]
}

// Preload component when hovering over link
export const preloadComponent = (componentName: keyof typeof preloadComponents) => {
  const components = preloadComponents[componentName]
  if (components) {
    components.forEach(component => {
      // Force webpack to preload the component
      if (typeof component === 'function') {
        component()
      }
    })
  }
}

// Component registry for dynamic loading
export const getDynamicComponent = (componentName: string): ComponentType<any> | null => {
  const componentMap: Record<string, ComponentType<any>> = {
    'analytics-dashboard': LazyAnalyticsDashboard,
    'product-comparison': LazyProductComparison,
    'subscription-dashboard': LazySubscriptionDashboard,
    'checkout-form': LazyCheckoutForm,
    'nutrition-tracker': LazyNutritionTracker,
    'loyalty-dashboard': LazyLoyaltyDashboard,
    'product-360-viewer': LazyProduct360Viewer,
    'payment-form': LazyPaymentForm
  }
  
  return componentMap[componentName] || null
}