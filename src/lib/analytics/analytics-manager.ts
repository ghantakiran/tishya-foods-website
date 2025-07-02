import { isClient } from '@/lib/utils'

// Analytics Event Types
export interface AnalyticsEvent {
  event: string
  category: 'page_view' | 'user_action' | 'ecommerce' | 'engagement' | 'error'
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp?: number
}

export interface PageViewEvent extends AnalyticsEvent {
  category: 'page_view'
  properties: {
    page_title: string
    page_url: string
    referrer?: string
    user_agent?: string
    viewport_size?: { width: number; height: number }
    load_time?: number
  }
}

export interface EcommerceEvent extends AnalyticsEvent {
  category: 'ecommerce'
  properties: {
    transaction_id?: string
    currency?: string
    value?: number
    items?: Array<{
      item_id: string
      item_name: string
      category: string
      quantity: number
      price: number
    }>
  }
}

export interface UserActionEvent extends AnalyticsEvent {
  category: 'user_action'
  properties: {
    action_type: 'click' | 'scroll' | 'form_submit' | 'search' | 'filter' | 'share'
    element_id?: string
    element_text?: string
    element_type?: string
    page_section?: string
    additional_data?: Record<string, any>
  }
}

export interface EngagementEvent extends AnalyticsEvent {
  category: 'engagement'
  properties: {
    engagement_type: 'time_on_page' | 'scroll_depth' | 'video_play' | 'download' | 'newsletter_signup'
    value?: number
    duration?: number
    percentage?: number
  }
}

export interface ErrorEvent extends AnalyticsEvent {
  category: 'error'
  properties: {
    error_type: 'javascript' | 'network' | 'validation' | 'payment' | 'api'
    error_message: string
    error_stack?: string
    page_url: string
    user_action?: string
  }
}

// Analytics Provider Interface
export interface AnalyticsProvider {
  name: string
  initialize: (config: any) => Promise<void>
  trackEvent: (event: AnalyticsEvent) => Promise<void>
  trackPageView: (event: PageViewEvent) => Promise<void>
  trackEcommerce: (event: EcommerceEvent) => Promise<void>
  setUserId: (userId: string) => void
  setUserProperties: (properties: Record<string, any>) => void
}

// Google Analytics Provider
export class GoogleAnalyticsProvider implements AnalyticsProvider {
  name = 'google_analytics'
  private measurementId: string
  private initialized = false

  constructor(measurementId: string) {
    this.measurementId = measurementId
  }

  async initialize(config: any = {}): Promise<void> {
    if (!isClient() || this.initialized) return

    try {
      // Load Google Analytics script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`
      document.head.appendChild(script)

      // Initialize gtag
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments)
      }
      
      gtag('js', new Date())
      gtag('config', this.measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...config
      })

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error)
    }
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !isClient()) return

    try {
      gtag('event', event.event, {
        event_category: event.category,
        ...event.properties,
        custom_parameter_userId: event.userId,
        custom_parameter_sessionId: event.sessionId
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  async trackPageView(event: PageViewEvent): Promise<void> {
    if (!this.initialized || !isClient()) return

    try {
      gtag('config', this.measurementId, {
        page_title: event.properties.page_title,
        page_location: event.properties.page_url,
        custom_map: {
          custom_parameter_load_time: event.properties.load_time
        }
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  async trackEcommerce(event: EcommerceEvent): Promise<void> {
    if (!this.initialized || !isClient()) return

    try {
      gtag('event', event.event, {
        currency: event.properties.currency || 'INR',
        value: event.properties.value,
        transaction_id: event.properties.transaction_id,
        items: event.properties.items
      })
    } catch (error) {
      console.error('Failed to track ecommerce event:', error)
    }
  }

  setUserId(userId: string): void {
    if (!this.initialized || !isClient()) return
    gtag('config', this.measurementId, { user_id: userId })
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized || !isClient()) return
    gtag('set', { user_properties: properties })
  }
}

// Custom Analytics Provider (for internal tracking)
export class CustomAnalyticsProvider implements AnalyticsProvider {
  name = 'custom_analytics'
  private apiEndpoint: string
  private batchSize = 10
  private batchTimeout = 5000
  private eventQueue: AnalyticsEvent[] = []
  private batchTimer: NodeJS.Timeout | null = null

  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint
  }

  async initialize(config: any = {}): Promise<void> {
    this.batchSize = config.batchSize || 10
    this.batchTimeout = config.batchTimeout || 5000
    
    // Start batch processing
    this.processBatch()
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const enrichedEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      properties: {
        ...event.properties,
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer: document.referrer
      }
    }

    this.eventQueue.push(enrichedEvent)

    if (this.eventQueue.length >= this.batchSize) {
      await this.sendBatch()
    }
  }

  async trackPageView(event: PageViewEvent): Promise<void> {
    await this.trackEvent(event)
  }

  async trackEcommerce(event: EcommerceEvent): Promise<void> {
    await this.trackEvent(event)
  }

  setUserId(userId: string): void {
    // Store in session for future events
    if (isClient()) {
      sessionStorage.setItem('analytics_user_id', userId)
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (isClient()) {
      sessionStorage.setItem('analytics_user_properties', JSON.stringify(properties))
    }
  }

  private async sendBatch(): Promise<void> {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events })
      })
    } catch (error) {
      console.error('Failed to send analytics batch:', error)
      // Re-queue events on failure
      this.eventQueue.unshift(...events)
    }
  }

  private processBatch(): void {
    this.batchTimer = setInterval(async () => {
      if (this.eventQueue.length > 0) {
        await this.sendBatch()
      }
    }, this.batchTimeout)
  }

  private getSessionId(): string {
    if (!isClient()) return 'server'
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }
}

