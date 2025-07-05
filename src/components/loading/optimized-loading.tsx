'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-cream-200'
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: ''
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-earth-800 rounded-lg shadow-sm border p-4 space-y-4">
      <Skeleton variant="rounded" height={200} className="w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  )
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'gray' | 'white'
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const colorClasses = {
    primary: 'border-primary-600',
    gray: 'border-earth-600',
    white: 'border-white'
  }

  return (
    <motion.div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

// Progressive Image Loading
interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
}

export function ProgressiveImage({
  src,
  alt,
  className,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkMyMC41NTIzIDE2IDIxIDE1LjU1MjMgMjEgMTVDMjEgMTQuNDQ3NyAyMC41NTIzIDE0IDIwIDE0QzE5LjQ0NzcgMTQgMTkgMTQuNDQ3NyAxOSAxNUMxOSAxNS41NTIzIDE5LjQ0NzcgMTYgMjAgMTZaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxwYXRoIGQ9Ik0yNyAyMkwyNCAyMEwyMSAyMkwxNCAyNkgyNkwyNyAyMloiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
  onLoad
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(placeholder)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setImageLoaded(true)
      onLoad?.()
    }
    img.src = src
  }, [src, onLoad])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <NextImage
        src={imageSrc}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-70"
        )}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  )
}