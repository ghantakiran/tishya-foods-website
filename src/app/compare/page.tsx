'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Scale, 
  TrendingUp, 
  Zap, 
  Heart, 
  Award,
  ArrowRight,
  CheckCircle,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductComparisonContainer } from '@/components/product/product-comparison'

const benefits = [
  {
    icon: Scale,
    title: 'Side-by-Side Analysis',
    description: 'Compare nutrition facts, ingredients, and benefits in a clear table format'
  },
  {
    icon: TrendingUp,
    title: 'Smart Highlighting',
    description: 'Automatically highlights the best values for each nutritional metric'
  },
  {
    icon: Target,
    title: 'Value Assessment',
    description: 'Find the best protein-to-price ratio and overall value for your goals'
  },
  {
    icon: CheckCircle,
    title: 'Certification Check',
    description: 'Compare organic, vegan, and other certifications across products'
  }
]

const comparisonTips = [
  {
    title: 'Protein Content',
    description: 'Look for products with higher protein per serving to support muscle growth and satiety',
    icon: '💪'
  },
  {
    title: 'Ingredient Quality',
    description: 'Choose products with natural, recognizable ingredients and minimal processing',
    icon: '🌱'
  },
  {
    title: 'Certifications',
    description: 'Consider organic, non-GMO, and other certifications that align with your values',
    icon: '✅'
  },
  {
    title: 'Value for Money',
    description: 'Compare protein per rupee to find the best value for your budget',
    icon: '💰'
  }
]

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-earth-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-12 w-12 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Product Comparison
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              Make informed decisions with our comprehensive product comparison tool. 
              Compare nutrition, ingredients, and value across our protein-rich product range.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="text-sm px-3 py-1 bg-white/20 text-white border-white/30">
                Nutrition Analysis
              </Badge>
              <Badge className="text-sm px-3 py-1 bg-white/20 text-white border-white/30">
                Smart Highlighting
              </Badge>
              <Badge className="text-sm px-3 py-1 bg-white/20 text-white border-white/30">
                Value Assessment
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cream-100 mb-4">
              Why Compare Products?
            </h2>
            <p className="text-lg text-earth-600 max-w-2xl mx-auto">
              Our comparison tool helps you make data-driven decisions to find the perfect products for your health and fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-cream-100 mb-2">{benefit.title}</h3>
                <p className="text-earth-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="mb-16">
          <div className="bg-earth-800 rounded-lg p-8 border">
            <h3 className="text-2xl font-bold text-cream-100 mb-6 text-center">
              Smart Comparison Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisonTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 bg-earth-800 rounded-lg p-4 shadow-sm"
                >
                  <div className="text-2xl">{tip.icon}</div>
                  <div>
                    <h4 className="font-semibold text-cream-100 mb-1">{tip.title}</h4>
                    <p className="text-sm text-earth-600">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-cream-100 mb-4">
              How Product Comparison Works
            </h3>
            <p className="text-lg text-earth-600">
              Follow these simple steps to compare products effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-cream-100 mb-2">Select Products</h4>
              <p className="text-earth-600">
                Choose up to 4 products from our range to compare side by side
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-cream-100 mb-2">Analyze Data</h4>
              <p className="text-earth-600">
                Review nutrition facts, ingredients, benefits, and certifications
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-cream-100 mb-2">Make Decision</h4>
              <p className="text-earth-600">
                Use highlighted best values and summaries to choose the right product
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Explanation */}
        <div className="mb-16">
          <div className="bg-earth-800 rounded-lg shadow-sm border p-8">
            <h3 className="text-2xl font-bold text-cream-100 mb-6">
              Understanding Key Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-cream-100">Protein Content</h4>
                </div>
                <p className="text-sm text-earth-600">
                  Higher protein content supports muscle growth, recovery, and satiety. 
                  Look for products with 6g+ protein per serving.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-cream-100">Calories</h4>
                </div>
                <p className="text-sm text-earth-600">
                  Consider your caloric goals. Lower calories for weight loss, 
                  moderate for maintenance, higher for muscle gain.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-cream-100">Fiber Content</h4>
                </div>
                <p className="text-sm text-earth-600">
                  Higher fiber aids digestion, promotes satiety, and supports 
                  heart health. Aim for 3g+ per serving.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-cream-100">Certifications</h4>
                </div>
                <p className="text-sm text-earth-600">
                  Organic, Non-GMO, and other certifications indicate quality 
                  standards and production methods.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Scale className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-semibold text-cream-100">Value Ratio</h4>
                </div>
                <p className="text-sm text-earth-600">
                  Compare protein per rupee to find the best value for your budget 
                  without compromising quality.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-cream-100">Sugar Content</h4>
                </div>
                <p className="text-sm text-earth-600">
                  Lower sugar content is generally better for blood sugar control 
                  and overall health. Natural sugars are preferred.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Comparison Tool */}
        <div className="bg-earth-800 rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-earth-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cream-100">Interactive Product Comparison</h2>
                <p className="text-earth-600">Select products below to start comparing</p>
              </div>
              <Badge variant="outline" className="text-sm">
                Compare up to 4 products
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            <ProductComparisonContainer />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-earth-800 rounded-lg p-8 border">
            <h3 className="text-2xl font-bold text-cream-100 mb-4">
              Found Your Perfect Products?
            </h3>
            <p className="text-lg text-earth-600 mb-6 max-w-2xl mx-auto">
              Use our comparison insights to make the best choice for your health goals. 
              All our products are crafted with premium ingredients for optimal nutrition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Shop All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn About Nutrition
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}