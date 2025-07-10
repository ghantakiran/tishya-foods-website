import { NextRequest } from 'next/server'
import { GET as getOrdersHandler, POST as createOrderHandler } from '@/app/api/orders/route'
import { GET as getOrderHandler, PUT as updateOrderHandler } from '@/app/api/orders/[id]/route'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn(),
    },
  },
  formatAmountForStripe: (amount: number) => amount,
}))

describe('Orders API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/orders', () => {
    it('should get user orders with pagination', async () => {
      const { db } = require('@/lib/db')
      const mockOrders = [
        {
          id: 'order_1',
          userId: 'user_123',
          totalAmount: 2000,
          status: 'CONFIRMED',
          items: [],
          createdAt: new Date(),
        },
      ]

      db.order.findMany.mockResolvedValueOnce(mockOrders)
      db.order.count.mockResolvedValueOnce(1)

      const url = new URL('http://localhost:3000/api/orders?userId=user_123&page=1&limit=10')
      const request = new NextRequest(url)

      const response = await getOrdersHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.orders).toHaveLength(1)
      expect(data.pagination.total).toBe(1)
      expect(data.pagination.page).toBe(1)
    })

    it('should return error if userId is missing', async () => {
      const url = new URL('http://localhost:3000/api/orders')
      const request = new NextRequest(url)

      const response = await getOrdersHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('userId is required')
    })
  })

  describe('POST /api/orders', () => {
    it('should create order with valid data', async () => {
      const { db } = require('@/lib/db')
      const { stripe } = require('@/lib/stripe')

      const mockProduct = {
        id: 'prod_1',
        price: 1000,
        stock: 10,
        name: 'Test Product',
      }

      const mockOrder = {
        id: 'order_123',
        userId: 'user_123',
        totalAmount: 2000,
        status: 'PENDING',
        items: [
          {
            productId: 'prod_1',
            quantity: 2,
            price: 1000,
            product: mockProduct,
          },
        ],
      }

      db.product.findUnique.mockResolvedValueOnce(mockProduct)
      db.order.create.mockResolvedValueOnce(mockOrder)
      stripe.paymentIntents.create.mockResolvedValueOnce({
        id: 'pi_123',
        client_secret: 'pi_123_secret',
      })

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user_123',
          items: [{ productId: 'prod_1', quantity: 2 }],
          shippingAddress: '123 Test St',
          contactEmail: 'test@example.com',
          paymentMethod: 'card',
        }),
      })

      const response = await createOrderHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.order.id).toBe('order_123')
      expect(data.paymentIntent.id).toBe('pi_123')
    })

    it('should return error for insufficient stock', async () => {
      const { db } = require('@/lib/db')

      const mockProduct = {
        id: 'prod_1',
        price: 1000,
        stock: 1,
        name: 'Test Product',
      }

      db.product.findUnique.mockResolvedValueOnce(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user_123',
          items: [{ productId: 'prod_1', quantity: 5 }],
          shippingAddress: '123 Test St',
          contactEmail: 'test@example.com',
        }),
      })

      const response = await createOrderHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Insufficient stock')
    })

    it('should create COD order without payment intent', async () => {
      const { db } = require('@/lib/db')

      const mockProduct = {
        id: 'prod_1',
        price: 1000,
        stock: 10,
        name: 'Test Product',
      }

      const mockOrder = {
        id: 'order_123',
        userId: 'user_123',
        totalAmount: 1000,
        status: 'CONFIRMED',
        items: [],
      }

      db.product.findUnique.mockResolvedValueOnce(mockProduct)
      db.order.create.mockResolvedValueOnce(mockOrder)
      db.order.update.mockResolvedValueOnce(mockOrder)

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user_123',
          items: [{ productId: 'prod_1', quantity: 1 }],
          shippingAddress: '123 Test St',
          contactEmail: 'test@example.com',
          paymentMethod: 'cod',
        }),
      })

      const response = await createOrderHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.order.id).toBe('order_123')
      expect(data.paymentIntent).toBeNull()
    })
  })

  describe('GET /api/orders/[id]', () => {
    it('should get order by ID', async () => {
      const { db } = require('@/lib/db')
      const mockOrder = {
        id: 'order_123',
        userId: 'user_123',
        totalAmount: 1000,
        status: 'CONFIRMED',
        items: [],
        user: {
          id: 'user_123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      }

      db.order.findUnique.mockResolvedValueOnce(mockOrder)

      const response = await getOrderHandler(
        new NextRequest('http://localhost:3000/api/orders/order_123'),
        { params: Promise.resolve({ id: 'order_123' }) }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('order_123')
      expect(data.user.email).toBe('test@example.com')
    })

    it('should return 404 for non-existent order', async () => {
      const { db } = require('@/lib/db')
      db.order.findUnique.mockResolvedValueOnce(null)

      const response = await getOrderHandler(
        new NextRequest('http://localhost:3000/api/orders/nonexistent'),
        { params: Promise.resolve({ id: 'nonexistent' }) }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Order not found')
    })
  })

  describe('PUT /api/orders/[id]', () => {
    it('should update order status', async () => {
      const { db } = require('@/lib/db')
      const updatedOrder = {
        id: 'order_123',
        status: 'SHIPPED',
        items: [],
      }

      db.order.update.mockResolvedValueOnce(updatedOrder)

      const request = new NextRequest('http://localhost:3000/api/orders/order_123', {
        method: 'PUT',
        body: JSON.stringify({
          status: 'SHIPPED',
        }),
      })

      const response = await updateOrderHandler(
        request,
        { params: Promise.resolve({ id: 'order_123' }) }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('SHIPPED')
    })

    it('should return error for invalid status', async () => {
      const request = new NextRequest('http://localhost:3000/api/orders/order_123', {
        method: 'PUT',
        body: JSON.stringify({
          status: 'INVALID_STATUS',
        }),
      })

      const response = await updateOrderHandler(
        request,
        { params: Promise.resolve({ id: 'order_123' }) }
      )
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid status')
    })
  })
})