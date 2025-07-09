'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Star, DollarSign, Leaf, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProductSearch } from '@/hooks/use-product-search'

interface ProductFiltersProps {
  isOpen: boolean
  onClose: () => void
}

interface FilterSection {
  id: string
  title: string
  icon: React.ReactNode
  isExpanded: boolean
}

export function ProductFilters({ isOpen, onClose }: ProductFiltersProps) {
  const { filters, updateFilters, clearFilters } = useProductSearch()
  
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'price', title: 'Price Range', icon: <DollarSign className="h-4 w-4" />, isExpanded: true },
    { id: 'dietary', title: 'Dietary Preferences', icon: <Leaf className="h-4 w-4" />, isExpanded: true },
    { id: 'nutrition', title: 'Nutritional Goals', icon: <Award className="h-4 w-4" />, isExpanded: false },
    { id: 'allergens', title: 'Allergens to Avoid', icon: <X className="h-4 w-4" />, isExpanded: false },
    { id: 'certifications', title: 'Certifications', icon: <Award className="h-4 w-4" />, isExpanded: false },
    { id: 'rating', title: 'Customer Rating', icon: <Star className="h-4 w-4" />, isExpanded: false },
    { id: 'availability', title: 'Availability', icon: <Clock className="h-4 w-4" />, isExpanded: false },
  ])

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ))
  }

  const dietaryOptions = [
    { id: 'vegan', label: 'Vegan', description: 'No animal products' },
    { id: 'gluten-free', label: 'Gluten-Free', description: 'Safe for celiac disease' },
    { id: 'organic', label: 'Organic', description: 'Certified organic' },
    { id: 'keto', label: 'Keto-Friendly', description: 'Low carb, high fat' },
    { id: 'dairy-free', label: 'Dairy-Free', description: 'No milk products' },
  ]

  const nutritionalGoals = [
    { id: 'high-protein', label: 'High Protein', description: '6g+ per serving' },
    { id: 'low-carb', label: 'Low Carb', description: '10g or less' },
    { id: 'high-fiber', label: 'High Fiber', description: '4g+ per serving' },
    { id: 'low-sugar', label: 'Low Sugar', description: '5g or less' },
    { id: 'weight-loss', label: 'Weight Management', description: 'Low calorie options' },
    { id: 'muscle-building', label: 'Muscle Building', description: 'High protein content' },
  ]

  const handleDietaryChange = (restriction: string) => {
    const current = filters.dietaryRestrictions
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction]
    updateFilters({ dietaryRestrictions: updated })
  }

  const handleNutritionalGoalChange = (goal: string) => {
    const current = filters.nutritionalGoals
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal]
    updateFilters({ nutritionalGoals: updated })
  }

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange]
    newRange[index] = value
    updateFilters({ priceRange: newRange })
  }

  const getActiveFiltersCount = () => {
    return (
      filters.dietaryRestrictions.length +
      filters.nutritionalGoals.length +
      filters.allergens.length +
      filters.certifications.length +
      (filters.rating > 0 ? 1 : 0) +
      (filters.availability !== 'all' ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)
    )
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-earth-800 shadow-xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-earth-500" />
                    <span className="font-medium">Price Range</span>
                  </div>
                  {sections.find(s => s.id === 'price')?.isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {sections.find(s => s.id === 'price')?.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-xs text-earth-500 mb-1">Min</label>
                          <input
                            type="number"
                            value={filters.priceRange[0]}
                            onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="₹0"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-earth-500 mb-1">Max</label>
                          <input
                            type="number"
                            value={filters.priceRange[1]}
                            onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 1000)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="₹1000"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={filters.priceRange[0]}
                          onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={filters.priceRange[1]}
                          onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('dietary')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-earth-500" />
                    <span className="font-medium">Dietary Preferences</span>
                  </div>
                  {sections.find(s => s.id === 'dietary')?.isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {sections.find(s => s.id === 'dietary')?.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {dietaryOptions.map((option) => (
                        <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.dietaryRestrictions.includes(option.id)}
                            onChange={() => handleDietaryChange(option.id)}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-earth-600 rounded"
                          />
                          <div>
                            <div className="text-sm font-medium">{option.label}</div>
                            <div className="text-xs text-earth-500">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nutritional Goals */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('nutrition')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-earth-500" />
                    <span className="font-medium">Nutritional Goals</span>
                  </div>
                  {sections.find(s => s.id === 'nutrition')?.isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {sections.find(s => s.id === 'nutrition')?.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {nutritionalGoals.map((goal) => (
                        <label key={goal.id} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.nutritionalGoals.includes(goal.id)}
                            onChange={() => handleNutritionalGoalChange(goal.id)}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-earth-600 rounded"
                          />
                          <div>
                            <div className="text-sm font-medium">{goal.label}</div>
                            <div className="text-xs text-earth-500">{goal.description}</div>
                          </div>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Customer Rating */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('rating')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-earth-500" />
                    <span className="font-medium">Customer Rating</span>
                  </div>
                  {sections.find(s => s.id === 'rating')?.isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {sections.find(s => s.id === 'rating')?.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => updateFilters({ rating })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-earth-600"
                          />
                          <div className="flex items-center space-x-1">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(5 - rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-cream-300" />
                            ))}
                            <span className="text-sm ml-2">& up</span>
                          </div>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('availability')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-earth-500" />
                    <span className="font-medium">Availability</span>
                  </div>
                  {sections.find(s => s.id === 'availability')?.isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {sections.find(s => s.id === 'availability')?.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {[
                        { value: 'all', label: 'All Products' },
                        { value: 'in-stock', label: 'In Stock Only' },
                        { value: 'out-of-stock', label: 'Out of Stock' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            checked={filters.availability === option.value}
                            onChange={() => updateFilters({ availability: option.value as 'all' | 'in-stock' | 'out-of-stock' })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-earth-600"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="flex space-x-3">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Clear All
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}