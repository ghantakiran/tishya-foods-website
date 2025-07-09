'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Plus, 
  Check, 
  Star, 
  ShoppingCart,
  Scale,
  Zap,
  Heart,
  Award,
  TrendingUp,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  category: string
  tags: string[]
  nutritionalInfo: {
    protein: number
    calories: number
    fat: number
    carbs: number
    fiber: number
    sugar: number
    sodium: number
    servingSize: string
    servingsPerContainer: number
  }
  ingredients: string[]
  benefits: string[]
  certifications: string[]
  inStock: boolean
  isPopular?: boolean
  isNew?: boolean
}

interface ComparisonTableProps {
  products: Product[]
  onRemoveProduct: (productId: string) => void
  onAddToCart: (product: Product) => void
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Protein Rich Quinoa Mix',
    description: 'High-protein quinoa blend with nuts and seeds for sustained energy',
    image: 'https://images.unsplash.com/photo-1599599810694-57a2ca9f5a94?w=80&h=80&fit=crop&crop=center',
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 124,
    category: 'Breakfast',
    tags: ['high-protein', 'gluten-free', 'organic'],
    nutritionalInfo: {
      protein: 8,
      calories: 150,
      fat: 3,
      carbs: 25,
      fiber: 4,
      sugar: 2,
      sodium: 120,
      servingSize: '30g',
      servingsPerContainer: 10
    },
    ingredients: ['Quinoa', 'Almonds', 'Walnuts', 'Chia Seeds', 'Pumpkin Seeds', 'Natural Vanilla'],
    benefits: ['Complete amino acid profile', 'Rich in omega-3', 'Sustained energy release', 'Muscle recovery'],
    certifications: ['Organic', 'Non-GMO', 'Gluten-Free'],
    inStock: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Sweet Protein Balls',
    description: 'Delicious protein-packed energy balls made with natural ingredients',
    image: 'https://images.unsplash.com/photo-1599599810694-57a2ca9f5a94?w=80&h=80&fit=crop&crop=center',
    price: 199,
    rating: 4.6,
    reviews: 89,
    category: 'Snacks',
    tags: ['protein-rich', 'no-added-sugar', 'vegan'],
    nutritionalInfo: {
      protein: 6,
      calories: 120,
      fat: 4,
      carbs: 15,
      fiber: 3,
      sugar: 8,
      sodium: 50,
      servingSize: '25g',
      servingsPerContainer: 8
    },
    ingredients: ['Dates', 'Almonds', 'Protein Powder', 'Coconut', 'Cacao', 'Vanilla Extract'],
    benefits: ['Quick energy boost', 'Post-workout recovery', 'Natural sweetness', 'Portable nutrition'],
    certifications: ['Vegan', 'No Added Sugar', 'Raw'],
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Nutty Granola Mix',
    description: 'Crunchy granola with mixed nuts and seeds for breakfast or snacking',
    image: 'https://images.unsplash.com/photo-1599599810694-57a2ca9f5a94?w=80&h=80&fit=crop&crop=center',
    price: 249,
    originalPrice: 279,
    rating: 4.7,
    reviews: 156,
    category: 'Breakfast',
    tags: ['high-fiber', 'antioxidant-rich', 'crunchy'],
    nutritionalInfo: {
      protein: 6,
      calories: 180,
      fat: 8,
      carbs: 22,
      fiber: 5,
      sugar: 6,
      sodium: 80,
      servingSize: '40g',
      servingsPerContainer: 12
    },
    ingredients: ['Oats', 'Mixed Nuts', 'Honey', 'Coconut Oil', 'Cinnamon', 'Dried Berries'],
    benefits: ['High in fiber', 'Heart-healthy fats', 'Antioxidant-rich', 'Satisfying crunch'],
    certifications: ['Natural', 'No Artificial Flavors'],
    inStock: true
  }
]

