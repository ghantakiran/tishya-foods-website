import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:notifications@tishyafoods.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json()
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      )
    }
    
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'VAPID keys not configured' },
        { status: 500 }
      )
    }
    
    const payload = JSON.stringify({
      title: '🌿 Tishya Foods Test',
      body: 'This is a test notification! Your push notifications are working perfectly.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'test-notification',
      data: {
        url: '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View App',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/icon-72x72.png'
        }
      ]
    })
    
    // Find subscription in our mock database (in a real app, this would query the database)
    const subscription = {
      endpoint,
      keys: {
        p256dh: 'mock-p256dh-key',
        auth: 'mock-auth-key'
      }
    }
    
    try {
      await webpush.sendNotification(subscription, payload)
      console.log('Test notification sent successfully')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Test notification sent successfully' 
      })
    } catch (error) {
      console.error('Error sending test notification:', error)
      return NextResponse.json(
        { error: 'Failed to send test notification' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in send-test route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}