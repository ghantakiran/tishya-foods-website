'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mobile loading spinner
interface MobileSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'error'
  className?: string
}

export const MobileSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className 
}: MobileSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'text-orange-500',
    secondary: 'text-gray-400',
    success: 'text-green-500',
    error: 'text-red-500'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

// Mobile loading button
interface MobileLoadingButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const MobileLoadingButton = ({
  children,
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',
  size = 'md',
  className
}: MobileLoadingButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 touch-none select-none'
  
  const sizeClasses = {
    sm: 'min-h-[36px] px-3 text-sm',
    md: 'min-h-[44px] px-4 text-base',
    lg: 'min-h-[52px] px-6 text-lg'
  }

  const variantClasses = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300',
    outline: 'border border-orange-600 text-orange-600 hover:bg-orange-50 disabled:border-orange-300 disabled:text-orange-300'
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <MobileSpinner size="sm" color={variant === 'outline' ? 'primary' : 'secondary'} />
            <span className="ml-2">Loading...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Mobile pull-to-refresh
interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  className?: string
}

export const MobilePullToRefresh = ({
  onRefresh,
  children,
  threshold = 60,
  className
}: MobilePullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing) return
    
    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY
    
    if (deltaY > 0 && window.scrollY === 0) {
      e.preventDefault()
      setPullDistance(Math.min(deltaY, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: Math.min(pullDistance, threshold),
          transform: `translateY(-${Math.min(pullDistance, threshold)}px)`
        }}
      >
        <motion.div
          animate={{
            rotate: isRefreshing ? 360 : pullDistance >= threshold ? 180 : 0
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <RefreshCw 
            size={24} 
            className={cn(
              'text-gray-400',
              pullDistance >= threshold && 'text-orange-500',
              isRefreshing && 'animate-spin'
            )}
          />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Mobile loading overlay
interface MobileLoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
  onCancel?: () => void
}

export const MobileLoadingOverlay = ({
  isVisible,
  message = 'Loading...',
  progress,
  onCancel
}: MobileLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 text-center"
          >
            <MobileSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{message}</h3>
            
            {progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-orange-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
            
            {onCancel && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="mt-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mobile skeleton loader
interface MobileSkeletonProps {
  className?: string
  lines?: number
  avatar?: boolean
  image?: boolean
}

export const MobileSkeleton = ({
  className,
  lines = 3,
  avatar = false,
  image = false
}: MobileSkeletonProps) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {avatar && (
        <div className="w-12 h-12 bg-gray-700 rounded-full mb-4" />
      )}
      
      {image && (
        <div className="w-full h-48 bg-gray-700 rounded-lg mb-4" />
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-gray-700 rounded',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Mobile status indicators
interface MobileStatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'info'
  message: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export const MobileStatusIndicator = ({
  status,
  message,
  onClose,
  autoClose = true,
  duration = 3000
}: MobileStatusIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const statusConfig = {
    loading: {
      icon: <MobileSpinner size="sm" />,
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    success: {
      icon: <CheckCircle size={20} />,
      bgColor: 'bg-green-600',
      textColor: 'text-white'
    },
    error: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    info: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-gray-600',
      textColor: 'text-white'
    }
  }

  const config = statusConfig[status]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={cn(
            'fixed top-4 left-4 right-4 z-50 rounded-lg p-4 shadow-lg',
            'flex items-center space-x-3',
            config.bgColor,
            config.textColor
          )}
          style={{ marginTop: 'env(safe-area-inset-top)' }}
        >
          {config.icon}
          <span className="flex-1 text-sm font-medium">{message}</span>
          {onClose && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsVisible(false)
                onClose()
              }}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mobile progress bar
interface MobileProgressBarProps {
  progress: number
  showLabel?: boolean
  className?: string
}

export const MobileProgressBar = ({
  progress,
  showLabel = true,
  className
}: MobileProgressBarProps) => {
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Export all components
export {
  MobileSpinner,
  MobileLoadingButton,
  MobilePullToRefresh,
  MobileLoadingOverlay,
  MobileSkeleton,
  MobileStatusIndicator,
  MobileProgressBar
}