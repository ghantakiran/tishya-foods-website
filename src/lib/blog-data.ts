export interface BlogPost {
  id: string
  slug: string
  title: string
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

// Mock blog data - replace with actual CMS data
export function getAllBlogPosts(): BlogPost[] {
  return [
    {
      id: '1',
      slug: 'benefits-of-sprouted-grains',
      title: 'The Amazing Benefits of Sprouted Grains',
      excerpt: 'Discover why sprouted grains are nutritional powerhouses and how they can transform your diet.',
      content: 'Full blog content here...',
      date: '2024-01-15',
      author: 'Tishya Foods Team',
      category: 'Nutrition',
      tags: ['sprouted grains', 'nutrition', 'health'],
      image: '/images/blog/sprouted-grains.jpg',
      readTime: 5
    },
    {
      id: '2',
      slug: 'protein-rich-breakfast-ideas',
      title: 'High-Protein Breakfast Ideas for Busy Mornings',
      excerpt: 'Start your day right with these quick and nutritious protein-packed breakfast recipes.',
      content: 'Full blog content here...',
      date: '2024-01-10',
      author: 'Nutrition Expert',
      category: 'Recipes',
      tags: ['breakfast', 'protein', 'recipes'],
      image: '/images/blog/protein-breakfast.jpg',
      readTime: 7
    }
  ]
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find(post => post.slug === slug)
}