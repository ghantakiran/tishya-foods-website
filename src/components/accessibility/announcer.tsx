'use client'

import { useEffect, useRef } from 'react'

interface AnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
  delay?: number
}

export function Announcer({ message, priority = 'polite', delay = 0 }: AnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!message) return

    const announce = () => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message
        // Clear after announcement to allow for repeat announcements
        setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = ''
          }
        }, 1000)
      }
    }

    if (delay > 0) {
      const timer = setTimeout(announce, delay)
      return () => clearTimeout(timer)
    } else {
      announce()
    }
  }, [message, delay])

  return (
    <div
      ref={announcerRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  )
}

// Hook for managing announcements
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority)
      announcerRef.current.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = ''
        }
      }, 1000)
    }
  }

  const AnnouncerComponent = () => (
    <div
      ref={announcerRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )

  return { announce, AnnouncerComponent }
}