'use client'

import { useEffect, useRef, useState } from 'react'

interface KeyboardNavigationEnhancerProps {
  children: React.ReactNode
}

export function KeyboardNavigationEnhancer({ children }: KeyboardNavigationEnhancerProps) {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)
  const lastInteractionRef = useRef<'mouse' | 'keyboard'>('mouse')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        lastInteractionRef.current = 'keyboard'
        setIsKeyboardUser(true)
        document.body.classList.add('keyboard-user')
      }
    }

    const handleMouseDown = () => {
      lastInteractionRef.current = 'mouse'
      setIsKeyboardUser(false)
      document.body.classList.remove('keyboard-user')
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Reset keyboard user state when page becomes hidden
        setIsKeyboardUser(false)
        document.body.classList.remove('keyboard-user')
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div className={`keyboard-navigation-enhancer ${isKeyboardUser ? 'keyboard-user' : ''}`}>
      {children}
    </div>
  )
}

// Hook for components that need to adapt to keyboard navigation
export function useKeyboardUser() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    const checkKeyboardUser = () => {
      return document.body.classList.contains('keyboard-user')
    }

    setIsKeyboardUser(checkKeyboardUser())

    const observer = new MutationObserver(() => {
      setIsKeyboardUser(checkKeyboardUser())
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return isKeyboardUser
}

// Enhanced roving tabindex for component groups
export function useRovingTabIndex(items: HTMLElement[], activeIndex: number = 0) {
  useEffect(() => {
    items.forEach((item, index) => {
      if (item) {
        item.tabIndex = index === activeIndex ? 0 : -1
      }
    })
  }, [items, activeIndex])

  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        newIndex = (currentIndex + 1) % items.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = items.length - 1
        break
      default:
        return
    }

    items[newIndex]?.focus()
    return newIndex
  }

  return { handleKeyDown }
}