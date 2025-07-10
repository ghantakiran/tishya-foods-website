import { NextRequest } from 'next/server'
import { POST as registerHandler } from '@/app/api/auth/register/route'
import { POST as loginHandler, DELETE as logoutHandler } from '@/app/api/auth/login/route'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cart: {
      create: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}))

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_jwt_token'),
}))

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const { db } = require('@/lib/db')
      db.user.findUnique.mockResolvedValueOnce(null) // User doesn't exist
      db.user.create.mockResolvedValueOnce({
        id: 'user_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        createdAt: new Date(),
      })
      db.cart.create.mockResolvedValueOnce({ id: 'cart_123', userId: 'user_123' })

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
          phone: '+1234567890',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('User created successfully')
      expect(data.user.email).toBe('test@example.com')
      expect(data.user.firstName).toBe('John')
      expect(data.user.lastName).toBe('Doe')
    })

    it('should return error if user already exists', async () => {
      const { db } = require('@/lib/db')
      db.user.findUnique.mockResolvedValueOnce({ id: 'existing_user' })

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('User already exists with this email')
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          firstName: '',
          password: 'short',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toBeDefined()
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const { db } = require('@/lib/db')
      const bcrypt = require('bcryptjs')
      
      db.user.findUnique.mockResolvedValueOnce({
        id: 'user_123',
        email: 'test@example.com',
        password: 'hashed_password',
        firstName: 'John',
        lastName: 'Doe',
        cart: {
          id: 'cart_123',
          items: [],
        },
      })
      bcrypt.compare.mockResolvedValueOnce(true)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Login successful')
      expect(data.user.email).toBe('test@example.com')
      expect(response.headers.get('set-cookie')).toContain('auth-token')
    })

    it('should return error for invalid credentials', async () => {
      const { db } = require('@/lib/db')
      db.user.findUnique.mockResolvedValueOnce(null)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('should return error for wrong password', async () => {
      const { db } = require('@/lib/db')
      const bcrypt = require('bcryptjs')
      
      db.user.findUnique.mockResolvedValueOnce({
        id: 'user_123',
        email: 'test@example.com',
        password: 'hashed_password',
      })
      bcrypt.compare.mockResolvedValueOnce(false)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })
  })

  describe('DELETE /api/auth/login (logout)', () => {
    it('should logout user successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'DELETE',
      })

      const response = await logoutHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Logged out successfully')
    })
  })
})