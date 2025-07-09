'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

// Screen reader only text component
export const ScreenReaderOnly = ({ 
  children, 
  as: Component = 'span' 
}: { 
  children: React.ReactNode; 
  as?: React.ElementType 
}) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// Enhanced visually hidden component with focus support
export const VisuallyHidden = ({ 
  children, 
  focusable = false,
  as: Component = 'span',
  className = ''
}: { 
  children: React.ReactNode; 
  focusable?: boolean;
  as?: React.ElementType;
  className?: string;
}) => {
  return (
    <Component 
      className={`
        ${focusable ? 'sr-only focus:not-sr-only' : 'sr-only'}
        ${className}
      `}
    >
      {children}
    </Component>
  )
}

// Live region for dynamic content announcements
interface LiveRegionProps {
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export const LiveRegion = ({
  children,
  priority = 'polite',
  atomic = false,
  relevant = 'additions text',
  className
}: LiveRegionProps) => {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={`sr-only ${className}`}
      role="status"
    >
      {children}
    </div>
  )
}

// Enhanced product description for screen readers
interface ProductDescriptionProps {
  product: {
    name: string
    description: string
    price: number
    originalPrice?: number
    discount?: number
    nutritionalInfo: {
      protein: number
      calories: number
      fat: number
      carbs: number
    }
    isOrganic?: boolean
    isGlutenFree?: boolean
    isVegan?: boolean
    stock: number
    rating?: number
    reviewCount?: number
  }
  includeNutrition?: boolean
  includeAvailability?: boolean
  includePricing?: boolean
}

export const EnhancedProductDescription = ({
  product,
  includeNutrition = true,
  includeAvailability = true,
  includePricing = true
}: ProductDescriptionProps) => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  
  const buildDescription = () => {
    const parts = []
    
    // Basic product info
    parts.push(`${product.name}. ${product.description}`)
    
    // Pricing information
    if (includePricing) {
      if (product.originalPrice && product.originalPrice > product.price) {
        const savings = product.originalPrice - product.price
        const discountPercent = Math.round((savings / product.originalPrice) * 100)
        parts.push(`On sale for ${formatPrice(product.price)}, originally ${formatPrice(product.originalPrice)}. Save ${formatPrice(savings)} (${discountPercent}% off)`)
      } else {
        parts.push(`Priced at ${formatPrice(product.price)}`)
      }
    }
    
    // Dietary information
    const dietaryInfo = []
    if (product.isOrganic) dietaryInfo.push('organic')
    if (product.isGlutenFree) dietaryInfo.push('gluten-free')
    if (product.isVegan) dietaryInfo.push('vegan')
    
    if (dietaryInfo.length > 0) {
      parts.push(`This product is ${dietaryInfo.join(', ')}`)
    }
    
    // Nutritional information
    if (includeNutrition) {
      parts.push(`Nutrition per serving: ${product.nutritionalInfo.protein} grams protein, ${product.nutritionalInfo.calories} calories, ${product.nutritionalInfo.fat} grams fat, ${product.nutritionalInfo.carbs} grams carbohydrates`)
    }
    
    // Availability
    if (includeAvailability) {
      if (product.stock > 10) {
        parts.push('In stock')
      } else if (product.stock > 0) {
        parts.push(`Low stock: only ${product.stock} items remaining`)
      } else {
        parts.push('Out of stock')
      }
    }
    
    // Rating information
    if (product.rating && product.reviewCount) {
      parts.push(`Average rating: ${product.rating} out of 5 stars, based on ${product.reviewCount} customer reviews`)
    }
    
    return parts.join('. ')
  }
  
  return (
    <ScreenReaderOnly>
      {buildDescription()}
    </ScreenReaderOnly>
  )
}

// Enhanced image component with detailed alt text
interface EnhancedImageProps {
  src: string
  alt: string
  decorative?: boolean
  longDescription?: string
  caption?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
}

