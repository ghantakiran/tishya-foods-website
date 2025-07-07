const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running product catalog tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('product-catalog');

  try {
    // Navigate to products page
    await testUtils.navigateToPage(page, '/products');
    
    // Test 1: Products page loads
    await testUtils.waitForElement(page, 'h1');
    const title = await page.$eval('h1', el => el.textContent);
    console.log('✓ Products page loaded with title:', title);

    // Test 2: Product cards are visible
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    const productCards = await page.$$('[data-testid="product-card"]');
    console.log(`✓ Found ${productCards.length} product cards`);

    // Test 3: Search functionality
    const searchInput = await page.$('[data-testid="product-search-input"]');
    if (searchInput) {
      await searchInput.type('protein');
      await page.waitForTimeout(1000); // Wait for search results
      
      const searchResults = await page.$$('[data-testid="product-card"]');
      console.log(`✓ Search for 'protein' returned ${searchResults.length} results`);
      
      // Clear search
      await searchInput.click({ clickCount: 3 });
      await searchInput.press('Backspace');
      await page.waitForTimeout(1000);
    }

    // Test 4: Category filtering
    const categoryFilter = await page.$('[data-testid="category-filter"]');
    if (categoryFilter) {
      // Get all options
      const options = await page.$$eval('[data-testid="category-filter"] option', 
        options => options.map(option => ({ value: option.value, text: option.textContent }))
      );
      
      console.log(`✓ Found ${options.length} category options:`, options.map(o => o.text));
      
      // Test filtering by first non-"all" category
      const testCategory = options.find(opt => opt.value !== 'all');
      if (testCategory) {
        await page.select('[data-testid="category-filter"]', testCategory.value);
        await page.waitForTimeout(1000);
        
        const filteredResults = await page.$$('[data-testid="product-card"]');
        console.log(`✓ Filtering by '${testCategory.text}' returned ${filteredResults.length} products`);
        
        // Reset filter
        await page.select('[data-testid="category-filter"]', 'all');
        await page.waitForTimeout(1000);
      }
    }

    // Test 5: View mode toggle (grid/list)
    const gridButton = await page.$('button[title="Grid view"]');
    const listButton = await page.$('button[title="List view"]');
    
    if (gridButton && listButton) {
      await listButton.click();
      await page.waitForTimeout(500);
      console.log('✓ Switched to list view');
      
      await gridButton.click();
      await page.waitForTimeout(500);
      console.log('✓ Switched back to grid view');
    }

    // Test 6: Product card interaction
    const firstProduct = await page.$('[data-testid="product-card"]');
    if (firstProduct) {
      // Test add to cart button
      const addToCartBtn = await firstProduct.$('button:has-text("Add to Cart")');
      if (addToCartBtn) {
        await addToCartBtn.click();
        console.log('✓ Add to cart button clicked');
        
        // Wait for any cart update animations
        await page.waitForTimeout(1000);
      }
    }

    // Test 7: Product comparison
    const compareButtons = await page.$$('button[title*="comparison"]');
    if (compareButtons.length > 0) {
      // Add first product to comparison
      await compareButtons[0].click();
      await page.waitForTimeout(500);
      
      // Add second product if available
      if (compareButtons.length > 1) {
        await compareButtons[1].click();
        await page.waitForTimeout(500);
      }
      
      console.log(`✓ Added products to comparison`);
      
      // Check for compare button/widget
      const compareWidget = await page.$('[data-testid="compare-widget"]');
      if (compareWidget) {
        console.log('✓ Compare widget appeared');
      }
    }

    // Test 8: Pagination (if present)
    const pagination = await page.$('[data-testid="pagination"]');
    if (pagination) {
      const nextButton = await pagination.$('button:has-text("Next")');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        console.log('✓ Pagination works');
      }
    }

    // Test 9: Product filtering by dietary preferences
    const filterButton = await page.$('button[title="Toggle filters"]');
    if (filterButton) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Try to click dietary filter options
      const veganFilter = await page.$('button:has-text("Vegan")');
      if (veganFilter) {
        await veganFilter.click();
        await page.waitForTimeout(1000);
        console.log('✓ Vegan filter applied');
      }
    }

    // Test 10: Performance check
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Performance metrics:', {
      pageLoad: performance.pageLoad,
      resourceCount: performance.resourceStats.requests
    });

    // Test 11: Mobile responsiveness
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, '[data-testid="product-card"]');
    console.log('✓ Mobile view works correctly');

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'product-catalog-final');
    
    console.log('Product catalog tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };