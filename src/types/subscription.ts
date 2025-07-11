// Subscription management type definitions

export interface SubscriptionCustomization {
  selectedProducts: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  deliveryDate: string
  deliveryFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  preferences: {
    dietaryRestrictions: string[]
    allergies: string[]
    goals: string[]
  }
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: {
    id: string
    type: 'card' | 'upi' | 'netbanking'
    lastFour?: string
  }
  specialInstructions?: string
}

export interface SubscriptionState {
  selectedPlan?: SubscriptionPlan
  customization?: SubscriptionCustomization
  subscriptionId?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  frequency: 'weekly' | 'biweekly' | 'monthly'
  products: Array<{
    id: string
    name: string
    quantity: number
  }>
  features: string[]
  popular?: boolean
  discount?: number
}