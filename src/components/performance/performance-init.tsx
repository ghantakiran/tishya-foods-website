'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  initializePerformanceOptimizations,
  preloadRouteComponents,
  prefetchLikelyPages 
} from '@/components/optimization/bundle-optimizer'
import { PerformanceMonitorWidget } from './performance-monitor'

interface PerformanceInitProps {
  children: React.ReactNode
  showMonitor?: boolean
}

export function PerformanceInit({ 
  children, 
  showMonitor = process.env.NODE_ENV === 'development' 
}: PerformanceInitProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize all performance optimizations
    initializePerformanceOptimizations()
  }, [])

  useEffect(() => {
    // Preload components for current route
    preloadRouteComponents(pathname)
    
    // Prefetch likely next pages
    prefetchLikelyPages(pathname)
  }, [pathname])

  return (
    <>
      {children}
      {showMonitor && <PerformanceMonitorWidget />}
    </>
  )
}

// Hook for route-specific performance tracking
export function useRoutePerformance(routeName: string) {
  useEffect(() => {
    // Start timing when component mounts
    const startTime = performance.now()
    
    // Mark route as loaded
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log(`Route ${routeName} performance:`, {
              domContentLoaded: (entry as PerformanceNavigationTiming).domContentLoadedEventEnd - (entry as PerformanceNavigationTiming).domContentLoadedEventStart,
              loadComplete: (entry as PerformanceNavigationTiming).loadEventEnd - (entry as PerformanceNavigationTiming).loadEventStart,
              totalTime: entry.duration
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      
      return () => observer.disconnect()
    }
    
    return () => {
      const endTime = performance.now()
      console.log(`Route ${routeName} mounted in ${endTime - startTime}ms`)
    }
  }, [routeName])
}