/**
 * Enhanced Error Tracking for Analytics
 * Provides comprehensive error monitoring and reporting
 */

import React from 'react'

import { analytics } from './analytics-manager'
import { analyticsDB, generateEventId } from './analytics-database'

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
  timestamp?: number
  severity?: 'low' | 'medium' | 'high' | 'critical'
  tags?: string[]
  extra?: Record<string, any>
}

export interface ErrorEvent {
  id: string
  type: 'javascript' | 'api' | 'network' | 'validation' | 'payment' | 'auth' | 'security'
  message: string
  stack?: string
  context: ErrorContext
  fingerprint?: string
  resolved?: boolean
  occurrences?: number
  firstSeen?: number
  lastSeen?: number
}

class EnhancedErrorTracker {
  private errors: Map<string, ErrorEvent> = new Map()
  private errorQueue: ErrorEvent[] = []
  private isProcessing = false

  constructor() {
    // Process error queue every 5 seconds
    setInterval(() => {
      this.processErrorQueue()
    }, 5000)

    // Set up global error handlers
    this.setupGlobalErrorHandlers()
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript', event.message, {
        component: 'global',
        action: 'javascript_error',
        severity: 'high',
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('javascript', `Unhandled promise rejection: ${event.reason}`, {
        component: 'global',
        action: 'unhandled_promise_rejection',
        severity: 'high',
        extra: {
          reason: event.reason,
          promise: event.promise
        }
      })
    })

    // Handle network errors
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        
        if (!response.ok) {
          this.trackError('network', `HTTP ${response.status}: ${response.statusText}`, {
            component: 'fetch',
            action: 'network_error',
            severity: response.status >= 500 ? 'high' : 'medium',
            extra: {
              url: typeof args[0] === 'string' ? args[0] : (args[0] as any).href || (args[0] as any).url,
              method: args[1]?.method || 'GET',
              status: response.status,
              statusText: response.statusText
            }
          })
        }
        
        return response
      } catch (error) {
        this.trackError('network', `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
          component: 'fetch',
          action: 'network_failure',
          severity: 'high',
          extra: {
            url: typeof args[0] === 'string' ? args[0] : (args[0] as any).href || (args[0] as any).url,
            method: args[1]?.method || 'GET',
            error: error instanceof Error ? error.stack : error
          }
        })
        throw error
      }
    }
  }

  // Main error tracking method
  trackError(
    type: ErrorEvent['type'],
    message: string,
    context: ErrorContext = {},
    stack?: string
  ) {
    const errorId = generateEventId()
    const fingerprint = this.generateFingerprint(type, message, stack)
    const timestamp = Date.now()

    // Check if this is a duplicate error
    const existingError = this.errors.get(fingerprint)
    if (existingError) {
      existingError.occurrences = (existingError.occurrences || 1) + 1
      existingError.lastSeen = timestamp
      this.errors.set(fingerprint, existingError)
    } else {
      const errorEvent: ErrorEvent = {
        id: errorId,
        type,
        message,
        stack,
        context: {
          ...context,
          timestamp,
          url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
          userAgent: context.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
          sessionId: context.sessionId || this.getCurrentSessionId()
        },
        fingerprint,
        resolved: false,
        occurrences: 1,
        firstSeen: timestamp,
        lastSeen: timestamp
      }

      this.errors.set(fingerprint, errorEvent)
      this.errorQueue.push(errorEvent)
    }

    // Also track in analytics
    if (typeof analytics !== 'undefined') {
      (analytics as any).trackError(type, message, {
        error_stack: stack,
        error_fingerprint: fingerprint,
        error_context: context,
        severity: context.severity || 'medium'
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Tracked: ${type}`)
      console.error('Message:', message)
      console.error('Stack:', stack)
      console.error('Context:', context)
      console.groupEnd()
    }
  }

  // Specific error tracking methods
  trackJavaScriptError(error: Error, context: ErrorContext = {}) {
    this.trackError('javascript', error.message, {
      ...context,
      component: context.component || 'unknown',
      severity: context.severity || 'high'
    }, error.stack)
  }

  trackAPIError(
    endpoint: string,
    status: number,
    statusText: string,
    context: ErrorContext = {}
  ) {
    this.trackError('api', `API Error: ${status} ${statusText}`, {
      ...context,
      component: 'api',
      action: `${context.action || 'request'}_to_${endpoint}`,
      severity: status >= 500 ? 'high' : 'medium',
      extra: {
        endpoint,
        status,
        statusText,
        ...context.extra
      }
    })
  }

  trackValidationError(
    field: string,
    value: any,
    rule: string,
    context: ErrorContext = {}
  ) {
    this.trackError('validation', `Validation failed: ${field} (${rule})`, {
      ...context,
      component: context.component || 'form',
      action: 'validation_error',
      severity: 'low',
      extra: {
        field,
        value,
        rule,
        ...context.extra
      }
    })
  }

  trackPaymentError(
    provider: string,
    errorCode: string,
    errorMessage: string,
    context: ErrorContext = {}
  ) {
    this.trackError('payment', `Payment failed: ${provider} - ${errorMessage}`, {
      ...context,
      component: 'payment',
      action: 'payment_error',
      severity: 'high',
      extra: {
        provider,
        errorCode,
        errorMessage,
        ...context.extra
      }
    })
  }

  trackAuthError(
    action: string,
    errorMessage: string,
    context: ErrorContext = {}
  ) {
    this.trackError('auth', `Authentication failed: ${action} - ${errorMessage}`, {
      ...context,
      component: 'auth',
      action: `auth_${action}`,
      severity: 'medium',
      extra: {
        authAction: action,
        errorMessage,
        ...context.extra
      }
    })
  }

  trackSecurityError(
    threat: string,
    details: string,
    context: ErrorContext = {}
  ) {
    this.trackError('security', `Security threat: ${threat} - ${details}`, {
      ...context,
      component: 'security',
      action: 'security_threat',
      severity: 'critical',
      extra: {
        threat,
        details,
        ...context.extra
      }
    })
  }

  // Error processing
  private async processErrorQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) return

    this.isProcessing = true
    const errorsToProcess = [...this.errorQueue]
    this.errorQueue = []

    try {
      // Save errors to database
      for (const error of errorsToProcess) {
        await analyticsDB.saveEvent({
          id: error.id,
          event: 'error',
          category: 'system',
          properties: {
            error_type: error.type,
            error_message: error.message,
            error_stack: error.stack,
            error_context: error.context,
            error_fingerprint: error.fingerprint,
            error_occurrences: error.occurrences,
            severity: error.context.severity
          },
          userId: error.context.userId,
          sessionId: error.context.sessionId || '',
          timestamp: error.context.timestamp || Date.now(),
          url: error.context.url || '',
          userAgent: error.context.userAgent
        })
      }

      // Send to external error tracking service (e.g., Sentry)
      if (process.env.NODE_ENV === 'production') {
        await this.sendToExternalService(errorsToProcess)
      }
    } catch (error) {
      console.error('Failed to process error queue:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async sendToExternalService(errors: ErrorEvent[]) {
    // Implement integration with external error tracking service
    // This could be Sentry, LogRocket, Bugsnag, etc.
    
    for (const error of errors) {
      try {
        // Example: Send to Sentry
        // Sentry.captureException(new Error(error.message), {
        //   tags: {
        //     error_type: error.type,
        //     component: error.context.component,
        //     severity: error.context.severity
        //   },
        //   extra: {
        //     stack: error.stack,
        //     context: error.context,
        //     fingerprint: error.fingerprint
        //   }
        // })
        
        console.log('Would send to external service:', error)
      } catch (err) {
        console.error('Failed to send error to external service:', err)
      }
    }
  }

  // Utility methods
  private generateFingerprint(type: string, message: string, stack?: string): string {
    const content = `${type}:${message}:${stack?.split('\n')[0] || ''}`
    return Buffer.from(content).toString('base64').substring(0, 32)
  }

  private getCurrentSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('tishya_session_id')
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('tishya_session_id', sessionId)
    }
    return sessionId
  }

  // Public methods for error management
  getErrorStats(): {
    totalErrors: number
    errorsByType: Record<string, number>
    errorsBySeverity: Record<string, number>
    topErrors: ErrorEvent[]
  } {
    const errors = Array.from(this.errors.values())
    const errorsByType: Record<string, number> = {}
    const errorsBySeverity: Record<string, number> = {}

    errors.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + (error.occurrences || 1)
      const severity = error.context.severity || 'medium'
      errorsBySeverity[severity] = (errorsBySeverity[severity] || 0) + (error.occurrences || 1)
    })

    const topErrors = errors
      .sort((a, b) => (b.occurrences || 1) - (a.occurrences || 1))
      .slice(0, 10)

    return {
      totalErrors: errors.length,
      errorsByType,
      errorsBySeverity,
      topErrors
    }
  }

  resolveError(fingerprint: string): boolean {
    const error = this.errors.get(fingerprint)
    if (error) {
      error.resolved = true
      this.errors.set(fingerprint, error)
      return true
    }
    return false
  }

  clearErrors(): void {
    this.errors.clear()
    this.errorQueue = []
  }
}

