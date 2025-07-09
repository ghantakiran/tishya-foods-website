import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { CartProvider } from '@/contexts/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { PaymentProvider } from '@/contexts/payment-context'
import { LoadingProvider } from '@/contexts/loading-context'
import { SubscriptionProvider } from '@/contexts/subscription-context'
import { LoyaltyProvider } from '@/contexts/loyalty-context'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadingProvider>
      <AuthProvider>
        <CartProvider>
          <PaymentProvider>
            <SubscriptionProvider>
              <LoyaltyProvider>
                {children}
              </LoyaltyProvider>
            </SubscriptionProvider>
          </PaymentProvider>
        </CartProvider>
      </AuthProvider>
    </LoadingProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const mockProduct = {
  id: 'prod_001',
  name: 'Test Protein Powder',
  description: 'High-quality protein powder for testing',
  price: 1999,
  originalPrice: 2499,
  images: ['/test-image.jpg'],
  category: {
    id: 'protein',
    name: 'Protein',
    slug: 'protein',
    description: 'Protein products',
    image: '/test-category.jpg',
  },
  tags: ['protein', 'fitness', 'nutrition'],
  ingredients: ['Pea protein', 'Natural flavors'],
  nutritionalInfo: {
    servingSize: '30g',
    servingsPerContainer: 30,
    calories: 120,
    protein: 25,
    carbs: 3,
    fat: 2,
    fiber: 1,
    sugar: 2,
    sodium: 50,
    vitaminC: 10,
    iron: 2,
    calcium: 20,
    potassium: 100,
  },
  allergens: ['soy'],
  certifications: ['ISO', 'FSSAI'],
  isGlutenFree: true,
  isVegan: false,
  isOrganic: true,
  isKeto: false,
  isDairy: false,
  stock: 10,
  featured: true,
  averageRating: 4.7,
  reviewCount: 123,
  variants: [
    { id: 'v1', name: 'Size', value: '1kg', price: 1999, stock: 5 },
    { id: 'v2', name: 'Size', value: '500g', price: 1099, stock: 5 },
  ],
  preparationTime: '1 min',
  shelfLife: '12 months',
  storageInstructions: 'Store in a cool, dry place',
  servingSuggestions: ['Mix with water', 'Add to smoothie'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-10T00:00:00Z',
}

export const mockUser = {
  id: 'user_001',
  email: 'test@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  phone: '+91 9876543210',
  addresses: [
    {
      id: 'addr_001',
      type: 'home',
      street: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      isDefault: true
    }
  ],
  preferences: {
    dietaryRestrictions: ['vegetarian'],
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
}

export const mockCartItem = {
  id: 'cart_001',
  product: mockProduct,
  quantity: 2,
  selectedSize: 'medium',
  addedAt: new Date()
}

export const mockOrder = {
  id: 'order_001',
  userId: 'user_001',
  items: [mockCartItem],
  status: 'pending',
  total: 3998,
  subtotal: 3998,
  tax: 0,
  shipping: 0,
  discount: 0,
  shippingAddress: mockUser.addresses[0],
  billingAddress: mockUser.addresses[0],
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'visa'
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

export const mockSubscription = {
  id: 'sub_001',
  planId: 'plan_family',
  planName: 'Family Nutrition',
  status: 'active',
  frequency: 'monthly',
  nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  products: [{ product: mockProduct, quantity: 1 }],
  totalPrice: 5999,
  discount: 15,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const mockLoyaltyMember = {
  id: 'mem_001',
  userId: 'user_001',
  currentPoints: 1500,
  lifetimePoints: 3000,
  currentTier: 'silver',
  nextTier: 'gold',
  pointsToNextTier: 1000,
  joinDate: new Date('2024-01-01'),
  lastActivity: new Date(),
  streakDays: 15,
  totalOrders: 20,
  totalSpent: 15000,
  referrals: 3,
  achievements: ['first-order', 'big-spender'],
  referralCode: 'TISHYA-TEST-2024'
}

// Mock API responses
export const mockApiResponse = {
  success: (data: any = {}) => ({
    success: true,
    data,
    message: 'Operation successful'
  }),
  error: (message = 'Something went wrong', code = 500) => ({
    success: false,
    error: {
      message,
      code
    }
  }),
  loading: () => ({
    loading: true
  })
}

// Test helpers
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  })
  window.IntersectionObserver = mockIntersectionObserver
}

export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Custom matchers
export const customMatchers = {
  toBeInTheDocument: (received: any) => {
    const pass = received && document.body.contains(received)
    return {
      message: () => 
        pass
          ? `expected element not to be in the document`
          : `expected element to be in the document`,
      pass,
    }
  }
}

// Utility to create a canonical CartItem from a Product
export function createCartItemFromProduct(product, quantity = 1) {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    quantity,
    nutritionalInfo: {
      protein: product.nutritionalInfo.protein,
      calories: product.nutritionalInfo.calories,
      servingSize: product.nutritionalInfo.servingSize,
    },
  }
}