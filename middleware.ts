import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Additional security headers (some are already in next.config.ts)
  response.headers.set('X-Request-ID', crypto.randomUUID())
  
  // CSRF Protection for forms
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const contentType = request.headers.get('content-type')
    
    // Check for CSRF token in forms
    if (contentType?.includes('application/x-www-form-urlencoded') || 
        contentType?.includes('multipart/form-data')) {
      
      const referer = request.headers.get('referer')
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      
      // Basic CSRF protection: check if request comes from same origin
      if (referer && origin && host) {
        const refererHost = new URL(referer).host
        const originHost = new URL(origin).host
        
        if (refererHost !== host || originHost !== host) {
          return new NextResponse('CSRF token validation failed', { status: 403 })
        }
      }
    }
    
    // API routes additional protection
    if (request.url.includes('/api/')) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      
      if (origin && host) {
        const originHost = new URL(origin).host
        if (originHost !== host && !isAllowedOrigin(originHost)) {
          return new NextResponse('Cross-origin request blocked', { status: 403 })
        }
      }
    }
  }
  
  // Rate limiting simulation (in production, use Redis or similar)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Add rate limiting headers
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')
  response.headers.set('X-RateLimit-Reset', String(Date.now() + 3600000))
  
  // Security logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Security] ${request.method} ${request.url} from ${ip}`)
  }
  
  return response
}

function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = [
    'localhost',
    '127.0.0.1',
    'tishyafoods.com',
    'www.tishyafoods.com',
    'tishya-foods-website.vercel.app',
    'tishya-foods-website-gqk6.vercel.app'
  ]
  
  return allowedOrigins.some(allowed => origin.includes(allowed))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}