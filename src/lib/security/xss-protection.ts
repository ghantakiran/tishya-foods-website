/**
 * XSS Protection utilities and middleware
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeXss } from './input-sanitizer'

// XSS Protection configuration
interface XSSProtectionConfig {
  enabled: boolean
  mode: 'block' | 'sanitize' | 'report'
  reportUri?: string
  allowedTags?: string[]
  allowedAttributes?: string[]
}

// Default XSS protection configuration
const defaultXSSConfig: XSSProtectionConfig = {
  enabled: true,
  mode: 'sanitize',
  allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
  allowedAttributes: ['href', 'title', 'alt']
}

// XSS detection patterns
const xssPatterns = [
  // Script tags
  /<script[^>]*>.*?<\/script>/gi,
  /<script[^>]*\/>/gi,
  
  // Event handlers
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /on\w+\s*=\s*[^>\s]+/gi,
  
  // JavaScript URLs
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:/gi,
  
  // Style expressions
  /expression\s*\(/gi,
  /behavior\s*:/gi,
  
  // Meta refresh
  /<meta[^>]*refresh/gi,
  
  // Import and link
  /@import/gi,
  /link\s*rel\s*=\s*["']stylesheet["']/gi,
  
  // Form elements
  /<form[^>]*>/gi,
  /<input[^>]*>/gi,
  /<textarea[^>]*>/gi,
  /<select[^>]*>/gi,
  
  // Object and embed
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<applet[^>]*>/gi,
  
  // Base64 encoded scripts
  /data:text\/html;base64,/gi,
  
  // Common XSS payloads
  /alert\s*\(/gi,
  /confirm\s*\(/gi,
  /prompt\s*\(/gi,
  /eval\s*\(/gi,
  /setTimeout\s*\(/gi,
  /setInterval\s*\(/gi,
  /Function\s*\(/gi,
  
  // SVG XSS
  /<svg[^>]*>/gi,
  /<foreignObject[^>]*>/gi,
  
  // HTML5 XSS vectors
  /<audio[^>]*>/gi,
  /<video[^>]*>/gi,
  /<source[^>]*>/gi,
  /<track[^>]*>/gi,
  
  // CSS XSS
  /style\s*=\s*["'][^"']*expression/gi,
  /style\s*=\s*["'][^"']*javascript/gi,
  
  // URL-based XSS
  /&#x?[0-9a-f]+;?/gi,
  /%[0-9a-f]{2}/gi
]

// Detect potential XSS in input
export function detectXSS(input: string): boolean {
  if (!input || typeof input !== 'string') return false
  
  return xssPatterns.some(pattern => pattern.test(input))
}

// Clean XSS from input
export function cleanXSS(input: string, config: Partial<XSSProtectionConfig> = {}): string {
  if (!input || typeof input !== 'string') return ''
  
  const finalConfig = { ...defaultXSSConfig, ...config }
  
  if (!finalConfig.enabled) return input
  
  let cleaned = input
  
  // Apply XSS patterns cleaning
  xssPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '')
  })
  
  // Additional sanitization based on mode
  switch (finalConfig.mode) {
    case 'block':
      // Block entirely if XSS detected
      return detectXSS(input) ? '' : input
      
    case 'sanitize':
      // Sanitize and clean
      cleaned = sanitizeXss(cleaned)
      break
      
    case 'report':
      // Log and sanitize
      if (detectXSS(input)) {
        console.warn('XSS attempt detected:', input)
        // In production, send to monitoring service
      }
      cleaned = sanitizeXss(cleaned)
      break
      
    default:
      cleaned = sanitizeXss(cleaned)
  }
  
  return cleaned
}

// XSS protection middleware
export function xssProtectionMiddleware(config: Partial<XSSProtectionConfig> = {}) {
  const finalConfig = { ...defaultXSSConfig, ...config }
  
  return async (req: NextRequest, res: NextResponse) => {
    if (!finalConfig.enabled) return res
    
    // Check URL parameters
    const url = new URL(req.url)
    const params = url.searchParams
    
    for (const [key, value] of params.entries()) {
      if (detectXSS(value)) {
        console.warn(`XSS detected in URL parameter ${key}:`, value)
        
        if (finalConfig.mode === 'block') {
          return NextResponse.json(
            { error: 'Invalid request parameters' },
            { status: 400 }
          )
        }
        
        // Sanitize the parameter
        params.set(key, cleanXSS(value, finalConfig))
      }
    }
    
    // Check request body for POST requests
    if (req.method === 'POST' && req.body) {
      try {
        const body = await req.json()
        const sanitizedBody = sanitizeRequestBody(body, finalConfig)
        
        // Replace the request body
        const newReq = new Request(req.url, {
          method: req.method,
          headers: req.headers,
          body: JSON.stringify(sanitizedBody)
        })
        
        return new NextResponse(newReq.body, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-XSS-Protection': '1; mode=block'
          }
        })
      } catch (error) {
        // If JSON parsing fails, continue with original request
        console.error('Failed to parse request body for XSS protection:', error)
      }
    }
    
    // Add XSS protection headers
    res.headers.set('X-XSS-Protection', '1; mode=block')
    
    return res
  }
}

// Sanitize request body recursively
function sanitizeRequestBody(body: unknown, config: XSSProtectionConfig): unknown {
  if (typeof body === 'string') {
    return cleanXSS(body, config)
  }
  
  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item, config))
  }
  
  if (body && typeof body === 'object') {
    const sanitized: Record<string, unknown> = {}
    
    for (const [key, value] of Object.entries(body)) {
      const cleanKey = cleanXSS(key, config)
      sanitized[cleanKey] = sanitizeRequestBody(value, config)
    }
    
    return sanitized
  }
  
  return body
}

// Content Security Policy nonce generator
export function generateCSPNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let nonce = ''
  
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return nonce
}

// Secure HTML renderer with XSS protection
export function renderSecureHTML(html: string, config: Partial<XSSProtectionConfig> = {}): string {
  const finalConfig = { ...defaultXSSConfig, ...config }
  
  if (!finalConfig.enabled) return html
  
  // Clean XSS first
  let clean = cleanXSS(html, finalConfig)
  
  // Allow only specific tags
  if (finalConfig.allowedTags) {
    const allowedTagsRegex = new RegExp(
      `<(?!/?(?:${finalConfig.allowedTags.join('|')})\\b)[^>]*>`,
      'gi'
    )
    clean = clean.replace(allowedTagsRegex, '')
  }
  
  // Allow only specific attributes
  if (finalConfig.allowedAttributes) {
    const allowedAttrsRegex = new RegExp(
      `\\s(?!(?:${finalConfig.allowedAttributes.join('|')})\\s*=)[^\\s=]+\\s*=\\s*["'][^"']*["']`,
      'gi'
    )
    clean = clean.replace(allowedAttrsRegex, '')
  }
  
  return clean
}

// XSS protection for React components
export function useXSSProtection(content: string, config: Partial<XSSProtectionConfig> = {}): string {
  return renderSecureHTML(content, config)
}

// Validation for user-generated content
export function validateUserContent(content: string): {
  isValid: boolean
  sanitized: string
  threats: string[]
} {
  const threats: string[] = []
  
  // Check for each XSS pattern
  xssPatterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      threats.push(`XSS pattern ${index + 1} detected`)
    }
  })
  
  const sanitized = cleanXSS(content)
  
  return {
    isValid: threats.length === 0,
    sanitized,
    threats
  }
}

// XSS protection for API responses
export function secureApiResponse(data: unknown): unknown {
  if (typeof data === 'string') {
    return cleanXSS(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(item => secureApiResponse(item))
  }
  
  if (data && typeof data === 'object') {
    const secured: Record<string, unknown> = {}
    
    for (const [key, value] of Object.entries(data)) {
      secured[key] = secureApiResponse(value)
    }
    
    return secured
  }
  
  return data
}