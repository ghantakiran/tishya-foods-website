import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Tishya Foods/)
    
    // Check main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Check navigation
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    // Check hero content
    await expect(page.getByTestId('hero-section')).toBeVisible()
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: /shop now/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /learn more/i })).toBeVisible()
  })

  test('should show featured products', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="featured-products"]')
    
    // Check featured products section
    await expect(page.getByTestId('featured-products')).toBeVisible()
    
    // Check that products are displayed
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards).toHaveCount(4) // Assuming 4 featured products
    
    // Check product card content
    const firstProduct = productCards.first()
    await expect(firstProduct.locator('img')).toBeVisible()
    await expect(firstProduct.locator('h3')).toBeVisible()
    await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible()
  })

  test('should display benefits section', async ({ page }) => {
    await expect(page.getByTestId('benefits-section')).toBeVisible()
    
    // Check benefit cards
    const benefitCards = page.locator('[data-testid="benefit-card"]')
    await expect(benefitCards).toHaveCount(4) // Assuming 4 benefit cards
  })

  test('should show testimonials', async ({ page }) => {
    await expect(page.getByTestId('testimonials-section')).toBeVisible()
    
    // Check testimonial cards
    const testimonials = page.locator('[data-testid="testimonial"]')
    await expect(testimonials.first()).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    // Test Products link
    await page.getByRole('link', { name: 'Products' }).click()
    await expect(page).toHaveURL(/\/products/)
    
    // Go back to homepage
    await page.goto('/')
    
    // Test About link
    await page.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about/)
  })

  test('should open and close mobile menu', async ({ page }) => {
    // Resize to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile menu button is visible
    const menuButton = page.getByTestId('mobile-menu-button')
    await expect(menuButton).toBeVisible()
    
    // Open mobile menu
    await menuButton.click()
    await expect(page.getByTestId('mobile-menu')).toBeVisible()
    
    // Close mobile menu
    const closeButton = page.getByTestId('mobile-menu-close')
    await closeButton.click()
    await expect(page.getByTestId('mobile-menu')).not.toBeVisible()
  })

  test('should show cart drawer', async ({ page }) => {
    // Click cart button
    await page.getByTestId('cart-button').click()
    
    // Check cart drawer opens
    await expect(page.getByTestId('cart-drawer')).toBeVisible()
    
    // Check empty cart message
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
    
    // Close cart drawer
    await page.getByTestId('cart-drawer-close').click()
    await expect(page.getByTestId('cart-drawer')).not.toBeVisible()
  })

  test('should have working search functionality', async ({ page }) => {
    // Open search
    await page.getByTestId('search-button').click()
    await expect(page.getByTestId('search-input')).toBeVisible()
    
    // Type search query
    await page.getByTestId('search-input').fill('protein')
    await page.keyboard.press('Enter')
    
    // Should navigate to products page with search
    await expect(page).toHaveURL(/\/products\?search=protein/)
  })

  test('should load and display newsletter signup', async ({ page }) => {
    // Scroll to newsletter section
    await page.getByTestId('newsletter-section').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('newsletter-section')).toBeVisible()
    
    // Test newsletter signup
    await page.getByTestId('newsletter-email').fill('test@example.com')
    await page.getByTestId('newsletter-submit').click()
    
    // Check success message
    await expect(page.getByText(/thank you for subscribing/i)).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Home' })).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Products' })).toBeFocused()
    
    // Test enter key activation
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/products/)
  })

  test('should handle scroll-to-top functionality', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000))
    
    // Check scroll-to-top button appears
    await expect(page.getByTestId('scroll-to-top')).toBeVisible()
    
    // Click scroll-to-top
    await page.getByTestId('scroll-to-top').click()
    
    // Check page scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBe(0)
  })

  test('should show loading states', async ({ page }) => {
    // Intercept and delay network requests
    await page.route('**/api/products/featured', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })
    
    await page.goto('/')
    
    // Check loading skeleton is shown
    await expect(page.getByTestId('products-loading')).toBeVisible()
    
    // Wait for products to load
    await expect(page.getByTestId('featured-products')).toBeVisible()
    await expect(page.getByTestId('products-loading')).not.toBeVisible()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/products/featured', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      })
    })
    
    await page.goto('/')
    
    // Check error message is shown
    await expect(page.getByTestId('products-error')).toBeVisible()
    await expect(page.getByText(/failed to load products/i)).toBeVisible()
    
    // Check retry button works
    await page.getByTestId('retry-button').click()
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByTestId('desktop-layout')).toBeVisible()
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByTestId('tablet-layout')).toBeVisible()
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByTestId('mobile-layout')).toBeVisible()
  })
})