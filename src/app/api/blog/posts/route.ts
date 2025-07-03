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
  },
  {
    id: '2',
    title: '10 Delicious Plant-Based Protein Recipes for Every Meal',
    slug: 'plant-based-protein-recipes',
    excerpt: 'Explore creative and delicious ways to incorporate plant-based proteins into your breakfast, lunch, and dinner with these nutritious recipes.',
    content: `
      <p>Plant-based proteins are not only environmentally sustainable but also incredibly versatile and delicious. Here are 10 amazing recipes that will revolutionize your meal planning.</p>
      
      <h2>Breakfast Options</h2>
      <p>Start your day with protein-packed breakfast options that will keep you energized throughout the morning.</p>
      
      <h3>1. Quinoa Breakfast Bowl</h3>
      <p>A colorful bowl packed with quinoa, fresh fruits, nuts, and seeds for a complete amino acid profile.</p>
      
      <h3>2. Chickpea Flour Pancakes</h3>
      <p>Fluffy, protein-rich pancakes made from chickpea flour and topped with fresh berries.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&crop=center',
    status: 'published',
    publishedAt: '2024-01-20T09:00:00Z',
    createdAt: '2024-01-18T08:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    author: {
      id: '2',
      name: 'Chef Maria Rodriguez',
      email: 'maria@tishyafoods.com',
      avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face',
      bio: 'Plant-based chef and cookbook author specializing in innovative protein-rich recipes.'
    },
    categories: [
      { id: '4', name: 'Recipes', slug: 'recipes', description: 'Healthy and delicious recipes' },
      { id: '1', name: 'Nutrition', slug: 'nutrition', description: 'All about nutrition and healthy eating' }
    ],
    tags: [
      { id: '3', name: 'plant-based', slug: 'plant-based', description: 'Plant-based nutrition and recipes' },
      { id: '4', name: 'recipes', slug: 'recipes', description: 'Cooking recipes and meal ideas' },
      { id: '1', name: 'protein', slug: 'protein', description: 'Posts about protein and amino acids' }
    ],
    seo: {
      metaTitle: '10 Plant-Based Protein Recipes | Tishya Foods',
      metaDescription: 'Discover delicious plant-based protein recipes for every meal. Creative, nutritious, and easy-to-make dishes.',
      focusKeyword: 'plant-based protein recipes'
    },
    readingTime: 12,
    viewCount: 892,
    likeCount: 67,
    commentCount: 18,
    featured: false,
    sticky: false
  },
  {
    id: '3',
    title: 'Understanding Organic Farming: From Seed to Plate',
    slug: 'understanding-organic-farming',
    excerpt: 'Learn about the principles of organic farming and how it contributes to healthier food and a sustainable environment.',
    content: `
      <p>Organic farming is more than just avoiding pesticides—it's a holistic approach to agriculture that works in harmony with nature.</p>
      
      <h2>What Makes Farming Organic?</h2>
      <p>Organic farming relies on ecological processes, biodiversity, and cycles adapted to local conditions, rather than the use of synthetic inputs.</p>
      
      <h3>Key Principles</h3>
      <ul>
        <li>Soil health and fertility</li>
        <li>Biodiversity conservation</li>
        <li>Natural pest management</li>
        <li>Animal welfare</li>
      </ul>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&crop=center',
    status: 'published',
    publishedAt: '2024-01-25T11:00:00Z',
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
    author: {
      id: '3',
      name: 'Dr. James Green',
      email: 'james@tishyafoods.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Agricultural scientist and organic farming advocate with 15 years of field experience.'
    },
    categories: [
      { id: '3', name: 'Sustainability', slug: 'sustainability', description: 'Sustainable food practices' },
      { id: '2', name: 'Health', slug: 'health', description: 'Health tips and wellness advice' }
    ],
    tags: [
      { id: '5', name: 'organic', slug: 'organic', description: 'Organic farming and food' },
      { id: '6', name: 'sustainability', slug: 'sustainability', description: 'Environmental sustainability' },
      { id: '7', name: 'farming', slug: 'farming', description: 'Agriculture and farming practices' }
    ],
    seo: {
      metaTitle: 'Understanding Organic Farming | Tishya Foods',
      metaDescription: 'Learn about organic farming principles, benefits, and how it creates healthier food for you and the planet.',
      focusKeyword: 'organic farming'
    },
    readingTime: 6,
    viewCount: 1156,
    likeCount: 94,
    commentCount: 31,
    featured: false,
    sticky: false
  },
  {
    id: '4',
    title: 'The Science Behind Fermented Foods and Gut Health',
    slug: 'fermented-foods-gut-health',
    excerpt: 'Discover how fermented foods support digestive health and overall wellness through beneficial probiotics and nutrients.',
    content: `
      <p>Fermented foods have been consumed for thousands of years, but modern science is now revealing their incredible benefits for gut health and overall wellness.</p>
      
      <h2>The Fermentation Process</h2>
      <p>Fermentation is a natural process where beneficial bacteria and yeasts break down sugars and starches, creating probiotics and enhancing nutrient availability.</p>
      
      <h3>Top Fermented Foods for Health</h3>
      <ul>
        <li>Yogurt and kefir</li>
        <li>Sauerkraut and kimchi</li>
        <li>Miso and tempeh</li>
        <li>Kombucha</li>
      </ul>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop&crop=center',
    status: 'published',
    publishedAt: '2024-01-30T14:00:00Z',
    createdAt: '2024-01-28T08:00:00Z',
    updatedAt: '2024-01-30T14:00:00Z',
    author: {
      id: '1',
      name: 'Dr. Sarah Nutrition',
      email: 'sarah@tishyafoods.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b131?w=100&h=100&fit=crop&crop=face',
      bio: 'Nutritionist and wellness expert with over 10 years of experience in plant-based nutrition.'
    },
    categories: [
      { id: '2', name: 'Health', slug: 'health', description: 'Health tips and wellness advice' },
      { id: '1', name: 'Nutrition', slug: 'nutrition', description: 'All about nutrition and healthy eating' }
    ],
    tags: [
      { id: '8', name: 'gut-health', slug: 'gut-health', description: 'Digestive health and microbiome' },
      { id: '9', name: 'probiotics', slug: 'probiotics', description: 'Beneficial bacteria and fermented foods' },
      { id: '2', name: 'healthy-eating', slug: 'healthy-eating', description: 'Healthy eating tips and advice' }
    ],
    seo: {
      metaTitle: 'Fermented Foods and Gut Health | Tishya Foods',
      metaDescription: 'Learn about the science behind fermented foods and how they support digestive health through probiotics.',
      focusKeyword: 'fermented foods gut health'
    },
    readingTime: 7,
    viewCount: 743,
    likeCount: 52,
    commentCount: 15,
    featured: false,
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