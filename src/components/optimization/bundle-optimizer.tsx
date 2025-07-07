'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/loading/optimized-loading'

// Higher-order component for lazy loading with loading states
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <ComponentLoadingFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  }
}

// Default loading fallback for components
function ComponentLoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-8"
    >
      <LoadingSpinner size="md" />
    </motion.div>
  )
}

// Route-level code splitting
export const LazyComponents = {
  // These will be implemented when the actual components are ready
  // Currently commenting out to avoid build issues
}

// Dynamic import helper with error handling
export async function dynamicImport<T>(
  importFunc: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await importFunc()
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return dynamicImport(importFunc, retries - 1, delay * 2)
    }
    throw error
  }
}

// Preload components during idle time
export function preloadComponents() {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // Simplified preloading - will be enhanced when components are ready
      console.log('Preloading critical components...')
    })
  }
}

// Route-based component preloading
export function preloadRouteComponents(route: string) {
  // Simplified version - will be enhanced when components are ready
  if (typeof window !== 'undefined') {
    console.log(`Preloading route: ${route}`)
  }
}

// Bundle size monitoring
export function logBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Monitor performance entries for script loading
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          console.log(`Resource: ${entry.name}`)
          console.log(`Transfer Size: ${(entry as PerformanceEntry & { transferSize?: number }).transferSize ?? 0} bytes`)
          console.log(`Encoded Body Size: ${(entry as PerformanceEntry & { encodedBodySize?: number }).encodedBodySize ?? 0} bytes`)
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })

    // Clean up after 10 seconds
    setTimeout(() => observer.disconnect(), 10000)
  }
}

// Critical resource hints
export function addCriticalResourceHints() {
  if (typeof window === 'undefined') return

  const hints = [
    // Preconnect to external domains
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    
    // DNS prefetch for potential external resources
    { rel: 'dns-prefetch', href: '//api.tishyafoods.com' },
    { rel: 'dns-prefetch', href: '//cdn.tishyafoods.com' },
    
    // Preload critical fonts
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      as: 'style',
      onload: "this.onload=null;this.rel='stylesheet'"
    }
  ]

  hints.forEach(hint => {
    const link = document.createElement('link')
    Object.entries(hint).forEach(([key, value]) => {
      if (key === 'crossOrigin') {
        link.crossOrigin = value as string
      } else if (key === 'onload') {
        link.onload = new Function(value as string) as any
      } else {
        link.setAttribute(key, value as string)
      }
    })
    document.head.appendChild(link)
  })
}

// Prefetch next likely pages
export function prefetchLikelyPages(currentRoute: string) {
  if (typeof window === 'undefined') return

  const routePrefetchMap: Record<string, string[]> = {
    '/': ['/products', '/nutrition', '/about'],
    '/products': ['/compare', '/cart', '/nutrition'],
    '/compare': ['/products', '/cart'],
    '/nutrition': ['/products', '/compare'],
    '/cart': ['/checkout'],
    '/checkout': ['/orders', '/'],
    '/orders': ['/products', '/nutrition']
  }

  const prefetchRoutes = routePrefetchMap[currentRoute] || []
  
  // Use requestIdleCallback to prefetch during idle time
  window.requestIdleCallback?.(() => {
    prefetchRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  })
}

// Service Worker for caching strategies
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('SW registered: ', registration)

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                console.log('New content available, please refresh.')
              }
            })
          }
        })
      } catch (error) {
        console.log('SW registration failed: ', error)
      }
    })
  }
}

// Memory cleanup utilities
export class MemoryManager {
  private static abortControllers = new Set<AbortController>()
  private static intervals = new Set<NodeJS.Timeout>()
  private static timeouts = new Set<NodeJS.Timeout>()

  static createAbortController(): AbortController {
    const controller = new AbortController()
    this.abortControllers.add(controller)
    return controller
  }

  static setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const interval = setInterval(callback, delay)
    this.intervals.add(interval)
    return interval
  }

  static setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      callback()
      this.timeouts.delete(timeout)
    }, delay)
    this.timeouts.add(timeout)
    return timeout
  }

  static cleanup(): void {
    // Abort all ongoing requests
    this.abortControllers.forEach(controller => {
      if (!controller.signal.aborted) {
        controller.abort()
      }
    })
    this.abortControllers.clear()

    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals.clear()

    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout))
    this.timeouts.clear()
  }

  static remove(item: AbortController | NodeJS.Timeout): void {
    if (item instanceof AbortController) {
      this.abortControllers.delete(item)
    } else {
      this.intervals.delete(item)
      this.timeouts.delete(item)
    }
  }
}

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return

  // Add critical resource hints
  addCriticalResourceHints()

  // Register service worker
  registerServiceWorker()

  // Preload critical components
  preloadComponents()

  // Monitor bundle sizes in development
  if (process.env.NODE_ENV === 'development') {
    logBundleSize()
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    MemoryManager.cleanup()
  })
}