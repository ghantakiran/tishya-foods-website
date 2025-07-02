export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: ProductCategory
  tags: string[]
  ingredients: string[]
  nutritionalInfo: NutritionalInfo
  allergens: string[]
  certifications: string[]
  isGlutenFree: boolean
  isVegan: boolean
  isOrganic: boolean
  isKeto: boolean
  isDairy: boolean
  stock: number
  featured: boolean
  averageRating: number
  reviewCount: number
  variants?: ProductVariant[]
  preparationTime?: string
  shelfLife?: string
  storageInstructions?: string
  servingSuggestions?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId?: string
  children?: ProductCategory[]
}

export interface NutritionalInfo {
  servingSize: string
  servingsPerContainer: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  vitaminC?: number
  iron?: number
  calcium?: number
  potassium?: number
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
  stock: number
  image?: string
}

export interface ProductFilters {
  search: string
  categories: string[]
  priceRange: [number, number]
  nutritionalGoals: string[]
  dietaryRestrictions: string[]
  allergens: string[]
  certifications: string[]
  rating: number
  availability: 'all' | 'in-stock' | 'out-of-stock'
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity'
  preparationTime?: string
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'ingredient' | 'nutrition'
  value: string
  label: string
  count?: number
}