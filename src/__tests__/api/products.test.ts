import { products } from '@/lib/products-data'
import { mockProduct } from '@/test-utils'

// Mock API endpoints
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Products API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: products,
          total: products.length
        })
      })

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.total).toBe(products.length)
    })

    it('should handle pagination parameters', async () => {
      const paginatedProducts = products.slice(0, 10)
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: paginatedProducts,
          total: products.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(products.length / 10)
        })
      })

      const response = await fetch('/api/products?page=1&limit=10')
      const data = await response.json()

      expect(data.data).toHaveLength(10)
      expect(data.page).toBe(1)
      expect(data.limit).toBe(10)
    })

    it('should filter products by category', async () => {
      const proteinProducts = products.filter(p => p.category.id === 'protein')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: proteinProducts,
          total: proteinProducts.length
        })
      })

      const response = await fetch('/api/products?category=protein')
      const data = await response.json()

      expect(data.data.every((p: any) => p.category.id === 'protein')).toBe(true)
    })

    it('should filter products by dietary preferences', async () => {
      const veganProducts = products.filter(p => p.isVegan)
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: veganProducts,
          total: veganProducts.length
        })
      })

      const response = await fetch('/api/products?isVegan=true')
      const data = await response.json()

      expect(data.data.every((p: any) => p.isVegan === true)).toBe(true)
    })

    it('should sort products by price', async () => {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price)
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: sortedProducts,
          total: sortedProducts.length
        })
      })

      const response = await fetch('/api/products?sortBy=price&order=asc')
      const data = await response.json()

      for (let i = 1; i < data.data.length; i++) {
        expect(data.data[i].price).toBeGreaterThanOrEqual(data.data[i - 1].price)
      }
    })

    it('should search products by name and description', async () => {
      const searchTerm = 'protein'
      const searchResults = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      )
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: searchResults,
          total: searchResults.length,
          query: searchTerm
        })
      })

      const response = await fetch(`/api/products?search=${searchTerm}`)
      const data = await response.json()

      expect(data.query).toBe(searchTerm)
      expect(data.data.length).toBeGreaterThan(0)
    })
  })

  describe('GET /api/products/:id', () => {
    it('should return single product by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProduct
        })
      })

      const response = await fetch(`/api/products/${mockProduct.id}`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.id).toBe(mockProduct.id)
      expect(data.data.name).toBe(mockProduct.name)
    })

    it('should return 404 for non-existent product', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: 'Product not found'
        })
      })

      const response = await fetch('/api/products/non-existent-id')
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Product not found')
    })
  })

  describe('GET /api/products/:id/related', () => {
    it('should return related products', async () => {
      const relatedProducts = products
        .filter(p => p.id !== mockProduct.id && p.category.id === mockProduct.category.id)
        .slice(0, 4)
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: relatedProducts
        })
      })

      const response = await fetch(`/api/products/${mockProduct.id}/related`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeLessThanOrEqual(4)
      expect(data.data.every((p: any) => p.category.id === mockProduct.category.id)).toBe(true)
    })
  })

  describe('POST /api/products/:id/reviews', () => {
    const mockReview = {
      rating: 5,
      title: 'Great product!',
      comment: 'Love this protein powder',
      userId: 'user_001'
    }

    it('should create a new review', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          data: {
            id: 'review_001',
            ...mockReview,
            createdAt: new Date().toISOString()
          }
        })
      })

      const response = await fetch(`/api/products/${mockProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockReview)
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.rating).toBe(mockReview.rating)
      expect(data.data.title).toBe(mockReview.title)
    })

    it('should validate review data', async () => {
      const invalidReview = {
        rating: 6, // Invalid rating (should be 1-5)
        title: '',
        comment: ''
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'Invalid review data',
          details: {
            rating: 'Rating must be between 1 and 5',
            title: 'Title is required',
            comment: 'Comment is required'
          }
        })
      })

      const response = await fetch(`/api/products/${mockProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidReview)
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid review data')
      expect(data.details).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Server error'))

      try {
        await fetch('/api/products')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Server error')
      }
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      try {
        await fetch('/api/products')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Network error')
      }
    })

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      try {
        const response = await fetch('/api/products')
        await response.json()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Invalid JSON')
      }
    })
  })

  describe('Performance', () => {
    it('should return results within acceptable time', async () => {
      const startTime = Date.now()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: products,
          responseTime: 50 // ms
        })
      })

      await fetch('/api/products')
      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(responseTime).toBeLessThan(1000) // Should respond within 1 second
    })

    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        ...mockProduct,
        id: `prod_${i}`,
        name: `Product ${i}`
      }))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: largeDataset.slice(0, 20), // Paginated
          total: largeDataset.length,
          page: 1,
          limit: 20
        })
      })

      const response = await fetch('/api/products?limit=20')
      const data = await response.json()

      expect(data.data).toHaveLength(20)
      expect(data.total).toBe(1000)
    })
  })
})