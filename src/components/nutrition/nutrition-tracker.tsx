'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Plus, 
  Minus, 
  Coffee, 
  Sun, 
  Moon, 
  Apple,
  Droplets,
  Flame,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface NutritionEntry {
  id: string
  date: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  productName: string
  productId: string
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water?: number
}

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number
}

interface DailyTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number
  entries: NutritionEntry[]
}

const defaultGoals: DailyGoals = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fat: 67,
  fiber: 25,
  water: 2000 // ml
}

const sampleProducts = [
  {
    id: '1',
    name: 'Protein Rich Quinoa Mix',
    calories: 150,
    protein: 8,
    carbs: 25,
    fat: 3,
    fiber: 4,
    servingSize: '30g'
  },
  {
    id: '2',
    name: 'Sweet Protein Balls',
    calories: 120,
    protein: 6,
    carbs: 15,
    fat: 4,
    fiber: 3,
    servingSize: '25g'
  },
  {
    id: '3',
    name: 'Nutty Granola Mix',
    calories: 180,
    protein: 6,
    carbs: 22,
    fat: 8,
    fiber: 5,
    servingSize: '40g'
  }
]

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'bg-orange-500' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: 'bg-yellow-500' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'bg-purple-500' },
  { id: 'snack', label: 'Snack', icon: Apple, color: 'bg-green-500' }
]

