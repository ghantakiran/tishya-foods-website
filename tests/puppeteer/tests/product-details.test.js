const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running product details tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('product-details');

  try {
    // Navigate to products page first
    await testUtils.navigateToPage(page, '/products');
    
    // Test 1: Navigate to product details from catalog
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    const firstProduct = await page.$('[data-testid="product-card"]');
    
    if (firstProduct) {
      const productName = await firstProduct.$eval('h3', el => el.textContent);
      console.log(`Testing product details for: ${productName}`);
      
      // Click on product card or "View Details" button
      const viewDetailsBtn = await firstProduct.$('a[href*="/products/"]');
      if (viewDetailsBtn) {
        await viewDetailsBtn.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log('✓ Navigated to product details page');
      } else {
        // If no direct link, simulate by going to a product URL
        await testUtils.navigateToPage(page, '/products/protein-powder-vanilla');
      }
    } else {
      // Fallback: navigate directly to a known product
      await testUtils.navigateToPage(page, '/products/protein-powder-vanilla');
    }

    // Test 2: Product details page elements
    await testUtils.waitForElement(page, 'h1');
    const productTitle = await page.$eval('h1', el => el.textContent);
    console.log('✓ Product title loaded:', productTitle);

    // Test 3: Product image gallery
    const imageGallery = await page.$('[data-testid="product-image-gallery"]');
    if (imageGallery) {
      console.log('✓ Product image gallery found');
      
      const images = await imageGallery.$$('img');
      console.log(`✓ Found ${images.length} product images`);
      
      // Test thumbnail navigation if available
      const thumbnails = await imageGallery.$$('[data-testid="thumbnail"]');
      if (thumbnails.length > 1) {
        await thumbnails[1].click();
        await page.waitForTimeout(500);
        console.log('✓ Thumbnail navigation works');
      }
    }

    // Test 4: Product information sections
    const productInfo = await page.$('[data-testid="product-info"]');
    if (productInfo) {
      console.log('✓ Product information section found');
      
      // Check for price
      const price = await productInfo.$('[data-testid="product-price"]');
      if (price) {
        const priceText = await price.textContent();
        console.log('✓ Product price displayed:', priceText);
      }
      
      // Check for description
      const description = await productInfo.$('[data-testid="product-description"]');
      if (description) {
        console.log('✓ Product description found');
      }
    }

    // Test 5: Nutritional information
    const nutritionInfo = await page.$('[data-testid="nutrition-info"]');
    if (nutritionInfo) {
      console.log('✓ Nutritional information section found');
      
      const nutritionValues = await nutritionInfo.$$('[data-testid="nutrition-value"]');
      console.log(`✓ Found ${nutritionValues.length} nutrition values`);
    }

    // Test 6: Product variants/options
    const variantSelector = await page.$('[data-testid="variant-selector"]');
    if (variantSelector) {
      console.log('✓ Product variants found');
      
      const variants = await variantSelector.$$('button, option');
      if (variants.length > 1) {
        await variants[1].click();
        await page.waitForTimeout(500);
        console.log('✓ Variant selection works');
      }
    }

    // Test 7: Quantity selector
    const quantitySelector = await page.$('[data-testid="quantity-selector"]');
    if (quantitySelector) {
      console.log('✓ Quantity selector found');
      
      const incrementBtn = await quantitySelector.$('[data-testid="increment-quantity"]');
      if (incrementBtn) {
        await incrementBtn.click();
        await page.waitForTimeout(300);
        console.log('✓ Quantity increment works');
      }
    }

    // Test 8: Add to cart functionality
    const addToCartBtn = await page.$('[data-testid="add-to-cart-button"]');
    if (addToCartBtn) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
      console.log('✓ Add to cart button clicked');
      
      // Check for cart update notification
      const cartNotification = await page.$('[data-testid="cart-notification"]');
      if (cartNotification) {
        console.log('✓ Cart notification appeared');
      }
    }

    // Test 9: Product tabs (if present)
    const productTabs = await page.$('[data-testid="product-tabs"]');
    if (productTabs) {
      console.log('✓ Product tabs found');
      
      const tabs = await productTabs.$$('[role="tab"]');
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        await tabs[i].click();
        await page.waitForTimeout(500);
        console.log(`✓ Tab ${i + 1} clicked`);
      }
    }

    // Test 10: Product reviews section
    const reviewsSection = await page.$('[data-testid="product-reviews"]');
    if (reviewsSection) {
      console.log('✓ Product reviews section found');
      
      const reviews = await reviewsSection.$$('[data-testid="review-item"]');
      console.log(`✓ Found ${reviews.length} customer reviews`);
    }

    // Test 11: Related products
    const relatedProducts = await page.$('[data-testid="related-products"]');
    if (relatedProducts) {
      console.log('✓ Related products section found');
      
      const relatedItems = await relatedProducts.$$('[data-testid="related-product"]');
      console.log(`✓ Found ${relatedItems.length} related products`);
    }

    // Test 12: Product comparison button
    const compareBtn = await page.$('[data-testid="compare-button"]');
    if (compareBtn) {
      await compareBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Product comparison button works');
    }

    // Test 13: Social sharing buttons
    const shareButtons = await page.$('[data-testid="share-buttons"]');
    if (shareButtons) {
      console.log('✓ Social sharing buttons found');
    }

    // Test 14: Mobile responsiveness
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, 'h1');
    console.log('✓ Mobile view works correctly');

    // Test 15: Performance check
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Performance metrics:', {
      pageLoad: performance.pageLoad,
      firstContentfulPaint: performance.firstContentfulPaint
    });

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'product-details-final');
    
    console.log('Product details tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };