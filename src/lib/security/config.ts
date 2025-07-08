// Security configuration for the application

export interface SecurityConfig {
  // Rate limiting
  rateLimit: {
    windowMs: number
    defaultLimit: number
    apiLimit: number
    authLimit: number
    formLimit: number
  }
  
  // CSRF protection
  csrf: {
    enabled: boolean
    tokenExpiry: number
    cookieName: string
    headerName: string
  }
  
  // Content Security Policy
  csp: {
    reportOnly: boolean
    reportUri?: string
    allowedDomains: {
      scripts: string[]
      styles: string[]
      images: string[]
      fonts: string[]
      connect: string[]
      frames: string[]
    }
  }
  
  // Allowed origins
  allowedOrigins: string[]
  
  // Security features
  features: {
    xssProtection: boolean
    contentTypeSniffing: boolean
    frameProtection: boolean
    hsts: boolean
    httpsRedirect: boolean
    suspiciousActivityBlocking: boolean
  }
  
  // Logging
  logging: {
    enabled: boolean
    level: 'debug' | 'info' | 'warn' | 'error'
    includeUserAgent: boolean
    includeIP: boolean
  }
}

const developmentConfig: SecurityConfig = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    defaultLimit: 1000, // Very high for development
    apiLimit: 500,
    authLimit: 50,
    formLimit: 100
  },
  
  csrf: {
    enabled: true,
    tokenExpiry: 60 * 60 * 1000, // 1 hour
    cookieName: 'csrf-token',
    headerName: 'x-csrf-token'
  },
  
  csp: {
    reportOnly: false,
    allowedDomains: {
      scripts: [
        'localhost:*',
        '127.0.0.1:*',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://js.stripe.com'
      ],
      styles: [
        'localhost:*',
        '127.0.0.1:*',
        'https://fonts.googleapis.com'
      ],
      images: [
        'localhost:*',
        '127.0.0.1:*',
        'https://images.unsplash.com',
        'https://api.placeholder.com',
        'https://www.google-analytics.com'
      ],
      fonts: [
        'localhost:*',
        '127.0.0.1:*',
        'https://fonts.gstatic.com'
      ],
      connect: [
        'localhost:*',
        '127.0.0.1:*',
        'ws://localhost:*',
        'wss://localhost:*',
        'https://www.google-analytics.com',
        'https://api.stripe.com'
      ],
      frames: [
        'localhost:*',
        '127.0.0.1:*',
        'https://js.stripe.com'
      ]
    }
  },
  
  allowedOrigins: [
    'localhost',
    '127.0.0.1',
    'http://localhost:3000',
    'https://localhost:3000'
  ],
  
  features: {
    xssProtection: true,
    contentTypeSniffing: false,
    frameProtection: true,
    hsts: false, // Disabled in development
    httpsRedirect: false,
    suspiciousActivityBlocking: true
  },
  
  logging: {
    enabled: true,
    level: 'debug',
    includeUserAgent: true,
    includeIP: true
  }
}

const productionConfig: SecurityConfig = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    defaultLimit: 100,
    apiLimit: 60,
    authLimit: 5,
    formLimit: 10
  },
  
  csrf: {
    enabled: true,
    tokenExpiry: 60 * 60 * 1000, // 1 hour
    cookieName: 'csrf-token',
    headerName: 'x-csrf-token'
  },
  
  csp: {
    reportOnly: false,
    reportUri: '/api/security/csp-report',
    allowedDomains: {
      scripts: [
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://js.stripe.com',
        'https://cdnjs.cloudflare.com'
      ],
      styles: [
        'https://fonts.googleapis.com'
      ],
      images: [
        'https://images.unsplash.com',
        'https://api.placeholder.com',
        'https://via.placeholder.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://q.stripe.com'
      ],
      fonts: [
        'https://fonts.gstatic.com'
      ],
      connect: [
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://api.stripe.com',
        'https://checkout.stripe.com'
      ],
      frames: [
        'https://js.stripe.com',
        'https://checkout.stripe.com'
      ]
    }
  },
  
  allowedOrigins: [
    'tishyafoods.com',
    'www.tishyafoods.com',
    'https://tishyafoods.com',
    'https://www.tishyafoods.com',
    'tishya-foods-website.vercel.app',
    'https://tishya-foods-website.vercel.app'
  ],
  
  features: {
    xssProtection: true,
    contentTypeSniffing: false,
    frameProtection: true,
    hsts: true,
    httpsRedirect: true,
    suspiciousActivityBlocking: true
  },
  
  logging: {
    enabled: true,
    level: 'warn',
    includeUserAgent: false,
    includeIP: true
  }
}

export function getSecurityConfig(): SecurityConfig {
  const environment = process.env.NODE_ENV || 'development'
  
  switch (environment) {
    case 'production':
      return productionConfig
    case 'development':
      return developmentConfig
    case 'test':
      return {
        ...developmentConfig,
        logging: { ...developmentConfig.logging, enabled: false }
      }
    default:
      return developmentConfig
  }
}

export function getCSPDirectives(config: SecurityConfig) {
  const { allowedDomains } = config.csp
  
  return {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      ...allowedDomains.scripts
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      ...allowedDomains.styles
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      ...allowedDomains.images
    ],
    'font-src': [
      "'self'",
      'data:',
      ...allowedDomains.fonts
    ],
    'connect-src': [
      "'self'",
      'wss:',
      'ws:',
      ...allowedDomains.connect
    ],
    'frame-src': [
      "'self'",
      ...allowedDomains.frames
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
}

export function validateSecurityConfig(config: SecurityConfig): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Validate rate limits
  if (config.rateLimit.defaultLimit <= 0) {
    errors.push('Default rate limit must be positive')
  }
  
  if (config.rateLimit.authLimit > config.rateLimit.defaultLimit) {
    warnings.push('Auth rate limit is higher than default limit')
  }
  
  // Validate CSRF settings
  if (config.csrf.tokenExpiry < 5 * 60 * 1000) {
    warnings.push('CSRF token expiry is less than 5 minutes')
  }
  
  // Validate allowed origins
  if (config.allowedOrigins.length === 0) {
    errors.push('At least one allowed origin must be specified')
  }
  
  // Check for development settings in production
  if (process.env.NODE_ENV === 'production') {
    if (!config.features.hsts) {
      warnings.push('HSTS should be enabled in production')
    }
    
    if (config.rateLimit.defaultLimit > 200) {
      warnings.push('Rate limit seems high for production')
    }
    
    if (config.csp.allowedDomains.scripts.some(domain => domain.includes('localhost'))) {
      errors.push('Localhost domains should not be allowed in production CSP')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

// Export the current configuration
export const securityConfig = getSecurityConfig()

// Validate configuration on load
const validation = validateSecurityConfig(securityConfig)
if (!validation.valid) {
  console.error('[Security] Configuration errors:', validation.errors)
}
if (validation.warnings.length > 0) {
  console.warn('[Security] Configuration warnings:', validation.warnings)
}