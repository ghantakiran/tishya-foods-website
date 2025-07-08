'use client'

import { useEffect, useState } from 'react'
import { meetsWCAGAA, getContrastRatio } from '@/lib/accessibility/color-contrast'

interface ColorContrastEnhancerProps {
  children: React.ReactNode
  enableHighContrast?: boolean
}

export function ColorContrastEnhancer({ 
  children, 
  enableHighContrast = false 
}: ColorContrastEnhancerProps) {
  const [highContrastMode, setHighContrastMode] = useState(enableHighContrast)
  const [systemPreference, setSystemPreference] = useState(false)

  useEffect(() => {
    // Check system preference for high contrast
    const checkSystemPreference = () => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)')
        setSystemPreference(mediaQuery.matches)
        
        const handleChange = (e: MediaQueryListEvent) => {
          setSystemPreference(e.matches)
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
    }

    checkSystemPreference()

    // Check localStorage for user preference
    const userPreference = localStorage.getItem('highContrastMode')
    if (userPreference !== null) {
      setHighContrastMode(JSON.parse(userPreference))
    }
  }, [])

  useEffect(() => {
    const shouldEnableHighContrast = highContrastMode || systemPreference
    
    if (shouldEnableHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrastMode, systemPreference])

  const toggleHighContrast = () => {
    const newValue = !highContrastMode
    setHighContrastMode(newValue)
    localStorage.setItem('highContrastMode', JSON.stringify(newValue))
  }

  return (
    <div className="color-contrast-enhancer">
      {children}
      
      {/* High Contrast Toggle Button */}
      <button
        onClick={toggleHighContrast}
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-md border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`${highContrastMode ? 'Disable' : 'Enable'} high contrast mode`}
        title={`${highContrastMode ? 'Disable' : 'Enable'} high contrast mode`}
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      </button>
    </div>
  )
}

// Hook for components that need to adapt to high contrast mode
export function useHighContrastMode() {
  const [highContrastMode, setHighContrastMode] = useState(false)

  useEffect(() => {
    const checkHighContrastMode = () => {
      return document.documentElement.classList.contains('high-contrast')
    }

    setHighContrastMode(checkHighContrastMode())

    const observer = new MutationObserver(() => {
      setHighContrastMode(checkHighContrastMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return highContrastMode
}

// Utility component to check contrast and suggest improvements
export function ContrastChecker({ 
  foreground, 
  background, 
  text, 
  isLargeText = false 
}: {
  foreground: string
  background: string
  text: string
  isLargeText?: boolean
}) {
  const ratio = getContrastRatio(foreground, background)
  const meetsAA = meetsWCAGAA(foreground, background, isLargeText)
  const minRatio = isLargeText ? 3 : 4.5

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white text-black p-2 rounded shadow-lg text-xs max-w-xs">
      <div className="font-semibold">{text}</div>
      <div>Contrast: {ratio.toFixed(2)}:1</div>
      <div className={meetsAA ? 'text-green-600' : 'text-red-600'}>
        {meetsAA ? '✓' : '✗'} WCAG AA ({minRatio}:1 required)
      </div>
    </div>
  )
}