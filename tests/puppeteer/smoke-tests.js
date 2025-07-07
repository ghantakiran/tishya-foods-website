#!/usr/bin/env node

const puppeteer = require('puppeteer');
const config = require('./config/test-config');
const testUtils = require('./utils/test-utils');

async function runSmokeTests() {
  console.log('💨 Starting Smoke Testing Suite...');
  
  const browser = await testUtils.launchBrowser(puppeteer);
  const results = {
    testType: 'smoke',
    baseUrl: config.baseUrl,
    startTime: new Date(),
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      critical: 0
    }
  };

  try {
    // Test 1: Homepage loads
    await runSmokeTest('Homepage loads', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/');
        await testUtils.waitForElement(page, 'h1');
        const title = await page.title();
        console.log(`  📄 Page title: ${title}`);
        return { success: true, message: `Homepage loaded with title: ${title}` };
      } finally {
        await page.close();
      }
    }, true);

    // Test 2: Navigation menu works
    await runSmokeTest('Navigation menu works', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/');
        const navLinks = await page.$$eval('nav a', links => 
          links.map(link => ({ text: link.textContent.trim(), href: link.href }))
        );
        return { 
          success: navLinks.length > 0, 
          message: `Found ${navLinks.length} navigation links` 
        };
      } finally {
        await page.close();
      }
    });

    // Test 3: Products page loads
    await runSmokeTest('Products page loads', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/products');
        await testUtils.waitForElement(page, 'h1');
        const productCards = await page.$$('[data-testid="product-card"]');
        return { 
          success: productCards.length > 0, 
          message: `Found ${productCards.length} product cards` 
        };
      } finally {
        await page.close();
      }
    }, true);

    // Test 4: Contact page loads
    await runSmokeTest('Contact page loads', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/contact');
        await testUtils.waitForElement(page, 'h1');
        const contactForm = await page.$('[data-testid="contact-form"]');
        return { 
          success: !!contactForm, 
          message: contactForm ? 'Contact form found' : 'Contact form not found' 
        };
      } finally {
        await page.close();
      }
    });

    // Test 5: Cart functionality
    await runSmokeTest('Cart functionality', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/cart');
        await testUtils.waitForElement(page, 'h1');
        const cartContainer = await page.$('[data-testid="cart-container"], main');
        return { 
          success: !!cartContainer, 
          message: 'Cart page accessible' 
        };
      } finally {
        await page.close();
      }
    });

    // Test 6: Search functionality
    await runSmokeTest('Search functionality', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/products');
        const searchInput = await page.$('[data-testid="product-search-input"]');
        if (searchInput) {
          await searchInput.type('protein');
          await page.waitForTimeout(1000);
          return { success: true, message: 'Search input functional' };
        }
        return { success: false, message: 'Search input not found' };
      } finally {
        await page.close();
      }
    });

    // Test 7: Mobile responsiveness
    await runSmokeTest('Mobile responsiveness', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.simulateMobileDevice(page);
        await testUtils.navigateToPage(page, '/');
        await testUtils.waitForElement(page, 'body');
        
        const hasHorizontalScroll = await page.evaluate(() => 
          document.body.scrollWidth > window.innerWidth
        );
        
        return { 
          success: !hasHorizontalScroll, 
          message: hasHorizontalScroll ? 'Has horizontal scroll' : 'Mobile layout OK' 
        };
      } finally {
        await page.close();
      }
    });

    // Test 8: Images load
    await runSmokeTest('Images load', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/');
        await page.waitForTimeout(2000);
        
        const imageStats = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'));
          const loaded = images.filter(img => img.complete && img.naturalHeight !== 0);
          return { total: images.length, loaded: loaded.length };
        });
        
        const successRate = imageStats.total > 0 ? (imageStats.loaded / imageStats.total) : 1;
        return { 
          success: successRate >= 0.8, 
          message: `${imageStats.loaded}/${imageStats.total} images loaded (${Math.round(successRate * 100)}%)` 
        };
      } finally {
        await page.close();
      }
    });

    // Test 9: Forms are accessible
    await runSmokeTest('Forms are accessible', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/contact');
        const form = await page.$('form');
        if (form) {
          const inputs = await form.$$('input, textarea, select');
          return { 
            success: inputs.length > 0, 
            message: `Found form with ${inputs.length} inputs` 
          };
        }
        return { success: false, message: 'No forms found' };
      } finally {
        await page.close();
      }
    });

    // Test 10: No JavaScript errors
    await runSmokeTest('No JavaScript errors', async () => {
      const page = await testUtils.createPage(browser);
      const errors = [];
      
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      try {
        await testUtils.navigateToPage(page, '/');
        await page.waitForTimeout(3000);
        
        return { 
          success: errors.length === 0, 
          message: errors.length === 0 ? 'No JS errors' : `${errors.length} JS errors found` 
        };
      } finally {
        await page.close();
      }
    }, true);

    // Test 11: Performance baseline
    await runSmokeTest('Performance baseline', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/');
        const performance = await testUtils.measurePerformance(page);
        
        const acceptable = performance.pageLoad < 5000; // 5 seconds max
        return { 
          success: acceptable, 
          message: `Page load: ${performance.pageLoad}ms ${acceptable ? '(acceptable)' : '(slow)'}` 
        };
      } finally {
        await page.close();
      }
    });

    // Test 12: Basic SEO elements
    await runSmokeTest('Basic SEO elements', async () => {
      const page = await testUtils.createPage(browser);
      try {
        await testUtils.navigateToPage(page, '/');
        
        const seoElements = await page.evaluate(() => {
          return {
            title: !!document.title,
            metaDescription: !!document.querySelector('meta[name="description"]'),
            h1: !!document.querySelector('h1'),
            canonicalLink: !!document.querySelector('link[rel="canonical"]')
          };
        });
        
        const score = Object.values(seoElements).filter(Boolean).length;
        return { 
          success: score >= 3, 
          message: `${score}/4 basic SEO elements present` 
        };
      } finally {
        await page.close();
      }
    });

    // Helper function to run individual smoke tests
    async function runSmokeTest(testName, testFunction, isCritical = false) {
      console.log(`\n🧪 Running: ${testName}`);
      const testResult = {
        name: testName,
        critical: isCritical,
        startTime: new Date()
      };

      try {
        const result = await testFunction();
        testResult.success = result.success;
        testResult.message = result.message;
        testResult.endTime = new Date();
        testResult.duration = testResult.endTime - testResult.startTime;

        if (result.success) {
          console.log(`  ✅ ${result.message}`);
          results.summary.passed++;
        } else {
          console.log(`  ❌ ${result.message}`);
          results.summary.failed++;
          if (isCritical) {
            results.summary.critical++;
          }
        }

      } catch (error) {
        testResult.success = false;
        testResult.error = error.message;
        testResult.endTime = new Date();
        testResult.duration = testResult.endTime - testResult.startTime;
        
        console.log(`  💥 Error: ${error.message}`);
        results.summary.failed++;
        if (isCritical) {
          results.summary.critical++;
        }
      }

      results.tests.push(testResult);
      results.summary.total++;
    }

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;

    // Save results
    await testUtils.saveTestResults('smoke-tests', results);

    // Print final summary
    console.log('\n💨 Smoke Testing Summary:');
    console.log('=====================================');
    console.log(`Total Tests: ${results.summary.total}`);
    console.log(`Passed: ${results.summary.passed}`);
    console.log(`Failed: ${results.summary.failed}`);
    console.log(`Critical Failures: ${results.summary.critical}`);
    console.log(`Success Rate: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);
    console.log(`Test Duration: ${Math.round(results.duration / 1000)}s`);

    if (results.summary.critical > 0) {
      console.log('\n🚨 Critical smoke test failures detected!');
      results.tests.forEach(test => {
        if (test.critical && !test.success) {
          console.log(`  - ${test.name}: ${test.message || test.error}`);
        }
      });
      process.exit(1);
    } else if (results.summary.failed > 0) {
      console.log('\n⚠️  Some non-critical smoke tests failed:');
      results.tests.forEach(test => {
        if (!test.success && !test.critical) {
          console.log(`  - ${test.name}: ${test.message || test.error}`);
        }
      });
      console.log('\nNo critical failures - continuing...');
    } else {
      console.log('\n🎉 All smoke tests passed!');
    }

  } catch (error) {
    console.error('💥 Smoke testing failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  runSmokeTests();
}

module.exports = { runSmokeTests };