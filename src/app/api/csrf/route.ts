import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken, setCSRFCookie } from '@/lib/security/csrf'

export async function GET(request: NextRequest) {
  try {
    const token = generateCSRFToken()
    const response = NextResponse.json({ 
      token,
      message: 'CSRF token generated successfully' 
    })
    
    setCSRFCookie(response, token)
    
    return response
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}