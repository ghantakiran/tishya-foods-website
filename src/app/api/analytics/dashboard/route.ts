import { NextRequest, NextResponse } from 'next/server'

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
    
    // In a real implementation, this would fetch from your analytics database
    // For now, we'll return mock data that matches the expected structure
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
        averageSessionDuration: 185, // seconds
        pagesPerSession: 3.2,
        bounceRate: 42.8
      },
      realTimeUsers: 47
    }

    // Simulate different data based on time range
    if (timeRange === '24h') {
      mockData.pageViews.total = Math.floor(mockData.pageViews.total * 0.1)
      mockData.users.total = Math.floor(mockData.users.total * 0.08)
      mockData.ecommerce.revenue = Math.floor(mockData.ecommerce.revenue * 0.12)
      mockData.ecommerce.orders = Math.floor(mockData.ecommerce.orders * 0.15)
    } else if (timeRange === '30d') {
      mockData.pageViews.total = Math.floor(mockData.pageViews.total * 4.2)
      mockData.users.total = Math.floor(mockData.users.total * 3.8)
      mockData.ecommerce.revenue = Math.floor(mockData.ecommerce.revenue * 4.5)
      mockData.ecommerce.orders = Math.floor(mockData.ecommerce.orders * 4.1)
    } else if (timeRange === '90d') {
      mockData.pageViews.total = Math.floor(mockData.pageViews.total * 12.5)
      mockData.users.total = Math.floor(mockData.users.total * 11.2)
      mockData.ecommerce.revenue = Math.floor(mockData.ecommerce.revenue * 13.8)
      mockData.ecommerce.orders = Math.floor(mockData.ecommerce.orders * 12.9)
    }

    // Recalculate dependent metrics
    mockData.ecommerce.averageOrderValue = mockData.ecommerce.revenue / mockData.ecommerce.orders
    mockData.ecommerce.conversionRate = (mockData.ecommerce.orders / mockData.users.total) * 100

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}