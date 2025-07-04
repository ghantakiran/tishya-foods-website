/**
 * Performance Testing & Core Web Vitals - Issue #7
 * Comprehensive performance analysis and optimization testing
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: [],
      performanceTests: [],
      coreWebVitals: {}
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/performance');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('⚡ Initializing Performance Testing & Core Web Vitals Analysis...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--enable-features=NetworkService'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Enable performance monitoring
    await this.page.setCacheEnabled(false);
    await this.page.setRequestInterception(true);
    
    // Track resource loading
    this.page.on('request', request => {
      this.trackRequest(request);
      request.continue();
    });
    
    this.page.on('response', response => {
      this.trackResponse(response);
    });
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.text().includes('Performance') || msg.text().includes('Web Vitals')) {
        console.log('PAGE PERF:', msg.text());
      }
    });
  }

  async runPerformanceTests() {
    console.log('🚀 Starting Performance Testing & Core Web Vitals Analysis...');
    
    try {
      // Test 1: Core Web Vitals measurement
      await this.measureCoreWebVitals();
      
      // Test 2: Page Load Performance
      await this.testPageLoadPerformance();
      
      // Test 3: Resource loading optimization
      await this.testResourceLoading();
      
      // Test 4: Image optimization testing
      await this.testImageOptimization();
      
      // Test 5: JavaScript bundle analysis
      await this.testJavaScriptPerformance();
      
      // Test 6: CSS performance
      await this.testCSSPerformance();
      
      // Test 7: Network waterfall analysis
      await this.testNetworkWaterfall();
      
      // Test 8: Mobile performance
      await this.testMobilePerformance();
      
      // Test 9: Memory usage analysis
      await this.testMemoryUsage();
      
      // Test 10: Third-party impact
      await this.testThirdPartyImpact();
      
      // Test 11: Caching effectiveness
      await this.testCachingStrategy();
      
      // Test 12: Progressive loading
      await this.testProgressiveLoading();
      
      console.log('✅ Performance Testing & Core Web Vitals analysis completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during performance testing:', error);
      this.results.issues.push({
        type: 'critical',
        category: 'testing',
        message: `Performance testing failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async measureCoreWebVitals() {
    console.log('📊 Step 1: Measuring Core Web Vitals...');
    
    try {
      // Navigate to homepage
      const navigationStart = Date.now();
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
      
      // Inject Web Vitals library
      await this.page.addScriptTag({
        url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
      });
      
      // Measure Core Web Vitals
      const webVitals = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {};
          let count = 0;
          const expectedMetrics = 3; // LCP, FID, CLS
          
          function reportVital(metric) {
            vitals[metric.name] = {
              value: metric.value,
              rating: metric.rating,
              delta: metric.delta
            };
            count++;
            
            if (count >= expectedMetrics) {
              resolve(vitals);
            }
          }
          
          // Measure LCP (Largest Contentful Paint)
          webVitals.onLCP(reportVital);
          
          // Measure FID (First Input Delay) - requires user interaction
          webVitals.onFID(reportVital);
          
          // Measure CLS (Cumulative Layout Shift)
          webVitals.onCLS(reportVital);
          
          // Fallback timeout
          setTimeout(() => {
            resolve(vitals);
          }, 10000);
          
          // Simulate user interaction for FID
          setTimeout(() => {
            document.body.click();
          }, 1000);
        });
      });
      
      // Additional performance metrics
      const additionalMetrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          navigationStart: navigation.navigationStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize,
          decodedBodySize: navigation.decodedBodySize
        };
      });
      
      this.results.coreWebVitals = {
        ...webVitals,
        ...additionalMetrics,
        timestamp: new Date().toISOString()
      };
      
      // Take screenshot of initial load
      await this.takeScreenshot('core-web-vitals-homepage', 'Core Web Vitals - Homepage initial load');
      
      console.log(`📊 Core Web Vitals Results:`);
      console.log(`  LCP: ${webVitals.LCP?.value?.toFixed(2)}ms (${webVitals.LCP?.rating})`);
      console.log(`  FID: ${webVitals.FID?.value?.toFixed(2)}ms (${webVitals.FID?.rating})`);
      console.log(`  CLS: ${webVitals.CLS?.value?.toFixed(3)} (${webVitals.CLS?.rating})`);
      console.log(`  DOM Content Loaded: ${additionalMetrics.domContentLoaded?.toFixed(2)}ms`);
      console.log(`  Load Complete: ${additionalMetrics.loadComplete?.toFixed(2)}ms`);
      
    } catch (error) {
      console.warn('⚠️ Core Web Vitals measurement warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'core_web_vitals',
        message: `Core Web Vitals measurement issue: ${error.message}`
      });
    }
  }

  async testPageLoadPerformance() {
    console.log('⏱️ Step 2: Testing Page Load Performance...');
    
    try {
      const pages = [
        { url: 'http://localhost:3000', name: 'homepage' },
        { url: 'http://localhost:3000/products', name: 'products' },
        { url: 'http://localhost:3000/about', name: 'about' },
        { url: 'http://localhost:3000/contact', name: 'contact' }
      ];
      
      for (const pageInfo of pages) {
        console.log(`  Testing ${pageInfo.name} page performance...`);
        
        // Clear cache for accurate measurement
        await this.page.reload({ waitUntil: 'networkidle2' });
        
        const startTime = Date.now();
        await this.page.goto(pageInfo.url, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        const loadTime = Date.now() - startTime;
        
        // Get detailed performance metrics
        const pageMetrics = await this.page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const resources = performance.getEntriesByType('resource');
          
          return {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            request: navigation.responseStart - navigation.requestStart,
            response: navigation.responseEnd - navigation.responseStart,
            dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            resources: resources.length,
            totalSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0)
          };
        });
        
        this.results.performanceTests.push({
          page: pageInfo.name,
          url: pageInfo.url,
          loadTime,
          metrics: pageMetrics,
          timestamp: new Date().toISOString()
        });
        
        await this.takeScreenshot(`page-load-${pageInfo.name}`, `${pageInfo.name} page load performance`);
        
        console.log(`    Load Time: ${loadTime}ms`);
        console.log(`    Resources: ${pageMetrics.resources}`);
        console.log(`    Total Size: ${(pageMetrics.totalSize / 1024).toFixed(2)}KB`);
      }
      
      this.results.metrics.pageLoadPerformance = true;
      
    } catch (error) {
      console.warn('⚠️ Page load performance test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'page_load',
        message: `Page load performance test issue: ${error.message}`
      });
    }
  }

  async testResourceLoading() {
    console.log('📦 Step 3: Testing Resource Loading Optimization...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze resource loading patterns
      const resourceAnalysis = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const analysis = {
          total: resources.length,
          byType: {},
          bySize: {},
          loadingIssues: []
        };
        
        resources.forEach(resource => {
          const type = resource.initiatorType || 'other';
          const size = resource.transferSize || 0;
          
          // Count by type
          analysis.byType[type] = (analysis.byType[type] || 0) + 1;
          
          // Group by size
          const sizeCategory = size > 100000 ? 'large' : size > 10000 ? 'medium' : 'small';
          analysis.bySize[sizeCategory] = (analysis.bySize[sizeCategory] || 0) + 1;
          
          // Identify potential issues
          if (resource.duration > 2000) {
            analysis.loadingIssues.push({
              url: resource.name,
              duration: resource.duration,
              size: size,
              type: type
            });
          }
        });
        
        return analysis;
      });
      
      this.results.metrics.resourceLoading = resourceAnalysis;
      
      // Test lazy loading effectiveness
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.takeScreenshot('resource-lazy-loading', 'Resource lazy loading test');
      
      console.log(`📦 Resource Analysis:`);
      console.log(`  Total Resources: ${resourceAnalysis.total}`);
      console.log(`  By Type:`, resourceAnalysis.byType);
      console.log(`  Loading Issues: ${resourceAnalysis.loadingIssues.length}`);
      
    } catch (error) {
      console.warn('⚠️ Resource loading test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'resource_loading',
        message: `Resource loading test issue: ${error.message}`
      });
    }
  }

  async testImageOptimization() {
    console.log('🖼️ Step 4: Testing Image Optimization...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze image optimization
      const imageAnalysis = await this.page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const analysis = {
          total: images.length,
          withAlt: 0,
          withLoading: 0,
          withSrcSet: 0,
          unoptimized: [],
          sizes: []
        };
        
        images.forEach(img => {
          if (img.alt) analysis.withAlt++;
          if (img.loading) analysis.withLoading++;
          if (img.srcset) analysis.withSrcSet++;
          
          // Check for optimization issues
          if (!img.loading || img.loading !== 'lazy') {
            analysis.unoptimized.push({
              src: img.src,
              alt: img.alt || 'No alt text',
              loading: img.loading || 'Not set'
            });
          }
          
          // Estimate size
          analysis.sizes.push({
            width: img.naturalWidth || img.width || 0,
            height: img.naturalHeight || img.height || 0,
            src: img.src
          });
        });
        
        return analysis;
      });
      
      this.results.metrics.imageOptimization = imageAnalysis;
      
      await this.takeScreenshot('image-optimization-analysis', 'Image optimization analysis');
      
      console.log(`🖼️ Image Optimization:`);
      console.log(`  Total Images: ${imageAnalysis.total}`);
      console.log(`  With Alt Text: ${imageAnalysis.withAlt}/${imageAnalysis.total}`);
      console.log(`  With Lazy Loading: ${imageAnalysis.withLoading}/${imageAnalysis.total}`);
      console.log(`  With Srcset: ${imageAnalysis.withSrcSet}/${imageAnalysis.total}`);
      console.log(`  Unoptimized: ${imageAnalysis.unoptimized.length}`);
      
    } catch (error) {
      console.warn('⚠️ Image optimization test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'image_optimization',
        message: `Image optimization test issue: ${error.message}`
      });
    }
  }

  async testJavaScriptPerformance() {
    console.log('📜 Step 5: Testing JavaScript Performance...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze JavaScript bundle performance
      const jsAnalysis = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const scripts = resources.filter(r => r.initiatorType === 'script' || r.name.includes('.js'));
        
        const analysis = {
          totalScripts: scripts.length,
          totalSize: scripts.reduce((acc, s) => acc + (s.transferSize || 0), 0),
          largeScripts: scripts.filter(s => (s.transferSize || 0) > 50000),
          slowScripts: scripts.filter(s => s.duration > 500),
          parseTime: 0,
          executeTime: 0
        };
        
        // Measure JavaScript execution time
        const startTime = performance.now();
        
        // Simulate heavy computation
        const testArray = new Array(10000).fill(0).map((_, i) => i);
        testArray.sort((a, b) => Math.random() - 0.5);
        
        analysis.executeTime = performance.now() - startTime;
        
        return analysis;
      });
      
      // Test JavaScript responsiveness
      const responsiveness = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          const measurements = [];
          let count = 0;
          
          function measureTask() {
            const start = performance.now();
            
            // Simulate UI task
            document.body.style.opacity = document.body.style.opacity === '0.99' ? '1' : '0.99';
            
            const end = performance.now();
            measurements.push(end - start);
            count++;
            
            if (count < 10) {
              setTimeout(measureTask, 100);
            } else {
              resolve({
                averageTaskTime: measurements.reduce((a, b) => a + b, 0) / measurements.length,
                maxTaskTime: Math.max(...measurements),
                minTaskTime: Math.min(...measurements)
              });
            }
          }
          
          measureTask();
        });
      });
      
      this.results.metrics.javascriptPerformance = {
        ...jsAnalysis,
        responsiveness
      };
      
      await this.takeScreenshot('javascript-performance', 'JavaScript performance analysis');
      
      console.log(`📜 JavaScript Performance:`);
      console.log(`  Total Scripts: ${jsAnalysis.totalScripts}`);
      console.log(`  Total Size: ${(jsAnalysis.totalSize / 1024).toFixed(2)}KB`);
      console.log(`  Large Scripts: ${jsAnalysis.largeScripts.length}`);
      console.log(`  Average Task Time: ${responsiveness.averageTaskTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.warn('⚠️ JavaScript performance test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'javascript_performance',
        message: `JavaScript performance test issue: ${error.message}`
      });
    }
  }

  async testCSSPerformance() {
    console.log('🎨 Step 6: Testing CSS Performance...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze CSS performance
      const cssAnalysis = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const stylesheets = resources.filter(r => r.initiatorType === 'css' || r.name.includes('.css'));
        
        const analysis = {
          totalStylesheets: stylesheets.length,
          totalSize: stylesheets.reduce((acc, s) => acc + (s.transferSize || 0), 0),
          largeStylesheets: stylesheets.filter(s => (s.transferSize || 0) > 20000),
          renderBlocking: 0,
          unusedRules: 0
        };
        
        // Count stylesheets
        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        analysis.renderBlocking = Array.from(linkElements).filter(link => 
          !link.media || link.media === 'all' || link.media === 'screen'
        ).length;
        
        // Estimate unused CSS (simplified)
        const allRules = Array.from(document.styleSheets).reduce((acc, sheet) => {
          try {
            return acc + (sheet.cssRules ? sheet.cssRules.length : 0);
          } catch (e) {
            return acc;
          }
        }, 0);
        
        analysis.totalRules = allRules;
        
        // Measure style recalculation performance
        const recalcStart = performance.now();
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
        const recalcTime = performance.now() - recalcStart;
        
        analysis.styleRecalcTime = recalcTime;
        
        return analysis;
      });
      
      this.results.metrics.cssPerformance = cssAnalysis;
      
      await this.takeScreenshot('css-performance', 'CSS performance analysis');
      
      console.log(`🎨 CSS Performance:`);
      console.log(`  Total Stylesheets: ${cssAnalysis.totalStylesheets}`);
      console.log(`  Total Size: ${(cssAnalysis.totalSize / 1024).toFixed(2)}KB`);
      console.log(`  Render Blocking: ${cssAnalysis.renderBlocking}`);
      console.log(`  Style Recalc Time: ${cssAnalysis.styleRecalcTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.warn('⚠️ CSS performance test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'css_performance',
        message: `CSS performance test issue: ${error.message}`
      });
    }
  }

  async testNetworkWaterfall() {
    console.log('🌊 Step 7: Testing Network Waterfall...');
    
    try {
      // Clear network logs
      await this.page.goto('about:blank');
      
      // Start fresh navigation with timing
      const startTime = Date.now();
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      const endTime = Date.now();
      
      // Analyze network waterfall
      const waterfallAnalysis = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const navigation = performance.getEntriesByType('navigation')[0];
        
        const waterfall = resources.map(resource => ({
          name: resource.name.split('/').pop(),
          type: resource.initiatorType,
          startTime: resource.startTime,
          duration: resource.duration,
          size: resource.transferSize || 0,
          renderBlocking: resource.renderBlockingStatus || 'unknown'
        })).sort((a, b) => a.startTime - b.startTime);
        
        return {
          navigationDuration: navigation.duration,
          criticalPath: waterfall.slice(0, 10),
          totalResources: waterfall.length,
          parallelRequests: this.calculateParallelRequests(waterfall),
          bottlenecks: waterfall.filter(r => r.duration > 1000)
        };
      });
      
      this.results.metrics.networkWaterfall = {
        ...waterfallAnalysis,
        totalLoadTime: endTime - startTime
      };
      
      await this.takeScreenshot('network-waterfall', 'Network waterfall analysis');
      
      console.log(`🌊 Network Waterfall:`);
      console.log(`  Total Load Time: ${endTime - startTime}ms`);
      console.log(`  Total Resources: ${waterfallAnalysis.totalResources}`);
      console.log(`  Bottlenecks: ${waterfallAnalysis.bottlenecks.length}`);
      
    } catch (error) {
      console.warn('⚠️ Network waterfall test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'network_waterfall',
        message: `Network waterfall test issue: ${error.message}`
      });
    }
  }

  async testMobilePerformance() {
    console.log('📱 Step 8: Testing Mobile Performance...');
    
    try {
      // Test on mobile viewport
      await this.page.setViewport({ width: 375, height: 667 });
      
      // Simulate slow 3G network
      await this.page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: Math.round(1.5 * 1024 * 1024 / 8), // 1.5 Mbps
        uploadThroughput: Math.round(750 * 1024 / 8), // 750 Kbps
        latency: 150 // 150ms
      });
      
      const mobileStartTime = Date.now();
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      const mobileLoadTime = Date.now() - mobileStartTime;
      
      // Test mobile-specific performance
      const mobileMetrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        return {
          loadTime: navigation.loadEventEnd - navigation.navigationStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          firstPaint: performance.getEntriesByType('paint')
            .find(p => p.name === 'first-paint')?.startTime || 0,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          touchTargets: document.querySelectorAll('[role="button"], button, a').length
        };
      });
      
      this.results.metrics.mobilePerformance = {
        ...mobileMetrics,
        actualLoadTime: mobileLoadTime,
        networkCondition: 'Slow 3G'
      };
      
      await this.takeScreenshot('mobile-performance', 'Mobile performance analysis');
      
      // Reset viewport and network
      await this.page.setViewport({ width: 1200, height: 800 });
      await this.page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: -1,
        uploadThroughput: -1,
        latency: 0
      });
      
      console.log(`📱 Mobile Performance:`);
      console.log(`  Load Time (Slow 3G): ${mobileLoadTime}ms`);
      console.log(`  DOM Content Loaded: ${mobileMetrics.domContentLoaded.toFixed(2)}ms`);
      console.log(`  Touch Targets: ${mobileMetrics.touchTargets}`);
      
    } catch (error) {
      console.warn('⚠️ Mobile performance test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'mobile_performance',
        message: `Mobile performance test issue: ${error.message}`
      });
    }
  }

  async testMemoryUsage() {
    console.log('🧠 Step 9: Testing Memory Usage...');
    
    try {
      // Test memory usage patterns
      const memoryMetrics = await this.page.evaluate(() => {
        const memory = performance.memory;
        
        // Create test objects to measure memory impact
        const testData = new Array(1000).fill(0).map((_, i) => ({
          id: i,
          data: `test-data-${i}`,
          timestamp: Date.now()
        }));
        
        const afterTestCreation = performance.memory;
        
        // Clean up test data
        testData.length = 0;
        
        return {
          initial: {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
          },
          afterTest: {
            usedJSHeapSize: afterTestCreation.usedJSHeapSize,
            totalJSHeapSize: afterTestCreation.totalJSHeapSize
          },
          memoryUsageIncrease: afterTestCreation.usedJSHeapSize - memory.usedJSHeapSize
        };
      });
      
      // Test for memory leaks by navigating and returning
      await this.page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      const finalMemory = await this.page.evaluate(() => performance.memory);
      
      this.results.metrics.memoryUsage = {
        ...memoryMetrics,
        final: finalMemory,
        potentialLeak: finalMemory.usedJSHeapSize > memoryMetrics.initial.usedJSHeapSize * 1.2
      };
      
      await this.takeScreenshot('memory-usage', 'Memory usage analysis');
      
      console.log(`🧠 Memory Usage:`);
      console.log(`  Initial: ${(memoryMetrics.initial.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  Final: ${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  Potential Leak: ${this.results.metrics.memoryUsage.potentialLeak ? 'Yes' : 'No'}`);
      
    } catch (error) {
      console.warn('⚠️ Memory usage test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'memory_usage',
        message: `Memory usage test issue: ${error.message}`
      });
    }
  }

  async testThirdPartyImpact() {
    console.log('🔗 Step 10: Testing Third-Party Impact...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze third-party resources
      const thirdPartyAnalysis = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const currentDomain = window.location.hostname;
        
        const thirdParty = resources.filter(resource => {
          const url = new URL(resource.name);
          return url.hostname !== currentDomain && url.hostname !== 'localhost';
        });
        
        const analysis = {
          total: thirdParty.length,
          totalSize: thirdParty.reduce((acc, r) => acc + (r.transferSize || 0), 0),
          totalTime: thirdParty.reduce((acc, r) => acc + r.duration, 0),
          domains: [...new Set(thirdParty.map(r => new URL(r.name).hostname))],
          slowThirdParty: thirdParty.filter(r => r.duration > 1000)
        };
        
        return analysis;
      });
      
      this.results.metrics.thirdPartyImpact = thirdPartyAnalysis;
      
      await this.takeScreenshot('third-party-analysis', 'Third-party impact analysis');
      
      console.log(`🔗 Third-Party Impact:`);
      console.log(`  Total Third-Party Resources: ${thirdPartyAnalysis.total}`);
      console.log(`  Total Size: ${(thirdPartyAnalysis.totalSize / 1024).toFixed(2)}KB`);
      console.log(`  Unique Domains: ${thirdPartyAnalysis.domains.length}`);
      console.log(`  Slow Requests: ${thirdPartyAnalysis.slowThirdParty.length}`);
      
    } catch (error) {
      console.warn('⚠️ Third-party impact test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'third_party_impact',
        message: `Third-party impact test issue: ${error.message}`
      });
    }
  }

  async testCachingStrategy() {
    console.log('💾 Step 11: Testing Caching Strategy...');
    
    try {
      // First load
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      const firstLoadMetrics = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return {
          totalResources: resources.length,
          totalSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
          cacheHits: resources.filter(r => r.transferSize === 0).length
        };
      });
      
      // Second load (should use cache)
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      const secondLoadMetrics = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return {
          totalResources: resources.length,
          totalSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
          cacheHits: resources.filter(r => r.transferSize === 0).length
        };
      });
      
      this.results.metrics.cachingStrategy = {
        firstLoad: firstLoadMetrics,
        secondLoad: secondLoadMetrics,
        cacheEffectiveness: secondLoadMetrics.cacheHits / secondLoadMetrics.totalResources,
        sizeSavings: firstLoadMetrics.totalSize - secondLoadMetrics.totalSize
      };
      
      await this.takeScreenshot('caching-analysis', 'Caching strategy analysis');
      
      console.log(`💾 Caching Strategy:`);
      console.log(`  First Load Size: ${(firstLoadMetrics.totalSize / 1024).toFixed(2)}KB`);
      console.log(`  Second Load Size: ${(secondLoadMetrics.totalSize / 1024).toFixed(2)}KB`);
      console.log(`  Cache Effectiveness: ${(this.results.metrics.cachingStrategy.cacheEffectiveness * 100).toFixed(1)}%`);
      console.log(`  Size Savings: ${(this.results.metrics.cachingStrategy.sizeSavings / 1024).toFixed(2)}KB`);
      
    } catch (error) {
      console.warn('⚠️ Caching strategy test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'caching_strategy',
        message: `Caching strategy test issue: ${error.message}`
      });
    }
  }

  async testProgressiveLoading() {
    console.log('⏳ Step 12: Testing Progressive Loading...');
    
    try {
      // Test progressive enhancement
      await this.page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      
      // Measure loading states
      const loadingStates = [];
      
      // Initial state
      loadingStates.push({
        timestamp: Date.now(),
        state: 'initial',
        readyState: await this.page.evaluate(() => document.readyState),
        visibleContent: await this.page.evaluate(() => document.body.children.length)
      });
      
      await this.takeScreenshot('progressive-loading-initial', 'Progressive loading - Initial state');
      
      // Wait for DOMContentLoaded
      await this.page.waitForSelector('body', { timeout: 5000 });
      
      loadingStates.push({
        timestamp: Date.now(),
        state: 'dom-ready',
        readyState: await this.page.evaluate(() => document.readyState),
        visibleContent: await this.page.evaluate(() => document.body.children.length)
      });
      
      await this.takeScreenshot('progressive-loading-dom-ready', 'Progressive loading - DOM ready');
      
      // Wait for full load
      await this.page.waitForLoadState('networkidle');
      
      loadingStates.push({
        timestamp: Date.now(),
        state: 'fully-loaded',
        readyState: await this.page.evaluate(() => document.readyState),
        visibleContent: await this.page.evaluate(() => document.body.children.length)
      });
      
      await this.takeScreenshot('progressive-loading-complete', 'Progressive loading - Complete');
      
      // Analyze progressive loading effectiveness
      const progressiveAnalysis = {
        states: loadingStates,
        timeToInteractive: loadingStates[1].timestamp - loadingStates[0].timestamp,
        timeToFullyLoaded: loadingStates[2].timestamp - loadingStates[0].timestamp,
        contentProgression: loadingStates.map(s => s.visibleContent)
      };
      
      this.results.metrics.progressiveLoading = progressiveAnalysis;
      
      console.log(`⏳ Progressive Loading:`);
      console.log(`  Time to Interactive: ${progressiveAnalysis.timeToInteractive}ms`);
      console.log(`  Time to Fully Loaded: ${progressiveAnalysis.timeToFullyLoaded}ms`);
      console.log(`  Content Progression: ${progressiveAnalysis.contentProgression.join(' → ')}`);
      
    } catch (error) {
      console.warn('⚠️ Progressive loading test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'progressive_loading',
        message: `Progressive loading test issue: ${error.message}`
      });
    }
  }

  trackRequest(request) {
    // Track request patterns for analysis
    if (!this.results.metrics.requestTracking) {
      this.results.metrics.requestTracking = {
        total: 0,
        byType: {},
        byDomain: {}
      };
    }
    
    this.results.metrics.requestTracking.total++;
    
    const url = new URL(request.url());
    const resourceType = request.resourceType();
    
    this.results.metrics.requestTracking.byType[resourceType] = 
      (this.results.metrics.requestTracking.byType[resourceType] || 0) + 1;
    
    this.results.metrics.requestTracking.byDomain[url.hostname] = 
      (this.results.metrics.requestTracking.byDomain[url.hostname] || 0) + 1;
  }

  trackResponse(response) {
    // Track response patterns for analysis
    if (!this.results.metrics.responseTracking) {
      this.results.metrics.responseTracking = {
        statusCodes: {},
        averageSize: 0,
        totalSize: 0,
        count: 0
      };
    }
    
    const status = response.status();
    const size = response.headers()['content-length'] || 0;
    
    this.results.metrics.responseTracking.statusCodes[status] = 
      (this.results.metrics.responseTracking.statusCodes[status] || 0) + 1;
    
    this.results.metrics.responseTracking.totalSize += parseInt(size) || 0;
    this.results.metrics.responseTracking.count++;
    this.results.metrics.responseTracking.averageSize = 
      this.results.metrics.responseTracking.totalSize / this.results.metrics.responseTracking.count;
  }

  async takeScreenshot(filename, description) {
    try {
      const screenshotPath = path.join(this.screenshotDir, `${filename}.png`);
      await this.page.screenshot({ 
        path: screenshotPath, 
        fullPage: filename.includes('full') 
      });
      
      this.results.screenshots.push({
        filename: `${filename}.png`,
        description,
        path: screenshotPath,
        timestamp: new Date().toISOString()
      });
      
      console.log(`📸 Screenshot saved: ${filename}.png - ${description}`);
    } catch (error) {
      console.error(`❌ Failed to take screenshot ${filename}:`, error.message);
    }
  }

  generateRecommendations() {
    console.log('💡 Generating performance recommendations...');
    
    const recommendations = [];
    
    // Core Web Vitals recommendations
    if (this.results.coreWebVitals.LCP?.value > 2500) {
      recommendations.push({
        category: 'Core Web Vitals',
        priority: 'High',
        issue: 'Poor Largest Contentful Paint (LCP)',
        recommendation: 'Optimize LCP by improving server response times, optimizing images, and reducing render-blocking resources',
        metric: `Current LCP: ${this.results.coreWebVitals.LCP.value.toFixed(2)}ms (target: <2500ms)`
      });
    }
    
    if (this.results.coreWebVitals.FID?.value > 100) {
      recommendations.push({
        category: 'Core Web Vitals',
        priority: 'High',
        issue: 'Poor First Input Delay (FID)',
        recommendation: 'Reduce JavaScript execution time and main thread blocking',
        metric: `Current FID: ${this.results.coreWebVitals.FID.value.toFixed(2)}ms (target: <100ms)`
      });
    }
    
    if (this.results.coreWebVitals.CLS?.value > 0.1) {
      recommendations.push({
        category: 'Core Web Vitals',
        priority: 'High',
        issue: 'Poor Cumulative Layout Shift (CLS)',
        recommendation: 'Set dimensions for images and ads, use CSS aspect ratio, avoid inserting content above existing content',
        metric: `Current CLS: ${this.results.coreWebVitals.CLS.value.toFixed(3)} (target: <0.1)`
      });
    }
    
    // Image optimization recommendations
    if (this.results.metrics.imageOptimization && this.results.metrics.imageOptimization.withLoading < this.results.metrics.imageOptimization.total * 0.8) {
      recommendations.push({
        category: 'Image Optimization',
        priority: 'Medium',
        issue: 'Insufficient lazy loading implementation',
        recommendation: 'Add loading="lazy" attribute to all non-critical images',
        metric: `Lazy loaded: ${this.results.metrics.imageOptimization.withLoading}/${this.results.metrics.imageOptimization.total}`
      });
    }
    
    // JavaScript performance recommendations
    if (this.results.metrics.javascriptPerformance && this.results.metrics.javascriptPerformance.totalSize > 500000) {
      recommendations.push({
        category: 'JavaScript Performance',
        priority: 'Medium',
        issue: 'Large JavaScript bundle size',
        recommendation: 'Implement code splitting, tree shaking, and remove unused code',
        metric: `Bundle size: ${(this.results.metrics.javascriptPerformance.totalSize / 1024).toFixed(2)}KB`
      });
    }
    
    // Mobile performance recommendations
    if (this.results.metrics.mobilePerformance && this.results.metrics.mobilePerformance.actualLoadTime > 5000) {
      recommendations.push({
        category: 'Mobile Performance',
        priority: 'High',
        issue: 'Slow mobile loading performance',
        recommendation: 'Optimize for mobile networks with resource prioritization and progressive loading',
        metric: `Mobile load time: ${this.results.metrics.mobilePerformance.actualLoadTime}ms`
      });
    }
    
    // Caching recommendations
    if (this.results.metrics.cachingStrategy && this.results.metrics.cachingStrategy.cacheEffectiveness < 0.6) {
      recommendations.push({
        category: 'Caching Strategy',
        priority: 'Medium',
        issue: 'Poor cache effectiveness',
        recommendation: 'Implement proper cache headers and service worker for static resources',
        metric: `Cache effectiveness: ${(this.results.metrics.cachingStrategy.cacheEffectiveness * 100).toFixed(1)}%`
      });
    }
    
    // Memory usage recommendations
    if (this.results.metrics.memoryUsage && this.results.metrics.memoryUsage.potentialLeak) {
      recommendations.push({
        category: 'Memory Management',
        priority: 'Medium',
        issue: 'Potential memory leak detected',
        recommendation: 'Review JavaScript code for event listener cleanup and proper component unmounting',
        metric: 'Memory usage increased significantly during navigation'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating Performance & Core Web Vitals report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Performance Testing & Core Web Vitals Analysis Report',
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      summary: {
        totalScreenshots: this.results.screenshots.length,
        totalIssues: this.results.issues.length,
        totalRecommendations: this.results.recommendations.length,
        overallScore: this.calculateOverallScore()
      },
      coreWebVitals: this.results.coreWebVitals,
      metrics: this.results.metrics,
      performanceTests: this.results.performanceTests,
      screenshots: this.results.screenshots,
      issues: this.results.issues,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Implement high-priority performance optimizations',
        'Optimize Core Web Vitals metrics to meet thresholds',
        'Reduce JavaScript bundle size and improve loading',
        'Enhance image optimization and lazy loading',
        'Implement effective caching strategy',
        'Monitor performance continuously with analytics'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'performance-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // Core Web Vitals scoring (40% of total)
    if (this.results.coreWebVitals.LCP?.value > 4000) score -= 20;
    else if (this.results.coreWebVitals.LCP?.value > 2500) score -= 10;
    
    if (this.results.coreWebVitals.FID?.value > 300) score -= 15;
    else if (this.results.coreWebVitals.FID?.value > 100) score -= 8;
    
    if (this.results.coreWebVitals.CLS?.value > 0.25) score -= 15;
    else if (this.results.coreWebVitals.CLS?.value > 0.1) score -= 8;
    
    // Performance metrics scoring (40% of total)
    if (this.results.metrics.javascriptPerformance?.totalSize > 1000000) score -= 10;
    if (this.results.metrics.imageOptimization?.withLoading < this.results.metrics.imageOptimization?.total * 0.8) score -= 8;
    if (this.results.metrics.mobilePerformance?.actualLoadTime > 5000) score -= 10;
    if (this.results.metrics.cachingStrategy?.cacheEffectiveness < 0.6) score -= 8;
    if (this.results.metrics.memoryUsage?.potentialLeak) score -= 10;
    
    // Issues penalties (20% of total)
    score -= this.results.issues.filter(i => i.type === 'critical').length * 10;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 3;
    
    return Math.max(0, Math.round(score));
  }

  generateMarkdownReport(report) {
    const vitals = report.coreWebVitals;
    const metrics = report.metrics;
    
    return `# Performance Testing & Core Web Vitals Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}

## 🚀 Core Web Vitals

| Metric | Value | Rating | Status |
|--------|-------|--------|--------|
| **LCP** (Largest Contentful Paint) | ${vitals.LCP?.value?.toFixed(2) || 'N/A'}ms | ${vitals.LCP?.rating || 'N/A'} | ${vitals.LCP?.value <= 2500 ? '✅ Good' : vitals.LCP?.value <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor'} |
| **FID** (First Input Delay) | ${vitals.FID?.value?.toFixed(2) || 'N/A'}ms | ${vitals.FID?.rating || 'N/A'} | ${vitals.FID?.value <= 100 ? '✅ Good' : vitals.FID?.value <= 300 ? '⚠️ Needs Improvement' : '❌ Poor'} |
| **CLS** (Cumulative Layout Shift) | ${vitals.CLS?.value?.toFixed(3) || 'N/A'} | ${vitals.CLS?.rating || 'N/A'} | ${vitals.CLS?.value <= 0.1 ? '✅ Good' : vitals.CLS?.value <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'} |

### Additional Metrics
- **DOM Content Loaded:** ${vitals.domContentLoaded?.toFixed(2) || 'N/A'}ms
- **Load Complete:** ${vitals.loadComplete?.toFixed(2) || 'N/A'}ms
- **First Paint:** ${vitals.firstPaint?.toFixed(2) || 'N/A'}ms
- **First Contentful Paint:** ${vitals.firstContentfulPaint?.toFixed(2) || 'N/A'}ms

## ⚡ Performance Metrics

### Page Load Performance
${report.performanceTests.map(test => 
  `- **${test.page}**: ${test.loadTime}ms (${test.metrics.resources} resources, ${(test.metrics.totalSize / 1024).toFixed(2)}KB)`
).join('\n')}

### Resource Analysis
- **Total Resources:** ${metrics.resourceLoading?.total || 'N/A'}
- **Loading Issues:** ${metrics.resourceLoading?.loadingIssues?.length || 0}
- **Resource Types:** ${metrics.resourceLoading?.byType ? Object.entries(metrics.resourceLoading.byType).map(([type, count]) => `${type}: ${count}`).join(', ') : 'N/A'}

### Image Optimization
- **Total Images:** ${metrics.imageOptimization?.total || 'N/A'}
- **With Alt Text:** ${metrics.imageOptimization?.withAlt || 'N/A'}/${metrics.imageOptimization?.total || 'N/A'}
- **With Lazy Loading:** ${metrics.imageOptimization?.withLoading || 'N/A'}/${metrics.imageOptimization?.total || 'N/A'}
- **Unoptimized Images:** ${metrics.imageOptimization?.unoptimized?.length || 0}

### JavaScript Performance
- **Total Scripts:** ${metrics.javascriptPerformance?.totalScripts || 'N/A'}
- **Total Size:** ${metrics.javascriptPerformance?.totalSize ? (metrics.javascriptPerformance.totalSize / 1024).toFixed(2) + 'KB' : 'N/A'}
- **Large Scripts:** ${metrics.javascriptPerformance?.largeScripts?.length || 0}
- **Average Task Time:** ${metrics.javascriptPerformance?.responsiveness?.averageTaskTime?.toFixed(2) || 'N/A'}ms

### Mobile Performance
- **Load Time (Slow 3G):** ${metrics.mobilePerformance?.actualLoadTime || 'N/A'}ms
- **DOM Content Loaded:** ${metrics.mobilePerformance?.domContentLoaded?.toFixed(2) || 'N/A'}ms
- **Touch Targets:** ${metrics.mobilePerformance?.touchTargets || 'N/A'}

### Caching Strategy
- **Cache Effectiveness:** ${metrics.cachingStrategy?.cacheEffectiveness ? (metrics.cachingStrategy.cacheEffectiveness * 100).toFixed(1) + '%' : 'N/A'}
- **Size Savings:** ${metrics.cachingStrategy?.sizeSavings ? (metrics.cachingStrategy.sizeSavings / 1024).toFixed(2) + 'KB' : 'N/A'}

### Memory Usage
- **Initial Memory:** ${metrics.memoryUsage?.initial?.usedJSHeapSize ? (metrics.memoryUsage.initial.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}
- **Final Memory:** ${metrics.memoryUsage?.final?.usedJSHeapSize ? (metrics.memoryUsage.final.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}
- **Potential Leak:** ${metrics.memoryUsage?.potentialLeak ? '⚠️ Yes' : '✅ No'}

## 📸 Screenshots Captured

${report.screenshots.map(s => `- **${s.filename}:** ${s.description}`).join('\n')}

## ⚠️ Issues Found

${report.issues.length > 0 ? report.issues.map(issue => 
  `- **${issue.type.toUpperCase()}:** ${issue.message}${issue.category ? ` (Category: ${issue.category})` : ''}`
).join('\n') : 'No issues found.'}

## 💡 Recommendations

${report.recommendations.map(rec => 
  `### ${rec.category} - ${rec.priority} Priority
- **Issue:** ${rec.issue}
- **Recommendation:** ${rec.recommendation}
- **Metric:** ${rec.metric}
`).join('\n')}

## 🎯 Next Steps

${report.nextSteps.map(step => `- ${step}`).join('\n')}

---
*Report generated by Tishya Foods Performance Testing & Core Web Vitals Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runPerformanceTest() {
  const tester = new PerformanceTester();
  
  try {
    await tester.initialize();
    await tester.runPerformanceTests();
    const report = await tester.generateReport();
    
    console.log('\n🎉 Performance Testing & Core Web Vitals Analysis Complete!');
    console.log('📊 Overall Score:', report.summary.overallScore + '/100');
    console.log('📁 Results saved to:', tester.screenshotDir);
    
    // Display key metrics
    if (report.coreWebVitals.LCP) {
      console.log(`🚀 LCP: ${report.coreWebVitals.LCP.value.toFixed(2)}ms (${report.coreWebVitals.LCP.rating})`);
    }
    if (report.coreWebVitals.FID) {
      console.log(`⚡ FID: ${report.coreWebVitals.FID.value.toFixed(2)}ms (${report.coreWebVitals.FID.rating})`);
    }
    if (report.coreWebVitals.CLS) {
      console.log(`📐 CLS: ${report.coreWebVitals.CLS.value.toFixed(3)} (${report.coreWebVitals.CLS.rating})`);
    }
    
    return report;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  } finally {
    await tester.cleanup();
  }
}

// Export for use in other modules
module.exports = { PerformanceTester, runPerformanceTest };

// Run if called directly
if (require.main === module) {
  runPerformanceTest()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}