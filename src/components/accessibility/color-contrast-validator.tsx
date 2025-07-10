'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Eye, EyeOff, Sun, Monitor, Contrast } from 'lucide-react'

// Color contrast calculation utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

const getWCAGLevel = (ratio: number, isLargeText: boolean = false): {
  level: 'AAA' | 'AA' | 'A' | 'FAIL'
  passes: boolean
} => {
  const threshold = isLargeText ? 3.0 : 4.5
  const aaaThreshold = isLargeText ? 4.5 : 7.0
  
  if (ratio >= aaaThreshold) {
    return { level: 'AAA', passes: true }
  } else if (ratio >= threshold) {
    return { level: 'AA', passes: true }
  } else if (ratio >= 3.0) {
    return { level: 'A', passes: false }
  } else {
    return { level: 'FAIL', passes: false }
  }
}

// Enhanced color contrast checker component
interface ColorContrastCheckerProps {
  foreground: string
  background: string
  text?: string
  isLargeText?: boolean
  className?: string
}

export const ColorContrastChecker = ({
  foreground,
  background,
  text = 'Sample text',
  isLargeText = false,
  className
}: ColorContrastCheckerProps) => {
  const [contrastRatio, setContrastRatio] = useState(0)
  const [wcagLevel, setWcagLevel] = useState<{ level: string; passes: boolean }>({ level: 'FAIL', passes: false })
  
  useEffect(() => {
    const ratio = getContrastRatio(foreground, background)
    const level = getWCAGLevel(ratio, isLargeText)
    setContrastRatio(ratio)
    setWcagLevel(level)
  }, [foreground, background, isLargeText])
  
  const getStatusColor = () => {
    switch (wcagLevel.level) {
      case 'AAA': return 'text-green-400'
      case 'AA': return 'text-green-400'
      case 'A': return 'text-yellow-400'
      default: return 'text-red-400'
    }
  }
  
  return (
    <div className={`p-4 rounded-lg border border-gray-600 ${className}`}>
      {/* Sample text preview */}
      <div
        className="p-4 rounded-lg mb-4 transition-all duration-300"
        style={{
          backgroundColor: background,
          color: foreground,
          fontSize: isLargeText ? '1.25rem' : '1rem',
          fontWeight: isLargeText ? 'bold' : 'normal'
        }}
      >
        {text}
      </div>
      
      {/* Contrast information */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Contrast Ratio:</span>
          <span className="font-mono text-sm text-gray-100">
            {contrastRatio.toFixed(2)}:1
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">WCAG Level:</span>
          <span className={`font-semibold text-sm ${getStatusColor()}`}>
            {wcagLevel.level} {wcagLevel.passes ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Text Size:</span>
          <span className="text-sm text-gray-100">
            {isLargeText ? 'Large (18pt+ or 14pt+ bold)' : 'Normal'}
          </span>
        </div>
      </div>
      
      {/* Recommendations */}
      {!wcagLevel.passes && (
        <div className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">
            <strong>Accessibility Issue:</strong> This color combination doesn't meet WCAG AA standards. 
            Consider using a darker foreground or lighter background color.
          </p>
        </div>
      )}
    </div>
  )
}

// Color palette with accessibility information
interface AccessibleColorPaletteProps {
  colors: Array<{
    name: string
    hex: string
    usage: string
  }>
  backgroundColors: string[]
  className?: string
}

export const AccessibleColorPalette = ({
  colors,
  backgroundColors,
  className
}: AccessibleColorPaletteProps) => {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedBackground, setSelectedBackground] = useState(backgroundColors[0])
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Color selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-100 mb-2">Foreground Colors</h3>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSelectedColor(color)}
                className={`
                  w-full h-12 rounded-lg border-2 transition-all duration-200
                  ${selectedColor.hex === color.hex 
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
                    : 'border-gray-600 hover:border-gray-500'
                  }
                `}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-100 mb-2">Background Colors</h3>
          <div className="grid grid-cols-3 gap-2">
            {backgroundColors.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedBackground(bg)}
                className={`
                  w-full h-12 rounded-lg border-2 transition-all duration-200
                  ${selectedBackground === bg 
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
                    : 'border-gray-600 hover:border-gray-500'
                  }
                `}
                style={{ backgroundColor: bg }}
                aria-label={`Select background color ${bg}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected color info */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          {selectedColor.name}
        </h3>
        <p className="text-sm text-gray-300 mb-2">
          {selectedColor.usage}
        </p>
        <p className="text-xs text-gray-400 font-mono">
          {selectedColor.hex}
        </p>
      </div>
      
      {/* Contrast checker */}
      <ColorContrastChecker
        foreground={selectedColor.hex}
        background={selectedBackground}
        text={`${selectedColor.name} text sample`}
      />
    </div>
  )
}

// High contrast mode toggle
interface HighContrastToggleProps {
  className?: string
}

export const HighContrastToggle = ({ className }: HighContrastToggleProps) => {
  const [isHighContrast, setIsHighContrast] = useState(false)
  
  useEffect(() => {
    const stored = localStorage.getItem('high-contrast-mode')
    if (stored === 'true') {
      setIsHighContrast(true)
      document.documentElement.classList.add('high-contrast')
    }
  }, [])
  
  const toggleHighContrast = () => {
    const newValue = !isHighContrast
    setIsHighContrast(newValue)
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast')
      localStorage.setItem('high-contrast-mode', 'true')
    } else {
      document.documentElement.classList.remove('high-contrast')
      localStorage.setItem('high-contrast-mode', 'false')
    }
  }
  
  return (
    <button
      onClick={toggleHighContrast}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg
        bg-gray-800 hover:bg-gray-700 text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-colors duration-200
        ${className}
      `}
      aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      aria-pressed={isHighContrast}
    >
      <Contrast className="h-4 w-4" />
      <span className="text-sm font-medium">
        {isHighContrast ? 'High Contrast: On' : 'High Contrast: Off'}
      </span>
    </button>
  )
}

