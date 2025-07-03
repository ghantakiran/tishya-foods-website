'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Package, 
  Settings, 
  Pause, 
  Play, 
  SkipForward,
  Edit3,
  Trash2,
  Clock,
  Truck,
  CreditCard,
  Gift,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import { Product } from '@/types'

interface Subscription {
  id: string
  planName: string
  status: 'active' | 'paused' | 'cancelled'
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  nextDelivery: Date
  lastDelivery?: Date
  products: Array<{ product: Product; quantity: number }>
  totalPrice: number
  discount: number
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: {
    type: 'card' | 'upi' | 'wallet'
    last4: string
    brand: string
  }
  preferences: {
    dietaryRestrictions: string[]
    nutritionGoal: string
    specialInstructions: string
  }
  createdAt: Date
  upcomingSkips: Date[]
}

interface DeliveryHistory {
  id: string
  subscriptionId: string
  deliveryDate: Date
  status: 'delivered' | 'shipped' | 'pending' | 'failed'
  products: Array<{ product: Product; quantity: number }>
  totalPrice: number
  trackingNumber?: string
}

// Mock data
const mockSubscription: Subscription = {
  id: 'sub_001',
  planName: 'Family Nutrition',
  status: 'active',
  frequency: 'monthly',
  nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  lastDelivery: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
  products: [],
  totalPrice: 5999,
  discount: 15,
  deliveryAddress: {
    street: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001'
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa'
  },
  preferences: {
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
    nutritionGoal: 'maintenance',
    specialInstructions: 'Please deliver in the morning'
  },
  createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  upcomingSkips: []
}

const mockDeliveryHistory: DeliveryHistory[] = [
  {
    id: 'del_001',
    subscriptionId: 'sub_001',
    deliveryDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    status: 'delivered',
    products: [],
    totalPrice: 5999,
    trackingNumber: 'TF1234567890'
  },
  {
    id: 'del_002',
    subscriptionId: 'sub_001',
    deliveryDate: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000),
    status: 'delivered',
    products: [],
    totalPrice: 5999,
    trackingNumber: 'TF1234567891'
  }
]

interface SubscriptionDashboardProps {
  subscription?: Subscription
  onEdit?: () => void
  onCancel?: () => void
}

