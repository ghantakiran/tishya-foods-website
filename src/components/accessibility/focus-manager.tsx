'use client'

import { useEffect, useRef } from 'react'

interface FocusManagerProps {
  children: React.ReactNode
  restoreFocus?: boolean
  preventScroll?: boolean
}

export function FocusManager({ 
  children, 
  restoreFocus = true, 
  preventScroll = false 
}: FocusManagerProps) {
  const previousFocus = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (restoreFocus) {
      previousFocus.current = document.activeElement as HTMLElement
    }

    return () => {
      if (restoreFocus && previousFocus.current) {
        previousFocus.current.focus({ preventScroll })
      }
    }
  }, [restoreFocus, preventScroll])

  const getFocusableElements = () => {
    if (!containerRef.current) return []
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="focus-manager"
    >
      {children}
    </div>
  )
}

export function useFocusManager(isActive: boolean) {
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isActive) {
      previousFocus.current = document.activeElement as HTMLElement
    } else if (previousFocus.current) {
      previousFocus.current.focus()
    }
  }, [isActive])

  return {
    restoreFocus: () => {
      if (previousFocus.current) {
        previousFocus.current.focus()
      }
    }
  }
}