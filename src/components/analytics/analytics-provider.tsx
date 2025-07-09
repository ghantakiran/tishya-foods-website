'use client'

import { createContext, useContext, useEffect, ReactNode, useState } from 'react'
import { analytics } from '@/lib/analytics/analytics-manager'
import type { AnalyticsConfig } from '@/types/analytics'
import { useCookiePreferences } from '@/components/gdpr/cookie-consent-banner'

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
  config: AnalyticsConfig
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const { preferences } = useCookiePreferences()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Only initialize analytics if user has consented
        if (preferences.analytics) {
          const gdprConfig = {
            ...config,
            googleAnalytics: {
              ...config.googleAnalytics,
              config: {
                ...config.googleAnalytics.config,
                allow_google_signals: preferences.marketing,
                allow_ad_personalization_signals: preferences.marketing,
                anonymize_ip: true // Always anonymize IP for privacy
              }
            }
          }
          
          await analytics.initialize(gdprConfig)
          setIsInitialized(true)
          
          // Track initial page view
          analytics.trackPageView('app_initialized', {
            initialization_time: Date.now(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            color_depth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            consent_given: true,
            consent_categories: {
              analytics: preferences.analytics,
              marketing: preferences.marketing,
              functional: preferences.functional
            }
          })
        } else {
          setIsInitialized(false)
          console.info('Analytics not initialized - user has not consented to analytics cookies')
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error)
        if (preferences.analytics) {
          analytics.trackError('javascript', 'Analytics initialization failed', {
            error_stack: error instanceof Error ? error.stack : undefined
          })
        }
      }
    }

    initializeAnalytics()
  }, [config, preferences])

  // Track unhandled errors only if analytics is enabled
  useEffect(() => {
    if (!isInitialized || !preferences.analytics) return

    const handleError = (event: ErrorEvent) => {
      analytics.trackError('javascript', event.message, {
        error_stack: event.error?.stack
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
  }, [isInitialized, preferences.analytics])

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

// Create a safe default analytics object for SSR
const createSafeAnalytics = (): AnalyticsContextType => ({
  trackEvent: async () => {},
  trackPageView: async () => {},
  trackEcommerce: async () => {},
  trackUserAction: async () => {},
  trackEngagement: async () => {},
  trackError: async () => {},
  trackPurchase: async () => {},
  trackAddToCart: async () => {},
  trackRemoveFromCart: async () => {},
  trackViewItem: async () => {},
  trackBeginCheckout: async () => {},
  trackSearch: async () => {},
  setUserId: () => {},
  setUserProperties: () => {}
})

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  
  // During SSR or if provider is missing, return safe defaults
  if (!context) {
    if (typeof window === 'undefined') {
      // Server-side rendering - return safe defaults
      return createSafeAnalytics()
    } else {
      // Client-side but no provider - log warning and return safe defaults
      console.warn('useAnalytics must be used within an AnalyticsProvider. Using safe defaults.')
      return createSafeAnalytics()
    }
  }
  
  return context
}