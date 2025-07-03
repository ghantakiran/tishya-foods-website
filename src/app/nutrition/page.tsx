'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Calendar, 
  BarChart3, 
  Target,
  Sparkles,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NutritionAssistant } from '@/components/nutrition/nutrition-assistant'
import { MealPlanner } from '@/components/nutrition/meal-planner'
import { NutritionTracker } from '@/components/nutrition/nutrition-tracker'

type TabType = 'assistant' | 'tracker' | 'planner'

const tabs = [
  {
    id: 'assistant' as TabType,
    label: 'AI Assistant',
    icon: Bot,
    description: 'Get personalized nutrition advice',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'tracker' as TabType,
    label: 'Nutrition Tracker',
    icon: BarChart3,
    description: 'Track daily intake and goals',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'planner' as TabType,
    label: 'Meal Planner',
    icon: Calendar,
    description: 'Plan meals with our products',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
]

const benefits = [
  {
    icon: Target,
    title: 'Personalized Goals',
    description: 'Set and track nutrition goals based on your lifestyle and health objectives'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations tailored to your dietary preferences'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your nutrition journey with detailed analytics and trends'
  },
  {
    icon: Heart,
    title: 'Health Optimization',
    description: 'Optimize your health with science-backed nutrition guidance'
  }
]

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('assistant')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'assistant':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-cream-100 mb-2">AI Nutrition Assistant</h2>
              <p className="text-earth-600 max-w-2xl mx-auto">
                Chat with our intelligent nutrition assistant to get personalized advice, meal suggestions, 
                and answers to your health questions using Tishya Foods products.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
              <div className="text-center">
                <p className="text-lg text-earth-700 mb-4">
                  Ready to start your nutrition journey? Our AI assistant is available 24/7 to help you make informed decisions.
                </p>
                <p className="text-sm text-earth-600">
                  Look for the chat icon in the bottom-right corner to begin your conversation.
                </p>
              </div>
            </div>
          </div>
        )
      
      case 'tracker':
        return <NutritionTracker />
      
      case 'planner':
        return <MealPlanner />
      
      default:
        return null
    }
  }

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
              <Zap className="h-12 w-12 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Nutrition Hub
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your complete nutrition companion powered by AI. Track, plan, and optimize your health 
              with personalized guidance and Tishya Foods' protein-rich products.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Personalized Plans
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Real-time Tracking
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cream-100 mb-4">
            Why Choose Our Nutrition Hub?
          </h2>
          <p className="text-lg text-earth-600 max-w-2xl mx-auto">
            Experience the future of nutrition with our comprehensive suite of tools designed to help you achieve your health goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

        {/* Tab Navigation */}
        <div className="bg-earth-800 rounded-lg shadow-sm border overflow-hidden">
          <div className="border-b">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-left transition-colors ${
                    activeTab === tab.id
                      ? `${tab.bgColor} ${tab.color} border-b-2 border-current`
                      : 'text-earth-600 hover:text-cream-100 hover:bg-earth-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? tab.color : 'text-earth-400'}`} />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-sm text-earth-500">{tab.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-cream-100 mb-4">
              Ready to Transform Your Nutrition?
            </h3>
            <p className="text-lg text-earth-600 mb-6 max-w-2xl mx-auto">
              Start your journey today with our comprehensive nutrition tools and high-quality protein products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Shop Protein Products
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn More About Nutrition
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Component - Always available */}
      <NutritionAssistant />
    </div>
  )
}