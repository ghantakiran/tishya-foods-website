// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(label: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${label}-start`)
    }
  }

  endTiming(label: string): number {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${label}-end`)
      performance.measure(label, `${label}-start`, `${label}-end`)
      
      const measure = performance.getEntriesByName(label, 'measure')[0]
      const duration = measure ? measure.duration : 0
      
      // Store metric
      if (!this.metrics.has(label)) {
        this.metrics.set(label, [])
      }
      this.metrics.get(label)!.push(duration)
      
      // Clean up marks and measures
      performance.clearMarks(`${label}-start`)
      performance.clearMarks(`${label}-end`)
      performance.clearMeasures(label)
      
      return duration
    }
    return 0
  }

  getMetrics(label?: string): Map<string, number[]> | number[] | undefined {
    if (label) {
      return this.metrics.get(label)
    }
    return this.metrics
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label)
    if (!times || times.length === 0) return 0
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  clearMetrics(label?: string): void {
    if (label) {
      this.metrics.delete(label)
    } else {
      this.metrics.clear()
    }
  }

  // Report Core Web Vitals
  reportWebVitals(): void {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: PerformanceEntry & { processingStart: number }) => {
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ type: 'first-input', buffered: true })

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: PerformanceEntry & { hadRecentInput: boolean; value: number }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        console.log('CLS:', clsValue)
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    }
  }
}

// Image optimization utilities
export function generateImageSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size}&q=75 ${size}w`)
    .join(', ')
}

export function generateImageSizes(breakpoints: { [key: string]: number }): string {
  return Object.entries(breakpoints)
    .map(([query, size]) => `${query} ${size}px`)
    .join(', ')
}

// Lazy loading utilities
export function createImagePlaceholder(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F3F4F6"/>
      <rect x="${width/2 - 20}" y="${height/2 - 20}" width="40" height="40" rx="4" fill="#E5E7EB"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Bundle splitting helpers
export function preloadRoute(route: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  }
}

export function preloadComponent(componentImport: () => Promise<unknown>): void {
  if (typeof window !== 'undefined') {
    // Preload the component during idle time
    requestIdleCallback(() => {
      componentImport()
    })
  }
}

// Memory management
export class MemoryManager {
  private static cache = new Map<string, unknown>()
  private static maxCacheSize = 100

  static set(key: string, value: unknown): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  static get(key: string): unknown {
    return this.cache.get(key)
  }

  static has(key: string): boolean {
    return this.cache.has(key)
  }

  static clear(): void {
    this.cache.clear()
  }

  static size(): number {
    return this.cache.size
  }
}

// Request batching for API calls
export class RequestBatcher {
  private static batches = new Map<string, {
    requests: Array<{ resolve: (value: unknown) => void; reject: (reason: unknown) => void; data: unknown }>
    timer: NodeJS.Timeout
  }>()

  static batch<T>(
    key: string,
    request: (batchedData: unknown[]) => Promise<T[]>,
    data: unknown,
    delay = 50
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(key)) {
        this.batches.set(key, {
          requests: [],
          timer: setTimeout(() => this.executeBatch(key, request), delay)
        })
      }

      const batch = this.batches.get(key)!
      batch.requests.push({ resolve, reject, data })
    })
  }

  private static async executeBatch<T>(
    key: string,
    request: (batchedData: unknown[]) => Promise<T[]>
  ): Promise<void> {
    const batch = this.batches.get(key)
    if (!batch) return

    this.batches.delete(key)

    try {
      const batchedData = batch.requests.map(req => req.data)
      const results = await request(batchedData)
      
      batch.requests.forEach((req, index) => {
        req.resolve(results[index])
      })
    } catch (error) {
      batch.requests.forEach(req => {
        req.reject(error)
      })
    }
  }
}

// Resource hints
export function addResourceHints(): void {
  if (typeof window === 'undefined') return

  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net'
  ]

  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = `//${domain}`
    document.head.appendChild(link)
  })
}

// Service Worker registration
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

// Performance timing hook
export function usePerformanceTiming(label: string) {
  const monitor = PerformanceMonitor.getInstance()
  
  const startTiming = () => monitor.startTiming(label)
  const endTiming = () => monitor.endTiming(label)
  const getAverageTime = () => monitor.getAverageTime(label)
  
  return { startTiming, endTiming, getAverageTime }
}