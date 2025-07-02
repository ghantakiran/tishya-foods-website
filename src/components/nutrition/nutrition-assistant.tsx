'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Heart,
  Target,
  Zap,
  ChefHat,
  Scale,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  nutritionData?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: 'meal-plan',
    label: 'Meal Plan',
    icon: ChefHat,
    prompt: 'Create a personalized meal plan for me',
    color: 'bg-orange-500'
  },
  {
    id: 'protein-goal',
    label: 'Protein Goal',
    icon: Target,
    prompt: 'Help me reach my daily protein target',
    color: 'bg-blue-500'
  },
  {
    id: 'weight-loss',
    label: 'Weight Loss',
    icon: Scale,
    prompt: 'Suggest foods for healthy weight loss',
    color: 'bg-green-500'
  },
  {
    id: 'energy-boost',
    label: 'Energy Boost',
    icon: Zap,
    prompt: 'What foods can boost my energy naturally?',
    color: 'bg-yellow-500'
  },
  {
    id: 'workout-nutrition',
    label: 'Pre/Post Workout',
    icon: Activity,
    prompt: 'What should I eat before and after workouts?',
    color: 'bg-purple-500'
  },
  {
    id: 'heart-health',
    label: 'Heart Health',
    icon: Heart,
    prompt: 'Recommend heart-healthy foods from your menu',
    color: 'bg-red-500'
  }
]

const sampleResponses = {
  'meal-plan': {
    content: "I'd be happy to create a personalized meal plan! Based on Tishya Foods' protein-rich offerings, here's a balanced daily plan:\n\n🌅 **Breakfast**: Protein Rich Quinoa Mix (8g protein) with fruits\n🥗 **Lunch**: Nutty Granola Bowl with Greek yogurt\n🍽️ **Dinner**: Sweet Protein Balls as dessert (6g protein)\n\nThis provides sustained energy and meets your daily protein needs. Would you like me to adjust this based on your specific goals?",
    nutritionData: { calories: 1850, protein: 85, carbs: 220, fat: 65, fiber: 35 }
  },
  'protein-goal': {
    content: "Great question! For optimal protein intake, I recommend:\n\n💪 **Daily Target**: 0.8-1g per kg of body weight\n🥜 **Tishya Favorites**: \n- Protein Rich Quinoa Mix (8g per serving)\n- Sweet Protein Balls (6g each)\n- Nutty Granola (5g per bowl)\n\n✨ **Pro Tip**: Spread protein throughout the day for better absorption. Combine our products with dairy or plant-based proteins for complete amino acid profiles!",
    nutritionData: { calories: 0, protein: 25, carbs: 0, fat: 0, fiber: 0 }
  },
  'weight-loss': {
    content: "For healthy weight loss, focus on nutrient-dense, protein-rich foods:\n\n🌟 **Tishya Recommendations**:\n- High-protein quinoa mix keeps you full longer\n- Fiber-rich ingredients support metabolism\n- Natural, unprocessed ingredients avoid empty calories\n\n📊 **Strategy**: Replace processed snacks with our protein balls. The combination of protein and fiber helps control hunger while maintaining muscle mass during weight loss.",
    nutritionData: { calories: 1400, protein: 75, carbs: 150, fat: 45, fiber: 30 }
  },
  'energy-boost': {
    content: "Natural energy comes from balanced nutrition! Here's what works:\n\n⚡ **Quick Energy**: Our granola provides complex carbs for sustained fuel\n🔋 **Long-term Energy**: Protein quinoa mix stabilizes blood sugar\n🌰 **Healthy Fats**: Nuts and seeds provide lasting energy\n\n💡 **Timing Tip**: Eat our protein-rich snacks 2-3 hours before you need peak energy. Avoid sugar crashes with whole food nutrition!",
    nutritionData: { calories: 350, protein: 12, carbs: 45, fat: 15, fiber: 8 }
  },
  'workout-nutrition': {
    content: "Optimize your workout nutrition with smart timing:\n\n🏃‍♀️ **Pre-Workout (30-60 min before)**:\n- Light portion of our granola for quick carbs\n- Avoid heavy proteins right before exercise\n\n💪 **Post-Workout (within 30 min)**:\n- Protein balls for muscle recovery (6g protein)\n- Quinoa mix for glycogen replenishment\n\n🎯 **Goal**: 3:1 carb to protein ratio post-workout for optimal recovery!",
    nutritionData: { calories: 280, protein: 14, carbs: 38, fat: 8, fiber: 6 }
  },
  'heart-health': {
    content: "Heart-healthy nutrition is our specialty! Here's what supports cardiovascular health:\n\n❤️ **Omega-3 Rich**: Nuts and seeds in our mixes\n🌾 **Fiber Power**: Quinoa and whole grains lower cholesterol\n🥜 **Antioxidants**: Natural ingredients fight inflammation\n\n📈 **Benefits**: Regular consumption of our quinoa mix can help maintain healthy cholesterol levels and support overall heart function. The fiber content is particularly beneficial for heart health!",
    nutritionData: { calories: 300, protein: 10, carbs: 35, fat: 12, fiber: 12 }
  }
}

