'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccessibleFormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  helpText?: string
  error?: string
  success?: string
  children: React.ReactNode
  className?: string
}

export const AccessibleFormField = ({
  label,
  htmlFor,
  required = false,
  helpText,
  error,
  success,
  children,
  className
}: AccessibleFormFieldProps) => {
  const helpId = `${htmlFor}-help`
  const errorId = `${htmlFor}-error`
  const successId = `${htmlFor}-success`
  
  const describedBy = [
    helpText ? helpId : '',
    error ? errorId : '',
    success ? successId : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-100"
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div className="relative">
        {children}
        
        {/* Status indicators */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          {error && (
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          )}
          {success && !error && (
            <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Help text */}
      {helpText && (
        <p id={helpId} className="text-sm text-gray-400 flex items-start">
          <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {helpText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-2 text-sm text-red-400"
          role="alert"
          id={errorId}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Success message */}
      {success && !error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-2 text-sm text-green-400"
          role="status"
          id={successId}
        >
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{success}</span>
        </motion.div>
      )}
    </div>
  )
}

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helpText?: string
  error?: string
  success?: string
  showValidation?: boolean
}

export const AccessibleInput = ({
  label,
  helpText,
  error,
  success,
  showValidation = true,
  className,
  ...props
}: AccessibleInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const helpId = props.id ? `${props.id}-help` : undefined
  const errorId = props.id ? `${props.id}-error` : undefined
  const successId = props.id ? `${props.id}-success` : undefined
  
  const describedBy = [
    helpText && helpId,
    error && errorId,
    success && successId
  ].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-100">
          {label}
          {props.required && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          {...props}
          className={cn(
            'w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg',
            'text-gray-100 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
            success && !error && 'border-green-500 focus:ring-green-500',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
        />
        
        {showValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && (
              <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            )}
            {success && !error && (
              <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {helpText && (
        <p id={helpId} className="text-sm text-gray-400">
          {helpText}
        </p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={errorId}
          className="text-sm text-red-400 flex items-start space-x-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </motion.p>
      )}

      {success && !error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={successId}
          className="text-sm text-green-400 flex items-start space-x-1"
          role="status"
        >
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{success}</span>
        </motion.p>
      )}
    </div>
  )
}

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helpText?: string
  error?: string
  success?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

export const AccessibleSelect = ({
  label,
  helpText,
  error,
  success,
  options,
  placeholder,
  className,
  ...props
}: AccessibleSelectProps) => {
  const helpId = props.id ? `${props.id}-help` : undefined
  const errorId = props.id ? `${props.id}-error` : undefined
  const successId = props.id ? `${props.id}-success` : undefined
  
  const describedBy = [
    helpText && helpId,
    error && errorId,
    success && successId
  ].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-100">
          {label}
          {props.required && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        <select
          {...props}
          className={cn(
            'w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg',
            'text-gray-100 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
            success && !error && 'border-green-500 focus:ring-green-500',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
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
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {error && (
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          )}
          {success && !error && (
            <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
          )}
        </div>
      </div>

      {helpText && (
        <p id={helpId} className="text-sm text-gray-400">
          {helpText}
        </p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={errorId}
          className="text-sm text-red-400 flex items-start space-x-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </motion.p>
      )}

      {success && !error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={successId}
          className="text-sm text-green-400 flex items-start space-x-1"
          role="status"
        >
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{success}</span>
        </motion.p>
      )}
    </div>
  )
}

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helpText?: string
  error?: string
  success?: string
  maxLength?: number
  showCharCount?: boolean
}

export const AccessibleTextarea = ({
  label,
  helpText,
  error,
  success,
  maxLength,
  showCharCount = false,
  className,
  ...props
}: AccessibleTextareaProps) => {
  const [charCount, setCharCount] = useState(0)
  const helpId = props.id ? `${props.id}-help` : undefined
  const errorId = props.id ? `${props.id}-error` : undefined
  const successId = props.id ? `${props.id}-success` : undefined
  const charCountId = props.id ? `${props.id}-char-count` : undefined
  
  const describedBy = [
    helpText && helpId,
    error && errorId,
    success && successId,
    showCharCount && charCountId
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    props.onChange?.(e)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-100">
          {label}
          {props.required && (
            <span className="text-red-400 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        <textarea
          {...props}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            'w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg',
            'text-gray-100 placeholder-gray-400 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
            success && !error && 'border-green-500 focus:ring-green-500',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
        />
        
        <div className="absolute right-3 top-3">
          {error && (
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          )}
          {success && !error && (
            <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {helpText && (
            <p id={helpId} className="text-sm text-gray-400">
              {helpText}
            </p>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              id={errorId}
              className="text-sm text-red-400 flex items-start space-x-1"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.p>
          )}

          {success && !error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              id={successId}
              className="text-sm text-green-400 flex items-start space-x-1"
              role="status"
            >
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{success}</span>
            </motion.p>
          )}
        </div>

        {showCharCount && maxLength && (
          <p 
            id={charCountId}
            className={cn(
              'text-sm',
              charCount > maxLength * 0.9 ? 'text-yellow-400' : 'text-gray-400',
              charCount >= maxLength ? 'text-red-400' : ''
            )}
            aria-live="polite"
          >
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

interface AccessibleCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helpText?: string
  error?: string
  indeterminate?: boolean
}

export const AccessibleCheckbox = ({
  label,
  helpText,
  error,
  indeterminate = false,
  className,
  ...props
}: AccessibleCheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const helpId = props.id ? `${props.id}-help` : undefined
  const errorId = props.id ? `${props.id}-error` : undefined
  
  const describedBy = [
    helpText && helpId,
    error && errorId
  ].filter(Boolean).join(' ')

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          ref={checkboxRef}
          type="checkbox"
          {...props}
          className={cn(
            'mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700',
            'text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
        />
        
        <div className="flex-1">
          <label htmlFor={props.id} className="text-sm font-medium text-gray-100 cursor-pointer">
            {label}
            {props.required && (
              <span className="text-red-400 ml-1" aria-label="required">*</span>
            )}
          </label>
          
          {helpText && (
            <p id={helpId} className="text-sm text-gray-400 mt-1">
              {helpText}
            </p>
          )}
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              id={errorId}
              className="text-sm text-red-400 flex items-start space-x-1 mt-1"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}

interface AccessibleRadioGroupProps {
  name: string
  label: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  onChange?: (value: string) => void
  helpText?: string
  error?: string
  required?: boolean
  className?: string
}

export const AccessibleRadioGroup = ({
  name,
  label,
  options,
  value,
  onChange,
  helpText,
  error,
  required = false,
  className
}: AccessibleRadioGroupProps) => {
  const helpId = `${name}-help`
  const errorId = `${name}-error`
  const groupId = `${name}-group`
  
  const describedBy = [
    helpText && helpId,
    error && errorId
  ].filter(Boolean).join(' ')

  return (
    <fieldset className={cn('space-y-3', className)}>
      <legend className="text-sm font-medium text-gray-100">
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">*</span>
        )}
      </legend>
      
      <div 
        id={groupId}
        role="radiogroup"
        aria-labelledby={`${name}-legend`}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              className={cn(
                'h-4 w-4 border-gray-600 bg-gray-700 text-blue-600',
                'focus:ring-blue-500 focus:ring-offset-gray-900',
                'transition-colors duration-200',
                error && 'border-red-500 focus:ring-red-500'
              )}
            />
            <label 
              htmlFor={`${name}-${option.value}`}
              className={cn(
                'text-sm font-medium text-gray-100 cursor-pointer',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {helpText && (
        <p id={helpId} className="text-sm text-gray-400">
          {helpText}
        </p>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={errorId}
          className="text-sm text-red-400 flex items-start space-x-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </motion.p>
      )}
    </fieldset>
  )
}

export {
  AccessibleFormField,
  AccessibleInput,
  AccessibleSelect,
  AccessibleTextarea,
  AccessibleCheckbox,
  AccessibleRadioGroup
}