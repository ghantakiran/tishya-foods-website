'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAnalytics } from './analytics-provider'

function PageViewTrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const analytics = useAnalytics()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // Track page view with additional metadata
    analytics.trackPageView('page_view', {
      page_path: pathname,
      search_params: searchParams.toString(),
      referrer: document.referrer,
      load_time: performance.now()
    })
  }, [pathname, searchParams, analytics])

  return null
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  )
}