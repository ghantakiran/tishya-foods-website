'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAnalytics } from './analytics-provider'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // Track page view with additional metadata
    trackPageView('page_view', {
      page_path: pathname,
      search_params: searchParams.toString(),
      referrer: document.referrer,
      load_time: performance.now()
    })
  }, [pathname, searchParams, trackPageView])

  return null
}