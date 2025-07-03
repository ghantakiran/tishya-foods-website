'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  loading?: 'lazy' | 'eager'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)
  
  const { ref: observerRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true
  })

  const shouldLoad = priority || isVisible

  // Generate optimized image URLs
  const generateSrcSet = useCallback((baseUrl: string, widths: number[]): string => {
    return widths
      .map(w => `${baseUrl}?w=${w}&q=${quality} ${w}w`)
      .join(', ')
  }, [quality])

  const generateSizes = useCallback((): string => {
    if (sizes) return sizes
    if (width) return `${width}px`
    return '100vw'
  }, [sizes, width])

  // Default responsive widths
  const defaultWidths = [320, 640, 768, 1024, 1280, 1536]
  const srcSet = generateSrcSet(src, defaultWidths)
  const imageSizes = generateSizes()

  useEffect(() => {
    if (shouldLoad && !currentSrc) {
      setCurrentSrc(src)
    }
  }, [shouldLoad, src, currentSrc])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsError(true)
    onError?.()
  }, [onError])

  // Combine refs
  const setRefs = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node
    if (node) {
      observerRef.current = node
    }
  }, [observerRef])

  const imageProps = {
    ref: setRefs,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? 'eager' as const : loading,
    decoding: 'async' as const,
    ...(currentSrc && {
      src: currentSrc,
      srcSet,
      sizes: imageSizes
    }),
    ...(width && { width }),
    ...(height && { height }),
    className: cn(
      'transition-opacity duration-300',
      {
        'opacity-0': !isLoaded && !isError,
        'opacity-100': isLoaded,
        'object-cover': fill,
        'w-full h-full': fill
      },
      className
    )
  }

  return (
    <div className={cn('relative overflow-hidden', { 'w-full h-full': fill })}>
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-cream-100">
          {placeholder === 'blur' && blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-105"
            />
          )}
          {shouldLoad && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 border-2 border-earth-300 border-t-primary-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Image */}
      {shouldLoad && <img {...imageProps} />}

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100 text-earth-400">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-cream-200 rounded flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {/* Loading shimmer effect */}
      {!isLoaded && !isError && shouldLoad && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      )}
    </div>
  )
}

// Responsive Image Grid Component
interface ResponsiveImageGridProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: {
    sm: number
    md: number
    lg: number
  }
  gap?: number
  aspectRatio?: string
  className?: string
}

export function ResponsiveImageGrid({
  images,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 4,
  aspectRatio = 'aspect-square',
  className
}: ResponsiveImageGridProps) {
  const gridClass = `grid grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-${gap}`

  return (
    <div className={cn(gridClass, className)}>
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group"
        >
          <div className={cn('relative overflow-hidden rounded-lg', aspectRatio)}>
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              fill
              className="group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {image.caption && (
            <p className="mt-2 text-sm text-earth-600 text-center">{image.caption}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Product Image with Multiple Formats
interface ProductImageProps {
  productId: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  variant?: 'thumbnail' | 'card' | 'hero' | 'detail'
}

export function ProductImage({
  productId,
  alt,
  sizes,
  className,
  priority = false,
  variant = 'card'
}: ProductImageProps) {
  const [format, setFormat] = useState<'webp' | 'jpg'>('webp')

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      if (ctx) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }
      return false
    }

    if (!checkWebPSupport()) {
      setFormat('jpg')
    }
  }, [])

  const variantSizes = {
    thumbnail: '80px',
    card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
    hero: '100vw',
    detail: '(max-width: 768px) 100vw, 50vw'
  }

  const imageSrc = `/images/products/${productId}.${format}`
  const imageSizes = sizes || variantSizes[variant]

  return (
    <OptimizedImage
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={imageSizes}
      className={className}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${btoa(
        `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g">
              <stop stop-color="#f3f4f6" offset="20%" />
              <stop stop-color="#e5e7eb" offset="50%" />
              <stop stop-color="#f3f4f6" offset="70%" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#g)" />
        </svg>`
      )}`}
    />
  )
}

// Lazy Image with Intersection Observer
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: React.ReactNode
  threshold?: number
  rootMargin?: string
}

export function LazyImage({
  src,
  alt,
  className,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px'
}: LazyImageProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true
  })

  return (
    <div ref={ref as any} className={cn('relative', className)}>
      {isVisible ? (
        <OptimizedImage src={src} alt={alt} fill className="object-cover" />
      ) : (
        placeholder || (
          <div className="w-full h-full bg-cream-100 flex items-center justify-center">
            <div className="w-8 h-8 bg-cream-200 rounded animate-pulse" />
          </div>
        )
      )}
    </div>
  )
}

// Image with Progressive Enhancement
interface ProgressiveImageProps {
  src: {
    low: string
    high: string
  }
  alt: string
  className?: string
  onLoad?: () => void
}

export function ProgressiveImage({
  src,
  alt,
  className,
  onLoad
}: ProgressiveImageProps) {
  const [highResLoaded, setHighResLoaded] = useState(false)
  const [lowResLoaded, setLowResLoaded] = useState(false)

  useEffect(() => {
    // Load low-res image first
    const lowResImg = new Image()
    lowResImg.onload = () => setLowResLoaded(true)
    lowResImg.src = src.low

    // Then load high-res image
    const highResImg = new Image()
    highResImg.onload = () => {
      setHighResLoaded(true)
      onLoad?.()
    }
    highResImg.src = src.high
  }, [src, onLoad])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Low resolution image */}
      {lowResLoaded && (
        <img
          src={src.low}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300 filter blur-sm scale-105',
            highResLoaded ? 'opacity-0' : 'opacity-100'
          )}
        />
      )}

      {/* High resolution image */}
      {highResLoaded && (
        <motion.img
          src={src.high}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Loading placeholder */}
      {!lowResLoaded && (
        <div className="absolute inset-0 bg-cream-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-earth-300 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}