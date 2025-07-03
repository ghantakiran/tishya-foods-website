'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Package, 
  Truck, 
  Gift, 
  Check, 
  Star,
  Calendar,
  Shield,
  Percent,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  basePrice: number
  discount: number
  minProducts: number
  maxProducts: number
  features: string[]
  benefits: {
    freeShipping: boolean
    prioritySupport: boolean
    exclusiveProducts: boolean
    nutritionConsults: boolean
    flexibleScheduling: boolean
  }
  popular?: boolean
  customizable: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Wellness Starter',
    description: 'Perfect for individuals starting their health journey',
    frequency: 'monthly',
    basePrice: 2999, // ₹29.99
    discount: 10,
    minProducts: 3,
    maxProducts: 6,
    features: [
      '3-6 premium products monthly',
      'Personalized nutrition tips',
      'Recipe suggestions',
      'Progress tracking'
    ],
    benefits: {
      freeShipping: true,
      prioritySupport: false,
      exclusiveProducts: false,
      nutritionConsults: false,
      flexibleScheduling: true
    },
    customizable: true
  },
  {
    id: 'family',
    name: 'Family Nutrition',
    description: 'Comprehensive nutrition for the whole family',
    frequency: 'monthly',
    basePrice: 5999, // ₹59.99
    discount: 15,
    minProducts: 6,
    maxProducts: 12,
    features: [
      '6-12 premium products monthly',
      'Family meal planning',
      'Kid-friendly options',
      'Nutritionist consultation',
      'Custom dietary requirements'
    ],
    benefits: {
      freeShipping: true,
      prioritySupport: true,
      exclusiveProducts: true,
      nutritionConsults: true,
      flexibleScheduling: true
    },
    popular: true,
    customizable: true
  },
  {
    id: 'premium',
    name: 'Premium Wellness',
    description: 'Ultimate nutrition experience with exclusive perks',
    frequency: 'monthly',
    basePrice: 9999, // ₹99.99
    discount: 20,
    minProducts: 10,
    maxProducts: 20,
    features: [
      '10-20 premium products monthly',
      'Exclusive limited edition items',
      'Personal nutrition coach',
      'Advanced health analytics',
      'Priority customer service',
      'Quarterly wellness reports'
    ],
    benefits: {
      freeShipping: true,
      prioritySupport: true,
      exclusiveProducts: true,
      nutritionConsults: true,
      flexibleScheduling: true
    },
    customizable: true
  }
]

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly', discount: 5 },
  { value: 'biweekly', label: 'Every 2 Weeks', discount: 10 },
  { value: 'monthly', label: 'Monthly', discount: 15 },
  { value: 'quarterly', label: 'Quarterly', discount: 25 }
]

interface SubscriptionPlansProps {
  onSelectPlan?: (plan: SubscriptionPlan, frequency: string) => void
}

export function SubscriptionPlans({ onSelectPlan }: SubscriptionPlansProps) {
  const [selectedFrequency, setSelectedFrequency] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const calculatePrice = (plan: SubscriptionPlan, frequency: string) => {
    const freqOption = frequencyOptions.find(f => f.value === frequency)
    const frequencyDiscount = freqOption?.discount || 0
    const totalDiscount = plan.discount + frequencyDiscount
    return plan.basePrice * (1 - totalDiscount / 100)
  }

  const getBillingText = (frequency: string, price: number) => {
    switch (frequency) {
      case 'weekly':
        return `${formatPrice(price)}/week`
      case 'biweekly':
        return `${formatPrice(price)}/2 weeks`
      case 'monthly':
        return `${formatPrice(price)}/month`
      case 'quarterly':
        return `${formatPrice(price)}/quarter`
      default:
        return `${formatPrice(price)}/month`
    }
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.id)
    onSelectPlan?.(plan, selectedFrequency)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold text-brown-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Wellness Journey
        </motion.h2>
        <motion.p 
          className="text-brown-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Subscribe and save on premium protein-rich foods delivered to your doorstep. 
          Customize your delivery frequency and enjoy exclusive benefits.
        </motion.p>
      </div>

      {/* Frequency Selector */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gray-800 rounded-2xl p-2 shadow-lg border">
          <div className="flex space-x-1">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFrequency(option.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  selectedFrequency === option.value
                    ? 'bg-brown-800 text-white shadow-md'
                    : 'text-brown-600 hover:bg-brown-50'
                )}
              >
                {option.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {option.discount}% off
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan, index) => {
          const finalPrice = calculatePrice(plan, selectedFrequency)
          const savings = plan.basePrice - finalPrice
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              <Card className={cn(
                'relative overflow-hidden transition-all duration-300 hover:shadow-2xl',
                plan.popular && 'ring-2 ring-brown-800 scale-105',
                selectedPlan === plan.id && 'ring-2 ring-primary-500'
              )}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-brown-800 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-brown-800 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-brown-600 text-sm mb-4">
                      {plan.description}
                    </p>
                    
                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-brown-800">
                          {getBillingText(selectedFrequency, finalPrice)}
                        </span>
                      </div>
                      {savings > 0 && (
                        <div className="flex items-center justify-center space-x-2 text-sm">
                          <span className="line-through text-gray-400">
                            {formatPrice(plan.basePrice)}
                          </span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Save {formatPrice(savings)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-brown-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benefits Icons */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {plan.benefits.freeShipping && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Truck className="h-4 w-4 text-green-500" />
                        <span className="text-brown-600">Free Shipping</span>
                      </div>
                    )}
                    {plan.benefits.prioritySupport && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-brown-600">Priority Support</span>
                      </div>
                    )}
                    {plan.benefits.exclusiveProducts && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Gift className="h-4 w-4 text-purple-500" />
                        <span className="text-brown-600">Exclusive Items</span>
                      </div>
                    )}
                    {plan.benefits.nutritionConsults && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-brown-600">Nutrition Consults</span>
                      </div>
                    )}
                  </div>

                  {/* Product Range */}
                  <div className="bg-gray-900 rounded-lg p-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brown-600">Products per delivery:</span>
                      <span className="font-semibold text-brown-800">
                        {plan.minProducts}-{plan.maxProducts} items
                      </span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={cn(
                      'w-full transition-all duration-300',
                      plan.popular 
                        ? 'bg-brown-800 hover:bg-brown-900' 
                        : selectedPlan === plan.id
                        ? 'bg-primary-600 hover:bg-primary-700'
                        : 'bg-brown-700 hover:bg-brown-800'
                    )}
                    size="lg"
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Additional Benefits */}
      <motion.div 
        className="bg-gradient-to-r from-brown-50 to-primary-50 rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-bold text-brown-800 mb-6 text-center">
          Why Choose Tishya Foods Subscription?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Percent className="h-8 w-8 text-green-500" />
            </div>
            <h4 className="font-semibold text-brown-800 mb-2">Save More</h4>
            <p className="text-sm text-brown-600">
              Up to 25% off regular prices with quarterly subscriptions
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <h4 className="font-semibold text-brown-800 mb-2">Flexible</h4>
            <p className="text-sm text-brown-600">
              Pause, skip, or cancel anytime. Change frequency as needed
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Package className="h-8 w-8 text-purple-500" />
            </div>
            <h4 className="font-semibold text-brown-800 mb-2">Curated</h4>
            <p className="text-sm text-brown-600">
              Hand-picked products based on your preferences and goals
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h4 className="font-semibold text-brown-800 mb-2">Support</h4>
            <p className="text-sm text-brown-600">
              Dedicated nutrition support and personalized guidance
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}