'use client'

import { useEffect, useState } from 'react'

interface PWAInitProps {
  children: React.ReactNode
}

export function PWAInit({ children }: PWAInitProps) {
  const [, setIsReady] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<unknown>(null)

  useEffect(() => {
    // Register service worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('SW registered: ', registration)

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New content available, please refresh.')
                  // Could show a toast notification here
                }
              })
            }
          })
        } catch (error) {
          console.log('SW registration failed: ', error)
        }
      }
      setIsReady(true)
    }

    registerSW()

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setInstallPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Install PWA function
  const installPWA = async () => {
    if (installPrompt && typeof (installPrompt as { prompt?: () => void }).prompt === 'function') {
      (installPrompt as { prompt: () => void }).prompt()
    }
  }

  return (
    <>
      {children}
      
      {/* PWA Install Button - only show if prompt is available */}
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold text-sm">Install Tishya Foods App</div>
              <div className="text-xs opacity-90">Quick access to your favorite foods</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInstallPrompt(null)}
                className="text-white/70 hover:text-white px-2 py-1 text-xs"
              >
                Later
              </button>
              <button
                onClick={installPWA}
                className="bg-white text-green-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Hook to check if app is running in standalone mode
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebApp = isStandalone || isInWebAppiOS
      setIsPWA(isInWebApp)
    }

    checkPWA()
    window.addEventListener('resize', checkPWA)
    
    return () => window.removeEventListener('resize', checkPWA)
  }, [])

  return isPWA
}