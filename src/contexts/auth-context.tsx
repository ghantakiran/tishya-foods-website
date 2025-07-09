'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { User, AuthState, AuthActions, LoginCredentials, RegisterData } from '@/types/auth'

type AuthContextType = AuthState & AuthActions

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        const token = localStorage.getItem('tishya-auth-token')
        if (token) {
          // Simulate API call to validate token and get user
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock user data - in real app, this would come from API
          const mockUser: User = {
            id: '1',
            email: 'user@tishyafoods.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+91 98765 43210',
            emailVerified: true,
            role: 'user',
            preferences: {
              dietaryRestrictions: ['vegetarian'],
              healthGoals: ['weight-loss', 'muscle-building'],
              activityLevel: 'moderate',
              ageGroup: 'adult',
              notifications: {
                email: true,
                sms: false,
                push: true
              }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          dispatch({ type: 'SET_USER', payload: mockUser })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('tishya-auth-token')
        dispatch({ type: 'SET_ERROR', payload: 'Authentication failed' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock authentication logic
      if (credentials.email === 'user@tishyafoods.com' && credentials.password === 'password') {
        const token = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('tishya-auth-token', token)
        
        const user: User = {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
          role: 'user',
          preferences: {
            dietaryRestrictions: ['vegetarian'],
            healthGoals: ['weight-loss', 'muscle-building'],
            activityLevel: 'moderate',
            ageGroup: 'adult',
            notifications: {
              email: true,
              sms: false,
              push: true
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        dispatch({ type: 'SET_USER', payload: user })
        toast.success('Welcome back!')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const token = 'mock-jwt-token-' + Date.now()
      localStorage.setItem('tishya-auth-token', token)
      
      const user: User = {
        id: crypto.randomUUID(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        emailVerified: false,
        role: 'user',
        preferences: {
          dietaryRestrictions: [],
          healthGoals: [],
          activityLevel: 'moderate',
          ageGroup: 'adult',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      dispatch({ type: 'SET_USER', payload: user })
      toast.success('Account created successfully! Please verify your email.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      localStorage.removeItem('tishya-auth-token')
      dispatch({ type: 'SET_USER', payload: null })
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ type: 'UPDATE_USER', payload: { ...data, updatedAt: new Date().toISOString() } })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { 
          preferences: { ...state.user?.preferences, ...preferences },
          updatedAt: new Date().toISOString()
        } 
      })
      toast.success('Preferences updated successfully')
    } catch {
      toast.error('Failed to update preferences')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const sendPasswordReset = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Password reset email sent!')
    } catch {
      toast.error('Failed to send password reset email')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verifyEmail = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ type: 'UPDATE_USER', payload: { emailVerified: true } })
      toast.success('Email verified successfully!')
    } catch {
      toast.error('Email verification failed')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    sendPasswordReset,
    verifyEmail,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}