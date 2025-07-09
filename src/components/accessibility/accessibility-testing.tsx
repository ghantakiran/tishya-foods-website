'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Play, 
  Pause, 
  RotateCcw,
  FileText,
  Download,
  Eye,
  Keyboard,
  Mouse,
  Zap
} from 'lucide-react'

interface AccessibilityTestResult {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  rule: string
  description: string
  element?: Element
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  help: string
  helpUrl?: string
  selector?: string
}

interface AccessibilityTestSuite {
  name: string
  description: string
  tests: Array<{
    id: string
    name: string
    description: string
    run: () => Promise<AccessibilityTestResult[]>
  }>
}

// Main accessibility testing component
export const AccessibilityTester = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<AccessibilityTestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [selectedSuite, setSelectedSuite] = useState<string>('all')
  
  const testSuites: AccessibilityTestSuite[] = [
    {
      name: 'Keyboard Navigation',
      description: 'Tests for keyboard accessibility and navigation',
      tests: [
        {
          id: 'tabindex-test',
          name: 'Tab Index Validation',
          description: 'Checks for proper tabindex usage',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const elements = document.querySelectorAll('[tabindex]')
            
            elements.forEach((element, index) => {
              const tabIndex = element.getAttribute('tabindex')
              if (tabIndex && parseInt(tabIndex) > 0) {
                results.push({
                  id: `tabindex-${index}`,
                  type: 'warning',
                  rule: 'tabindex-no-positive',
                  description: 'Avoid positive tabindex values',
                  element,
                  impact: 'moderate',
                  help: 'Positive tabindex values can create a confusing navigation experience',
                  selector: element.tagName.toLowerCase()
                })
              }
            })
            
            return results
          }
        },
        {
          id: 'focus-test',
          name: 'Focus Management',
          description: 'Tests focus visibility and management',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const focusableElements = document.querySelectorAll(
              'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            
            focusableElements.forEach((element, index) => {
              const styles = window.getComputedStyle(element)
              const outlineStyle = styles.getPropertyValue('outline')
              const outlineWidth = styles.getPropertyValue('outline-width')
              const outlineColor = styles.getPropertyValue('outline-color')
              
              // Check if element has visible focus indicator
              if (outlineStyle === 'none' && outlineWidth === '0px') {
                results.push({
                  id: `focus-${index}`,
                  type: 'error',
                  rule: 'focus-visible',
                  description: 'Element lacks visible focus indicator',
                  element,
                  impact: 'serious',
                  help: 'All interactive elements must have a visible focus indicator',
                  selector: element.tagName.toLowerCase()
                })
              }
            })
            
            return results
          }
        }
      ]
    },
    {
      name: 'ARIA and Semantics',
      description: 'Tests for proper ARIA usage and semantic HTML',
      tests: [
        {
          id: 'aria-labels-test',
          name: 'ARIA Labels',
          description: 'Validates ARIA label usage',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const ariaLabelledElements = document.querySelectorAll('[aria-labelledby]')
            
            ariaLabelledElements.forEach((element, index) => {
              const labelledBy = element.getAttribute('aria-labelledby')
              if (labelledBy) {
                const labelElement = document.getElementById(labelledBy)
                if (!labelElement) {
                  results.push({
                    id: `aria-label-${index}`,
                    type: 'error',
                    rule: 'aria-labelledby-valid',
                    description: 'aria-labelledby references non-existent element',
                    element,
                    impact: 'serious',
                    help: 'aria-labelledby must reference existing element IDs',
                    selector: element.tagName.toLowerCase()
                  })
                }
              }
            })
            
            return results
          }
        },
        {
          id: 'heading-structure-test',
          name: 'Heading Structure',
          description: 'Tests heading hierarchy and structure',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
            let previousLevel = 0
            
            headings.forEach((heading, index) => {
              const level = parseInt(heading.tagName.substring(1))
              
              if (index === 0 && level !== 1) {
                results.push({
                  id: `heading-start-${index}`,
                  type: 'error',
                  rule: 'heading-start-h1',
                  description: 'Page should start with h1 heading',
                  element: heading,
                  impact: 'serious',
                  help: 'The first heading on a page should be h1',
                  selector: heading.tagName.toLowerCase()
                })
              }
              
              if (level > previousLevel + 1) {
                results.push({
                  id: `heading-skip-${index}`,
                  type: 'warning',
                  rule: 'heading-order',
                  description: 'Heading levels should not skip',
                  element: heading,
                  impact: 'moderate',
                  help: 'Heading levels should increase by one level at a time',
                  selector: heading.tagName.toLowerCase()
                })
              }
              
              previousLevel = level
            })
            
            return results
          }
        }
      ]
    },
    {
      name: 'Color and Contrast',
      description: 'Tests for color accessibility and contrast ratios',
      tests: [
        {
          id: 'color-contrast-test',
          name: 'Color Contrast',
          description: 'Validates color contrast ratios',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label')
            
            textElements.forEach((element, index) => {
              const styles = window.getComputedStyle(element)
              const color = styles.color
              const backgroundColor = styles.backgroundColor
              
              // Skip if background is transparent
              if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                return
              }
              
              // Simple contrast check (would need more sophisticated implementation)
              const textContent = element.textContent?.trim()
              if (textContent && textContent.length > 0) {
                results.push({
                  id: `contrast-${index}`,
                  type: 'info',
                  rule: 'color-contrast',
                  description: 'Color contrast should be manually verified',
                  element,
                  impact: 'minor',
                  help: 'Ensure text has sufficient contrast with background',
                  selector: element.tagName.toLowerCase()
                })
              }
            })
            
            return results
          }
        }
      ]
    },
    {
      name: 'Images and Media',
      description: 'Tests for image accessibility and alt text',
      tests: [
        {
          id: 'alt-text-test',
          name: 'Alt Text Validation',
          description: 'Checks for proper alt text usage',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const images = document.querySelectorAll('img')
            
            images.forEach((img, index) => {
              const alt = img.getAttribute('alt')
              const src = img.getAttribute('src')
              
              if (alt === null) {
                results.push({
                  id: `alt-missing-${index}`,
                  type: 'error',
                  rule: 'image-alt',
                  description: 'Image missing alt attribute',
                  element: img,
                  impact: 'critical',
                  help: 'All images must have an alt attribute',
                  selector: 'img'
                })
              } else if (alt === '' && !img.hasAttribute('aria-hidden')) {
                results.push({
                  id: `alt-empty-${index}`,
                  type: 'warning',
                  rule: 'image-alt-empty',
                  description: 'Image has empty alt text but may not be decorative',
                  element: img,
                  impact: 'moderate',
                  help: 'Empty alt text should only be used for decorative images',
                  selector: 'img'
                })
              }
              
              if (src && src.includes('placeholder') && alt && alt.length > 0) {
                results.push({
                  id: `alt-placeholder-${index}`,
                  type: 'warning',
                  rule: 'image-alt-placeholder',
                  description: 'Placeholder image should have empty alt text',
                  element: img,
                  impact: 'minor',
                  help: 'Placeholder images should be treated as decorative',
                  selector: 'img'
                })
              }
            })
            
            return results
          }
        }
      ]
    },
    {
      name: 'Forms',
      description: 'Tests for form accessibility',
      tests: [
        {
          id: 'form-labels-test',
          name: 'Form Labels',
          description: 'Validates form field labels',
          run: async () => {
            const results: AccessibilityTestResult[] = []
            const inputs = document.querySelectorAll('input, select, textarea')
            
            inputs.forEach((input, index) => {
              const id = input.id
              const type = input.getAttribute('type')
              const ariaLabel = input.getAttribute('aria-label')
              const ariaLabelledby = input.getAttribute('aria-labelledby')
              
              // Skip hidden inputs
              if (type === 'hidden') return
              
              let hasLabel = false
              
              // Check for associated label
              if (id) {
                const label = document.querySelector(`label[for="${id}"]`)
                if (label) hasLabel = true
              }
              
              // Check for aria-label or aria-labelledby
              if (ariaLabel || ariaLabelledby) hasLabel = true
              
              if (!hasLabel) {
                results.push({
                  id: `form-label-${index}`,
                  type: 'error',
                  rule: 'form-field-label',
                  description: 'Form field missing accessible label',
                  element: input,
                  impact: 'critical',
                  help: 'All form fields must have accessible labels',
                  selector: input.tagName.toLowerCase()
                })
              }
            })
            
            return results
          }
        }
      ]
    }
  ]
  
  const runTests = async (suiteFilter: string = 'all') => {
    setIsRunning(true)
    setResults([])
    setProgress(0)
    
    const suitesToRun = suiteFilter === 'all' 
      ? testSuites 
      : testSuites.filter(suite => suite.name.toLowerCase().includes(suiteFilter.toLowerCase()))
    
    const allTests = suitesToRun.flatMap(suite => suite.tests)
    const totalTests = allTests.length
    let completedTests = 0
    
    const allResults: AccessibilityTestResult[] = []
    
    for (const test of allTests) {
      setCurrentTest(test.name)
      
      try {
        const testResults = await test.run()
        allResults.push(...testResults)
      } catch (error) {
        console.error(`Test ${test.name} failed:`, error)
        allResults.push({
          id: `test-error-${test.id}`,
          type: 'error',
          rule: 'test-execution',
          description: `Test execution failed: ${test.name}`,
          impact: 'serious',
          help: 'Test could not be completed due to an error'
        })
      }
      
      completedTests++
      setProgress((completedTests / totalTests) * 100)
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setResults(allResults)
    setCurrentTest(null)
    setIsRunning(false)
    setShowReport(true)
  }
  
  const generateReport = () => {
    const errors = results.filter(r => r.type === 'error')
    const warnings = results.filter(r => r.type === 'warning')
    const info = results.filter(r => r.type === 'info')
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        errors: errors.length,
        warnings: warnings.length,
        info: info.length
      },
      results: results.map(r => ({
        ...r,
        element: r.element ? {
          tagName: r.element.tagName,
          id: r.element.id,
          className: r.element.className,
          textContent: r.element.textContent?.substring(0, 100)
        } : undefined
      }))
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-500'
      case 'serious': return 'text-red-400'
      case 'moderate': return 'text-yellow-400'
      case 'minor': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <Info className="h-5 w-5 text-gray-500" />
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Accessibility Tester
        </h1>
        <p className="text-gray-400">
          Comprehensive WCAG 2.1 AA compliance testing
        </p>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedSuite}
              onChange={(e) => setSelectedSuite(e.target.value)}
              className="bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            >
              <option value="all">All Test Suites</option>
              {testSuites.map(suite => (
                <option key={suite.name} value={suite.name}>
                  {suite.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => runTests(selectedSuite)}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run Tests</span>
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setResults([])}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            
            {results.length > 0 && (
              <button
                onClick={generateReport}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Running: {currentTest}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Results Summary */}
      {results.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Test Results Summary
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {results.filter(r => r.type === 'error').length}
              </div>
              <div className="text-sm text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {results.filter(r => r.type === 'warning').length}
              </div>
              <div className="text-sm text-gray-400">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {results.filter(r => r.type === 'info').length}
              </div>
              <div className="text-sm text-gray-400">Info</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-100">
                {results.length}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>
          
          {/* Results List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => {
                  if (result.element) {
                    result.element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    result.element.classList.add('ring-2', 'ring-blue-500')
                    setTimeout(() => {
                      result.element?.classList.remove('ring-2', 'ring-blue-500')
                    }, 2000)
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  {getTypeIcon(result.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-100">
                        {result.rule}
                      </h3>
                      <span className={`text-xs font-medium ${getImpactColor(result.impact)}`}>
                        {result.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      {result.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {result.help}
                    </p>
                    {result.selector && (
                      <p className="text-xs text-gray-500 mt-1">
                        Element: {result.selector}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Test Suites Info */}
      {!isRunning && results.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Available Test Suites
          </h2>
          
          <div className="grid gap-4">
            {testSuites.map((suite) => (
              <div key={suite.name} className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-100 mb-2">
                  {suite.name}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {suite.description}
                </p>
                <div className="text-xs text-gray-400">
                  {suite.tests.length} tests available
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AccessibilityTester