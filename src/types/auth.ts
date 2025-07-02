export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  emailVerified: boolean
  role: 'user' | 'admin'
  preferences?: {
    dietaryRestrictions: string[]
    healthGoals: string[]
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'very-active'
    ageGroup: 'young-adult' | 'adult' | 'senior'
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
}