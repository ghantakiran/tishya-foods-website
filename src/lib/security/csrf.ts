import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production'
const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

// Generate a CSRF token with HMAC signature
export function generateCSRFToken(): string {
  const timestamp = Date.now().toString()
  const randomBytes = crypto.randomBytes(16).toString('hex')
  const tokenData = `${timestamp}.${randomBytes}`
  
  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', CSRF_SECRET)
  hmac.update(tokenData)
  const signature = hmac.digest('hex')
  
  return `${tokenData}.${signature}`
}

// Validate CSRF token with HMAC verification
export function validateCSRFToken(token: string): boolean {
  if (!token) return false
  
  const parts = token.split('.')
  if (parts.length !== 3) return false
  
  const [timestamp, randomString, signature] = parts
  if (!timestamp || !randomString || !signature) return false
  
  // Verify HMAC signature
  const tokenData = `${timestamp}.${randomString}`
  const hmac = crypto.createHmac('sha256', CSRF_SECRET)
  hmac.update(tokenData)
  const expectedSignature = hmac.digest('hex')
  
  if (signature !== expectedSignature) {
    return false
  }
  
  // Check if token is not older than 1 hour
  const tokenTime = parseInt(timestamp)
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  if (now - tokenTime > oneHour) {
    return false
  }
  
  return true
}

// Set CSRF token in cookie
export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_NAME, token, {
    httpOnly: false, // Need to be accessible from client-side for forms
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/'
  })
}

// Get CSRF token from request
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Try header first
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  if (headerToken) return headerToken
  
  // Try cookie
  const cookieToken = request.cookies.get(CSRF_TOKEN_NAME)?.value
  if (cookieToken) return cookieToken
  
  return null
}

// Middleware CSRF validation
export function validateCSRFMiddleware(request: NextRequest): { valid: boolean; error?: string } {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return { valid: true }
  }
  
  // Skip CSRF for API routes that have proper authentication headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization')
    const apiKey = request.headers.get('x-api-key')
    
    if (authHeader || apiKey) {
      return { valid: true }
    }
  }
  
  const token = getCSRFTokenFromRequest(request)
  
  if (!token) {
    return { valid: false, error: 'CSRF token missing' }
  }
  
  if (!validateCSRFToken(token)) {
    return { valid: false, error: 'CSRF token invalid or expired' }
  }
  
  return { valid: true }
}

// Client-side utility to get CSRF token
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null
  
  // Try to get from meta tag first
  const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
  if (metaTag) return metaTag.content
  
  // Try to get from cookie
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === CSRF_TOKEN_NAME) {
      return decodeURIComponent(value)
    }
  }
  
  return null
}

// Add CSRF token to form data
export function addCSRFToFormData(formData: FormData): FormData {
  const token = getCSRFToken()
  if (token) {
    formData.append('csrf-token', token)
  }
  return formData
}

// Add CSRF token to fetch headers
export function addCSRFToHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getCSRFToken()
  if (token) {
    return {
      ...headers,
      [CSRF_HEADER_NAME]: token
    }
  }
  return headers
}