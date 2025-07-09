'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ScreenReaderOnly } from './screen-reader'

interface AccessibleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  decorative?: boolean
  caption?: string
  longDescription?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  fallbackSrc?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  className = '',
  decorative = false,
  caption,
  longDescription,
  priority = false,
  sizes,
  fill = false,
  fallbackSrc = '/images/placeholder.jpg',
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}: AccessibleImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // For decorative images, use empty alt text and aria-hidden
  const imageAlt = decorative ? '' : alt
  const ariaHidden = decorative ? true : undefined

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImageSrc(fallbackSrc)
      setHasError(true)
    }
    onError?.()
  }

  const handleLoad = () => {
    onLoad?.()
  }

  const imageProps = {
    src: imageSrc,
    alt: imageAlt,
    onError: handleError,
    onLoad: handleLoad,
    className: `transition-opacity duration-200 ${className}`,
    priority,
    sizes,
    loading: loading,
    'aria-hidden': ariaHidden,
    ...props
  }

  return (
    <figure className="relative">
      {fill ? (
        <Image
          {...imageProps}
          fill
          alt={imageAlt}
        />
      ) : (
        <Image
          {...imageProps}
          width={width || 400}
          height={height || 300}
          alt={imageAlt}
        />
      )}

      {hasError && !decorative && (
        <ScreenReaderOnly>
          Image failed to load. Showing fallback image.
        </ScreenReaderOnly>
      )}

      {longDescription && !decorative && (
        <ScreenReaderOnly>
          {longDescription}
        </ScreenReaderOnly>
      )}

      {caption && (
        <figcaption className="mt-2 text-sm text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

interface AccessibleAvatarProps {
  src?: string
  alt: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallbackInitials?: string
}

export function AccessibleAvatar({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  fallbackInitials
}: AccessibleAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  }

  const initials = fallbackInitials || 
    name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  if (!src || imageFailed) {
    return (
      <div
        className={`
          ${sizeClasses[size]}
          bg-gray-600 text-gray-200
          flex items-center justify-center
          rounded-full font-medium
          ${className}
        `}
        role="img"
        aria-label={`${name}'s avatar`}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-full object-cover"
        onError={() => setImageFailed(true)}
        sizes="(max-width: 768px) 100px, 150px"
      />
    </div>
  )
}

interface AccessibleIconProps {
  icon: React.ReactNode
  label: string
  decorative?: boolean
  className?: string
}

export function AccessibleIcon({
  icon,
  label,
  decorative = false,
  className = ''
}: AccessibleIconProps) {
  if (decorative) {
    return (
      <span className={className} aria-hidden="true">
        {icon}
      </span>
    )
  }

  return (
    <span className={className} role="img" aria-label={label}>
      {icon}
      <ScreenReaderOnly>{label}</ScreenReaderOnly>
    </span>
  )
}