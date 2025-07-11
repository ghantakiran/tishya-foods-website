'use client'

import { motion } from 'framer-motion'
import { 
  Scale, 
  TrendingUp, 
  Zap, 
  Heart, 
  Award,
  ArrowRight,
  CheckCircle,
  Target,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    title: 'Personalized Recommendations',
    description: 'Get suggestions based on your dietary preferences and health goals'
  },
  {
    icon: Heart,
    title: 'Health Impact Analysis',
    description: 'Understand how each product fits into your wellness journey'
  }
]

// Mock comparison data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Mixed Nuts',
    price: 299,
    image: '/products/mixed-nuts.jpg',
    category: 'Natural Foods',
    nutritionalInfo: {
      protein: 15,
      calories: 250,
      carbs: 8,
      fat: 20,
      fiber: 5
    },
    rating: 4.8
  },
  {
    id: '2',
    name: 'Natural Protein Bar',
    price: 45,
    image: '/products/protein-bar.jpg',
    category: 'Protein Snacks',
    nutritionalInfo: {
      protein: 12,
      calories: 180,
      carbs: 15,
      fat: 8,
      fiber: 2
    },
    rating: 4.6
  }
]

export default function ComparePage() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Scale className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Product Comparison
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Make informed decisions with our advanced comparison tool. 
                Analyze nutrition facts, ingredients, and benefits side by side.
              </p>
            </motion.div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sample Comparison */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Sample Product Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300">Feature</th>
                      {mockProducts.map((product) => (
                        <th key={product.id} className="text-center py-3 px-4 text-white">
                          <div className="space-y-2">
                            <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto flex items-center justify-center">
                              <Award className="h-8 w-8 text-gray-500" />
                            </div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-blue-400 font-bold">₹{product.price}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4 text-gray-300">Protein (g)</td>
                      {mockProducts.map((product) => (
                        <td key={product.id} className="text-center py-3 px-4 text-white">
                          {product.nutritionalInfo.protein}g
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4 text-gray-300">Calories</td>
                      {mockProducts.map((product) => (
                        <td key={product.id} className="text-center py-3 px-4 text-white">
                          {product.nutritionalInfo.calories}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4 text-gray-300">Rating</td>
                      {mockProducts.map((product) => (
                        <td key={product.id} className="text-center py-3 px-4 text-white">
                          ⭐ {product.rating}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-300">Action</td>
                      {mockProducts.map((product) => (
                        <td key={product.id} className="text-center py-3 px-4">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Add to Cart
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                <Plus className="mr-2 h-5 w-5" />
                Start Comparing Products
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}