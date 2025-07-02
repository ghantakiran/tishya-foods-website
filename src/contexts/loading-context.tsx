'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { FullPageLoading } from '@/components/loading/loading-skeleton'

interface LoadingContextType {
  isLoading: boolean
  startLoading: (message?: string) => void
  stopLoading: () => void
  loadingMessage: string
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')

  const startLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        startLoading, 
        stopLoading, 
        loadingMessage 
      }}
    >
      {children}
      {isLoading && <FullPageLoading />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}