'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Check, X, Eye } from 'lucide-react'
import { getContrastRatio, getWCAGLevel } from '@/lib/accessibility/color-contrast'

interface AccessibilityIssue {
  type: 'contrast' | 'alt-text' | 'heading' | 'focus' | 'aria'
  severity: 'error' | 'warning' | 'info'
  element: string
  description: string
  recommendation: string
}

export function AccessibilityChecker() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const runAccessibilityCheck = async () => {
    setIsChecking(true)
    const foundIssues: AccessibilityIssue[] = []

    // Check for images without alt text
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt && !img.hasAttribute('aria-hidden')) {
        foundIssues.push({
          type: 'alt-text',
          severity: 'error',
          element: `Image ${index + 1}`,
          description: 'Image missing alt text',
          recommendation: 'Add descriptive alt text or mark as decorative with aria-hidden="true"'
        })
      }
    })

    // Check heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1))
      if (level - lastLevel > 1) {
        foundIssues.push({
          type: 'heading',
          severity: 'warning',
          element: `${heading.tagName} ${index + 1}`,
          description: 'Heading levels skip',
          recommendation: 'Use heading levels in sequential order (h1 → h2 → h3)'
        })
      }
      lastLevel = level
    })

    // Check for focusable elements without visible focus
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    focusableElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element)
      if (styles.outline === 'none' && !styles.boxShadow.includes('ring')) {
        foundIssues.push({
          type: 'focus',
          severity: 'warning',
          element: `${element.tagName.toLowerCase()} ${index + 1}`,
          description: 'No visible focus indicator',
          recommendation: 'Add focus:ring or focus:outline styles'
        })
      }
    })

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button, index) => {
      const hasText = button.textContent?.trim()
      const hasAriaLabel = button.getAttribute('aria-label')
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby')
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'aria',
          severity: 'error',
          element: `Button ${index + 1}`,
          description: 'Button without accessible name',
          recommendation: 'Add aria-label or visible text content'
        })
      }
    })

    // Check color contrast (simplified check)
    const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6')
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor
      
      // Only check if we have both colors and they're not transparent
      if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // This is a simplified check - in practice you'd need to convert colors properly
        const level = getWCAGLevel('#ffffff', '#000000') // Placeholder
        if (level === 'FAIL') {
          foundIssues.push({
            type: 'contrast',
            severity: 'error',
            element: `${element.tagName.toLowerCase()} ${index + 1}`,
            description: 'Insufficient color contrast',
            recommendation: 'Increase contrast ratio to at least 4.5:1'
          })
        }
      }
    })

    setIssues(foundIssues)
    setIsChecking(false)
  }

  const getSeverityIcon = (severity: AccessibilityIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <X className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <Eye className="w-4 h-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: AccessibilityIssue['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-900/20 border-red-500/50'
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/50'
      case 'info':
        return 'bg-blue-900/20 border-blue-500/50'
    }
  }

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = []
    acc[issue.type].push(issue)
    return acc
  }, {} as Record<string, AccessibilityIssue[]>)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Accessibility Checker"
        aria-label="Toggle accessibility checker"
      >
        <Eye className="w-5 h-5" />
        {issues.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {issues.length}
          </span>
        )}
      </button>

      {/* Accessibility Panel */}
      {isVisible && (
        <div className="fixed bottom-20 left-4 w-80 max-h-96 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-gray-700 p-3 flex items-center justify-between">
            <h3 className="text-white font-semibold">Accessibility Checker</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={runAccessibilityCheck}
                disabled={isChecking}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm"
              >
                {isChecking ? 'Checking...' : 'Check'}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-3">
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">No accessibility issues found!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedIssues).map(([type, typeIssues]) => (
                  <div key={type}>
                    <h4 className="text-white font-medium text-sm capitalize mb-2">
                      {type.replace('-', ' ')} ({typeIssues.length})
                    </h4>
                    <div className="space-y-2">
                      {typeIssues.map((issue, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded border ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-xs font-medium">
                                {issue.element}
                              </div>
                              <div className="text-gray-300 text-xs">
                                {issue.description}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                {issue.recommendation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}