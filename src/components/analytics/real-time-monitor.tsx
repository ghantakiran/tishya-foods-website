'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Globe, 
  Smartphone, 
  Monitor, 
  TrendingUp, 
  Clock,
  MapPin,
  Users
} from 'lucide-react'

interface RealTimeData {
  activeUsers: number
  pageViews: {
    current: number
    previous: number
  }
  topPages: Array<{
    path: string
    activeUsers: number
  }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  countries: Array<{
    name: string
    users: number
    flag: string
  }>
  traffic: Array<{
    timestamp: string
    users: number
  }>
}

export function RealTimeMonitor() {
  const [data, setData] = useState<RealTimeData | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource

    const connectToRealTime = () => {
      try {
        eventSource = new EventSource('/api/analytics/realtime')
        
        eventSource.onopen = () => {
          setIsConnected(true)
        }

        eventSource.onmessage = (event) => {
          try {
            const realtimeData = JSON.parse(event.data)
            setData(realtimeData)
          } catch (error) {
            console.error('Error parsing real-time data:', error)
          }
        }

        eventSource.onerror = () => {
          setIsConnected(false)
          eventSource.close()
          
          // Reconnect after 5 seconds
          setTimeout(connectToRealTime, 5000)
        }
      } catch (error) {
        console.error('Error connecting to real-time analytics:', error)
        setIsConnected(false)
      }
    }

    connectToRealTime()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Monitor className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getTrendDirection = () => {
    if (!data) return null
    
    const current = data.pageViews.current
    const previous = data.pageViews.previous
    const change = ((current - previous) / previous) * 100
    
    return {
      direction: change >= 0 ? 'up' : 'down',
      percentage: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    }
  }

  const trend = getTrendDirection()

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time Analytics</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Active Users Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {data?.activeUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Users online right now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.pageViews.current || 0}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp 
                  className={`h-3 w-3 ${trend.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'}`} 
                />
                <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                  {trend.percentage}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Device</CardTitle>
            {data && getDeviceIcon(
              Object.entries(data.devices || {})
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'desktop'
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data && Object.entries(data.devices || {})
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Desktop'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data && Object.entries(data.devices || {})
                .sort(([,a], [,b]) => b - a)[0]?.[1] || 0} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Country</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {data?.countries[0]?.flag || '🌍'}
              </span>
              <div>
                <div className="font-medium">
                  {data?.countries[0]?.name || 'Unknown'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data?.countries[0]?.users || 0} users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Active Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <div className="truncate">
                      <div className="font-medium truncate">{page.path}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">{page.activeUsers}</span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-8">
                  No active pages data
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data && Object.entries(data.devices).map(([device, users]) => {
                const total = Object.values(data.devices).reduce((sum, count) => sum + count, 0)
                const percentage = total > 0 ? (users / total) * 100 : 0
                
                return (
                  <div key={device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device)}
                        <span className="capitalize font-medium">{device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                        <span className="font-medium">{users}</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Active Users by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.countries.map((country) => (
              <div key={country.name} className="flex items-center justify-between p-3 bg-earth-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="font-medium">{country.users}</span>
                </div>
              </div>
            )) || (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No country data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}