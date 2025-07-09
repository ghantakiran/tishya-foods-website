'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface FocusIndicatorProps {
  children: React.ReactNode
  className?: string
  showOnFocus?: boolean
  showOnHover?: boolean
  indicatorColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  indicatorStyle?: 'outline' | 'shadow' | 'underline' | 'background'
  offset?: number
}

export const EnhancedFocusIndicator = ({
  children,
  className,
  showOnFocus = true,
  showOnHover = false,
  indicatorColor = 'primary',
  indicatorStyle = 'outline',
  offset = 2
}: FocusIndicatorProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    primary: 'ring-blue-500 shadow-blue-500/50 bg-blue-500/10 border-blue-500',
    secondary: 'ring-gray-500 shadow-gray-500/50 bg-gray-500/10 border-gray-500',
    success: 'ring-green-500 shadow-green-500/50 bg-green-500/10 border-green-500',
    warning: 'ring-yellow-500 shadow-yellow-500/50 bg-yellow-500/10 border-yellow-500',
    error: 'ring-red-500 shadow-red-500/50 bg-red-500/10 border-red-500'
  }

  const shouldShowIndicator = (showOnFocus && isFocused) || (showOnHover && isHovered)

  const getIndicatorStyles = () => {
    const colors = colorClasses[indicatorColor]
    
    switch (indicatorStyle) {
      case 'outline':
        return `ring-2 ${colors.split(' ')[0]} ring-offset-2 ring-offset-gray-900`
      case 'shadow':
        return `shadow-lg ${colors.split(' ')[1]}`
      case 'underline':
        return `border-b-2 ${colors.split(' ')[3]}`
      case 'background':
        return colors.split(' ')[2]
      default:
        return `ring-2 ${colors.split(' ')[0]} ring-offset-2 ring-offset-gray-900`
    }
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {shouldShowIndicator && (
        <motion.div
          className={`absolute inset-0 pointer-events-none rounded-lg ${getIndicatorStyles()}`}
          style={{
            margin: `-${offset}px`,
            padding: `${offset}px`
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      )}
    </div>
  )
}

// High contrast focus indicator for better visibility
export const HighContrastFocusIndicator = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <EnhancedFocusIndicator
      className={className}
      indicatorColor="primary"
      indicatorStyle="outline"
      offset={4}
    >
      {children}
    </EnhancedFocusIndicator>
  )
}

// Focus trap component for modals and menus
export const FocusTrap = ({ children, active = true }: { children: React.ReactNode; active?: boolean }) => {
  useEffect(() => {
    if (!active) return

    const focusableElements = [
      'a[href]:not([tabindex="-1"])',
      'area[href]:not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      'iframe:not([tabindex="-1"])',
      'object:not([tabindex="-1"])',
      'embed:not([tabindex="-1"])',
      '[contenteditable]:not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    const modal = document.querySelector('[role="dialog"]') as HTMLElement
    if (!modal) return

    const focusableContent = modal.querySelectorAll(focusableElements) as NodeListOf<HTMLElement>
    const firstFocusableElement = focusableContent[0]
    const lastFocusableElement = focusableContent[focusableContent.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    firstFocusableElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active])

  return <>{children}</>
}

// Skip link component for keyboard navigation
export const SkipLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[9999] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      onClick={(e) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
          if (target instanceof HTMLElement) {
            target.focus()
          }
        }
      }}
    >
      {children}
    </a>
  )
}

// Keyboard navigation hints
export const KeyboardHints = ({ hints }: { hints: Array<{ key: string; action: string }> }) => {
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault()
        setShowHints(!showHints)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHints])

  if (!showHints) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-50 max-w-sm"
      role="dialog"
      aria-labelledby="keyboard-hints-title"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 id="keyboard-hints-title" className="text-lg font-semibold text-gray-100">
          Keyboard Shortcuts
        </h3>
        <button
          onClick={() => setShowHints(false)}
          className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Close keyboard hints"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        {hints.map((hint, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{hint.action}</span>
            <kbd className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs font-mono">
              {hint.key}
            </kbd>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400">
        Press F1 or Ctrl+/ to toggle this help
      </div>
    </motion.div>
  )
}

export default EnhancedFocusIndicator