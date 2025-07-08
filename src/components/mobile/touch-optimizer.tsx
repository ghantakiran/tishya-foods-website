'use client'

import { useEffect, useRef } from 'react'
import { isTouchDevice, makeTouchFriendly, preventDoubleTabZoom, enhanceMobileScroll } from '@/lib/touch'

interface TouchOptimizerProps {
  children: React.ReactNode
  enableScrollOptimization?: boolean
  preventDoubleTabZoom?: boolean
  optimizeButtons?: boolean
  enableTouchFeedback?: boolean
}

export function TouchOptimizer({
  children,
  enableScrollOptimization = true,
  preventDoubleTabZoom: preventZoom = true,
  optimizeButtons = true,
  enableTouchFeedback = true
}: TouchOptimizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTouchDevice() || !containerRef.current) return

    const container = containerRef.current

    // Enable scroll optimization
    if (enableScrollOptimization) {
      enhanceMobileScroll(container)
    }

    // Prevent double tap zoom
    if (preventZoom) {
      preventDoubleTabZoom(container)
    }

    // Optimize buttons and interactive elements
    if (optimizeButtons) {
      const buttons = container.querySelectorAll('button, [role="button"], a, input, select, textarea')
      buttons.forEach((button) => {
        if (button instanceof HTMLElement) {
          makeTouchFriendly(button)
        }
      })
    }

    // Add touch feedback styles
    if (enableTouchFeedback) {
      const style = document.createElement('style')
      style.textContent = `
        .touch-feedback {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          touch-action: manipulation;
        }
        
        .touch-feedback:active {
          transform: scale(0.98);
          opacity: 0.8;
          transition: all 0.1s ease;
        }
        
        .touch-feedback-subtle:active {
          transform: scale(0.99);
          opacity: 0.9;
          transition: all 0.1s ease;
        }
        
        /* Improve tap targets */
        .touch-target {
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Smooth scrolling for touch devices */
        .touch-scroll {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        /* Prevent text selection on touch */
        .touch-no-select {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `
      document.head.appendChild(style)

      // Add touch feedback classes to interactive elements
      const interactiveElements = container.querySelectorAll('button, [role="button"], a[href], input[type="button"], input[type="submit"]')
      interactiveElements.forEach((element) => {
        element.classList.add('touch-feedback')
      })

      // Add subtle feedback to cards and other elements
      const cards = container.querySelectorAll('[data-testid="product-card"], .card, .clickable')
      cards.forEach((card) => {
        card.classList.add('touch-feedback-subtle')
      })

      // Add scroll optimization to scrollable containers
      const scrollableElements = container.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto, .overflow-scroll')
      scrollableElements.forEach((element) => {
        element.classList.add('touch-scroll')
      })

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [enableScrollOptimization, preventZoom, optimizeButtons, enableTouchFeedback])

  // Add viewport meta tag for mobile optimization
  useEffect(() => {
    const existingViewport = document.querySelector('meta[name="viewport"]')
    if (!existingViewport) {
      const viewport = document.createElement('meta')
      viewport.name = 'viewport'
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      document.head.appendChild(viewport)
    }
  }, [])

  return (
    <div ref={containerRef} className="touch-optimizer">
      {children}
    </div>
  )
}

// Hook for adding touch optimizations to specific elements
export function useTouchOptimization(
  ref: React.RefObject<HTMLElement>,
  options: {
    enableScrollOptimization?: boolean
    preventDoubleTabZoom?: boolean
    makeTouchFriendly?: boolean
  } = {}
) {
  useEffect(() => {
    if (!isTouchDevice() || !ref.current) return

    const element = ref.current
    const {
      enableScrollOptimization = true,
      preventDoubleTabZoom: preventZoom = true,
      makeTouchFriendly: touchFriendly = true
    } = options

    if (enableScrollOptimization) {
      enhanceMobileScroll(element)
    }

    if (preventZoom) {
      preventDoubleTabZoom(element)
    }

    if (touchFriendly) {
      makeTouchFriendly(element)
    }
  }, [ref, options])
}

// Component for optimizing specific mobile interactions
export function MobileInteractionZone({
  children,
  onTap,
  onLongPress,
  onSwipe,
  className = ''
}: {
  children: React.ReactNode
  onTap?: () => void
  onLongPress?: () => void
  onSwipe?: (direction: string) => void
  className?: string
}) {
  const zoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTouchDevice() || !zoneRef.current) return

    const zone = zoneRef.current
    let touchStartTime = 0
    let touchStartPos = { x: 0, y: 0 }
    let longPressTimer: NodeJS.Timeout | null = null

    const handleTouchStart = (e: TouchEvent) => {
      touchStartTime = Date.now()
      touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }

      // Start long press timer
      if (onLongPress) {
        longPressTimer = setTimeout(() => {
          onLongPress()
        }, 500)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndTime = Date.now()
      const touchEndPos = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }

      // Clear long press timer
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }

      const duration = touchEndTime - touchStartTime
      const distance = Math.sqrt(
        Math.pow(touchEndPos.x - touchStartPos.x, 2) +
        Math.pow(touchEndPos.y - touchStartPos.y, 2)
      )

      // Handle tap
      if (duration < 300 && distance < 10 && onTap) {
        onTap()
      }

      // Handle swipe
      if (distance > 50 && onSwipe) {
        const deltaX = touchEndPos.x - touchStartPos.x
        const deltaY = touchEndPos.y - touchStartPos.y

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          onSwipe(deltaX > 0 ? 'right' : 'left')
        } else {
          onSwipe(deltaY > 0 ? 'down' : 'up')
        }
      }
    }

    const handleTouchCancel = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
    }

    zone.addEventListener('touchstart', handleTouchStart, { passive: true })
    zone.addEventListener('touchend', handleTouchEnd, { passive: true })
    zone.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      zone.removeEventListener('touchstart', handleTouchStart)
      zone.removeEventListener('touchend', handleTouchEnd)
      zone.removeEventListener('touchcancel', handleTouchCancel)
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [onTap, onLongPress, onSwipe])

  return (
    <div ref={zoneRef} className={`mobile-interaction-zone ${className}`}>
      {children}
    </div>
  )
}

// Safe area utilities for notched devices
export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --safe-area-inset-top: env(safe-area-inset-top);
        --safe-area-inset-right: env(safe-area-inset-right);
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
        --safe-area-inset-left: env(safe-area-inset-left);
      }
      
      .safe-area-top {
        padding-top: max(1rem, env(safe-area-inset-top));
      }
      
      .safe-area-bottom {
        padding-bottom: max(1rem, env(safe-area-inset-bottom));
      }
      
      .safe-area-left {
        padding-left: max(1rem, env(safe-area-inset-left));
      }
      
      .safe-area-right {
        padding-right: max(1rem, env(safe-area-inset-right));
      }
      
      .safe-area-inset {
        padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}