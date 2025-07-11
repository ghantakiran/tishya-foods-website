'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading component for dynamic imports
const Loading = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
)

// Dynamic imports for heavy components that are not critical for initial page load
export const DynamicNutritionAssistant = dynamic(
  () => import('@/components/ai/nutrition-assistant'),
  {
    loading: () => <Loading />,
    ssr: false, // Client-side only
  }
)

export const DynamicPWAUpdateNotification = dynamic(
  () => import('@/components/pwa/pwa-update-notification').then(mod => ({ default: mod.PWAUpdateNotification })),
  {
    loading: () => null, // Silent loading for notifications
    ssr: false,
  }
)

export const DynamicOfflineIndicator = dynamic(
  () => import('@/components/pwa/offline-indicator').then(mod => ({ default: mod.OfflineIndicator })),
  {
    loading: () => null,
    ssr: false,
  }
)

export const DynamicAccessibilityChecker = dynamic(
  () => import('@/components/accessibility/accessibility-checker').then(mod => ({ default: mod.AccessibilityChecker })),
  {
    loading: () => null,
    ssr: false,
  }
)

export const DynamicBundleAnalyzer = dynamic(
  () => import('@/components/performance/bundle-analyzer').then(mod => ({ default: mod.BundleAnalyzer })),
  {
    loading: () => null,
    ssr: false,
  }
)

export const DynamicPerformanceMonitor = dynamic(
  () => import('@/components/performance/performance-monitor').then(mod => ({ default: mod.PerformanceMonitor })),
  {
    loading: () => null,
    ssr: false,
  }
)

export const DynamicCookieConsentBanner = dynamic(
  () => import('@/components/gdpr/cookie-consent-banner'),
  {
    loading: () => null,
    ssr: false,
  }
)

export const DynamicEnhancedAnalyticsTracker = dynamic(
  () => import('@/components/analytics/enhanced-analytics-tracker').then(mod => ({ default: mod.EnhancedAnalyticsTracker })),
  {
    loading: () => null,
    ssr: false,
  }
)

export const DynamicEcommerceAnalyticsTracker = dynamic(
  () => import('@/components/analytics/ecommerce-analytics-tracker').then(mod => ({ default: mod.EcommerceAnalyticsTracker })),
  {
    loading: () => null,
    ssr: false,
  }
)

// Wrapper for performance optimizer with reduced bundle impact
export const DynamicPerformanceOptimizer = dynamic(
  () => import('@/components/performance/performance-optimizer').then(mod => ({ default: mod.PerformanceOptimizer })),
  {
    loading: () => null,
    ssr: false,
  }
)