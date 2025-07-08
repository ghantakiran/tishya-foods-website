'use client'

import { forwardRef } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { ScreenReaderOnly } from './screen-reader'
import { Loader2 } from 'lucide-react'

interface AccessibleButtonProps extends ButtonProps {
  children: React.ReactNode
  description?: string
  isLoading?: boolean
  loadingText?: string
  confirmAction?: boolean
  confirmText?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    description, 
    isLoading = false,
    loadingText = 'Loading...',
    confirmAction = false,
    confirmText = 'Press Enter to confirm',
    disabled,
    onClick,
    className = '',
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (confirmAction) {
        const confirmed = window.confirm(confirmText)
        if (!confirmed) return
      }
      onClick?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (confirmAction) {
          const confirmed = window.confirm(confirmText)
          if (!confirmed) return
        }
        ;(e.target as HTMLButtonElement).click()
      }
    }

    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200 ease-in-out
          ${isLoading ? 'cursor-wait' : ''}
          ${className}
        `}
        aria-describedby={description ? `${props.id}-desc` : undefined}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
          </>
        )}
        {children}
        {description && (
          <ScreenReaderOnly id={`${props.id}-desc`}>
            {description}
          </ScreenReaderOnly>
        )}
      </Button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

interface AccessibleIconButtonProps extends Omit<AccessibleButtonProps, 'children'> {
  icon: React.ReactNode
  label: string
  showLabel?: boolean
}

export const AccessibleIconButton = forwardRef<HTMLButtonElement, AccessibleIconButtonProps>(
  ({ icon, label, showLabel = false, className = '', ...props }, ref) => {
    return (
      <AccessibleButton
        ref={ref}
        aria-label={label}
        className={`
          ${showLabel ? 'flex items-center gap-2' : 'p-2'}
          ${className}
        `}
        {...props}
      >
        {icon}
        {showLabel ? (
          <span>{label}</span>
        ) : (
          <ScreenReaderOnly>{label}</ScreenReaderOnly>
        )}
      </AccessibleButton>
    )
  }
)

AccessibleIconButton.displayName = 'AccessibleIconButton'