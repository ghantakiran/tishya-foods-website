'use client'

import { useEffect, useRef } from 'react'

interface KeyboardNavigationProps {
  children: React.ReactNode
  onEscape?: () => void
  onEnter?: () => void
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
  trapFocus?: boolean
  autoFocus?: boolean
  className?: string
}

export function KeyboardNavigation({
  children,
  onEscape,
  onEnter,
  onArrowKeys,
  trapFocus = false,
  autoFocus = false,
  className = ''
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (autoFocus) {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (onEscape) {
            e.preventDefault()
            onEscape()
          }
          break

        case 'Enter':
          if (onEnter && e.target === container) {
            e.preventDefault()
            onEnter()
          }
          break

        case 'ArrowUp':
          if (onArrowKeys) {
            e.preventDefault()
            onArrowKeys('up')
          }
          break

        case 'ArrowDown':
          if (onArrowKeys) {
            e.preventDefault()
            onArrowKeys('down')
          }
          break

        case 'ArrowLeft':
          if (onArrowKeys) {
            e.preventDefault()
            onArrowKeys('left')
          }
          break

        case 'ArrowRight':
          if (onArrowKeys) {
            e.preventDefault()
            onArrowKeys('right')
          }
          break

        case 'Tab':
          if (trapFocus) {
            const focusableElements = container.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const firstElement = focusableElements[0] as HTMLElement
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault()
                lastElement?.focus()
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault()
                firstElement?.focus()
              }
            }
          }
          break
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [onEscape, onEnter, onArrowKeys, trapFocus, autoFocus])

  return (
    <div
      ref={containerRef}
      className={className}
      tabIndex={trapFocus ? -1 : undefined}
    >
      {children}
    </div>
  )
}

interface NavigableListProps {
  children: React.ReactNode[]
  orientation?: 'horizontal' | 'vertical'
  wrap?: boolean
  onSelect?: (index: number) => void
  selectedIndex?: number
  className?: string
}

export function NavigableList({
  children,
  orientation = 'vertical',
  wrap = true,
  onSelect,
  selectedIndex = 0,
  className = ''
}: NavigableListProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const currentIndex = useRef(selectedIndex)

  const focusItem = (index: number) => {
    const list = listRef.current
    if (!list) return

    const items = list.querySelectorAll('[role="option"], [role="menuitem"], li button, li a')
    const item = items[index] as HTMLElement
    if (item) {
      item.focus()
      currentIndex.current = index
      onSelect?.(index)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const isVertical = orientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    switch (e.key) {
      case nextKey:
        e.preventDefault()
        let nextIndex = currentIndex.current + 1
        if (nextIndex >= children.length) {
          nextIndex = wrap ? 0 : children.length - 1
        }
        focusItem(nextIndex)
        break

      case prevKey:
        e.preventDefault()
        let prevIndex = currentIndex.current - 1
        if (prevIndex < 0) {
          prevIndex = wrap ? children.length - 1 : 0
        }
        focusItem(prevIndex)
        break

      case 'Home':
        e.preventDefault()
        focusItem(0)
        break

      case 'End':
        e.preventDefault()
        focusItem(children.length - 1)
        break
    }
  }

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    list.addEventListener('keydown', handleKeyDown)

    return () => {
      list.removeEventListener('keydown', handleKeyDown)
    }
  }, [children.length, orientation, wrap])

  return (
    <ul
      ref={listRef}
      role="listbox"
      aria-orientation={orientation}
      className={className}
    >
      {children.map((child, index) => (
        <li
          key={index}
          role="option"
          aria-selected={index === selectedIndex}
          onClick={() => focusItem(index)}
        >
          {child}
        </li>
      ))}
    </ul>
  )
}

interface RovingTabIndexProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical' | 'both'
  className?: string
}

export function RovingTabIndex({
  children,
  orientation = 'both',
  className = ''
}: RovingTabIndexProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateTabIndex = () => {
      const focusableElements = container.querySelectorAll(
        '[data-roving-tabindex]'
      ) as NodeListOf<HTMLElement>

      focusableElements.forEach((element, index) => {
        element.tabIndex = index === 0 ? 0 : -1
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (!target.hasAttribute('data-roving-tabindex')) return

      const focusableElements = Array.from(
        container.querySelectorAll('[data-roving-tabindex]')
      ) as HTMLElement[]

      const currentIndex = focusableElements.indexOf(target)
      let nextIndex = currentIndex

      const canNavigateHorizontal = orientation === 'horizontal' || orientation === 'both'
      const canNavigateVertical = orientation === 'vertical' || orientation === 'both'

      switch (e.key) {
        case 'ArrowRight':
          if (canNavigateHorizontal) {
            e.preventDefault()
            nextIndex = (currentIndex + 1) % focusableElements.length
          }
          break

        case 'ArrowLeft':
          if (canNavigateHorizontal) {
            e.preventDefault()
            nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
          }
          break

        case 'ArrowDown':
          if (canNavigateVertical) {
            e.preventDefault()
            nextIndex = (currentIndex + 1) % focusableElements.length
          }
          break

        case 'ArrowUp':
          if (canNavigateVertical) {
            e.preventDefault()
            nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
          }
          break

        case 'Home':
          e.preventDefault()
          nextIndex = 0
          break

        case 'End':
          e.preventDefault()
          nextIndex = focusableElements.length - 1
          break
      }

      if (nextIndex !== currentIndex) {
        focusableElements[currentIndex].tabIndex = -1
        focusableElements[nextIndex].tabIndex = 0
        focusableElements[nextIndex].focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    updateTabIndex()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [orientation])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}