export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  productId?: string
  verified: boolean
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  image: string
  slug: string
}