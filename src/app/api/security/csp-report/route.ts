import { NextRequest, NextResponse } from 'next/server'

interface CSPViolationReport {
  'document-uri': string
  'violated-directive': string
  'blocked-uri': string
  'source-file': string
  'line-number': number
  'column-number': number
  'original-policy': string
}

interface CSPReport {
  'csp-report': CSPViolationReport
}

export async function POST(request: NextRequest) {
  try {
    const report: CSPReport = await request.json()
    const violation = report['csp-report']
    
    // Log the CSP violation
    console.warn('[CSP Violation]', {
      timestamp: new Date().toISOString(),
      documentUri: violation['document-uri'],
      violatedDirective: violation['violated-directive'],
      blockedUri: violation['blocked-uri'],
      sourceFile: violation['source-file'],
      lineNumber: violation['line-number'],
      columnNumber: violation['column-number'],
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    })
    
    // In production, you might want to:
    // 1. Send to monitoring service (Sentry, LogRocket, etc.)
    // 2. Store in database for analysis
    // 3. Alert security team for critical violations
    
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to external monitoring service
      // await sendToMonitoringService(violation)
      
      // Example: Store in database
      // await storeCSPViolation(violation)
      
      // Example: Check for critical violations
      if (isCriticalViolation(violation)) {
        console.error('[CSP CRITICAL]', violation)
        // await alertSecurityTeam(violation)
      }
    }
    
    return NextResponse.json({ received: true }, { status: 204 })
  } catch (error) {
    console.error('[CSP Report Error]', error)
    return NextResponse.json(
      { error: 'Failed to process CSP report' },
      { status: 400 }
    )
  }
}

function isCriticalViolation(violation: CSPViolationReport): boolean {
  const criticalDirectives = [
    'script-src',
    'object-src',
    'base-uri',
    'form-action'
  ]
  
  return criticalDirectives.some(directive => 
    violation['violated-directive'].includes(directive)
  )
}

// Rate limiting for CSP reports to prevent spam
const reportCounts = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxReports = 10 // Max reports per minute per IP
  
  const key = `${ip}:${Math.floor(now / windowMs)}`
  const current = reportCounts.get(key) || { count: 0, resetTime: now + windowMs }
  
  if (now > current.resetTime) {
    current.count = 1
    current.resetTime = now + windowMs
  } else {
    current.count++
  }
  
  reportCounts.set(key, current)
  
  // Clean up old entries
  if (Math.random() < 0.1) {
    for (const [k, v] of reportCounts.entries()) {
      if (now > v.resetTime) {
        reportCounts.delete(k)
      }
    }
  }
  
  return current.count > maxReports
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Content-Length': '0'
    }
  })
}