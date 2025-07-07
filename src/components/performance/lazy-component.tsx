'use client'

import React, { Suspense, lazy } from 'react'
import { PageLoadingSkeleton } from '../loading/loading-skeleton'

interface LazyComponentProps {
  Component: React.LazyExoticComponent<React.ComponentType<any>>
  fallback?: React.ReactNode
  [key: string]: any
}

export default function LazyComponent({ 
  Component, 
  fallback = <PageLoadingSkeleton />, 
  ...props 
}: LazyComponentProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  )
}

// Pre-configured lazy components for homepage
export const LazyInstagramFeed = lazy(() => 
  import('../social/instagram-feed').then(module => ({
    default: module.default
  }))
)

export const LazyTestimonials = lazy(() => 
  import('../home/testimonials').then(module => ({
    default: module.default
  }))
)

export const LazyValuesSection = lazy(() => 
  import('../home/values-section').then(module => ({
    default: module.default
  }))
)

// Blog and content components
export const LazyBlogList = lazy(() => 
  import('../blog/blog-list').then(module => ({
    default: module.BlogList
  }))
)

export const LazyBlogComments = lazy(() => 
  import('../blog/blog-comments').then(module => ({
    default: module.BlogComments
  }))
)

// Product components
export const LazyProductComparison = lazy(() => 
  import('../product/product-comparison').then(module => ({
    default: module.ProductComparison
  }))
)

export const LazyProduct360Viewer = lazy(() => 
  import('../product/product-360-viewer').then(module => ({
    default: module.Product360Viewer
  }))
)

// Analytics and admin components
export const LazyAnalyticsDashboard = lazy(() => 
  import('../analytics/analytics-dashboard').then(module => ({
    default: module.AnalyticsDashboard
  }))
)

export const LazyRealTimeMonitor = lazy(() => 
  import('../analytics/real-time-monitor').then(module => ({
    default: module.RealTimeMonitor
  }))
)

// Utility function for dynamic imports with error boundaries
export function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComp = lazy(importFn)
  
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <PageLoadingSkeleton />}>
        <LazyComp {...props} />
      </Suspense>
    )
  }
}