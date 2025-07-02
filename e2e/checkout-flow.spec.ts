import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from products page and add items to cart
    await page.goto('/products')
    
    // Add a product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.getByRole('button', { name: /add to cart/i }).click()
    
    // Wait for cart to update
    await expect(page.getByTestId('cart-count')).toHaveText('1')
  })

  test('should complete full checkout flow for authenticated user', async ({ page }) => {
    // Mock user authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock_token')
      localStorage.setItem('user', JSON.stringify({
        id: 'user_001',
        email: 'test@example.com',
        name: 'Test User'
      }))
    })

    // Open cart and proceed to checkout
    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    
    // Should navigate to checkout page
    await expect(page).toHaveURL(/\/checkout/)
    
    // Step 1: Review Cart Items
    await expect(page.getByTestId('checkout-step-1')).toBeVisible()
    await expect(page.getByTestId('cart-items')).toBeVisible()
    
    // Verify cart item details
    const cartItem = page.getByTestId('cart-item').first()
    await expect(cartItem.getByTestId('product-name')).toBeVisible()
    await expect(cartItem.getByTestId('product-price')).toBeVisible()
    await expect(cartItem.getByTestId('product-quantity')).toBeVisible()
    
    // Continue to shipping
    await page.getByRole('button', { name: /continue to shipping/i }).click()
    
    // Step 2: Shipping Information
    await expect(page.getByTestId('checkout-step-2')).toBeVisible()
    
    // Fill shipping form
    await page.getByTestId('shipping-firstName').fill('John')
    await page.getByTestId('shipping-lastName').fill('Doe')
    await page.getByTestId('shipping-email').fill('john.doe@example.com')
    await page.getByTestId('shipping-phone').fill('+91 9876543210')
    await page.getByTestId('shipping-address').fill('123 Test Street')
    await page.getByTestId('shipping-city').fill('Mumbai')
    await page.getByTestId('shipping-state').selectOption('Maharashtra')
    await page.getByTestId('shipping-zipCode').fill('400001')
    
    // Continue to payment
    await page.getByRole('button', { name: /continue to payment/i }).click()
    
    // Step 3: Payment Information
    await expect(page.getByTestId('checkout-step-3')).toBeVisible()
    
    // Select payment method
    await page.getByTestId('payment-method-card').click()
    
    // Fill payment details
    await page.getByTestId('card-number').fill('4242424242424242')
    await page.getByTestId('card-expiry').fill('12/25')
    await page.getByTestId('card-cvc').fill('123')
    await page.getByTestId('card-name').fill('John Doe')
    
    // Continue to review
    await page.getByRole('button', { name: /continue to review/i }).click()
    
    // Step 4: Order Review
    await expect(page.getByTestId('checkout-step-4')).toBeVisible()
    
    // Verify order summary
    await expect(page.getByTestId('order-summary')).toBeVisible()
    await expect(page.getByTestId('shipping-summary')).toBeVisible()
    await expect(page.getByTestId('payment-summary')).toBeVisible()
    
    // Check total amounts
    await expect(page.getByTestId('subtotal')).toBeVisible()
    await expect(page.getByTestId('shipping-cost')).toBeVisible()
    await expect(page.getByTestId('total-amount')).toBeVisible()
    
    // Place order
    await page.getByRole('button', { name: /place order/i }).click()
    
    // Step 5: Order Confirmation
    await expect(page).toHaveURL(/\/order-confirmation/)
    await expect(page.getByTestId('order-success')).toBeVisible()
    await expect(page.getByTestId('order-number')).toBeVisible()
    
    // Check that cart is cleared
    await expect(page.getByTestId('cart-count')).toHaveText('0')
  })

  test('should require authentication for checkout', async ({ page }) => {
    // Open cart and try to checkout without authentication
    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText(/please log in to continue/i)).toBeVisible()
  })

  test('should validate shipping form fields', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock_token')
    })

    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    await page.getByRole('button', { name: /continue to shipping/i }).click()
    
    // Try to continue without filling required fields
    await page.getByRole('button', { name: /continue to payment/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/address is required/i)).toBeVisible()
    
    // Test email validation
    await page.getByTestId('shipping-email').fill('invalid-email')
    await page.getByRole('button', { name: /continue to payment/i }).click()
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    
    // Test phone validation
    await page.getByTestId('shipping-phone').fill('123')
    await page.getByRole('button', { name: /continue to payment/i }).click()
    await expect(page.getByText(/please enter a valid phone number/i)).toBeVisible()
  })

  test('should handle payment errors', async ({ page }) => {
    // Mock authentication and fill forms
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock_token')
    })

    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    await page.getByRole('button', { name: /continue to shipping/i }).click()
    
    // Fill valid shipping info
    await page.getByTestId('shipping-firstName').fill('John')
    await page.getByTestId('shipping-lastName').fill('Doe')
    await page.getByTestId('shipping-email').fill('john@example.com')
    await page.getByTestId('shipping-phone').fill('+91 9876543210')
    await page.getByTestId('shipping-address').fill('123 Test Street')
    await page.getByTestId('shipping-city').fill('Mumbai')
    await page.getByTestId('shipping-state').selectOption('Maharashtra')
    await page.getByTestId('shipping-zipCode').fill('400001')
    
    await page.getByRole('button', { name: /continue to payment/i }).click()
    
    // Use invalid card number
    await page.getByTestId('payment-method-card').click()
    await page.getByTestId('card-number').fill('4000000000000002') // Declined card
    await page.getByTestId('card-expiry').fill('12/25')
    await page.getByTestId('card-cvc').fill('123')
    await page.getByTestId('card-name').fill('John Doe')
    
    await page.getByRole('button', { name: /continue to review/i }).click()
    await page.getByRole('button', { name: /place order/i }).click()
    
    // Should show payment error
    await expect(page.getByTestId('payment-error')).toBeVisible()
    await expect(page.getByText(/payment failed/i)).toBeVisible()
  })

  test('should apply discount codes', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock_token')
    })

    await page.getByTestId('cart-button').click()
    
    // Apply discount code in cart
    await page.getByTestId('discount-code-input').fill('SAVE10')
    await page.getByTestId('apply-discount').click()
    
    // Should show discount applied
    await expect(page.getByTestId('discount-applied')).toBeVisible()
    await expect(page.getByText(/discount: -₹/)).toBeVisible()
    
    // Total should be reduced
    const totalBefore = await page.getByTestId('total-amount').textContent()
    await expect(page.getByTestId('discounted-total')).toBeVisible()
  })

  test('should calculate shipping costs correctly', async ({ page }) => {
    await page.getByTestId('cart-button').click()
    
    // Check shipping calculation
    const subtotal = await page.getByTestId('subtotal').textContent()
    const subtotalAmount = parseInt(subtotal?.replace(/[^\d]/g, '') || '0')
    
    if (subtotalAmount >= 999) {
      // Free shipping threshold
      await expect(page.getByText(/free shipping/i)).toBeVisible()
      await expect(page.getByTestId('shipping-cost')).toHaveText('₹0')
    } else {
      // Paid shipping
      await expect(page.getByTestId('shipping-cost')).not.toHaveText('₹0')
    }
  })

  test('should save shipping address for future use', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock_token')
    })

    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    await page.getByRole('button', { name: /continue to shipping/i }).click()
    
    // Fill shipping form
    await page.getByTestId('shipping-firstName').fill('John')
    await page.getByTestId('shipping-lastName').fill('Doe')
    await page.getByTestId('shipping-email').fill('john@example.com')
    await page.getByTestId('shipping-address').fill('123 Test Street')
    
    // Check save address option
    await page.getByTestId('save-address').check()
    
    await page.getByRole('button', { name: /continue to payment/i }).click()
    
    // Go back to shipping step
    await page.getByTestId('edit-shipping').click()
    
    // Address should be saved and available for selection
    await expect(page.getByTestId('saved-addresses')).toBeVisible()
  })

  test('should handle inventory validation', async ({ page }) => {
    // Mock out of stock scenario
    await page.route('**/api/cart/validate', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Some items are out of stock',
          outOfStockItems: ['prod_001']
        }),
      })
    })

    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    
    // Should show inventory error
    await expect(page.getByTestId('inventory-error')).toBeVisible()
    await expect(page.getByText(/some items are out of stock/i)).toBeVisible()
    
    // Should not allow proceeding to checkout
    const continueButton = page.getByRole('button', { name: /continue to shipping/i })
    await expect(continueButton).toBeDisabled()
  })

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Mobile checkout flow
    await page.getByTestId('cart-button').click()
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    
    // Should display mobile-optimized layout
    await expect(page.getByTestId('mobile-checkout')).toBeVisible()
    
    // Form fields should be properly sized for mobile
    await expect(page.getByTestId('shipping-firstName')).toHaveCSS('width', /100%/)
  })
})