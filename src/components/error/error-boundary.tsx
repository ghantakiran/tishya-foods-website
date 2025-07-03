'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // In production, send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, or other error monitoring service
      this.reportError(error, errorInfo)
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // This would integrate with your error monitoring service
    console.log('Reporting error to monitoring service:', { error, errorInfo })
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  private handleGoHome = () => {
    window.location.href = '/'
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

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-100 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. The page you were trying to view has encountered an error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <details>
                  <summary className="cursor-pointer font-medium text-red-800 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-sm text-red-700 font-mono whitespace-pre-wrap">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
                
                <Button 
                  onClick={this.handleReportIssue} 
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Error ID: {Date.now().toString(36)}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}