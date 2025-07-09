/**
 * Analytics database interface for real-time data processing
 * This provides a foundation for integrating with various database systems
 */

export interface AnalyticsEvent {
  id: string
  event: string
  category: string
  properties: Record<string, any>
  userId?: string
  sessionId: string
  timestamp: number
  ip?: string
  userAgent?: string
  url: string
  referrer?: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  country?: string
  city?: string
}

export interface PageView {
  id: string
  path: string
  title: string
  userId?: string
  sessionId: string
  timestamp: number
  loadTime?: number
  referrer?: string
  exitPage?: boolean
  bounceRate?: number
}

export interface EcommerceEvent {
  id: string
  eventType: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase'
  userId?: string
  sessionId: string
  timestamp: number
  productId: string
  productName: string
  category: string
  price: number
  quantity: number
  currency: string
  orderId?: string
  revenue?: number
}

export interface UserSession {
  id: string
  userId?: string
  sessionId: string
  startTime: number
  endTime?: number
  pageViews: number
  events: number
  deviceType: 'desktop' | 'mobile' | 'tablet'
  country?: string
  city?: string
  referrer?: string
  userAgent: string
  isReturning: boolean
}

// In-memory storage for demonstration (use a real database in production)
class AnalyticsDatabase {
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []
  private ecommerceEvents: EcommerceEvent[] = []
  private sessions: UserSession[] = []

