'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: CookiePreferences) => void
}

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  })

  // Check if user has already made a choice
  useEffect(() => {
    const savedPreferences = localStorage.getItem('tishya-cookie-preferences')
    if (!savedPreferences) {
      setShowBanner(true)
    } else {
      const parsed = JSON.parse(savedPreferences)
      setPreferences(parsed)
      onConsentChange?.(parsed)
    }
  }, [onConsentChange])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('tishya-cookie-preferences', JSON.stringify(prefs))
    localStorage.setItem('tishya-cookie-consent-date', new Date().toISOString())
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)
    onConsentChange?.(prefs)
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    savePreferences(necessaryOnly)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: key === 'necessary' ? true : value // Necessary cookies always true
    }))
  }

  const cookieCategories = [
    {
      key: 'necessary' as const,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      required: true,
      examples: ['Session management', 'Security tokens', 'Shopping cart']
    },
    {
      key: 'analytics' as const,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website to improve user experience.',
      required: false,
      examples: ['Google Analytics', 'Page views', 'User behavior']
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and marketing content.',
      required: false,
      examples: ['Ad targeting', 'Social media', 'Email campaigns']
    },
    {
      key: 'functional' as const,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality like chat widgets and social media integration.',
      required: false,
      examples: ['Chat support', 'Social sharing', 'User preferences']
    }
  ]

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="h-6 w-6 text-orange-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Cookie Preferences
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    GDPR Compliant
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">
                  We use cookies to enhance your experience, analyze site usage, and personalize content. 
                  You can manage your preferences or learn more in our{' '}
                  <a href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                    Privacy Policy
                  </a>.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={acceptAll}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept All
                  </Button>
                  
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Necessary Only
                  </Button>
                  
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={() => setShowBanner(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        <CardTitle className="text-gray-100">
                          Cookie Settings
                        </CardTitle>
                      </div>
                      <Button
                        onClick={() => setShowSettings(false)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-gray-400">
                      Manage your cookie preferences. You can change these settings at any time.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {cookieCategories.map((category) => (
                      <div key={category.key} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-100">
                                {category.title}
                              </h4>
                              {category.required && (
                                <Badge variant="outline" className="text-xs border-orange-500 text-orange-400">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                              {category.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {category.examples.map((example, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                                >
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Switch
                            checked={preferences[category.key]}
                            onCheckedChange={(checked) => updatePreference(category.key, checked)}
                            disabled={category.required}
                          />
                        </div>
                        
                        {category.key !== 'functional' && (
                          <div className="border-b border-gray-700" />
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => savePreferences(preferences)}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        onClick={acceptAll}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Accept All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for accessing cookie preferences
export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    const savedPreferences = localStorage.getItem('tishya-cookie-preferences')
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const updatePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('tishya-cookie-preferences', JSON.stringify(newPreferences))
    setPreferences(newPreferences)
  }

  return { preferences, updatePreferences }
}

// Cookie consent status hook
export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState(false)
  const [consentDate, setConsentDate] = useState<string | null>(null)

  useEffect(() => {
    const savedPreferences = localStorage.getItem('tishya-cookie-preferences')
    const savedDate = localStorage.getItem('tishya-cookie-consent-date')
    
    setHasConsented(!!savedPreferences)
    setConsentDate(savedDate)
  }, [])

  const clearConsent = () => {
    localStorage.removeItem('tishya-cookie-preferences')
    localStorage.removeItem('tishya-cookie-consent-date')
    setHasConsented(false)
    setConsentDate(null)
  }

  return { hasConsented, consentDate, clearConsent }
}