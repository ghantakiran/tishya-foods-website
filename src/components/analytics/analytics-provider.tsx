'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { analytics } from '@/lib/analytics/analytics-manager'

interface AnalyticsContextType {
  trackEvent: typeof analytics.trackEvent
  trackPageView: typeof analytics.trackPageView
  trackEcommerce: typeof analytics.trackEcommerce
  trackUserAction: typeof analytics.trackUserAction
  trackEngagement: typeof analytics.trackEngagement
  trackError: typeof analytics.trackError
  trackPurchase: typeof analytics.trackPurchase
  trackAddToCart: typeof analytics.trackAddToCart
  trackRemoveFromCart: typeof analytics.trackRemoveFromCart
  trackViewItem: typeof analytics.trackViewItem
  trackBeginCheckout: typeof analytics.trackBeginCheckout
  trackSearch: typeof analytics.trackSearch
  setUserId: typeof analytics.setUserId
  setUserProperties: typeof analytics.setUserProperties
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
  config: {
    googleAnalytics?: { measurementId: string; config?: any }
    customAnalytics?: { apiEndpoint: string; config?: any }
    enableConsoleLogging?: boolean
  }
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        await analytics.initialize(config)
        
        // Track initial page view
        analytics.trackPageView('app_initialized', {
          initialization_time: Date.now(),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          color_depth: screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      } catch (error) {
        console.error('Failed to initialize analytics:', error)
        analytics.trackError('javascript', 'Analytics initialization failed', {
          error_stack: error instanceof Error ? error.stack : undefined
        })
      }
    }

    initializeAnalytics()
  }, [config])

  // Track unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analytics.trackError('javascript', event.message, {
        error_stack: event.error?.stack,
        filename: event.filename,
        line_number: event.lineno,
        column_number: event.colno
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError('javascript', 'Unhandled promise rejection', {
        error_message: event.reason?.toString() || 'Unknown promise rejection',
        error_stack: event.reason?.stack
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const value: AnalyticsContextType = {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEcommerce: analytics.trackEcommerce.bind(analytics),
    trackUserAction: analytics.trackUserAction.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackRemoveFromCart: analytics.trackRemoveFromCart.bind(analytics),
    trackViewItem: analytics.trackViewItem.bind(analytics),
    trackBeginCheckout: analytics.trackBeginCheckout.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    setUserProperties: analytics.setUserProperties.bind(analytics)
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}