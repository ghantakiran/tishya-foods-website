'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import Fuse from 'fuse.js'
import { Product, ProductFilters, SearchSuggestion } from '@/types/product'

// Mock product data - in real app, this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Protein Rich Quinoa Mix',
    description: 'High-protein quinoa blend with nuts and seeds, perfect for breakfast or snacks.',
    price: 299,
    originalPrice: 349,
    images: ['/images/products/quinoa-mix.jpg'],
    category: {
      id: '1',
      name: 'Protein Rich Natural Foods',
      slug: 'protein-natural-foods',
      description: 'Natural protein sources',
      image: '/images/categories/natural.jpg'
    },
    tags: ['high-protein', 'quinoa', 'breakfast', 'healthy'],
    ingredients: ['Quinoa', 'Almonds', 'Sunflower Seeds', 'Pumpkin Seeds'],
    nutritionalInfo: {
      servingSize: '30g',
      servingsPerContainer: 10,
      calories: 150,
      protein: 8,
      carbs: 20,
      fat: 5,
      fiber: 4,
      sugar: 2,
      sodium: 50,
      iron: 2,
      calcium: 40
    },
    allergens: ['nuts'],
    certifications: ['organic', 'non-gmo'],
    isGlutenFree: true,
    isVegan: true,
    isOrganic: true,
    isKeto: false,
    isDairy: false,
    stock: 25,
    featured: true,
    averageRating: 4.8,
    reviewCount: 124,
    preparationTime: '5 minutes',
    shelfLife: '12 months',
    storageInstructions: 'Store in cool, dry place',
    servingSuggestions: ['Mix with milk', 'Add to smoothies', 'Sprinkle on yogurt'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sweet Protein Balls',
    description: 'Delicious protein-packed energy balls made with dates and nuts.',
    price: 199,
    images: ['/images/products/protein-balls.jpg'],
    category: {
      id: '2',
      name: 'Sweet Protein Treats',
      slug: 'sweet-treats',
      description: 'Healthy sweet options',
      image: '/images/categories/sweet.jpg'
    },
    tags: ['sweet', 'energy-balls', 'snack', 'natural'],
    ingredients: ['Dates', 'Almonds', 'Cashews', 'Vanilla Extract'],
    nutritionalInfo: {
      servingSize: '25g',
      servingsPerContainer: 12,
      calories: 120,
      protein: 6,
      carbs: 15,
      fat: 4,
      fiber: 3,
      sugar: 12,
      sodium: 25,
      potassium: 150
    },
    allergens: ['nuts'],
    certifications: ['organic'],
    isGlutenFree: true,
    isVegan: true,
    isOrganic: true,
    isKeto: false,
    isDairy: false,
    stock: 40,
    featured: false,
    averageRating: 4.6,
    reviewCount: 89,
    preparationTime: 'Ready to eat',
    shelfLife: '6 months',
    storageInstructions: 'Refrigerate after opening',
    servingSuggestions: ['Pre-workout snack', 'Post-workout recovery', 'Healthy dessert'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    name: 'Savory Chickpea Crunch',
    description: 'Crunchy roasted chickpeas with herbs and spices for a protein-rich snack.',
    price: 149,
    images: ['/images/products/chickpea-crunch.jpg'],
    category: {
      id: '3',
      name: 'Savory Protein Treats',
      slug: 'savory-treats',
      description: 'Savory protein snacks',
      image: '/images/categories/savory.jpg'
    },
    tags: ['savory', 'chickpeas', 'crunchy', 'spiced'],
    ingredients: ['Chickpeas', 'Turmeric', 'Cumin', 'Sea Salt', 'Black Pepper'],
    nutritionalInfo: {
      servingSize: '30g',
      servingsPerContainer: 8,
      calories: 130,
      protein: 7,
      carbs: 18,
      fat: 3,
      fiber: 5,
      sugar: 3,
      sodium: 200,
      iron: 3,
    },
    allergens: [],
    certifications: ['gluten-free'],
    isGlutenFree: true,
    isVegan: true,
    isOrganic: false,
    isKeto: false,
    isDairy: false,
    stock: 30,
    featured: true,
    averageRating: 4.4,
    reviewCount: 67,
    preparationTime: 'Ready to eat',
    shelfLife: '8 months',
    storageInstructions: 'Store in airtight container',
    servingSuggestions: ['Office snack', 'Movie night', 'Trail mix addition'],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  }
]

