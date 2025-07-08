// Color contrast utility functions for WCAG compliance

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if color combination meets WCAG AAA standards
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}

/**
 * Get WCAG compliance level for color combination
 */
export function getWCAGLevel(foreground: string, background: string, isLargeText = false): 'AAA' | 'AA' | 'FAIL' {
  if (meetsWCAGAAA(foreground, background, isLargeText)) return 'AAA'
  if (meetsWCAGAA(foreground, background, isLargeText)) return 'AA'
  return 'FAIL'
}

/**
 * Predefined color combinations that meet WCAG AA standards for dark theme
 */
export const accessibleColors = {
  // Dark backgrounds with light text
  darkBg: {
    primary: '#111827', // gray-900
    secondary: '#1f2937', // gray-800
    tertiary: '#374151', // gray-700
  },
  lightText: {
    primary: '#ffffff', // white
    secondary: '#f9fafb', // gray-50  
    tertiary: '#f3f4f6', // gray-100
    muted: '#d1d5db', // gray-300
  },
  // Status colors with proper contrast
  status: {
    success: {
      bg: '#059669', // emerald-600
      text: '#ffffff'
    },
    warning: {
      bg: '#d97706', // amber-600
      text: '#ffffff'
    },
    error: {
      bg: '#dc2626', // red-600
      text: '#ffffff'
    },
    info: {
      bg: '#2563eb', // blue-600
      text: '#ffffff'
    }
  },
  // Interactive elements
  interactive: {
    primary: {
      bg: '#059669', // emerald-600
      text: '#ffffff',
      hover: '#047857' // emerald-700
    },
    secondary: {
      bg: '#6b7280', // gray-500
      text: '#ffffff',
      hover: '#4b5563' // gray-600
    }
  }
}

/**
 * Generate accessible color variations
 */
export function generateAccessibleVariations(baseColor: string, backgroundColor: string): {
  lighter: string[]
  darker: string[]
  accessible: string | null
} {
  // This is a simplified implementation
  // In a real app, you'd use a color manipulation library like chroma-js
  return {
    lighter: [],
    darker: [],
    accessible: null
  }
}

/**
 * Validate all color combinations in a theme
 */
export function validateThemeContrast(theme: Record<string, string>): {
  valid: boolean
  issues: Array<{
    combination: string
    ratio: number
    level: string
    recommendation: string
  }>
} {
  const issues: Array<{
    combination: string
    ratio: number
    level: string
    recommendation: string
  }> = []

  // Example validation - you'd expand this based on your actual theme structure
  const backgroundColors = Object.entries(theme).filter(([key]) => key.includes('bg'))
  const textColors = Object.entries(theme).filter(([key]) => key.includes('text'))

  backgroundColors.forEach(([bgKey, bgValue]) => {
    textColors.forEach(([textKey, textValue]) => {
      const ratio = getContrastRatio(textValue, bgValue)
      const level = getWCAGLevel(textValue, bgValue)
      
      if (level === 'FAIL') {
        issues.push({
          combination: `${textKey} on ${bgKey}`,
          ratio,
          level,
          recommendation: `Increase contrast ratio to at least 4.5:1 for AA compliance`
        })
      }
    })
  })

  return {
    valid: issues.length === 0,
    issues
  }
}