'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Settings, Check, X } from 'lucide-react'

interface PushNotificationManagerProps {
  className?: string
}

interface NotificationSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

export const PushNotificationManager = ({ className }: PushNotificationManagerProps) => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  })
  const [subscription, setSubscription] = useState<NotificationSubscription | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newProducts: true,
    priceDrops: true,
    stockAlerts: true
  })

  useEffect(() => {
    checkSupport()
    checkPermission()
    loadPreferences()
  }, [])

  const checkSupport = () => {
    const supported = 'Notification' in window && 
                     'serviceWorker' in navigator && 
                     'PushManager' in window
    setIsSupported(supported)
  }

  const checkPermission = () => {
    if (!isSupported) return

    const currentPermission = Notification.permission
    setPermission({
      granted: currentPermission === 'granted',
      denied: currentPermission === 'denied',
      default: currentPermission === 'default'
    })

    if (currentPermission === 'granted') {
      getExistingSubscription()
    }
  }

  const loadPreferences = () => {
    const stored = localStorage.getItem('tishya-notification-preferences')
    if (stored) {
      setPreferences(JSON.parse(stored))
    }
  }

  const savePreferences = (newPreferences: typeof preferences) => {
    setPreferences(newPreferences)
    localStorage.setItem('tishya-notification-preferences', JSON.stringify(newPreferences))
  }

  const getExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      
      if (existingSubscription) {
        setSubscription({
          endpoint: existingSubscription.endpoint,
          keys: {
            p256dh: existingSubscription.toJSON().keys?.p256dh || '',
            auth: existingSubscription.toJSON().keys?.auth || ''
          }
        })
      }
    } catch (error) {
      console.error('Error getting existing subscription:', error)
    }
  }

  const requestPermission = async () => {
    if (!isSupported) return

    setIsSubscribing(true)

    try {
      const permission = await Notification.requestPermission()
      
      setPermission({
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default'
      })

      if (permission === 'granted') {
        await subscribeToNotifications()
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Get VAPID public key from server
      const vapidResponse = await fetch('/api/push/vapid-key')
      const { publicKey } = await vapidResponse.json()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      })

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          preferences
        })
      })

      if (response.ok) {
        setSubscription({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys?.p256dh || '',
            auth: subscription.toJSON().keys?.auth || ''
          }
        })
        console.log('Successfully subscribed to push notifications')
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
    }
  }

  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Notify server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        })
      }
      
      setSubscription(null)
      console.log('Successfully unsubscribed from push notifications')
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error)
    }
  }

  const updatePreferences = async (newPreferences: typeof preferences) => {
    savePreferences(newPreferences)
    
    if (subscription) {
      try {
        await fetch('/api/push/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            preferences: newPreferences
          })
        })
      } catch (error) {
        console.error('Error updating preferences:', error)
      }
    }
  }

  const sendTestNotification = async () => {
    if (!subscription) return

    try {
      await fetch('/api/push/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      })
    } catch (error) {
      console.error('Error sending test notification:', error)
    }
  }

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  if (!isSupported) {
    return (
      <div className={`p-4 bg-gray-800 rounded-lg border border-gray-600 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-400">
          <BellOff className="h-5 w-5" />
          <span className="text-sm">Push notifications not supported</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main notification toggle */}
      <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              permission.granted ? 'bg-green-600' : 'bg-gray-700'
            }`}>
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">Push Notifications</h3>
              <p className="text-sm text-gray-400">
                {permission.granted 
                  ? 'Enabled - You\'ll receive updates about your orders' 
                  : 'Get notified about order updates, promotions, and more'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {permission.granted && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Notification settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
            
            {permission.denied ? (
              <span className="text-sm text-red-400">Blocked</span>
            ) : permission.granted ? (
              <button
                onClick={unsubscribeFromNotifications}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={requestPermission}
                disabled={isSubscribing}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {isSubscribing ? 'Enabling...' : 'Enable'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification settings */}
      <AnimatePresence>
        {showSettings && permission.granted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-600 p-4 space-y-4"
          >
            <h4 className="font-semibold text-gray-100 mb-3">Notification Preferences</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-200">Order Updates</label>
                  <p className="text-xs text-gray-400">Order confirmations, shipping updates, delivery notifications</p>
                </div>
                <button
                  onClick={() => updatePreferences({ ...preferences, orderUpdates: !preferences.orderUpdates })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.orderUpdates ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-200">Promotions</label>
                  <p className="text-xs text-gray-400">Special offers, discounts, and promotional campaigns</p>
                </div>
                <button
                  onClick={() => updatePreferences({ ...preferences, promotions: !preferences.promotions })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.promotions ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.promotions ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-200">New Products</label>
                  <p className="text-xs text-gray-400">Notifications about new product launches</p>
                </div>
                <button
                  onClick={() => updatePreferences({ ...preferences, newProducts: !preferences.newProducts })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.newProducts ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.newProducts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-200">Price Drops</label>
                  <p className="text-xs text-gray-400">Notifications when items in your wishlist go on sale</p>
                </div>
                <button
                  onClick={() => updatePreferences({ ...preferences, priceDrops: !preferences.priceDrops })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.priceDrops ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.priceDrops ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-200">Stock Alerts</label>
                  <p className="text-xs text-gray-400">Notifications when out-of-stock items are available</p>
                </div>
                <button
                  onClick={() => updatePreferences({ ...preferences, stockAlerts: !preferences.stockAlerts })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.stockAlerts ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.stockAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-700">
              <button
                onClick={sendTestNotification}
                className="w-full px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                Send Test Notification
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission denied message */}
      {permission.denied && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-300 mb-1">Notifications Blocked</h4>
              <p className="text-sm text-red-200 mb-2">
                You've blocked notifications for this site. To enable them:
              </p>
              <ol className="text-sm text-red-200 space-y-1 ml-4">
                <li>1. Click the lock icon in your browser's address bar</li>
                <li>2. Set notifications to "Allow"</li>
                <li>3. Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for using push notifications
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<string>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    const supported = 'Notification' in window && 
                     'serviceWorker' in navigator && 
                     'PushManager' in window
    setIsSupported(supported)
    
    if (supported) {
      setPermission(Notification.permission)
      getSubscription()
    }
  }, [])

  const getSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Error getting subscription:', error)
    }
  }

  const requestPermission = async () => {
    if (!isSupported) return false

    const permission = await Notification.requestPermission()
    setPermission(permission)
    return permission === 'granted'
  }

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const vapidResponse = await fetch('/api/push/vapid-key')
      const { publicKey } = await vapidResponse.json()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      })

      setSubscription(subscription)
      return subscription
    } catch (error) {
      console.error('Error subscribing:', error)
      return null
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return

    try {
      await subscription.unsubscribe()
      setSubscription(null)
    } catch (error) {
      console.error('Error unsubscribing:', error)
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe
  }
}

export default PushNotificationManager