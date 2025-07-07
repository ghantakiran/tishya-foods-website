#!/usr/bin/env node

const puppeteer = require('puppeteer');
const config = require('./config/test-config');
const testUtils = require('./utils/test-utils');

async function runPerformanceTests() {
  console.log('🚀 Starting Performance Testing Suite...');
  
  const browser = await testUtils.launchBrowser(puppeteer);
  const results = {
    testType: 'performance',
    startTime: new Date(),
    pages: [],
    summary: {
      averagePageLoad: 0,
      averageFCP: 0,
      averageLCP: 0,
      totalPages: 0,
      passedThresholds: 0,
      failedThresholds: 0
    }
  };

  try {
    const testPages = [
      { path: '/', name: 'Homepage' },
      { path: '/products', name: 'Products' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/cart', name: 'Cart' }
    ];

    for (const testPage of testPages) {
      console.log(`\n📊 Testing performance for ${testPage.name}...`);
      
      const page = await testUtils.createPage(browser);
      
      try {
        // Navigate and measure performance
        await testUtils.navigateToPage(page, testPage.path);
        await testUtils.waitForNetworkIdle(page);
        
        const performance = await testUtils.measurePerformance(page);
        
        // Validate against thresholds
        const thresholds = config.performance;
        const validations = {
          pageLoad: performance.pageLoad <= thresholds.pageLoad,
          domContentLoaded: performance.domContentLoaded <= thresholds.domContentLoaded,
          fcp: performance.firstContentfulPaint <= thresholds.fcp,
          lcp: (performance.lcp || 0) <= thresholds.lcp,
          cls: (performance.cls || 0) <= thresholds.cls,
          ttfb: (performance.ttfb || 0) <= thresholds.ttfb
        };

        const pageResult = {
          page: testPage.name,
          path: testPage.path,
          performance,
          validations,
          passed: Object.values(validations).every(v => v),
          timestamp: new Date().toISOString()
        };

        results.pages.push(pageResult);
        
        console.log(`  📈 Page Load: ${performance.pageLoad}ms ${validations.pageLoad ? '✅' : '❌'}`);
        console.log(`  🎨 FCP: ${performance.firstContentfulPaint}ms ${validations.fcp ? '✅' : '❌'}`);
        console.log(`  🖼️  LCP: ${performance.lcp || 'N/A'}ms ${validations.lcp ? '✅' : '❌'}`);
        console.log(`  ⚡ TTFB: ${performance.ttfb || 'N/A'}ms ${validations.ttfb ? '✅' : '❌'}`);
        
        if (pageResult.passed) {
          results.summary.passedThresholds++;
          console.log(`  ✅ ${testPage.name} passed all performance thresholds`);
        } else {
          results.summary.failedThresholds++;
          console.log(`  ❌ ${testPage.name} failed some performance thresholds`);
        }
        
        // Take screenshot
        await testUtils.takeScreenshot(page, `performance-${testPage.name.toLowerCase()}`);
        
      } catch (error) {
        console.error(`  ❌ Error testing ${testPage.name}:`, error.message);
      } finally {
        await page.close();
      }
    }

    // Calculate summary statistics
    results.summary.totalPages = results.pages.length;
    if (results.pages.length > 0) {
      results.summary.averagePageLoad = Math.round(
        results.pages.reduce((sum, page) => sum + page.performance.pageLoad, 0) / results.pages.length
      );
      results.summary.averageFCP = Math.round(
        results.pages.reduce((sum, page) => sum + page.performance.firstContentfulPaint, 0) / results.pages.length
      );
      results.summary.averageLCP = Math.round(
        results.pages.reduce((sum, page) => sum + (page.performance.lcp || 0), 0) / results.pages.length
      );
    }

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;

    // Save results
    await testUtils.saveTestResults('performance-suite', results);

    // Print final summary
    console.log('\n📊 Performance Testing Summary:');
    console.log('=====================================');
    console.log(`Total Pages Tested: ${results.summary.totalPages}`);
    console.log(`Passed Thresholds: ${results.summary.passedThresholds}`);
    console.log(`Failed Thresholds: ${results.summary.failedThresholds}`);
    console.log(`Average Page Load: ${results.summary.averagePageLoad}ms`);
    console.log(`Average FCP: ${results.summary.averageFCP}ms`);
    console.log(`Average LCP: ${results.summary.averageLCP}ms`);
    console.log(`Test Duration: ${Math.round(results.duration / 1000)}s`);

    if (results.summary.failedThresholds > 0) {
      console.log('\n⚠️  Performance Issues Found:');
      results.pages.forEach(page => {
        if (!page.passed) {
          console.log(`  - ${page.page}: Failed performance thresholds`);
        }
      });
      process.exit(1);
    } else {
      console.log('\n🎉 All pages passed performance thresholds!');
    }

  } catch (error) {
    console.error('💥 Performance testing failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  runPerformanceTests();
}

module.exports = { runPerformanceTests };