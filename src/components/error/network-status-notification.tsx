'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Signal, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNetworkNotification } from '@/hooks/use-network-status'

export function NetworkStatusNotification() {
  const { showNotification, notificationType, dismissNotification, networkStatus } = useNetworkNotification()

  const getNotificationContent = () => {
    switch (notificationType) {
      case 'offline':
        return {
          icon: <WifiOff className="w-5 h-5" />,
          title: 'No Internet Connection',
          message: 'Please check your connection and try again.',
          bgColor: 'bg-red-900/90',
          borderColor: 'border-red-600',
          iconColor: 'text-red-400'
        }
      
      case 'slow':
        return {
          icon: <Signal className="w-5 h-5" />,
          title: 'Slow Connection Detected',
          message: `Your connection might be slower than usual. ${networkStatus.effectiveType ? `(${networkStatus.effectiveType.toUpperCase()})` : ''}`,
          bgColor: 'bg-yellow-900/90',
          borderColor: 'border-yellow-600',
          iconColor: 'text-yellow-400'
        }
      
      case 'back-online':
        return {
          icon: <Wifi className="w-5 h-5" />,
          title: 'Back Online',
          message: 'Your internet connection has been restored.',
          bgColor: 'bg-green-900/90',
          borderColor: 'border-green-600',
          iconColor: 'text-green-400'
        }
      
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Connection Issue',
          message: 'There seems to be a problem with your connection.',
          bgColor: 'bg-gray-900/90',
          borderColor: 'border-gray-600',
          iconColor: 'text-gray-400'
        }
    }
  }

  const content = getNotificationContent()

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] max-w-md w-full mx-4"
        >
          <div className={`${content.bgColor} ${content.borderColor} border backdrop-blur-xl rounded-lg p-4 shadow-xl`}>
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${content.iconColor} mt-0.5`}>
                {content.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-100">
                  {content.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  {content.message}
                </p>
                
                {/* Network details for development */}
                {process.env.NODE_ENV === 'development' && networkStatus.rtt && (
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    RTT: {networkStatus.rtt}ms | Downlink: {networkStatus.downlink?.toFixed(1)} Mbps
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={dismissNotification}
                className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {notificationType === 'offline' && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Some features may not work properly</span>
                </div>
              </div>
            )}

            {notificationType === 'slow' && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span>Loading may take longer than usual</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Compact version for mobile
export function MobileNetworkIndicator() {
  const { networkStatus } = useNetworkNotification()

  if (networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className={`p-2 rounded-full shadow-lg backdrop-blur-sm ${
        !networkStatus.isOnline 
          ? 'bg-red-900/90 border border-red-600' 
          : 'bg-yellow-900/90 border border-yellow-600'
      }`}>
        {!networkStatus.isOnline ? (
          <WifiOff className="w-4 h-4 text-red-400" />
        ) : (
          <Signal className="w-4 h-4 text-yellow-400" />
        )}
      </div>
    </motion.div>
  )
}