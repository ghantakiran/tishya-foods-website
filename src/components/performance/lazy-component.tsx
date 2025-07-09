'use client'

import React, { Suspense, lazy } from 'react'
import { PageLoadingSkeleton } from '../loading/loading-skeleton'

interface LazyComponentProps {
  Component: React.LazyExoticComponent<React.ComponentType<unknown>>
  fallback?: React.ReactNode
  [key: string]: unknown
}

export default function LazyComponent({ 
  Component, 
  fallback = <PageLoadingSkeleton />, 
  ...props 
}: LazyComponentProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...(props as Record<string, unknown>)} />
    </Suspense>
  )
}

// Pre-configured lazy components for homepage
export const LazyInstagramFeed = lazy(() => import('../social/instagram-feed'))
export const LazyTestimonials = lazy(() => import('../home/testimonials'))
export const LazyValuesSection = lazy(() => import('../home/values-section'))