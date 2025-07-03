'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const predefinedResponses: Record<string, string> = {
  'hello': "Hello! I'm your Tishya Foods nutrition assistant. I can help you find the perfect protein-rich products for your health goals. What would you like to know?",
  'protein': "Our products are rich in plant-based proteins! Our Protein Power Shake Mix has 25g protein per serving, while our Protein Chips contain 15g. What's your fitness goal?",
  'gluten-free': "Great news! All Tishya Foods products are naturally gluten-free. We have sweet treats, savory snacks, and meal mixes that are safe for gluten-sensitive individuals.",
  'vegan': "Most of our products are vegan-friendly! Our Protein Shake Mix, Instant Porridge, and Protein Chips are all plant-based. Only our Nutty Fruit Bites contain honey.",
  'weight-loss': "For weight management, I recommend our Protein Power Shake Mix (150 calories, 25g protein) and Protein Chips (180 calories, 15g protein). High protein helps with satiety!",
  'muscle-building': "Perfect! For muscle building, try our Protein Power Shake Mix with 25g protein per serving. Combine it with our Biotin Bites for additional nutrients and healthy fats.",
  'breakfast': "For healthy breakfasts, try our Instant Porridge Mix (200 calories, 8g protein) or make protein pancakes with it! Also great: Protein Power Smoothie bowls.",
  'snacks': "Our healthy snacks include Protein Chips, Protein Murukulu, Biotin Bites, and Nutty Fruit Bites. All are preservative-free and packed with nutrients!",
  'ingredients': "All our products use natural ingredients: no artificial colors, preservatives, or white sugars. We source directly from organic farmers and use traditional processing methods.",
  'recipes': "I can suggest recipes! Try our Protein Power Smoothie Bowl, Instant Protein Pancakes, or Spiced Protein Curry. Each recipe includes nutritional information and cooking instructions.",
  'organic': "Yes! All Tishya Foods products are made with organic ingredients sourced directly from farmers. We ensure quality through our triple-washing and hand-roasting process.",
}

const quickSuggestions = [
  "Tell me about protein content",
  "Which products are vegan?",
  "Best for weight loss?",
  "Gluten-free options",
  "Healthy breakfast ideas",
  "Recipe suggestions",
]

export default function NutritionAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your Tishya Foods nutrition assistant. I can help you find the perfect protein-rich products for your dietary needs. How can I assist you today?",
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 3),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userInput: string): { content: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase()
    
    // Check for predefined responses
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return {
          content: response,
          suggestions: getContextualSuggestions(key),
        }
      }
    }

    // Product-specific queries
    if (input.includes('chips')) {
      return {
        content: "Our Protein Chips are amazing! Made with chickpea and lentil flour, they have 15g protein and only 180 calories per serving. They're gluten-free, vegan, and perfect for healthy snacking!",
        suggestions: ["Other snack options", "Nutritional details", "Recipe ideas"],
      }
    }

    if (input.includes('shake') || input.includes('powder')) {
      return {
        content: "Our Protein Power Shake Mix is our flagship product! With 25g of plant-based protein and only 150 calories, it's perfect for post-workout recovery or meal replacement. Mix with fruits for delicious smoothies!",
        suggestions: ["Smoothie recipes", "When to drink protein shakes", "Vegan protein benefits"],
      }
    }

    if (input.includes('porridge')) {
      return {
        content: "Our Instant Porridge Mix combines rolled oats, quinoa, and chia seeds for a nutritious breakfast. It has 8g protein and 6g fiber per serving. Just add water or milk and you're ready to go!",
        suggestions: ["Porridge toppings", "Breakfast recipes", "Other breakfast options"],
      }
    }

    // General responses
    if (input.includes('calories') || input.includes('nutrition')) {
      return {
        content: "Our products range from 140-320 calories per serving, with high protein content (8-25g). All include detailed nutritional information. Would you like specifics for any particular product?",
        suggestions: ["Low calorie options", "High protein products", "Nutritional comparison"],
      }
    }

    if (input.includes('buy') || input.includes('order') || input.includes('purchase')) {
      return {
        content: "You can order our products directly from our website! We offer free shipping on orders over ₹500. All products come with our 100% satisfaction guarantee.",
        suggestions: ["View all products", "Shipping information", "Return policy"],
      }
    }

    // Default response with product recommendations
    return {
      content: "I'd be happy to help! Could you tell me more about your specific dietary goals or preferences? I can recommend the best Tishya Foods products for you based on your needs.",
      suggestions: quickSuggestions.slice(0, 3),
    }
  }

  const getContextualSuggestions = (context: string): string[] => {
    const suggestionMap: Record<string, string[]> = {
      'protein': ["Protein shake recipes", "Best time to eat protein", "Plant vs animal protein"],
      'gluten-free': ["Gluten-free recipes", "Other dietary restrictions", "Celiac-friendly options"],
      'vegan': ["Plant-based nutrition", "Vegan protein sources", "B12 and vegan diets"],
      'weight-loss': ["Portion control tips", "Exercise recommendations", "Healthy meal planning"],
      'muscle-building': ["Post-workout nutrition", "Protein timing", "Strength training diet"],
      'breakfast': ["Quick breakfast ideas", "Meal prep tips", "Overnight recipes"],
      'snacks': ["Healthy snacking tips", "Portion sizes", "Pre/post workout snacks"],
    }
    
    return suggestionMap[context] || quickSuggestions.slice(0, 3)
  }

  const handleSendMessage = async (message: string = inputValue) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(message)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-brown-800 hover:bg-brown-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      >
        <MessageCircle className="h-6 w-6" />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-600"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-brown-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-brown-800" />
                </div>
                <div>
                  <h3 className="font-semibold">Nutrition Assistant</h3>
                  <p className="text-sm opacity-90">Powered by Tishya AI</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-brown-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-brown-800' : 'bg-primary-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-brown-800" />
                      )}
                    </div>
                    <div>
                      <div className={`rounded-2xl p-3 ${
                        message.type === 'user' 
                          ? 'bg-brown-800 text-white' 
                          : 'bg-gray-800 border border-gray-600'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block text-xs bg-primary-100 hover:bg-primary-200 text-brown-800 px-2 py-1 rounded-full transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-brown-800" />
                    </div>
                    <div className="bg-gray-800 border border-gray-600 rounded-2xl p-3">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-600 bg-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about nutrition, products, or recipes..."
                  className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}