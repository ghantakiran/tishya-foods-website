import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'noreply@tishyafoods.com'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${VAPID_EMAIL}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )
}

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: Record<string, any>
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  requireInteraction?: boolean
  silent?: boolean
}

interface SendNotificationRequest {
  userId?: string
  subscription?: any
  notification: NotificationPayload
  scheduledTime?: string
}

const subscriptions = new Map()

export async function POST(request: NextRequest) {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { 
          error: 'Push notifications not configured. Please set VAPID keys.',
          success: false
        },
        { status: 503 }
      )
    }

    const { userId, subscription, notification, scheduledTime }: SendNotificationRequest = await request.json()

    if (!notification || !notification.title) {
      return NextResponse.json(
        { error: 'Invalid notification payload' },
        { status: 400 }
      )
    }

    const payload = JSON.stringify({
      ...notification,
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/icon-72x72.png',
      data: {
        url: '/',
        timestamp: Date.now(),
        ...notification.data
      }
    })

    const results: any[] = []

    if (subscription) {
      try {
        const result = await webpush.sendNotification(subscription, payload)
        results.push({ success: true, endpoint: subscription.endpoint })
        console.log('Push notification sent successfully')
      } catch (error) {
        console.error('Failed to send push notification:', error)
        results.push({ 
          success: false, 
          endpoint: subscription.endpoint, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    } else if (userId && subscriptions.has(userId)) {
      const userSubscription = subscriptions.get(userId)
      try {
        const result = await webpush.sendNotification(userSubscription, payload)
        results.push({ success: true, userId, endpoint: userSubscription.endpoint })
        console.log(`Push notification sent to user: ${userId}`)
      } catch (error) {
        console.error(`Failed to send push notification to user ${userId}:`, error)
        results.push({ 
          success: false, 
          userId, 
          endpoint: userSubscription.endpoint, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    } else {
      const allSubscriptions = Array.from(subscriptions.values())
      if (allSubscriptions.length === 0) {
        return NextResponse.json(
          { error: 'No active subscriptions found' },
          { status: 404 }
        )
      }

      for (const sub of allSubscriptions) {
        try {
          await webpush.sendNotification(sub, payload)
          results.push({ success: true, endpoint: sub.endpoint })
        } catch (error) {
          console.error('Failed to send push notification:', error)
          results.push({ 
            success: false, 
            endpoint: sub.endpoint, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          })
        }
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return NextResponse.json(
      {
        success: successCount > 0,
        message: `Sent ${successCount}/${totalCount} notifications successfully`,
        results,
        payload: JSON.parse(payload)
      },
      { status: successCount > 0 ? 200 : 500 }
    )

  } catch (error) {
    console.error('Error sending push notification:', error)
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      isConfigured: !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY),
      subscriptionCount: subscriptions.size,
      vapidPublicKey: VAPID_PUBLIC_KEY
    },
    { status: 200 }
  )
}