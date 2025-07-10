'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

interface KeyboardNavigationProps {
  children: React.ReactNode
  enabled?: boolean
  showHints?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
}

export const EnhancedKeyboardNavigation = ({
  children,
  enabled = true,
  showHints = false,
  onKeyDown
}: KeyboardNavigationProps) => {
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([])
  const [showKeyboardHints, setShowKeyboardHints] = useState(showHints)
  const containerRef = useRef<HTMLDivElement>(null)

  const focusableSelectors = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]

    // Sort by tab order
    elements.sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') || '0')
      const bTabIndex = parseInt(b.getAttribute('tabindex') || '0')
      return aTabIndex - bTabIndex
    })

    setFocusableElements(elements)
  }, [focusableSelectors])

  useEffect(() => {
    updateFocusableElements()
    
    const observer = new MutationObserver(updateFocusableElements)
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tabindex', 'disabled']
      })
    }

    return () => observer.disconnect()
  }, [updateFocusableElements])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || focusableElements.length === 0) return

    onKeyDown?.(e)

    switch (e.key) {
      case 'Tab':
        if (e.shiftKey) {
          // Shift + Tab: Previous element
          setCurrentFocusIndex(prev => 
            prev <= 0 ? focusableElements.length - 1 : prev - 1
          )
        } else {
          // Tab: Next element
          setCurrentFocusIndex(prev => 
            prev >= focusableElements.length - 1 ? 0 : prev + 1
          )
        }
        break
        
      case 'ArrowDown':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          setCurrentFocusIndex(prev => 
            prev >= focusableElements.length - 1 ? 0 : prev + 1
          )
        }
        break
        
      case 'ArrowUp':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          setCurrentFocusIndex(prev => 
            prev <= 0 ? focusableElements.length - 1 : prev - 1
          )
        }
        break
        
      case 'Home':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          setCurrentFocusIndex(0)
        }
        break
        
      case 'End':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          setCurrentFocusIndex(focusableElements.length - 1)
        }
        break
        
      case 'F1':
        e.preventDefault()
        setShowKeyboardHints(!showKeyboardHints)
        break
        
      case 'Escape':
        setCurrentFocusIndex(-1)
        break
    }
  }, [enabled, focusableElements, onKeyDown, showKeyboardHints])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  useEffect(() => {
    if (currentFocusIndex >= 0 && focusableElements[currentFocusIndex]) {
      focusableElements[currentFocusIndex].focus()
    }
  }, [currentFocusIndex, focusableElements])

  const keyboardHints = [
    { key: 'Tab', action: 'Navigate forward' },
    { key: 'Shift + Tab', action: 'Navigate backward' },
    { key: 'Ctrl + ↑/↓', action: 'Quick navigation' },
    { key: 'Ctrl + Home', action: 'Go to first element' },
    { key: 'Ctrl + End', action: 'Go to last element' },
    { key: 'Enter', action: 'Activate element' },
    { key: 'Space', action: 'Activate buttons/checkboxes' },
    { key: 'Escape', action: 'Close dialogs/menus' },
    { key: 'F1', action: 'Toggle this help' }
  ]

  return (
    <div ref={containerRef} className="relative">
      {children}
      
      {/* Keyboard Hints Modal */}
      <AnimatePresence>
        {showKeyboardHints && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={() => setShowKeyboardHints(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600"
              role="dialog"
              aria-labelledby="keyboard-hints-title"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="keyboard-hints-title" className="text-xl font-bold text-gray-100">
                  Keyboard Navigation
                </h2>
                <button
                  onClick={() => setShowKeyboardHints(false)}
                  className="text-gray-400 hover:text-gray-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close keyboard hints"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                {keyboardHints.map((hint, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{hint.action}</span>
                    <kbd className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs font-mono">
                      {hint.key}
                    </kbd>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-600">
                <p className="text-xs text-gray-400 text-center">
                  Press F1 to toggle this help anytime
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing focus within a component
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (previousFocus.current) {
      previousFocus.current.focus()
      previousFocus.current = null
    }
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return {
    focusedElement,
    setFocusedElement,
    saveFocus,
    restoreFocus,
    trapFocus
  }
}

// Component for managing focus in lists
interface FocusableListProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  wrap?: boolean
  className?: string
}

export const FocusableList = ({
  children,
  orientation = 'vertical',
  wrap = false,
  className
}: FocusableListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!listRef.current) return

    const items = Array.from(listRef.current.children) as HTMLElement[]
    if (items.length === 0) return

    let newIndex = currentIndex

    switch (e.key) {
      case 'ArrowUp':
        if (orientation === 'vertical') {
          e.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : (wrap ? items.length - 1 : 0)
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical') {
          e.preventDefault()
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (wrap ? 0 : items.length - 1)
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          e.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : (wrap ? items.length - 1 : 0)
        }
        break
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          e.preventDefault()
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (wrap ? 0 : items.length - 1)
        }
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = items.length - 1
        break
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      const focusableElement = items[newIndex].querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement
      focusableElement?.focus()
    }
  }

  useEffect(() => {
    const currentRef = listRef.current
    if (currentRef) {
      currentRef.addEventListener('keydown', handleKeyDown)
      return () => currentRef.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, orientation, wrap])

  return (
    <div
      ref={listRef}
      className={className}
      role="list"
      aria-orientation={orientation}
    >
      {children}
    </div>
  )
}

// Component for roving tabindex pattern
interface RovingTabIndexProps {
  children: React.ReactNode
  defaultIndex?: number
  orientation?: 'horizontal' | 'vertical' | 'both'
  className?: string
}

export const RovingTabIndex = ({
  children,
  defaultIndex = 0,
  orientation = 'both',
  className
}: RovingTabIndexProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!containerRef.current) return

    const items = Array.from(
      containerRef.current.querySelectorAll('[role="tab"], [role="menuitem"], [role="option"]')
    ) as HTMLElement[]

    if (items.length === 0) return

    let newIndex = activeIndex

    switch (e.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault()
          newIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault()
          newIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault()
          newIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
        }
        break
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault()
          newIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0
        }
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = items.length - 1
        break
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
      items[newIndex].focus()
    }
  }

  useEffect(() => {
    const currentRef = containerRef.current
    if (currentRef) {
      currentRef.addEventListener('keydown', handleKeyDown)
      return () => currentRef.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, orientation])

  // Update tabindex attributes
  useEffect(() => {
    if (!containerRef.current) return

    const items = Array.from(
      containerRef.current.querySelectorAll('[role="tab"], [role="menuitem"], [role="option"]')
    ) as HTMLElement[]

    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === activeIndex ? '0' : '-1')
    })
  }, [activeIndex])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default EnhancedKeyboardNavigation