  // Event storage
  async saveEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event)
    // In production, this would be saved to a database
    console.log('Event saved:', event)
  }

  async getEvents(filters: {
    startTime?: number
    endTime?: number
    category?: string
    userId?: string
    sessionId?: string
    limit?: number
  }): Promise<AnalyticsEvent[]> {
    let filteredEvents = this.events

    if (filters.startTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filters.endTime!)
    }

    if (filters.category) {
      filteredEvents = filteredEvents.filter(e => e.category === filters.category)
    }

    if (filters.userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === filters.userId)
    }

    if (filters.sessionId) {
      filteredEvents = filteredEvents.filter(e => e.sessionId === filters.sessionId)
    }

    if (filters.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit)
    }

    return filteredEvents.sort((a, b) => b.timestamp - a.timestamp)
  }

  // Page view storage
  async savePageView(pageView: PageView): Promise<void> {
    this.pageViews.push(pageView)
    console.log('Page view saved:', pageView)
  }

  async getPageViews(filters: {
    startTime?: number
    endTime?: number
    path?: string
    userId?: string
    sessionId?: string
    limit?: number
  }): Promise<PageView[]> {
    let filteredViews = this.pageViews

    if (filters.startTime) {
      filteredViews = filteredViews.filter(pv => pv.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredViews = filteredViews.filter(pv => pv.timestamp <= filters.endTime!)
    }

    if (filters.path) {
      filteredViews = filteredViews.filter(pv => pv.path === filters.path)
    }

    if (filters.userId) {
      filteredViews = filteredViews.filter(pv => pv.userId === filters.userId)
    }

    if (filters.sessionId) {
      filteredViews = filteredViews.filter(pv => pv.sessionId === filters.sessionId)
    }

    if (filters.limit) {
      filteredViews = filteredViews.slice(0, filters.limit)
    }

    return filteredViews.sort((a, b) => b.timestamp - a.timestamp)
  }

  // E-commerce event storage
  async saveEcommerceEvent(event: EcommerceEvent): Promise<void> {
    this.ecommerceEvents.push(event)
    console.log('E-commerce event saved:', event)
  }

  async getEcommerceEvents(filters: {
    startTime?: number
    endTime?: number
    eventType?: string
    productId?: string
    userId?: string
    sessionId?: string
    limit?: number
  }): Promise<EcommerceEvent[]> {
    let filteredEvents = this.ecommerceEvents

    if (filters.startTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filters.endTime!)
    }

    if (filters.eventType) {
      filteredEvents = filteredEvents.filter(e => e.eventType === filters.eventType)
    }

    if (filters.productId) {
      filteredEvents = filteredEvents.filter(e => e.productId === filters.productId)
    }

    if (filters.userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === filters.userId)
    }

    if (filters.sessionId) {
      filteredEvents = filteredEvents.filter(e => e.sessionId === filters.sessionId)
    }

    if (filters.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit)
    }

    return filteredEvents.sort((a, b) => b.timestamp - a.timestamp)
  }

  // Session storage
  async saveSession(session: UserSession): Promise<void> {
    const existingIndex = this.sessions.findIndex(s => s.sessionId === session.sessionId)
    if (existingIndex >= 0) {
      this.sessions[existingIndex] = session
    } else {
      this.sessions.push(session)
    }
    console.log('Session saved:', session)
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    return this.sessions.find(s => s.sessionId === sessionId) || null
  }

  async getSessions(filters: {
    startTime?: number
    endTime?: number
    userId?: string
    isReturning?: boolean
    limit?: number
  }): Promise<UserSession[]> {
    let filteredSessions = this.sessions

    if (filters.startTime) {
      filteredSessions = filteredSessions.filter(s => s.startTime >= filters.startTime!)
    }

    if (filters.endTime) {
      filteredSessions = filteredSessions.filter(s => s.startTime <= filters.endTime!)
    }

    if (filters.userId) {
      filteredSessions = filteredSessions.filter(s => s.userId === filters.userId)
    }

    if (filters.isReturning !== undefined) {
      filteredSessions = filteredSessions.filter(s => s.isReturning === filters.isReturning)
    }

    if (filters.limit) {
      filteredSessions = filteredSessions.slice(0, filters.limit)
    }

    return filteredSessions.sort((a, b) => b.startTime - a.startTime)
  }

  // Analytics aggregation methods
  async getPageViewStats(startTime?: number, endTime?: number): Promise<{
    total: number
    today: number
    growth: number
    topPages: Array<{ path: string; views: number; bounceRate: number }>
  }> {
    const now = Date.now()
    const todayStart = new Date(now).setHours(0, 0, 0, 0)
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000

    const allViews = await this.getPageViews({ startTime, endTime })
    const todayViews = await this.getPageViews({ startTime: todayStart, endTime: now })
    const yesterdayViews = await this.getPageViews({ startTime: yesterdayStart, endTime: todayStart })

    const growth = yesterdayViews.length > 0 
      ? ((todayViews.length - yesterdayViews.length) / yesterdayViews.length) * 100 
      : 0

    // Calculate top pages
    const pageStats = new Map<string, { views: number; bounces: number }>()
    allViews.forEach(view => {
      const current = pageStats.get(view.path) || { views: 0, bounces: 0 }
      current.views++
      if (view.bounceRate && view.bounceRate > 0) {
        current.bounces++
      }
      pageStats.set(view.path, current)
    })

    const topPages = Array.from(pageStats.entries())
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        bounceRate: stats.views > 0 ? (stats.bounces / stats.views) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return {
      total: allViews.length,
      today: todayViews.length,
      growth,
      topPages
    }
  }

  async getUserStats(startTime?: number, endTime?: number): Promise<{
    total: number
    active: number
    new: number
    returning: number
    realTimeUsers: number
  }> {
    const sessions = await this.getSessions({ startTime, endTime })
    const uniqueUsers = new Set(sessions.map(s => s.userId).filter(Boolean))
    const newUsers = sessions.filter(s => !s.isReturning).length
    const returningUsers = sessions.filter(s => s.isReturning).length
    
    // Real-time users (sessions in last 30 minutes)
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000
    const realtimeSessions = sessions.filter(s => s.startTime >= thirtyMinutesAgo)
    const realTimeUsers = new Set(realtimeSessions.map(s => s.userId).filter(Boolean)).size

    return {
      total: uniqueUsers.size,
      active: realTimeUsers,
      new: newUsers,
      returning: returningUsers,
      realTimeUsers
    }
  }

  async getEcommerceStats(startTime?: number, endTime?: number): Promise<{
    revenue: number
    orders: number
    averageOrderValue: number
    conversionRate: number
    topProducts: Array<{ id: string; name: string; views: number; sales: number }>
  }> {
    const ecommerceEvents = await this.getEcommerceEvents({ startTime, endTime })
    const purchases = ecommerceEvents.filter(e => e.eventType === 'purchase')
    const views = ecommerceEvents.filter(e => e.eventType === 'view_item')
    
    const revenue = purchases.reduce((sum, p) => sum + (p.revenue || 0), 0)
    const orders = new Set(purchases.map(p => p.orderId)).size
    const averageOrderValue = orders > 0 ? revenue / orders : 0
    
    const sessions = await this.getSessions({ startTime, endTime })
    const conversionRate = sessions.length > 0 ? (orders / sessions.length) * 100 : 0

    // Calculate top products
    const productStats = new Map<string, { name: string; views: number; sales: number }>()
    
    views.forEach(view => {
      const current = productStats.get(view.productId) || { name: view.productName, views: 0, sales: 0 }
      current.views++
      productStats.set(view.productId, current)
    })

    purchases.forEach(purchase => {
      const current = productStats.get(purchase.productId) || { name: purchase.productName, views: 0, sales: 0 }
      current.sales += purchase.quantity
      productStats.set(purchase.productId, current)
    })

    const topProducts = Array.from(productStats.entries())
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return {
      revenue,
      orders,
      averageOrderValue,
      conversionRate,
      topProducts
    }
  }

  async getUserBehaviorStats(startTime?: number, endTime?: number): Promise<{
    averageSessionDuration: number
    pagesPerSession: number
    bounceRate: number
  }> {
    const sessions = await this.getSessions({ startTime, endTime })
    const pageViews = await this.getPageViews({ startTime, endTime })
    
    const completedSessions = sessions.filter(s => s.endTime)
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.endTime! - s.startTime), 0)
    const averageSessionDuration = completedSessions.length > 0 
      ? totalDuration / completedSessions.length / 1000 // Convert to seconds
      : 0

    const pagesPerSession = sessions.length > 0 ? pageViews.length / sessions.length : 0
    
    const bounces = pageViews.filter(pv => pv.bounceRate && pv.bounceRate > 0).length
    const bounceRate = pageViews.length > 0 ? (bounces / pageViews.length) * 100 : 0

    return {
      averageSessionDuration,
      pagesPerSession,
      bounceRate
    }
  }

  // Clear data (useful for testing)
  async clearAll(): Promise<void> {
    this.events = []
    this.pageViews = []
    this.ecommerceEvents = []
    this.sessions = []
  }
}

// Singleton instance
export const analyticsDB = new AnalyticsDatabase()

// Utility functions for generating IDs
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Device type detection
export function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet'
  if (ua.includes('mobile') || ua.includes('android')) return 'mobile'
  return 'desktop'
}

// IP geolocation (mock implementation)
export function getLocationFromIP(ip: string): { country?: string; city?: string } {
  // In production, use a real IP geolocation service
  return { country: 'US', city: 'New York' }
}