/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly code?: string
  public readonly details?: any

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    details?: any
  ) {
    super(message)
    
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.code = code
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, true, 'VALIDATION_ERROR', details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true, 'NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true, 'CONFLICT_ERROR')
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT_ERROR')
  }
}

export interface ErrorResponse {
  error: {
    message: string
    code?: string
    statusCode: number
    details?: any
    stack?: string
    timestamp: string
    requestId?: string
  }
}

export function createErrorResponse(
  error: Error | AppError,
  requestId?: string
): NextResponse<ErrorResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isAppError = error instanceof AppError

  const statusCode = isAppError ? error.statusCode : 500
  const code = isAppError ? error.code : 'INTERNAL_SERVER_ERROR'
  const details = isAppError ? error.details : undefined

  const errorResponse: ErrorResponse = {
    error: {
      message: error.message || 'An unexpected error occurred',
      code,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
      requestId,
      ...(isDevelopment && { stack: error.stack })
    }
  }

  // Log error for monitoring
  console.error('API Error:', {
    message: error.message,
    statusCode,
    code,
    stack: error.stack,
    requestId,
    details
  })

  return NextResponse.json(errorResponse, { status: statusCode })
}

export function handleApiError(
  error: unknown,
  requestId?: string
): NextResponse<ErrorResponse> {
  if (error instanceof AppError) {
    return createErrorResponse(error, requestId)
  }

  if (error instanceof Error) {
    return createErrorResponse(error, requestId)
  }

  // Handle non-Error objects
  const unknownError = new AppError(
    'An unknown error occurred',
    500,
    false,
    'UNKNOWN_ERROR',
    error
  )

  return createErrorResponse(unknownError, requestId)
}

export function logError(error: Error, context?: Record<string, any>) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    ...(error instanceof AppError && {
      statusCode: error.statusCode,
      code: error.code,
      isOperational: error.isOperational,
      details: error.details
    })
  }

  console.error('Application Error:', errorLog)

  // In production, you would send this to your error tracking service
  // e.g., Sentry, DataDog, etc.
}

export function asyncHandler(
  fn: (req: Request, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: Request, ...args: any[]): Promise<NextResponse> => {
    try {
      return await fn(req, ...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Client-side error boundary helpers
export function createErrorBoundaryFallback(
  error: Error,
  errorInfo: { componentStack: string }
) {
  return {
    hasError: true,
    error: {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    }
  }
}

export function reportError(error: Error, errorInfo?: any) {
  const errorReport = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    errorInfo
  }

  console.error('Client Error:', errorReport)

  // In production, send to error tracking service
  // You could also send to your own API endpoint for custom error tracking
}

// Development helpers
export function debugLog(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🐛 [DEBUG] ${message}`, data ? data : '')
  }
}

export function performanceLog(label: string, startTime: number) {
  if (process.env.NODE_ENV === 'development') {
    const duration = performance.now() - startTime
    console.log(`⚡ [PERF] ${label}: ${duration.toFixed(2)}ms`)
  }
}

// Type guards
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isAuthError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError
}