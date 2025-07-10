'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResilientImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  placeholder?: React.ReactNode
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  retries?: number
  blur?: boolean
}

export function ResilientImage({
  src,
  alt,
  fallbackSrc,
  placeholder,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  retries = 2,
  blur = true
}: ResilientImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showRetryButton, setShowRetryButton] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    setError(null)
    onLoad?.()
  }, [onLoad])

  const handleImageError = useCallback(() => {
    const errorInstance = new Error(`Failed to load image: ${currentSrc}`)
    
    if (retryCount < retries) {
      // Try again with a small delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setCurrentSrc(`${src}?retry=${retryCount + 1}`)
      }, 1000 * (retryCount + 1)) // Progressive delay
    } else if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc)
      setRetryCount(0)
    } else {
      // All attempts failed
      setLoading(false)
      setError(errorInstance)
      setShowRetryButton(true)
      onError?.(errorInstance)
    }
  }, [currentSrc, retryCount, retries, src, fallbackSrc, onError])

  const handleRetry = useCallback(() => {
    setError(null)
    setLoading(true)
    setRetryCount(0)
    setShowRetryButton(false)
    setCurrentSrc(`${src}?manual-retry=${Date.now()}`)
  }, [src])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            // Start loading the image when it comes into view
            const img = imgRef.current
            if (!img.src) {
              img.src = currentSrc
            }
            observer.unobserve(img)
          }
        })
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [currentSrc, priority])

  const containerClasses = `relative overflow-hidden ${className}`

  if (error && !showRetryButton) {
    return (
      <div 
        className={`${containerClasses} bg-gray-800 flex items-center justify-center border border-gray-600`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <ImageOff className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClasses} style={{ width, height }}>
      {/* Placeholder/Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800 flex items-center justify-center"
          >
            {placeholder || (
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse mx-auto" />
                {blur && (
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-700 rounded animate-pulse" />
                    <div className="h-2 bg-gray-700 rounded w-3/4 mx-auto animate-pulse" />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State with Retry */}
      <AnimatePresence>
        {error && showRetryButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800 flex items-center justify-center border border-gray-600"
          >
            <div className="text-center p-4 space-y-3">
              <ImageOff className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-sm text-gray-400">Failed to load image</p>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      <motion.img
        ref={imgRef}
        src={priority ? currentSrc : undefined} // Only set src immediately if priority
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          filter: loading && blur ? 'blur(8px)' : 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Loading indicator */}
      {loading && retryCount > 0 && (
        <div className="absolute bottom-2 right-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Retry count indicator */}
      {retryCount > 0 && loading && (
        <div className="absolute top-2 right-2 bg-gray-900/80 text-gray-300 text-xs px-2 py-1 rounded">
          Retry {retryCount}/{retries}
        </div>
      )}
    </div>
  )
}

// Hook for preloading images
export function useImagePreloader(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const preloadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(url))
          resolve()
        }
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(url))
          resolve()
        }
        img.src = url
      })
    }

    // Preload all images
    Promise.all(urls.map(preloadImage))
  }, [urls])

  return {
    loadedImages,
    failedImages,
    isLoaded: (url: string) => loadedImages.has(url),
    isFailed: (url: string) => failedImages.has(url)
  }
}

// Progressive image component with blur-up effect
export function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  className = '',
  ...props
}: {
  lowQualitySrc: string
  highQualitySrc: string
  alt: string
  className?: string
} & Omit<ResilientImageProps, 'src'>) {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {/* Low quality placeholder */}
      <ResilientImage
        src={lowQualitySrc}
        alt={alt}
        className="absolute inset-0"
        style={{ filter: 'blur(8px)' }}
        {...props}
      />
      
      {/* High quality image */}
      <ResilientImage
        src={highQualitySrc}
        alt={alt}
        className={`transition-opacity duration-500 ${
          highQualityLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setHighQualityLoaded(true)}
        {...props}
      />
    </div>
  )
}