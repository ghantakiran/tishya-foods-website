'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, ShoppingCart, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { products } from '@/lib/products-data'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  productRecommendations?: ProductRecommendation[]
}

interface ProductRecommendation {
  id: string
  name: string
  price: number
  description: string
  reason: string
  image?: string
}

// Helper function to get recommendation reason
const getRecommendationReason = (product: any): string => {
  if (product.isOrganic && product.isVegan) return "Perfect for health-conscious customers"
  if (product.featured) return "Bestseller - loved by customers"
  if (product.isGlutenFree) return "Great for gluten-sensitive diets"
  if (product.isVegan) return "100% plant-based nutrition"
  return "Highly recommended for you"
}

// Helper function to get product recommendations
const getRecommendedProducts = (productIds: string[]): ProductRecommendation[] => {
  return productIds.map(id => {
    const product = products.find(p => p.id === id)
    if (!product) return null
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      reason: getRecommendationReason(product),
      image: product.images[0] // Use the first image from images[]
    }
  }).filter(Boolean) as ProductRecommendation[]
}

// Enhanced responses with product recommendations
const predefinedResponses: Record<string, { content: string; products?: string[] }> = {
  'hello': {
    content: "Hello! I'm your personal Tishya Foods shopping assistant. I can help you find the perfect protein-rich products for your health goals and even add them to your cart. What brings you here today?",
    products: ['1', '2', '3'] // Featured products
  },
  'protein': {
    content: "Excellent choice! High-protein foods are essential for muscle maintenance and satiety. Based on your interest, I've found some perfect matches:",
    products: ['1', '4', '7'] // High protein products
  },
  'gluten-free': {
    content: "Perfect! All our products are naturally gluten-free and safe for celiac diet. Here are our most popular gluten-free options:",
    products: ['2', '5', '8'] // Gluten-free products
  },
  'vegan': {
    content: "Great choice for plant-based nutrition! Most of our products are 100% vegan. Here are our top vegan bestsellers:",
    products: ['3', '6', '9'] // Vegan products
  },
  'weight-loss': {
    content: "Smart approach! High-protein, low-calorie foods help with satiety and weight management. These products are perfect for your goals:",
    products: ['1', '2', '4'] // Weight loss friendly
  },
  'muscle-building': {
    content: "Excellent for fitness goals! Protein is crucial for muscle synthesis. These high-protein products will support your training:",
    products: ['1', '7', '4'] // High protein for muscle building
  },
  'breakfast': {
    content: "A protein-rich breakfast sets you up for success! These options are quick, nutritious, and delicious:",
    products: ['5', '6', '3'] // Breakfast items
  },
  'snacks': {
    content: "Smart snacking keeps your metabolism active! These healthy, protein-packed snacks are perfect for any time:",
    products: ['2', '8', '9'] // Snack items
  }
}

const quickSuggestions = [
  "Show me high-protein products",
  "Best for weight loss",
  "Vegan protein options",
  "Quick breakfast ideas",
  "Healthy snack recommendations",
  "What's on sale today?",
]