// Main Analytics Manager
export class AnalyticsManager {
  private static instance: AnalyticsManager
  private providers: AnalyticsProvider[] = []
  private isInitialized = false
  private userId: string | null = null

  private constructor() {}

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  async initialize(config: {
    googleAnalytics?: { measurementId: string; config?: any }
    customAnalytics?: { apiEndpoint: string; config?: any }
    enableConsoleLogging?: boolean
  }): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize Google Analytics
      if (config.googleAnalytics) {
        const gaProvider = new GoogleAnalyticsProvider(config.googleAnalytics.measurementId)
        await gaProvider.initialize(config.googleAnalytics.config)
        this.providers.push(gaProvider)
      }

      // Initialize Custom Analytics
      if (config.customAnalytics) {
        const customProvider = new CustomAnalyticsProvider(config.customAnalytics.apiEndpoint)
        await customProvider.initialize(config.customAnalytics.config)
        this.providers.push(customProvider)
      }

      this.isInitialized = true

      // Track initialization
      if (config.enableConsoleLogging) {
        console.log('Analytics initialized with providers:', this.providers.map(p => p.name))
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  async trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'userId' | 'sessionId'>): Promise<void> {
    if (!this.isInitialized) return

    const enrichedEvent: AnalyticsEvent = {
      ...event,
      userId: this.userId || undefined,
      timestamp: Date.now()
    }

    await Promise.all(
      this.providers.map(provider => 
        provider.trackEvent(enrichedEvent).catch(error => 
          console.error(`Failed to track event with ${provider.name}:`, error)
        )
      )
    )
  }

  async trackPageView(pageName: string, additionalProperties: Record<string, any> = {}): Promise<void> {
    if (!isClient()) return

    const event: PageViewEvent = {
      event: 'page_view',
      category: 'page_view',
      properties: {
        page_title: document.title,
        page_url: window.location.href,
        referrer: document.referrer,
        viewport_size: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        ...additionalProperties
      }
    }

    await this.trackEvent(event)
  }

  async trackEcommerce(eventType: string, data: Omit<EcommerceEvent['properties'], 'currency'>): Promise<void> {
    const event: EcommerceEvent = {
      event: eventType,
      category: 'ecommerce',
      properties: {
        currency: 'INR',
        ...data
      }
    }

    await this.trackEvent(event)
  }

  async trackUserAction(actionType: UserActionEvent['properties']['action_type'], data: Partial<UserActionEvent['properties']> = {}): Promise<void> {
    const event: UserActionEvent = {
      event: 'user_action',
      category: 'user_action',
      properties: {
        action_type: actionType,
        ...data
      }
    }

    await this.trackEvent(event)
  }

  async trackEngagement(engagementType: EngagementEvent['properties']['engagement_type'], data: Partial<EngagementEvent['properties']> = {}): Promise<void> {
    const event: EngagementEvent = {
      event: 'engagement',
      category: 'engagement',
      properties: {
        engagement_type: engagementType,
        ...data
      }
    }

    await this.trackEvent(event)
  }

  async trackError(errorType: ErrorEvent['properties']['error_type'], errorMessage: string, additionalData: Partial<ErrorEvent['properties']> = {}): Promise<void> {
    const event: ErrorEvent = {
      event: 'error',
      category: 'error',
      properties: {
        error_type: errorType,
        error_message: errorMessage,
        page_url: isClient() ? window.location.href : 'server',
        ...additionalData
      }
    }

    await this.trackEvent(event)
  }

  setUserId(userId: string): void {
    this.userId = userId
    this.providers.forEach(provider => provider.setUserId(userId))
  }

  setUserProperties(properties: Record<string, any>): void {
    this.providers.forEach(provider => provider.setUserProperties(properties))
  }

  // Convenience methods for common ecommerce events
  async trackPurchase(transactionId: string, value: number, items: EcommerceEvent['properties']['items']): Promise<void> {
    await this.trackEcommerce('purchase', {
      transaction_id: transactionId,
      value,
      items
    })
  }

  async trackAddToCart(item: NonNullable<EcommerceEvent['properties']['items']>[0]): Promise<void> {
    await this.trackEcommerce('add_to_cart', {
      value: item.price * item.quantity,
      items: [item]
    })
  }

  async trackRemoveFromCart(item: NonNullable<EcommerceEvent['properties']['items']>[0]): Promise<void> {
    await this.trackEcommerce('remove_from_cart', {
      value: item.price * item.quantity,
      items: [item]
    })
  }

  async trackViewItem(item: NonNullable<EcommerceEvent['properties']['items']>[0]): Promise<void> {
    await this.trackEcommerce('view_item', {
      value: item.price,
      items: [item]
    })
  }

  async trackBeginCheckout(value: number, items: EcommerceEvent['properties']['items']): Promise<void> {
    await this.trackEcommerce('begin_checkout', {
      value,
      items
    })
  }

  async trackSearch(searchTerm: string, resultsCount?: number): Promise<void> {
    await this.trackUserAction('search', {
      additional_data: {
        search_term: searchTerm,
        results_count: resultsCount
      }
    })
  }
}

// Global analytics instance
export const analytics = AnalyticsManager.getInstance()

// Declare global gtag function
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}