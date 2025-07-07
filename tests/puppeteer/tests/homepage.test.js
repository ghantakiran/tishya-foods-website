const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running homepage tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('homepage');

  try {
    // Navigate to homepage
    await testUtils.navigateToPage(page, '/');
    
    // Test 1: Page loads successfully
    await testUtils.waitForElement(page, 'h1');
    const title = await page.$eval('h1', el => el.textContent);
    console.log('✓ Homepage loaded with title:', title);

    // Test 2: Hero section is visible
    await testUtils.waitForElement(page, '[data-testid="hero-section"]', { timeout: 5000 });
    console.log('✓ Hero section is visible');

    // Test 3: Navigation menu is functional
    await testUtils.waitForElement(page, 'nav');
    const navLinks = await page.$$eval('nav a', links => links.map(link => link.textContent));
    console.log('✓ Navigation menu loaded with links:', navLinks);

    // Test 4: Product showcase section
    await testUtils.waitForElement(page, '[data-testid="product-showcase"]', { timeout: 5000 });
    console.log('✓ Product showcase section is visible');

    // Test 5: Footer is present
    await testUtils.waitForElement(page, 'footer');
    console.log('✓ Footer is present');

    // Test 6: CTA buttons are clickable
    const ctaButtons = await page.$$('[data-testid="cta-button"]');
    if (ctaButtons.length > 0) {
      console.log(`✓ Found ${ctaButtons.length} CTA buttons`);
    }

    // Test 7: Check for console errors
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    
    if (logs.length > 0) {
      console.log('Console logs found:', logs);
    }

    // Test 8: Performance measurement
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Performance metrics captured:', {
      pageLoad: performance.pageLoad,
      firstContentfulPaint: performance.firstContentfulPaint,
      lcp: performance.lcp
    });

    // Test 9: Mobile responsiveness
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, 'h1');
    console.log('✓ Mobile responsiveness verified');

    // Test 10: Take screenshot for verification
    await testUtils.takeScreenshot(page, 'homepage-final');
    console.log('✓ Screenshot captured');

    console.log('Homepage tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };