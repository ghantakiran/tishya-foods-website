'use client'

import { useState, useEffect, useCallback } from 'react'

interface NetworkStatus {
  isOnline: boolean
  isSlowConnection: boolean
  effectiveType: string | null
  rtt: number | null
  downlink: number | null
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    effectiveType: null,
    rtt: null,
    downlink: null
  })

  const updateNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine
    let isSlowConnection = false
    let effectiveType = null
    let rtt = null
    let downlink = null

    // Check for Network Information API support
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      effectiveType = connection.effectiveType
      rtt = connection.rtt
      downlink = connection.downlink

      // Consider connection slow if effective type is 2g or 3g, or if RTT > 1000ms
      isSlowConnection = 
        effectiveType === '2g' || 
        effectiveType === 'slow-2g' ||
        (effectiveType === '3g' && rtt > 1000) ||
        rtt > 1500 ||
        downlink < 0.5
    }

    setNetworkStatus({
      isOnline,
      isSlowConnection,
      effectiveType,
      rtt,
      downlink
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial check
    updateNetworkStatus()

    // Event listeners for online/offline status
    const handleOnline = () => updateNetworkStatus()
    const handleOffline = () => updateNetworkStatus()

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for connection changes if supported
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', updateNetworkStatus)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [updateNetworkStatus])

  return networkStatus
}

// Hook for showing network status notifications
export function useNetworkNotification() {
  const networkStatus = useNetworkStatus()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState<'offline' | 'slow' | 'back-online'>('offline')

  useEffect(() => {
    if (!networkStatus.isOnline) {
      setNotificationType('offline')
      setShowNotification(true)
    } else if (networkStatus.isSlowConnection) {
      setNotificationType('slow')
      setShowNotification(true)
    } else if (showNotification && notificationType === 'offline') {
      // Show "back online" notification briefly
      setNotificationType('back-online')
      setTimeout(() => setShowNotification(false), 3000)
    } else {
      setShowNotification(false)
    }
  }, [networkStatus.isOnline, networkStatus.isSlowConnection, showNotification, notificationType])

  const dismissNotification = useCallback(() => {
    setShowNotification(false)
  }, [])

  return {
    showNotification,
    notificationType,
    dismissNotification,
    networkStatus
  }
}