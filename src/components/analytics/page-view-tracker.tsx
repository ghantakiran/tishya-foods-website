'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAnalytics } from './analytics-provider'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Only access analytics in client-side
  const analytics = typeof window !== 'undefined' ? useAnalytics() : null

  useEffect(() => {
    if (!analytics) return
    
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