export function NutritionAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm your AI nutrition assistant from Tishya Foods. I'm here to help you make the best choices for your health goals using our protein-rich, natural foods. What would you like to know about nutrition today?",
      timestamp: new Date(),
      suggestions: ['Meal planning', 'Protein intake', 'Weight management', 'Energy optimization']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        nutritionData: response.nutritionData,
        suggestions: response.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (input: string): { content: string; nutritionData?: any; suggestions?: string[] } => {
    const inputLower = input.toLowerCase()
    
    // Check for quick action matches
    for (const action of quickActions) {
      if (inputLower.includes(action.id.replace('-', ' ')) || input === action.prompt) {
        const response = sampleResponses[action.id as keyof typeof sampleResponses]
        return {
          content: response.content,
          nutritionData: response.nutritionData,
          suggestions: ['Tell me more', 'Adjust for my needs', 'Show products', 'Create shopping list']
        }
      }
    }

    // Default responses for common queries
    if (inputLower.includes('calorie') || inputLower.includes('weight')) {
      return {
        content: "Calorie management is key to achieving your goals! Our protein-rich foods help you feel satisfied with fewer calories. Would you like me to calculate your daily needs and suggest a meal plan using Tishya Foods products?",
        suggestions: ['Calculate my needs', 'Show meal plan', 'Protein recommendations']
      }
    }

    if (inputLower.includes('recipe') || inputLower.includes('cook')) {
      return {
        content: "I love that you want to get creative! While our products are ready-to-eat, here are some delicious ways to enjoy them:\n\n🥣 Add quinoa mix to smoothie bowls\n🥛 Blend protein balls into milkshakes\n🍓 Top granola on yogurt with berries\n\nWould you like specific recipe ideas?",
        suggestions: ['Smoothie recipes', 'Breakfast ideas', 'Snack combinations']
      }
    }

    // Generic helpful response
    return {
      content: "That's a great question! I'm here to help you with nutrition advice, meal planning, and making the most of Tishya Foods' protein-rich products. Could you tell me more about your specific health goals or dietary needs?",
      suggestions: ['My fitness goals', 'Dietary restrictions', 'Meal planning help', 'Product recommendations']
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Nutrition Assistant</h3>
                  <div className="flex items-center text-xs text-green-100">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-1 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                {quickActions.slice(0, 4).map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="h-7 text-xs px-2 hover:bg-primary-50"
                  >
                    <action.icon className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'assistant' ? (
                        <Bot className="h-4 w-4 text-primary-500" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    
                    {/* Nutrition Data */}
                    {message.nutritionData && (
                      <div className="mt-3 p-3 bg-white/10 rounded-lg">
                        <div className="text-xs font-medium mb-2 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Nutrition Overview
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-semibold">{message.nutritionData.calories}</div>
                            <div className="opacity-70">Calories</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{message.nutritionData.protein}g</div>
                            <div className="opacity-70">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{message.nutritionData.fiber}g</div>
                            <div className="opacity-70">Fiber</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded-lg px-2 py-1 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about nutrition, meal planning..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(inputValue)
                    }
                  }}
                  className="flex-1 bg-white"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • Personalized nutrition advice
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}