interface NutritionInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
  servingSize?: string
}

interface ProductNutritionInfoProps {
  nutrition?: NutritionInfo
}

export default function ProductNutritionInfo({ nutrition }: ProductNutritionInfoProps) {
  if (!nutrition) {
    return (
      <div className="text-gray-400">
        Nutrition information not available for this product.
      </div>
    )
  }

  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories, unit: '' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' },
    { label: 'Carbohydrates', value: nutrition.carbs, unit: 'g' },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    { label: 'Fiber', value: nutrition.fiber, unit: 'g' },
    { label: 'Sugar', value: nutrition.sugar, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
  ].filter(item => item.value !== undefined)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Nutrition Facts</h3>
        {nutrition.servingSize && (
          <p className="text-gray-400 mb-4">Per serving ({nutrition.servingSize})</p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nutritionItems.map((item) => (
            <div key={item.label} className="flex justify-between py-2 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-300">{item.label}</span>
              <span className="text-white font-medium">
                {item.value}{item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <p className="mb-2">
          * Percent Daily Values are based on a 2,000 calorie diet.
        </p>
        <p>
          Actual nutritional content may vary slightly from values shown.
        </p>
      </div>
    </div>
  )
}