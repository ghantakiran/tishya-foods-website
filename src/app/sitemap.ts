import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products-data'
import { getAllBlogPosts } from '@/lib/blog-data'
import { getAllRecipes } from '@/lib/recipes-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tishyafoods.com'
  const currentDate = new Date().toISOString().split('T')[0]

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nutrition`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/subscription`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/loyalty`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/recommendations`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ]

  try {
    // Dynamic product pages
    const products = getAllProducts()
    const productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updatedAt || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic blog pages
    const blogPosts = getAllBlogPosts()
    const blogPages = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.date || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Dynamic recipe pages
    const recipes = getAllRecipes()
    const recipePages = recipes.map((recipe) => ({
      url: `${baseUrl}/recipes/${recipe.id}`,
      lastModified: recipe.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Category pages
    const categories = [...new Set(products.map(p => p.category))]
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/products/category/${encodeURIComponent(category.toLowerCase())}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Blog category pages
    const blogCategories = [...new Set(blogPosts.map(p => p.category))]
    const blogCategoryPages = blogCategories.map((category) => ({
      url: `${baseUrl}/blog/category/${encodeURIComponent(category.toLowerCase())}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [
      ...staticPages,
      ...productPages,
      ...blogPages,
      ...recipePages,
      ...categoryPages,
      ...blogCategoryPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if dynamic content fails
    return staticPages
  }
}

// Additional sitemap for images (optional)
export function generateImageSitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tishyafoods.com'
  const currentDate = new Date().toISOString().split('T')[0]

  try {
    const products = getAllProducts()
    
    return products.flatMap((product) => 
      product.images?.map((image, index) => ({
        url: `${baseUrl}/images/products/${product.id}-${index + 1}.jpg`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })) || []
    )
  } catch (error) {
    console.error('Error generating image sitemap:', error)
    return []
  }
}