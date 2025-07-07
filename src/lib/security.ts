import { NextRequest } from 'next/server'

export interface SanitizedInput {
  value: string
  isValid: boolean
  errors: string[]
}

export function sanitizeInput(input: string, options: {
  maxLength?: number
  allowHtml?: boolean
  allowSpecialChars?: boolean
  pattern?: RegExp
} = {}): SanitizedInput {
  const {
    maxLength = 500,
    allowHtml = false,
    allowSpecialChars = true,
    pattern
  } = options

  const errors: string[] = []
  let sanitized = input.trim()

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')

  // Length validation
  if (sanitized.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`)
    sanitized = sanitized.substring(0, maxLength)
  }

  // HTML sanitization
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Special characters validation
  if (!allowSpecialChars) {
    const specialCharsRegex = /[<>{}[\]\\\/=+]/
    if (specialCharsRegex.test(sanitized)) {
      errors.push('Special characters are not allowed')
    }
  }

  // Pattern validation
  if (pattern && !pattern.test(sanitized)) {
    errors.push('Input does not match required pattern')
  }

  return {
    value: sanitized,
    isValid: errors.length === 0,
    errors
  }
}

export function sanitizeEmail(email: string): SanitizedInput {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return sanitizeInput(email, {
    maxLength: 320,
    allowHtml: false,
    allowSpecialChars: true,
    pattern: emailPattern
  })
}

export function sanitizeName(name: string): SanitizedInput {
  const namePattern = /^[a-zA-Z\s'-]+$/
  return sanitizeInput(name, {
    maxLength: 100,
    allowHtml: false,
    allowSpecialChars: false,
    pattern: namePattern
  })
}

export function sanitizePhone(phone: string): SanitizedInput {
  const phonePattern = /^\+?[\d\s-()]+$/
  return sanitizeInput(phone, {
    maxLength: 20,
    allowHtml: false,
    allowSpecialChars: false,
    pattern: phonePattern
  })
}

export function sanitizeMessage(message: string): SanitizedInput {
  return sanitizeInput(message, {
    maxLength: 2000,
    allowHtml: false,
    allowSpecialChars: true
  })
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    // Reset window
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }
  
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }
  
  current.count++
  return { allowed: true, remaining: limit - current.count, resetTime: current.resetTime }
}

export function getClientIdentifier(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Create a hash of IP + User Agent for basic identification
  const identifier = `${ip}-${userAgent.substring(0, 50)}`
  return Buffer.from(identifier).toString('base64').substring(0, 32)
}

export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token') || 
                request.cookies.get('csrf-token')?.value
  
  if (!token) {
    return false
  }
  
  // In production, validate against a secure token store
  // For now, we'll use a simple validation
  return token.length >= 32
}

export function generateCSRFToken(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

// SQL injection prevention (for database queries)
export function sanitizeForSQL(input: string): string {
  return input.replace(/['"\\;]/g, '')
}

// XSS prevention for output
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}