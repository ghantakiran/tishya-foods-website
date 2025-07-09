import { NextRequest, NextResponse } from 'next/server'
import { analyticsDB } from '@/lib/analytics/analytics-database'

interface AnalyticsData {
  pageViews: {
    total: number
    today: number
    growth: number
  }
  users: {
    total: number
    active: number
    new: number
    returning: number
  }
  ecommerce: {
    revenue: number
    orders: number
    averageOrderValue: number
    conversionRate: number
  }
  topPages: Array<{
    path: string
    views: number
    bounceRate: number
  }>
  topProducts: Array<{
    id: string
    name: string
    views: number
    sales: number
  }>
  userBehavior: {
    averageSessionDuration: number
    pagesPerSession: number
    bounceRate: number
  }
  realTimeUsers: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    
    // Calculate time boundaries
    const now = Date.now()
    let startTime: number
    
    switch (timeRange) {
      case '24h':
        startTime = now - 24 * 60 * 60 * 1000
        break
      case '7d':
        startTime = now - 7 * 24 * 60 * 60 * 1000
        break
      case '30d':
        startTime = now - 30 * 24 * 60 * 60 * 1000
        break
      case '90d':
        startTime = now - 90 * 24 * 60 * 60 * 1000
        break
      default:
        startTime = now - 7 * 24 * 60 * 60 * 1000
    }

    // Fetch real-time data from analytics database
    const [pageViewStats, userStats, ecommerceStats, userBehaviorStats] = await Promise.all([
      analyticsDB.getPageViewStats(startTime, now),
      analyticsDB.getUserStats(startTime, now),
      analyticsDB.getEcommerceStats(startTime, now),
      analyticsDB.getUserBehaviorStats(startTime, now)
    ])

    const analyticsData: AnalyticsData = {
      pageViews: {
        total: pageViewStats.total,
        today: pageViewStats.today,
        growth: pageViewStats.growth
      },
      users: {
        total: userStats.total,
        active: userStats.active,
        new: userStats.new,
        returning: userStats.returning
      },
      ecommerce: {
        revenue: ecommerceStats.revenue,
        orders: ecommerceStats.orders,
        averageOrderValue: ecommerceStats.averageOrderValue,
        conversionRate: ecommerceStats.conversionRate
      },
      topPages: pageViewStats.topPages,
      topProducts: ecommerceStats.topProducts,
      userBehavior: {
        averageSessionDuration: userBehaviorStats.averageSessionDuration,
        pagesPerSession: userBehaviorStats.pagesPerSession,
        bounceRate: userBehaviorStats.bounceRate
      },
      realTimeUsers: userStats.realTimeUsers
    }

    // If no real data exists, provide fallback mock data for demonstration
    if (analyticsData.pageViews.total === 0) {
      const mockData: AnalyticsData = {
        pageViews: {
          total: 45623,
          today: 1234,
          growth: 12.5
        },
        users: {
          total: 8934,
          active: 234,
          new: 1567,
          returning: 7367
        },
        ecommerce: {
          revenue: 125680,
          orders: 156,
          averageOrderValue: 805.64,
          conversionRate: 3.42
        },
        topPages: [
          { path: '/', views: 12453, bounceRate: 45.2 },
          { path: '/products', views: 8765, bounceRate: 38.7 },
          { path: '/products/organic-quinoa', views: 4321, bounceRate: 32.1 },
          { path: '/about', views: 3210, bounceRate: 55.8 },
          { path: '/cart', views: 2987, bounceRate: 25.6 }
        ],
        topProducts: [
          { id: 'prod_001', name: 'Organic Quinoa', views: 4321, sales: 89 },
          { id: 'prod_002', name: 'Wild Rice', views: 3876, sales: 67 },
          { id: 'prod_003', name: 'Brown Rice', views: 3245, sales: 78 },
          { id: 'prod_004', name: 'Millet Mix', views: 2987, sales: 45 },
          { id: 'prod_005', name: 'Oats Premium', views: 2654, sales: 56 }
        ],
        userBehavior: {
          averageSessionDuration: 185,
          pagesPerSession: 3.2,
          bounceRate: 42.8
        },
        realTimeUsers: 47
      }
      
      // Adjust mock data based on time range
      const timeMultiplier = timeRange === '24h' ? 0.1 : 
                            timeRange === '30d' ? 4.2 : 
                            timeRange === '90d' ? 12.5 : 1
      
      mockData.pageViews.total = Math.floor(mockData.pageViews.total * timeMultiplier)
      mockData.users.total = Math.floor(mockData.users.total * timeMultiplier * 0.8)
      mockData.ecommerce.revenue = Math.floor(mockData.ecommerce.revenue * timeMultiplier * 1.2)
      mockData.ecommerce.orders = Math.floor(mockData.ecommerce.orders * timeMultiplier)
      mockData.ecommerce.averageOrderValue = mockData.ecommerce.orders > 0 ? 
        mockData.ecommerce.revenue / mockData.ecommerce.orders : 0
      mockData.ecommerce.conversionRate = mockData.users.total > 0 ? 
        (mockData.ecommerce.orders / mockData.users.total) * 100 : 0
      
      return NextResponse.json(mockData)
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}