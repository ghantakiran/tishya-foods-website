import { NextRequest, NextResponse } from 'next/server'
import { BlogCategory } from '@/types/blog'

// Mock database - in production, this would be replaced with actual database queries
const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'All about nutrition and healthy eating',
    color: '#10B981',
    postCount: 24
  },
  {
    id: '2',
    name: 'Health',
    slug: 'health',
    description: 'Health tips and wellness advice',
    color: '#3B82F6',
    postCount: 18
  },
  {
    id: '3',
    name: 'Sustainability',
    slug: 'sustainability',
    description: 'Sustainable practices and environmental impact',
    color: '#059669',
    postCount: 12
  },
  {
    id: '4',
    name: 'Recipes',
    slug: 'recipes',
    description: 'Healthy recipes and cooking tips',
    color: '#F59E0B',
    postCount: 15
  },
  {
    id: '5',
    name: 'Wellness',
    slug: 'wellness',
    description: 'Overall wellness and lifestyle tips',
    color: '#8B5CF6',
    postCount: 9
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePostCount = searchParams.get('include_post_count') === 'true'

    let categories = [...mockCategories]

    if (!includePostCount) {
      categories = categories.map((category) => {
        const { postCount, ...categoryWithoutCount } = category
        // postCount is intentionally excluded from the response
        return categoryWithoutCount as BlogCategory
      })
    }

    // Sort by post count (descending) or name
    categories.sort((a, b) => {
      if (includePostCount && a.postCount !== undefined && b.postCount !== undefined) {
        return b.postCount - a.postCount
      }
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      categories,
      total: categories.length
    })
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Missing required field: name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if slug already exists
    const existingCategory = mockCategories.find(cat => cat.slug === slug)
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    // Create new category
    const newCategory: BlogCategory = {
      id: Date.now().toString(),
      name: data.name,
      slug: data.slug || slug,
      description: data.description || '',
      color: data.color || '#6B7280',
      postCount: 0
    }

    mockCategories.push(newCategory)

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating blog category:', error)
    return NextResponse.json(
      { error: 'Failed to create blog category' },
      { status: 500 }
    )
  }
}