// Export singleton instance
export const errorTracker = new EnhancedErrorTracker()

// React hook for error tracking
export function useErrorTracking() {
  const trackError = (error: Error, context?: ErrorContext) => {
    errorTracker.trackJavaScriptError(error, context)
  }

  const trackAPIError = (endpoint: string, status: number, statusText: string, context?: ErrorContext) => {
    errorTracker.trackAPIError(endpoint, status, statusText, context)
  }

  const trackValidationError = (field: string, value: any, rule: string, context?: ErrorContext) => {
    errorTracker.trackValidationError(field, value, rule, context)
  }

  return {
    trackError,
    trackAPIError,
    trackValidationError,
    trackPaymentError: errorTracker.trackPaymentError.bind(errorTracker),
    trackAuthError: errorTracker.trackAuthError.bind(errorTracker),
    trackSecurityError: errorTracker.trackSecurityError.bind(errorTracker)
  }
}

// Error boundary integration
export function createErrorBoundary() {
  return class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      errorTracker.trackJavaScriptError(error, {
        component: errorInfo.componentStack.split('\n')[1]?.trim() || 'unknown',
        action: 'component_error',
        severity: 'high',
        extra: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true
        }
      })
    }

    render() {
      return this.props.children
    }
  }
}

// Default export
export default errorTracker