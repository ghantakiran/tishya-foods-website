'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { Product } from '@/types/product'

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

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true)
      
      // Simulate recommendation engine with mock data
      const mockRecommendations: Product[] = [
        {
          id: 'protein-bar-1',
          name: 'Natural Protein Bar',
          description: 'High-protein natural bar with nuts and seeds',
          price: 45,
          images: ['/products/protein-bar.jpg'],
          category: {
            id: 'protein-snacks',
            name: 'Protein Snacks',
            slug: 'protein-snacks',
            description: 'Protein-rich snacks',
            image: '/categories/protein-snacks.jpg',
          },
          tags: ['high-protein', 'snack'],
          ingredients: ['Nuts', 'Seeds', 'Protein Blend'],
          nutritionalInfo: {
            servingSize: '40g',
            servingsPerContainer: 1,
            calories: 180,
            protein: 12,
            carbs: 15,
            fat: 8,
            fiber: 2,
            sugar: 5,
            sodium: 50,
          },
          allergens: ['nuts'],
          certifications: ['ISO'],
          isGlutenFree: true,
          isVegan: false,
          isOrganic: false,
          isKeto: false,
          isDairy: false,
          stock: 20,
          featured: false,
          averageRating: 4.8,
          reviewCount: 12,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
        },
        {
          id: 'mixed-nuts-1',
          name: 'Premium Mixed Nuts',
          description: 'Carefully selected and roasted mixed nuts',
          price: 299,
          images: ['/products/mixed-nuts.jpg'],
          category: {
            id: 'natural-foods',
            name: 'Natural Foods',
            slug: 'natural-foods',
            description: 'Natural and organic food products',
            image: '/categories/natural-foods.jpg',
          },
          tags: ['natural', 'nuts'],
          ingredients: ['Nuts'],
          nutritionalInfo: {
            servingSize: '100g',
            servingsPerContainer: 1,
            calories: 150,
            protein: 5,
            carbs: 6,
            fat: 13,
            fiber: 3,
            sugar: 2,
            sodium: 50,
          },
          allergens: ['nuts'],
          certifications: ['Organic'],
          isGlutenFree: true,
          isVegan: true,
          isOrganic: true,
          isKeto: false,
          isDairy: false,
          stock: 15,
          featured: true,
          averageRating: 4.9,
          reviewCount: 10,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-09T00:00:00Z',
        },
        {
          id: 'protein-powder-1',
          name: 'Plant Protein Powder',
          description: 'Pure plant-based protein powder',
          price: 899,
          images: ['/products/protein-powder.jpg'],
          category: {
            id: 'supplements',
            name: 'Supplements',
            slug: 'supplements',
            description: 'Health and wellness supplements',
            image: '/categories/supplements.jpg',
          },
          tags: ['plant-based', 'protein'],
          ingredients: ['Pea Protein', 'Soy Protein', 'Brown Rice Protein'],
          nutritionalInfo: {
            servingSize: '30g',
            servingsPerContainer: 1,
            calories: 120,
            protein: 25,
            carbs: 3,
            fat: 2,
            fiber: 1,
            sugar: 1,
            sodium: 100,
          },
          allergens: ['pea', 'soy'],
          certifications: ['Non-GMO'],
          isGlutenFree: true,
          isVegan: true,
          isOrganic: true,
          isKeto: true,
          isDairy: false,
          stock: 10,
          featured: false,
          averageRating: 4.7,
          reviewCount: 8,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-08T00:00:00Z',
        },
        {
          id: 'health-snack-1',
          name: 'Savory Health Mix',
          description: 'Nutritious savory snack mix',
          price: 199,
          images: ['/products/health-mix.jpg'],
          category: {
            id: 'savory-treats',
            name: 'Savory Treats',
            slug: 'savory-treats',
            description: 'Savory and savory snack foods',
            image: '/categories/savory-treats.jpg',
          },
          tags: ['healthy', 'snack'],
          ingredients: ['Mixed Nuts', 'Dried Fruit', 'Honey'],
          nutritionalInfo: {
            servingSize: '20g',
            servingsPerContainer: 1,
            calories: 140,
            protein: 6,
            carbs: 18,
            fat: 7,
            fiber: 2,
            sugar: 10,
            sodium: 100,
          },
          allergens: ['nuts'],
          certifications: ['Non-GMO'],
          isGlutenFree: true,
          isVegan: true,
          isOrganic: true,
          isKeto: false,
          isDairy: false,
          stock: 10,
          featured: false,
          averageRating: 4.6,
          reviewCount: 6,
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-07T00:00:00Z',
        }
      ]

      // Apply personalization logic
      let personalizedRecommendations = [...mockRecommendations]

      // Get user preferences from localStorage
      const userPreferences = JSON.parse(localStorage.getItem('user_preferences') || '{}')
      const userInterests = JSON.parse(localStorage.getItem('user_interests') || '[]')
      const browsingHistory = JSON.parse(localStorage.getItem('browsing_history') || '[]')

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
  }, [userId, currentProduct, maxRecommendations])

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