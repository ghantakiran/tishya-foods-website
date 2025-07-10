'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNetworkStatus } from './use-network-status'

interface FetchOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
  retryCondition?: (error: any, attempt: number) => boolean
}

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  isRetrying: boolean
  retryCount: number
}

const DEFAULT_OPTIONS: Required<Pick<FetchOptions, 'timeout' | 'retries' | 'retryDelay'>> = {
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
}

export function useResilientFetch<T = any>(url: string | null, options: FetchOptions = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    isRetrying: false,
    retryCount: 0
  })

  const networkStatus = useNetworkStatus()
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    timeout = DEFAULT_OPTIONS.timeout,
    retries = DEFAULT_OPTIONS.retries,
    retryDelay = DEFAULT_OPTIONS.retryDelay,
    retryCondition = (error: any, attempt: number) => {
      // Default retry condition: retry on network errors, 5xx errors, or timeouts
      return (
        attempt < retries && (
          error.name === 'TypeError' || // Network error
          error.name === 'AbortError' || // Timeout
          (error.status >= 500 && error.status < 600) // Server errors
        )
      )
    },
    ...fetchOptions
  } = options

  const fetchWithTimeout = useCallback(async (
    fetchUrl: string, 
    fetchOptions: RequestInit, 
    timeoutMs: number
  ): Promise<Response> => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeoutMs)

    timeoutRef.current = timeoutId

    try {
      const response = await fetch(fetchUrl, {
        ...fetchOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      timeoutRef.current = null

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
        ;(error as any).status = response.status
        throw error
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      timeoutRef.current = null
      
      if ((error as Error).name === 'AbortError') {
        const timeoutError = new Error('Request timeout')
        timeoutError.name = 'TimeoutError'
        throw timeoutError
      }
      
      throw error
    }
  }, [])

  const executeRequest = useCallback(async (attempt = 0): Promise<void> => {
    if (!url || !networkStatus.isOnline) {
      if (!networkStatus.isOnline) {
        setState(prev => ({
          ...prev,
          error: new Error('No internet connection'),
          loading: false,
          isRetrying: false
        }))
      }
      return
    }

    try {
      setState(prev => ({
        ...prev,
        loading: attempt === 0,
        isRetrying: attempt > 0,
        retryCount: attempt,
        error: attempt === 0 ? null : prev.error
      }))

      const response = await fetchWithTimeout(url, fetchOptions, timeout)
      const data = await response.json()

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        isRetrying: false,
        error: null,
        retryCount: 0
      }))

    } catch (error) {
      const fetchError = error as Error

      if (retryCondition(fetchError, attempt)) {
        // Calculate exponential backoff delay
        const delay = retryDelay * Math.pow(2, attempt)
        
        setState(prev => ({
          ...prev,
          isRetrying: true,
          retryCount: attempt + 1,
          error: fetchError
        }))

        setTimeout(() => {
          executeRequest(attempt + 1)
        }, delay)
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          isRetrying: false,
          error: fetchError,
          retryCount: attempt
        }))
      }
    }
  }, [url, networkStatus.isOnline, fetchOptions, timeout, retryCondition, retryDelay, fetchWithTimeout])

  // Manual retry function
  const retry = useCallback(() => {
    if (!state.loading && !state.isRetrying) {
      executeRequest()
    }
  }, [executeRequest, state.loading, state.isRetrying])

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setState(prev => ({
      ...prev,
      loading: false,
      isRetrying: false
    }))
  }, [])

  // Execute request when URL changes or when coming back online
  useEffect(() => {
    if (url && networkStatus.isOnline) {
      executeRequest()
    }

    return () => {
      cancel()
    }
  }, [url, networkStatus.isOnline, executeRequest, cancel])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return {
    ...state,
    retry,
    cancel,
    networkStatus
  }
}

// Simplified hook for common use cases
export function useFetch<T = any>(url: string | null, options?: FetchOptions) {
  return useResilientFetch<T>(url, options)
}

// Hook for API requests with common error handling
export function useApiRequest<T = any>(
  url: string | null,
  options: FetchOptions = {}
) {
  const mergedOptions: FetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  return useResilientFetch<T>(url, mergedOptions)
}