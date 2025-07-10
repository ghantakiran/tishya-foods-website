import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed-data'

export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is not allowed in production' },
        { status: 403 }
      )
    }

    console.log('Starting database seeding via API...')
    const result = await seedDatabase()

    return NextResponse.json({
      message: 'Database seeded successfully',
      result
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database seeding endpoint',
    usage: 'Send a POST request to this endpoint to seed the database with sample data',
    note: 'Only available in development environment'
  })
}