export function SubscriptionDashboard({ 
  subscription = mockSubscription,
  onEdit,
  onCancel 
}: SubscriptionDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'schedule' | 'history'>('overview')
  const [isManaging, setIsManaging] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'paused':
        return <Pause className="h-5 w-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-100'
    }
  }

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-100'
    }
  }

  const handlePauseToggle = () => {
    // Implementation for pause/resume subscription
    console.log('Toggle subscription pause')
  }

  const handleSkipNext = () => {
    // Implementation for skipping next delivery
    console.log('Skip next delivery')
  }

  const handleUpdateFrequency = (frequency: string) => {
    // Implementation for updating delivery frequency
    console.log('Update frequency to:', frequency)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Package },
    { id: 'products', name: 'Products', icon: Gift },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'history', name: 'History', icon: Clock }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-800 mb-2">
            My Subscription
          </h1>
          <div className="flex items-center space-x-3">
            {getStatusIcon(subscription.status)}
            <Badge className={getStatusColor(subscription.status)}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
            <span className="text-brown-600">{subscription.planName}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={onEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Subscription
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCancelDialog(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-brown-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={handlePauseToggle}
            className="flex items-center justify-center space-x-2 h-16"
          >
            {subscription.status === 'active' ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Pause Subscription</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Resume Subscription</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSkipNext}
            className="flex items-center justify-center space-x-2 h-16"
          >
            <SkipForward className="h-5 w-5" />
            <span>Skip Next Delivery</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsManaging(true)}
            className="flex items-center justify-center space-x-2 h-16"
          >
            <Settings className="h-5 w-5" />
            <span>Manage Settings</span>
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-600">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-brown-800 text-brown-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-600'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Next Delivery */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brown-800 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Next Delivery
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-brown-600">Date:</span>
                  <span className="font-semibold">{formatDate(subscription.nextDelivery)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-600">Frequency:</span>
                  <span className="font-semibold capitalize">{subscription.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-600">Items:</span>
                  <span className="font-semibold">{subscription.products.length} products</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-brown-600">Total:</span>
                  <span className="text-xl font-bold text-brown-800">
                    {formatPrice(subscription.totalPrice)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brown-800 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    {subscription.paymentMethod.brand.toUpperCase()}
                  </div>
                  <span>•••• •••• •••• {subscription.paymentMethod.last4}</span>
                </div>
                <Button variant="outline" size="sm">
                  Update Payment Method
                </Button>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brown-800 mb-4">
                Delivery Address
              </h3>
              <div className="text-brown-600">
                <p>{subscription.deliveryAddress.street}</p>
                <p>
                  {subscription.deliveryAddress.city}, {subscription.deliveryAddress.state} {subscription.deliveryAddress.zipCode}
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Update Address
                </Button>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brown-800 mb-4">
                Preferences
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-brown-600 text-sm">Dietary Restrictions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subscription.preferences.dietaryRestrictions.map((restriction) => (
                      <Badge key={restriction} variant="secondary" className="text-xs">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-brown-600 text-sm">Nutrition Goal:</span>
                  <p className="text-brown-800 capitalize">{subscription.preferences.nutritionGoal}</p>
                </div>
                {subscription.preferences.specialInstructions && (
                  <div>
                    <span className="text-brown-600 text-sm">Special Instructions:</span>
                    <p className="text-brown-800 text-sm">{subscription.preferences.specialInstructions}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-brown-800">
                  Subscription Products
                </h3>
                <Button variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modify Products
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscription.products.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-brown-800 mb-2">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-brown-600 mb-3">
                      Quantity: {item.quantity}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brown-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brown-800 mb-6">
                Delivery Schedule
              </h3>
              
              <div className="space-y-6">
                {/* Frequency Settings */}
                <div>
                  <h4 className="font-medium text-brown-800 mb-3">Delivery Frequency</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['weekly', 'biweekly', 'monthly', 'quarterly'].map((freq) => (
                      <Button
                        key={freq}
                        variant={subscription.frequency === freq ? "default" : "outline"}
                        onClick={() => handleUpdateFrequency(freq)}
                        className="capitalize"
                      >
                        {freq}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Upcoming Deliveries */}
                <div>
                  <h4 className="font-medium text-brown-800 mb-3">Upcoming Deliveries</h4>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => {
                      const date = new Date(subscription.nextDelivery)
                      date.setMonth(date.getMonth() + i)
                      
                      return (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{formatDate(date)}</span>
                            <span className="text-sm text-brown-600 ml-2">
                              {i === 0 ? '(Next)' : ''}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <SkipForward className="h-4 w-4 mr-1" />
                            Skip
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brown-800 mb-6">
                Delivery History
              </h3>
              
              <div className="space-y-4">
                {mockDeliveryHistory.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getDeliveryStatusColor(delivery.status)}>
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        </Badge>
                        <span className="font-medium">{formatDate(delivery.deliveryDate)}</span>
                      </div>
                      <span className="font-bold">{formatPrice(delivery.totalPrice)}</span>
                    </div>
                    
                    {delivery.trackingNumber && (
                      <div className="text-sm text-brown-600">
                        Tracking: {delivery.trackingNumber}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Subscription Dialog */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCancelDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-brown-800 mb-4">
                Cancel Subscription
              </h3>
              <p className="text-brown-600 mb-6">
                Are you sure you want to cancel your subscription? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1"
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onCancel?.()
                    setShowCancelDialog(false)
                  }}
                  className="flex-1"
                >
                  Cancel Subscription
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}