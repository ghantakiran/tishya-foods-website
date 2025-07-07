// Touch and mobile interaction utilities
import React from 'react'

export interface TouchGesture {
  startX: number
  startY: number
  endX: number
  endY: number
  startTime: number
  endTime: number
  distance: number
  direction: 'left' | 'right' | 'up' | 'down' | 'none'
  type: 'tap' | 'swipe' | 'hold' | 'none'
}

export interface TouchHandlers {
  onTap?: (gesture: TouchGesture) => void
  onSwipe?: (gesture: TouchGesture) => void
  onHold?: (gesture: TouchGesture) => void
  onSwipeLeft?: (gesture: TouchGesture) => void
  onSwipeRight?: (gesture: TouchGesture) => void
  onSwipeUp?: (gesture: TouchGesture) => void
  onSwipeDown?: (gesture: TouchGesture) => void
}

export interface TouchOptions {
  swipeThreshold?: number
  holdDuration?: number
  tapMaxDistance?: number
  preventDefault?: boolean
}

export class TouchManager {
  private element: HTMLElement
  private handlers: TouchHandlers
  private options: Required<TouchOptions>
  private startTouch: Touch | null = null
  private startTime: number = 0
  private holdTimer: NodeJS.Timeout | null = null

  constructor(
    element: HTMLElement,
    handlers: TouchHandlers,
    options: TouchOptions = {}
  ) {
    this.element = element
    this.handlers = handlers
    this.options = {
      swipeThreshold: options.swipeThreshold || 50,
      holdDuration: options.holdDuration || 500,
      tapMaxDistance: options.tapMaxDistance || 10,
      preventDefault: options.preventDefault || false
    }

    this.bindEvents()
  }

  private bindEvents(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: !this.options.preventDefault })
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: !this.options.preventDefault })
    this.element.addEventListener('touchcancel', this.handleTouchCancel, { passive: !this.options.preventDefault })
  }

  private handleTouchStart = (event: TouchEvent): void => {
    if (this.options.preventDefault) {
      event.preventDefault()
    }

    this.startTouch = event.touches[0]
    this.startTime = Date.now()

    // Set hold timer
    if (this.handlers.onHold) {
      this.holdTimer = setTimeout(() => {
        if (this.startTouch) {
          const gesture = this.createGesture(
            this.startTouch,
            this.startTouch,
            this.startTime,
            Date.now(),
            'hold'
          )
          this.handlers.onHold!(gesture)
        }
      }, this.options.holdDuration)
    }
  }

  private handleTouchEnd = (event: TouchEvent): void => {
    if (this.options.preventDefault) {
      event.preventDefault()
    }

    if (this.holdTimer) {
      clearTimeout(this.holdTimer)
      this.holdTimer = null
    }

    if (!this.startTouch) return

    const endTouch = event.changedTouches[0]
    const endTime = Date.now()
    const gesture = this.createGesture(this.startTouch, endTouch, this.startTime, endTime)

    // Determine gesture type and call appropriate handler
    if (gesture.type === 'tap' && this.handlers.onTap) {
      this.handlers.onTap(gesture)
    } else if (gesture.type === 'swipe') {
      if (this.handlers.onSwipe) {
        this.handlers.onSwipe(gesture)
      }

      // Call direction-specific handlers
      if (gesture.direction === 'left' && this.handlers.onSwipeLeft) {
        this.handlers.onSwipeLeft(gesture)
      } else if (gesture.direction === 'right' && this.handlers.onSwipeRight) {
        this.handlers.onSwipeRight(gesture)
      } else if (gesture.direction === 'up' && this.handlers.onSwipeUp) {
        this.handlers.onSwipeUp(gesture)
      } else if (gesture.direction === 'down' && this.handlers.onSwipeDown) {
        this.handlers.onSwipeDown(gesture)
      }
    }

    this.startTouch = null
  }

  private handleTouchCancel = (): void => {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer)
      this.holdTimer = null
    }
    this.startTouch = null
  }

  private createGesture(
    startTouch: Touch,
    endTouch: Touch,
    startTime: number,
    endTime: number,
    forceType?: 'hold'
  ): TouchGesture {
    const deltaX = endTouch.clientX - startTouch.clientX
    const deltaY = endTouch.clientY - startTouch.clientY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = endTime - startTime

    let direction: TouchGesture['direction'] = 'none'
    let type: TouchGesture['type'] = 'none'

    if (forceType === 'hold') {
      type = 'hold'
    } else if (distance <= this.options.tapMaxDistance && duration < this.options.holdDuration) {
      type = 'tap'
    } else if (distance >= this.options.swipeThreshold) {
      type = 'swipe'
      
      // Determine direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left'
      } else {
        direction = deltaY > 0 ? 'down' : 'up'
      }
    }

    return {
      startX: startTouch.clientX,
      startY: startTouch.clientY,
      endX: endTouch.clientX,
      endY: endTouch.clientY,
      startTime,
      endTime,
      distance,
      direction,
      type
    }
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart)
    this.element.removeEventListener('touchend', this.handleTouchEnd)
    this.element.removeEventListener('touchcancel', this.handleTouchCancel)
    
    if (this.holdTimer) {
      clearTimeout(this.holdTimer)
    }
  }
}

