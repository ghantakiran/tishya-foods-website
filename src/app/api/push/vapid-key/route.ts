import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY
    
    if (!publicKey) {
      return NextResponse.json(
        { error: 'VAPID public key not configured' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ publicKey })
  } catch (error) {
    console.error('Error getting VAPID key:', error)
    return NextResponse.json(
      { error: 'Failed to get VAPID key' },
      { status: 500 }
    )
  }
}