'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Eye, 
  Clock,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react'

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

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalyticsData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [timeRange, fetchAnalyticsData])

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
        setLastUpdated(new Date())
      } else {
        console.error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading && !data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cream-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-cream-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-earth-600">
            Last updated: {lastUpdated?.toLocaleString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalyticsData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.pageViews.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={(data?.pageViews.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {(data?.pageViews.growth || 0) >= 0 ? '+' : ''}{(data?.pageViews.growth || 0).toFixed(1)}%
              </span>{' '}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.users.total || 0)}</div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{data?.users.new || 0} new</span>
              <span>{data?.users.returning || 0} returning</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.ecommerce.revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {data?.ecommerce.orders || 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data?.ecommerce.conversionRate || 0).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              AOV: {formatCurrency(data?.ecommerce.averageOrderValue || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{data?.realTimeUsers || 0}</div>
          <p className="text-sm text-muted-foreground">Users currently active on your site</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Visited Pages</CardTitle>
              <CardDescription>Pages with the highest traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.topPages.map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{page.path}</div>
                        <div className="text-sm text-muted-foreground">
                          Bounce rate: {page.bounceRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatNumber(page.views)}</div>
                      <div className="text-sm text-muted-foreground">views</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground py-8">
                    No page data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Most viewed and purchased products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} sales
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatNumber(product.views)}</div>
                      <div className="text-sm text-muted-foreground">views</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground py-8">
                    No product data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(data?.userBehavior.averageSessionDuration || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Average time per session</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Pages per Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data?.userBehavior.pagesPerSession || 0).toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Average pages viewed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data?.userBehavior.bounceRate || 0).toFixed(1)}%
                </div>
                <div className="mt-2">
                  <Progress 
                    value={data?.userBehavior.bounceRate || 0} 
                    className="h-2"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Single-page sessions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </CardTitle>
          <CardDescription>Download analytics data in various formats</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            CSV Report
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            PDF Summary
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}