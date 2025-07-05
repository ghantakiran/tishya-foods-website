'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/product-card'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

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

  useEffect(() => {
    fetchRecommendations()
  }, [userId, currentProduct])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      
      // Simulate recommendation engine with mock data
      const mockRecommendations: Product[] = [
        {
          id: 'protein-bar-1',
          name: 'Natural Protein Bar',
          price: 45,
          image: '/products/protein-bar.jpg',
          category: 'protein-snacks',
          description: 'High-protein natural bar with nuts and seeds',
          rating: 4.8,
          nutritionInfo: { calories: 180, protein: 12, carbs: 15, fat: 8 }
        },
        {
          id: 'mixed-nuts-1',
          name: 'Premium Mixed Nuts',
          price: 299,
          image: '/products/mixed-nuts.jpg',
          category: 'natural-foods',
          description: 'Carefully selected and roasted mixed nuts',
          rating: 4.9,
          nutritionInfo: { calories: 150, protein: 5, carbs: 6, fat: 13 }
        },
        {
          id: 'protein-powder-1',
          name: 'Plant Protein Powder',
          price: 899,
          image: '/products/protein-powder.jpg',
          category: 'supplements',
          description: 'Pure plant-based protein powder',
          rating: 4.7,
          nutritionInfo: { calories: 120, protein: 25, carbs: 3, fat: 2 }
        },
        {
          id: 'health-snack-1',
          name: 'Savory Health Mix',
          price: 199,
          image: '/products/health-mix.jpg',
          category: 'savory-treats',
          description: 'Nutritious savory snack mix',
          rating: 4.6,
          nutritionInfo: { calories: 140, protein: 6, carbs: 18, fat: 7 }
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
            return product.nutritionInfo.protein > 10
          }
          if (userPreferences.dietary.includes('low-carb')) {
            return product.nutritionInfo.carbs < 10
          }
          return true
        })
      }

      // Sort by user interests
      if (userInterests.length > 0) {
        personalizedRecommendations.sort((a, b) => {
          const aScore = userInterests.filter((interest: string) => 
            a.name.toLowerCase().includes(interest) || 
            a.category.includes(interest)
          ).length
          const bScore = userInterests.filter((interest: string) => 
            b.name.toLowerCase().includes(interest) || 
            b.category.includes(interest)
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