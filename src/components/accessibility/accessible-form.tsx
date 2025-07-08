'use client'

import { forwardRef, useState } from 'react'
import { ScreenReaderOnly, LiveRegion } from './screen-reader'
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react'

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
  showLabel?: boolean
  validationRules?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | null
  }
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    label, 
    error, 
    description, 
    showLabel = true,
    validationRules,
    className = '',
    id,
    onChange,
    ...props 
  }, ref) => {
    const [internalError, setInternalError] = useState<string>('')
    const [touched, setTouched] = useState(false)
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${inputId}-error`
    const descId = `${inputId}-desc`
    
    const currentError = error || (touched ? internalError : '')

    const validateInput = (value: string) => {
      if (!validationRules) return ''

      if (validationRules.required && !value.trim()) {
        return `${label} is required`
      }

      if (validationRules.minLength && value.length < validationRules.minLength) {
        return `${label} must be at least ${validationRules.minLength} characters`
      }

      if (validationRules.maxLength && value.length > validationRules.maxLength) {
        return `${label} must not exceed ${validationRules.maxLength} characters`
      }

      if (validationRules.pattern && !validationRules.pattern.test(value)) {
        return `${label} format is invalid`
      }

      if (validationRules.custom) {
        return validationRules.custom(value) || ''
      }

      return ''
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInternalError(validateInput(value))
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      if (validationRules) {
        setInternalError(validateInput(e.target.value))
      }
      props.onBlur?.(e)
    }

    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId}
          className={`
            block text-sm font-medium
            ${showLabel ? 'text-gray-300' : 'sr-only'}
            ${currentError ? 'text-red-400' : ''}
          `}
        >
          {label}
          {validationRules?.required && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>

        {description && (
          <p id={descId} className="text-sm text-gray-400">
            {description}
          </p>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!currentError}
            aria-describedby={`
              ${description ? descId : ''} 
              ${currentError ? errorId : ''}
            `.trim()}
            className={`
              w-full px-3 py-2 border rounded-lg
              bg-gray-800 text-gray-100 border-gray-600
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none transition-colors
              ${currentError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          
          {currentError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>

        {currentError && (
          <div id={errorId} role="alert" className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{currentError}</span>
          </div>
        )}

        {currentError && (
          <LiveRegion priority="assertive">
            Error in {label}: {currentError}
          </LiveRegion>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'

interface AccessiblePasswordInputProps extends Omit<AccessibleInputProps, 'type'> {
  showPasswordToggle?: boolean
}

export const AccessiblePasswordInput = forwardRef<HTMLInputElement, AccessiblePasswordInputProps>(
  ({ showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <AccessibleInput
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-3 top-[2.3rem] transform -translate-y-1/2
              text-gray-400 hover:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 rounded
              p-1
            "
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    )
  }
)

AccessiblePasswordInput.displayName = 'AccessiblePasswordInput'

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string; disabled?: boolean }[]
  error?: string
  description?: string
  showLabel?: boolean
  placeholder?: string
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ 
    label, 
    options, 
    error, 
    description, 
    showLabel = true,
    placeholder,
    className = '',
    id,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${selectId}-error`
    const descId = `${selectId}-desc`

    return (
      <div className="space-y-2">
        <label 
          htmlFor={selectId}
          className={`
            block text-sm font-medium
            ${showLabel ? 'text-gray-300' : 'sr-only'}
            ${error ? 'text-red-400' : ''}
          `}
        >
          {label}
          {props.required && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>

        {description && (
          <p id={descId} className="text-sm text-gray-400">
            {description}
          </p>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={`
              ${description ? descId : ''} 
              ${error ? errorId : ''}
            `.trim()}
            className={`
              w-full px-3 py-2 border rounded-lg
              bg-gray-800 text-gray-100 border-gray-600
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none transition-colors
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>

        {error && (
          <div id={errorId} role="alert" className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

AccessibleSelect.displayName = 'AccessibleSelect'