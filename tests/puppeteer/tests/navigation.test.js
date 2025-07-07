const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running navigation tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('navigation');

  try {
    // Navigate to homepage
    await testUtils.navigateToPage(page, '/');
    
    // Test 1: Main navigation links
    const navLinks = [
      { text: 'Products', path: '/products' },
      { text: 'About', path: '/about' },
      { text: 'Recipes', path: '/recipes' },
      { text: 'Blog', path: '/blog' },
      { text: 'Contact', path: '/contact' }
    ];

    for (const link of navLinks) {
      console.log(`Testing navigation to ${link.text}...`);
      
      // Click navigation link
      await testUtils.clickElement(page, `a[href="${link.path}"]`);
      
      // Wait for navigation to complete
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Verify URL
      const currentUrl = page.url();
      if (currentUrl.includes(link.path)) {
        console.log(`✓ Successfully navigated to ${link.text}: ${currentUrl}`);
      } else {
        throw new Error(`Navigation failed for ${link.text}. Expected ${link.path}, got ${currentUrl}`);
      }
      
      // Take screenshot
      await testUtils.takeScreenshot(page, `navigation-${link.text.toLowerCase()}`);
      
      // Go back to homepage for next test
      await testUtils.navigateToPage(page, '/');
    }

    // Test 2: Mobile navigation (hamburger menu)
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    
    // Look for mobile menu button
    const mobileMenuButton = await page.$('[data-testid="mobile-menu-button"]');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await testUtils.waitForElement(page, '[data-testid="mobile-menu"]');
      console.log('✓ Mobile navigation menu opens correctly');
      
      // Test mobile menu links
      const mobileLinks = await page.$$('[data-testid="mobile-menu"] a');
      console.log(`✓ Found ${mobileLinks.length} mobile menu links`);
    } else {
      console.log('⚠ Mobile menu button not found, skipping mobile navigation test');
    }

    // Test 3: Logo navigation
    await testUtils.navigateToPage(page, '/products');
    const logo = await page.$('[data-testid="logo"]');
    if (logo) {
      await logo.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      if (page.url().includes('/') && !page.url().includes('/products')) {
        console.log('✓ Logo navigation to homepage works');
      }
    }

    // Test 4: Breadcrumbs (if present)
    await testUtils.navigateToPage(page, '/products');
    const breadcrumbs = await page.$('[data-testid="breadcrumbs"]');
    if (breadcrumbs) {
      console.log('✓ Breadcrumbs found on products page');
    }

    // Test 5: Back button functionality
    await testUtils.navigateToPage(page, '/products');
    await testUtils.navigateToPage(page, '/about');
    await page.goBack();
    
    if (page.url().includes('/products')) {
      console.log('✓ Browser back button works correctly');
    }

    console.log('Navigation tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };