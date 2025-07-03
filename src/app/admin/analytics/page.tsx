import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AnalyticsDashboard />
    </div>
  )
}

export const metadata = {
  title: 'Analytics Dashboard - Tishya Foods',
  description: 'Comprehensive analytics and monitoring dashboard'
}