import { NextRequest, NextResponse } from 'next/server'
import { BlogTag } from '@/types/blog'

// Mock database - in production, this would be replaced with actual database queries
const mockTags: BlogTag[] = [
  {
    id: '1',
    name: 'protein',
    slug: 'protein',
    description: 'Posts about protein and amino acids',
    color: '#EF4444',
    postCount: 15
  },
  {
    id: '2',
    name: 'healthy-eating',
    slug: 'healthy-eating',
    description: 'Healthy eating tips and advice',
    color: '#10B981',
    postCount: 22
  },
  {
    id: '3',
    name: 'plant-based',
    slug: 'plant-based',
    description: 'Plant-based nutrition and recipes',
    color: '#059669',
    postCount: 18
  },
  {
    id: '4',
    name: 'organic',
    slug: 'organic',
    description: 'Organic food and farming practices',
    color: '#84CC16',
    postCount: 12
  },
  {
    id: '5',
    name: 'superfoods',
    slug: 'superfoods',
    description: 'Nutrient-dense superfoods and their benefits',
    color: '#8B5CF6',
    postCount: 9
  },
  {
    id: '6',
    name: 'vitamins',
    slug: 'vitamins',
    description: 'Essential vitamins and their sources',
    color: '#F59E0B',
    postCount: 11
  },
  {
    id: '7',
    name: 'minerals',
    slug: 'minerals',
    description: 'Important minerals for health',
    color: '#6B7280',
    postCount: 8
  },
  {
    id: '8',
    name: 'antioxidants',
    slug: 'antioxidants',
    description: 'Antioxidant-rich foods and benefits',
    color: '#DC2626',
    postCount: 7
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePostCount = searchParams.get('include_post_count') === 'true'
    const popular = searchParams.get('popular') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    let tags = [...mockTags]

    if (!includePostCount) {
      tags = tags.map((tag) => {
        const { postCount: _, ...tagWithoutCount } = tag
        return tagWithoutCount as BlogTag
      })
    }

    // Sort by post count (descending) if popular, otherwise by name
    if (popular) {
      tags.sort((a, b) => {
        if (a.postCount !== undefined && b.postCount !== undefined) {
          return b.postCount - a.postCount
        }
        return a.name.localeCompare(b.name)
      })
    } else {
      tags.sort((a, b) => a.name.localeCompare(b.name))
    }

    // Apply limit
    if (limit > 0) {
      tags = tags.slice(0, limit)
    }

    return NextResponse.json({
      tags,
      total: mockTags.length
    })
  } catch (error) {
    console.error('Error fetching blog tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog tags' },
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
    const existingTag = mockTags.find(tag => tag.slug === slug)
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 409 }
      )
    }

    // Create new tag
    const newTag: BlogTag = {
      id: Date.now().toString(),
      name: data.name,
      slug: data.slug || slug,
      description: data.description || '',
      color: data.color || '#6B7280',
      postCount: 0
    }

    mockTags.push(newTag)

    return NextResponse.json(newTag, { status: 201 })
  } catch (error) {
    console.error('Error creating blog tag:', error)
    return NextResponse.json(
      { error: 'Failed to create blog tag' },
      { status: 500 }
    )
  }
}