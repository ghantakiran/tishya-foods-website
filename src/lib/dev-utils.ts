/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

// Development-only utilities for debugging and development assistance
const isDevelopment = process.env.NODE_ENV === 'development'

export interface PerformanceMetrics {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

class DevLogger {
  private metrics: Map<string, PerformanceMetrics> = new Map()

  log(message: string, data?: any, level: 'info' | 'warn' | 'error' = 'info') {
    if (!isDevelopment) return

    const timestamp = new Date().toISOString()
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️'
    
    console[level](`${emoji} [${timestamp}] ${message}`, data || '')
  }

  debug(message: string, data?: any) {
    this.log(message, data, 'info')
  }

  warn(message: string, data?: any) {
    this.log(message, data, 'warn')
  }

  error(message: string, error?: Error | any) {
    if (error instanceof Error) {
      this.log(message, { message: error.message, stack: error.stack }, 'error')
    } else {
      this.log(message, error, 'error')
    }
  }

  time(name: string, metadata?: Record<string, any>) {
    if (!isDevelopment) return

    const metric: PerformanceMetrics = {
      name,
      startTime: performance.now(),
      metadata
    }

    this.metrics.set(name, metric)
    console.time(name)
  }

  timeEnd(name: string) {
    if (!isDevelopment) return

    const metric = this.metrics.get(name)
    if (metric) {
      metric.endTime = performance.now()
      metric.duration = metric.endTime - metric.startTime
      
      console.timeEnd(name)
      console.log(`⚡ Performance: ${name} took ${metric.duration.toFixed(2)}ms`, metric.metadata || '')
      
      this.metrics.delete(name)
    }
  }

  group(title: string, callback: () => void) {
    if (!isDevelopment) return

    console.group(`📦 ${title}`)
    try {
      callback()
    } finally {
      console.groupEnd()
    }
  }

  table(data: any, columns?: string[]) {
    if (!isDevelopment) return
    console.table(data, columns)
  }

  trace() {
    if (!isDevelopment) return
    console.trace('Stack trace:')
  }
}

export const logger = new DevLogger()

// React development helpers
export function useDevLog(componentName: string, props?: any) {
  React.useEffect(() => {
    if (!isDevelopment) return

    logger.debug(`Component mounted: ${componentName}`, props)
    
    return () => {
      if (!isDevelopment) return
      logger.debug(`Component unmounted: ${componentName}`)
    }
  }, [componentName, props])
}

// API debugging helpers
export function logApiRequest(method: string, url: string, data?: any) {
  if (!isDevelopment) return

  logger.group(`API Request: ${method} ${url}`, () => {
    if (data) {
      logger.debug('Request data:', data)
    }
  })
}

export function logApiResponse(method: string, url: string, response: any, duration?: number) {
  if (!isDevelopment) return

  logger.group(`API Response: ${method} ${url}`, () => {
    logger.debug('Response:', response)
    if (duration) {
      logger.debug(`Duration: ${duration.toFixed(2)}ms`)
    }
  })
}

// Database query debugging
export function logDbQuery(query: string, params?: any, duration?: number) {
  if (!isDevelopment) return

  logger.group('Database Query', () => {
    logger.debug('Query:', query)
    if (params) {
      logger.debug('Parameters:', params)
    }
    if (duration) {
      logger.debug(`Duration: ${duration.toFixed(2)}ms`)
    }
  })
}

// Environment debugging
export function logEnvironment() {
  if (!isDevelopment) return

  logger.group('Environment Information', () => {
    logger.debug('Node version:', process.version)
    logger.debug('Platform:', process.platform)
    logger.debug('Environment:', process.env.NODE_ENV)
    logger.debug('Memory usage:', process.memoryUsage())
    
    if (typeof window !== 'undefined') {
      logger.debug('Browser:', navigator.userAgent)
      logger.debug('Viewport:', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  })
}

// Component state debugging
export function logStateChange(componentName: string, prevState: any, newState: any) {
  if (!isDevelopment) return

  logger.group(`State Change: ${componentName}`, () => {
    logger.debug('Previous state:', prevState)
    logger.debug('New state:', newState)
    logger.debug('Changes:', {
      added: Object.keys(newState).filter(key => !(key in prevState)),
      removed: Object.keys(prevState).filter(key => !(key in newState)),
      modified: Object.keys(newState).filter(key => 
        key in prevState && JSON.stringify(prevState[key]) !== JSON.stringify(newState[key])
      )
    })
  })
}

// Performance debugging
export function measureRenderTime(componentName: string) {
  if (!isDevelopment) return () => {}

  const startTime = performance.now()
  
  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (duration > 16) { // Highlight slow renders (> 1 frame at 60fps)
      logger.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`)
    } else {
      logger.debug(`Render time: ${componentName} took ${duration.toFixed(2)}ms`)
    }
  }
}

// Bundle size debugging
export function logBundleInfo(chunkName: string) {
  if (!isDevelopment) return

  // This would be populated by webpack bundle analyzer data
  logger.debug(`Bundle chunk loaded: ${chunkName}`)
}

// Error debugging helpers
export function enhanceError(error: Error, context: Record<string, any>): Error {
  if (!isDevelopment) return error

  const enhancedError = new Error(error.message)
  enhancedError.stack = error.stack
  enhancedError.name = error.name

  // Add development context
  ;(enhancedError as any).devContext = {
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    ...context
  }

  return enhancedError
}

// Testing helpers
export function mockConsole() {
  if (!isDevelopment) return { restore: () => {} }

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  }

  const logs: any[] = []

  console.log = (...args) => logs.push({ type: 'log', args })
  console.warn = (...args) => logs.push({ type: 'warn', args })
  console.error = (...args) => logs.push({ type: 'error', args })
  console.debug = (...args) => logs.push({ type: 'debug', args })

  return {
    logs,
    restore: () => {
      Object.assign(console, originalConsole)
    }
  }
}

// Memory debugging
export function logMemoryUsage() {
  if (!isDevelopment) return

  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    logger.debug('Memory usage:', {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    })
  } else if (typeof process !== 'undefined') {
    const usage = process.memoryUsage()
    logger.debug('Memory usage:', {
      rss: `${(usage.rss / 1048576).toFixed(2)} MB`,
      heapTotal: `${(usage.heapTotal / 1048576).toFixed(2)} MB`,
      heapUsed: `${(usage.heapUsed / 1048576).toFixed(2)} MB`,
      external: `${(usage.external / 1048576).toFixed(2)} MB`
    })
  }
}

// Network debugging
export function interceptFetch() {
  if (!isDevelopment || typeof window === 'undefined') return

  const originalFetch = window.fetch

  window.fetch = async function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] as any).href || (args[0] as any).url
    const options = args[1] || {}
    
    logger.time(`Fetch: ${url}`)
    logger.debug(`Fetch request: ${options.method || 'GET'} ${url}`, options)

    try {
      const response = await originalFetch.apply(this, args)
      logger.timeEnd(`Fetch: ${url}`)
      logger.debug(`Fetch response: ${response.status} ${url}`)
      return response
    } catch (error) {
      logger.timeEnd(`Fetch: ${url}`)
      logger.error(`Fetch error: ${url}`, error)
      throw error
    }
  }
}

