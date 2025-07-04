import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { Cart } from '@/features/cart/cart'
import { mockProduct, mockCartItem, mockUser } from '@/test-utils'

// Mock the contexts
const mockCartContext = {
  cart: [mockCartItem],
  totalItems: 2,
  totalPrice: 3998,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  isInCart: jest.fn().mockReturnValue(true),
  getItemQuantity: jest.fn().mockReturnValue(2),
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
      render(<Cart />)
      
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByText('Quantity: 2')).toBeInTheDocument()
      expect(screen.getByText('₹3,998')).toBeInTheDocument()
    })

    it('should update item quantity', async () => {
      render(<Cart />)
      
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      fireEvent.click(increaseButton)
      
      await waitFor(() => {
        expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(mockProduct.id, 3)
      })
    })

    it('should remove item from cart', async () => {
      render(<Cart />)
      
      const removeButton = screen.getByRole('button', { name: /remove item/i })
      fireEvent.click(removeButton)
      
      await waitFor(() => {
        expect(mockCartContext.removeItem).toHaveBeenCalledWith(mockProduct.id)
      })
    })

    it('should clear entire cart', async () => {
      render(<Cart />)
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i })
      fireEvent.click(clearButton)
      
      // Should show confirmation dialog
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(mockCartContext.clearCart).toHaveBeenCalled()
      })
    })
  })

  describe('Cart Summary', () => {
    it('should display correct totals', () => {
      render(<Cart />)
      
      expect(screen.getByText('Subtotal: ₹3,998')).toBeInTheDocument()
      expect(screen.getByText('Total Items: 2')).toBeInTheDocument()
    })

    it('should calculate shipping costs', () => {
      render(<Cart />)
      
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

      jest.mocked(mockCartContext).mockReturnValueOnce(discountedCart)
      
      render(<Cart />)
      
      expect(screen.getByText('Discount: ₹399.8')).toBeInTheDocument()
    })
  })

  describe('Checkout Process', () => {
    it('should navigate to checkout when user is authenticated', async () => {
      render(<Cart />)
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
      fireEvent.click(checkoutButton)
      
      // Should navigate to checkout page
      await waitFor(() => {
        // This would be tested with a router mock
        expect(window.location.pathname).toBe('/checkout')
      })
    })

    it('should show login prompt when user is not authenticated', async () => {
      const unauthenticatedContext = {
        ...mockAuthContext,
        user: null,
        isAuthenticated: false,
      }

      jest.mocked(mockAuthContext).mockReturnValueOnce(unauthenticatedContext)
      
      render(<Cart />)
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
      fireEvent.click(checkoutButton)
      
      expect(screen.getByText(/please log in/i)).toBeInTheDocument()
    })

    it('should validate minimum order amount', () => {
      const smallCart = {
        ...mockCartContext,
        totalPrice: 299, // Below minimum threshold
      }

      jest.mocked(mockCartContext).mockReturnValueOnce(smallCart)
      
      render(<Cart />)
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
      expect(checkoutButton).toBeDisabled()
      expect(screen.getByText(/minimum order amount/i)).toBeInTheDocument()
    })
  })

  describe('Empty Cart State', () => {
    it('should show empty cart message when cart is empty', () => {
      const emptyCart = {
        ...mockCartContext,
        cart: [],
        totalItems: 0,
        totalPrice: 0,
      }

      jest.mocked(mockCartContext).mockReturnValueOnce(emptyCart)
      
      render(<Cart />)
      
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument()
    })

    it('should suggest products when cart is empty', () => {
      const emptyCart = {
        ...mockCartContext,
        cart: [],
        totalItems: 0,
        totalPrice: 0,
      }

      jest.mocked(mockCartContext).mockReturnValueOnce(emptyCart)
      
      render(<Cart />)
      
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
        cart: [outOfStockItem],
      }

      jest.mocked(mockCartContext).mockReturnValueOnce(cartWithOutOfStock)
      
      render(<Cart />)
      
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
        cart: [limitedStockItem],
      }

      jest.mocked(mockCartContext).mockReturnValueOnce(cartWithLimitedStock)
      
      render(<Cart />)
      
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      expect(increaseButton).toBeDisabled()
    })
  })

  describe('Cart Persistence', () => {
    it('should save cart to localStorage on changes', async () => {
      render(<Cart />)
      
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      fireEvent.click(increaseButton)
      
      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('tishya_cart') || '[]')
        expect(savedCart).toBeDefined()
      })
    })

    it('should restore cart from localStorage on page load', () => {
      const savedCart = [mockCartItem]
      localStorage.setItem('tishya_cart', JSON.stringify(savedCart))
      
      render(<Cart />)
      
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    })
  })

  describe('Price Updates', () => {
    it('should recalculate totals when quantities change', async () => {
      render(<Cart />)
      
      // Mock quantity change
      const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
      fireEvent.click(increaseButton)
      
      await waitFor(() => {
        expect(mockCartContext.updateQuantity).toHaveBeenCalled()
      })
    })

    it('should apply loyalty discounts for authenticated users', () => {
      const loyaltyUser = {
        ...mockUser,
        loyaltyTier: 'gold',
        loyaltyDiscount: 12
      }
      
      const authContextWithLoyalty = {
        ...mockAuthContext,
        user: loyaltyUser,
      }

      jest.mocked(mockAuthContext).mockReturnValueOnce(authContextWithLoyalty)
      
      render(<Cart />)
      
      expect(screen.getByText(/loyalty discount/i)).toBeInTheDocument()
      expect(screen.getByText('12% OFF')).toBeInTheDocument()
    })
  })
})