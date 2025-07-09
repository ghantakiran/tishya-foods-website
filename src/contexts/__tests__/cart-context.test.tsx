import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '../cart-context'
import { mockProduct, mockCartItem, createCartItemFromProduct } from '@/test-utils'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('Cart Context', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.cart).toEqual([])
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].product.id).toBe(mockProduct.id)
  })

  it('should update quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    act(() => {
      result.current.removeItem(mockProduct.id)
    })
    
    expect(result.current.cart).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    act(() => {
      result.current.updateQuantity(mockProduct.id, 5)
    })
    
    expect(result.current.cart[0].quantity).toBe(5)
  })

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    act(() => {
      result.current.updateQuantity(mockProduct.id, 0)
    })
    
    expect(result.current.cart).toHaveLength(0)
  })

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
      result.current.addItem(createCartItemFromProduct({ ...mockProduct, id: 'prod_002' }, 1))
    })
    
    expect(result.current.cart).toHaveLength(2)
    
    act(() => {
      result.current.clearCart()
    })
    
    expect(result.current.cart).toHaveLength(0)
  })

  it('should calculate total price correctly with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    const product2 = { ...mockProduct, id: 'prod_002', price: 1500 }
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
      result.current.addItem(createCartItemFromProduct(product2, 1))
    })
    
    expect(result.current.totalPrice).toBe(5498)
  })

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    const storedCart = JSON.parse(localStorage.getItem('tishya_cart') || '[]')
    expect(storedCart).toHaveLength(1)
    expect(storedCart[0].product.id).toBe(mockProduct.id)
  })

  it('should load cart from localStorage on initialization', () => {
    const initialCart = [mockCartItem]
    localStorage.setItem('tishya_cart', JSON.stringify(initialCart))
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].product.id).toBe(mockProduct.id)
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem
    localStorage.setItem = jest.fn(() => {
      throw new Error('Storage error')
    })
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(() => {
      act(() => {
        result.current.addItem(createCartItemFromProduct(mockProduct, 1))
      })
    }).not.toThrow()
    
    // Restore original function
    localStorage.setItem = originalSetItem
  })

  it('should check if item is in cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.isInCart(mockProduct.id)).toBe(false)
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    expect(result.current.isInCart(mockProduct.id)).toBe(true)
  })

  it('should get item quantity from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.getItemQuantity(mockProduct.id)).toBe(0)
    
    act(() => {
      result.current.addItem(createCartItemFromProduct(mockProduct, 1))
    })
    
    expect(result.current.getItemQuantity(mockProduct.id)).toBe(1)
  })
})