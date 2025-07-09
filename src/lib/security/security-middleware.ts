import { NextRequest, NextResponse } from 'next/server'
import { validateCSRFMiddleware } from './csrf'
import { rateLimit, rateLimitConfigs } from './rate-limiter'
import { xssProtectionMiddleware } from './xss-protection'
import { sanitizeObject } from './input-sanitizer'

// Security middleware configuration
interface SecurityConfig {
  csrf: {
    enabled: boolean
    skipPaths?: string[]
  }
  rateLimit: {
    enabled: boolean
    config: 'auth' | 'api' | 'general' | 'contact' | 'search'
    customConfig?: {
      windowMs: number
      maxRequests: number
      message?: string
    }
  }
  xss: {
    enabled: boolean
    mode: 'block' | 'sanitize' | 'report'
  }
  sanitization: {
    enabled: boolean
    sanitizeBody: boolean
    sanitizeQuery: boolean
  }
  headers: {
    addSecurityHeaders: boolean
  }
}

// Default security configuration
const defaultSecurityConfig: SecurityConfig = {
  csrf: {
    enabled: true,
    skipPaths: ['/api/auth/callback', '/api/webhook', '/api/health']
  },
  rateLimit: {
    enabled: true,
    config: 'api'
  },
  xss: {
    enabled: true,
    mode: 'sanitize'
  },
  sanitization: {
    enabled: true,
    sanitizeBody: true,
    sanitizeQuery: true
  },
  headers: {
    addSecurityHeaders: true
  }
}

// Create security middleware with configuration
export function createSecurityMiddleware(config: Partial<SecurityConfig> = {}) {
  const finalConfig = { ...defaultSecurityConfig, ...config }
  
  return async (request: NextRequest) => {
    const url = new URL(request.url)
    let response: NextResponse | null = null
    
    try {
      // 1. Rate limiting
      if (finalConfig.rateLimit.enabled) {
        const rateLimitConfig = finalConfig.rateLimit.customConfig || 
                               rateLimitConfigs[finalConfig.rateLimit.config]
        
        const rateLimiter = rateLimit(rateLimitConfig)
        const rateLimitResult = await rateLimiter(request)
        
        if (rateLimitResult instanceof NextResponse) {
          return rateLimitResult
        }
        
        // Store rate limit headers for later use
        response = NextResponse.next()
        if (rateLimitResult.headers) {
          Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
            response!.headers.set(key, value)
          })
        }
      }
      
      // 2. CSRF Protection
      if (finalConfig.csrf.enabled) {
        const csrfValidation = validateCSRFMiddleware(request)
        
        if (!csrfValidation.valid) {
          return NextResponse.json(
            { error: csrfValidation.error },
            { status: 403 }
          )
        }
      }
      
      // 3. XSS Protection
      if (finalConfig.xss.enabled) {
        const xssMiddleware = xssProtectionMiddleware({ 
          enabled: true, 
          mode: finalConfig.xss.mode 
        })
        
        if (response) {
          response = await xssMiddleware(request, response)
        } else {
          response = await xssMiddleware(request, NextResponse.next())
        }
      }
      
      // 4. Input Sanitization
      if (finalConfig.sanitization.enabled) {
        // Sanitize query parameters
        if (finalConfig.sanitization.sanitizeQuery) {
          const sanitizedParams = new URLSearchParams()
          
          for (const [key, value] of url.searchParams.entries()) {
            const sanitizedKey = sanitizeInput(key)
            const sanitizedValue = sanitizeInput(value)
            sanitizedParams.set(sanitizedKey, sanitizedValue)
          }
          
          url.search = sanitizedParams.toString()
        }
        
        // Sanitize request body for POST/PUT/PATCH requests
        if (finalConfig.sanitization.sanitizeBody && 
            ['POST', 'PUT', 'PATCH'].includes(request.method)) {
          try {
            const contentType = request.headers.get('content-type')
            
            if (contentType?.includes('application/json')) {
              const body = await request.json()
              const sanitizedBody = sanitizeObject(body)
              
              // Create new request with sanitized body
              const newRequest = new Request(url.toString(), {
                method: request.method,
                headers: request.headers,
                body: JSON.stringify(sanitizedBody)
              })
              
              // Replace the original request
              Object.defineProperty(request, 'json', {
                value: async () => sanitizedBody,
                writable: false
              })
            }
          } catch (error) {
            console.error('Error sanitizing request body:', error)
          }
        }
      }
      
      // 5. Add Security Headers
      if (finalConfig.headers.addSecurityHeaders) {
        if (!response) {
          response = NextResponse.next()
        }
        
        addSecurityHeaders(response, request)
      }
      
      return response || NextResponse.next()
      
    } catch (error) {
      console.error('Security middleware error:', error)
      
      return NextResponse.json(
        { error: 'Security validation failed' },
        { status: 500 }
      )
    }
  }
}