// Color blindness simulation
interface ColorBlindnessSimulatorProps {
  children: React.ReactNode
  type?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'none'
  className?: string
}

export const ColorBlindnessSimulator = ({
  children,
  type = 'none',
  className
}: ColorBlindnessSimulatorProps) => {
  const filterMap = {
    protanopia: 'url(#protanopia-filter)',
    deuteranopia: 'url(#deuteranopia-filter)',
    tritanopia: 'url(#tritanopia-filter)',
    achromatopsia: 'url(#achromatopsia-filter)',
    none: 'none'
  }
  
  return (
    <div className={className}>
      <svg className="sr-only">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix values="0.567, 0.433, 0,     0, 0
                                 0.558, 0.442, 0,     0, 0
                                 0,     0.242, 0.758, 0, 0
                                 0,     0,     0,     1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix values="0.625, 0.375, 0,   0, 0
                                 0.7,   0.3,   0,   0, 0
                                 0,     0.3,   0.7, 0, 0
                                 0,     0,     0,   1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix values="0.95, 0.05,  0,     0, 0
                                 0,    0.433, 0.567, 0, 0
                                 0,    0.475, 0.525, 0, 0
                                 0,    0,     0,     1, 0" />
          </filter>
          <filter id="achromatopsia-filter">
            <feColorMatrix values="0.299, 0.587, 0.114, 0, 0
                                 0.299, 0.587, 0.114, 0, 0
                                 0.299, 0.587, 0.114, 0, 0
                                 0,     0,     0,     1, 0" />
          </filter>
        </defs>
      </svg>
      
      <div
        style={{
          filter: filterMap[type],
          transition: 'filter 0.3s ease'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Color blindness testing controls
interface ColorBlindnessTestControlsProps {
  currentType: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'none'
  onTypeChange: (type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'none') => void
  className?: string
}

export const ColorBlindnessTestControls = ({
  currentType,
  onTypeChange,
  className
}: ColorBlindnessTestControlsProps) => {
  const options = [
    { value: 'none', label: 'Normal Vision' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
    { value: 'achromatopsia', label: 'Achromatopsia (Color-blind)' }
  ] as const
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-100 flex items-center">
        <Eye className="h-4 w-4 mr-2" />
        Color Blindness Simulation
      </h3>
      
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <input
              type="radio"
              name="color-blindness-type"
              value={option.value}
              checked={currentType === option.value}
              onChange={(e) => onTypeChange(e.target.value as typeof currentType)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// Automated contrast testing for entire page
export const useContrastTesting = () => {
  const [contrastIssues, setContrastIssues] = useState<Array<{
    element: Element
    foreground: string
    background: string
    ratio: number
    passes: boolean
  }>>([])
  
  const testPageContrast = async () => {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label')
    const issues: typeof contrastIssues = []
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element)
      const foreground = styles.color
      const background = styles.backgroundColor
      
      // Convert RGB to hex for ratio calculation
      const fgHex = rgbToHex(...foreground.match(/\d+/g)?.map(Number) || [0, 0, 0])
      const bgHex = rgbToHex(...background.match(/\d+/g)?.map(Number) || [255, 255, 255])
      
      const ratio = getContrastRatio(fgHex, bgHex)
      const fontSize = parseInt(styles.fontSize)
      const fontWeight = styles.fontWeight
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700)
      
      const { passes } = getWCAGLevel(ratio, isLargeText)
      
      if (!passes) {
        issues.push({
          element,
          foreground: fgHex,
          background: bgHex,
          ratio,
          passes
        })
      }
    })
    
    setContrastIssues(issues)
    return issues
  }
  
  return {
    contrastIssues,
    testPageContrast
  }
}

export {
  HighContrastToggle,
  ColorBlindnessSimulator,
  ColorBlindnessTestControls,
  useContrastTesting,
  getContrastRatio,
  getWCAGLevel
}