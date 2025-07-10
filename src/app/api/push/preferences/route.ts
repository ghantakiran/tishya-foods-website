import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { endpoint, preferences } = await request.json()
    
    if (!endpoint || !preferences) {
      return NextResponse.json(
        { error: 'Endpoint and preferences are required' },
        { status: 400 }
      )
    }
    
    // In a real application, you would save these preferences to a database
    // For now, we'll just log them and return success
    console.log('Updating notification preferences:', {
      endpoint,
      preferences,
      updatedAt: new Date().toISOString()
    })
    
    // Mock database update
    // await db.collection('push_subscriptions').updateOne(
    //   { endpoint },
    //   { $set: { preferences, updatedAt: new Date() } }
    // )
    
    return NextResponse.json({ 
      success: true, 
      message: 'Preferences updated successfully' 
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}