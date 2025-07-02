export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  ingredients: string[]
  nutritionalInfo: NutritionalInfo
  isGlutenFree: boolean
  isVegan: boolean
  isOrganic: boolean
  stock: number
  featured: boolean
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
}

export interface NutritionalInfo {
  protein: number
  carbs: number
  fat: number
  fiber: number
  calories: number
  servingSize: string
}

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