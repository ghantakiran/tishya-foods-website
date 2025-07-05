'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Plus, 
  Trash2,
  X,
  Clock,
  Target,
  TrendingUp,
  ChefHat,
  Coffee,
  Sun,
  Moon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface MealPlan {
  id: string
  name: string
  description: string
  duration: number // days
  targetCalories: number
  targetProtein: number
  meals: Meal[]
  totalCost: number
  createdAt: string
}

interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  items: MealItem[]
  calories: number
  protein: number
  cost: number
  day: number
}

interface MealItem {
  id: string
  productId: string
  name: string
  image: string
  quantity: number
  servingSize: string
  calories: number
  protein: number
  price: number
}

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'bg-orange-500' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: 'bg-yellow-500' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'bg-purple-500' },
  { id: 'snack', label: 'Snack', icon: ChefHat, color: 'bg-green-500' }
]

const sampleProducts: MealItem[] = [
  {
    id: '1',
    productId: '1',
    name: 'Protein Rich Quinoa Mix',
    image: '/images/products/quinoa-mix.jpg',
    quantity: 1,
    servingSize: '30g',
    calories: 150,
    protein: 8,
    price: 299
  },
  {
    id: '2',
    productId: '2',
    name: 'Sweet Protein Balls',
    image: '/images/products/protein-balls.jpg',
    quantity: 2,
    servingSize: '25g each',
    calories: 240,
    protein: 12,
    price: 199
  },
  {
    id: '3',
    productId: '3',
    name: 'Nutty Granola Mix',
    image: '/images/products/granola.jpg',
    quantity: 1,
    servingSize: '40g',
    calories: 180,
    protein: 6,
    price: 249
  }
]

const sampleMealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'High Protein Weight Loss',
    description: 'Balanced meal plan focused on protein intake and calorie control',
    duration: 7,
    targetCalories: 1600,
    targetProtein: 120,
    totalCost: 2100,
    meals: [],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Muscle Building Plan',
    description: 'High-calorie, high-protein plan for muscle growth',
    duration: 7,
    targetCalories: 2200,
    targetProtein: 150,
    totalCost: 2800,
    meals: [],
    createdAt: '2024-01-02T00:00:00Z'
  }
]

