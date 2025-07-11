'use client'

import { useEffect, useCallback, useState } from 'react'
import Script from 'next/script'

interface PerformanceMetrics {
  fcp: number
  lcp: number
  cls: number
  fid: number
  ttfb: number
  bundleSize: number
  resourceCount: number
}

interface PerformanceOptimizerProps {
  enablePreloading?: boolean
  enableImageOptimization?: boolean
  enableCodeSplitting?: boolean
  enableResourceHints?: boolean
}

export function PerformanceOptimizer({
  enablePreloading = true,
  enableImageOptimization = true,
  enableCodeSplitting = true,
  enableResourceHints = true
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Performance monitoring using Web Vitals
  const measureWebVitals = useCallback(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }))
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Time to First Byte
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navEntries.length > 0) {
        const navTiming = navEntries[0]
        setMetrics(prev => ({ 
          ...prev, 
          ttfb: navTiming.responseStart - navTiming.requestStart 
        }))
      }

      // Resource metrics
      const resourceEntries = performance.getEntriesByType('resource')
      setMetrics(prev => ({ 
        ...prev, 
        resourceCount: resourceEntries.length,
        bundleSize: resourceEntries
          .filter(entry => entry.name.includes('.js'))
          .reduce((total, entry) => total + ((entry as any).transferSize || 0), 0)
      }))
    }
  }, [])

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    if (!enablePreloading || typeof document === 'undefined') return

    const criticalResources = [
      // Preload critical fonts
      { href: '/fonts/inter-variable.woff2', as: 'font', type: 'font/woff2' },
      // Preload hero images
      { href: '/images/hero-bg.webp', as: 'image' },
      // Preload critical CSS
      { href: '/_next/static/css/app.css', as: 'style' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.as === 'font') link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [enablePreloading])

  // Optimize images dynamically
  const optimizeImages = useCallback(() => {
    if (!enableImageOptimization || typeof document === 'undefined') return

    const images = document.querySelectorAll('img[data-optimize]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const originalSrc = img.dataset.src
          
          if (originalSrc) {
            // Create optimized WebP/AVIF URLs
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/, '.webp')
            const avifSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/, '.avif')
            
            // Use picture element for format fallbacks
            const picture = document.createElement('picture')
            
            // AVIF source
            const avifSource = document.createElement('source')
            avifSource.srcset = avifSrc
            avifSource.type = 'image/avif'
            picture.appendChild(avifSource)
            
            // WebP source
            const webpSource = document.createElement('source')
            webpSource.srcset = webpSrc
            webpSource.type = 'image/webp'
            picture.appendChild(webpSource)
            
            // Fallback img
            img.src = originalSrc
            picture.appendChild(img.cloneNode(true))
            
            img.parentNode?.replaceChild(picture, img)
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px 0px'
    })

    images.forEach(img => imageObserver.observe(img))
  }, [enableImageOptimization])

  // Implement service worker for caching
  const initServiceWorker = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
        
        // Update metrics when SW is active
        if (registration.active) {
          setMetrics(prev => ({ ...prev, swActive: true }))
        }
      } catch (error) {
        console.warn('Service Worker registration failed:', error)
      }
    }
  }, [])

  // Bundle splitting optimization
  const optimizeBundleLoading = useCallback(() => {
    if (!enableCodeSplitting) return

    // Dynamically import heavy components only when needed
    const heavyComponents = [
      'analytics-dashboard',
      'product-comparison',
      'subscription-manager',
      'ar-viewer'
    ]

    heavyComponents.forEach(componentName => {
      const elements = document.querySelectorAll(`[data-component="${componentName}"]`)
      if (elements.length > 0) {
        // Component is needed, log for debugging
        console.log(`Heavy component detected: ${componentName}`)
      }
    })
  }, [enableCodeSplitting])

  // Add resource hints
  const addResourceHints = useCallback(() => {
    if (!enableResourceHints || typeof document === 'undefined') return

    const hints = [
      // DNS prefetch for external domains
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'dns-prefetch', href: '//api.stripe.com' },
      
      // Preconnect to critical origins
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      
      // Prefetch likely next pages
      { rel: 'prefetch', href: '/products' },
      { rel: 'prefetch', href: '/cart' }
    ]

    hints.forEach(hint => {
      const link = document.createElement('link')
      link.rel = hint.rel
      link.href = hint.href
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin
      document.head.appendChild(link)
    })
  }, [enableResourceHints])

  // Main optimization runner
  const runOptimizations = useCallback(async () => {
    setIsOptimizing(true)
    
    try {
      // Run optimizations in parallel
      await Promise.all([
        preloadCriticalResources(),
        optimizeImages(),
        initServiceWorker(),
        optimizeBundleLoading(),
        addResourceHints()
      ])
      
      // Measure performance after optimizations
      setTimeout(measureWebVitals, 1000)
    } catch (error) {
      console.error('Performance optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }, [
    preloadCriticalResources,
    optimizeImages,
    initServiceWorker,
    optimizeBundleLoading,
    addResourceHints,
    measureWebVitals
  ])

  // Initialize optimizations
  useEffect(() => {
    // Run initial optimizations
    runOptimizations()

    // Set up continuous monitoring
    const monitoringInterval = setInterval(measureWebVitals, 30000) // Every 30 seconds

    return () => {
      clearInterval(monitoringInterval)
    }
  }, [runOptimizations, measureWebVitals])

  // Performance monitoring script
  const performanceScript = `
    // Critical performance monitoring
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration + 'ms')
          }
        }
      })
      longTaskObserver.observe({entryTypes: ['longtask']})
      
      // Monitor largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry.startTime > 2500) {
          console.warn('Poor LCP detected:', lastEntry.startTime + 'ms')
        }
      })
      lcpObserver.observe({entryTypes: ['largest-contentful-paint']})
    }
    
    // Memory monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = performance.memory
        if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected')
        }
      }, 10000)
    }
  `

  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metrics:', metrics)
  }

  return (
    <>
      <Script id="performance-monitor" strategy="afterInteractive">
        {performanceScript}
      </Script>
      
      {/* Critical resource preloads */}
      <link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/_next/static/css/app.css" as="style" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//api.stripe.com" />
      
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* Performance monitoring indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-2 rounded text-xs font-mono">
          <div>FCP: {metrics.fcp?.toFixed(0)}ms</div>
          <div>LCP: {metrics.lcp?.toFixed(0)}ms</div>
          <div>CLS: {metrics.cls?.toFixed(3)}</div>
          <div>Bundle: {(metrics.bundleSize || 0 / 1024).toFixed(1)}KB</div>
          {isOptimizing && <div className="text-yellow-400">Optimizing...</div>}
        </div>
      )}
    </>
  )
}

export default PerformanceOptimizer