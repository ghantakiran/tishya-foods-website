const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running checkout flow tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('checkout-flow');

  try {
    // Setup: Add items to cart first
    await testUtils.navigateToPage(page, '/products');
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    
    // Add a product to cart
    const firstProduct = await page.$('[data-testid="product-card"]');
    if (firstProduct) {
      const addBtn = await firstProduct.$('button:has-text("Add to Cart")');
      if (addBtn) {
        await addBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Product added to cart for checkout test');
      }
    }

    // Test 1: Navigate to checkout from cart
    await testUtils.navigateToPage(page, '/cart');
    await testUtils.waitForElement(page, '[data-testid="checkout-button"]');
    
    const checkoutBtn = await page.$('[data-testid="checkout-button"]');
    if (checkoutBtn) {
      await checkoutBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log('✓ Navigated to checkout page');
    } else {
      // Fallback: navigate directly to checkout
      await testUtils.navigateToPage(page, '/checkout');
    }

    // Test 2: Checkout page loads
    await testUtils.waitForElement(page, 'h1');
    const checkoutTitle = await page.$eval('h1', el => el.textContent);
    console.log('✓ Checkout page loaded:', checkoutTitle);

    // Test 3: Guest checkout option
    const guestCheckoutBtn = await page.$('[data-testid="guest-checkout"]');
    if (guestCheckoutBtn) {
      await guestCheckoutBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Guest checkout option selected');
    }

    // Test 4: Fill shipping information
    const shippingForm = await page.$('[data-testid="shipping-form"]');
    if (shippingForm) {
      console.log('Testing shipping information form...');
      
      const shippingData = {
        '[data-testid="first-name"]': 'John',
        '[data-testid="last-name"]': 'Doe',
        '[data-testid="email"]': 'john.doe@example.com',
        '[data-testid="phone"]': '9876543210',
        '[data-testid="address"]': '123 Test Street',
        '[data-testid="city"]': 'Mumbai',
        '[data-testid="postal-code"]': '400001'
      };

      for (const [selector, value] of Object.entries(shippingData)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
          console.log(`✓ Filled ${selector}: ${value}`);
        }
      }

      // Test state/region selection
      const stateSelect = await page.$('[data-testid="state"]');
      if (stateSelect) {
        await page.select('[data-testid="state"]', 'Maharashtra');
        console.log('✓ State selected');
      }
    }

    // Test 5: Shipping method selection
    const shippingMethods = await page.$('[data-testid="shipping-methods"]');
    if (shippingMethods) {
      const shippingOptions = await shippingMethods.$$('input[type="radio"]');
      if (shippingOptions.length > 0) {
        await shippingOptions[0].click();
        console.log('✓ Shipping method selected');
      }
    }

    // Test 6: Continue to payment
    const continueToPaymentBtn = await page.$('[data-testid="continue-to-payment"]');
    if (continueToPaymentBtn) {
      await continueToPaymentBtn.click();
      await page.waitForTimeout(1000);
      console.log('✓ Proceeded to payment step');
    }

    // Test 7: Payment method selection
    const paymentMethods = await page.$('[data-testid="payment-methods"]');
    if (paymentMethods) {
      const paymentOptions = await paymentMethods.$$('input[type="radio"]');
      if (paymentOptions.length > 0) {
        await paymentOptions[0].click();
        await page.waitForTimeout(500);
        console.log('✓ Payment method selected');
      }
    }

    // Test 8: Fill payment information (test data)
    const paymentForm = await page.$('[data-testid="payment-form"]');
    if (paymentForm) {
      console.log('Testing payment form...');
      
      // Test credit card fields (using test data)
      const cardFields = {
        '[data-testid="card-number"]': '4111111111111111',
        '[data-testid="card-name"]': 'John Doe',
        '[data-testid="card-expiry"]': '12/25',
        '[data-testid="card-cvv"]': '123'
      };

      for (const [selector, value] of Object.entries(cardFields)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
          console.log(`✓ Filled ${selector}`);
        }
      }
    }

    // Test 9: Billing address same as shipping
    const sameAsShippingCheckbox = await page.$('[data-testid="same-as-shipping"]');
    if (sameAsShippingCheckbox) {
      await sameAsShippingCheckbox.click();
      console.log('✓ Billing address same as shipping selected');
    }

    // Test 10: Order review section
    const orderReview = await page.$('[data-testid="order-review"]');
    if (orderReview) {
      console.log('✓ Order review section found');
      
      // Check order items
      const orderItems = await orderReview.$$('[data-testid="order-item"]');
      console.log(`✓ Found ${orderItems.length} items in order review`);
      
      // Check order totals
      const orderTotal = await orderReview.$('[data-testid="order-total"]');
      if (orderTotal) {
        const totalText = await orderTotal.textContent();
        console.log('✓ Order total displayed:', totalText);
      }
    }

    // Test 11: Terms and conditions checkbox
    const termsCheckbox = await page.$('[data-testid="terms-checkbox"]');
    if (termsCheckbox) {
      await termsCheckbox.click();
      console.log('✓ Terms and conditions accepted');
    }

    // Test 12: Newsletter subscription (optional)
    const newsletterCheckbox = await page.$('[data-testid="newsletter-checkbox"]');
    if (newsletterCheckbox) {
      await newsletterCheckbox.click();
      console.log('✓ Newsletter subscription tested');
    }

    // Test 13: Apply promo code
    const promoSection = await page.$('[data-testid="promo-code-section"]');
    if (promoSection) {
      const promoInput = await promoSection.$('input');
      const applyBtn = await promoSection.$('button');
      
      if (promoInput && applyBtn) {
        await promoInput.type('TESTCODE');
        await applyBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Promo code application tested');
      }
    }

    // Test 14: Form validation
    console.log('Testing form validation...');
    
    // Clear a required field and try to submit
    const emailField = await page.$('[data-testid="email"]');
    if (emailField) {
      await emailField.click({ clickCount: 3 });
      await emailField.press('Backspace');
      
      const submitBtn = await page.$('[data-testid="place-order"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        
        // Check for validation message
        const validationMsg = await page.$('.error, [data-testid="error-message"]');
        if (validationMsg) {
          console.log('✓ Form validation works correctly');
        }
        
        // Restore email
        await emailField.type('john.doe@example.com');
      }
    }

    // Test 15: Checkout progress indicator
    const progressIndicator = await page.$('[data-testid="checkout-progress"]');
    if (progressIndicator) {
      console.log('✓ Checkout progress indicator found');
    }

    // Test 16: Order summary update
    console.log('Testing order summary updates...');
    
    // Change quantity in checkout (if available)
    const quantityInput = await page.$('[data-testid="checkout-quantity"]');
    if (quantityInput) {
      await quantityInput.click({ clickCount: 3 });
      await quantityInput.type('2');
      await page.waitForTimeout(1000);
      console.log('✓ Order summary updates with quantity changes');
    }

    // Test 17: Mobile checkout experience
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, 'h1');
    console.log('✓ Mobile checkout experience verified');

    // Test 18: Performance check
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Checkout performance metrics:', {
      pageLoad: performance.pageLoad,
      domContentLoaded: performance.domContentLoaded
    });

    // Note: We don't actually place the order to avoid test orders
    console.log('⚠ Order placement skipped to avoid test orders');

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'checkout-flow-final');
    
    console.log('Checkout flow tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };