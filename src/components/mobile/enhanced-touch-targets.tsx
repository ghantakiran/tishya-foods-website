'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TouchTargetProps {
  children: React.ReactNode
  className?: string
  onTap?: (event: React.TouchEvent | React.MouseEvent) => void
  onLongPress?: (event: React.TouchEvent | React.MouseEvent) => void
  hapticFeedback?: boolean
  rippleEffect?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'rounded' | 'circle' | 'square'
  feedback?: 'scale' | 'opacity' | 'shadow' | 'none'
}

const TouchTarget = forwardRef<HTMLDivElement, TouchTargetProps>(({
  children,
  className,
  onTap,
  onLongPress,
  hapticFeedback = true,
  rippleEffect = true,
  disabled = false,
  size = 'md',
  shape = 'rounded',
  feedback = 'scale',
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number; size: number }>>([])
  const touchStartTime = useRef<number>(0)
  const touchTimer = useRef<NodeJS.Timeout | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  // Size variants
  const sizeClasses = {
    sm: 'min-w-[36px] min-h-[36px] p-1',
    md: 'min-w-[44px] min-h-[44px] p-2',
    lg: 'min-w-[52px] min-h-[52px] p-3',
    xl: 'min-w-[60px] min-h-[60px] p-4'
  }

  // Shape variants
  const shapeClasses = {
    rounded: 'rounded-lg',
    circle: 'rounded-full',
    square: 'rounded-none'
  }

  // Feedback variants
  const feedbackClasses = {
    scale: isPressed ? 'scale-95' : 'scale-100',
    opacity: isPressed ? 'opacity-70' : 'opacity-100',
    shadow: isPressed ? 'shadow-inner' : 'shadow-md',
    none: ''
  }

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback) return
    
    // Use the Vibration API if available
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100]
      }
      navigator.vibrate(patterns[type])
    }
  }

  // Create ripple effect
  const createRipple = (event: React.TouchEvent | React.MouseEvent) => {
    if (!rippleEffect || disabled) return

    const rect = elementRef.current?.getBoundingClientRect()
    if (!rect) return

    const size = Math.max(rect.width, rect.height)
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left - size / 2
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top - size / 2

    const ripple = {
      id: Date.now().toString(),
      x,
      y,
      size
    }

    setRipples(prev => [...prev, ripple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id))
    }, 600)
  }

  // Handle touch start
  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled) return

    setIsPressed(true)
    touchStartTime.current = Date.now()
    createRipple(event)
    triggerHapticFeedback('light')

    // Long press detection
    if (onLongPress) {
      touchTimer.current = setTimeout(() => {
        triggerHapticFeedback('medium')
        onLongPress(event)
      }, 500)
    }
  }

  // Handle touch end
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (disabled) return

    setIsPressed(false)
    
    if (touchTimer.current) {
      clearTimeout(touchTimer.current)
      touchTimer.current = null
    }

    // Determine if this was a tap
    const touchDuration = Date.now() - touchStartTime.current
    if (touchDuration < 500 && onTap) {
      triggerHapticFeedback('light')
      onTap(event)
    }
  }

  // Handle mouse events for desktop compatibility
  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return
    setIsPressed(true)
    createRipple(event)
  }

  const handleMouseUp = (event: React.MouseEvent) => {
    if (disabled) return
    setIsPressed(false)
    if (onTap) onTap(event)
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
  }

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (touchTimer.current) {
        clearTimeout(touchTimer.current)
      }
    }
  }, [])

  return (
    <motion.div
      ref={ref || elementRef}
      className={cn(
        'relative inline-flex items-center justify-center',
        'touch-none select-none cursor-pointer',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
        'focus:ring-offset-gray-900',
        sizeClasses[size],
        shapeClasses[shape],
        feedbackClasses[feedback],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={isPressed}
      aria-disabled={disabled}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation'
      }}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              opacity: 0.6
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
})

TouchTarget.displayName = 'TouchTarget'

// Enhanced Button component with touch optimization
interface TouchButtonProps extends TouchTargetProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  loading?: boolean
  iconOnly?: boolean
}

export const TouchButton = forwardRef<HTMLDivElement, TouchButtonProps>(({
  children,
  variant = 'primary',
  loading = false,
  iconOnly = false,
  disabled,
  className,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
    outline: 'bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600 border',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300'
  }

  const sizeClass = iconOnly ? 'min-w-[44px] min-h-[44px]' : 'min-w-[44px] min-h-[44px] px-4'

  return (
    <TouchTarget
      ref={ref}
      className={cn(
        'font-medium transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClass,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
          {!iconOnly && <span className="ml-2">Loading...</span>}
        </div>
      ) : (
        children
      )}
    </TouchTarget>
  )
})

TouchButton.displayName = 'TouchButton'

// Enhanced Link component with touch optimization
interface TouchLinkProps extends TouchTargetProps {
  href: string
  external?: boolean
}

export const TouchLink = forwardRef<HTMLDivElement, TouchLinkProps>(({
  children,
  href,
  external = false,
  className,
  onTap,
  ...props
}, ref) => {
  const handleTap = (event: React.TouchEvent | React.MouseEvent) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = href
    }
    onTap?.(event)
  }

  return (
    <TouchTarget
      ref={ref}
      className={cn(
        'text-orange-400 hover:text-orange-300 transition-colors duration-200',
        'focus:text-orange-300',
        className
      )}
      onTap={handleTap}
      {...props}
    >
      {children}
    </TouchTarget>
  )
})

TouchLink.displayName = 'TouchLink'

// Touch-optimized input wrapper
interface TouchInputWrapperProps {
  children: React.ReactNode
  label?: string
  error?: string
  required?: boolean
  className?: string
}

export const TouchInputWrapper = ({
  children,
  label,
  error,
  required = false,
  className
}: TouchInputWrapperProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}

// Touch-optimized card component
interface TouchCardProps {
  children: React.ReactNode
  className?: string
  onTap?: () => void
  hover?: boolean
}

export const TouchCard = ({
  children,
  className,
  onTap,
  hover = true
}: TouchCardProps) => {
  return (
    <TouchTarget
      className={cn(
        'bg-gray-800 border border-gray-700 rounded-xl p-4',
        'transition-all duration-200',
        hover && 'hover:bg-gray-750 hover:border-gray-600',
        onTap && 'cursor-pointer',
        className
      )}
      onTap={onTap}
      feedback={onTap ? 'scale' : 'none'}
    >
      {children}
    </TouchTarget>
  )
}

export default TouchTarget