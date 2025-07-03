'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Zap, 
  Clock, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PerformanceMonitor } from '@/utils/performance'

interface PerformanceMetrics {
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
  fcp: number | null // First Contentful Paint
  networkType: string
  effectiveType: string
  downlink: number
}

interface PerformanceMonitorProps {
  showInProduction?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function PerformanceMonitorWidget({ 
  showInProduction = false,
  position = 'bottom-right' 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
    networkType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or if explicitly enabled for production
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
      return
    }

    setIsVisible(true)

    const monitor = PerformanceMonitor.getInstance()
    monitor.reportWebVitals()

    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      setMetrics(prev => ({
        ...prev,
        ttfb: navigation ? navigation.responseStart - navigation.requestStart : null,
        fcp: navigation ? navigation.responseEnd - navigation.responseStart : null
      }))

      // Network Information API
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setMetrics(prev => ({
          ...prev,
          networkType: connection?.type || 'unknown',
          effectiveType: connection?.effectiveType || 'unknown',
          downlink: connection?.downlink || 0
        }))
      }
    }

    // Web Vitals using PerformanceObserver
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          entries.forEach((entry: any) => {
            setMetrics(prev => ({ 
              ...prev, 
              fid: entry.processingStart - entry.startTime 
            }))
          })
        })
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })
      } catch (e) {
        console.warn('CLS observer not supported')
      }
    }

    collectMetrics()

    // Update metrics periodically
    const interval = setInterval(collectMetrics, 5000)
    return () => clearInterval(interval)
  }, [showInProduction])

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400'
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-500' : value <= 4000 ? 'text-yellow-500' : 'text-red-500'
      case 'fid':
        return value <= 100 ? 'text-green-500' : value <= 300 ? 'text-yellow-500' : 'text-red-500'
      case 'cls':
        return value <= 0.1 ? 'text-green-500' : value <= 0.25 ? 'text-yellow-500' : 'text-red-500'
      case 'ttfb':
        return value <= 600 ? 'text-green-500' : value <= 1000 ? 'text-yellow-500' : 'text-red-500'
      case 'fcp':
        return value <= 1800 ? 'text-green-500' : value <= 3000 ? 'text-yellow-500' : 'text-red-500'
      default:
        return 'text-gray-400'
    }
  }

  const getScoreIcon = (metric: string, value: number | null) => {
    if (value === null) return <Clock className="h-3 w-3" />
    
    const isGood = (() => {
      switch (metric) {
        case 'lcp': return value <= 2500
        case 'fid': return value <= 100
        case 'cls': return value <= 0.1
        case 'ttfb': return value <= 600
        case 'fcp': return value <= 1800
        default: return false
      }
    })()

    return isGood ? 
      <CheckCircle className="h-3 w-3" /> : 
      <AlertTriangle className="h-3 w-3" />
  }

  const formatValue = (metric: string, value: number | null) => {
    if (value === null) return 'N/A'
    
    switch (metric) {
      case 'cls':
        return value.toFixed(3)
      case 'downlink':
        return `${value.toFixed(1)} Mbps`
      default:
        return `${Math.round(value)}ms`
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4'
      case 'top-right': return 'top-4 right-4'
      case 'bottom-left': return 'bottom-4 left-4'
      case 'bottom-right': return 'bottom-4 right-4'
      default: return 'bottom-4 right-4'
    }
  }

  if (!isVisible) return null

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="bg-black/80 text-white p-3 rounded-full shadow-lg hover:bg-black/90 transition-colors"
          >
            <Activity className="h-5 w-5" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl p-4 min-w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-primary-600" />
                <h3 className="font-semibold text-gray-100 text-sm">Performance</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Core Web Vitals */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Core Web Vitals
              </h4>
              
              {[
                { key: 'lcp', label: 'LCP', icon: Zap },
                { key: 'fid', label: 'FID', icon: Clock },
                { key: 'cls', label: 'CLS', icon: Activity }
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-700">{label}</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${getScoreColor(key, metrics[key as keyof PerformanceMetrics] as number)}`}>
                    {getScoreIcon(key, metrics[key as keyof PerformanceMetrics] as number)}
                    <span className="font-mono">
                      {formatValue(key, metrics[key as keyof PerformanceMetrics] as number)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Metrics */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Loading Performance
              </h4>
              
              {[
                { key: 'ttfb', label: 'TTFB' },
                { key: 'fcp', label: 'FCP' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">{label}</span>
                  <span className={`font-mono ${getScoreColor(key, metrics[key as keyof PerformanceMetrics] as number)}`}>
                    {formatValue(key, metrics[key as keyof PerformanceMetrics] as number)}
                  </span>
                </div>
              ))}
            </div>

            {/* Network Info */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center space-x-2">
                <Wifi className="h-3 w-3 text-gray-500" />
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Network
                </h4>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Connection</span>
                <Badge variant="outline" className="text-xs">
                  {metrics.effectiveType}
                </Badge>
              </div>
              
              {metrics.downlink > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">Speed</span>
                  <span className="font-mono text-gray-100">
                    {formatValue('downlink', metrics.downlink)}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-xs h-6 px-2"
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const monitor = PerformanceMonitor.getInstance()
                  monitor.clearMetrics()
                  console.log('Performance metrics cleared')
                }}
                className="text-xs h-6 px-2"
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for custom performance tracking
export function usePerformanceTracking() {
  const monitor = PerformanceMonitor.getInstance()

  const trackPageLoad = (pageName: string) => {
    monitor.startTiming(`page-load-${pageName}`)
    
    return () => {
      const duration = monitor.endTiming(`page-load-${pageName}`)
      console.log(`Page ${pageName} loaded in ${duration.toFixed(2)}ms`)
    }
  }

  const trackComponentRender = (componentName: string) => {
    monitor.startTiming(`component-render-${componentName}`)
    
    return () => {
      const duration = monitor.endTiming(`component-render-${componentName}`)
      console.log(`Component ${componentName} rendered in ${duration.toFixed(2)}ms`)
    }
  }

  const trackApiCall = (apiName: string) => {
    monitor.startTiming(`api-call-${apiName}`)
    
    return () => {
      const duration = monitor.endTiming(`api-call-${apiName}`)
      console.log(`API call ${apiName} completed in ${duration.toFixed(2)}ms`)
    }
  }

  return {
    trackPageLoad,
    trackComponentRender,
    trackApiCall,
    getMetrics: monitor.getMetrics.bind(monitor),
    getAverageTime: monitor.getAverageTime.bind(monitor)
  }
}