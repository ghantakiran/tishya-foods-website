/**
 * Input sanitization utilities for security
 */

// HTML sanitization
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  // Remove potentially dangerous HTML tags and attributes
  const dangerousTags = [
    'script', 'iframe', 'object', 'embed', 'link', 'style', 'meta',
    'form', 'input', 'button', 'textarea', 'select', 'option'
  ]
  
  const dangerousAttributes = [
    'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
    'javascript:', 'data:', 'vbscript:', 'expression'
  ]
  
  let sanitized = input
  
  // Remove dangerous tags
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis')
    sanitized = sanitized.replace(regex, '')
    
    // Remove self-closing tags
    const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, 'gis')
    sanitized = sanitized.replace(selfClosingRegex, '')
  })
  
  // Remove dangerous attributes
  dangerousAttributes.forEach(attr => {
    const regex = new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, 'gis')
    sanitized = sanitized.replace(regex, '')
  })
  
  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:/gi, '')
  
  return sanitized.trim()
}

// XSS sanitization
export function sanitizeXss(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// SQL injection sanitization
export function sanitizeSql(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  // Remove common SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/gi,
    /(['"]?\s*;\s*--)/gi,
    /(['"]?\s*;\s*\/\*)/gi,
    /(\*\/)/gi,
    /(--)/g
  ]
  
  let sanitized = input
  sqlPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })
  
  return sanitized.trim()
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return ''
  }
  
  return email.toLowerCase().trim()
}

// Phone number sanitization
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''
  
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '')
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return ''
  
  // Only allow http and https protocols
  const urlRegex = /^https?:\/\//i
  
  if (!urlRegex.test(url)) {
    return ''
  }
  
  // Remove potential XSS in URL
  return url.replace(/javascript:/gi, '').replace(/data:/gi, '')
}

// Generic string sanitization
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\0/g, '') // Remove null bytes
}

// Number sanitization
export function sanitizeNumber(input: string | number): number | null {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input
  }
  
  if (typeof input === 'string') {
    const num = parseFloat(input.replace(/[^0-9.-]/g, ''))
    return isNaN(num) ? null : num
  }
  
  return null
}

// Boolean sanitization
export function sanitizeBoolean(input: unknown): boolean {
  if (typeof input === 'boolean') return input
  if (typeof input === 'string') {
    return input.toLowerCase() === 'true'
  }
  return false
}

// Object sanitization
export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key, 100)
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value)
    } else if (typeof value === 'number') {
      sanitized[sanitizedKey] = sanitizeNumber(value)
    } else if (typeof value === 'boolean') {
      sanitized[sanitizedKey] = sanitizeBoolean(value)
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      )
    } else if (value && typeof value === 'object') {
      sanitized[sanitizedKey] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[sanitizedKey] = value
    }
  }
  
  return sanitized
}

// Form data sanitization
export function sanitizeFormData(formData: FormData): Record<string, string> {
  const sanitized: Record<string, string> = {}
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      sanitized[sanitizeString(key, 100)] = sanitizeString(value)
    }
  }
  
  return sanitized
}

// Search query sanitization
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return ''
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;()]/g, '') // Remove potentially dangerous characters
    .slice(0, 200) // Limit length
}

// File name sanitization
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') return ''
  
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .slice(0, 255) // Limit length
}

// Comprehensive sanitization function
export function sanitize(input: unknown, type: 'html' | 'xss' | 'sql' | 'email' | 'phone' | 'url' | 'string' | 'number' | 'boolean' | 'search' | 'filename'): unknown {
  if (typeof input !== 'string' && type !== 'number' && type !== 'boolean') {
    return input
  }
  
  switch (type) {
    case 'html':
      return sanitizeHtml(input as string)
    case 'xss':
      return sanitizeXss(input as string)
    case 'sql':
      return sanitizeSql(input as string)
    case 'email':
      return sanitizeEmail(input as string)
    case 'phone':
      return sanitizePhone(input as string)
    case 'url':
      return sanitizeUrl(input as string)
    case 'string':
      return sanitizeString(input as string)
    case 'number':
      return sanitizeNumber(input as string | number)
    case 'boolean':
      return sanitizeBoolean(input)
    case 'search':
      return sanitizeSearchQuery(input as string)
    case 'filename':
      return sanitizeFileName(input as string)
    default:
      return input
  }
}