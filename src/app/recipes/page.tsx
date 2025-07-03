'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, ChefHat, Star, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const recipes = [
  {
    id: 1,
    title: 'Protein Power Smoothie Bowl',
    description: 'A nutritious breakfast bowl packed with our protein shake mix and fresh fruits',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center',
    prepTime: '10 min',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.8,
    category: 'Breakfast',
    ingredients: [
      '2 scoops Tishya Protein Shake Mix',
      '1 frozen banana',
      '1/2 cup mixed berries',
      '1 tbsp almond butter',
      '1/2 cup coconut milk',
      'Toppings: granola, coconut flakes, chia seeds',
    ],
    instructions: [
      'Blend protein shake mix with frozen banana, berries, and coconut milk until smooth',
      'Pour into a bowl and add your favorite toppings',
      'Serve immediately for the best texture',
    ],
    nutritionalInfo: {
      calories: 320,
      protein: 25,
      carbs: 28,
      fat: 12,
    },
  },
  {
    id: 2,
    title: 'Instant Protein Pancakes',
    description: 'Fluffy pancakes made with our instant porridge mix for a protein-rich breakfast',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center',
    prepTime: '15 min',
    servings: 4,
    difficulty: 'Easy',
    rating: 4.9,
    category: 'Breakfast',
    ingredients: [
      '1 cup Tishya Instant Porridge Mix',
      '2 eggs',
      '1/2 cup milk',
      '1 tbsp honey',
      '1 tsp vanilla extract',
      '1/2 tsp baking powder',
    ],
    instructions: [
      'Mix all dry ingredients in a bowl',
      'In another bowl, whisk eggs, milk, honey, and vanilla',
      'Combine wet and dry ingredients until just mixed',
      'Cook on a heated griddle until bubbles form, then flip',
      'Serve with fresh fruits and maple syrup',
    ],
    nutritionalInfo: {
      calories: 280,
      protein: 18,
      carbs: 32,
      fat: 8,
    },
  },
  {
    id: 3,
    title: 'Spiced Protein Curry',
    description: 'Traditional Indian curry enhanced with our curry spice mix and protein chips',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center',
    prepTime: '30 min',
    servings: 4,
    difficulty: 'Medium',
    rating: 4.7,
    category: 'Dinner',
    ingredients: [
      '2 tbsp Tishya Curry & Spice Mix',
      '1 cup mixed vegetables',
      '1 can coconut milk',
      '1/2 cup Tishya Protein Chips (crushed)',
      '1 onion, diced',
      '2 cloves garlic, minced',
      'Fresh cilantro for garnish',
    ],
    instructions: [
      'Sauté onion and garlic until fragrant',
      'Add curry spice mix and cook for 1 minute',
      'Add vegetables and coconut milk, simmer for 15 minutes',
      'Stir in crushed protein chips for added texture',
      'Garnish with fresh cilantro and serve with rice',
    ],
    nutritionalInfo: {
      calories: 380,
      protein: 22,
      carbs: 35,
      fat: 18,
    },
  },
  {
    id: 4,
    title: 'Crispy Dosa with Sambar',
    description: 'Traditional South Indian breakfast using our dosa mix and instant sambar',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center',
    prepTime: '20 min',
    servings: 3,
    difficulty: 'Medium',
    rating: 4.6,
    category: 'Breakfast',
    ingredients: [
      '1 cup Tishya Dosa & Crepe Mix',
      '1 pack Tishya Instant Sambar Mix',
      '2 cups water',
      '1 tbsp oil',
      'Salt to taste',
      'Coconut chutney (optional)',
    ],
    instructions: [
      'Mix dosa mix with water to form a smooth batter',
      'Rest the batter for 10 minutes',
      'Heat a non-stick pan and pour batter to form thin crepes',
      'Cook until golden and crispy',
      'Prepare sambar according to package instructions',
      'Serve hot dosas with sambar and chutney',
    ],
    nutritionalInfo: {
      calories: 260,
      protein: 12,
      carbs: 45,
      fat: 6,
    },
  },
  {
    id: 5,
    title: 'Energy Protein Bites',
    description: 'No-bake energy balls made with our biotin bites and nutty fruit bites',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center',
    prepTime: '15 min',
    servings: 8,
    difficulty: 'Easy',
    rating: 4.9,
    category: 'Snacks',
    ingredients: [
      '1/2 cup Tishya Biotin Bites (crushed)',
      '1/2 cup Tishya Nutty Fruit Bites (crushed)',
      '2 tbsp almond butter',
      '1 tbsp honey',
      '1 tbsp chia seeds',
      'Coconut flakes for rolling',
    ],
    instructions: [
      'Crush the biotin bites and nutty fruit bites into smaller pieces',
      'Mix with almond butter, honey, and chia seeds',
      'Form into small balls with your hands',
      'Roll in coconut flakes',
      'Refrigerate for 30 minutes before serving',
    ],
    nutritionalInfo: {
      calories: 150,
      protein: 8,
      carbs: 18,
      fat: 7,
    },
  },
  {
    id: 6,
    title: 'Protein Murukulu Chaat',
    description: 'A modern twist on traditional chaat using our protein murukulu',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center',
    prepTime: '10 min',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.5,
    category: 'Snacks',
    ingredients: [
      '1 cup Tishya Protein Murukulu',
      '1/2 cup diced tomatoes',
      '1/4 cup diced onions',
      '2 tbsp yogurt',
      '1 tsp chaat masala',
      'Fresh mint leaves',
      'Tamarind chutney',
    ],
    instructions: [
      'Break protein murukulu into bite-sized pieces',
      'Mix with diced tomatoes and onions',
      'Add yogurt and chaat masala',
      'Drizzle with tamarind chutney',
      'Garnish with fresh mint and serve immediately',
    ],
    nutritionalInfo: {
      calories: 220,
      protein: 15,
      carbs: 25,
      fat: 9,
    },
  },
]

