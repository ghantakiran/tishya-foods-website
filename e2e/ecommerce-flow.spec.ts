import { test, expect } from '@playwright/test'

test.describe('E-commerce Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('complete purchase flow with guest checkout', async ({ page }) => {
    // Navigate to products page
    await page.click('text=Shop Now')
    await expect(page).toHaveURL('/products')

    // Filter products
    await page.click('text=Protein Powders')
    await page.waitForSelector('[data-testid="product-card"]')

    // Add first product to cart
    await page.click('[data-testid="product-card"]:first-child >> text=Add to Cart')
    
    // Verify cart icon shows item count
    await expect(page.locator('[data-testid="cart-icon-count"]')).toContainText('1')

    // Open cart drawer
    await page.click('[data-testid="cart-button"]')
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible()

    // Verify item is in cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)

    // Proceed to checkout
    await page.click('text=Proceed to Checkout')
    await expect(page).toHaveURL('/checkout')

    // Fill shipping information
    await page.fill('[data-testid="shipping-first-name"]', 'John')
    await page.fill('[data-testid="shipping-last-name"]', 'Doe')
    await page.fill('[data-testid="shipping-email"]', 'john.doe@example.com')
    await page.fill('[data-testid="shipping-phone"]', '+1234567890')
    await page.fill('[data-testid="shipping-address"]', '123 Test Street')
    await page.fill('[data-testid="shipping-city"]', 'Test City')
    await page.fill('[data-testid="shipping-postal-code"]', '12345')

    // Continue to payment
    await page.click('text=Continue to Payment')

    // Select payment method
    await page.click('[data-testid="payment-cod"]')

    // Place order
    await page.click('text=Place Order')

    // Verify order confirmation
    await expect(page).toHaveURL(/\/order-confirmation/)
    await expect(page.locator('text=Order Confirmed')).toBeVisible()
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible()
  })

  test('user registration and login flow', async ({ page }) => {
    // Navigate to login page
    await page.click('[data-testid="account-button"]')
    await page.click('text=Sign In')
    await expect(page).toHaveURL('/auth/login')

    // Switch to register form
    await page.click('text=Create an account')
    await expect(page).toHaveURL('/auth/register')

    // Fill registration form
    await page.fill('[data-testid="register-first-name"]', 'Jane')
    await page.fill('[data-testid="register-last-name"]', 'Smith')
    await page.fill('[data-testid="register-email"]', `test.${Date.now()}@example.com`)
    await page.fill('[data-testid="register-password"]', 'Password123!')
    await page.fill('[data-testid="register-confirm-password"]', 'Password123!')

    // Submit registration
    await page.click('text=Create Account')

    // Verify successful registration
    await expect(page.locator('text=Welcome')).toBeVisible()
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('product search and filtering', async ({ page }) => {
    await page.goto('/products')

    // Test search functionality
    await page.fill('[data-testid="product-search"]', 'protein')
    await page.press('[data-testid="product-search"]', 'Enter')
    
    // Verify search results
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount.toBeGreaterThan(0)
    await expect(page.locator('text=protein')).toBeVisible()

    // Test category filter
    await page.click('[data-testid="filter-category-protein-powders"]')
    await page.waitForSelector('[data-testid="product-card"]')

    // Test dietary filter
    await page.check('[data-testid="filter-vegan"]')
    await page.waitForTimeout(1000) // Wait for filter to apply

    // Test price range filter
    await page.locator('[data-testid="price-range-slider"]').fill('200')
    await page.waitForTimeout(1000)

    // Test sort options
    await page.selectOption('[data-testid="sort-select"]', 'price-low')
    await page.waitForTimeout(1000)

    // Clear filters
    await page.click('text=Clear All')
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount.toBeGreaterThan(0)
  })

  test('product comparison feature', async ({ page }) => {
    await page.goto('/products')

    // Add products to comparison
    await page.click('[data-testid="product-card"]:nth-child(1) >> [data-testid="compare-button"]')
    await page.click('[data-testid="product-card"]:nth-child(2) >> [data-testid="compare-button"]')

    // Verify comparison indicator
    await expect(page.locator('[data-testid="compare-count"]')).toContainText('2')

    // Open comparison
    await page.click('[data-testid="compare-toggle"]')
    await expect(page).toHaveURL('/compare')

    // Verify comparison table
    await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible()
    await expect(page.locator('[data-testid="compared-product"]')).toHaveCount(2)

    // Remove product from comparison
    await page.click('[data-testid="remove-from-comparison"]:first-child')
    await expect(page.locator('[data-testid="compared-product"]')).toHaveCount(1)
  })

  test('subscription management', async ({ page }) => {
    // Login first (using existing account)
    await page.goto('/auth/login')
    await page.fill('[data-testid="login-email"]', 'test@tishyafoods.com')
    await page.fill('[data-testid="login-password"]', 'password123')
    await page.click('text=Sign In')

    // Navigate to subscriptions
    await page.goto('/subscription')

    // Create new subscription
    await page.click('text=Create Subscription')
    
    // Select products for subscription
    await page.click('[data-testid="subscription-product"]:first-child >> text=Add to Subscription')
    
    // Configure delivery frequency
    await page.selectOption('[data-testid="delivery-frequency"]', 'monthly')
    
    // Set delivery date
    await page.click('[data-testid="delivery-date-picker"]')
    await page.click('[data-testid="calendar-day-15"]')
    
    // Create subscription
    await page.click('text=Create Subscription')
    
    // Verify subscription created
    await expect(page.locator('[data-testid="subscription-card"]')).toBeVisible()
    await expect(page.locator('text=Active')).toBeVisible()
  })

  test('nutrition tracking feature', async ({ page }) => {
    await page.goto('/nutrition')

    // Set nutrition goals
    await page.fill('[data-testid="daily-protein-goal"]', '150')
    await page.fill('[data-testid="daily-calorie-goal"]', '2000')
    await page.click('text=Save Goals')

    // Log food intake
    await page.click('text=Log Food')
    await page.fill('[data-testid="food-search"]', 'protein powder')
    await page.click('[data-testid="food-result"]:first-child')
    
    // Set serving size
    await page.fill('[data-testid="serving-amount"]', '1')
    await page.click('text=Add to Log')

    // Verify nutrition tracking
    await expect(page.locator('[data-testid="protein-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="calorie-progress"]')).toBeVisible()
  })

  test('mobile responsive behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Test mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()

    // Test mobile product grid
    await page.goto('/products')
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible()

    // Test mobile cart drawer
    await page.click('[data-testid="product-card"]:first-child >> text=Add to Cart')
    await page.click('[data-testid="cart-button"]')
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible()

    // Verify mobile-optimized checkout
    await page.click('text=Proceed to Checkout')
    await expect(page.locator('[data-testid="mobile-checkout-form"]')).toBeVisible()
  })

  test('PWA installation flow', async ({ page }) => {
    await page.goto('/')

    // Wait for PWA criteria to be met
    await page.waitForTimeout(3000)

    // Check if install prompt appears (this may not work in all test environments)
    const installButton = page.locator('[data-testid="pwa-install-button"]')
    if (await installButton.isVisible()) {
      await installButton.click()
      // Note: Actual installation can't be tested in automated tests
      await expect(page.locator('text=Install App')).toBeVisible()
    }

    // Test offline functionality
    await page.goto('/offline.html')
    await expect(page.locator('text=You are offline')).toBeVisible()
  })

  test('error handling and edge cases', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page')
    await expect(page.locator('text=Page Not Found')).toBeVisible()

    // Test network error handling
    await page.route('**/api/products', route => route.abort())
    await page.goto('/products')
    await expect(page.locator('text=Failed to load products')).toBeVisible()

    // Test form validation
    await page.goto('/checkout')
    await page.click('text=Continue to Payment')
    await expect(page.locator('text=Please fill in all required fields')).toBeVisible()
  })

  test('accessibility compliance', async ({ page }) => {
    await page.goto('/')

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // Check for accessibility attributes
    const mainContent = page.locator('main')
    await expect(mainContent).toHaveAttribute('role', 'main')

    // Check form labels
    await page.goto('/auth/login')
    const emailInput = page.locator('[data-testid="login-email"]')
    await expect(emailInput).toHaveAttribute('aria-label')

    // Check color contrast (this would require additional tooling in real scenarios)
    await expect(page.locator('h1')).toHaveCSS('color', /rgb\(\d+,\s*\d+,\s*\d+\)/)
  })
})