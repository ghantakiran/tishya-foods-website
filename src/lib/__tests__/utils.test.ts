import { formatPrice, formatDate, cn, validateEmail, validatePhone, generateSlug } from '../utils'

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price in rupees correctly', () => {
      expect(formatPrice(1000)).toBe('₹1,000')
      expect(formatPrice(99)).toBe('₹99')
      expect(formatPrice(1234567)).toBe('₹12,34,567')
    })

    it('should handle zero and negative values', () => {
      expect(formatPrice(0)).toBe('₹0')
      expect(formatPrice(-100)).toBe('-₹100')
    })

    it('should handle decimal values', () => {
      expect(formatPrice(99.99)).toBe('₹100') // Should round to nearest integer
      expect(formatPrice(99.5)).toBe('₹100')
      expect(formatPrice(99.4)).toBe('₹99')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024|15 Jan 2024/) // Allow for different locale formats
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/Jan 15, 2024|15 Jan 2024/)
    })

    it('should handle invalid dates', () => {
      expect(() => formatDate('invalid-date')).not.toThrow()
    })
  })

  describe('cn (className utility)', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })

    it('should handle objects with conditional classes', () => {
      expect(cn('base', { 'active': true, 'hidden': false })).toBe('base active')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.com')).toBe(true)
      expect(validateEmail('test123@test-domain.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('test@domain')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate Indian phone numbers', () => {
      expect(validatePhone('+91 9876543210')).toBe(true)
      expect(validatePhone('9876543210')).toBe(true)
      expect(validatePhone('+919876543210')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abcdefghij')).toBe(false)
      expect(validatePhone('')).toBe(false)
      expect(validatePhone('+91 123')).toBe(false)
    })
  })

  describe('generateSlug', () => {
    it('should generate correct slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
      expect(generateSlug('Premium Protein Powder')).toBe('premium-protein-powder')
      expect(generateSlug('Test & Product Name!')).toBe('test-product-name')
    })

    it('should handle special characters', () => {
      expect(generateSlug('Café & Restaurant')).toBe('cafe-restaurant')
      expect(generateSlug('100% Organic')).toBe('100-organic')
    })

    it('should handle empty strings', () => {
      expect(generateSlug('')).toBe('')
      expect(generateSlug('   ')).toBe('')
    })

    it('should remove multiple consecutive hyphens', () => {
      expect(generateSlug('Test---Multiple---Hyphens')).toBe('test-multiple-hyphens')
    })
  })
})