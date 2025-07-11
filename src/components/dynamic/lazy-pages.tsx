'use client'

import dynamic from 'next/dynamic'

// Loading component for heavy pages
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
)

// Dynamic imports for heavy page components
export const LazySubscriptionDashboard = dynamic(
  () => import('@/components/subscription/subscription-dashboard'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyProductComparison = dynamic(
  () => import('@/components/product/product-comparison'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyAnalyticsDashboard = dynamic(
  () => import('@/components/analytics/analytics-dashboard'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyNutritionTracker = dynamic(
  () => import('@/components/nutrition/nutrition-tracker'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyLoyaltyDashboard = dynamic(
  () => import('@/components/loyalty/loyalty-dashboard'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyProduct360Viewer = dynamic(
  () => import('@/components/product/product-360-viewer'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyStripePaymentForm = dynamic(
  () => import('@/components/payment/stripe-payment-form'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

// PWA specific components that are not critical for initial load
export const LazyPWAInstallPrompt = dynamic(
  () => import('@/components/pwa/pwa-install-prompt'),
  {
    loading: () => null,
    ssr: false,
  }
)

export const LazyAdvancedSearch = dynamic(
  () => import('@/components/search/advanced-search'),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
)

export const LazyProductFilter = dynamic(
  () => import('@/components/product/product-filters'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-800 rounded-lg h-32 w-full"></div>
    ),
    ssr: true, // SSR for SEO but lazy load heavy parts
  }
)