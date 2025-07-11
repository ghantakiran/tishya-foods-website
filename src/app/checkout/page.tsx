'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft, ArrowRight, ShoppingBag, CreditCard, MapPin, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Metadata } from 'next'

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    name: 'Premium Mixed Nuts',
    price: 299,
    quantity: 2,
    image: '/products/mixed-nuts.jpg'
  },
  {
    id: '2',
    name: 'Natural Protein Bar',
    price: 45,
    quantity: 3,
    image: '/products/protein-bar.jpg'
  }
]

const mockCartTotal = {
  subtotal: mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  shipping: 50,
  tax: 85,
  total: 0
}
mockCartTotal.total = mockCartTotal.subtotal + mockCartTotal.shipping + mockCartTotal.tax

const steps = [
  { id: 1, title: 'Cart Review', icon: <ShoppingBag className="h-5 w-5" /> },
  { id: 2, title: 'Shipping', icon: <MapPin className="h-5 w-5" /> },
  { id: 3, title: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
  { id: 4, title: 'Confirmation', icon: <CheckCircle className="h-5 w-5" /> }
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      setOrderPlaced(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (orderPlaced) {
    return (
      <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
              <p className="text-gray-300 mb-8">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockCartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-700">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{item.name}</h3>
                          <p className="text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-white font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                        <Input id="firstName" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                        <Input id="lastName" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-gray-300">Address</Label>
                      <Input id="address" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-gray-300">City</Label>
                        <Input id="city" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-gray-300">State</Label>
                        <Input id="state" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="pincode" className="text-gray-300">Pincode</Label>
                        <Input id="pincode" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="payment" className="text-blue-600" />
                        <span className="text-white">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="payment" className="text-blue-600" />
                        <span className="text-white">UPI</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="payment" className="text-blue-600" />
                        <span className="text-white">Cash on Delivery</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{mockCartTotal.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>₹{mockCartTotal.shipping}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>₹{mockCartTotal.tax}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{mockCartTotal.total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    {currentStep > 1 && (
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {currentStep === 4 ? 'Place Order' : 'Continue'}
                      {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}