'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface AriaLiveAnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
  clearOnUnmount?: boolean
}

export const AriaLiveAnnouncer = ({
  message,
  priority = 'polite',
  clearOnUnmount = true
}: AriaLiveAnnouncerProps) => {
  const [mounted, setMounted] = useState(false)
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => {
      if (clearOnUnmount) {
        setMounted(false)
      }
    }
  }, [clearOnUnmount])

  useEffect(() => {
    if (mounted && announcerRef.current && message) {
      // Clear previous message first
      announcerRef.current.textContent = ''
      
      // Add new message with slight delay to ensure screen reader picks it up
      const timeout = setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message
        }
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [message, mounted])

  if (!mounted) return null

  return createPortal(
    <div
      ref={announcerRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    />,
    document.body
  )
}

// Hook for programmatic announcements
export const useAriaAnnouncer = () => {
  const [announcement, setAnnouncement] = useState('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = (message: string, announcementPriority: 'polite' | 'assertive' = 'polite') => {
    setPriority(announcementPriority)
    setAnnouncement(message)
    
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncement('')
    }, 1000)
  }

  const announcePolitely = (message: string) => announce(message, 'polite')
  const announceAssertively = (message: string) => announce(message, 'assertive')

  return {
    announcement,
    priority,
    announce,
    announcePolitely,
    announceAssertively,
    AriaLiveAnnouncer: () => (
      <AriaLiveAnnouncer message={announcement} priority={priority} />
    )
  }
}

// Component for form validation announcements
export const FormValidationAnnouncer = ({ 
  errors, 
  touched 
}: { 
  errors: Record<string, string>; 
  touched: Record<string, boolean> 
}) => {
  const [lastErrorCount, setLastErrorCount] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const currentErrors = Object.keys(errors).filter(key => touched[key] && errors[key])
    const errorCount = currentErrors.length

    if (errorCount > lastErrorCount) {
      const newErrors = currentErrors.filter(key => !lastErrorCount || touched[key])
      if (newErrors.length > 0) {
        const errorMessages = newErrors.map(key => errors[key]).join('. ')
        setAnnouncement(`Form validation errors: ${errorMessages}`)
      }
    } else if (errorCount < lastErrorCount && errorCount === 0) {
      setAnnouncement('All form errors have been resolved')
    }

    setLastErrorCount(errorCount)
  }, [errors, touched, lastErrorCount])

  return <AriaLiveAnnouncer message={announcement} priority="assertive" />
}

// Component for loading state announcements
export const LoadingAnnouncer = ({ 
  isLoading, 
  loadingMessage = 'Loading', 
  completeMessage = 'Loading complete' 
}: { 
  isLoading: boolean; 
  loadingMessage?: string; 
  completeMessage?: string 
}) => {
  const [announcement, setAnnouncement] = useState('')
  const [wasLoading, setWasLoading] = useState(false)

  useEffect(() => {
    if (isLoading && !wasLoading) {
      setAnnouncement(loadingMessage)
      setWasLoading(true)
    } else if (!isLoading && wasLoading) {
      setAnnouncement(completeMessage)
      setWasLoading(false)
    }
  }, [isLoading, wasLoading, loadingMessage, completeMessage])

  return <AriaLiveAnnouncer message={announcement} priority="polite" />
}

// Component for cart update announcements
export const CartUpdateAnnouncer = ({ 
  cartItems, 
  lastAction 
}: { 
  cartItems: number; 
  lastAction: 'add' | 'remove' | 'clear' | null 
}) => {
  const [announcement, setAnnouncement] = useState('')
  const prevItemCount = useRef(cartItems)

  useEffect(() => {
    if (lastAction) {
      const itemWord = cartItems === 1 ? 'item' : 'items'
      
      switch (lastAction) {
        case 'add':
          setAnnouncement(`Item added to cart. Cart now has ${cartItems} ${itemWord}`)
          break
        case 'remove':
          setAnnouncement(`Item removed from cart. Cart now has ${cartItems} ${itemWord}`)
          break
        case 'clear':
          setAnnouncement('Cart has been cleared')
          break
      }
      
      prevItemCount.current = cartItems
    }
  }, [cartItems, lastAction])

  return <AriaLiveAnnouncer message={announcement} priority="polite" />
}

// Component for search result announcements
export const SearchResultAnnouncer = ({ 
  resultCount, 
  query, 
  isLoading 
}: { 
  resultCount: number; 
  query: string; 
  isLoading: boolean 
}) => {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (!isLoading && query) {
      const resultWord = resultCount === 1 ? 'result' : 'results'
      setAnnouncement(`Search for "${query}" returned ${resultCount} ${resultWord}`)
    }
  }, [resultCount, query, isLoading])

  return <AriaLiveAnnouncer message={announcement} priority="polite" />
}

// Component for navigation announcements
export const NavigationAnnouncer = ({ 
  currentPage, 
  totalPages 
}: { 
  currentPage: number; 
  totalPages: number 
}) => {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    setAnnouncement(`Page ${currentPage} of ${totalPages}`)
  }, [currentPage, totalPages])

  return <AriaLiveAnnouncer message={announcement} priority="polite" />
}

// Component for status change announcements
export const StatusAnnouncer = ({ 
  status, 
  message 
}: { 
  status: 'success' | 'error' | 'warning' | 'info'; 
  message: string 
}) => {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (message) {
      const statusPrefix = {
        success: 'Success: ',
        error: 'Error: ',
        warning: 'Warning: ',
        info: 'Info: '
      }
      setAnnouncement(`${statusPrefix[status]}${message}`)
    }
  }, [status, message])

  return <AriaLiveAnnouncer message={announcement} priority={status === 'error' ? 'assertive' : 'polite'} />
}

export default AriaLiveAnnouncer