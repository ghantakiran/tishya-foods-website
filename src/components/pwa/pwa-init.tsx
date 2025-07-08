'use client'

import { useEffect, useState } from 'react'
import { initializeOfflineData, syncOfflineData } from '@/lib/indexeddb'

interface PWAInitProps {
  children: React.ReactNode
}

export function PWAInit({ children }: PWAInitProps) {
  const [isReady, setIsReady] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

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

    // Initialize IndexedDB for offline data
    initializeOfflineData()

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
    if (installPrompt) {
      const result = await installPrompt.prompt()
      console.log('Install prompt result:', result)
      setInstallPrompt(null)
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

// Hook for PWA update notifications
export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const updateApp = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      setUpdateAvailable(false)
      window.location.reload()
    }
  }

  return { updateAvailable, updateApp }
}

// Hook for offline status
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      // Sync offline data when coming back online
      syncOfflineData()
    }
    const handleOffline = () => setIsOffline(true)

    setIsOffline(!navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}

// PWA notification helpers
export const PWANotifications = {
  async requestPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      return await Notification.requestPermission()
    }
    return 'denied'
  },

  async subscribeToNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
        })
        
        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        })
        
        return subscription
      } catch (error) {
        console.error('Failed to subscribe to notifications:', error)
        return null
      }
    }
    return null
  }
}