'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { usePWAUpdate } from './pwa-init'

export function PWAUpdateNotification() {
  const { updateAvailable, updateApp } = usePWAUpdate()
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (updateAvailable) {
      setShowNotification(true)
    }
  }, [updateAvailable])

  if (!showNotification || !updateAvailable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg border border-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4 h-4" />
              <span className="font-semibold text-sm">Update Available</span>
            </div>
            <p className="text-xs text-blue-100">
              A new version of Tishya Foods is ready! Update now for the latest features and improvements.
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-blue-200 hover:text-white p-1"
            aria-label="Dismiss update notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowNotification(false)}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
          >
            Later
          </button>
          <button
            onClick={updateApp}
            className="flex-1 bg-white text-blue-600 px-3 py-2 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  )
}