'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  quality?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
  sizes?: string
  blurDataURL?: string
}

export function LazyImage({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkMyMC41NTIzIDE2IDIxIDE1LjU1MjMgMjEgMTVDMjEgMTQuNDQ3NyAyMC41NTIzIDE0IDIwIDE0QzE5LjQ0NzcgMTQgMTkgMTQuNDQ3NyAxOSAxNUMxOSAxNS41NTIzIDE5LjQ0NzcgMTYgMjAgMTZaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxwYXRoIGQ9Ik0yNyAyMkwyNCAyMEwyMSAyMkwxNCAyNkgyNkwyNyAyMloiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+',
  quality = 75,
  priority = false,
  onLoad,
  onError,
  sizes,
  blurDataURL
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    observerRef.current = observer

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    onError?.()
  }

  const optimizedSrc = isInView ? `${src}?quality=${quality}` : placeholder

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden bg-cream-100", className)}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 bg-earth-300 rounded"
          />
        </div>
      )}

      {/* Main Image */}
      {isInView && (
        <motion.img
          src={optimizedSrc}
          alt={alt}
          className={cn("w-full h-full object-cover", {
            "opacity-0": !isLoaded,
            "opacity-100": isLoaded
          })}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
          <div className="text-center text-earth-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-earth-300 rounded" />
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {/* Loading Shimmer Effect */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
      )}
    </div>
  )
}

// Shimmer animation CSS (to be added to globals.css)
export const shimmerCSS = `
.shimmer {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`