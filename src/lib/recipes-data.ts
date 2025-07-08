export interface Recipe {
  id: string
  name: string
  description: string
  image?: string
  prepTime: number
  cookTime: number
  totalTime: number
  servings: number
  difficulty: string
  cuisine?: string
  category: string
  ingredients: string[]
  instructions: string[]
  nutrition?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
  }
  author: string
  datePublished: string
  updatedAt?: string
}

// Mock recipe data - replace with actual CMS data
export function getAllRecipes(): Recipe[] {
  return [
    {
      id: '1',
      name: 'Sprouted Grain Protein Bowl',
      description: 'A nutritious and filling bowl packed with sprouted grains and protein.',
      image: '/images/recipes/protein-bowl.jpg',
      prepTime: 15,
      cookTime: 20,
      totalTime: 35,
      servings: 4,
      difficulty: 'Easy',
      cuisine: 'Healthy',
      category: 'Main Course',
      ingredients: [
        '1 cup sprouted grains',
        '2 tbsp protein powder',
        '1 cup mixed vegetables',
        '2 tbsp olive oil',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Cook sprouted grains according to package instructions',
        'Sauté vegetables in olive oil',
        'Mix protein powder with water',
        'Combine all ingredients in a bowl',
        'Season with salt and pepper'
      ],
      nutrition: {
        calories: 350,
        protein: 25,
        carbs: 45,
        fat: 12,
        fiber: 8
      },
      author: 'Tishya Foods Chef',
      datePublished: '2024-01-20'
    },
    {
      id: '2',
      name: 'Traditional Flour Pancakes',
      description: 'Fluffy pancakes made with traditional, wholesome flour.',
      image: '/images/recipes/pancakes.jpg',
      prepTime: 10,
      cookTime: 15,
      totalTime: 25,
      servings: 6,
      difficulty: 'Easy',
      cuisine: 'Traditional',
      category: 'Breakfast',
      ingredients: [
        '2 cups traditional flour',
        '2 eggs',
        '1.5 cups milk',
        '2 tbsp honey',
        '1 tsp baking powder'
      ],
      instructions: [
        'Mix dry ingredients in a bowl',
        'Beat eggs and add milk',
        'Combine wet and dry ingredients',
        'Cook pancakes on griddle',
        'Serve with honey'
      ],
      nutrition: {
        calories: 280,
        protein: 12,
        carbs: 42,
        fat: 8,
        fiber: 3
      },
      author: 'Traditional Recipe',
      datePublished: '2024-01-18'
    }
  ]
}

export function getRecipeById(id: string): Recipe | undefined {
  return getAllRecipes().find(recipe => recipe.id === id)
}