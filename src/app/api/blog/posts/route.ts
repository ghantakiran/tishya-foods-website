import { NextRequest, NextResponse } from 'next/server'
import { BlogPost, BlogPostStatus } from '@/types/blog'

// Mock database - in production, this would be replaced with actual database queries
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Complete Guide to Protein-Rich Foods for Optimal Health',
    slug: 'complete-guide-protein-rich-foods',
    excerpt: 'Discover the essential role of protein in your diet and learn about the best natural sources for maintaining optimal health and wellness.',
    content: `
      <p>Protein is one of the three macronutrients essential for human health, alongside carbohydrates and fats. It plays a crucial role in building and repairing tissues, producing enzymes and hormones, and supporting immune function.</p>
      
      <h2>Why Protein Matters</h2>
      <p>Every cell in your body contains protein. It's used to build and repair tissues such as muscles, bones, cartilage, skin, and blood. Protein is also used to make enzymes, hormones, and other body chemicals.</p>
      
      <h3>Benefits of High-Quality Protein</h3>
      <ul>
        <li>Muscle growth and maintenance</li>
        <li>Weight management support</li>
        <li>Improved bone health</li>
        <li>Enhanced immune function</li>
        <li>Better recovery after exercise</li>
      </ul>
    `,
    featuredImage: '/images/blog/protein-guide.jpg',
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: {
      id: '1',
      name: 'Dr. Sarah Nutrition',
      email: 'sarah@tishyafoods.com',
      avatar: '/images/authors/sarah.jpg',
      bio: 'Nutritionist and wellness expert with over 10 years of experience in plant-based nutrition.'
    },
    categories: [
      { id: '1', name: 'Nutrition', slug: 'nutrition', description: 'All about nutrition and healthy eating' },
      { id: '2', name: 'Health', slug: 'health', description: 'Health tips and wellness advice' }
    ],
    tags: [
      { id: '1', name: 'protein', slug: 'protein', description: 'Posts about protein and amino acids' },
      { id: '2', name: 'healthy-eating', slug: 'healthy-eating', description: 'Healthy eating tips and advice' },
      { id: '3', name: 'plant-based', slug: 'plant-based', description: 'Plant-based nutrition and recipes' }
    ],
    seo: {
      metaTitle: 'The Complete Guide to Protein-Rich Foods | Tishya Foods',
      metaDescription: 'Learn about the best protein-rich foods for optimal health. Discover plant-based and animal-based protein sources, daily requirements, and quality factors.',
      focusKeyword: 'protein-rich foods'
    },
    readingTime: 8,
    viewCount: 1247,
    likeCount: 89,
    commentCount: 23,
    featured: true,
    sticky: false
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const status = searchParams.get('status') as BlogPostStatus || 'published'
    const featured = searchParams.get('featured') === 'true'

    let filteredPosts = mockPosts.filter(post => post.status === status)

    // Apply filters
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.categories.some(cat => cat.slug === category)
      )
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(t => t.slug === tag)
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      )
    }

    if (featured) {
      filteredPosts = filteredPosts.filter(post => post.featured)
    }

    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    )

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
        hasNextPage: endIndex < filteredPosts.length,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.content || !data.authorId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and authorId are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Create new post
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: data.title,
      slug: data.slug || slug,
      excerpt: data.excerpt || '',
      content: data.content,
      featuredImage: data.featuredImage,
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: data.authorId,
        name: data.authorName || 'Unknown Author',
        email: data.authorEmail || '',
        avatar: data.authorAvatar
      },
      categories: data.categories || [],
      tags: data.tags || [],
      seo: data.seo || {},
      readingTime: Math.ceil(data.content.split(' ').length / 200), // Estimate reading time
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      featured: data.featured || false,
      sticky: data.sticky || false
    }

    // In production, save to database
    mockPosts.push(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}