export function useProductSearch() {
  const [products] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categories: [],
    priceRange: [0, 1000],
    nutritionalGoals: [],
    dietaryRestrictions: [],
    allergens: [],
    certifications: [],
    rating: 0,
    availability: 'all',
    sortBy: 'relevance'
  })

  const [debouncedSearch] = useDebounce(filters.search, 300)

  // Fuse.js configuration for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'description', weight: 2 },
        { name: 'tags', weight: 2 },
        { name: 'ingredients', weight: 1.5 },
        { name: 'category.name', weight: 1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    })
  }, [products])

  // Filter and search products
  useEffect(() => {
    setIsLoading(true)

    const filterProducts = () => {
      let result = [...products]

      // Text search
      if (debouncedSearch.trim()) {
        const fuseResults = fuse.search(debouncedSearch)
        result = fuseResults.map(result => result.item)
      }

      // Category filter
      if (filters.categories.length > 0) {
        result = result.filter(product => 
          filters.categories.includes(product.category.id) ||
          filters.categories.includes(product.category.slug)
        )
      }

      // Price range filter
      result = result.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      )

      // Dietary restrictions filter
      if (filters.dietaryRestrictions.length > 0) {
        result = result.filter(product => {
          return filters.dietaryRestrictions.every(restriction => {
            switch (restriction) {
              case 'vegan':
                return product.isVegan
              case 'gluten-free':
                return product.isGlutenFree
              case 'organic':
                return product.isOrganic
              case 'keto':
                return product.isKeto
              case 'dairy-free':
                return !product.isDairy
              default:
                return true
            }
          })
        })
      }

      // Allergen filter (exclude products with selected allergens)
      if (filters.allergens.length > 0) {
        result = result.filter(product => 
          !product.allergens.some(allergen => filters.allergens.includes(allergen))
        )
      }

      // Certifications filter
      if (filters.certifications.length > 0) {
        result = result.filter(product => 
          filters.certifications.some(cert => product.certifications.includes(cert))
        )
      }

      // Rating filter
      if (filters.rating > 0) {
        result = result.filter(product => product.averageRating >= filters.rating)
      }

      // Availability filter
      if (filters.availability === 'in-stock') {
        result = result.filter(product => product.stock > 0)
      } else if (filters.availability === 'out-of-stock') {
        result = result.filter(product => product.stock === 0)
      }

      // Nutritional goals filter
      if (filters.nutritionalGoals.length > 0) {
        result = result.filter(product => {
          return filters.nutritionalGoals.some(goal => {
            switch (goal) {
              case 'high-protein':
                return product.nutritionalInfo.protein >= 6
              case 'low-carb':
                return product.nutritionalInfo.carbs <= 10
              case 'high-fiber':
                return product.nutritionalInfo.fiber >= 4
              case 'low-sugar':
                return product.nutritionalInfo.sugar <= 5
              case 'weight-loss':
                return product.nutritionalInfo.calories <= 150
              case 'muscle-building':
                return product.nutritionalInfo.protein >= 8
              default:
                return true
            }
          })
        })
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          result.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          result.sort((a, b) => b.averageRating - a.averageRating)
          break
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'popularity':
          result.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        default: // relevance
          if (!debouncedSearch.trim()) {
            result.sort((a, b) => {
              // Featured first, then by rating
              if (a.featured && !b.featured) return -1
              if (!a.featured && b.featured) return 1
              return b.averageRating - a.averageRating
            })
          }
          break
      }

      return result
    }

    // Simulate API delay
    setTimeout(() => {
      setFilteredProducts(filterProducts())
      setIsLoading(false)
    }, 100)
  }, [products, filters, debouncedSearch, fuse])

  // Generate search suggestions
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      const searchSuggestions: SearchSuggestion[] = []

      // Product name suggestions
      const productMatches = fuse.search(debouncedSearch, { limit: 3 })
      productMatches.forEach(match => {
        searchSuggestions.push({
          type: 'product',
          value: match.item.id,
          label: match.item.name
        })
      })

      // Category suggestions
      const categoryMatches = products
        .filter(product => 
          product.category.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .slice(0, 2)
      
      categoryMatches.forEach(product => {
        if (!searchSuggestions.some(s => s.label === product.category.name)) {
          searchSuggestions.push({
            type: 'category',
            value: product.category.slug,
            label: product.category.name,
            count: products.filter(p => p.category.id === product.category.id).length
          })
        }
      })

      // Ingredient suggestions
      const ingredientMatches = products
        .flatMap(product => product.ingredients)
        .filter(ingredient => 
          ingredient.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .slice(0, 2)

      ingredientMatches.forEach(ingredient => {
        if (!searchSuggestions.some(s => s.label === ingredient)) {
          searchSuggestions.push({
            type: 'ingredient',
            value: ingredient.toLowerCase(),
            label: ingredient,
            count: products.filter(p => 
              p.ingredients.some(i => i.toLowerCase() === ingredient.toLowerCase())
            ).length
          })
        }
      })

      setSuggestions(searchSuggestions)
    } else {
      setSuggestions([])
    }
  }, [debouncedSearch, products, fuse])

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      priceRange: [0, 1000],
      nutritionalGoals: [],
      dietaryRestrictions: [],
      allergens: [],
      certifications: [],
      rating: 0,
      availability: 'all',
      sortBy: 'relevance'
    })
  }

  const searchByCategory = (categorySlug: string) => {
    updateFilters({ categories: [categorySlug], search: '' })
  }

  const searchByIngredient = (ingredient: string) => {
    updateFilters({ search: ingredient })
  }

  return {
    products: filteredProducts,
    isLoading,
    filters,
    suggestions,
    updateFilters,
    clearFilters,
    searchByCategory,
    searchByIngredient,
    totalProducts: products.length,
    filteredCount: filteredProducts.length
  }
}