const nutritionCategories = [
  { key: 'protein', label: 'Protein', unit: 'g', icon: TrendingUp, color: 'text-blue-600' },
  { key: 'calories', label: 'Calories', unit: '', icon: Zap, color: 'text-orange-600' },
  { key: 'fat', label: 'Fat', unit: 'g', icon: Scale, color: 'text-purple-600' },
  { key: 'carbs', label: 'Carbs', unit: 'g', icon: Heart, color: 'text-green-600' },
  { key: 'fiber', label: 'Fiber', unit: 'g', icon: Award, color: 'text-indigo-600' },
  { key: 'sugar', label: 'Sugar', unit: 'g', icon: Info, color: 'text-red-600' }
]

export function ProductComparison({ products, onRemoveProduct, onAddToCart }: ComparisonTableProps) {
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null)

  const getBestValue = (metric: keyof Product['nutritionalInfo']) => {
    if (products.length === 0) return null
    
    const values = products.map(p => p.nutritionalInfo[metric] as number)
    const bestValue = metric === 'calories' || metric === 'sugar' || metric === 'sodium' 
      ? Math.min(...values) 
      : Math.max(...values)
    
    return bestValue
  }

  const isMetricBest = (product: Product, metric: keyof Product['nutritionalInfo']) => {
    const bestValue = getBestValue(metric)
    return bestValue !== null && product.nutritionalInfo[metric] === bestValue
  }

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const compareFeatures = (products: Product[]) => {
    const allBenefits = [...new Set(products.flatMap(p => p.benefits))]
    const allCertifications = [...new Set(products.flatMap(p => p.certifications))]
    
    return { allBenefits, allCertifications }
  }

  const { allBenefits, allCertifications } = compareFeatures(products)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale className="h-8 w-8 text-earth-400" />
        </div>
        <h3 className="text-lg font-medium text-cream-100 mb-2">No products selected</h3>
        <p className="text-earth-600 mb-4">Add products to compare their features and nutrition</p>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cream-100">Product Comparison</h2>
          <p className="text-earth-600">Compare nutrition, benefits, and features side by side</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {products.length} products selected
        </Badge>
      </div>

      {/* Comparison Table */}
      <div className="bg-earth-800 rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Product Headers */}
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 w-48 bg-earth-900">
                  <span className="text-sm font-medium text-earth-500">Product Details</span>
                </th>
                {products.map((product) => (
                  <th key={product.id} className="text-center p-4 min-w-64 relative">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProduct(product.id)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 text-earth-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {/* Product Image */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mx-auto flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-700">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                        {product.isPopular && (
                          <Badge className="absolute -top-1 -right-1 text-xs px-1">Popular</Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">New</Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div>
                        <h3 className="font-semibold text-cream-100 text-sm mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-cream-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-earth-500">({product.reviews})</span>
                        </div>
                        
                        {/* Price */}
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-earth-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              {getDiscountPercentage(product.price, product.originalPrice)}% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Add to Cart */}
                        <Button
                          onClick={() => onAddToCart(product)}
                          disabled={!product.inStock}
                          size="sm"
                          className="w-full"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Nutrition Facts */}
              <tr className="border-b bg-earth-900">
                <td className="p-4 font-medium text-cream-100">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Nutrition Facts</span>
                  </div>
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <span className="text-sm text-earth-600">
                      Per {product.nutritionalInfo.servingSize}
                    </span>
                  </td>
                ))}
              </tr>

              {nutritionCategories.map((category) => (
                <tr
                  key={category.key}
                  className={`border-b hover:bg-earth-900 transition-colors ${
                    highlightedMetric === category.key ? 'bg-yellow-50' : ''
                  }`}
                  onMouseEnter={() => setHighlightedMetric(category.key)}
                  onMouseLeave={() => setHighlightedMetric(null)}
                >
                  <td className="p-4 bg-earth-800">
                    <div className="flex items-center space-x-2">
                      <category.icon className={`h-4 w-4 ${category.color}`} />
                      <span className="font-medium text-cream-100">{category.label}</span>
                    </div>
                  </td>
                  {products.map((product) => {
                    const value = product.nutritionalInfo[category.key as keyof typeof product.nutritionalInfo] as number
                    const isBest = isMetricBest(product, category.key as keyof typeof product.nutritionalInfo)
                    
                    return (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className={`font-semibold ${isBest ? 'text-green-600' : 'text-cream-100'}`}>
                            {value}{category.unit}
                          </span>
                          {isBest && <Check className="h-4 w-4 text-green-600" />}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Benefits */}
              <tr className="border-b bg-earth-900">
                <td className="p-4 font-medium text-cream-100">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span>Health Benefits</span>
                  </div>
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4"></td>
                ))}
              </tr>

              {allBenefits.map((benefit) => (
                <tr key={benefit} className="border-b hover:bg-earth-900">
                  <td className="p-4 pl-8 text-sm text-cream-100">{benefit}</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.benefits.includes(benefit) ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-cream-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Certifications */}
              <tr className="border-b bg-earth-900">
                <td className="p-4 font-medium text-cream-100">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span>Certifications</span>
                  </div>
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4"></td>
                ))}
              </tr>

              {allCertifications.map((certification) => (
                <tr key={certification} className="border-b hover:bg-earth-900">
                  <td className="p-4 pl-8 text-sm text-cream-100">{certification}</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.certifications.includes(certification) ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-cream-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Ingredients */}
              <tr className="border-b bg-earth-900">
                <td className="p-4 font-medium text-cream-100">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-orange-600" />
                    <span>Key Ingredients</span>
                  </div>
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="text-xs text-earth-600 space-y-1">
                      {product.ingredients.slice(0, 4).map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-center">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {ingredient}
                          </Badge>
                        </div>
                      ))}
                      {product.ingredients.length > 4 && (
                        <div className="text-center text-earth-500">
                          +{product.ingredients.length - 4} more
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-200" />
            <h3 className="font-semibold text-white">Highest Protein</h3>
          </div>
          {(() => {
            const maxProtein = Math.max(...products.map(p => p.nutritionalInfo.protein))
            const bestProduct = products.find(p => p.nutritionalInfo.protein === maxProtein)
            return bestProduct ? (
              <div>
                <p className="text-sm text-blue-200">{bestProduct.name}</p>
                <p className="text-lg font-bold text-white">{maxProtein}g protein</p>
              </div>
            ) : null
          })()}
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="h-5 w-5 text-green-200" />
            <h3 className="font-semibold text-white">Best Value</h3>
          </div>
          {(() => {
            const bestValue = products.reduce((prev, current) => 
              (prev.nutritionalInfo.protein / prev.price) > (current.nutritionalInfo.protein / current.price) 
                ? prev 
                : current
            )
            return (
              <div>
                <p className="text-sm text-green-200">{bestValue.name}</p>
                <p className="text-lg font-bold text-white">
                  {formatPrice(bestValue.price)} for {bestValue.nutritionalInfo.protein}g
                </p>
              </div>
            )
          })()}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-5 w-5 text-purple-200" />
            <h3 className="font-semibold text-white">Top Rated</h3>
          </div>
          {(() => {
            const topRated = products.reduce((prev, current) => 
              prev.rating > current.rating ? prev : current
            )
            return (
              <div>
                <p className="text-sm text-purple-200">{topRated.name}</p>
                <p className="text-lg font-bold text-white">
                  ⭐ {topRated.rating} ({topRated.reviews} reviews)
                </p>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export function ProductComparisonContainer() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  const addProductToComparison = (product: Product) => {
    if (selectedProducts.length >= 4) {
      alert('You can compare up to 4 products at a time')
      return
    }
    
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => [...prev, product])
    }
  }

  const removeProductFromComparison = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      nutritionalInfo: product.nutritionalInfo,
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Product Selection */}
      {selectedProducts.length < 4 && (
        <div className="bg-earth-800 rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-cream-100 mb-4">
            Add Products to Compare ({selectedProducts.length}/4)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleProducts
              .filter(product => !selectedProducts.find(p => p.id === product.id))
              .map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -2 }}
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addProductToComparison(product)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-md flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-cream-100 text-sm">{product.name}</h4>
                      <p className="text-xs text-earth-600 mb-1">
                        {product.nutritionalInfo.protein}g protein • {product.nutritionalInfo.calories} cal
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                          <Plus className="h-3 w-3 mr-1" />
                          Compare
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <ProductComparison
        products={selectedProducts}
        onRemoveProduct={removeProductFromComparison}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}