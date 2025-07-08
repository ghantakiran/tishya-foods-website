import React from 'react'

interface ScreenReaderOnlyProps {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
  id?: string
  [key: string]: any
}

export function ScreenReaderOnly({ 
  children, 
  as: Component = 'span',
  className = '',
  ...props
}: ScreenReaderOnlyProps) {
  return (
    <Component 
      className={`sr-only ${className}`}
      aria-hidden={false}
      {...props}
    >
      {children}
    </Component>
  )
}

interface LiveRegionProps {
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  className?: string
}

export function LiveRegion({ 
  children, 
  priority = 'polite',
  atomic = false,
  className = ''
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  )
}

interface LandmarkProps {
  children: React.ReactNode
  role: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region'
  label?: string
  labelledBy?: string
  className?: string
}

export function Landmark({ 
  children, 
  role, 
  label, 
  labelledBy,
  className = ''
}: LandmarkProps) {
  return (
    <section
      role={role}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  )
}

interface FocusTrapProps {
  children: React.ReactNode
  isActive: boolean
  restoreFocus?: boolean
}

export function FocusTrap({ children, isActive, restoreFocus = true }: FocusTrapProps) {
  const trapRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!isActive) return

    const trap = trapRef.current
    if (!trap) return

    // Store the currently focused element
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    // Get all focusable elements within the trap
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus the first element
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

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

    document.addEventListener('keydown', handleTabKey)

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      
      // Restore focus when trap is deactivated
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isActive, restoreFocus])

  return (
    <div ref={trapRef}>
      {children}
    </div>
  )
}