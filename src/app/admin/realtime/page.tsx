import { RealTimeMonitor } from '@/components/analytics/real-time-monitor'

export default function RealTimePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <RealTimeMonitor />
    </div>
  )
}

export const metadata = {
  title: 'Real-time Analytics - Tishya Foods',
  description: 'Real-time monitoring of website activity and user behavior'
}