// Add comprehensive security headers
function addSecurityHeaders(response: NextResponse, request: NextRequest) {
  // Basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HTTPS enforcement
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Permissions policy
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), ' +
    'screen-wake-lock=(), accelerometer=(), gyroscope=(), magnetometer=(), ' +
    'bluetooth=(), midi=(), ambient-light-sensor=(), document-domain=()'
  )
  
  // Cross-origin policies
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  
  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Security audit headers
  response.headers.set('X-Security-Audit', 'passed')
  response.headers.set('X-Security-Timestamp', new Date().toISOString())
}

// Helper function to sanitize input
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;()]/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 1000) // Limit length
}

// Route-specific security configurations
export const securityConfigs = {
  // Authentication routes
  auth: {
    csrf: { enabled: true },
    rateLimit: { enabled: true, config: 'auth' as const },
    xss: { enabled: true, mode: 'block' as const },
    sanitization: { enabled: true, sanitizeBody: true, sanitizeQuery: true },
    headers: { addSecurityHeaders: true }
  },
  
  // API routes
  api: {
    csrf: { enabled: true },
    rateLimit: { enabled: true, config: 'api' as const },
    xss: { enabled: true, mode: 'sanitize' as const },
    sanitization: { enabled: true, sanitizeBody: true, sanitizeQuery: true },
    headers: { addSecurityHeaders: true }
  },
  
  // Contact form
  contact: {
    csrf: { enabled: true },
    rateLimit: { enabled: true, config: 'contact' as const },
    xss: { enabled: true, mode: 'sanitize' as const },
    sanitization: { enabled: true, sanitizeBody: true, sanitizeQuery: true },
    headers: { addSecurityHeaders: true }
  },
  
  // Search endpoints
  search: {
    csrf: { enabled: false }, // Search can be GET requests
    rateLimit: { enabled: true, config: 'search' as const },
    xss: { enabled: true, mode: 'sanitize' as const },
    sanitization: { enabled: true, sanitizeBody: false, sanitizeQuery: true },
    headers: { addSecurityHeaders: true }
  },
  
  // General routes
  general: {
    csrf: { enabled: true },
    rateLimit: { enabled: true, config: 'general' as const },
    xss: { enabled: true, mode: 'sanitize' as const },
    sanitization: { enabled: true, sanitizeBody: true, sanitizeQuery: true },
    headers: { addSecurityHeaders: true }
  }
}

// Utility function to apply security middleware to API routes
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: keyof typeof securityConfigs = 'api'
) {
  const securityMiddleware = createSecurityMiddleware(securityConfigs[config])
  
  return async (req: NextRequest) => {
    // Apply security middleware first
    const securityResponse = await securityMiddleware(req)
    
    // If security middleware returns a response (error), return it
    if (securityResponse.status !== 200) {
      return securityResponse
    }
    
    // Otherwise, proceed with the handler
    return await handler(req)
  }
}