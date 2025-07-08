'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { FocusManager } from './focus-manager'
import { useAnnouncer } from './announcer'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  initialFocus?: React.RefObject<HTMLElement>
  className?: string
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  initialFocus,
  className = ''
}: AccessibleModalProps) {
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const { announce } = useAnnouncer()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocus.current = document.activeElement as HTMLElement
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden'
      
      // Announce modal opening
      announce(`${title} dialog opened`, 'assertive')
      
      // Focus the modal after a small delay
      setTimeout(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus()
        } else if (titleRef.current) {
          titleRef.current.focus()
        }
      }, 100)
    } else {
      // Restore body scrolling
      document.body.style.overflow = 'unset'
      
      // Restore focus to previous element
      if (previousFocus.current) {
        previousFocus.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, title, announce, initialFocus])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm'
      case 'md':
        return 'max-w-md'
      case 'lg':
        return 'max-w-lg'
      case 'xl':
        return 'max-w-xl'
      default:
        return 'max-w-md'
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <FocusManager>
        <div
          ref={modalRef}
          className={`
            relative w-full ${getSizeClasses()} 
            bg-gray-800 border border-gray-600 rounded-lg shadow-xl
            max-h-[90vh] overflow-y-auto
            ${className}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <h2
              id="modal-title"
              ref={titleRef}
              className="text-xl font-semibold text-gray-100"
              tabIndex={-1}
            >
              {title}
            </h2>
            
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="
                  p-2 text-gray-400 hover:text-gray-200 
                  hover:bg-gray-700 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors
                "
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="px-6 pt-4">
              <p id="modal-description" className="text-gray-300">
                {description}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </FocusManager>
    </div>,
    document.body
  )
}

// Hook for managing modal state with accessibility
export function useAccessibleModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { announce } = useAnnouncer()

  const openModal = (title?: string) => {
    setIsOpen(true)
    if (title) {
      announce(`Opening ${title} dialog`, 'polite')
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    announce('Dialog closed', 'polite')
  }

  return {
    isOpen,
    openModal,
    closeModal
  }
}