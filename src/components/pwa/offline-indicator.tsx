'use client'

import { WifiOff, Wifi } from 'lucide-react'
import { useOfflineStatus } from './pwa-init'

export function OfflineIndicator() {
  const isOffline = useOfflineStatus()

  if (!isOffline) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
        <WifiOff className="w-4 h-4" />
        <span>You&apos;re offline</span>
      </div>
    </div>
  )
}

export function ConnectionStatus() {
  const isOffline = useOfflineStatus()

  return (
    <div className="flex items-center gap-2">
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-sm">Offline</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Online</span>
        </>
      )}
    </div>
  )
}