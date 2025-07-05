'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionPlans } from '@/components/subscription/subscription-plans'
import { SubscriptionCustomizer } from '@/components/subscription/subscription-customizer'
import { SubscriptionDashboard } from '@/components/subscription/subscription-dashboard'
import { useRoutePerformance } from '@/components/performance/performance-init'
import type { SubscriptionPlan, SubscriptionCustomization, SubscriptionState } from '@/types/subscription'

type SubscriptionFlow = 'plans' | 'customize' | 'dashboard' | 'success'

export default function SubscriptionPage() {
  const [currentFlow, setCurrentFlow] = useState<SubscriptionFlow>('plans')
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({})
  
  // Performance tracking
  useRoutePerformance('subscription')

  const handlePlanSelection = (plan: SubscriptionPlan) => {
    setSubscriptionState(prev => ({ ...prev, selectedPlan: plan }))
    setCurrentFlow('customize')
  }

  const handleCustomizationComplete = (customization: SubscriptionCustomization) => {
    setSubscriptionState(prev => ({ 
      ...prev, 
      customization,
      subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9)
    }))
    setCurrentFlow('success')
  }

  const handleGoToDashboard = () => {
    setCurrentFlow('dashboard')
  }

  const handleBackToPlans = () => {
    setCurrentFlow('plans')
    setSubscriptionState({})
  }

  const handleEditSubscription = () => {
    setCurrentFlow('customize')
  }

  const handleCancelSubscription = () => {
    // Implementation for canceling subscription
    console.log('Subscription cancelled')
    setCurrentFlow('plans')
    setSubscriptionState({})
  }

  return (
    <div className="pt-20 min-h-screen bg-earth-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Plans Selection */}
          {currentFlow === 'plans' && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SubscriptionPlans onSelectPlan={handlePlanSelection} />
            </motion.div>
          )}

          {/* Customization */}
          {currentFlow === 'customize' && subscriptionState.selectedPlan && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBackToPlans}
                  className="text-cream-300 hover:text-cream-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plans
                </Button>
              </div>
              
              <SubscriptionCustomizer
                plan={subscriptionState.selectedPlan}
                onComplete={handleCustomizationComplete}
                onBack={handleBackToPlans}
              />
            </motion.div>
          )}

          {/* Success Page */}
          {currentFlow === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
              >
                <CheckCircle className="h-12 w-12 text-green-500" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl font-bold text-cream-100 mb-4"
              >
                Subscription Created Successfully!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-cream-300 mb-8 max-w-2xl mx-auto"
              >
                Welcome to your personalized nutrition journey! Your first delivery will arrive on{' '}
                {subscriptionState.customization?.deliveryDate && 
                  new Date(subscriptionState.customization.deliveryDate).toLocaleDateString()
                }.
              </motion.p>

              {/* Subscription Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-earth-800 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mb-8"
              >
                <h3 className="text-xl font-semibold text-cream-100 mb-6">Your Subscription</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-medium text-cream-100 mb-2">Plan</h4>
                    <p className="text-cream-300">{subscriptionState.selectedPlan?.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-cream-100 mb-2">Frequency</h4>
                    <p className="text-cream-300 capitalize">{subscriptionState.selectedPlan?.frequency}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-cream-100 mb-2">Products</h4>
                    <p className="text-cream-300">
                      {subscriptionState.customization?.selectedProducts?.length || 0} items selected
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-cream-100 mb-2">Subscription ID</h4>
                    <p className="text-cream-300 font-mono text-sm">{subscriptionState.subscriptionId}</p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={handleGoToDashboard}
                  size="lg"
                  className="bg-earth-800 hover:bg-earth-900"
                >
                  View Subscription Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBackToPlans}
                  size="lg"
                >
                  Create Another Subscription
                </Button>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-12 text-left max-w-2xl mx-auto"
              >
                <h3 className="text-lg font-semibold text-cream-100 mb-4">What happens next?</h3>
                <div className="space-y-3 text-cream-300">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <p>We&apos;ll prepare your personalized selection based on your preferences</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <p>You&apos;ll receive an email confirmation with tracking details</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <p>Your first delivery will arrive fresh at your doorstep</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-earth-800 text-cream-100 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <p>Manage your subscription anytime through your dashboard</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Dashboard */}
          {currentFlow === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SubscriptionDashboard
                onEdit={handleEditSubscription}
                onCancel={handleCancelSubscription}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}