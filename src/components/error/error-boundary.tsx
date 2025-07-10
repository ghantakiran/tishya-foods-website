'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle, Home, ChevronLeft, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  level?: 'page' | 'component' | 'critical'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  isRetrying: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // In production, you might want to send this to an error reporting service
    this.logErrorToService(error, errorInfo)
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Example: Send to error reporting service
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level: this.props.level || 'component',
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      }

      // Log to console for now - replace with actual error reporting service
      console.error('Error reported:', errorData)

      // Example: Send to analytics or error reporting service
      // analytics.track('error_boundary_triggered', errorData)
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = async () => {
    if (this.retryCount >= this.maxRetries) {
      return
    }

    this.setState({ isRetrying: true })
    this.retryCount++

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000))

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    })
  }

  private handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  private handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  private handleReportIssue = () => {
    const errorMessage = this.state.error?.message || 'Unknown error'
    const subject = `Bug Report: ${errorMessage}`
    const body = `
I encountered an error on the Tishya Foods website.

Error: ${errorMessage}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Additional details:
${this.state.errorInfo?.componentStack || 'No additional details'}
    `.trim()

    const mailto = `mailto:support@tishyafoods.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailto)
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Render appropriate error UI based on level
      return this.renderErrorUI()
    }

    return this.props.children
  }

  private renderErrorUI() {
    const { level = 'component' } = this.props

    if (level === 'critical') {
      return this.renderCriticalError()
    }

    if (level === 'page') {
      return this.renderPageError()
    }

    return this.renderComponentError()
  }

  private renderCriticalError() {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-gray-800 rounded-lg p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </motion.div>
          
          <h1 className="text-xl font-bold text-gray-100 mb-2">
            Critical Error
          </h1>
          
          <p className="text-gray-400 mb-6">
            A critical error has occurred. Please refresh the page or contact support if the issue persists.
          </p>

          <div className="space-y-3">
            <Button
              onClick={this.handleRefresh}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            
            <Button
              onClick={this.handleGoHome}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  private renderPageError() {
    const { isRetrying } = this.state
    const canRetry = this.retryCount < this.maxRetries

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-gray-800 rounded-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-orange-400" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-100 mb-3">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-400 mb-6">
            We encountered an error while loading this page. This might be a temporary issue.
          </p>

          <div className="space-y-3">
            {canRetry && (
              <Button
                onClick={this.handleRetry}
                disabled={isRetrying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isRetrying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRetrying ? 'Retrying...' : `Try Again (${this.maxRetries - this.retryCount} left)`}
              </Button>
            )}
            
            <div className="flex space-x-3">
              <Button
                onClick={this.handleGoBack}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Homepage
              </Button>
            </div>

            <Button
              onClick={this.handleReportIssue}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="text-gray-500 cursor-pointer text-sm">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-400 overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <div className="mt-6 text-xs text-gray-500">
            Error ID: {Date.now().toString(36)}
          </div>
        </motion.div>
      </div>
    )
  }

  private renderComponentError() {
    const { isRetrying } = this.state
    const canRetry = this.retryCount < this.maxRetries

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 border border-gray-600 rounded-lg p-6 m-4"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Component Error
            </h3>
            
            <p className="text-gray-400 mb-4">
              This component failed to load. You can try refreshing it or continue with other parts of the page.
            </p>

            {canRetry && (
              <Button
                onClick={this.handleRetry}
                disabled={isRetrying}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isRetrying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Component-specific error boundary variants
export const PageErrorBoundary = ({ children, onError }: Omit<Props, 'level'>) => (
  <ErrorBoundary level="page" onError={onError}>
    {children}
  </ErrorBoundary>
)

export const ComponentErrorBoundary = ({ children, onError }: Omit<Props, 'level'>) => (
  <ErrorBoundary level="component" onError={onError}>
    {children}
  </ErrorBoundary>
)

export const CriticalErrorBoundary = ({ children, onError }: Omit<Props, 'level'>) => (
  <ErrorBoundary level="critical" onError={onError}>
    {children}
  </ErrorBoundary>
)