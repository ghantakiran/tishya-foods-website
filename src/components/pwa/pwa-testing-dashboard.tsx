'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Download, 
  Bell, 
  Database,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Refresh
} from 'lucide-react'

interface PWATestResult {
  test: string
  status: 'pass' | 'fail' | 'warning' | 'testing'
  message: string
  details?: string
}

export const PWATestingDashboard = () => {
  const [testResults, setTestResults] = useState<PWATestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<string>('unknown')
  const [manifestStatus, setManifestStatus] = useState<string>('unknown')
  const [cacheStatus, setCacheStatus] = useState<string>('unknown')
  const [pushStatus, setPushStatus] = useState<string>('unknown')

  useEffect(() => {
    checkInitialStatus()
  }, [])

  const checkInitialStatus = async () => {
    // Check Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        setServiceWorkerStatus(registration ? 'active' : 'inactive')
      } catch (error) {
        setServiceWorkerStatus('error')
      }
    } else {
      setServiceWorkerStatus('unsupported')
    }

    // Check Manifest
    try {
      const response = await fetch('/manifest.json')
      setManifestStatus(response.ok ? 'valid' : 'invalid')
    } catch (error) {
      setManifestStatus('error')
    }

    // Check Cache API
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        setCacheStatus(cacheNames.length > 0 ? 'active' : 'empty')
      } catch (error) {
        setCacheStatus('error')
      }
    } else {
      setCacheStatus('unsupported')
    }

    // Check Push Notifications
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setPushStatus(Notification.permission)
    } else {
      setPushStatus('unsupported')
    }
  }

  const runComprehensiveTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests = [
      testServiceWorkerRegistration,
      testManifestFile,
      testCacheStrategy,
      testOfflineCapability,
      testPushNotifications,
      testInstallability,
      testResponsiveDesign,
      testPerformance,
      testSecureConnection,
      testIcons
    ]

    for (const test of tests) {
      try {
        const result = await test()
        setTestResults(prev => [...prev, result])
        await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for better UX
      } catch (error) {
        setTestResults(prev => [...prev, {
          test: test.name,
          status: 'fail',
          message: 'Test execution failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }])
      }
    }

    setIsRunning(false)
  }

  // Individual test functions
  const testServiceWorkerRegistration = async (): Promise<PWATestResult> => {
    if (!('serviceWorker' in navigator)) {
      return {
        test: 'Service Worker Support',
        status: 'fail',
        message: 'Service Workers not supported',
        details: 'Browser does not support Service Workers'
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready
      return {
        test: 'Service Worker Registration',
        status: 'pass',
        message: 'Service Worker successfully registered',
        details: `Active worker: ${registration.active?.scriptURL}`
      }
    } catch (error) {
      return {
        test: 'Service Worker Registration',
        status: 'fail',
        message: 'Service Worker registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testManifestFile = async (): Promise<PWATestResult> => {
    try {
      const response = await fetch('/manifest.json')
      if (!response.ok) {
        return {
          test: 'Web App Manifest',
          status: 'fail',
          message: 'Manifest file not found',
          details: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      const manifest = await response.json()
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons']
      const missingFields = requiredFields.filter(field => !manifest[field])

      if (missingFields.length > 0) {
        return {
          test: 'Web App Manifest',
          status: 'warning',
          message: 'Manifest missing recommended fields',
          details: `Missing: ${missingFields.join(', ')}`
        }
      }

      return {
        test: 'Web App Manifest',
        status: 'pass',
        message: 'Valid manifest with all required fields',
        details: `Name: ${manifest.name}, Icons: ${manifest.icons?.length || 0}`
      }
    } catch (error) {
      return {
        test: 'Web App Manifest',
        status: 'fail',
        message: 'Failed to load manifest',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testCacheStrategy = async (): Promise<PWATestResult> => {
    if (!('caches' in window)) {
      return {
        test: 'Cache Strategy',
        status: 'fail',
        message: 'Cache API not supported',
        details: 'Browser does not support Cache API'
      }
    }

    try {
      const cacheNames = await caches.keys()
      if (cacheNames.length === 0) {
        return {
          test: 'Cache Strategy',
          status: 'warning',
          message: 'No caches found',
          details: 'Service Worker may not be caching resources'
        }
      }

      const cachePromises = cacheNames.map(async name => {
        const cache = await caches.open(name)
        const keys = await cache.keys()
        return { name, count: keys.length }
      })

      const cacheDetails = await Promise.all(cachePromises)
      const totalCachedItems = cacheDetails.reduce((sum, cache) => sum + cache.count, 0)

      return {
        test: 'Cache Strategy',
        status: 'pass',
        message: `${cacheNames.length} caches with ${totalCachedItems} items`,
        details: cacheDetails.map(c => `${c.name}: ${c.count} items`).join(', ')
      }
    } catch (error) {
      return {
        test: 'Cache Strategy',
        status: 'fail',
        message: 'Cache inspection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testOfflineCapability = async (): Promise<PWATestResult> => {
    try {
      // Test if offline page exists
      const offlineResponse = await fetch('/offline.html', { cache: 'no-cache' })
      if (!offlineResponse.ok) {
        return {
          test: 'Offline Capability',
          status: 'warning',
          message: 'No offline page found',
          details: 'Consider adding an offline.html page'
        }
      }

      // Test if essential resources are cached
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        let hasEssentialCache = false

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const cachedRequests = await cache.keys()
          
          // Check if root page is cached
          const hasRootPage = cachedRequests.some(req => 
            req.url.endsWith('/') || req.url.includes('index')
          )
          
          if (hasRootPage) {
            hasEssentialCache = true
            break
          }
        }

        if (!hasEssentialCache) {
          return {
            test: 'Offline Capability',
            status: 'warning',
            message: 'Essential pages may not be cached',
            details: 'Root page should be cached for offline access'
          }
        }
      }

      return {
        test: 'Offline Capability',
        status: 'pass',
        message: 'Offline support configured',
        details: 'Offline page exists and essential resources are cached'
      }
    } catch (error) {
      return {
        test: 'Offline Capability',
        status: 'fail',
        message: 'Offline capability test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testPushNotifications = async (): Promise<PWATestResult> => {
    if (!('Notification' in window)) {
      return {
        test: 'Push Notifications',
        status: 'fail',
        message: 'Notifications not supported',
        details: 'Browser does not support Web Notifications'
      }
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return {
        test: 'Push Notifications',
        status: 'fail',
        message: 'Push API not supported',
        details: 'Browser does not support Push API'
      }
    }

    const permission = Notification.permission
    if (permission === 'denied') {
      return {
        test: 'Push Notifications',
        status: 'warning',
        message: 'Notifications blocked by user',
        details: 'User has denied notification permissions'
      }
    }

    if (permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        
        return {
          test: 'Push Notifications',
          status: 'pass',
          message: subscription ? 'Push notifications active' : 'Ready for subscription',
          details: subscription ? 'User is subscribed to push notifications' : 'Notifications permitted, ready to subscribe'
        }
      } catch (error) {
        return {
          test: 'Push Notifications',
          status: 'warning',
          message: 'Push subscription check failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return {
      test: 'Push Notifications',
      status: 'warning',
      message: 'Notification permission not requested',
      details: 'Notifications are available but permission not yet requested'
    }
  }

  const testInstallability = async (): Promise<PWATestResult> => {
    // Check if PWA criteria are met
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    
    if (!isSecure) {
      return {
        test: 'PWA Installability',
        status: 'fail',
        message: 'Not served over HTTPS',
        details: 'PWAs require HTTPS (except on localhost)'
      }
    }

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')

    if (isStandalone) {
      return {
        test: 'PWA Installability',
        status: 'pass',
        message: 'PWA is installed and running',
        details: 'App is currently running in standalone mode'
      }
    }

    // Check if installable (beforeinstallprompt would have fired)
    const installPromptDismissed = localStorage.getItem('tishya-install-prompt-dismissed')
    if (installPromptDismissed) {
      return {
        test: 'PWA Installability',
        status: 'pass',
        message: 'PWA is installable',
        details: 'Install prompt has been shown to user'
      }
    }

    return {
      test: 'PWA Installability',
      status: 'warning',
      message: 'Installability criteria check',
      details: 'Ensure manifest, service worker, and HTTPS requirements are met'
    }
  }

  const testResponsiveDesign = async (): Promise<PWATestResult> => {
    const viewport = document.querySelector('meta[name="viewport"]')
    
    if (!viewport) {
      return {
        test: 'Responsive Design',
        status: 'fail',
        message: 'Missing viewport meta tag',
        details: 'Viewport meta tag is required for responsive design'
      }
    }

    const content = viewport.getAttribute('content') || ''
    const hasWidthDevice = content.includes('width=device-width')
    const hasInitialScale = content.includes('initial-scale=1')

    if (!hasWidthDevice || !hasInitialScale) {
      return {
        test: 'Responsive Design',
        status: 'warning',
        message: 'Suboptimal viewport configuration',
        details: 'Viewport should include width=device-width and initial-scale=1'
      }
    }

    return {
      test: 'Responsive Design',
      status: 'pass',
      message: 'Responsive design configured',
      details: 'Proper viewport meta tag found'
    }
  }

  const testPerformance = async (): Promise<PWATestResult> => {
    if (!('performance' in window)) {
      return {
        test: 'Performance',
        status: 'warning',
        message: 'Performance API not available',
        details: 'Cannot measure performance metrics'
      }
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) {
      return {
        test: 'Performance',
        status: 'warning',
        message: 'Navigation timing not available',
        details: 'Cannot measure page load performance'
      }
    }

    const loadTime = navigation.loadEventEnd - navigation.loadEventStart
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

    if (loadTime > 3000) {
      return {
        test: 'Performance',
        status: 'warning',
        message: 'Slow page load detected',
        details: `Load time: ${Math.round(loadTime)}ms (target: <3000ms)`
      }
    }

    return {
      test: 'Performance',
      status: 'pass',
      message: 'Good performance metrics',
      details: `Load: ${Math.round(loadTime)}ms, DOMContentLoaded: ${Math.round(domContentLoaded)}ms`
    }
  }

  const testSecureConnection = async (): Promise<PWATestResult> => {
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    
    if (!isSecure) {
      return {
        test: 'Secure Connection',
        status: 'fail',
        message: 'Not served over HTTPS',
        details: 'PWAs require HTTPS for full functionality'
      }
    }

    return {
      test: 'Secure Connection',
      status: 'pass',
      message: 'Secure HTTPS connection',
      details: 'Site is served over HTTPS'
    }
  }

  const testIcons = async (): Promise<PWATestResult> => {
    try {
      const manifestResponse = await fetch('/manifest.json')
      const manifest = await manifestResponse.json()
      
      if (!manifest.icons || manifest.icons.length === 0) {
        return {
          test: 'PWA Icons',
          status: 'fail',
          message: 'No icons defined in manifest',
          details: 'PWA requires at least one icon'
        }
      }

      const iconSizes = manifest.icons.map((icon: any) => icon.sizes)
      const hasRequiredSizes = ['192x192', '512x512'].every(size => 
        iconSizes.some((iconSize: string) => iconSize.includes(size))
      )

      if (!hasRequiredSizes) {
        return {
          test: 'PWA Icons',
          status: 'warning',
          message: 'Missing recommended icon sizes',
          details: 'PWA should include 192x192 and 512x512 icons'
        }
      }

      return {
        test: 'PWA Icons',
        status: 'pass',
        message: `${manifest.icons.length} icons configured`,
        details: `Sizes: ${iconSizes.join(', ')}`
      }
    } catch (error) {
      return {
        test: 'PWA Icons',
        status: 'fail',
        message: 'Failed to check icons',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'testing': return <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      default: return <div className="h-5 w-5 bg-gray-500 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400'
      case 'fail': return 'text-red-400'
      case 'warning': return 'text-yellow-400'
      case 'testing': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          PWA Testing Dashboard
        </h1>
        <p className="text-gray-400">
          Comprehensive PWA functionality testing for Tishya Foods
        </p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Zap className="h-8 w-8 mx-auto mb-2 text-blue-400" />
          <div className="text-sm text-gray-400">Service Worker</div>
          <div className={`font-semibold ${getStatusColor(serviceWorkerStatus)}`}>
            {serviceWorkerStatus}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Database className="h-8 w-8 mx-auto mb-2 text-green-400" />
          <div className="text-sm text-gray-400">Manifest</div>
          <div className={`font-semibold ${getStatusColor(manifestStatus)}`}>
            {manifestStatus}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Database className="h-8 w-8 mx-auto mb-2 text-purple-400" />
          <div className="text-sm text-gray-400">Cache</div>
          <div className={`font-semibold ${getStatusColor(cacheStatus)}`}>
            {cacheStatus}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Bell className="h-8 w-8 mx-auto mb-2 text-orange-400" />
          <div className="text-sm text-gray-400">Push</div>
          <div className={`font-semibold ${getStatusColor(pushStatus)}`}>
            {pushStatus}
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Comprehensive PWA Testing
            </h2>
            <p className="text-gray-400">
              Run a complete test suite to validate PWA functionality
            </p>
          </div>
          
          <button
            onClick={runComprehensiveTests}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Refresh className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Testing...' : 'Run Tests'}</span>
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Test Results ({testResults.length} tests)
          </h3>
          
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-100">
                        {result.test}
                      </h4>
                      <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">
                      {result.message}
                    </p>
                    {result.details && (
                      <p className="text-gray-400 text-xs">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PWATestingDashboard