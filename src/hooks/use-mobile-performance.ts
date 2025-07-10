'use client'

import { useEffect, useCallback, useRef } from 'react'

interface MobilePerformanceOptions {
  enableTouchCallouts?: boolean
  enableUserSelect?: boolean
  enableScrollBounce?: boolean
  enableZoom?: boolean
}

export function useMobilePerformance(options: MobilePerformanceOptions = {}) {
  const {
    enableTouchCallouts = false,
    enableUserSelect = false,
    enableScrollBounce = false,
    enableZoom = false
  } = options

  const rafId = useRef<number>()

  // Optimize scroll performance with requestAnimationFrame
  const optimizeScroll = useCallback((callback: () => void) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }
    
    rafId.current = requestAnimationFrame(callback)
  }, [])

  // Set up mobile-specific CSS optimizations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* Mobile performance optimizations */
      * {
        -webkit-tap-highlight-color: transparent;
        ${!enableTouchCallouts ? '-webkit-touch-callout: none;' : ''}
        ${!enableUserSelect ? '-webkit-user-select: none; user-select: none;' : ''}
      }
      
      body {
        ${!enableScrollBounce ? '-webkit-overflow-scrolling: auto; overscroll-behavior: none;' : '-webkit-overflow-scrolling: touch;'}
        ${!enableZoom ? 'touch-action: pan-x pan-y;' : ''}
      }
      
      /* Optimize animations for mobile */
      * {
        will-change: auto;
      }
      
      .mobile-optimized {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Improve touch interactions */
      button, a, [role="button"] {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Optimize scrollable areas */
      .mobile-scroll {
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .mobile-scroll::-webkit-scrollbar {
        display: none;
      }
    `
    
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [enableTouchCallouts, enableUserSelect, enableScrollBounce, enableZoom])

  // Set up viewport meta tag for mobile
  useEffect(() => {
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta')
      viewportMeta.name = 'viewport'
      document.head.appendChild(viewportMeta)
    }
    
    const content = enableZoom
      ? 'width=device-width, initial-scale=1.0'
      : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    
    viewportMeta.content = content
    
    return () => {
      if (viewportMeta.parentNode) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0'
      }
    }
  }, [enableZoom])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return {
    optimizeScroll
  }
}

// Hook for mobile-specific event optimizations
export function useMobileEvents() {
  useEffect(() => {
    // Disable context menu on mobile
    const handleContextMenu = (e: Event) => {
      e.preventDefault()
      return false
    }

    // Optimize touch events
    const handleTouchStart = (e: TouchEvent) => {
      // Store initial touch position for better gesture handling
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        document.body.dataset.touchStartX = touch.clientX.toString()
        document.body.dataset.touchStartY = touch.clientY.toString()
      }
    }

    // Prevent accidental zoom on double-tap
    let lastTouchEnd = 0
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, { passive: false })
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])
}

// Hook for mobile keyboard handling
export function useMobileKeyboard() {
  useEffect(() => {
    const handleResize = () => {
      // Detect virtual keyboard
      const isKeyboardOpen = window.innerHeight < screen.height * 0.75
      document.body.classList.toggle('keyboard-open', isKeyboardOpen)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.classList.remove('keyboard-open')
    }
  }, [])
}