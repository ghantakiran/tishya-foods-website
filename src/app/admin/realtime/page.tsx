import { RealTimeMonitor } from '@/components/analytics/real-time-monitor'

export default function RealTimePage() {
  return (
    <div className="min-h-screen bg-earth-900 p-6">
      <RealTimeMonitor />
    </div>
  )
}

export const metadata = {
  title: 'Real-time Analytics - Tishya Foods',
  description: 'Real-time monitoring of website activity and user behavior'
}