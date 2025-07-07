const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running performance tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('performance');

  try {
    // Test 1: Homepage performance
    console.log('Testing homepage performance...');
    await testUtils.navigateToPage(page, '/');
    
    const homepagePerf = await testUtils.measurePerformance(page);
    console.log('Homepage Performance Metrics:', {
      pageLoad: homepagePerf.pageLoad,
      domContentLoaded: homepagePerf.domContentLoaded,
      firstContentfulPaint: homepagePerf.firstContentfulPaint,
      lcp: homepagePerf.lcp,
      fid: homepagePerf.fid,
      cls: homepagePerf.cls
    });

    // Validate against thresholds
    const perfThresholds = config.performance;
    const perfResults = {
      pageLoad: homepagePerf.pageLoad <= perfThresholds.pageLoad,
      domContentLoaded: homepagePerf.domContentLoaded <= perfThresholds.domContentLoaded,
      fcp: homepagePerf.firstContentfulPaint <= perfThresholds.fcp,
      lcp: (homepagePerf.lcp || 0) <= perfThresholds.lcp,
      cls: (homepagePerf.cls || 0) <= perfThresholds.cls
    };

    console.log('✓ Homepage Performance Validation:', perfResults);

    // Test 2: Products page performance
    console.log('Testing products page performance...');
    await testUtils.navigateToPage(page, '/products');
    
    const productsPerf = await testUtils.measurePerformance(page);
    console.log('Products Page Performance:', {
      pageLoad: productsPerf.pageLoad,
      resourceCount: productsPerf.resourceStats.requests,
      totalSize: Math.round(productsPerf.resourceStats.totalSize / 1024) + ' KB'
    });

    // Test 3: Resource loading performance
    console.log('Testing resource loading...');
    const resourceStats = page.resourceStats || {};
    console.log('Resource Statistics:', {
      totalRequests: resourceStats.requests || 0,
      totalResponses: resourceStats.responses || 0,
      failures: resourceStats.failures || 0,
      jsSize: Math.round((resourceStats.jsSize || 0) / 1024) + ' KB',
      cssSize: Math.round((resourceStats.cssSize || 0) / 1024) + ' KB',
      imageSize: Math.round((resourceStats.imageSize || 0) / 1024) + ' KB'
    });

    // Validate resource sizes
    const resourceValidation = {
      jsSize: (resourceStats.jsSize || 0) <= perfThresholds.maxJsSize,
      cssSize: (resourceStats.cssSize || 0) <= perfThresholds.maxCssSize,
      imageSize: (resourceStats.imageSize || 0) <= perfThresholds.maxImageSize
    };
    console.log('✓ Resource Size Validation:', resourceValidation);

    // Test 4: Memory usage
    console.log('Testing memory usage...');
    const memoryMetrics = await page.metrics();
    console.log('Memory Metrics:', {
      jsHeapUsed: Math.round(memoryMetrics.JSHeapUsedSize / 1024 / 1024) + ' MB',
      jsHeapTotal: Math.round(memoryMetrics.JSHeapTotalSize / 1024 / 1024) + ' MB',
      nodes: memoryMetrics.Nodes,
      listeners: memoryMetrics.JSEventListeners
    });

    // Test 5: Network performance
    console.log('Testing network performance...');
    const networkMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnect: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        downloadTime: timing.responseEnd - timing.responseStart,
        redirectTime: navigation?.redirectEnd - navigation?.redirectStart || 0
      };
    });
    
    console.log('Network Performance:', networkMetrics);
    
    // Validate TTFB
    const ttfbValid = networkMetrics.ttfb <= perfThresholds.ttfb;
    console.log('✓ TTFB Validation:', ttfbValid, `(${networkMetrics.ttfb}ms <= ${perfThresholds.ttfb}ms)`);

    // Test 6: Render performance
    console.log('Testing render performance...');
    const renderMetrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const layoutShifts = performance.getEntriesByType('layout-shift');
      
      return {
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        totalLayoutShifts: layoutShifts.length,
        cumulativeLayoutShift: layoutShifts.reduce((sum, entry) => sum + entry.value, 0)
      };
    });
    
    console.log('Render Performance:', renderMetrics);

    // Test 7: Mobile performance
    console.log('Testing mobile performance...');
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForNetworkIdle(page);
    
    const mobilePerf = await testUtils.measurePerformance(page);
    console.log('Mobile Performance:', {
      pageLoad: mobilePerf.pageLoad,
      firstContentfulPaint: mobilePerf.firstContentfulPaint,
      lcp: mobilePerf.lcp
    });

    // Test 8: Image optimization
    console.log('Testing image optimization...');
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight,
        loading: img.loading,
        format: img.src.split('.').pop()?.split('?')[0]
      }))
    );
    
    console.log(`Found ${images.length} images`);
    
    const oversizedImages = images.filter(img => 
      img.naturalWidth > img.displayWidth * 2 || 
      img.naturalHeight > img.displayHeight * 2
    );
    
    console.log('✓ Image Optimization Check:', {
      totalImages: images.length,
      oversizedImages: oversizedImages.length,
      lazyLoadingImages: images.filter(img => img.loading === 'lazy').length
    });

    // Test 9: JavaScript execution performance
    console.log('Testing JavaScript execution performance...');
    const jsPerformance = await page.evaluate(() => {
      const start = performance.now();
      
      // Simulate some DOM operations
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.textContent = `Performance test ${i}`;
        document.body.appendChild(div);
        document.body.removeChild(div);
      }
      
      const end = performance.now();
      return end - start;
    });
    
    console.log('JavaScript Execution Time:', jsPerformance.toFixed(2) + 'ms');

    // Test 10: Scroll performance
    console.log('Testing scroll performance...');
    const scrollStart = await page.evaluate(() => performance.now());
    
    await page.evaluate(() => {
      return new Promise(resolve => {
        let scrolled = 0;
        const scrollStep = () => {
          window.scrollBy(0, 100);
          scrolled += 100;
          if (scrolled < document.body.scrollHeight && scrolled < 2000) {
            requestAnimationFrame(scrollStep);
          } else {
            resolve();
          }
        };
        scrollStep();
      });
    });
    
    const scrollEnd = await page.evaluate(() => performance.now());
    console.log('Scroll Performance:', (scrollEnd - scrollStart).toFixed(2) + 'ms');

    // Test 11: Bundle analysis simulation
    console.log('Analyzing bundle sizes...');
    const bundleAnalysis = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      return {
        scriptCount: scripts.length,
        stylesheetCount: stylesheets.length,
        scripts: scripts.map(script => script.src),
        stylesheets: stylesheets.map(link => link.href)
      };
    });
    
    console.log('Bundle Analysis:', {
      scriptFiles: bundleAnalysis.scriptCount,
      stylesheetFiles: bundleAnalysis.stylesheetCount
    });

    // Test 12: Third-party scripts performance
    console.log('Testing third-party scripts...');
    const thirdPartyScripts = bundleAnalysis.scripts.filter(src => 
      !src.includes(new URL(page.url()).hostname)
    );
    
    console.log('Third-party Scripts:', thirdPartyScripts.length);

    // Test 13: Cache performance
    console.log('Testing cache performance...');
    await page.reload();
    const cacheLoadTime = await testUtils.measurePerformance(page);
    
    console.log('Cache Performance (Second Load):', {
      pageLoad: cacheLoadTime.pageLoad,
      improvement: Math.round(((homepagePerf.pageLoad - cacheLoadTime.pageLoad) / homepagePerf.pageLoad) * 100) + '%'
    });

    // Test 14: API response times
    console.log('Testing API performance...');
    const apiRequests = [];
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiRequests.push({
          url: response.url(),
          status: response.status(),
          timing: response.timing()
        });
      }
    });
    
    // Navigate to a page that makes API calls
    await testUtils.navigateToPage(page, '/products');
    await page.waitForTimeout(3000);
    
    if (apiRequests.length > 0) {
      console.log(`API Requests: ${apiRequests.length}`);
      const avgResponseTime = apiRequests.reduce((sum, req) => 
        sum + (req.timing?.receiveHeadersEnd || 0), 0) / apiRequests.length;
      console.log('Average API Response Time:', avgResponseTime.toFixed(2) + 'ms');
    }

    // Test 15: Performance regression detection
    const performanceReport = {
      timestamp: new Date().toISOString(),
      homepage: {
        pageLoad: homepagePerf.pageLoad,
        fcp: homepagePerf.firstContentfulPaint,
        lcp: homepagePerf.lcp,
        cls: homepagePerf.cls
      },
      products: {
        pageLoad: productsPerf.pageLoad,
        resourceCount: productsPerf.resourceStats.requests
      },
      mobile: {
        pageLoad: mobilePerf.pageLoad,
        fcp: mobilePerf.firstContentfulPaint
      },
      resources: resourceStats,
      thresholds: perfThresholds,
      validation: {
        performance: perfResults,
        resources: resourceValidation,
        ttfb: ttfbValid
      }
    };

    // Save performance report
    await testUtils.saveTestResults('performance-report', performanceReport);
    console.log('✓ Performance report saved');

    // Take performance screenshot
    await testUtils.takeScreenshot(page, 'performance-final');
    
    console.log('Performance tests completed successfully');
    
    // Check if any critical performance thresholds failed
    const criticalFailures = [];
    if (!perfResults.pageLoad) criticalFailures.push('Page Load Time');
    if (!perfResults.lcp) criticalFailures.push('Largest Contentful Paint');
    if (!ttfbValid) criticalFailures.push('Time to First Byte');
    
    if (criticalFailures.length > 0) {
      console.warn('⚠ Critical performance thresholds failed:', criticalFailures);
    }
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };