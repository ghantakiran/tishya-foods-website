'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Minus, 
  Calendar, 
  Settings, 
  User, 
  Target,
  Utensils,
  Clock,
  Package2,
  ChevronRight,
  X,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Slider } from '@/components/ui/slider' // Commented out: component not found
// import { Switch } from '@/components/ui/switch' // Commented out: component not found
import { products } from '@/lib/products-data'
import { Product } from '@/types/product'
import { formatPrice, cn } from '@/lib/utils'
import { SubscriptionPlan } from './subscription-plans'

interface DietaryPreference {
  id: string
  name: string
  description: string
  icon: string
}

interface NutritionGoal {
  id: string
  name: string
  description: string
  targetCalories: number
  targetProtein: number
}

const dietaryPreferences: DietaryPreference[] = [
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Plant-based foods only',
    icon: '🌱'
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products',
    icon: '🥬'
  },
  {
    id: 'gluten-free',
    name: 'Gluten Free',
    description: 'No gluten-containing ingredients',
    icon: '🌾'
  },
  {
    id: 'organic',
    name: 'Organic Only',
    description: 'Certified organic products',
    icon: '🌿'
  },
  {
    id: 'high-protein',
    name: 'High Protein',
    description: 'Focus on protein-rich options',
    icon: '💪'
  },
  {
    id: 'low-carb',
    name: 'Low Carb',
    description: 'Minimal carbohydrate content',
    icon: '🥩'
  }
]

const nutritionGoals: NutritionGoal[] = [
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    description: 'Lose weight with balanced nutrition',
    targetCalories: 1500,
    targetProtein: 100
  },
  {
    id: 'muscle-gain',
    name: 'Muscle Gain',
    description: 'Build muscle with high protein',
    targetCalories: 2500,
    targetProtein: 150
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Maintain current weight and health',
    targetCalories: 2000,
    targetProtein: 120
  },
  {
    id: 'athletic',
    name: 'Athletic Performance',
    description: 'Optimize for sports and training',
    targetCalories: 3000,
    targetProtein: 180
  }
]

interface SubscriptionCustomization {
  plan: SubscriptionPlan
  selectedProducts: Array<{ product: Product; quantity: number }>
  dietaryPreferences: string[]
  nutritionGoal: string
  deliveryDate: Date
  specialInstructions: string
  skipDates: Date[]
}

interface SubscriptionCustomizerProps {
  plan: SubscriptionPlan
  onComplete?: (customization: SubscriptionCustomization) => void
  onBack?: () => void
}

export function SubscriptionCustomizer({ 
  plan, 
  onComplete, 
  onBack 
}: SubscriptionCustomizerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product; quantity: number }>>([])
  const [selectedDietaryPrefs, setSelectedDietaryPrefs] = useState<string[]>([])
  const [selectedNutritionGoal, setSelectedNutritionGoal] = useState('')
  const [deliveryDate, setDeliveryDate] = useState(new Date())
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [skipDates, setSkipDates] = useState<Date[]>([])

  const steps = [
    { name: 'Preferences', icon: User },
    { name: 'Goals', icon: Target },
    { name: 'Products', icon: Package2 },
    { name: 'Schedule', icon: Calendar },
    { name: 'Review', icon: Check }
  ]

  const getFilteredProducts = () => {
    return products.filter(product => {
      if (selectedDietaryPrefs.includes('vegan') && !product.isVegan) return false
      if (selectedDietaryPrefs.includes('gluten-free') && !product.isGlutenFree) return false
      if (selectedDietaryPrefs.includes('organic') && !product.isOrganic) return false
      return true
    })
  }

  const toggleDietaryPref = (prefId: string) => {
    setSelectedDietaryPrefs(prev => 
      prev.includes(prefId) 
        ? prev.filter(id => id !== prefId)
        : [...prev, prefId]
    )
  }

  const addProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.filter(item => item.product.id !== productId)
    )
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId)
      return
    }
    
    setSelectedProducts(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  const getTotalProducts = () => {
    return selectedProducts.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return selectedProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  const handleComplete = () => {
    const customization: SubscriptionCustomization = {
      plan,
      selectedProducts,
      dietaryPreferences: selectedDietaryPrefs,
      nutritionGoal: selectedNutritionGoal,
      deliveryDate,
      specialInstructions,
      skipDates
    }
    onComplete?.(customization)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedDietaryPrefs.length > 0
      case 1: return selectedNutritionGoal !== ''
      case 2: return getTotalProducts() >= plan.minProducts && getTotalProducts() <= plan.maxProducts
      case 3: return true
      default: return true
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.name} className="flex items-center">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300',
                  isActive ? 'bg-earth-800 text-white' :
                  isCompleted ? 'bg-green-500 text-white' :
                  'bg-cream-200 text-earth-500'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-earth-800' :
                    isCompleted ? 'text-green-600' :
                    'text-earth-500'
                  )}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 h-0.5 mx-4',
                    index < currentStep ? 'bg-green-500' : 'bg-cream-200'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 0: Dietary Preferences */}
          {currentStep === 0 && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-earth-800 mb-4">
                Select Your Dietary Preferences
              </h3>
              <p className="text-earth-600 mb-6">
                Choose your dietary preferences to help us recommend the best products for you.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dietaryPreferences.map((pref) => (
                  <div
                    key={pref.id}
                    onClick={() => toggleDietaryPref(pref.id)}
                    className={cn(
                      'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                      selectedDietaryPrefs.includes(pref.id)
                        ? 'border-earth-800 bg-earth-50'
                        : 'border-earth-200 hover:border-earth-300'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{pref.icon}</span>
                      <div>
                        <h4 className="font-semibold text-earth-800">{pref.name}</h4>
                        <p className="text-sm text-earth-600">{pref.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Nutrition Goals */}
          {currentStep === 1 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-earth-800 mb-4">
                What's Your Nutrition Goal?
              </h3>
              <p className="text-earth-600 mb-6">
                Tell us your primary nutrition goal so we can tailor your subscription.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutritionGoals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedNutritionGoal(goal.id)}
                    className={cn(
                      'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                      selectedNutritionGoal === goal.id
                        ? 'border-earth-800 bg-earth-50'
                        : 'border-earth-200 hover:border-earth-300'
                    )}
                  >
                    <h4 className="font-semibold text-earth-800 mb-2">{goal.name}</h4>
                    <p className="text-sm text-earth-600 mb-3">{goal.description}</p>
                    <div className="flex space-x-4 text-xs">
                      <Badge variant="outline">{goal.targetCalories} cal/day</Badge>
                      <Badge variant="outline">{goal.targetProtein}g protein/day</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Product Selection */}
          {currentStep === 2 && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-earth-800 mb-4">
                Choose Your Products
              </h3>
              <p className="text-earth-600 mb-6">
                Select {plan.minProducts}-{plan.maxProducts} products for your {plan.frequency} delivery. 
                Currently selected: {getTotalProducts()}/{plan.maxProducts}
              </p>
              
              {/* Selected Products Summary */}
              {selectedProducts.length > 0 && (
                <div className="bg-earth-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-earth-800 mb-3">Selected Products</h4>
                  <div className="space-y-2">
                    {selectedProducts.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between">
                        <span className="text-sm text-earth-700">{item.product.name}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={getTotalProducts() >= plan.maxProducts}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(item.product.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-earth-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-earth-800">Total:</span>
                      <span className="font-bold text-earth-800">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Available Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {getFilteredProducts().map((product) => {
                  const selectedItem = selectedProducts.find(item => item.product.id === product.id)
                  const isSelected = !!selectedItem
                  
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        'p-4 rounded-lg border transition-all duration-200',
                        isSelected ? 'border-earth-800 bg-earth-50' : 'border-earth-200 hover:border-earth-300'
                      )}
                    >
                      <h4 className="font-semibold text-earth-800 mb-2">{product.name}</h4>
                      <p className="text-sm text-earth-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-earth-800">{formatPrice(product.price)}</span>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => addProduct(product)}
                          disabled={!isSelected && getTotalProducts() >= plan.maxProducts}
                        >
                          {isSelected ? `Added (${selectedItem.quantity})` : 'Add'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-earth-800 mb-4">
                Delivery Schedule
              </h3>
              <p className="text-earth-600 mb-6">
                Set your delivery preferences and any special instructions.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-earth-800 mb-2">
                    First Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate.toISOString().split('T')[0]}
                    onChange={(e) => setDeliveryDate(new Date(e.target.value))}
                    className="w-full p-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-800 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any dietary restrictions, delivery preferences, or special requests..."
                    rows={4}
                    className="w-full p-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-earth-800 mb-4">
                Review Your Subscription
              </h3>
              <p className="text-earth-600 mb-6">
                Review your subscription details before confirming.
              </p>
              
              <div className="space-y-6">
                {/* Plan Summary */}
                <div className="bg-earth-50 rounded-lg p-4">
                  <h4 className="font-semibold text-earth-800 mb-3">{plan.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-earth-600">Frequency:</span>
                      <span className="ml-2 capitalize">{plan.frequency}</span>
                    </div>
                    <div>
                      <span className="text-earth-600">Products:</span>
                      <span className="ml-2">{getTotalProducts()} items</span>
                    </div>
                  </div>
                </div>
                
                {/* Selected Products */}
                <div>
                  <h4 className="font-semibold text-earth-800 mb-3">Products ({selectedProducts.length})</h4>
                  <div className="space-y-2">
                    {selectedProducts.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Preferences */}
                <div>
                  <h4 className="font-semibold text-earth-800 mb-3">Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDietaryPrefs.map((prefId) => {
                      const pref = dietaryPreferences.find(p => p.id === prefId)
                      return (
                        <Badge key={prefId} variant="secondary">
                          {pref?.icon} {pref?.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                
                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-earth-800">Total per delivery:</span>
                    <span className="text-xl font-bold text-earth-800">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onBack : prevStep}
          >
            {currentStep === 0 ? 'Back to Plans' : 'Previous'}
          </Button>
          
          <Button
            onClick={currentStep === steps.length - 1 ? handleComplete : nextStep}
            disabled={!canProceed()}
            className="bg-earth-800 hover:bg-earth-900"
          >
            {currentStep === steps.length - 1 ? 'Complete Subscription' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  )
}