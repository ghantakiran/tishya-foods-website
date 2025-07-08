'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  loading?: 'lazy' | 'eager'
  unoptimized?: boolean
  
  // Enhanced features
  enableLazyLoading?: boolean
  enableWebP?: boolean
  enableAVIF?: boolean
  lowQualityPlaceholder?: boolean
  adaptiveQuality?: boolean
  preloadOnHover?: boolean
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  unoptimized = false,
  
  // Enhanced features
  enableLazyLoading = true,
  enableWebP = true,
  enableAVIF = true,
  lowQualityPlaceholder = true,
  adaptiveQuality = true,
  preloadOnHover = false,
  fallbackSrc,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [adaptiveQualityValue, setAdaptiveQualityValue] = useState(quality)

  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true
  })

  // Generate optimized src URLs
  const getOptimizedSrc = (originalSrc: string, format?: 'webp' | 'avif') => {
    if (!format || unoptimized) return originalSrc
    
    // For Next.js Image optimization, the format is handled automatically
    // For external optimization, you could modify URLs here
    return originalSrc
  }

  // Adaptive quality based on connection speed
  useEffect(() => {
    if (!adaptiveQuality || typeof navigator === 'undefined') return

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      let newQuality = quality
      
      switch (connection.effectiveType) {
        case 'slow-2g':
        case '2g':
          newQuality = Math.max(20, quality - 30)
          break
        case '3g':
          newQuality = Math.max(40, quality - 15)
          break
        case '4g':
        default:
          newQuality = quality
          break
      }
      
      setAdaptiveQualityValue(newQuality)
    }
  }, [quality, adaptiveQuality])

  // Preload on hover for better UX
  useEffect(() => {
    if (!preloadOnHover) return

    const handleMouseEnter = () => {
      if (!isLoaded) {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = currentSrc
        document.head.appendChild(link)
      }
    }

    const element = ref.current
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter)
      return () => element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [preloadOnHover, currentSrc, isLoaded, ref])

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // Handle image error with fallback
  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    } else {
      setHasError(true)
    }
    onError?.()
  }

  // Generate low-quality placeholder
  const generateLQIP = (src: string, width: number, height: number) => {
    // Simple shimmer effect as base64 data URL
    const shimmer = `
      <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <linearGradient id="g">
            <stop stop-color="#f3f4f6" offset="20%" />
            <stop stop-color="#e5e7eb" offset="50%" />
            <stop stop-color="#f3f4f6" offset="70%" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="#f3f4f6" />
        <rect id="r" width="${width}" height="${height}" fill="url(#g)" opacity="0.5" />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          values="-${width * 2} 0; ${width * 2} 0; ${width * 2} 0"
          dur="1.5s"
          repeatCount="indefinite"
          type="translate" />
      </svg>
    `
    
    return `data:image/svg+xml;base64,${Buffer.from(shimmer).toString('base64')}`
  }

  // Error state
  if (hasError) {
    return (
      <div 
        ref={ref}
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Image failed to load</span>
      </div>
    )
  }

  // Lazy loading logic
  const shouldLoad = !enableLazyLoading || priority || isVisible

  if (!shouldLoad) {
    return (
      <div 
        ref={ref}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    )
  }

  // Image props
  const imageProps = {
    src: currentSrc,
    alt,
    className: `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    priority,
    quality: adaptiveQualityValue,
    placeholder: lowQualityPlaceholder && !blurDataURL ? 'blur' as const : placeholder,
    blurDataURL: blurDataURL || (lowQualityPlaceholder && width && height ? generateLQIP(src, width, height) : undefined),
    sizes,
    fill,
    style: fill ? { objectFit, objectPosition } : undefined,
    loading: loading,
    unoptimized,
    onLoad: handleLoad,
    onError: handleError
  }

  return (
    <div ref={ref} className="relative">
      {fill ? (
        <Image {...imageProps} />
      ) : (
        <Image 
          {...imageProps}
          width={width}
          height={height}
        />
      )}
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  )
}

// Utility hook for image optimization
export function useImageOptimization() {
  const [isSupported, setIsSupported] = useState({
    webp: false,
    avif: false
  })

  useEffect(() => {
    const checkSupport = async () => {
      const webpSupport = await checkImageFormatSupport('webp')
      const avifSupport = await checkImageFormatSupport('avif')
      
      setIsSupported({
        webp: webpSupport,
        avif: avifSupport
      })
    }

    checkSupport()
  }, [])

  return isSupported
}

// Check image format support
function checkImageFormatSupport(format: 'webp' | 'avif'): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    
    const testImages = {
      webp: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    }
    
    img.src = testImages[format]
  })
}

export default OptimizedImage