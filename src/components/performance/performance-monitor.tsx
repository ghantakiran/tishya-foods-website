'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  cls?: number // Cumulative Layout Shift
  fid?: number // First Input Delay
  ttfb?: number // Time to First Byte
  hydrationTime?: number
  domContentLoaded?: number
  loadComplete?: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})

  useEffect(() => {
    // Monitor Core Web Vitals
    const measureCoreWebVitals = () => {
      // First Contentful Paint (FCP)
      const paintEntries = performance.getEntriesByType('paint') as PerformanceEntry[]
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      // Time to First Byte (TTFB)
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      const ttfb = navEntries[0]?.responseStart - navEntries[0]?.requestStart
      
      // DOM Content Loaded
      const domContentLoaded = navEntries[0]?.domContentLoadedEventEnd - navEntries[0]?.domContentLoadedEventStart
      
      // Load Complete
      const loadComplete = navEntries[0]?.loadEventEnd - (navEntries[0] as any)?.navigationStart

      setMetrics(prev => ({
        ...prev,
        fcp: fcpEntry?.startTime,
        ttfb,
        domContentLoaded,
        loadComplete
      }))
    }

    // Measure Largest Contentful Paint (LCP)
    const measureLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        
        setMetrics(prev => ({
          ...prev,
          lcp: lastEntry.startTime
        }))
      })
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported
      }
    }

    // Measure Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        
        setMetrics(prev => ({
          ...prev,
          cls: clsValue
        }))
      })
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported
      }
    }

    // Run measurements
    measureCoreWebVitals()
    measureLCP()
    measureCLS()

    // Log metrics to console in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.group('🚀 Performance Metrics')
        console.log('First Contentful Paint (FCP):', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'Not available')
        console.log('Largest Contentful Paint (LCP):', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'Not available')
        console.log('Cumulative Layout Shift (CLS):', metrics.cls ? metrics.cls.toFixed(4) : 'Not available')
        console.log('Time to First Byte (TTFB):', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'Not available')
        console.log('DOM Content Loaded:', metrics.domContentLoaded ? `${metrics.domContentLoaded.toFixed(2)}ms` : 'Not available')
        console.log('Load Complete:', metrics.loadComplete ? `${metrics.loadComplete.toFixed(2)}ms` : 'Not available')
        console.groupEnd()
      }, 2000)
    }
  }, [])

  // Don't render anything visible, this is just for monitoring
  return null
}

// Performance thresholds (in milliseconds)
export const PERFORMANCE_THRESHOLDS = {
  FCP: {
    good: 1800,
    needsImprovement: 3000
  },
  LCP: {
    good: 2500,
    needsImprovement: 4000
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800
  }
}