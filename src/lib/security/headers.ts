import { NextResponse } from 'next/server'

export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    enabled: boolean
    reportOnly: boolean
    reportUri?: string
    directives: Record<string, string[]>
  }
  strictTransportSecurity?: {
    maxAge: number
    includeSubDomains: boolean
    preload: boolean
  }
  frameOptions?: 'DENY' | 'SAMEORIGIN' | string
  contentTypeOptions?: boolean
  referrerPolicy?: string
  permissionsPolicy?: Record<string, string[]>
  crossOriginEmbedderPolicy?: 'require-corp' | 'unsafe-none'
  crossOriginOpenerPolicy?: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none'
  crossOriginResourcePolicy?: 'same-site' | 'same-origin' | 'cross-origin'
}

export const defaultSecurityConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    enabled: true,
    reportOnly: false,
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://js.stripe.com'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://images.unsplash.com',
        'https://api.placeholder.com',
        'https://via.placeholder.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://q.stripe.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'data:'
      ],
      'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://api.stripe.com',
        'wss:',
        'ws:'
      ],
      'frame-src': [
        "'self'",
        'https://js.stripe.com',
        'https://checkout.stripe.com'
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'", 'https://checkout.stripe.com'],
      'frame-ancestors': ["'none'"],
      'manifest-src': ["'self'"],
      'media-src': ["'self'", 'data:', 'blob:'],
      'worker-src': ["'self'", 'blob:'],
      'child-src': ["'self'", 'blob:'],
      'upgrade-insecure-requests': [],
      'block-all-mixed-content': []
    }
  },
  strictTransportSecurity: {
    maxAge: 63072000, // 2 years
    includeSubDomains: true,
    preload: true
  },
  frameOptions: 'DENY',
  contentTypeOptions: true,
  referrerPolicy: 'origin-when-cross-origin',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: ['self'],
    usb: [],
    'screen-wake-lock': [],
    accelerometer: [],
    gyroscope: [],
    magnetometer: [],
    bluetooth: [],
    midi: [],
    'ambient-light-sensor': [],
    'document-domain': []
  },
  crossOriginEmbedderPolicy: 'unsafe-none',
  crossOriginOpenerPolicy: 'same-origin-allow-popups',
  crossOriginResourcePolicy: 'cross-origin'
}

export function buildCSP(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive
      }
      return `${directive} ${sources.join(' ')}`
    })
    .join('; ')
}

export function buildPermissionsPolicy(policies: Record<string, string[]>): string {
  return Object.entries(policies)
    .map(([directive, allowlist]) => {
      if (allowlist.length === 0) {
        return `${directive}=()`
      }
      return `${directive}=(${allowlist.join(' ')})`
    })
    .join(', ')
}

export function applySecurityHeaders(
  response: NextResponse,
  config: SecurityHeadersConfig = defaultSecurityConfig
): NextResponse {
  // Content Security Policy
  if (config.contentSecurityPolicy?.enabled) {
    const csp = buildCSP(config.contentSecurityPolicy.directives)
    const headerName = config.contentSecurityPolicy.reportOnly 
      ? 'Content-Security-Policy-Report-Only' 
      : 'Content-Security-Policy'
    
    let cspHeader = csp
    if (config.contentSecurityPolicy.reportUri) {
      cspHeader += `; report-uri ${config.contentSecurityPolicy.reportUri}`
    }
    
    response.headers.set(headerName, cspHeader)
  }
  
  // Strict Transport Security
  if (config.strictTransportSecurity) {
    const hsts = config.strictTransportSecurity
    let hstsValue = `max-age=${hsts.maxAge}`
    if (hsts.includeSubDomains) hstsValue += '; includeSubDomains'
    if (hsts.preload) hstsValue += '; preload'
    
    response.headers.set('Strict-Transport-Security', hstsValue)
  }
  
  // X-Frame-Options
  if (config.frameOptions) {
    response.headers.set('X-Frame-Options', config.frameOptions)
  }
  
  // X-Content-Type-Options
  if (config.contentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }
  
  // Referrer-Policy
  if (config.referrerPolicy) {
    response.headers.set('Referrer-Policy', config.referrerPolicy)
  }
  
  // Permissions-Policy
  if (config.permissionsPolicy) {
    const permissionsPolicy = buildPermissionsPolicy(config.permissionsPolicy)
    response.headers.set('Permissions-Policy', permissionsPolicy)
  }
  
  // Cross-Origin-Embedder-Policy
  if (config.crossOriginEmbedderPolicy) {
    response.headers.set('Cross-Origin-Embedder-Policy', config.crossOriginEmbedderPolicy)
  }
  
  // Cross-Origin-Opener-Policy
  if (config.crossOriginOpenerPolicy) {
    response.headers.set('Cross-Origin-Opener-Policy', config.crossOriginOpenerPolicy)
  }
  
  // Cross-Origin-Resource-Policy
  if (config.crossOriginResourcePolicy) {
    response.headers.set('Cross-Origin-Resource-Policy', config.crossOriginResourcePolicy)
  }
  
  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Origin-Agent-Cluster', '?1')
  
  return response
}

export function getSecurityHeadersForEnvironment(): SecurityHeadersConfig {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const config = { ...defaultSecurityConfig }
  
  if (isDevelopment) {
    // Relax CSP for development
    config.contentSecurityPolicy!.directives['script-src'] = [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'localhost:*',
      '127.0.0.1:*',
      '*.hot-update.js'
    ]
    
    config.contentSecurityPolicy!.directives['connect-src'] = [
      "'self'",
      'localhost:*',
      '127.0.0.1:*',
      'ws://localhost:*',
      'wss://localhost:*'
    ]
    
    // Disable HSTS in development
    config.strictTransportSecurity = undefined
  }
  
  return config
}

export function validateSecurityHeaders(headers: Record<string, string>): {
  valid: boolean
  missing: string[]
  warnings: string[]
} {
  const requiredHeaders = [
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy'
  ]
  
  const recommendedHeaders = [
    'strict-transport-security',
    'permissions-policy',
    'cross-origin-opener-policy'
  ]
  
  const missing: string[] = []
  const warnings: string[] = []
  
  // Check required headers
  for (const header of requiredHeaders) {
    if (!headers[header] && !headers[header.toLowerCase()]) {
      missing.push(header)
    }
  }
  
  // Check recommended headers
  for (const header of recommendedHeaders) {
    if (!headers[header] && !headers[header.toLowerCase()]) {
      warnings.push(`Recommended header missing: ${header}`)
    }
  }
  
  // Check CSP quality
  const csp = headers['content-security-policy'] || headers['Content-Security-Policy']
  if (csp) {
    if (csp.includes("'unsafe-eval'")) {
      warnings.push("CSP contains 'unsafe-eval' which reduces security")
    }
    if (csp.includes("'unsafe-inline'")) {
      warnings.push("CSP contains 'unsafe-inline' which reduces security")
    }
    if (!csp.includes('upgrade-insecure-requests')) {
      warnings.push('CSP should include upgrade-insecure-requests')
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    warnings
  }
}