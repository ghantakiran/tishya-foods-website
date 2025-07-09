import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum number of requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Skip successful requests from rate limiting
  skipFailedRequests?: boolean // Skip failed requests from rate limiting
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}, 5 * 60 * 1000)

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config

  return async (req: NextRequest) => {
    // Get client IP address
    const clientIp = getClientIp(req)
    const key = `${clientIp}:${req.nextUrl.pathname}`
    
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Initialize or get existing rate limit data
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + windowMs
      }
    }
    
    const rateLimitData = rateLimitStore[key]
    
    // Check if request should be counted
    const shouldCount = !skipSuccessfulRequests && !skipFailedRequests
    
    if (shouldCount) {
      rateLimitData.count++
    }
    
    // Check if limit exceeded
    if (rateLimitData.count > maxRequests) {
      const resetTime = Math.ceil((rateLimitData.resetTime - now) / 1000)
      
      return NextResponse.json(
        { error: message, retryAfter: resetTime },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimitData.resetTime / 1000).toString(),
            'Retry-After': resetTime.toString()
          }
        }
      )
    }
    
    // Add rate limit headers to response
    const remaining = Math.max(0, maxRequests - rateLimitData.count)
    const resetTime = Math.ceil(rateLimitData.resetTime / 1000)
    
    return {
      headers: {
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString()
      }
    }
  }
}

// Get client IP address from request
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const clientIp = req.headers.get('x-client-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  if (clientIp) {
    return clientIp
  }
  
  return req.ip || '127.0.0.1'
}

// Predefined rate limit configs
export const rateLimitConfigs = {
  // Strict rate limiting for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  },
  
  // Moderate rate limiting for API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'API rate limit exceeded. Please try again in a minute.'
  },
  
  // Lenient rate limiting for general endpoints
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 200, // 200 requests per minute
    message: 'Rate limit exceeded. Please try again in a minute.'
  },
  
  // Strict rate limiting for contact/email endpoints
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 emails per hour
    message: 'Too many contact form submissions. Please try again in an hour.'
  },
  
  // Rate limiting for search endpoints
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 searches per minute
    message: 'Search rate limit exceeded. Please try again in a minute.'
  }
}

// Rate limit middleware wrapper
export function withRateLimit(config: RateLimitConfig) {
  const limiter = rateLimit(config)
  
  return async (req: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) => {
    const rateLimitResult = await limiter(req)
    
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }
    
    const response = await handler(req)
    
    // Add rate limit headers to successful responses
    if (rateLimitResult.headers) {
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }
    
    return response
  }
}