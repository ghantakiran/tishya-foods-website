'use client'

import { useState, useEffect, lazy, Suspense, ComponentType } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface DynamicLoaderProps {
  componentName: string
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  enabled?: boolean
  priority?: 'high' | 'medium' | 'low'
  preload?: boolean
}

// Component registry for dynamic imports
const COMPONENT_REGISTRY: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  'analytics-dashboard': () => import('@/components/analytics/dashboard'),
  'product-comparison': () => import('@/components/product/product-comparison'),
  'subscription-manager': () => import('@/components/subscription/subscription-dashboard'),
  'checkout-form': () => import('@/features/checkout/checkout-form'),
  'ar-viewer': () => import('@/components/product/product-360-viewer'),
  'payment-form': () => import('@/components/payment/stripe-payment-form'),
  'charts': () => import('@/components/analytics/chart-components'),
  'social-sharing': () => import('@/components/social/social-sharing'),
  'loyalty-dashboard': () => import('@/components/loyalty/loyalty-dashboard'),
  'recipe-builder': () => import('@/components/recipes/recipe-builder'),
  'nutrition-tracker': () => import('@/components/nutrition/nutrition-tracker'),
  'live-chat': () => import('@/components/support/live-chat'),
  'video-player': () => import('@/components/media/video-player'),
  'map-component': () => import('@/components/location/store-locator'),
  'calendar': () => import('@/components/subscription/delivery-calendar')
}

// Loading skeleton components
const LoadingSkeleton = ({ componentName }: { componentName: string }) => {
  const getSkeletonConfig = () => {
    switch (componentName) {
      case 'analytics-dashboard':
        return { height: '400px', className: 'grid grid-cols-1 md:grid-cols-2 gap-4' }
      case 'product-comparison':
        return { height: '500px', className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' }
      case 'checkout-form':
        return { height: '600px', className: 'space-y-6' }
      default:
        return { height: '300px', className: 'space-y-4' }
    }
  }

  const { height, className } = getSkeletonConfig()

  return (
    <div className={`animate-pulse ${className}`} style={{ minHeight: height }}>
      <div className="bg-gray-700 rounded-lg h-full w-full"></div>
    </div>
  )
}

export function DynamicLoader({
  componentName,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  enabled = true,
  priority = 'medium',
  preload = false,
  ...props
}: DynamicLoaderProps & Record<string, any>) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [DynamicComponent, setDynamicComponent] = useState<ComponentType<any> | null>(null)

  const { ref, isVisible: isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin
  })

  // Preload component if high priority or explicitly requested
  useEffect(() => {
    if ((priority === 'high' || preload) && COMPONENT_REGISTRY[componentName]) {
      const loadComponent = async () => {
        try {
          const module = await COMPONENT_REGISTRY[componentName]()
          setDynamicComponent(() => module.default)
        } catch (err) {
          console.warn(`Failed to preload component ${componentName}:`, err)
        }
      }
      loadComponent()
    }
  }, [componentName, priority, preload])

  // Load component when visible
  useEffect(() => {
    if (isIntersecting && !DynamicComponent && !isLoading && enabled) {
      setIsVisible(true)
      setIsLoading(true)
      
      const loadComponent = async () => {
        try {
          if (!COMPONENT_REGISTRY[componentName]) {
            throw new Error(`Component "${componentName}" not found in registry`)
          }
          
          const module = await COMPONENT_REGISTRY[componentName]()
          setDynamicComponent(() => module.default)
          setError(null)
        } catch (err) {
          setError(err as Error)
          console.error(`Failed to load component ${componentName}:`, err)
        } finally {
          setIsLoading(false)
        }
      }

      // Add delay based on priority
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 300
      setTimeout(loadComponent, delay)
    }
  }, [isIntersecting, DynamicComponent, isLoading, componentName, enabled, priority])

  // Error boundary
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
        <div className="text-red-400 mb-2">⚠️ Component Load Error</div>
        <div className="text-sm text-gray-400">
          Failed to load {componentName}: {error.message}
        </div>
        <button 
          onClick={() => {
            setError(null)
            setIsLoading(false)
            setDynamicComponent(null)
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  // Component is loaded and ready
  if (DynamicComponent) {
    return (
      <Suspense fallback={fallback || <LoadingSkeleton componentName={componentName} />}>
        <DynamicComponent {...props} />
      </Suspense>
    )
  }

  // Component is loading
  if (isLoading) {
    return fallback || <LoadingSkeleton componentName={componentName} />
  }

  // Intersection observer target (invisible until component loads)
  return (
    <div 
      ref={ref} 
      className="min-h-[100px] flex items-center justify-center"
      data-component={componentName}
    >
      {isVisible && (fallback || <LoadingSkeleton componentName={componentName} />)}
    </div>
  )
}

// Hook for dynamic imports with caching
export function useDynamicImport<T = ComponentType<any>>(
  componentName: string,
  options: {
    enabled?: boolean
    priority?: 'high' | 'medium' | 'low'
  } = {}
) {
  const [component, setComponent] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadComponent = async () => {
    if (!COMPONENT_REGISTRY[componentName] || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const module = await COMPONENT_REGISTRY[componentName]()
      setComponent(module.default as T)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (options.enabled !== false && options.priority === 'high') {
      loadComponent()
    }
  }, [componentName, options.enabled, options.priority])

  return {
    component,
    isLoading,
    error,
    loadComponent
  }
}

// Preload utility for critical components
export function preloadComponents(componentNames: string[]) {
  return Promise.allSettled(
    componentNames.map(async (name) => {
      if (COMPONENT_REGISTRY[name]) {
        try {
          await COMPONENT_REGISTRY[name]()
          console.log(`Preloaded component: ${name}`)
        } catch (error) {
          console.warn(`Failed to preload component ${name}:`, error)
        }
      }
    })
  )
}

// Component for automatic preloading based on route
export function RouteBasedPreloader({ route }: { route: string }) {
  useEffect(() => {
    const routeComponents: Record<string, string[]> = {
      '/products': ['product-comparison', 'analytics-dashboard'],
      '/checkout': ['checkout-form', 'payment-form'],
      '/subscription': ['subscription-manager', 'calendar'],
      '/nutrition': ['nutrition-tracker', 'charts'],
      '/dashboard': ['analytics-dashboard', 'charts', 'loyalty-dashboard']
    }

    const componentsToPreload = routeComponents[route]
    if (componentsToPreload) {
      preloadComponents(componentsToPreload)
    }
  }, [route])

  return null
}

export default DynamicLoader