'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Image,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Plus,
  Activity,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { DashboardStats, ContentPerformance } from '@/types/cms'

// Mock data - will be replaced with real API calls
const mockStats: DashboardStats = {
  content: {
    total: 45,
    published: 32,
    draft: 10,
    scheduled: 3,
  },
  media: {
    total: 156,
    totalSize: 45600000, // bytes
    images: 134,
    documents: 22,
  },
  users: {
    total: 28,
    active: 24,
    newThisMonth: 5,
  },
  engagement: {
    totalViews: 12845,
    totalComments: 234,
    totalLikes: 1456,
    avgEngagement: 8.2,
  },
}

const mockRecentContent: ContentPerformance[] = [
  {
    contentId: '1',
    title: 'The Health Benefits of Organic Protein Bars',
    views: 1245,
    engagement: 12.4,
    publishedAt: new Date('2024-01-15'),
    trend: 'up',
  },
  {
    contentId: '2',
    title: 'Sustainable Snacking: Our Environmental Commitment',
    views: 856,
    engagement: 9.8,
    publishedAt: new Date('2024-01-12'),
    trend: 'up',
  },
  {
    contentId: '3',
    title: 'Recipe: Energy Balls with Natural Ingredients',
    views: 645,
    engagement: 7.2,
    publishedAt: new Date('2024-01-10'),
    trend: 'down',
  },
]

const mockRecentActivity = [
  {
    id: '1',
    action: 'Created new blog post',
    user: 'John Doe',
    target: 'Healthy Morning Routines',
    time: '2 hours ago',
    type: 'create',
  },
  {
    id: '2',
    action: 'Updated product',
    user: 'Jane Smith',
    target: 'Protein Energy Bar - Chocolate',
    time: '4 hours ago',
    type: 'update',
  },
  {
    id: '3',
    action: 'Uploaded media',
    user: 'Mike Johnson',
    target: '5 new product images',
    time: '6 hours ago',
    type: 'upload',
  },
  {
    id: '4',
    action: 'Published content',
    user: 'Sarah Wilson',
    target: 'Weekly Newsletter #45',
    time: '1 day ago',
    type: 'publish',
  },
]

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentContent, setRecentContent] = useState<ContentPerformance[]>(mockRecentContent)
  const [loading, setLoading] = useState(false)

  // TODO: Replace with real API calls
  useEffect(() => {
    // Fetch dashboard data
    setLoading(true)
    setTimeout(() => {
      setStats(mockStats)
      setRecentContent(mockRecentContent)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your content.</p>
        </div>
        <div className="flex space-x-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.content.total}</div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{stats.content.published} published</span>
              <span>•</span>
              <span>{stats.content.draft} drafts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Media Files</CardTitle>
            <Image className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.media.total}</div>
            <div className="text-xs text-gray-400">
              {formatFileSize(stats.media.totalSize)} total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.engagement.totalViews)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-green-400">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.users.active}</div>
            <div className="text-xs text-gray-400">
              {stats.users.newThisMonth} new this month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Content Performance */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Content</CardTitle>
            <CardDescription className="text-gray-400">
              Most viewed content in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div key={content.contentId} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {content.title}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(content.views)}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {content.engagement}%
                      </span>
                      <span>
                        {content.publishedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {content.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Latest actions in your CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'create' && <Plus className="h-4 w-4 text-green-400" />}
                    {activity.type === 'update' && <FileText className="h-4 w-4 text-blue-400" />}
                    {activity.type === 'upload' && <Image className="h-4 w-4 text-purple-400" />}
                    {activity.type === 'publish' && <Calendar className="h-4 w-4 text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {activity.target}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start space-y-1">
                <FileText className="h-5 w-5 text-blue-400" />
                <span className="font-medium">New Blog Post</span>
                <span className="text-xs text-gray-400">Create article</span>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start space-y-1">
                <Image className="h-5 w-5 text-green-400" />
                <span className="font-medium">Upload Media</span>
                <span className="text-xs text-gray-400">Add images/files</span>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start space-y-1">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="font-medium">Manage Users</span>
                <span className="text-xs text-gray-400">User permissions</span>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start space-y-1">
                <Activity className="h-5 w-5 text-orange-400" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-gray-400">Content insights</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}