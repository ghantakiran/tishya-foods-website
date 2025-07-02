export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: {
    size?: string
    flavor?: string
  }
  nutritionalInfo: {
    protein: number
    calories: number
    servingSize: string
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
  discountAmount: number
  shippingCost: number
  finalTotal: number
  appliedCoupons: string[]
}

export interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (couponCode: string) => Promise<boolean>
  removeCoupon: (couponCode: string) => void
  calculateTotals: () => void
}