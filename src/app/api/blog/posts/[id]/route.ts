import { NextRequest, NextResponse } from 'next/server'
import { BlogPost } from '@/types/blog'

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
    featuredImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&crop=center',
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: {
      id: '1',
      name: 'Dr. Sarah Nutrition',
      email: 'sarah@tishyafoods.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b131?w=100&h=100&fit=crop&crop=face',
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = mockPosts.find(p => p.id === id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const postIndex = mockPosts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    const existingPost = mockPosts[postIndex]
    
    // Update post
    const updatedPost: BlogPost = {
      ...existingPost,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'published' && !existingPost.publishedAt 
        ? new Date().toISOString() 
        : existingPost.publishedAt
    }

    // Recalculate reading time if content changed
    if (data.content && data.content !== existingPost.content) {
      updatedPost.readingTime = Math.ceil(data.content.split(' ').length / 200)
    }

    mockPosts[postIndex] = updatedPost

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postIndex = mockPosts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    const deletedPost = mockPosts.splice(postIndex, 1)[0]

    return NextResponse.json({
      message: 'Blog post deleted successfully',
      post: deletedPost
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

// Increment view count
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { action } = await request.json()
    const postIndex = mockPosts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    const post = mockPosts[postIndex]

    switch (action) {
      case 'increment_view':
        post.viewCount += 1
        break
      case 'increment_like':
        post.likeCount += 1
        break
      case 'decrement_like':
        post.likeCount = Math.max(0, post.likeCount - 1)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    post.updatedAt = new Date().toISOString()
    mockPosts[postIndex] = post

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}