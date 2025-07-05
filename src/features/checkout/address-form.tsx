'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PaymentAddress } from '@/types/payment'

interface AddressFormProps {
  initialShippingAddress: PaymentAddress | null
  initialBillingAddress: PaymentAddress | null
  initialSameAsShipping: boolean
  onSubmit: (shipping: PaymentAddress, billing: PaymentAddress, sameAsShipping: boolean) => void
}

export function AddressForm({
  initialShippingAddress,
  initialBillingAddress,
  initialSameAsShipping,
  onSubmit
}: AddressFormProps) {
  const [shippingAddress, setShippingAddress] = useState<PaymentAddress>(
    initialShippingAddress || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  )

  const [billingAddress, setBillingAddress] = useState<PaymentAddress>(
    initialBillingAddress || { ...shippingAddress }
  )

  const [sameAsShipping, setSameAsShipping] = useState(initialSameAsShipping)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ]

  const validateAddress = (address: PaymentAddress, prefix: string = '') => {
    const newErrors: Record<string, string> = {}

    if (!address.firstName) newErrors[`${prefix}firstName`] = 'First name is required'
    if (!address.lastName) newErrors[`${prefix}lastName`] = 'Last name is required'
    if (!address.email) newErrors[`${prefix}email`] = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(address.email)) newErrors[`${prefix}email`] = 'Email is invalid'
    if (!address.phone) newErrors[`${prefix}phone`] = 'Phone number is required'
    else if (!/^\+?[\d\s-()]{10,}$/.test(address.phone)) newErrors[`${prefix}phone`] = 'Phone number is invalid'
    if (!address.line1) newErrors[`${prefix}line1`] = 'Address line 1 is required'
    if (!address.city) newErrors[`${prefix}city`] = 'City is required'
    if (!address.state) newErrors[`${prefix}state`] = 'State is required'
    if (!address.postalCode) newErrors[`${prefix}postalCode`] = 'Postal code is required'
    else if (!/^\d{6}$/.test(address.postalCode)) newErrors[`${prefix}postalCode`] = 'Enter valid 6-digit postal code'

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const shippingErrors = validateAddress(shippingAddress, 'shipping.')
    const billingErrors = sameAsShipping ? {} : validateAddress(billingAddress, 'billing.')
    const allErrors = { ...shippingErrors, ...billingErrors }

    setErrors(allErrors)

    if (Object.keys(allErrors).length === 0) {
      const finalBillingAddress = sameAsShipping ? { ...shippingAddress } : billingAddress
      onSubmit(shippingAddress, finalBillingAddress, sameAsShipping)
    }
  }

  const handleShippingChange = (field: keyof PaymentAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }))
    if (sameAsShipping) {
      setBillingAddress(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[`shipping.${field}`]) {
      setErrors(prev => ({ ...prev, [`shipping.${field}`]: '' }))
    }
  }

  const handleBillingChange = (field: keyof PaymentAddress, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[`billing.${field}`]) {
      setErrors(prev => ({ ...prev, [`billing.${field}`]: '' }))
    }
  }

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked)
    if (checked) {
      setBillingAddress({ ...shippingAddress })
      // Clear billing errors
      const newErrors = { ...errors }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('billing.')) {
          delete newErrors[key]
        }
      })
      setErrors(newErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Shipping & Billing Information</h2>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <fieldset className="border border-gray-600 rounded-lg p-6 bg-gray-800">
          <legend className="text-lg font-medium px-2 text-gray-100 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-400" />
            Shipping Address
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <fieldset className="md:col-span-2 border border-gray-600 rounded-lg p-4 bg-gray-900">
              <legend className="text-sm font-semibold text-gray-100 px-2">Personal Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Name Fields */}
                <div>
                  <label htmlFor="shipping-firstName" className="block text-sm font-medium text-gray-100 mb-1">
                    First Name <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <Input
                      id="shipping-firstName"
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.firstName'] ? 'border-red-500' : ''}`}
                      placeholder="Enter first name"
                      required
                      aria-invalid={errors['shipping.firstName'] ? 'true' : 'false'}
                      aria-describedby={errors['shipping.firstName'] ? 'shipping-firstName-error' : undefined}
                    />
                  </div>
                  {errors['shipping.firstName'] && (
                    <p id="shipping-firstName-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.firstName']}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shipping-lastName" className="block text-sm font-medium text-gray-100 mb-1">
                    Last Name <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <Input
                    id="shipping-lastName"
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => handleShippingChange('lastName', e.target.value)}
                    className={`bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.lastName'] ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                    required
                    aria-invalid={errors['shipping.lastName'] ? 'true' : 'false'}
                    aria-describedby={errors['shipping.lastName'] ? 'shipping-lastName-error' : undefined}
                  />
                  {errors['shipping.lastName'] && (
                    <p id="shipping-lastName-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.lastName']}</p>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="md:col-span-2 border border-gray-600 rounded-lg p-4 bg-gray-900">
              <legend className="text-sm font-semibold text-gray-100 px-2">Contact Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Contact Fields */}
                <div>
                  <label htmlFor="shipping-email" className="block text-sm font-medium text-gray-100 mb-1">
                    Email Address <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <Input
                      id="shipping-email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.email'] ? 'border-red-500' : ''}`}
                      placeholder="Enter email address"
                      required
                      aria-invalid={errors['shipping.email'] ? 'true' : 'false'}
                      aria-describedby={errors['shipping.email'] ? 'shipping-email-error' : undefined}
                    />
                  </div>
                  {errors['shipping.email'] && (
                    <p id="shipping-email-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.email']}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-100 mb-1">
                    Phone Number <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <Input
                      id="shipping-phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.phone'] ? 'border-red-500' : ''}`}
                      placeholder="+91 98765 43210"
                      required
                      aria-invalid={errors['shipping.phone'] ? 'true' : 'false'}
                      aria-describedby={`shipping-phone-help ${errors['shipping.phone'] ? 'shipping-phone-error' : ''}`}
                    />
                  </div>
                  <p id="shipping-phone-help" className="text-xs text-gray-400 mt-1">
                    Include country code (e.g., +91 for India)
                  </p>
                  {errors['shipping.phone'] && (
                    <p id="shipping-phone-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.phone']}</p>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="md:col-span-2 border border-gray-600 rounded-lg p-4 bg-gray-900">
              <legend className="text-sm font-semibold text-gray-100 px-2">Address Details</legend>
              <div className="space-y-4 mt-3">
                {/* Address Fields */}
                <div>
                  <label htmlFor="shipping-line1" className="block text-sm font-medium text-gray-100 mb-1">
                    Address Line 1 <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <Input
                    id="shipping-line1"
                    type="text"
                    value={shippingAddress.line1}
                    onChange={(e) => handleShippingChange('line1', e.target.value)}
                    className={`bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.line1'] ? 'border-red-500' : ''}`}
                    placeholder="House/Flat number, Building name, Street"
                    required
                    aria-invalid={errors['shipping.line1'] ? 'true' : 'false'}
                    aria-describedby={errors['shipping.line1'] ? 'shipping-line1-error' : undefined}
                  />
                  {errors['shipping.line1'] && (
                    <p id="shipping-line1-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.line1']}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shipping-line2" className="block text-sm font-medium text-gray-100 mb-1">
                    Address Line 2 <span className="text-gray-400">(Optional)</span>
                  </label>
                  <Input
                    id="shipping-line2"
                    type="text"
                    value={shippingAddress.line2}
                    onChange={(e) => handleShippingChange('line2', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Landmark, Area, Locality"
                    aria-describedby="shipping-line2-help"
                  />
                  <p id="shipping-line2-help" className="text-xs text-gray-400 mt-1">
                    Additional address information for easier delivery
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-100 mb-1">
                      City <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <Input
                      id="shipping-city"
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      className={`bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.city'] ? 'border-red-500' : ''}`}
                      placeholder="Enter city"
                      required
                      aria-invalid={errors['shipping.city'] ? 'true' : 'false'}
                      aria-describedby={errors['shipping.city'] ? 'shipping-city-error' : undefined}
                    />
                    {errors['shipping.city'] && (
                      <p id="shipping-city-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.city']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-100 mb-1">
                      State <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <select
                      id="shipping-state"
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 ${
                        errors['shipping.state'] ? 'border-red-500' : ''
                      }`}
                      required
                      aria-invalid={errors['shipping.state'] ? 'true' : 'false'}
                      aria-describedby={errors['shipping.state'] ? 'shipping-state-error' : undefined}
                    >
                      <option value="">Select state</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors['shipping.state'] && (
                      <p id="shipping-state-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.state']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="shipping-postalCode" className="block text-sm font-medium text-gray-100 mb-1">
                      Postal Code <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <Input
                      id="shipping-postalCode"
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                      className={`bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['shipping.postalCode'] ? 'border-red-500' : ''}`}
                      placeholder="6-digit postal code"
                      maxLength={6}
                      required
                      aria-invalid={errors['shipping.postalCode'] ? 'true' : 'false'}
                      aria-describedby={`shipping-postalCode-help ${errors['shipping.postalCode'] ? 'shipping-postalCode-error' : ''}`}
                    />
                    <p id="shipping-postalCode-help" className="text-xs text-gray-400 mt-1">
                      Enter 6-digit Indian postal code
                    </p>
                    {errors['shipping.postalCode'] && (
                      <p id="shipping-postalCode-error" className="text-red-400 text-xs mt-1" role="alert">{errors['shipping.postalCode']}</p>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </fieldset>
      </motion.div>

      {/* Same as Shipping Checkbox */}
      <div className="mb-6 p-4 bg-gray-800 border border-gray-600 rounded-lg">
        <fieldset>
          <legend className="text-sm font-semibold text-gray-100 px-2 mb-3">Billing Address Options</legend>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              id="sameAsShipping"
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => handleSameAsShippingChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
              aria-describedby="sameAsShipping-help"
            />
            <span className="text-sm font-medium text-gray-100">
              Billing address is same as shipping address
            </span>
          </label>
          <p id="sameAsShipping-help" className="text-xs text-gray-400 mt-2 ml-7">
            Check this if you want to use the same address for billing and shipping
          </p>
        </fieldset>
      </div>

      {/* Billing Address */}
      {!sameAsShipping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
          role="region"
          aria-label="Billing address form"
        >
          <fieldset className="border border-gray-600 rounded-lg p-6 bg-gray-800">
            <legend className="text-lg font-medium px-2 text-gray-100 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-400" />
              Billing Address
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <fieldset className="md:col-span-2 border border-gray-600 rounded-lg p-4 bg-gray-900">
                <legend className="text-sm font-semibold text-gray-100 px-2">Billing Contact Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label htmlFor="billing-firstName" className="block text-sm font-medium text-gray-100 mb-1">
                      First Name <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <Input
                      id="billing-firstName"
                      type="text"
                      value={billingAddress.firstName}
                      onChange={(e) => handleBillingChange('firstName', e.target.value)}
                      className={`bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['billing.firstName'] ? 'border-red-500' : ''}`}
                      placeholder="Enter first name"
                      required
                      aria-invalid={errors['billing.firstName'] ? 'true' : 'false'}
                      aria-describedby={errors['billing.firstName'] ? 'billing-firstName-error' : undefined}
                    />
                    {errors['billing.firstName'] && (
                      <p id="billing-firstName-error" className="text-red-400 text-xs mt-1" role="alert">{errors['billing.firstName']}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="billing-lastName" className="block text-sm font-medium text-gray-100 mb-1">
                      Last Name <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <Input
                      id="billing-lastName"
                      type="text"
                      value={billingAddress.lastName}
                      onChange={(e) => handleBillingChange('lastName', e.target.value)}
                      className={`bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${errors['billing.lastName'] ? 'border-red-500' : ''}`}
                      placeholder="Enter last name"
                      required
                      aria-invalid={errors['billing.lastName'] ? 'true' : 'false'}
                      aria-describedby={errors['billing.lastName'] ? 'billing-lastName-error' : undefined}
                    />
                    {errors['billing.lastName'] && (
                      <p id="billing-lastName-error" className="text-red-400 text-xs mt-1" role="alert">{errors['billing.lastName']}</p>
                    )}
                  </div>
                </div>
              </fieldset>
            </div>
          </fieldset>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-describedby="submit-help"
        >
          Continue to Payment
        </Button>
      </div>
      <p id="submit-help" className="text-xs text-gray-400 text-center mt-2">
        Your information is secure and encrypted
      </p>
    </form>
  )
}