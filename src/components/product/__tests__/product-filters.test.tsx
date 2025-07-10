import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { ProductFilters } from '../product-filters'
import { productCategories } from '@/lib/products-data'

const mockOnFiltersChange = jest.fn()

const defaultProps = {
  onFiltersChange: mockOnFiltersChange,
  categories: productCategories,
  activeFilters: {
    category: '',
    priceRange: [0, 500],
    tags: [],
    dietary: [],
    sortBy: 'name' as const,
  },
}

describe('ProductFilters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders filter categories correctly', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Price Range')).toBeInTheDocument()
    expect(screen.getByText('Dietary Preferences')).toBeInTheDocument()
    expect(screen.getByText('Sort By')).toBeInTheDocument()
  })

  it('displays all product categories', () => {
    render(<ProductFilters {...defaultProps} />)

    productCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })
  })

  it('calls onFiltersChange when category is selected', () => {
    render(<ProductFilters {...defaultProps} />)

    const firstCategory = productCategories[0]
    const categoryButton = screen.getByText(firstCategory.name)
    
    fireEvent.click(categoryButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.activeFilters,
      category: firstCategory.slug,
    })
  })

  it('displays active category filter', () => {
    const activeCategory = productCategories[0]
    const props = {
      ...defaultProps,
      activeFilters: {
        ...defaultProps.activeFilters,
        category: activeCategory.slug,
      },
    }

    render(<ProductFilters {...props} />)

    const categoryButton = screen.getByText(activeCategory.name)
    expect(categoryButton).toHaveClass('bg-berry-600')
  })

  it('handles dietary preference changes', () => {
    render(<ProductFilters {...defaultProps} />)

    const veganCheckbox = screen.getByLabelText('Vegan')
    fireEvent.click(veganCheckbox)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.activeFilters,
      dietary: ['vegan'],
    })
  })

  it('handles multiple dietary preferences', () => {
    const props = {
      ...defaultProps,
      activeFilters: {
        ...defaultProps.activeFilters,
        dietary: ['vegan'],
      },
    }

    render(<ProductFilters {...props} />)

    const glutenFreeCheckbox = screen.getByLabelText('Gluten Free')
    fireEvent.click(glutenFreeCheckbox)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.activeFilters,
      dietary: ['vegan', 'glutenFree'],
    })
  })

  it('removes dietary preference when unchecked', () => {
    const props = {
      ...defaultProps,
      activeFilters: {
        ...defaultProps.activeFilters,
        dietary: ['vegan', 'glutenFree'],
      },
    }

    render(<ProductFilters {...props} />)

    const veganCheckbox = screen.getByLabelText('Vegan')
    fireEvent.click(veganCheckbox)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.activeFilters,
      dietary: ['glutenFree'],
    })
  })

  it('handles sort option changes', () => {
    render(<ProductFilters {...defaultProps} />)

    const sortSelect = screen.getByDisplayValue('Name (A-Z)')
    fireEvent.change(sortSelect, { target: { value: 'price-low' } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.activeFilters,
      sortBy: 'price-low',
    })
  })

  it('handles price range changes', async () => {
    render(<ProductFilters {...defaultProps} />)

    const priceSlider = screen.getByRole('slider')
    
    fireEvent.change(priceSlider, { target: { value: '200' } })

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.activeFilters,
        priceRange: [0, 200],
      })
    })
  })

  it('clears all filters when clear button is clicked', () => {
    const props = {
      ...defaultProps,
      activeFilters: {
        category: 'protein-powders',
        priceRange: [100, 300],
        tags: ['fitness'],
        dietary: ['vegan'],
        sortBy: 'price-low' as const,
      },
    }

    render(<ProductFilters {...props} />)

    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      category: '',
      priceRange: [0, 500],
      tags: [],
      dietary: [],
      sortBy: 'name',
    })
  })

  it('shows active filter count', () => {
    const props = {
      ...defaultProps,
      activeFilters: {
        category: 'protein-powders',
        priceRange: [100, 300],
        tags: [],
        dietary: ['vegan', 'glutenFree'],
        sortBy: 'name' as const,
      },
    }

    render(<ProductFilters {...props} />)

    // Should show active filters: category (1) + price range (1) + dietary (2) = 4
    expect(screen.getByText('4 filters active')).toBeInTheDocument()
  })

  it('is accessible with proper ARIA labels', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByRole('region', { name: /product filters/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /categories/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /dietary preferences/i })).toBeInTheDocument()
  })

  it('handles keyboard navigation for category buttons', () => {
    render(<ProductFilters {...defaultProps} />)

    const firstCategoryButton = screen.getByText(productCategories[0].name)
    
    firstCategoryButton.focus()
    expect(firstCategoryButton).toHaveFocus()

    fireEvent.keyDown(firstCategoryButton, { key: 'Enter' })
    expect(mockOnFiltersChange).toHaveBeenCalled()
  })
})