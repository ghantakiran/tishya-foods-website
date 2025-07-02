import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { ProductCard } from '../product-card'
import { mockProduct } from '@/test-utils'

// Mock the cart context
const mockAddItem = jest.fn()
const mockIsInCart = jest.fn().mockReturnValue(false)
const mockGetItemQuantity = jest.fn().mockReturnValue(0)

jest.mock('@/contexts/cart-context', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    isInCart: mockIsInCart,
    getItemQuantity: mockGetItemQuantity,
  })
}))

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
    expect(screen.getByText('₹1,999')).toBeInTheDocument()
    expect(screen.getByText('₹2,499')).toBeInTheDocument()
  })

  it('displays product badges correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    if (mockProduct.featured) {
      expect(screen.getByText('Featured')).toBeInTheDocument()
    }
    
    if (mockProduct.isOrganic) {
      expect(screen.getByText('Organic')).toBeInTheDocument()
    }
  })

  it('shows nutritional information', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(`${mockProduct.nutritionalInfo.protein}g Protein`)).toBeInTheDocument()
    expect(screen.getByText(`${mockProduct.nutritionalInfo.calories} Cal`)).toBeInTheDocument()
  })

  it('displays dietary tags', () => {
    render(<ProductCard product={mockProduct} />)
    
    if (mockProduct.isGlutenFree) {
      expect(screen.getByText('Gluten Free')).toBeInTheDocument()
    }
    
    if (mockProduct.isVegetarian) {
      expect(screen.getByText('Vegetarian')).toBeInTheDocument()
    }
  })

  it('shows stock status correctly', () => {
    const { rerender } = render(<ProductCard product={mockProduct} />)
    
    if (mockProduct.stock > 10) {
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    }
    
    // Test low stock
    const lowStockProduct = { ...mockProduct, stock: 3 }
    rerender(<ProductCard product={lowStockProduct} />)
    expect(screen.getByText('Only 3 left')).toBeInTheDocument()
    
    // Test out of stock
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    rerender(<ProductCard product={outOfStockProduct} />)
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('handles add to cart action', async () => {
    render(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1)
    })
  })

  it('disables add to cart when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    expect(addToCartButton).toBeDisabled()
  })

  it('shows wishlist button', () => {
    render(<ProductCard product={mockProduct} />)
    
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i })
    expect(wishlistButton).toBeInTheDocument()
  })

  it('handles quick view action', () => {
    const mockOnQuickView = jest.fn()
    render(<ProductCard product={mockProduct} onQuickView={mockOnQuickView} />)
    
    const quickViewButton = screen.getByRole('button', { name: /quick view/i })
    fireEvent.click(quickViewButton)
    
    expect(mockOnQuickView).toHaveBeenCalledWith(mockProduct)
  })

  it('shows compare button when compare function is provided', () => {
    const mockOnCompare = jest.fn()
    render(<ProductCard product={mockProduct} onCompare={mockOnCompare} />)
    
    const compareButton = screen.getByRole('button', { name: /compare/i })
    expect(compareButton).toBeInTheDocument()
    
    fireEvent.click(compareButton)
    expect(mockOnCompare).toHaveBeenCalledWith(mockProduct)
  })

  it('applies variant styles correctly', () => {
    const { rerender } = render(<ProductCard product={mockProduct} variant="grid" />)
    let container = screen.getByTestId('product-card')
    expect(container).toHaveClass('flex-col')
    
    rerender(<ProductCard product={mockProduct} variant="list" />)
    container = screen.getByTestId('product-card')
    expect(container).toHaveClass('flex-row')
  })

  it('shows discount percentage', () => {
    render(<ProductCard product={mockProduct} />)
    
    const discountPercent = Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    expect(screen.getByText(`${discountPercent}% OFF`)).toBeInTheDocument()
  })

  it('handles image loading states', async () => {
    render(<ProductCard product={mockProduct} />)
    
    const productImage = screen.getByAltText(mockProduct.name)
    expect(productImage).toBeInTheDocument()
    
    // Simulate image load
    fireEvent.load(productImage)
    
    await waitFor(() => {
      expect(productImage).toHaveClass('opacity-100')
    })
  })

  it('shows loading state when adding to cart', async () => {
    // Mock a delayed add item function
    mockAddItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)
    
    // Should show loading state
    expect(screen.getByText(/adding.../i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/add to cart/i)).toBeInTheDocument()
    })
  })

  it('shows item quantity when already in cart', () => {
    mockIsInCart.mockReturnValue(true)
    mockGetItemQuantity.mockReturnValue(2)
    
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('2 in cart')).toBeInTheDocument()
  })
})