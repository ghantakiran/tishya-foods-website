'use client'

import { useCallback } from 'react'
import { useAnalytics as useAnalyticsContext } from '@/components/analytics/analytics-provider'
import type { CheckoutItem, SearchFilters } from '@/types/analytics'

export function useAnalytics() {
  const analytics = useAnalyticsContext()

  // Track button clicks with standardized data
  const trackButtonClick = useCallback((buttonId: string, buttonText: string, section?: string) => {
    analytics.trackUserAction('click', {
      element_id: buttonId,
      element_text: buttonText,
      element_type: 'button',
      page_section: section
    })
  }, [analytics])

  // Track form submissions
  const trackFormSubmit = useCallback((formId: string, formType: string, success: boolean) => {
    analytics.trackUserAction('form_submit', {
      element_id: formId,
      element_type: 'form',
      additional_data: {
        form_type: formType,
        success
      }
    })
  }, [analytics])

  // Track product interactions
  const trackProductView = useCallback((productId: string, productName: string, category: string, price: number) => {
    analytics.trackViewItem({
      item_id: productId,
      item_name: productName,
      category,
      quantity: 1,
      price
    })
  }, [analytics])

  const trackProductAddToCart = useCallback((productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
    analytics.trackAddToCart({
      item_id: productId,
      item_name: productName,
      category,
      quantity,
      price
    })
  }, [analytics])

  const trackProductRemoveFromCart = useCallback((productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
    analytics.trackRemoveFromCart({
      item_id: productId,
      item_name: productName,
      category,
      quantity,
      price
    })
  }, [analytics])

  // Track search behavior
  const trackSearchQuery = useCallback((query: string, resultsCount?: number, filters?: SearchFilters) => {
    analytics.trackSearch(query, resultsCount)
    
    if (filters && Object.keys(filters).length > 0) {
      analytics.trackUserAction('filter', {
        additional_data: {
          search_query: query,
          applied_filters: filters
        }
      })
    }
  }, [analytics])

  // Track user engagement
  const trackScrollDepth = useCallback((percentage: number) => {
    analytics.trackEngagement('scroll_depth', {
      percentage,
      value: percentage
    })
  }, [analytics])

  const trackTimeOnPage = useCallback((duration: number) => {
    analytics.trackEngagement('time_on_page', {
      duration,
      value: duration
    })
  }, [analytics])

  const trackVideoPlay = useCallback((videoId: string, videoTitle: string, duration?: number) => {
    analytics.trackEngagement('video_play', {
      value: 1,
      duration
    })
    
    analytics.trackUserAction('click', {
      element_id: videoId,
      element_text: videoTitle,
      element_type: 'video',
      additional_data: {
        action: 'play'
      }
    })
  }, [analytics])

  const trackDownload = useCallback((fileId: string, fileName: string, fileType: string) => {
    analytics.trackEngagement('download', {
      value: 1
    })
    
    analytics.trackUserAction('click', {
      element_id: fileId,
      element_text: fileName,
      element_type: 'download',
      additional_data: {
        file_type: fileType,
        file_name: fileName
      }
    })
  }, [analytics])

  const trackNewsletterSignup = useCallback((email: string, source?: string) => {
    analytics.trackEngagement('newsletter_signup', {
      value: 1
    })
    
    analytics.trackUserAction('form_submit', {
      element_type: 'newsletter_form',
      additional_data: {
        source,
        email_provided: !!email
      }
    })
  }, [analytics])

  // Track checkout flow
  const trackCheckoutStep = useCallback((step: number, stepName: string, items: CheckoutItem[]) => {
    analytics.trackEcommerce('checkout_progress', {
      value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      items,
      transaction_id: undefined
    })
    
    analytics.trackUserAction('click', {
      element_type: 'checkout_step',
      additional_data: {
        step_number: step,
        step_name: stepName,
        items_count: items.length
      }
    })
  }, [analytics])

  const trackCheckoutBegin = useCallback((items: CheckoutItem[], value: number) => {
    analytics.trackBeginCheckout(value, items)
  }, [analytics])

  const trackPurchaseComplete = useCallback((transactionId: string, value: number, items: CheckoutItem[], paymentMethod: string) => {
    analytics.trackPurchase(transactionId, value, items)
    
    analytics.trackUserAction('form_submit', {
      element_type: 'checkout_form',
      additional_data: {
        transaction_id: transactionId,
        payment_method: paymentMethod,
        items_count: items.length
      }
    })
  }, [analytics])

  // Track errors
  const trackFormError = useCallback((formId: string, errorMessage: string, fieldName?: string) => {
    analytics.trackError('validation', errorMessage, {
      user_action: `form_error_${formId}`,
      error_stack: fieldName ? `Field: ${fieldName}` : undefined
    })
  }, [analytics])

  const trackAPIError = useCallback((endpoint: string, errorMessage: string, statusCode?: number) => {
    analytics.trackError('api', errorMessage, {
      user_action: `api_call_${endpoint}`,
      error_stack: statusCode ? `Status: ${statusCode}` : undefined
    })
  }, [analytics])

  const trackPaymentError = useCallback((errorMessage: string, paymentMethod: string, transactionId?: string) => {
    analytics.trackError('payment', errorMessage, {
      user_action: 'payment_processing',
      error_stack: `Payment method: ${paymentMethod}${transactionId ? `, Transaction: ${transactionId}` : ''}`
    })
  }, [analytics])

  // User identification
  const identifyUser = useCallback((userId: string, properties?: Record<string, unknown>) => {
    analytics.setUserId(userId)
    
    if (properties) {
      analytics.setUserProperties(properties)
    }
    
    analytics.trackUserAction('click', {
      element_type: 'user_identification',
      additional_data: {
        user_id: userId,
        properties_set: !!properties
      }
    })
  }, [analytics])

  return {
    // Core analytics functions
    ...analytics,
    
    // Convenience functions
    trackButtonClick,
    trackFormSubmit,
    trackProductView,
    trackProductAddToCart,
    trackProductRemoveFromCart,
    trackSearchQuery,
    trackScrollDepth,
    trackTimeOnPage,
    trackVideoPlay,
    trackDownload,
    trackNewsletterSignup,
    trackCheckoutStep,
    trackCheckoutBegin,
    trackPurchaseComplete,
    trackFormError,
    trackAPIError,
    trackPaymentError,
    identifyUser
  }
}