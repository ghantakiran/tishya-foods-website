interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  updatedAt?: string
  author: string
  category: string
  tags: string[]
  image?: string
  readTime?: number
}

interface BlogStructuredDataProps {
  post: BlogPost
}

export function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `https://tishyafoods.com${post.image}` : 'https://tishyafoods.com/images/blog/default.jpg',
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://tishyafoods.com/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tishya Foods',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tishyafoods.com/images/logo.png'
      }
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tishyafoods.com/blog/${post.slug}`
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    wordCount: post.content.split(' ').length,
    timeRequired: post.readTime ? `PT${post.readTime}M` : undefined,
    about: {
      '@type': 'Thing',
      name: 'Nutrition and Health'
    },
    inLanguage: 'en-US'
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface RecipeStructuredDataProps {
  recipe: {
    name: string
    description: string
    image?: string
    prepTime: number
    cookTime: number
    totalTime: number
    servings: number
    difficulty: string
    cuisine?: string
    category: string
    ingredients: string[]
    instructions: string[]
    nutrition?: {
      calories?: number
      protein?: number
      carbs?: number
      fat?: number
      fiber?: number
    }
    author: string
    datePublished: string
  }
}

export function RecipeStructuredData({ recipe }: RecipeStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: recipe.image ? `https://tishyafoods.com${recipe.image}` : 'https://tishyafoods.com/images/recipes/default.jpg',
    author: {
      '@type': 'Person',
      name: recipe.author
    },
    datePublished: recipe.datePublished,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: recipe.servings,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine || 'International',
    difficulty: recipe.difficulty,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      name: `Step ${index + 1}`,
      text: instruction
    })),
    nutrition: recipe.nutrition ? {
      '@type': 'NutritionInformation',
      calories: recipe.nutrition.calories ? `${recipe.nutrition.calories} calories` : undefined,
      proteinContent: recipe.nutrition.protein ? `${recipe.nutrition.protein}g` : undefined,
      carbohydrateContent: recipe.nutrition.carbs ? `${recipe.nutrition.carbs}g` : undefined,
      fatContent: recipe.nutrition.fat ? `${recipe.nutrition.fat}g` : undefined,
      fiberContent: recipe.nutrition.fiber ? `${recipe.nutrition.fiber}g` : undefined
    } : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      ratingCount: 1
    },
    video: recipe.category === 'Video Recipes' ? {
      '@type': 'VideoObject',
      name: recipe.name,
      description: recipe.description,
      contentUrl: `https://tishyafoods.com/videos/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}.mp4`,
      embedUrl: `https://tishyafoods.com/embed/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}`,
      uploadDate: recipe.datePublished
    } : undefined
  }

  // Remove undefined properties
  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData) }}
    />
  )
}