'use client'

import { useState, useEffect } from 'react'

interface BundleMetrics {
  totalSize: number
  jsSize: number
  cssSize: number
  imageSize: number
  fontSize: number
  resourceCount: number
  cacheHitRate: number
  compressionRatio: number
  firstLoadJS: number
}

interface PerformanceThresholds {
  totalSize: { good: number; poor: number }
  firstLoadJS: { good: number; poor: number }
  resourceCount: { good: number; poor: number }
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  totalSize: { good: 1000000, poor: 3000000 }, // 1MB good, 3MB poor
  firstLoadJS: { good: 200000, poor: 500000 }, // 200KB good, 500KB poor
  resourceCount: { good: 50, poor: 100 }
}

export function BundleAnalyzer() {
  const [metrics, setMetrics] = useState<BundleMetrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])

  // Analyze bundle metrics
  const analyzeBundleMetrics = async () => {
    setIsAnalyzing(true)
    
    try {
      // Get performance entries
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      
      let totalSize = 0
      let jsSize = 0
      let cssSize = 0
      let imageSize = 0
      let fontSize = 0
      let compressedSize = 0
      let uncompressedSize = 0
      
      entries.forEach(entry => {
        const transferSize = entry.transferSize || 0
        const decodedBodySize = entry.decodedBodySize || 0
        
        totalSize += transferSize
        compressedSize += transferSize
        uncompressedSize += decodedBodySize
        
        const url = entry.name.toLowerCase()
        
        if (url.includes('.js') || url.includes('javascript')) {
          jsSize += transferSize
        } else if (url.includes('.css') || url.includes('stylesheet')) {
          cssSize += transferSize
        } else if (url.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) {
          imageSize += transferSize
        } else if (url.match(/\.(woff|woff2|ttf|eot)$/)) {
          fontSize += transferSize
        }
      })
      
      // Calculate cache hit rate
      const cacheHits = entries.filter(entry => 
        entry.transferSize === 0 && entry.decodedBodySize > 0
      ).length
      const cacheHitRate = entries.length > 0 ? (cacheHits / entries.length) * 100 : 0
      
      // Calculate compression ratio
      const compressionRatio = uncompressedSize > 0 ? 
        ((uncompressedSize - compressedSize) / uncompressedSize) * 100 : 0
      
      // Get First Load JS size (approximate)
      const firstLoadJS = entries
        .filter(entry => entry.name.includes('/_next/static/chunks/') || entry.name.includes('/_next/static/js/'))
        .reduce((sum, entry) => sum + (entry.transferSize || 0), 0)
      
      const bundleMetrics: BundleMetrics = {
        totalSize,
        jsSize,
        cssSize,
        imageSize,
        fontSize,
        resourceCount: entries.length,
        cacheHitRate,
        compressionRatio,
        firstLoadJS
      }
      
      setMetrics(bundleMetrics)
      generateRecommendations(bundleMetrics)
      
    } catch (error) {
      console.error('Error analyzing bundle metrics:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  // Generate performance recommendations
  const generateRecommendations = (metrics: BundleMetrics) => {
    const recs: string[] = []
    
    if (metrics.totalSize > DEFAULT_THRESHOLDS.totalSize.poor) {
      recs.push('🔴 Total bundle size is very large. Consider code splitting and tree shaking.')
    } else if (metrics.totalSize > DEFAULT_THRESHOLDS.totalSize.good) {
      recs.push('🟡 Total bundle size could be optimized. Look for unused dependencies.')
    }
    
    if (metrics.firstLoadJS > DEFAULT_THRESHOLDS.firstLoadJS.poor) {
      recs.push('🔴 First Load JS is too large. Implement dynamic imports for non-critical components.')
    } else if (metrics.firstLoadJS > DEFAULT_THRESHOLDS.firstLoadJS.good) {
      recs.push('🟡 First Load JS could be reduced. Consider lazy loading heavy components.')
    }
    
    if (metrics.resourceCount > DEFAULT_THRESHOLDS.resourceCount.poor) {
      recs.push('🔴 Too many HTTP requests. Bundle more resources together.')
    } else if (metrics.resourceCount > DEFAULT_THRESHOLDS.resourceCount.good) {
      recs.push('🟡 Consider reducing the number of resources with bundling.')
    }
    
    if (metrics.cacheHitRate < 50) {
      recs.push('🟡 Low cache hit rate. Improve caching strategies.')
    }
    
    if (metrics.compressionRatio < 50) {
      recs.push('🟡 Poor compression ratio. Enable better compression (gzip/brotli).')
    }
    
    if (metrics.imageSize > metrics.jsSize) {
      recs.push('💡 Images are larger than JS. Consider WebP/AVIF formats and lazy loading.')
    }
    
    if (recs.length === 0) {
      recs.push('✅ Bundle metrics look good! Keep monitoring for regressions.')
    }
    
    setRecommendations(recs)
  }
  
  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }
  
  // Get performance score color
  const getScoreColor = (value: number, threshold: { good: number; poor: number }) => {
    if (value <= threshold.good) return 'text-green-400'
    if (value <= threshold.poor) return 'text-yellow-400'
    return 'text-red-400'
  }
  
  useEffect(() => {
    // Initial analysis after page load
    const timer = setTimeout(analyzeBundleMetrics, 2000)
    return () => clearTimeout(timer)
  }, [])
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 text-sm font-mono">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-green-400 font-semibold">Bundle Analyzer</h3>
          <button
            onClick={analyzeBundleMetrics}
            disabled={isAnalyzing}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
        
        {metrics && (
          <div className="space-y-2">
            {/* Main Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Total Size:</span>
                <div className={getScoreColor(metrics.totalSize, DEFAULT_THRESHOLDS.totalSize)}>
                  {formatBytes(metrics.totalSize)}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">First Load JS:</span>
                <div className={getScoreColor(metrics.firstLoadJS, DEFAULT_THRESHOLDS.firstLoadJS)}>
                  {formatBytes(metrics.firstLoadJS)}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">Resources:</span>
                <div className={getScoreColor(metrics.resourceCount, DEFAULT_THRESHOLDS.resourceCount)}>
                  {metrics.resourceCount}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">Cache Hit:</span>
                <div className={metrics.cacheHitRate > 70 ? 'text-green-400' : metrics.cacheHitRate > 40 ? 'text-yellow-400' : 'text-red-400'}>
                  {metrics.cacheHitRate.toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Breakdown */}
            <div className="border-t border-gray-700 pt-2">
              <div className="text-gray-400 text-xs mb-1">Breakdown:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>JS: {formatBytes(metrics.jsSize)}</div>
                <div>CSS: {formatBytes(metrics.cssSize)}</div>
                <div>Images: {formatBytes(metrics.imageSize)}</div>
                <div>Fonts: {formatBytes(metrics.fontSize)}</div>
              </div>
            </div>
            
            {/* Compression */}
            <div className="border-t border-gray-700 pt-2">
              <div className="text-gray-400 text-xs">
                Compression: {metrics.compressionRatio.toFixed(1)}%
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="border-t border-gray-700 pt-2">
              <div className="text-gray-400 text-xs mb-1">Recommendations:</div>
              <div className="max-h-32 overflow-y-auto">
                {recommendations.map((rec, index) => (
                  <div key={index} className="text-xs text-gray-300 mb-1">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {!metrics && !isAnalyzing && (
          <div className="text-gray-400 text-xs">
            Click Refresh to analyze bundle metrics
          </div>
        )}
      </div>
    </div>
  )
}

export default BundleAnalyzer