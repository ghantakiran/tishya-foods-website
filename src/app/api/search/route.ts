import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/products-data'
import { getAllBlogPosts } from '@/lib/blog-data'
import { getAllRecipes } from '@/lib/recipes-data'

interface SearchResult {
  id: string
  title: string
  type: 'product' | 'blog' | 'recipe'
  description: string
  url: string
  image?: string
  price?: string
  category?: string
  tags?: string[]
  score?: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase().trim() || ''
  const category = searchParams.get('category') || 'all'
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query) {
    return NextResponse.json({
      results: [],
      total: 0,
      query: '',
      category
    })
  }

  try {
    const allResults: SearchResult[] = []
    
    // Get data
    const blogPosts = getAllBlogPosts()
    const recipes = getAllRecipes()

    // Search Products
    if (category === 'all' || category === 'products') {
      const productResults = products
        .map(product => {
          const score = calculateSearchScore(query, {
            title: product.name,
            description: product.description,
            tags: product.tags || [],
            category: product.category.name,
            ingredients: product.ingredients || []
          })

          if (score > 0) {
            return {
              id: `product-${product.id}`,
              title: product.name,
              type: 'product' as const,
              description: product.description,
              url: `/products/${product.id}`,
              image: product.image,
              price: product.price,
              category: product.category.name,
              tags: product.tags,
              score
            }
          }
          return null
        })
        .filter((result): result is SearchResult => result !== null)

      allResults.push(...productResults)
    }

    // Search Blog Posts
    if (category === 'all' || category === 'blog') {
      const blogResults = blogPosts
        .map(post => {
          const score = calculateSearchScore(query, {
            title: post.title,
            description: post.excerpt,
            tags: post.tags || [],
            category: post.category,
            content: post.content || ''
          })

          if (score > 0) {
            return {
              id: `blog-${post.id}`,
              title: post.title,
              type: 'blog' as const,
              description: post.excerpt,
              url: `/blog/${post.slug}`,
              image: post.image,
              category: post.category,
              tags: post.tags,
              score
            }
          }
          return null
        })
        .filter((result): result is SearchResult => result !== null)

      allResults.push(...blogResults)
    }

    // Search Recipes
    if (category === 'all' || category === 'recipes') {
      const recipeResults = recipes
        .map(recipe => {
          const score = calculateSearchScore(query, {
            title: recipe.name,
            description: recipe.description,
            tags: [],
            category: recipe.category,
            ingredients: recipe.ingredients || []
          })

          if (score > 0) {
            return {
              id: `recipe-${recipe.id}`,
              title: recipe.name,
              type: 'recipe' as const,
              description: recipe.description,
              url: `/recipes/${recipe.id}`,
              image: recipe.image,
              category: recipe.category,
              tags: [],
              score
            }
          }
          return null
        })
        .filter((result): result is SearchResult => result !== null)

      allResults.push(...recipeResults)
    }

    // Sort by relevance score (descending) and limit results
    const sortedResults = allResults
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit)
      .map(result => {
        // Remove score from final results
        const { score, ...resultWithoutScore } = result
        return resultWithoutScore
      })

    // Track search analytics (in a real app, you'd store this in a database)
    console.log(`Search performed: "${query}" in category "${category}" - ${sortedResults.length} results`)

    return NextResponse.json({
      results: sortedResults,
      total: allResults.length,
      query,
      category,
      suggestions: generateSearchSuggestions(query, allResults)
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        results: [],
        total: 0,
        query,
        category 
      },
      { status: 500 }
    )
  }
}

function calculateSearchScore(
  query: string,
  content: {
    title: string
    description: string
    tags?: string[]
    category?: string
    ingredients?: string[]
    content?: string
  }
): number {
  let score = 0
  const queryWords = query.split(' ').filter(word => word.length > 0)

  queryWords.forEach(word => {
    // Title matches (highest weight)
    if (content.title.toLowerCase().includes(word)) {
      score += 10
    }

    // Exact title match bonus
    if (content.title.toLowerCase() === query) {
      score += 20
    }

    // Description matches
    if (content.description.toLowerCase().includes(word)) {
      score += 5
    }

    // Category matches
    if (content.category?.toLowerCase().includes(word)) {
      score += 7
    }

    // Tag matches
    content.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(word)) {
        score += 6
      }
    })

    // Ingredient matches (for products and recipes)
    content.ingredients?.forEach(ingredient => {
      if (ingredient.toLowerCase().includes(word)) {
        score += 4
      }
    })

    // Content matches (for blog posts)
    if (content.content && content.content.toLowerCase().includes(word)) {
      score += 2
    }
  })

  // Boost score for exact phrase matches
  if (content.title.toLowerCase().includes(query)) {
    score += 15
  }
  if (content.description.toLowerCase().includes(query)) {
    score += 10
  }

  return score
}

function generateSearchSuggestions(query: string, results: SearchResult[]): string[] {
  const suggestions = new Set<string>()
  
  // Add category-based suggestions
  results.forEach(result => {
    if (result.category) {
      suggestions.add(result.category)
    }
    
    // Add popular tags
    result.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(tag.toLowerCase())) {
        suggestions.add(tag)
      }
    })
  })

  // Add popular search terms based on results
  const popularTerms = [
    'organic', 'protein', 'gluten-free', 'healthy', 'natural',
    'low-carb', 'vegan', 'keto', 'superfood', 'energy'
  ]

  popularTerms.forEach(term => {
    if (term.includes(query.toLowerCase()) && !suggestions.has(term)) {
      suggestions.add(term)
    }
  })

  return Array.from(suggestions).slice(0, 5)
}