export const EnhancedImage = ({
  src,
  alt,
  decorative = false,
  longDescription,
  caption,
  className,
  width,
  height,
  priority = false,
  onLoad
}: EnhancedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const descriptionId = `img-desc-${Math.random().toString(36).substring(7)}`
  
  const handleLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }
  
  const handleError = () => {
    setImageError(true)
  }
  
  if (decorative) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={className}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
      />
    )
  }
  
  return (
    <figure className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        aria-describedby={longDescription ? descriptionId : undefined}
      />
      
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-300">
          <div className="text-center">
            <p>Image failed to load</p>
            <p className="text-sm mt-1">Alt text: {alt}</p>
          </div>
        </div>
      )}
      
      {longDescription && (
        <ScreenReaderOnly>
          <div id={descriptionId}>
            {longDescription}
          </div>
        </ScreenReaderOnly>
      )}
      
      {caption && (
        <figcaption className="text-sm text-gray-400 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Table with enhanced screen reader support
interface AccessibleTableProps {
  headers: string[]
  data: Array<Record<string, any>>
  caption?: string
  summary?: string
  className?: string
}

export const AccessibleTable = ({
  headers,
  data,
  caption,
  summary,
  className
}: AccessibleTableProps) => {
  const tableId = `table-${Math.random().toString(36).substring(7)}`
  
  return (
    <div className="overflow-x-auto">
      <table 
        id={tableId}
        className={`w-full border-collapse ${className}`}
        aria-label={caption}
        aria-describedby={summary ? `${tableId}-summary` : undefined}
      >
        {caption && (
          <caption className="text-lg font-semibold text-gray-100 mb-4">
            {caption}
          </caption>
        )}
        
        {summary && (
          <ScreenReaderOnly>
            <div id={`${tableId}-summary`}>
              {summary}
            </div>
          </ScreenReaderOnly>
        )}
        
        <thead>
          <tr className="border-b border-gray-600">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left p-3 text-gray-100 font-semibold"
                scope="col"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-700">
              {headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className="p-3 text-gray-300"
                  {...(colIndex === 0 ? { scope: 'row' } : {})}
                >
                  {row[header.toLowerCase().replace(/\s+/g, '_')]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Navigation breadcrumb with screen reader support
interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    current?: boolean
  }>
  className?: string
}

export const AccessibleBreadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2" aria-hidden="true">
                /
              </span>
            )}
            
            {item.href && !item.current ? (
              <a
                href={item.href}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span 
                className={`${item.current ? 'text-gray-100 font-medium' : 'text-gray-400'}`}
                {...(item.current ? { 'aria-current': 'page' } : {})}
              >
                {item.label}
              </span>
            )}
            
            {item.current && (
              <ScreenReaderOnly>
                (current page)
              </ScreenReaderOnly>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Progress indicator with detailed announcements
interface AccessibleProgressProps {
  value: number
  max: number
  label: string
  description?: string
  showPercentage?: boolean
  className?: string
}

export const AccessibleProgress = ({
  value,
  max,
  label,
  description,
  showPercentage = true,
  className
}: AccessibleProgressProps) => {
  const percentage = Math.round((value / max) * 100)
  const progressId = `progress-${Math.random().toString(36).substring(7)}`
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={progressId} className="text-sm font-medium text-gray-100">
          {label}
        </label>
        {showPercentage && (
          <span className="text-sm text-gray-400">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          id={progressId}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}% complete`}
          aria-describedby={description ? `${progressId}-desc` : undefined}
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {description && (
        <p id={`${progressId}-desc`} className="text-sm text-gray-400 mt-1">
          {description}
        </p>
      )}
      
      <ScreenReaderOnly>
        {percentage}% complete. {value} out of {max} {label.toLowerCase()}.
      </ScreenReaderOnly>
    </div>
  )
}

// Enhanced form section with proper landmarks
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const AccessibleFormSection = ({
  title,
  description,
  children,
  className
}: FormSectionProps) => {
  const sectionId = `section-${Math.random().toString(36).substring(7)}`
  
  return (
    <section 
      className={className}
      aria-labelledby={`${sectionId}-title`}
      aria-describedby={description ? `${sectionId}-desc` : undefined}
    >
      <h2 id={`${sectionId}-title`} className="text-lg font-semibold text-gray-100 mb-2">
        {title}
      </h2>
      
      {description && (
        <p id={`${sectionId}-desc`} className="text-sm text-gray-400 mb-4">
          {description}
        </p>
      )}
      
      {children}
    </section>
  )
}

// Status message component with appropriate roles
interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export const AccessibleStatusMessage = ({
  type,
  message,
  dismissible = false,
  onDismiss,
  className
}: StatusMessageProps) => {
  const [isVisible, setIsVisible] = useState(true)
  
  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }
  
  const roleMap = {
    success: 'status',
    error: 'alert',
    warning: 'alert',
    info: 'status'
  }
  
  const colorMap = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-black',
    info: 'bg-blue-600 text-white'
  }
  
  if (!isVisible) return null
  
  return (
    <div
      role={roleMap[type]}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`
        ${colorMap[type]}
        p-4 rounded-lg flex items-center justify-between
        ${className}
      `}
    >
      <div className="flex items-center">
        <span className="font-medium mr-2">
          {type.charAt(0).toUpperCase() + type.slice(1)}:
        </span>
        <span>{message}</span>
      </div>
      
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="ml-4 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label="Dismiss this message"
        >
          <VolumeX className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export {
  ScreenReaderOnly,
  VisuallyHidden,
  LiveRegion,
  EnhancedProductDescription,
  EnhancedImage,
  AccessibleTable,
  AccessibleBreadcrumb,
  AccessibleProgress,
  AccessibleFormSection,
  AccessibleStatusMessage
}