// React hook for touch gestures
export function useTouchGestures(
  ref: React.RefObject<HTMLElement>,
  handlers: TouchHandlers,
  options: TouchOptions = {}
): void {
  React.useEffect(() => {
    if (!ref.current) return

    const touchManager = new TouchManager(ref.current, handlers, options)

    return () => {
      touchManager.destroy()
    }
  }, [ref, handlers, options])
}

// Touch-friendly button utility
export function makeTouchFriendly(element: HTMLElement): void {
  // Ensure minimum touch target size (44px x 44px)
  const computedStyle = getComputedStyle(element)
  const minSize = 44
  
  if (parseInt(computedStyle.width) < minSize) {
    element.style.minWidth = `${minSize}px`
  }
  
  if (parseInt(computedStyle.height) < minSize) {
    element.style.minHeight = `${minSize}px`
  }

  // Add touch feedback
  element.style.touchAction = 'manipulation'
  element.style.userSelect = 'none'
  ;(element.style as any).webkitTapHighlightColor = 'transparent'

  // Add visual feedback for touch
  element.addEventListener('touchstart', () => {
    element.style.transform = 'scale(0.98)'
    element.style.opacity = '0.8'
  }, { passive: true })

  element.addEventListener('touchend', () => {
    element.style.transform = ''
    element.style.opacity = ''
  }, { passive: true })

  element.addEventListener('touchcancel', () => {
    element.style.transform = ''
    element.style.opacity = ''
  }, { passive: true })
}

// Debounce touch events to prevent multiple triggers
export function debounceTouchEvent<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 300
): T {
  let timeoutId: NodeJS.Timeout | null = null
  
  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }) as T
}

// Check if device supports touch
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Get optimal viewport for mobile
export function getOptimalViewport(): string {
  const hasNotch = 'CSS' in window && CSS.supports('padding-top', 'env(safe-area-inset-top)')
  
  if (hasNotch) {
    return 'width=device-width, initial-scale=1.0, viewport-fit=cover'
  }
  
  return 'width=device-width, initial-scale=1.0'
}

// Prevent zoom on double tap
export function preventDoubleTabZoom(element: HTMLElement): void {
  let lastTouchEnd = 0
  
  element.addEventListener('touchend', (event) => {
    const now = Date.now()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, { passive: false })
}

// Enhanced scroll behavior for mobile
export function enhanceMobileScroll(element: HTMLElement): void {
  ;(element.style as any).webkitOverflowScrolling = 'touch'
  element.style.overscrollBehavior = 'contain'
  
  // Add momentum scrolling for iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    ;(element.style as any).webkitOverflowScrolling = 'touch'
  }
}

// Safe area utilities for devices with notches
export function getSafeAreaInsets(): Record<string, string> {
  return {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)'
  }
}

export function applySafeArea(element: HTMLElement, sides: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'bottom']): void {
  const insets = getSafeAreaInsets()
  
  sides.forEach(side => {
    element.style.setProperty(`padding-${side}`, `max(${element.style.getPropertyValue(`padding-${side}`) || '0px'}, ${insets[side]})`)
  })
}