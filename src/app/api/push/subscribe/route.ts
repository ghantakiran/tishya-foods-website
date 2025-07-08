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

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

const subscriptions = new Map<string, PushSubscription>()

export async function POST(request: NextRequest) {
  try {
    const { subscription, userId } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.warn('VAPID keys not configured. Push notifications disabled.')
      return NextResponse.json(
        { 
          success: true, 
          message: 'Subscription saved (notifications disabled in development)' 
        },
        { status: 200 }
      )
    }

    const subscriptionKey = userId || subscription.endpoint
    subscriptions.set(subscriptionKey, subscription)

    console.log(`Push subscription saved for user: ${userId || 'anonymous'}`)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Push subscription saved successfully',
        subscriptionId: subscriptionKey
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error saving push subscription:', error)
    return NextResponse.json(
      { error: 'Failed to save push subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, endpoint } = await request.json()

    const subscriptionKey = userId || endpoint
    if (subscriptions.has(subscriptionKey)) {
      subscriptions.delete(subscriptionKey)
      console.log(`Push subscription removed for: ${subscriptionKey}`)
      
      return NextResponse.json(
        { success: true, message: 'Subscription removed successfully' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Subscription not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error removing push subscription:', error)
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      vapidPublicKey: VAPID_PUBLIC_KEY,
      subscriptionCount: subscriptions.size,
      isConfigured: !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY)
    },
    { status: 200 }
  )
}