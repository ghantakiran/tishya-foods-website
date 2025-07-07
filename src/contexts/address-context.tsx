'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface Address {
  id: string
  label: string // 'Home', 'Work', 'Other'
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  isDefault: boolean
  type: 'shipping' | 'billing' | 'both'
  createdAt: Date
  updatedAt: Date
}

interface AddressState {
  addresses: Address[]
  isLoading: boolean
  error: string | null
}

interface AddressContextType extends AddressState {
  addAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAddress: (id: string, updates: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  getDefaultAddress: () => Address | undefined
  getAddressesByType: (type: 'shipping' | 'billing') => Address[]
}

type AddressAction = 
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: { id: string; updates: Partial<Address> } }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_ADDRESSES'; payload: Address[] }

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  error: null
}

function addressReducer(state: AddressState, action: AddressAction): AddressState {
  switch (action.type) {
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
        error: null
      }

    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(address => 
          address.id === action.payload.id 
            ? { ...address, ...action.payload.updates, updatedAt: new Date() }
            : address
        ),
        error: null
      }

    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(address => address.id !== action.payload),
        error: null
      }

    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(address => ({
          ...address,
          isDefault: address.id === action.payload,
          updatedAt: address.id === action.payload ? new Date() : address.updatedAt
        })),
        error: null
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'LOAD_ADDRESSES':
      return {
        ...state,
        addresses: action.payload,
        isLoading: false,
        error: null
      }

    default:
      return state
  }
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

export function AddressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(addressReducer, initialState)

  // Load addresses from localStorage on mount
  useEffect(() => {
    try {
      const savedAddresses = localStorage.getItem('tishya-addresses')
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses).map((addr: any) => ({
          ...addr,
          createdAt: new Date(addr.createdAt),
          updatedAt: new Date(addr.updatedAt)
        }))
        dispatch({ type: 'LOAD_ADDRESSES', payload: addresses })
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load addresses' })
    }
  }, [])

  // Save addresses to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('tishya-addresses', JSON.stringify(state.addresses))
    } catch (error) {
      console.error('Error saving addresses:', error)
    }
  }, [state.addresses])

  const addAddress = (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAddress: Address = {
      ...addressData,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // If this is the first address, make it default
    if (state.addresses.length === 0) {
      newAddress.isDefault = true
    }

    // If setting as default, unset other defaults
    if (newAddress.isDefault) {
      dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: newAddress.id })
    }

    dispatch({ type: 'ADD_ADDRESS', payload: newAddress })
  }

  const updateAddress = (id: string, updates: Partial<Address>) => {
    // If setting as default, unset other defaults first
    if (updates.isDefault) {
      dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id })
    } else {
      dispatch({ type: 'UPDATE_ADDRESS', payload: { id, updates } })
    }
  }

  const deleteAddress = (id: string) => {
    const addressToDelete = state.addresses.find(addr => addr.id === id)
    dispatch({ type: 'DELETE_ADDRESS', payload: id })

    // If we deleted the default address, set another as default
    if (addressToDelete?.isDefault && state.addresses.length > 1) {
      const remainingAddresses = state.addresses.filter(addr => addr.id !== id)
      if (remainingAddresses.length > 0) {
        dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: remainingAddresses[0].id })
      }
    }
  }

  const setDefaultAddress = (id: string) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id })
  }

  const getDefaultAddress = (): Address | undefined => {
    return state.addresses.find(address => address.isDefault)
  }

  const getAddressesByType = (type: 'shipping' | 'billing'): Address[] => {
    return state.addresses.filter(address => 
      address.type === type || address.type === 'both'
    )
  }

  const contextValue: AddressContextType = {
    ...state,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    getAddressesByType
  }

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider')
  }
  return context
}