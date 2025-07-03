'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Target, Zap, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products } from '@/lib/products-data'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface RecommendationEngine {
  goal: string
  age: string
  activityLevel: string
  dietaryRestrictions: string[]
  preferredMealTimes: string[]
}

interface Recommendation {
  product: Product
  reason: string
  matchScore: number
  benefits: string[]
}

const goals = [
  { id: 'weight-loss', label: 'Weight Management', icon: Target },
  { id: 'muscle-building', label: 'Muscle Building', icon: Zap },
  { id: 'general-health', label: 'General Health', icon: Heart },
  { id: 'energy-boost', label: 'Energy Boost', icon: Sparkles },
]

const ageGroups = [
  { id: 'young-adult', label: '18-30 years' },
  { id: 'adult', label: '31-50 years' },
  { id: 'senior', label: '50+ years' },
]

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary (desk job)' },
  { id: 'light', label: 'Lightly Active' },
  { id: 'moderate', label: 'Moderately Active' },
  { id: 'very-active', label: 'Very Active' },
]

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'organic-only', label: 'Organic Only' },
]

const mealTimes = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'post-workout', label: 'Post-Workout' },
]

export default function ProductRecommendations() {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState<RecommendationEngine>({
    goal: '',
    age: '',
    activityLevel: '',
    dietaryRestrictions: [],
    preferredMealTimes: [],
  })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecommendations = (): Recommendation[] => {
    const scored: Recommendation[] = []

    products.forEach(product => {
      let score = 0
      const benefits: string[] = []
      let reason = ''

      // Goal-based scoring
      switch (preferences.goal) {
        case 'weight-loss':
          if (product.nutritionalInfo.calories < 200) score += 30
          if (product.nutritionalInfo.protein > 15) score += 25
          reason = 'High protein, moderate calories - perfect for weight management'
          benefits.push('Supports satiety and muscle maintenance')
          break
        case 'muscle-building':
          if (product.nutritionalInfo.protein > 20) score += 40
          if (product.nutritionalInfo.calories > 200) score += 20
          reason = 'High protein content supports muscle growth and recovery'
          benefits.push('Optimizes muscle protein synthesis')
          break
        case 'general-health':
          if (product.isOrganic) score += 20
          if (product.nutritionalInfo.fiber > 3) score += 15
          reason = 'Well-balanced nutrition for overall health and vitality'
          benefits.push('Supports digestive health and nutrient absorption')
          break
        case 'energy-boost':
          if (product.nutritionalInfo.carbs > 20) score += 25
          if (product.nutritionalInfo.protein > 10) score += 20
          reason = 'Balanced carbs and protein for sustained energy'
          benefits.push('Provides long-lasting energy without crashes')
          break
      }

      // Activity level adjustments
      switch (preferences.activityLevel) {
        case 'very-active':
          if (product.nutritionalInfo.protein > 20) score += 15
          if (product.nutritionalInfo.calories > 250) score += 10
          break
        case 'sedentary':
          if (product.nutritionalInfo.calories < 180) score += 15
          break
      }

      // Dietary restrictions
      preferences.dietaryRestrictions.forEach(restriction => {
        switch (restriction) {
          case 'vegan':
            if (product.isVegan) score += 20
            else score -= 30
            break
          case 'gluten-free':
            if (product.isGlutenFree) score += 20
            break
          case 'organic-only':
            if (product.isOrganic) score += 20
            else score -= 20
            break
        }
      })

      // Meal time preferences
      preferences.preferredMealTimes.forEach(mealTime => {
        switch (mealTime) {
          case 'breakfast':
            if (product.category.slug === 'natural-foods') score += 15
            break
          case 'snacks':
            if (product.category.slug === 'sweet-treats' || product.category.slug === 'savory-treats') score += 15
            break
          case 'post-workout':
            if (product.nutritionalInfo.protein > 15) score += 20
            break
        }
      })

      // Age-based adjustments
      switch (preferences.age) {
        case 'senior':
          if (product.nutritionalInfo.fiber > 4) score += 10
          benefits.push('Supports digestive health')
          break
        case 'young-adult':
          if (product.nutritionalInfo.protein > 15) score += 10
          break
      }

      // Additional benefits based on product properties
      if (product.isGlutenFree) benefits.push('Gluten-free and gentle on digestion')
      if (product.isVegan) benefits.push('Plant-based and environmentally friendly')
      if (product.isOrganic) benefits.push('Organic and free from harmful chemicals')

      if (score > 20) { // Only include products with decent match
        scored.push({
          product,
          reason,
          matchScore: Math.min(score, 100),
          benefits: benefits.slice(0, 3), // Limit to 3 benefits
        })
      }
    })

    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4) // Top 4 recommendations
  }

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newRecommendations = generateRecommendations()
    setRecommendations(newRecommendations)
    setIsGenerating(false)
    setStep(6)
  }

  const updatePreferences = (key: keyof RecommendationEngine, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayValue = (key: 'dietaryRestrictions' | 'preferredMealTimes', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const resetRecommendations = () => {
    setStep(1)
    setPreferences({
      goal: '',
      age: '',
      activityLevel: '',
      dietaryRestrictions: [],
      preferredMealTimes: [],
    })
    setRecommendations([])
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">What&apos;s your primary health goal?</h3>
              <p className="text-earth-600">This helps us recommend the best products for you</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <motion.button
                  key={goal.id}
                  onClick={() => updatePreferences('goal', goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    preferences.goal === goal.id
                      ? 'border-earth-800 bg-earth-50'
                      : 'border-earth-600 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <goal.icon className={`h-8 w-8 mx-auto mb-2 ${
                    preferences.goal === goal.id ? 'text-earth-800' : 'text-earth-600'
                  }`} />
                  <div className="font-semibold text-earth-800">{goal.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">What&apos;s your age group?</h3>
              <p className="text-earth-600">Age helps us tailor nutritional recommendations</p>
            </div>
            
            <div className="space-y-3">
              {ageGroups.map((age) => (
                <motion.button
                  key={age.id}
                  onClick={() => updatePreferences('age', age.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.age === age.id
                      ? 'border-earth-800 bg-earth-50'
                      : 'border-earth-600 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold text-earth-800">{age.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">How active are you?</h3>
              <p className="text-earth-600">Activity level affects your nutritional needs</p>
            </div>
            
            <div className="space-y-3">
              {activityLevels.map((level) => (
                <motion.button
                  key={level.id}
                  onClick={() => updatePreferences('activityLevel', level.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.activityLevel === level.id
                      ? 'border-earth-800 bg-earth-50'
                      : 'border-earth-600 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold text-earth-800">{level.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">Any dietary preferences?</h3>
              <p className="text-earth-600">Select all that apply (optional)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => toggleArrayValue('dietaryRestrictions', option.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    preferences.dietaryRestrictions.includes(option.id)
                      ? 'border-earth-800 bg-earth-50'
                      : 'border-earth-600 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold text-earth-800 text-sm">{option.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">When do you usually eat?</h3>
              <p className="text-earth-600">Select your preferred meal times</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {mealTimes.map((time) => (
                <motion.button
                  key={time.id}
                  onClick={() => toggleArrayValue('preferredMealTimes', time.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    preferences.preferredMealTimes.includes(time.id)
                      ? 'border-earth-800 bg-earth-50'
                      : 'border-earth-600 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold text-earth-800 text-sm">{time.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">Your Personalized Recommendations</h3>
              <p className="text-earth-600">Based on your preferences, here are the best Tishya Foods products for you</p>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.product.id}
                  className="bg-earth-800 rounded-xl p-6 border border-earth-600 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-bold text-earth-800">{rec.product.name}</h4>
                        <div className="ml-2 bg-earth-800 text-white text-xs px-2 py-1 rounded-full">
                          {rec.matchScore}% match
                        </div>
                      </div>
                      <p className="text-earth-600 text-sm mb-3">{rec.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-earth-800">{formatPrice(rec.product.price)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-primary-50 rounded-lg p-2">
                      <div className="font-bold text-earth-800">{rec.product.nutritionalInfo.calories}</div>
                      <div className="text-xs text-earth-600">Calories</div>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-2">
                      <div className="font-bold text-earth-800">{rec.product.nutritionalInfo.protein}g</div>
                      <div className="text-xs text-earth-600">Protein</div>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-2">
                      <div className="font-bold text-earth-800">{rec.product.nutritionalInfo.fiber}g</div>
                      <div className="text-xs text-earth-600">Fiber</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-earth-800 mb-2">Why this is perfect for you:</p>
                    <ul className="space-y-1">
                      {rec.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-earth-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">Add to Cart</Button>
                </motion.div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Button variant="outline" onClick={resetRecommendations}>
                Get New Recommendations
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-earth-800 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
      {/* Header with AI branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-earth-800 to-primary-600 text-white px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">AI-Powered Recommendations</span>
        </div>
      </div>

      {/* Progress bar */}
      {step < 6 && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-earth-600 mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% complete</span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2">
            <motion.div
              className="bg-earth-800 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Loading state */}
      {isGenerating ? (
        <div className="text-center py-12">
          <motion.div
            className="w-16 h-16 bg-earth-800 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-earth-800 mb-2">Analyzing Your Preferences</h3>
          <p className="text-earth-600">Our AI is finding the perfect products for you...</p>
        </div>
      ) : (
        <>
          {renderStep()}
          
          {/* Navigation */}
          {step < 6 && !isGenerating && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (step === 5) {
                    handleGenerateRecommendations()
                  } else {
                    setStep(step + 1)
                  }
                }}
                disabled={
                  (step === 1 && !preferences.goal) ||
                  (step === 2 && !preferences.age) ||
                  (step === 3 && !preferences.activityLevel)
                }
              >
                {step === 5 ? 'Get My Recommendations' : 'Next'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}