export function NutritionTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [goals] = useState<DailyGoals>(defaultGoals)
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [waterIntake, setWaterIntake] = useState(0)
  const [weeklyData, setWeeklyData] = useState<{ date: string; calories: number; protein: number }[]>([])

  useEffect(() => {
    // Load saved data for the selected date
    loadDayData(selectedDate)
    generateWeeklyData()
  }, [selectedDate, generateWeeklyData])

  const loadDayData = (date: string) => {
    // In a real app, this would load from localStorage or API
    const savedEntries = localStorage.getItem(`nutrition-entries-${date}`)
    const savedWater = localStorage.getItem(`water-intake-${date}`)
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    } else {
      setEntries([])
    }
    
    if (savedWater) {
      setWaterIntake(parseInt(savedWater))
    } else {
      setWaterIntake(0)
    }
  }

  const saveDayData = (newEntries: NutritionEntry[], newWater: number) => {
    localStorage.setItem(`nutrition-entries-${selectedDate}`, JSON.stringify(newEntries))
    localStorage.setItem(`water-intake-${selectedDate}`, newWater.toString())
  }

  const generateWeeklyData = useCallback(() => {
    const weekData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const savedEntries = localStorage.getItem(`nutrition-entries-${dateStr}`)
      const entries = savedEntries ? JSON.parse(savedEntries) : []
      
      const dayTotals = calculateDayTotals(entries)
      weekData.push({
        date: dateStr,
        calories: dayTotals.calories,
        protein: dayTotals.protein
      })
    }
    setWeeklyData(weekData)
  }, [calculateDayTotals])

  const calculateDayTotals = useCallback((dayEntries: NutritionEntry[]): DailyTotals => {
    const totals = dayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
        fiber: acc.fiber + entry.fiber,
        water: acc.water + (entry.water || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: waterIntake }
    )

    return { ...totals, entries: dayEntries }
  }, [waterIntake])

  const addEntry = (productId: string, servings: number) => {
    const product = sampleProducts.find(p => p.id === productId)
    if (!product) return

    const newEntry: NutritionEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      meal: selectedMeal,
      productName: product.name,
      productId,
      servings,
      calories: product.calories * servings,
      protein: product.protein * servings,
      carbs: product.carbs * servings,
      fat: product.fat * servings,
      fiber: product.fiber * servings
    }

    const newEntries = [...entries, newEntry]
    setEntries(newEntries)
    saveDayData(newEntries, waterIntake)
    setIsAddingEntry(false)
  }

  const removeEntry = (entryId: string) => {
    const newEntries = entries.filter(entry => entry.id !== entryId)
    setEntries(newEntries)
    saveDayData(newEntries, waterIntake)
  }

  const updateWaterIntake = (amount: number) => {
    const newWater = Math.max(0, waterIntake + amount)
    setWaterIntake(newWater)
    saveDayData(entries, newWater)
  }

  const dayTotals = calculateDayTotals(entries)

  const getMealEntries = (mealType: string) => {
    return entries.filter(entry => entry.meal === mealType)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream-100">Nutrition Tracker</h1>
          <p className="text-earth-600">Track your daily nutrition and reach your health goals</p>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button onClick={() => setIsAddingEntry(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Food</span>
          </Button>
        </div>
      </div>

      {/* Daily Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-earth-800 rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-cream-100">Calories</span>
            </div>
            <Badge variant={dayTotals.calories >= goals.calories ? 'success' : 'secondary'}>
              {Math.round((dayTotals.calories / goals.calories) * 100)}%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-cream-100 mb-1">
            {dayTotals.calories}
          </div>
          <div className="text-sm text-earth-600 mb-3">
            of {goals.calories} goal
          </div>
          <Progress 
            value={(dayTotals.calories / goals.calories) * 100} 
            className="h-2"
          />
        </div>

        <div className="bg-earth-800 rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-cream-100">Protein</span>
            </div>
            <Badge variant={dayTotals.protein >= goals.protein ? 'success' : 'secondary'}>
              {Math.round((dayTotals.protein / goals.protein) * 100)}%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-cream-100 mb-1">
            {Math.round(dayTotals.protein)}g
          </div>
          <div className="text-sm text-earth-600 mb-3">
            of {goals.protein}g goal
          </div>
          <Progress 
            value={(dayTotals.protein / goals.protein) * 100} 
            className="h-2"
          />
        </div>

        <div className="bg-earth-800 rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span className="font-medium text-cream-100">Fiber</span>
            </div>
            <Badge variant={dayTotals.fiber >= goals.fiber ? 'success' : 'secondary'}>
              {Math.round((dayTotals.fiber / goals.fiber) * 100)}%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-cream-100 mb-1">
            {Math.round(dayTotals.fiber)}g
          </div>
          <div className="text-sm text-earth-600 mb-3">
            of {goals.fiber}g goal
          </div>
          <Progress 
            value={(dayTotals.fiber / goals.fiber) * 100} 
            className="h-2"
          />
        </div>

        <div className="bg-earth-800 rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="font-medium text-cream-100">Water</span>
            </div>
            <Badge variant={waterIntake >= goals.water ? 'success' : 'secondary'}>
              {Math.round((waterIntake / goals.water) * 100)}%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-cream-100 mb-1">
            {waterIntake}ml
          </div>
          <div className="text-sm text-earth-600 mb-3">
            of {goals.water}ml goal
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateWaterIntake(-250)}
              className="h-6 w-6 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Progress 
              value={(waterIntake / goals.water) * 100} 
              className="h-2 flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateWaterIntake(250)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-earth-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-cream-100">Weekly Progress</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Calories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Protein</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {weeklyData.map((day) => {
            const calorieHeight = (day.calories / Math.max(...weeklyData.map(d => d.calories), 1)) * 200
            const proteinHeight = (day.protein / Math.max(...weeklyData.map(d => d.protein), 1)) * 200
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center space-y-2">
                <div className="flex items-end space-x-1 h-48">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: calorieHeight }}
                    className="bg-blue-500 w-4 rounded-t"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: proteinHeight }}
                    className="bg-green-500 w-4 rounded-t"
                  />
                </div>
                <div className="text-xs text-earth-600 text-center">
                  {new Date(day.date).toLocaleDateString([], { weekday: 'short' })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Meal Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mealTypes.map((mealType) => {
          const mealEntries = getMealEntries(mealType.id)
          const mealTotals = mealEntries.reduce(
            (acc, entry) => ({
              calories: acc.calories + entry.calories,
              protein: acc.protein + entry.protein
            }),
            { calories: 0, protein: 0 }
          )
          const IconComponent = mealType.icon

          return (
            <div key={mealType.id} className="bg-earth-800 rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${mealType.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cream-100">{mealType.label}</h3>
                    <p className="text-xs text-earth-500">
                      {mealTotals.calories} cal • {Math.round(mealTotals.protein)}g protein
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMeal(mealType.id as 'breakfast' | 'lunch' | 'dinner' | 'snack')
                    setIsAddingEntry(true)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {mealEntries.length === 0 ? (
                  <p className="text-sm text-earth-500 text-center py-4">
                    No items logged for {mealType.label.toLowerCase()}
                  </p>
                ) : (
                  mealEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between bg-earth-900 rounded p-2">
                      <div>
                        <p className="text-sm font-medium">{entry.productName}</p>
                        <p className="text-xs text-earth-500">
                          {entry.servings}x serving • {entry.calories} cal • {Math.round(entry.protein)}g protein
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntry(entry.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Entry Modal */}
      {isAddingEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-earth-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Add to {mealTypes.find(m => m.id === selectedMeal)?.label}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingEntry(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              {sampleProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <Badge variant="secondary">{product.servingSize}</Badge>
                  </div>
                  <p className="text-sm text-earth-600 mb-3">
                    {product.calories} cal • {product.protein}g protein • {product.fiber}g fiber
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Servings"
                      className="flex-1"
                      defaultValue="1"
                      min="0.5"
                      step="0.5"
                      id={`servings-${product.id}`}
                    />
                    <Button
                      onClick={() => {
                        const servingsInput = document.getElementById(`servings-${product.id}`) as HTMLInputElement
                        const servings = parseFloat(servingsInput.value) || 1
                        addEntry(product.id, servings)
                      }}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}