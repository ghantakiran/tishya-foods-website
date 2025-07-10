'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor, Zap, Wifi, WifiOff } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface EnhancedPWAInitProps {
  children: React.ReactNode
}

export const EnhancedPWAInit = ({ children }: EnhancedPWAInitProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [installSource, setInstallSource] = useState<string>('')
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if app is already installed or running in standalone mode
    const checkInstallStatus = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')
      
      setIsStandalone(standalone)
      setIsInstalled(standalone)
    }

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    checkInstallStatus()
    updateOnlineStatus()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(beforeInstallPromptEvent)
      
      // Show install prompt after a delay (better UX)
      setTimeout(() => {
        if (!isInstalled && !hasUserDismissedPrompt()) {
          setShowInstallPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      
      // Track installation
      trackInstallEvent('installed', installSource)
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isInstalled, installSource])

  const hasUserDismissedPrompt = (): boolean => {
    const dismissed = localStorage.getItem('tishya-install-prompt-dismissed')
    const dismissedTime = dismissed ? new Date(dismissed).getTime() : 0
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    return Date.now() - dismissedTime < twentyFourHours
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    setInstallSource('manual')
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    console.log(`User response to the install prompt: ${outcome}`)
    
    if (outcome === 'accepted') {
      trackInstallEvent('accepted', 'manual')
    } else {
      trackInstallEvent('dismissed', 'manual')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismissPrompt = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('tishya-install-prompt-dismissed', new Date().toISOString())
    trackInstallEvent('dismissed', 'prompt')
  }

  const trackInstallEvent = async (event: string, source: string) => {
    try {
      await fetch('/api/analytics/pwa-install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          source,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          platform: navigator.platform
        })
      })
    } catch (error) {
      console.error('Error tracking install event:', error)
    }
  }

  return (
    <>
      {children}
      
      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && deferredPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-end md:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-gray-800 rounded-t-2xl md:rounded-2xl border border-gray-600 p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">
                      Install Tishya Foods
                    </h3>
                    <p className="text-sm text-gray-400">
                      Get the app experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismissPrompt}
                  className="p-1 text-gray-400 hover:text-gray-200 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Faster loading and better performance</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <WifiOff className="h-4 w-4 text-green-500" />
                  <span>Works offline - browse cached content</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span>Native app-like experience</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDismissPrompt}
                  className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Install App
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Status Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-yellow-600 text-white text-center py-2 px-4 z-[9998]"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
          >
            <div className="flex items-center justify-center space-x-2">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">
                You're offline. Some features may be limited.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Status Indicator (for installed apps) */}
      {isStandalone && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-600 text-white p-2 rounded-full shadow-lg"
          >
            <Monitor className="h-4 w-4" />
          </motion.div>
        </div>
      )}
    </>
  )
}

// Hook for PWA installation status
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(beforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    // Check if already installed
    const checkInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')
      setIsInstalled(standalone)
    }

    checkInstalled()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    setDeferredPrompt(null)
    setIsInstallable(false)
    
    return outcome === 'accepted'
  }

  return {
    isInstallable,
    isInstalled,
    promptInstall
  }
}

// PWA Installation Button Component
interface PWAInstallButtonProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'minimal'
  showIcon?: boolean
}

export const PWAInstallButton = ({ 
  className = '', 
  variant = 'primary',
  showIcon = true 
}: PWAInstallButtonProps) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall()
  const [isLoading, setIsLoading] = useState(false)

  if (isInstalled || !isInstallable) {
    return null
  }

  const handleInstall = async () => {
    setIsLoading(true)
    try {
      await promptInstall()
    } finally {
      setIsLoading(false)
    }
  }

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
    minimal: 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isLoading}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 rounded-lg
        transition-colors duration-200 font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {showIcon && <Download className="h-4 w-4" />}
      <span>{isLoading ? 'Installing...' : 'Install App'}</span>
    </button>
  )
}

export default EnhancedPWAInit