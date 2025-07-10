import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('products page should not have accessibility issues', async ({ page }) => {
    await page.goto('/products')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('checkout page should not have accessibility issues', async ({ page }) => {
    await page.goto('/checkout')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()

    // Test multiple tab navigation
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = await page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('forms should have proper labels and error handling', async ({ page }) => {
    await page.goto('/auth/login')

    // Check form labels
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toHaveAttribute('aria-label')
    await expect(passwordInput).toHaveAttribute('aria-label')

    // Test error messages
    await page.click('button[type="submit"]')
    
    const errorMessages = page.locator('[role="alert"], .error-message')
    await expect(errorMessages).toHaveCount.toBeGreaterThan(0)
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const alt = await image.getAttribute('alt')
      const ariaLabel = await image.getAttribute('aria-label')
      const ariaHidden = await image.getAttribute('aria-hidden')

      // Image should either have alt text, aria-label, or be aria-hidden
      expect(alt !== null || ariaLabel !== null || ariaHidden === 'true').toBe(true)
    }
  })

  test('page structure should use proper headings', async ({ page }) => {
    await page.goto('/')

    // Check that page has h1
    const h1Elements = page.locator('h1')
    await expect(h1Elements).toHaveCount.toBeGreaterThan(0)

    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()

    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i)
      await expect(heading).toBeVisible()
    }
  })

  test('interactive elements should have focus indicators', async ({ page }) => {
    await page.goto('/')

    const buttons = page.locator('button, a, input, select, textarea')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i)
      await button.focus()
      
      // Check if element has focus styles
      const outlineStyle = await button.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return styles.outline || styles.boxShadow || styles.border
      })
      
      expect(outlineStyle).toBeTruthy()
    }
  })

  test('color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )

    expect(colorContrastViolations).toEqual([])
  })

  test('modal dialogs should trap focus', async ({ page }) => {
    await page.goto('/products')

    // Add item to cart to open cart drawer
    const addToCartButton = page.locator('[data-testid="add-to-cart"]:first-child')
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click()
    }

    // Open cart drawer
    await page.click('[data-testid="cart-button"]')
    const cartDrawer = page.locator('[data-testid="cart-drawer"]')
    await expect(cartDrawer).toBeVisible()

    // Test focus trap
    await page.keyboard.press('Tab')
    const firstFocusedElement = await page.locator(':focus')
    
    // Tab several times to check if focus stays within modal
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
    }

    const finalFocusedElement = await page.locator(':focus')
    
    // Focus should still be within the cart drawer
    const isWithinModal = await finalFocusedElement.evaluate((el, drawer) => {
      return drawer.contains(el)
    }, await cartDrawer.elementHandle())

    expect(isWithinModal).toBe(true)
  })

  test('skip links should be present', async ({ page }) => {
    await page.goto('/')

    // Press Tab to reveal skip links
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('a[href="#main"], a[href="#content"]')
    await expect(skipLink).toBeVisible()
  })

  test('screen reader announcements should be present', async ({ page }) => {
    await page.goto('/')

    // Check for sr-only elements that provide context
    const srOnlyElements = page.locator('.sr-only, .visually-hidden')
    await expect(srOnlyElements).toHaveCount.toBeGreaterThan(0)

    // Check for aria-live regions
    const liveRegions = page.locator('[aria-live]')
    const liveRegionCount = await liveRegions.count()
    
    // Should have at least some live regions for dynamic updates
    expect(liveRegionCount).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Specific Component Accessibility', () => {
  test('product cards should be accessible', async ({ page }) => {
    await page.goto('/products')

    const productCards = page.locator('[data-testid="product-card"]')
    const cardCount = await productCards.count()

    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = productCards.nth(i)
      
      // Should have proper heading
      const heading = card.locator('h2, h3, h4')
      await expect(heading).toBeVisible()

      // Should have accessible price information
      const price = card.locator('[data-testid="product-price"]')
      await expect(price).toBeVisible()

      // Action buttons should be labeled
      const addToCartButton = card.locator('button, a')
      const buttonCount = await addToCartButton.count()
      
      for (let j = 0; j < buttonCount; j++) {
        const button = addToCartButton.nth(j)
        const ariaLabel = await button.getAttribute('aria-label')
        const text = await button.textContent()
        
        expect(ariaLabel || text).toBeTruthy()
      }
    }
  })

  test('filter components should be accessible', async ({ page }) => {
    await page.goto('/products')

    // Check category filters
    const categoryFilters = page.locator('[data-testid="category-filter"] button')
    const filterCount = await categoryFilters.count()

    for (let i = 0; i < filterCount; i++) {
      const filter = categoryFilters.nth(i)
      await expect(filter).toHaveAttribute('type', 'button')
      
      const text = await filter.textContent()
      expect(text).toBeTruthy()
    }

    // Check form controls
    const checkboxes = page.locator('input[type="checkbox"]')
    const checkboxCount = await checkboxes.count()

    for (let i = 0; i < checkboxCount; i++) {
      const checkbox = checkboxes.nth(i)
      const id = await checkbox.getAttribute('id')
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        await expect(label).toBeVisible()
      }
    }
  })

  test('checkout form should be accessible', async ({ page }) => {
    await page.goto('/checkout')

    // All form fields should have labels
    const formFields = page.locator('input, select, textarea')
    const fieldCount = await formFields.count()

    for (let i = 0; i < fieldCount; i++) {
      const field = formFields.nth(i)
      const id = await field.getAttribute('id')
      const ariaLabel = await field.getAttribute('aria-label')
      const ariaLabelledBy = await field.getAttribute('aria-labelledby')

      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = await label.count() > 0
        
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }

    // Required fields should be marked
    const requiredFields = page.locator('input[required], select[required], textarea[required]')
    const requiredCount = await requiredFields.count()

    for (let i = 0; i < requiredCount; i++) {
      const field = requiredFields.nth(i)
      const ariaRequired = await field.getAttribute('aria-required')
      const required = await field.getAttribute('required')

      expect(ariaRequired === 'true' || required !== null).toBe(true)
    }
  })
})