export default function NutritionAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      type: 'assistant',
      content: "Hi! I'm your personal Tishya Foods shopping assistant 🛒. I can help you discover the perfect protein-rich products for your goals and add them directly to your cart. What are you looking for today?",
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 3),
      productRecommendations: getRecommendedProducts(['1', '2', '3'])
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userInput: string): { content: string; suggestions?: string[]; productRecommendations?: ProductRecommendation[] } => {
    const input = userInput.toLowerCase()
    
    // Check for predefined responses with products
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return {
          content: response.content,
          suggestions: getContextualSuggestions(key),
          productRecommendations: response.products ? getRecommendedProducts(response.products) : undefined
        }
      }
    }

    // Product-specific queries with cart integration
    if (input.includes('chips')) {
      return {
        content: "Our Protein Chips are customer favorites! 🔥 Made with chickpea and lentil flour, they pack 15g protein and only 180 calories per serving. Perfect for guilt-free snacking!",
        suggestions: ["Add to cart", "Other snack options", "Nutritional benefits"],
        productRecommendations: getRecommendedProducts(['2', '8'])
      }
    }

    if (input.includes('shake') || input.includes('powder')) {
      return {
        content: "Our Protein Power Shake Mix is a game-changer! 💪 With 25g of plant-based protein and only 150 calories, it's perfect for post-workout recovery or meal replacement.",
        suggestions: ["Add to cart now", "Smoothie recipes", "Protein timing tips"],
        productRecommendations: getRecommendedProducts(['1'])
      }
    }

    if (input.includes('sale') || input.includes('deal') || input.includes('discount')) {
      return {
        content: "Great timing! We have some amazing deals right now. Check out these featured products with special pricing:",
        suggestions: ["View all deals", "Limited time offers", "Bulk discounts"],
        productRecommendations: getRecommendedProducts(['1', '2', '3'])
      }
    }

    if (input.includes('buy') || input.includes('order') || input.includes('purchase') || input.includes('cart')) {
      return {
        content: "Ready to shop? 🛒 I can add products directly to your cart! We offer free shipping on orders over ₹500 and 100% satisfaction guarantee.",
        suggestions: ["Show bestsellers", "Free shipping info", "Return policy"],
        productRecommendations: getRecommendedProducts(['1', '2', '4'])
      }
    }

    // Default response with product recommendations
    return {
      content: "I'd love to help you find the perfect products! 🎯 Tell me about your health goals, dietary preferences, or what you're looking for, and I'll recommend the best options for you.",
      suggestions: quickSuggestions.slice(0, 3),
      productRecommendations: getRecommendedProducts(['1', '2', '3'])
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
  
  const handleAddToCart = async (product: ProductRecommendation) => {
    const fullProduct = products.find(p => p.id === product.id)
    if (fullProduct) {
      await addItem({
        productId: fullProduct.id,
        name: fullProduct.name,
        price: fullProduct.price,
        image: fullProduct.images[0],
        quantity: 1,
        nutritionalInfo: {
          protein: fullProduct.nutritionalInfo.protein,
          calories: fullProduct.nutritionalInfo.calories,
          servingSize: fullProduct.nutritionalInfo.servingSize,
        },
      })
      // Add confirmation message
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Great choice! 🎉 I've added "${product.name}" to your cart. Would you like to continue shopping or check out?`,
        timestamp: new Date(),
        suggestions: ["Continue shopping", "View cart", "Checkout now"],
      }
      setMessages(prev => [...prev, confirmationMessage])
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        data-testid="chatbot-trigger"
        aria-label="Open AI Nutrition Assistant"
      >
        <MessageCircle className="h-6 w-6" />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
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
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between" data-testid="chatbot-header">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-900" />
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
                className="text-white hover:bg-gray-700"
                data-testid="close-chatbot"
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900" data-testid="messages-container">
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
                      message.type === 'user' ? 'bg-gray-700' : 'bg-green-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-gray-900" />
                      )}
                    </div>
                    <div>
                      <div className={`rounded-2xl p-3 ${
                        message.type === 'user' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-800 border border-gray-600 text-gray-100'
                      }`} data-testid="message" data-sender={message.type === 'user' ? 'user' : 'bot'}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      {/* Product Recommendations */}
                      {message.productRecommendations && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-400 font-medium">Recommended for you:</p>
                          {message.productRecommendations.map((product) => (
                            <div key={product.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-100">{product.name}</h4>
                                  <p className="text-xs text-gray-300 mt-1">{product.reason}</p>
                                  <div className="flex items-center mt-2">
                                    <span className="text-sm font-bold text-blue-400">₹{product.price}</span>
                                    <div className="flex items-center ml-2">
                                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-400 ml-1">4.8</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(product)}
                                  className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Quick Reply Suggestions */}
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full transition-colors border border-blue-500/30"
                              data-testid="quick-reply"
                            >
                              {suggestion}
                              <ArrowRight className="inline h-3 w-3 ml-1" />
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
                  <div className="flex items-center space-x-2" data-testid="typing">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-gray-900" />
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
                  placeholder="Ask about products, nutrition, or say 'add to cart'..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-100 placeholder-gray-400"
                  disabled={isTyping}
                  data-testid="chat-input"
                  aria-label="Chat with AI assistant about products"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex-shrink-0 bg-green-600 hover:bg-green-700"
                  data-testid="send-button"
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