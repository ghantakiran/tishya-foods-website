import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter (use Redis in production)
const rateLimiter = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const method = request.method
  const url = request.url
  
  // Additional security headers (runtime headers that complement next.config.ts)
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Response-Time', Date.now().toString())
  response.headers.set('X-Robots-Tag', 'index, follow')
  
  // Enhanced rate limiting
  const rateLimitResult = applyRateLimit(ip, request.nextUrl.pathname)
  if (!rateLimitResult.allowed) {
    return new NextResponse('Rate limit exceeded', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    })
  }
  
  // Set rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  
  // Enhanced CSRF Protection for state-changing operations
  if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
    const csrfResult = validateCSRF(request)
    if (!csrfResult.valid) {
      return new NextResponse(csrfResult.error, { status: 403 })
    }
  }
  
  // Additional API protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiProtectionResult = validateAPIRequest(request)
    if (!apiProtectionResult.valid) {
      return new NextResponse(apiProtectionResult.error, { status: 403 })
    }
    
    // Add API-specific headers
    response.headers.set('X-API-Version', '1.0')
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }
  
  // Block suspicious patterns
  if (detectSuspiciousActivity(request)) {
    return new NextResponse('Suspicious activity detected', { status: 403 })
  }
  
  // Security logging
  logSecurityEvent(request, ip, userAgent)
  
  return response
}

// Helper functions for security middleware

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('remote-addr')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (remoteAddr) {
    return remoteAddr
  }
  
  return 'unknown'
}

function applyRateLimit(ip: string, path: string): {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const resetTime = now + windowMs
  
  // Different limits for different endpoints
  let limit = 100 // default limit per minute
  if (path.startsWith('/api/auth/')) {
    limit = 5 // stricter for auth endpoints
  } else if (path.startsWith('/api/')) {
    limit = 60 // moderate for API endpoints
  } else if (path.includes('contact') || path.includes('submit')) {
    limit = 10 // stricter for form submissions
  }
  
  const key = `${ip}:${Math.floor(now / windowMs)}`
  const current = rateLimiter.get(key) || { count: 0, resetTime }
  
  if (now > current.resetTime) {
    // Reset the counter
    current.count = 1
    current.resetTime = resetTime
  } else {
    current.count++
  }
  
  rateLimiter.set(key, current)
  
  // Clean up old entries
  if (Math.random() < 0.1) { // 10% chance to clean up
    for (const [k, v] of rateLimiter.entries()) {
      if (now > v.resetTime) {
        rateLimiter.delete(k)
      }
    }
  }
  
  return {
    allowed: current.count <= limit,
    limit,
    remaining: Math.max(0, limit - current.count),
    resetTime: current.resetTime
  }
}

function validateCSRF(request: NextRequest): { valid: boolean; error?: string } {
  const contentType = request.headers.get('content-type') || ''
  const referer = request.headers.get('referer')
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  // Skip CSRF for JSON API requests with proper headers
  if (contentType.includes('application/json')) {
    const hasCustomHeader = request.headers.get('x-requested-with') || 
                           request.headers.get('x-csrf-token') ||
                           request.headers.get('x-api-key')
    if (hasCustomHeader) {
      return { valid: true }
    }
  }
  
  // For form submissions and other requests, check origin/referer
  if (!host) {
    return { valid: false, error: 'Missing host header' }
  }
  
  const allowedHosts = [
    host,
    'localhost:3000',
    'tishyafoods.com',
    'www.tishyafoods.com'
  ]
  
  // Check origin header first
  if (origin) {
    const originHost = new URL(origin).host
    if (!allowedHosts.includes(originHost)) {
      return { valid: false, error: 'Invalid origin' }
    }
    return { valid: true }
  }
  
  // Fallback to referer header
  if (referer) {
    const refererHost = new URL(referer).host
    if (!allowedHosts.includes(refererHost)) {
      return { valid: false, error: 'Invalid referer' }
    }
    return { valid: true }
  }
  
  // For API routes without proper headers, reject
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return { valid: false, error: 'Missing origin or referer for API request' }
  }
  
  return { valid: true }
}

function validateAPIRequest(request: NextRequest): { valid: boolean; error?: string } {
  const userAgent = request.headers.get('user-agent')
  const accept = request.headers.get('accept')
  
  // Block requests without user agent (likely bots/scrapers)
  if (!userAgent) {
    return { valid: false, error: 'Missing user agent' }
  }
  
  // Block known bad user agents
  const blockedAgents = [
    'curl',
    'wget',
    'python-requests',
    'scrapy',
    'bot',
    'crawler',
    'spider'
  ]
  
  const userAgentLower = userAgent.toLowerCase()
  if (blockedAgents.some(blocked => userAgentLower.includes(blocked))) {
    // Allow legitimate crawlers
    const allowedCrawlers = [
      'googlebot',
      'bingbot',
      'slurp',
      'duckduckbot',
      'baiduspider',
      'yandexbot',
      'facebookexternalhit',
      'twitterbot',
      'linkedinbot'
    ]
    
    if (!allowedCrawlers.some(allowed => userAgentLower.includes(allowed))) {
      return { valid: false, error: 'Blocked user agent' }
    }
  }
  
  return { valid: true }
}

function detectSuspiciousActivity(request: NextRequest): boolean {
  const url = request.url.toLowerCase()
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  
  // Check for common attack patterns
  const suspiciousPatterns = [
    // SQL injection attempts
    'union select',
    'or 1=1',
    'drop table',
    'exec(',
    'script>',
    // Path traversal
    '../',
    '..\\',
    // PHP/WordPress specific attacks
    'wp-admin',
    'wp-login',
    '.php',
    'eval(',
    // Common exploit attempts
    'cmd=',
    'exec=',
    'system(',
    'passthru(',
    'shell_exec('
  ]
  
  // Check for suspicious patterns in URL
  if (suspiciousPatterns.some(pattern => url.includes(pattern))) {
    return true
  }
  
  // Check for suspicious user agents
  const suspiciousAgents = [
    'sqlmap',
    'nikto',
    'nessus',
    'burp',
    'w3af',
    'acunetix',
    'netsparker'
  ]
  
  if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
    return true
  }
  
  return false
}

function logSecurityEvent(request: NextRequest, ip: string, userAgent: string): void {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString()
    console.log(`[Security] ${timestamp} - ${request.method} ${request.url} from ${ip} (${userAgent.substring(0, 100)})`)
  }
  
  // In production, you would send this to your logging service
  // Example: send to Sentry, LogRocket, or your own logging endpoint
}

function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = [
    'localhost',
    '127.0.0.1',
    'tishyafoods.com',
    'www.tishyafoods.com',
    'tishya-foods-website.vercel.app',
    'tishya-foods-website-git-main.vercel.app',
    'tishya-foods-website-gqk6.vercel.app'
  ]
  
  return allowedOrigins.some(allowed => origin.includes(allowed))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}