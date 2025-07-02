import { NextRequest } from 'next/server'

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

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events
  const responseStream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      
      const sendData = () => {
        // Generate mock real-time data
        const mockData: RealTimeData = {
          activeUsers: Math.floor(Math.random() * 100) + 20,
          pageViews: {
            current: Math.floor(Math.random() * 50) + 10,
            previous: Math.floor(Math.random() * 45) + 8
          },
          topPages: [
            { path: '/', activeUsers: Math.floor(Math.random() * 15) + 5 },
            { path: '/products', activeUsers: Math.floor(Math.random() * 12) + 3 },
            { path: '/products/organic-quinoa', activeUsers: Math.floor(Math.random() * 8) + 2 },
            { path: '/cart', activeUsers: Math.floor(Math.random() * 6) + 1 },
            { path: '/checkout', activeUsers: Math.floor(Math.random() * 4) + 1 }
          ],
          devices: {
            desktop: Math.floor(Math.random() * 40) + 20,
            mobile: Math.floor(Math.random() * 35) + 15,
            tablet: Math.floor(Math.random() * 10) + 5
          },
          countries: [
            { name: 'India', users: Math.floor(Math.random() * 30) + 15, flag: '🇮🇳' },
            { name: 'United States', users: Math.floor(Math.random() * 20) + 8, flag: '🇺🇸' },
            { name: 'United Kingdom', users: Math.floor(Math.random() * 15) + 5, flag: '🇬🇧' },
            { name: 'Canada', users: Math.floor(Math.random() * 12) + 3, flag: '🇨🇦' },
            { name: 'Australia', users: Math.floor(Math.random() * 10) + 2, flag: '🇦🇺' }
          ],
          traffic: Array.from({ length: 10 }, (_, i) => ({
            timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
            users: Math.floor(Math.random() * 50) + 10
          }))
        }

        const message = `data: ${JSON.stringify(mockData)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Send initial data
      sendData()

      // Send updates every 5 seconds
      const interval = setInterval(sendData, 5000)

      // Cleanup function
      const cleanup = () => {
        clearInterval(interval)
        controller.close()
      }

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup)

      return cleanup
    }
  })

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}