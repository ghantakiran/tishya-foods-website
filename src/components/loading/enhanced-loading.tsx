'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dots' | 'pulse' | 'bars'
  color?: 'primary' | 'secondary' | 'accent'
}

export function LoadingSpinner({ size = 'md', variant = 'default', color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-400',
    accent: 'text-green-500'
  }

  if (variant === 'dots') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 bg-current rounded-full ${colorClasses[color]}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full bg-current`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      />
    )
  }

  if (variant === 'bars') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-1 bg-current ${colorClasses[color]}`}
            style={{ height: size === 'sm' ? '16px' : size === 'md' ? '24px' : '32px' }}
            animate={{
              scaleY: [1, 2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={colorClasses[color]}
    >
      <Loader2 className={sizeClasses[size]} />
    </motion.div>
  )
}

interface LoadingStateProps {
  loading: boolean
  error?: Error | null
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  onRetry?: () => void
  retryText?: string
}

export function LoadingState({
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
  onRetry,
  retryText = 'Try Again'
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        {loadingComponent || <LoadingSpinner size="lg" />}
      </div>
    )
  }

  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
        >
          <AlertCircle className="w-8 h-8 text-red-400" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-400 mb-4 max-w-md">
          {error.message || 'An unexpected error occurred while loading this content.'}
        </p>

        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryText}
          </Button>
        )}
      </div>
    )
  }

  return <>{children}</>
}

interface ProgressiveLoadingProps {
  stages: Array<{
    duration: number
    message: string
  }>
  onComplete?: () => void
}

export function ProgressiveLoading({ stages, onComplete }: ProgressiveLoadingProps) {
  const [currentStage, setCurrentStage] = useState(0)

  useEffect(() => {
    if (currentStage >= stages.length) {
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1)
    }, stages[currentStage].duration)

    return () => clearTimeout(timer)
  }, [currentStage, stages, onComplete])

  const progress = ((currentStage + 1) / stages.length) * 100

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <LoadingSpinner size="lg" />
      
      <div className="text-center space-y-4 max-w-md">
        <h3 className="text-lg font-semibold text-gray-100">
          {currentStage < stages.length ? stages[currentStage].message : 'Complete!'}
        </h3>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <p className="text-sm text-gray-400">
          Step {Math.min(currentStage + 1, stages.length)} of {stages.length}
        </p>
      </div>
    </div>
  )
}

// Hook for managing loading states
export function useLoadingState(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState<Error | null>(null)

  const startLoading = useCallback(() => {
    setLoading(true)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  const setLoadingError = useCallback((error: Error | string) => {
    setLoading(false)
    setError(typeof error === 'string' ? new Error(error) : error)
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    reset
  }
}