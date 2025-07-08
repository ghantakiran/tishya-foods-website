'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAnalytics } from './analytics-provider'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

interface UserBehaviorMetrics {
  timeOnPage: number
  scrollDepth: number
  clickCount: number
  idleTime: number
  engagementScore: number
}

export function EnhancedAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const analytics = useAnalytics()
  const { user, isAuthenticated } = useAuth()
  const { cart } = useCart()
  
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [userBehavior, setUserBehavior] = useState<UserBehaviorMetrics>({
    timeOnPage: 0,
    scrollDepth: 0,
    clickCount: 0,
    idleTime: 0,
    engagementScore: 0
  })
  
  const pageLoadTime = useRef<number>(Date.now())
  const scrollDepthRef = useRef<number>(0)
  const clickCountRef = useRef<number>(0)
  const lastActivityRef = useRef<number>(Date.now())
  const idleTimeRef = useRef<number>(0)
  const engagementTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Track page views and route changes
  useEffect(() => {
    const trackPageView = async () => {
      const fullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      // Reset page metrics
      pageLoadTime.current = Date.now()
      scrollDepthRef.current = 0
      clickCountRef.current = 0
      lastActivityRef.current = Date.now()
      idleTimeRef.current = 0
      
      // Track page view
      await analytics.trackPageView('page_view', {
        page_title: document.title,
        page_url: fullUrl,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        viewport_size: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        device_type: getDeviceType(),
        connection_type: getConnectionType(),
        timestamp: Date.now()
      })

      // Track user session info
      if (isAuthenticated && user) {
        analytics.setUserId(user.id)
        analytics.setUserProperties({
          user_type: user.role || 'user',
          registration_date: user.createdAt,
          last_login: user.updatedAt,
          preferred_language: navigator.language
        })
      }

      // Track cart info
      if (cart && cart.items.length > 0) {
        await analytics.trackEvent({
          event: 'cart_status',
          category: 'ecommerce',
          properties: {
            cart_items: cart.items.length,
            cart_value: cart.totalPrice,
            cart_currency: 'INR'
          }
        })
      }
    }

    trackPageView()
  }, [pathname, searchParams, analytics, isAuthenticated, user, cart])

  // Track performance metrics
  useEffect(() => {
    if (typeof window === 'undefined') return

    const trackPerformanceMetrics = () => {
      // Web Vitals tracking - commented out for now due to import issues
      // TODO: Fix web-vitals import in future update
      // if (typeof window !== 'undefined') {
      //   // Track Core Web Vitals
      //   import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      //     // Web vitals tracking implementation
      //   }).catch(console.error)
      // }

      // Track Navigation Timing
      if ('performance' in window && 'navigation' in window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        const metrics: PerformanceMetrics = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          firstInputDelay: 0,
          cumulativeLayoutShift: 0,
          timeToInteractive: navigation.domInteractive - navigation.requestStart
        }

        setPerformanceMetrics(metrics)

        // Track performance metrics
        analytics.trackEvent({
          event: 'performance_metrics',
          category: 'engagement',
          properties: {
            page_load_time: metrics.pageLoadTime,
            time_to_interactive: metrics.timeToInteractive,
            dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            server_response: navigation.responseEnd - navigation.requestStart,
            url: window.location.href
          }
        })
      }
    }

    // Track metrics after page load
    if (document.readyState === 'complete') {
      trackPerformanceMetrics()
    } else {
      window.addEventListener('load', trackPerformanceMetrics)
    }

    return () => {
      window.removeEventListener('load', trackPerformanceMetrics)
    }
  }, [analytics])

  // Track user behavior
  useEffect(() => {
    if (typeof window === 'undefined') return

    let isIdle = false
    let idleTimer: NodeJS.Timeout | null = null

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)
      if (isIdle) {
        isIdle = false
        idleTimeRef.current = 0
      }
      lastActivityRef.current = Date.now()
      
      idleTimer = setTimeout(() => {
        isIdle = true
        analytics.trackEvent({
          event: 'user_idle',
          category: 'engagement',
          properties: {
            idle_duration: 30000, // 30 seconds
            url: window.location.href
          }
        })
      }, 30000)
    }

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
      const winHeight = window.innerHeight
      const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100)
      
      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent)
      
      // Track scroll milestones
      if (scrollPercent >= 25 && scrollPercent < 50) {
        analytics.trackEvent({
          event: 'scroll_depth_25',
          category: 'engagement',
          properties: {
            scroll_depth: scrollPercent,
            url: window.location.href
          }
        })
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        analytics.trackEvent({
          event: 'scroll_depth_50',
          category: 'engagement',
          properties: {
            scroll_depth: scrollPercent,
            url: window.location.href
          }
        })
      } else if (scrollPercent >= 75) {
        analytics.trackEvent({
          event: 'scroll_depth_75',
          category: 'engagement',
          properties: {
            scroll_depth: scrollPercent,
            url: window.location.href
          }
        })
      }
      
      resetIdleTimer()
    }

    // Track clicks
    const handleClick = (event: MouseEvent) => {
      clickCountRef.current++
      
      const target = event.target as HTMLElement
      const elementType = target.tagName.toLowerCase()
      const elementId = target.id
      const elementText = target.textContent?.substring(0, 50) || ''
      const elementClass = target.className
      
      analytics.trackUserAction('click', {
        element_type: elementType,
        element_id: elementId,
        element_text: elementText,
        additional_data: {
          element_class: elementClass,
          click_x: event.clientX,
          click_y: event.clientY,
          timestamp: Date.now()
        }
      })
      
      resetIdleTimer()
    }

    // Track form submissions
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement
      const formId = form.id
      const formAction = form.action
      const formMethod = form.method
      
      analytics.trackUserAction('form_submit', {
        element_id: formId,
        additional_data: {
          form_action: formAction,
          form_method: formMethod,
          timestamp: Date.now()
        }
      })
    }

    // Track engagement time
    const startEngagementTracking = () => {
      if (engagementTimerRef.current) clearInterval(engagementTimerRef.current)
      
      engagementTimerRef.current = setInterval(() => {
        const now = Date.now()
        const timeSinceLoad = now - pageLoadTime.current
        
        if (!isIdle) {
          setUserBehavior(prev => ({
            ...prev,
            timeOnPage: timeSinceLoad,
            scrollDepth: scrollDepthRef.current,
            clickCount: clickCountRef.current,
            idleTime: idleTimeRef.current,
            engagementScore: calculateEngagementScore(timeSinceLoad, scrollDepthRef.current, clickCountRef.current)
          }))
        } else {
          idleTimeRef.current += 1000
        }
      }, 1000)
    }

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)
    document.addEventListener('submit', handleFormSubmit)
    document.addEventListener('mousedown', resetIdleTimer)
    document.addEventListener('mousemove', resetIdleTimer)
    document.addEventListener('keypress', resetIdleTimer)
    document.addEventListener('touchstart', resetIdleTimer)

    startEngagementTracking()
    resetIdleTimer()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('submit', handleFormSubmit)
      document.removeEventListener('mousedown', resetIdleTimer)
      document.removeEventListener('mousemove', resetIdleTimer)
      document.removeEventListener('keypress', resetIdleTimer)
      document.removeEventListener('touchstart', resetIdleTimer)
      
      if (idleTimer) clearTimeout(idleTimer)
      if (engagementTimerRef.current) clearInterval(engagementTimerRef.current)
    }
  }, [analytics])

  // Track page exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - pageLoadTime.current
      
      analytics.trackEvent({
        event: 'page_exit',
        category: 'engagement',
        properties: {
          time_on_page: timeOnPage,
          scroll_depth: scrollDepthRef.current,
          click_count: clickCountRef.current,
          idle_time: idleTimeRef.current,
          engagement_score: calculateEngagementScore(timeOnPage, scrollDepthRef.current, clickCountRef.current),
          url: window.location.href
        }
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [analytics])

  return null // This component doesn't render anything
}

// Helper functions
function getDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('mobile')) return 'mobile'
  if (userAgent.includes('tablet')) return 'tablet'
  return 'desktop'
}

function getConnectionType(): string {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    return connection.effectiveType || connection.type || 'unknown'
  }
  return 'unknown'
}

function calculateEngagementScore(timeOnPage: number, scrollDepth: number, clickCount: number): number {
  // Simple engagement scoring algorithm
  const timeScore = Math.min(timeOnPage / 60000, 1) * 40 // Max 40 points for 1 minute
  const scrollScore = (scrollDepth / 100) * 30 // Max 30 points for 100% scroll
  const clickScore = Math.min(clickCount / 5, 1) * 30 // Max 30 points for 5 clicks
  
  return Math.round(timeScore + scrollScore + clickScore)
}