const categories = ['All', 'Breakfast', 'Dinner', 'Snacks']
const difficulties = ['All', 'Easy', 'Medium', 'Hard']

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="pt-20 min-h-screen bg-earth-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-earth-900 to-earth-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-100 mb-6 font-montserrat">
              Healthy Recipes
            </h1>
            <p className="text-xl text-cream-300 leading-relaxed">
              Discover delicious and nutritious recipes featuring our protein-rich products. 
              From quick breakfasts to satisfying dinners, fuel your body with goodness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-earth-800 rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-earth-600 bg-earth-700 text-cream-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none placeholder-earth-400"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-earth-600 bg-earth-700 text-cream-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category} Recipes
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-earth-600 bg-earth-700 text-cream-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty} {difficulty !== 'All' ? 'Difficulty' : 'Difficulties'}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Count */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-cream-300">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>
        </div>
      </div>

      {/* Recipes Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className="bg-earth-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Recipe Image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-cream-100 font-bold text-lg text-center px-4">
                      {recipe.title}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-earth-800/90 text-cream-100 text-xs px-3 py-1 rounded-full font-semibold">
                      {recipe.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center bg-earth-800/90 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                    <span className="text-xs font-semibold text-cream-100">{recipe.rating}</span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cream-100 mb-2 group-hover:text-primary-600 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-cream-300 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-cream-300 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center">
                      <ChefHat className="h-4 w-4 mr-1" />
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>

                  {/* Nutritional Info */}
                  <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                    <div className="bg-earth-800 rounded-lg p-2">
                      <div className="text-sm font-bold text-cream-100">{recipe.nutritionalInfo.calories}</div>
                      <div className="text-xs text-cream-300">Cal</div>
                    </div>
                    <div className="bg-earth-800 rounded-lg p-2">
                      <div className="text-sm font-bold text-cream-100">{recipe.nutritionalInfo.protein}g</div>
                      <div className="text-xs text-cream-300">Protein</div>
                    </div>
                    <div className="bg-earth-800 rounded-lg p-2">
                      <div className="text-sm font-bold text-cream-100">{recipe.nutritionalInfo.carbs}g</div>
                      <div className="text-xs text-cream-300">Carbs</div>
                    </div>
                    <div className="bg-earth-800 rounded-lg p-2">
                      <div className="text-sm font-bold text-cream-100">{recipe.nutritionalInfo.fat}g</div>
                      <div className="text-xs text-cream-300">Fat</div>
                    </div>
                  </div>

                  {/* View Recipe Button */}
                  <Button className="w-full group-hover:bg-primary-600 transition-colors">
                    View Full Recipe
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredRecipes.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-cream-300 mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No recipes found matching your criteria</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedDifficulty('All')
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}