'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowLeft, ArrowRight, ShoppingBag, CreditCard, MapPin, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { usePayment } from '@/contexts/payment-context'
import { CheckoutSummary } from './checkout-summary'
import { AddressForm } from './address-form'
import { PaymentMethodSelection } from './payment-method-selection'
import { OrderConfirmation } from './order-confirmation'
import { PaymentAddress } from '@/types/payment'

interface CheckoutStep {
  id: number
  title: string
  icon: React.ReactNode
  completed: boolean
}

export function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [billingAddress, setBillingAddress] = useState<PaymentAddress | null>(null)
  const [shippingAddress, setShippingAddress] = useState<PaymentAddress | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const { cart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { methods, initializePayment, processPayment, isProcessing } = usePayment()

  const steps: CheckoutStep[] = [
    {
      id: 1,
      title: 'Cart Review',
      icon: <ShoppingBag className="h-5 w-5" />,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Shipping Address',
      icon: <MapPin className="h-5 w-5" />,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Payment Method',
      icon: <CreditCard className="h-5 w-5" />,
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Order Confirmation',
      icon: <Package className="h-5 w-5" />,
      completed: orderPlaced
    }
  ]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // In a real app, you'd redirect to login page
      console.log('User must be logged in to checkout')
    }
  }, [isAuthenticated])

  // Pre-fill address from user profile
  useEffect(() => {
    if (user && !shippingAddress) {
      const userAddress: PaymentAddress = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
      }
      setShippingAddress(userAddress)
      if (sameAsShipping) {
        setBillingAddress(userAddress)
      }
    }
  }, [user, shippingAddress, sameAsShipping])

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return cart && cart.items.length > 0
      case 2:
        return shippingAddress && billingAddress
      case 3:
        return selectedPaymentMethod
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleAddressSubmit = (shipping: PaymentAddress, billing: PaymentAddress, isSame: boolean) => {
    setShippingAddress(shipping)
    setBillingAddress(billing)
    setSameAsShipping(isSame)
    handleNext()
  }

  const handlePaymentSelection = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  const handlePlaceOrder = async () => {
    if (!cart || !shippingAddress || !billingAddress || !selectedPaymentMethod) {
      return
    }

    const paymentMethod = methods.find(m => m.id === selectedPaymentMethod)
    if (!paymentMethod) return

    try {
      const checkoutData = {
        cartId: cart.id,
        items: cart.items,
        subtotal: cart.totalPrice,
        taxes: 0,
        shipping: cart.shippingCost,
        discount: cart.discountAmount,
        total: cart.finalTotal,
        currency: 'INR' as const,
        billingAddress,
        shippingAddress,
        sameAsShipping,
        paymentMethod,
        notes: ''
      }

      const paymentId = await initializePayment(checkoutData)

      // For COD, order is completed immediately
      if (paymentMethod.type === 'cod') {
        setOrderPlaced(true)
        setCurrentStep(4)
      } else {
        // For online payments, simulate payment processing
        const success = await processPayment(paymentId, {})
        if (success) {
          setOrderPlaced(true)
          setCurrentStep(4)
        }
      }
    } catch (error) {
      console.error('Order placement failed:', error)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-100">Your cart is empty</h2>
          <p className="text-gray-600">Add some products to get started!</p>
          <Button>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Checkout progress">
            <ol className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        step.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : currentStep === step.id
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-500'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        step.completed || currentStep === step.id
                          ? 'text-gray-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 ml-4 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-sm border p-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="cart-review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
                    <div className="space-y-4">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <p className="text-sm text-green-600">{item.nutritionalInfo.protein}g protein</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="address-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AddressForm
                      initialShippingAddress={shippingAddress}
                      initialBillingAddress={billingAddress}
                      initialSameAsShipping={sameAsShipping}
                      onSubmit={handleAddressSubmit}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="payment-method"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaymentMethodSelection
                      methods={methods}
                      selectedMethod={selectedPaymentMethod}
                      onSelect={handlePaymentSelection}
                      orderTotal={cart.finalTotal}
                    />
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="order-confirmation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OrderConfirmation
                      cart={cart}
                      shippingAddress={shippingAddress!}
                      paymentMethod={methods.find(m => m.id === selectedPaymentMethod)!}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>

                {currentStep === 3 ? (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!canProceedToNext() || isProcessing}
                    loading={isProcessing}
                    className="flex items-center space-x-2"
                  >
                    <span>Place Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    className="flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}