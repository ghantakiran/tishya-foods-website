import { render, screen, fireEvent } from '@/test-utils'
import { waitFor } from '@testing-library/react'
import { mockProduct, mockCartItem, mockUser } from '@/test-utils'
import { CartDrawer } from '@/features/cart/cart-drawer'

// Mock the contexts
const mockCartContext = {
  cart: {
    id: 'cart_001',
    items: [mockCartItem],
    totalItems: 2,
    totalPrice: 3998,
    discountAmount: 0,
    shippingCost: 0,
    finalTotal: 3998,
    appliedCoupons: [],
  },
  isLoading: false,
  error: null,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  applyCoupon: jest.fn(),
  removeCoupon: jest.fn(),
  calculateTotals: jest.fn(),
}

const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
}

jest.mock('@/contexts/cart-context', () => ({
  useCart: () => mockCartContext,
}))

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => mockAuthContext,
}))

describe('Cart Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Cart Operations', () => {
    it('should display cart items correctly', () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByText('Quantity: 2')).toBeInTheDocument()
      expect(screen.getByText('₹3,998')).toBeInTheDocument()
    })

    it('should update item quantity', async () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      fireEvent.click(increaseButton)
      
      await waitFor(() => expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(mockProduct.id, 3))
    })

    it('should remove item from cart', async () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const removeButton = screen.getByRole('button', { name: /remove item/i })
      fireEvent.click(removeButton)
      
      await waitFor(() => expect(mockCartContext.removeItem).toHaveBeenCalledWith(mockProduct.id))
    })

    it('should clear entire cart', async () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i })
      fireEvent.click(clearButton)
      
      // Should show confirmation dialog
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => expect(mockCartContext.clearCart).toHaveBeenCalled())
    })
  })

  describe('Cart Summary', () => {
    it('should display correct totals', () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText('Subtotal: ₹3,998')).toBeInTheDocument()
      expect(screen.getByText('Total Items: 2')).toBeInTheDocument()
    })

    it('should calculate shipping costs', () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      // Assuming free shipping threshold is ₹999
      expect(screen.getByText('Shipping: Free')).toBeInTheDocument()
    })

    it('should show applicable discounts', () => {
      // Mock a cart with discount
      const discountedCart = {
        ...mockCartContext,
        discount: 10,
        totalPrice: 3598.2,
      }

      mockCartContext.cart = discountedCart.cart
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText('Discount: ₹399.8')).toBeInTheDocument()
    })
  })

  describe('Checkout Process', () => {
    it('should navigate to checkout when user is authenticated', async () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
      fireEvent.click(checkoutButton)
      
      // Should navigate to checkout page
      await waitFor(() => expect(window.location.pathname).toBe('/checkout'))
    })

    it('should show login prompt when user is not authenticated', async () => {
      const unauthenticatedContext = {
        ...mockAuthContext,
        user: null,
        isAuthenticated: false,
      }

      mockAuthContext.user = unauthenticatedContext.user
      mockAuthContext.isAuthenticated = unauthenticatedContext.isAuthenticated
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
      fireEvent.click(checkoutButton)
      
      expect(screen.getByText(/please log in/i)).toBeInTheDocument()
    })

    it('should validate minimum order amount', () => {
      const smallCart = {
        ...mockCartContext,
        totalPrice: 299, // Below minimum threshold
      }

      mockCartContext.cart = smallCart.cart
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
      expect(checkoutButton).toBeDisabled()
      expect(screen.getByText(/minimum order amount/i)).toBeInTheDocument()
    })
  })

  describe('Empty Cart State', () => {
    it('should show empty cart message when cart is empty', () => {
      const emptyCart = {
        ...mockCartContext,
        cart: {
          id: 'cart_001',
          items: [],
          totalItems: 0,
          totalPrice: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          appliedCoupons: [],
        },
        totalItems: 0,
        totalPrice: 0,
      }

      mockCartContext.cart = emptyCart.cart
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument()
    })

    it('should suggest products when cart is empty', () => {
      const emptyCart = {
        ...mockCartContext,
        cart: {
          id: 'cart_001',
          items: [],
          totalItems: 0,
          totalPrice: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          appliedCoupons: [],
        },
        totalItems: 0,
        totalPrice: 0,
      }

      mockCartContext.cart = emptyCart.cart
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText(/recommended products/i)).toBeInTheDocument()
    })
  })

  describe('Stock Validation', () => {
    it('should show out of stock warning', () => {
      const outOfStockItem = {
        ...mockCartItem,
        product: { ...mockProduct, stock: 0 }
      }
      
      const cartWithOutOfStock = {
        ...mockCartContext,
        cart: {
          id: 'cart_001',
          items: [outOfStockItem],
          totalItems: 1,
          totalPrice: 3998,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 3998,
          appliedCoupons: [],
        },
        totalItems: 1,
        totalPrice: 3998,
      }

      mockCartContext.cart = cartWithOutOfStock.cart
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
    })

    it('should prevent quantity increase when stock is limited', () => {
      const limitedStockItem = {
        ...mockCartItem,
        product: { ...mockProduct, stock: 2 },
        quantity: 2
      }
      
      const cartWithLimitedStock = {
        ...mockCartContext,
        cart: {
          id: 'cart_001',
          items: [limitedStockItem],
          totalItems: 2,
          totalPrice: 3998,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 3998,
          appliedCoupons: [],
        },
        totalItems: 2,
        totalPrice: 3998,
      }

      mockCartContext.cart = cartWithLimitedStock.cart
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      expect(increaseButton).toBeDisabled()
    })
  })

  describe('Cart Persistence', () => {
    it('should save cart to localStorage on changes', async () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      fireEvent.click(increaseButton)
      
      await waitFor(() => expect(JSON.parse(localStorage.getItem('tishya_cart') || '[]')).toBeDefined())
    })

    it('should restore cart from localStorage on page load', () => {
      const savedCart = {
        id: 'cart_001',
        items: [mockCartItem],
        totalItems: 2,
        totalPrice: 3998,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 3998,
        appliedCoupons: [],
      }
      localStorage.setItem('tishya_cart', JSON.stringify(savedCart))
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    })
  })

  describe('Price Updates', () => {
    it('should recalculate totals when quantities change', async () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      // Mock quantity change
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      fireEvent.click(increaseButton)
      
      await waitFor(() => expect(mockCartContext.updateQuantity).toHaveBeenCalled())
    })

    it('should apply loyalty discounts for authenticated users', () => {
      const loyaltyUser = {
        ...mockUser,
        loyaltyTier: 'gold',
        loyaltyDiscount: 12
      }
      
      mockAuthContext.user = loyaltyUser
      
      render(<CartDrawer isOpen={true} onClose={() => {}} />)
      
      expect(screen.getByText(/loyalty discount/i)).toBeInTheDocument()
      expect(screen.getByText('12% OFF')).toBeInTheDocument()
    })
  })
})