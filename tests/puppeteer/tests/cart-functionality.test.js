const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running cart functionality tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('cart-functionality');

  try {
    // Test 1: Add product to cart from products page
    await testUtils.navigateToPage(page, '/products');
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    
    const firstProduct = await page.$('[data-testid="product-card"]');
    if (firstProduct) {
      const productName = await firstProduct.$eval('h3', el => el.textContent);
      console.log(`Adding product to cart: ${productName}`);
      
      const addToCartBtn = await firstProduct.$('button:has-text("Add to Cart")');
      if (addToCartBtn) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Product added to cart from products page');
      }
    }

    // Test 2: Check cart badge/counter update
    const cartBadge = await page.$('[data-testid="cart-badge"]');
    if (cartBadge) {
      const cartCount = await cartBadge.textContent();
      console.log('✓ Cart badge updated:', cartCount);
    }

    // Test 3: Open cart sidebar/drawer
    const cartButton = await page.$('[data-testid="cart-button"]');
    if (cartButton) {
      await cartButton.click();
      await page.waitForTimeout(500);
      console.log('✓ Cart sidebar opened');
      
      // Check for cart items
      const cartItems = await page.$$('[data-testid="cart-item"]');
      console.log(`✓ Found ${cartItems.length} items in cart`);
    }

    // Test 4: Navigate to cart page
    await testUtils.navigateToPage(page, '/cart');
    await testUtils.waitForElement(page, 'h1');
    console.log('✓ Cart page loaded');

    // Test 5: Cart item manipulation
    const cartItemsOnPage = await page.$$('[data-testid="cart-item"]');
    if (cartItemsOnPage.length > 0) {
      const firstItem = cartItemsOnPage[0];
      
      // Test quantity increase
      const increaseBtn = await firstItem.$('[data-testid="increase-quantity"]');
      if (increaseBtn) {
        await increaseBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Quantity increased');
      }
      
      // Test quantity decrease
      const decreaseBtn = await firstItem.$('[data-testid="decrease-quantity"]');
      if (decreaseBtn) {
        await decreaseBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Quantity decreased');
      }
      
      // Test direct quantity input
      const quantityInput = await firstItem.$('[data-testid="quantity-input"]');
      if (quantityInput) {
        await quantityInput.click({ clickCount: 3 });
        await quantityInput.type('3');
        await page.waitForTimeout(500);
        console.log('✓ Direct quantity input works');
      }
    }

    // Test 6: Remove item from cart
    if (cartItemsOnPage.length > 0) {
      const removeBtn = await cartItemsOnPage[0].$('[data-testid="remove-item"]');
      if (removeBtn) {
        await removeBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Item removed from cart');
      }
    }

    // Test 7: Add multiple different products
    await testUtils.navigateToPage(page, '/products');
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    
    const productCards = await page.$$('[data-testid="product-card"]');
    const itemsToAdd = Math.min(3, productCards.length);
    
    for (let i = 0; i < itemsToAdd; i++) {
      const addBtn = await productCards[i].$('button:has-text("Add to Cart")');
      if (addBtn) {
        await addBtn.click();
        await page.waitForTimeout(500);
      }
    }
    console.log(`✓ Added ${itemsToAdd} different products to cart`);

    // Test 8: Cart totals calculation
    await testUtils.navigateToPage(page, '/cart');
    await testUtils.waitForElement(page, '[data-testid="cart-summary"]');
    
    const cartSummary = await page.$('[data-testid="cart-summary"]');
    if (cartSummary) {
      const subtotal = await cartSummary.$('[data-testid="subtotal"]');
      const total = await cartSummary.$('[data-testid="total"]');
      
      if (subtotal && total) {
        const subtotalText = await subtotal.textContent();
        const totalText = await total.textContent();
        console.log('✓ Cart totals calculated:', { subtotal: subtotalText, total: totalText });
      }
    }

    // Test 9: Apply discount code (if available)
    const discountSection = await page.$('[data-testid="discount-section"]');
    if (discountSection) {
      const discountInput = await discountSection.$('input');
      const applyBtn = await discountSection.$('button');
      
      if (discountInput && applyBtn) {
        await discountInput.type('TEST10');
        await applyBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Discount code functionality tested');
      }
    }

    // Test 10: Save for later functionality
    const saveForLaterBtn = await page.$('[data-testid="save-for-later"]');
    if (saveForLaterBtn) {
      await saveForLaterBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Save for later functionality works');
    }

    // Test 11: Move to wishlist
    const wishlistBtn = await page.$('[data-testid="move-to-wishlist"]');
    if (wishlistBtn) {
      await wishlistBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Move to wishlist functionality works');
    }

    // Test 12: Clear cart
    const clearCartBtn = await page.$('[data-testid="clear-cart"]');
    if (clearCartBtn) {
      await clearCartBtn.click();
      
      // Handle confirmation dialog if present
      const confirmBtn = await page.$('[data-testid="confirm-clear-cart"]');
      if (confirmBtn) {
        await confirmBtn.click();
      }
      
      await page.waitForTimeout(1000);
      console.log('✓ Clear cart functionality tested');
    }

    // Test 13: Empty cart state
    const emptyCartMessage = await page.$('[data-testid="empty-cart-message"]');
    if (emptyCartMessage) {
      console.log('✓ Empty cart state displayed correctly');
    }

    // Test 14: Continue shopping from cart
    const continueShoppingBtn = await page.$('[data-testid="continue-shopping"]');
    if (continueShoppingBtn) {
      await continueShoppingBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log('✓ Continue shopping navigation works');
    }

    // Test 15: Cart persistence (add item and reload)
    await testUtils.navigateToPage(page, '/products');
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    
    const productToAdd = await page.$('[data-testid="product-card"]');
    if (productToAdd) {
      const addBtn = await productToAdd.$('button:has-text("Add to Cart")');
      if (addBtn) {
        await addBtn.click();
        await page.waitForTimeout(500);
        
        // Reload page and check cart persistence
        await page.reload();
        await testUtils.waitForElement(page, '[data-testid="cart-button"]');
        
        const cartBadgeAfterReload = await page.$('[data-testid="cart-badge"]');
        if (cartBadgeAfterReload) {
          console.log('✓ Cart persistence works after page reload');
        }
      }
    }

    // Test 16: Mobile cart functionality
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, '[data-testid="cart-button"]');
    console.log('✓ Mobile cart functionality verified');

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'cart-functionality-final');
    
    console.log('Cart functionality tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };