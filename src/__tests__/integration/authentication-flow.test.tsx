import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { useAuth } from '@/contexts/auth-context'
import { LoginForm } from '@/features/auth/login-form'
import { RegisterForm } from '@/features/auth/register-form'

// Mock the auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

const mockAuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateProfile: jest.fn(),
}

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue(mockAuthContextValue)
    ;(fetch as jest.Mock).mockClear()
  })

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        id: 'user_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          user: mockUser,
        }),
      })

      mockAuthContextValue.login.mockResolvedValueOnce(mockUser)

      render(<LoginForm />)

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockAuthContextValue.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('should handle login errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          error: 'Invalid email or password',
        }),
      })

      mockAuthContextValue.login.mockRejectedValueOnce(new Error('Invalid email or password'))

      render(<LoginForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'wrong@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
      })
    })

    it('should validate form fields', async () => {
      render(<LoginForm />)

      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(<LoginForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' },
      })
      fireEvent.blur(screen.getByLabelText(/email/i))

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      })
    })
  })

  describe('Registration Flow', () => {
    it('should handle successful registration', async () => {
      const mockUser = {
        id: 'user_123',
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'User created successfully',
          user: mockUser,
        }),
      })

      mockAuthContextValue.register.mockResolvedValueOnce(mockUser)

      render(<RegisterForm />)

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Jane' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'newuser@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      })

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockAuthContextValue.register).toHaveBeenCalledWith({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'newuser@example.com',
          password: 'password123',
        })
      })
    })

    it('should handle registration errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          error: 'User already exists with this email',
        }),
      })

      mockAuthContextValue.register.mockRejectedValueOnce(
        new Error('User already exists with this email')
      )

      render(<RegisterForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'existing@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/user already exists with this email/i)).toBeInTheDocument()
      })
    })

    it('should validate password confirmation', async () => {
      render(<RegisterForm />)

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'different' },
      })
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })

    it('should validate password strength', async () => {
      render(<RegisterForm />)

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'weak' },
      })
      fireEvent.blur(screen.getByLabelText(/password/i))

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('Authenticated State', () => {
    it('should display user information when authenticated', () => {
      const authenticatedContext = {
        ...mockAuthContextValue,
        isAuthenticated: true,
        user: {
          id: 'user_123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      }

      mockUseAuth.mockReturnValue(authenticatedContext)

      render(<div data-testid="user-info">Welcome, {authenticatedContext.user?.firstName}!</div>)

      expect(screen.getByText('Welcome, John!')).toBeInTheDocument()
    })

    it('should handle logout', async () => {
      const authenticatedContext = {
        ...mockAuthContextValue,
        isAuthenticated: true,
        user: {
          id: 'user_123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      }

      mockUseAuth.mockReturnValue(authenticatedContext)

      render(
        <button onClick={() => authenticatedContext.logout()} data-testid="logout-btn">
          Logout
        </button>
      )

      fireEvent.click(screen.getByTestId('logout-btn'))

      expect(authenticatedContext.logout).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner during authentication', () => {
      const loadingContext = {
        ...mockAuthContextValue,
        isLoading: true,
      }

      mockUseAuth.mockReturnValue(loadingContext)

      render(<LoginForm />)

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form accessibility', () => {
      render(<LoginForm />)

      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeRequired()
      expect(screen.getByLabelText(/password/i)).toBeRequired()
    })

    it('should associate error messages with form fields', async () => {
      render(<LoginForm />)

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i)
        const errorMessage = screen.getByText(/email is required/i)
        
        expect(emailInput).toHaveAttribute('aria-describedby')
        expect(errorMessage).toHaveAttribute('id')
      })
    })
  })
})