export function MealPlanner() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(sampleMealPlans)
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [newPlanData, setNewPlanData] = useState({
    name: '',
    description: '',
    duration: 7,
    targetCalories: 1800,
    targetProtein: 120
  })

  const createNewPlan = () => {
    const newPlan: MealPlan = {
      id: Date.now().toString(),
      ...newPlanData,
      meals: generateBasicMeals(newPlanData.duration),
      totalCost: 0,
      createdAt: new Date().toISOString()
    }
    
    setMealPlans(prev => [...prev, newPlan])
    setSelectedPlan(newPlan)
    setIsCreating(false)
    setNewPlanData({
      name: '',
      description: '',
      duration: 7,
      targetCalories: 1800,
      targetProtein: 120
    })
  }

  const generateBasicMeals = (duration: number): Meal[] => {
    const meals: Meal[] = []
    
    for (let day = 1; day <= duration; day++) {
      mealTypes.forEach((type, index) => {
        const meal: Meal = {
          id: `${day}-${type.id}`,
          name: `Day ${day} ${type.label}`,
          type: type.id as Meal['type'],
          time: ['08:00', '13:00', '19:00', '16:00'][index],
          items: [],
          calories: 0,
          protein: 0,
          cost: 0,
          day
        }
        meals.push(meal)
      })
    }
    
    return meals
  }

  const addItemToMeal = (meal: Meal, item: MealItem) => {
    if (!selectedPlan) return

    const updatedMeal = {
      ...meal,
      items: [...meal.items, { ...item, id: Date.now().toString() }],
      calories: meal.calories + item.calories,
      protein: meal.protein + item.protein,
      cost: meal.cost + item.price
    }

    const updatedPlan = {
      ...selectedPlan,
      meals: selectedPlan.meals.map(m => m.id === meal.id ? updatedMeal : m),
      totalCost: selectedPlan.totalCost + item.price
    }

    setSelectedPlan(updatedPlan)
    setMealPlans(prev => prev.map(p => p.id === selectedPlan.id ? updatedPlan : p))
  }

  const removeItemFromMeal = (meal: Meal, itemId: string) => {
    if (!selectedPlan) return

    const itemToRemove = meal.items.find(item => item.id === itemId)
    if (!itemToRemove) return

    const updatedMeal = {
      ...meal,
      items: meal.items.filter(item => item.id !== itemId),
      calories: meal.calories - itemToRemove.calories,
      protein: meal.protein - itemToRemove.protein,
      cost: meal.cost - itemToRemove.price
    }

    const updatedPlan = {
      ...selectedPlan,
      meals: selectedPlan.meals.map(m => m.id === meal.id ? updatedMeal : m),
      totalCost: selectedPlan.totalCost - itemToRemove.price
    }

    setSelectedPlan(updatedPlan)
    setMealPlans(prev => prev.map(p => p.id === selectedPlan.id ? updatedPlan : p))
  }

  const getDayMeals = (day: number) => {
    if (!selectedPlan) return []
    return selectedPlan.meals.filter(meal => meal.day === day)
  }

  const getDayTotals = (day: number) => {
    const dayMeals = getDayMeals(day)
    return {
      calories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: dayMeals.reduce((sum, meal) => sum + meal.protein, 0),
      cost: dayMeals.reduce((sum, meal) => sum + meal.cost, 0)
    }
  }

  const getMealTypeIcon = (type: string) => {
    const mealType = mealTypes.find(mt => mt.id === type)
    return mealType ? mealType.icon : ChefHat
  }

  const getMealTypeColor = (type: string) => {
    const mealType = mealTypes.find(mt => mt.id === type)
    return mealType ? mealType.color : 'bg-earth-9000'
  }

  if (!selectedPlan) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cream-100">Meal Planner</h1>
            <p className="text-earth-600">Create personalized meal plans with Tishya Foods products</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create New Plan</span>
          </Button>
        </div>

        {/* Meal Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className="bg-earth-800 rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-cream-100 mb-1">{plan.name}</h3>
                  <p className="text-sm text-earth-600">{plan.description}</p>
                </div>
                <Badge variant="secondary">{plan.duration} days</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth-600">Target Calories:</span>
                  <span className="font-medium">{plan.targetCalories}/day</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth-600">Target Protein:</span>
                  <span className="font-medium">{plan.targetProtein}g/day</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth-600">Estimated Cost:</span>
                  <span className="font-medium text-primary-600">{formatPrice(plan.totalCost)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center text-xs text-earth-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created {new Date(plan.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create New Plan Modal */}
        <AnimatePresence>
          {isCreating && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-earth-800 rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create New Meal Plan</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">
                      Plan Name
                    </label>
                    <Input
                      type="text"
                      value={newPlanData.name}
                      onChange={(e) => setNewPlanData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Custom Meal Plan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">
                      Description
                    </label>
                    <Input
                      type="text"
                      value={newPlanData.description}
                      onChange={(e) => setNewPlanData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your goals"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">
                        Duration (days)
                      </label>
                      <Input
                        type="number"
                        value={newPlanData.duration}
                        onChange={(e) => setNewPlanData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        min="1"
                        max="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">
                        Target Calories
                      </label>
                      <Input
                        type="number"
                        value={newPlanData.targetCalories}
                        onChange={(e) => setNewPlanData(prev => ({ ...prev, targetCalories: parseInt(e.target.value) }))}
                        min="1000"
                        max="4000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">
                      Target Protein (g)
                    </label>
                    <Input
                      type="number"
                      value={newPlanData.targetProtein}
                      onChange={(e) => setNewPlanData(prev => ({ ...prev, targetProtein: parseInt(e.target.value) }))}
                      min="50"
                      max="300"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewPlan} disabled={!newPlanData.name.trim()}>
                    Create Plan
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const dayTotals = getDayTotals(currentDay)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedPlan(null)}
            className="flex items-center space-x-2"
          >
            ← Back to Plans
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-cream-100">{selectedPlan.name}</h1>
            <p className="text-earth-600">{selectedPlan.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {selectedPlan.duration} Day Plan
        </Badge>
      </div>

      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-earth-700">Day:</span>
          {Array.from({ length: selectedPlan.duration }, (_, i) => i + 1).map((day) => (
            <Button
              key={day}
              variant={currentDay === day ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentDay(day)}
              className="h-8 w-8 p-0"
            >
              {day}
            </Button>
          ))}
        </div>

        {/* Daily Summary */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4 text-earth-500" />
            <span className="text-earth-600">Calories:</span>
            <span className="font-medium">
              {dayTotals.calories}/{selectedPlan.targetCalories}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-earth-500" />
            <span className="text-earth-600">Protein:</span>
            <span className="font-medium">
              {dayTotals.protein}g/{selectedPlan.targetProtein}g
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-earth-600">Cost:</span>
            <span className="font-medium text-primary-600">
              {formatPrice(dayTotals.cost)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Calories Progress</span>
            <span>{Math.round((dayTotals.calories / selectedPlan.targetCalories) * 100)}%</span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((dayTotals.calories / selectedPlan.targetCalories) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Protein Progress</span>
            <span>{Math.round((dayTotals.protein / selectedPlan.targetProtein) * 100)}%</span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((dayTotals.protein / selectedPlan.targetProtein) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meals for Current Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getDayMeals(currentDay).map((meal) => {
          const IconComponent = getMealTypeIcon(meal.type)
          
          return (
            <div key={meal.id} className="bg-earth-800 rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${getMealTypeColor(meal.type)} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cream-100 capitalize">{meal.type}</h3>
                    <div className="flex items-center space-x-2 text-xs text-earth-500">
                      <Clock className="h-3 w-3" />
                      <span>{meal.time}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMeal(meal)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Meal Items */}
              <div className="space-y-2 mb-3">
                {meal.items.length === 0 ? (
                  <p className="text-sm text-earth-500 text-center py-4">
                    No items added yet. Click + to add products.
                  </p>
                ) : (
                  meal.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-earth-900 rounded p-2">
                      <div className="flex items-center space-x-2">
                        <div className="relative w-8 h-8">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-earth-500">{item.servingSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-earth-600">
                          {item.calories} cal • {item.protein}g protein
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromMeal(meal, item.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Meal Totals */}
              <div className="flex justify-between text-xs text-earth-600 border-t pt-2">
                <span>{meal.calories} calories</span>
                <span>{meal.protein}g protein</span>
                <span>{formatPrice(meal.cost)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {editingMeal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-earth-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Add Items to {editingMeal.type} - Day {editingMeal.day}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMeal(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {sampleProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-earth-900 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-cream-100">{product.name}</h4>
                        <p className="text-sm text-earth-600">
                          {product.calories} cal • {product.protein}g protein • {product.servingSize}
                        </p>
                        <p className="text-sm font-medium text-primary-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => addItemToMeal(editingMeal, product)}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}