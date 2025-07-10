import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { CartDrawer } from '@/features/cart/cart-drawer'
import { useCart } from '@/contexts/cart-context'
import { mockProduct, createCartItemFromProduct } from '@/test-utils'

// Mock the cart context
jest.mock('@/contexts/cart-context', () => ({
  useCart: jest.fn(),
}))

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

const mockCartContextValue = {
  cart: {
    id: 'cart_123',
    items: [],
    totalItems: 0,
    totalPrice: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    couponCode: null,
  },
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  isInCart: jest.fn(),
  getItemQuantity: jest.fn(),
  applyCoupon: jest.fn(),
  removeCoupon: jest.fn(),
  isLoading: false,
}

describe('CartDrawer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCart.mockReturnValue(mockCartContextValue)
  })

  it('renders empty cart state', () => {
    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('Your Cart')).toBeInTheDocument()
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Start shopping to add items to your cart')).toBeInTheDocument()
  })

  it('renders cart items when present', () => {
    const cartItem = createCartItemFromProduct(mockProduct, 2)
    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItem],
        totalItems: 2,
        totalPrice: 3998,
        subtotal: 3998,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getByText('₹39.98')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })

  it('handles quantity changes', () => {
    const cartItem = createCartItemFromProduct(mockProduct, 1)
    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItem],
        totalItems: 1,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    const increaseButton = screen.getByLabelText('Increase quantity')
    fireEvent.click(increaseButton)

    expect(cartWithItems.updateQuantity).toHaveBeenCalledWith(cartItem.id, 2)
  })

  it('handles item removal', () => {
    const cartItem = createCartItemFromProduct(mockProduct, 1)
    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItem],
        totalItems: 1,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    const removeButton = screen.getByLabelText('Remove item')
    fireEvent.click(removeButton)

    expect(cartWithItems.removeItem).toHaveBeenCalledWith(cartItem.id)
  })

  it('displays correct total amounts', () => {
    const cartItem = createCartItemFromProduct(mockProduct, 2)
    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItem],
        totalItems: 2,
        subtotal: 3998,
        tax: 400,
        shipping: 100,
        discount: 200,
        totalPrice: 4298,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('₹39.98')).toBeInTheDocument() // Subtotal
    expect(screen.getByText('₹4.00')).toBeInTheDocument()  // Tax
    expect(screen.getByText('₹1.00')).toBeInTheDocument()  // Shipping
    expect(screen.getByText('-₹2.00')).toBeInTheDocument() // Discount
    expect(screen.getByText('₹42.98')).toBeInTheDocument() // Total
  })

  it('handles coupon application', async () => {
    const cartItem = createCartItemFromProduct(mockProduct, 1)
    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItem],
        totalItems: 1,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    const couponInput = screen.getByPlaceholderText('Enter coupon code')
    const applyButton = screen.getByText('Apply')

    fireEvent.change(couponInput, { target: { value: 'SAVE10' } })
    fireEvent.click(applyButton)

    expect(cartWithItems.applyCoupon).toHaveBeenCalledWith('SAVE10')
  })

  it('navigates to checkout when checkout button is clicked', () => {
    const cartItem = createCartItemFromProduct(mockProduct, 1)
    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItem],
        totalItems: 1,
        totalPrice: 1999,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }))

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    const checkoutButton = screen.getByText('Proceed to Checkout')
    fireEvent.click(checkoutButton)

    // Should navigate to checkout page
    expect(mockPush).toHaveBeenCalledWith('/checkout')
  })

  it('shows loading state', () => {
    const loadingCart = {
      ...mockCartContextValue,
      isLoading: true,
    }

    mockUseCart.mockReturnValue(loadingCart)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles drawer close', () => {
    const onClose = jest.fn()
    render(<CartDrawer isOpen={true} onClose={onClose} />)

    const closeButton = screen.getByLabelText('Close cart')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('displays item variants correctly', () => {
    const cartItemWithVariant = {
      ...createCartItemFromProduct(mockProduct, 1),
      variant: { size: '1kg' },
    }

    const cartWithItems = {
      ...mockCartContextValue,
      cart: {
        ...mockCartContextValue.cart,
        items: [cartItemWithVariant],
        totalItems: 1,
      },
    }

    mockUseCart.mockReturnValue(cartWithItems)

    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('Size: 1kg')).toBeInTheDocument()
  })

  it('is accessible with proper ARIA attributes', () => {
    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Shopping cart')
    expect(screen.getByLabelText('Close cart')).toBeInTheDocument()
  })

  it('focuses on first interactive element when opened', async () => {
    render(<CartDrawer isOpen={true} onClose={jest.fn()} />)

    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close cart')
      expect(closeButton).toHaveFocus()
    })
  })
})