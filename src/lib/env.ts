import { z } from 'zod'

// Environment validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // App configuration
  NEXT_PUBLIC_APP_NAME: z.string().default('Tishya Foods'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  PORT: z.string().transform(Number).default(3000),
  
  // Database
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // API Keys
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  
  // External Services
  RESEND_API_KEY: z.string().optional(),
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  
  // Error Monitoring
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // Development
  ANALYZE: z.string().transform(val => val === 'true').optional(),
  DEBUG: z.string().optional(),
  
  // Security
  ALLOWED_ORIGINS: z.string().optional(),
  RATE_LIMIT_MAX: z.string().transform(Number).default(100),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default(900000), // 15 minutes
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default(true),
  NEXT_PUBLIC_ENABLE_PWA: z.string().transform(val => val === 'true').default(true),
  NEXT_PUBLIC_ENABLE_SUBSCRIPTION: z.string().transform(val => val === 'true').default(true),
  NEXT_PUBLIC_ENABLE_LOYALTY: z.string().transform(val => val === 'true').default(true),
})

export type Env = z.infer<typeof envSchema>

// Parse and validate environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
      
      console.error('❌ Environment validation failed:')
      issues.forEach(issue => console.error(`  - ${issue}`))
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment validation failed in production')
      }
      
      console.warn('⚠️  Continuing with invalid environment in development mode')
      return envSchema.parse({}) // Return with defaults
    }
    
    throw error
  }
}

export const env = validateEnv()

// Environment helpers
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Database configuration
export const dbConfig = {
  url: env.DATABASE_URL,
  directUrl: env.DIRECT_URL,
}

// Stripe configuration
export const stripeConfig = {
  secretKey: env.STRIPE_SECRET_KEY,
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
}

// Authentication configuration
export const authConfig = {
  secret: env.NEXTAUTH_SECRET,
  url: env.NEXTAUTH_URL,
}

// Feature flags
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  pwa: env.NEXT_PUBLIC_ENABLE_PWA,
  subscription: env.NEXT_PUBLIC_ENABLE_SUBSCRIPTION,
  loyalty: env.NEXT_PUBLIC_ENABLE_LOYALTY,
}

// Security configuration
export const securityConfig = {
  allowedOrigins: env.ALLOWED_ORIGINS?.split(',') || [],
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW,
  },
}

// Analytics configuration
export const analyticsConfig = {
  googleAnalyticsId: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  posthogKey: env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: env.NEXT_PUBLIC_POSTHOG_HOST,
}

// Error monitoring configuration
export const errorMonitoringConfig = {
  sentryDsn: env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN,
  sentryOrg: env.SENTRY_ORG,
  sentryProject: env.SENTRY_PROJECT,
  sentryAuthToken: env.SENTRY_AUTH_TOKEN,
}

// Logging configuration based on environment
export const loggingConfig = {
  level: isDevelopment ? 'debug' : isTest ? 'error' : 'info',
  pretty: isDevelopment,
  timestamp: !isDevelopment,
}

// Validate required environment variables for production
export function validateProductionEnv() {
  if (!isProduction) return

  const requiredForProduction = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  ]

  const missing = requiredForProduction.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for production: ${missing.join(', ')}`
    )
  }
}

// Environment information for debugging
export function getEnvironmentInfo() {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    features,
    ...(isDevelopment && {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      pid: process.pid,
    }),
  }
}

// Log environment information on startup
if (isDevelopment) {
  console.log('🚀 Environment Information:', getEnvironmentInfo())
  
  if (!env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set - database features will not work')
  }
  
  if (!env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  Stripe configuration incomplete - payment features will not work')
  }
}