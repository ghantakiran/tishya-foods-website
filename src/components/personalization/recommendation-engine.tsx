'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/product-card'
import type { Product, ProductCategory } from '@/types/product'

interface RecommendationEngineProps {
  userId?: string
  currentProduct?: string
  maxRecommendations?: number
  className?: string
}

export function RecommendationEngine({ 
  userId, 
  currentProduct, 
  maxRecommendations = 4,
  className = ""
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      
      // Define mock ProductCategory objects
      const proteinSnacksCategory: ProductCategory = {
        id: 'protein-snacks',
        name: 'Protein Snacks',
        slug: 'protein-snacks',
        description: 'High-protein snacks for fitness and health',
        image: '/images/categories/protein-snacks.png',
      }
      const nutsCategory: ProductCategory = {
        id: 'nuts',
        name: 'Nuts',
        slug: 'nuts',
        description: 'Healthy nuts and seeds',
        image: '/images/categories/nuts.png',
      }
      const supplementsCategory: ProductCategory = {
        id: 'supplements',
        name: 'Supplements',
        slug: 'supplements',
        description: 'Supplements for nutrition and wellness',
        image: '/images/categories/supplements.png',
      }
      const savorySnacksCategory: ProductCategory = {
        id: 'savory-snacks',
        name: 'Savory Snacks',
        slug: 'savory-snacks',
        description: 'Savory and nutritious snack mixes',
        image: '/images/categories/savory-snacks.png',
      }

      // Update mock products to use ProductCategory and full NutritionalInfo
      const mockProducts: Product[] = [
        {
          id: 'prod-1',
          name: 'Protein Bar',
          description: 'High-protein natural bar with nuts and seeds',
          price: 199,
          originalPrice: 249,
          images: ['/images/products/protein-bar.png'],
          category: proteinSnacksCategory,
          tags: ['protein', 'snack', 'healthy'],
          ingredients: ['Nuts', 'Seeds', 'Honey'],
          nutritionalInfo: {
            servingSize: '1 bar',
            servingsPerContainer: 1,
            calories: 180,
            protein: 12,
            carbs: 15,
            fat: 8,
            fiber: 5,
            sugar: 6,
            sodium: 80,
          },
          allergens: ['nuts'],
          certifications: ['gluten-free'],
          isGlutenFree: true,
          isVegan: false,
          isOrganic: true,
          isKeto: false,
          isDairy: false,
          stock: 100,
          featured: true,
          averageRating: 4.8,
          reviewCount: 120,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'prod-2',
          name: 'Roasted Mixed Nuts',
          description: 'Carefully selected and roasted mixed nuts',
          price: 299,
          originalPrice: 349,
          images: ['/images/products/roasted-nuts.png'],
          category: nutsCategory,
          tags: ['nuts', 'snack', 'healthy'],
          ingredients: ['Almonds', 'Cashews', 'Pistachios'],
          nutritionalInfo: {
            servingSize: '30g',
            servingsPerContainer: 10,
            calories: 150,
            protein: 5,
            carbs: 6,
            fat: 13,
            fiber: 3,
            sugar: 2,
            sodium: 50,
          },
          allergens: ['nuts'],
          certifications: ['organic'],
          isGlutenFree: true,
          isVegan: true,
          isOrganic: true,
          isKeto: true,
          isDairy: false,
          stock: 80,
          featured: false,
          averageRating: 4.9,
          reviewCount: 90,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'prod-3',
          name: 'Plant Protein Powder',
          description: 'Pure plant-based protein powder',
          price: 499,
          originalPrice: 599,
          images: ['/images/products/plant-protein.png'],
          category: supplementsCategory,
          tags: ['protein', 'supplement', 'vegan'],
          ingredients: ['Pea Protein', 'Brown Rice Protein'],
          nutritionalInfo: {
            servingSize: '30g',
            servingsPerContainer: 20,
            calories: 120,
            protein: 25,
            carbs: 3,
            fat: 2,
            fiber: 2,
            sugar: 1,
            sodium: 40,
          },
          allergens: [],
          certifications: ['vegan'],
          isGlutenFree: true,
          isVegan: true,
          isOrganic: false,
          isKeto: true,
          isDairy: false,
          stock: 60,
          featured: true,
          averageRating: 4.7,
          reviewCount: 75,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'prod-4',
          name: 'Savory Snack Mix',
          description: 'Nutritious savory snack mix',
          price: 149,
          originalPrice: 199,
          images: ['/images/products/savory-mix.png'],
          category: savorySnacksCategory,
          tags: ['snack', 'savory', 'mix'],
          ingredients: ['Chickpeas', 'Spices', 'Lentils'],
          nutritionalInfo: {
            servingSize: '25g',
            servingsPerContainer: 8,
            calories: 140,
            protein: 6,
            carbs: 18,
            fat: 7,
            fiber: 2,
            sugar: 1,
            sodium: 60,
          },
          allergens: [],
          certifications: ['gluten-free'],
          isGlutenFree: true,
          isVegan: true,
          isOrganic: false,
          isKeto: false,
          isDairy: false,
          stock: 120,
          featured: false,
          averageRating: 4.6,
          reviewCount: 60,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ]

      // Apply personalization logic
      let personalizedRecommendations = [...mockProducts]

      // Get user preferences from localStorage
      const userPreferences = JSON.parse(localStorage.getItem('user_preferences') || '{}')
      const userInterests = JSON.parse(localStorage.getItem('user_interests') || '[]')

      // Filter based on dietary preferences
      if (userPreferences.dietary) {
        personalizedRecommendations = personalizedRecommendations.filter(product => {
          if (userPreferences.dietary.includes('high-protein')) {
            return product.nutritionalInfo.protein > 10
          }
          if (userPreferences.dietary.includes('low-carb')) {
            return product.nutritionalInfo.carbs < 10
          }
          return true
        })
      }

      // Sort by user interests
      if (userInterests.length > 0) {
        personalizedRecommendations.sort((a, b) => {
          const aScore = userInterests.filter((interest: string) => 
            a.name.toLowerCase().includes(interest) || 
            a.category.name.includes(interest)
          ).length
          const bScore = userInterests.filter((interest: string) => 
            b.name.toLowerCase().includes(interest) || 
            b.category.name.includes(interest)
          ).length
          return bScore - aScore
        })
      }

      // Limit to max recommendations
      personalizedRecommendations = personalizedRecommendations.slice(0, maxRecommendations)

      setRecommendations(personalizedRecommendations)
      
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  if (loading) {
    return (
      <div className={`${className}`} data-testid="recommendations-loading">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg h-48 mb-4"></div>
              <div className="bg-gray-700 rounded h-4 mb-2"></div>
              <div className="bg-gray-700 rounded h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`} data-testid="no-recommendations">
        <p className="text-gray-400">No recommendations available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={className} data-testid="recommendations">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">
          Recommended for You
        </h3>
        <p className="text-gray-400 text-sm">
          Based on your preferences and browsing history
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            data-testid="recommended-product"
          />
        ))}
      </div>
    </div>
  )
}

export default RecommendationEngine