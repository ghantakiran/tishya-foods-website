/**
 * Progressive Web App (PWA) Testing Suite
 * Tests PWA features including installation, offline functionality, and app-like experience
 * 
 * Usage: node tests/puppeteer/pwa-testing.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  headless: process.env.HEADLESS !== 'false',
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  screenshotDir: path.join(__dirname, '../../screenshots/pwa-testing'),
  reportFile: path.join(__dirname, '../../screenshots/pwa-testing/pwa-testing-report.json'),
  markdownFile: path.join(__dirname, '../../screenshots/pwa-testing/pwa-testing-report.md')
};

// PWA test results
const testResults = {
  timestamp: new Date().toISOString(),
  url: TEST_CONFIG.baseUrl,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  pwaMetrics: {},
  recommendations: []
};

/**
 * Main test execution function
 */
async function runPWATests() {
  console.log('🚀 Starting Progressive Web App (PWA) Testing Suite...\n');
  
  let browser;
  try {
    // Create screenshots directory
    await fs.mkdir(TEST_CONFIG.screenshotDir, { recursive: true });
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport(TEST_CONFIG.viewport);
    
    // Set longer timeout for network operations
    page.setDefaultTimeout(TEST_CONFIG.timeout);
    
    // Run PWA tests
    await testPWAManifest(page);
    await testServiceWorkerRegistration(page);
    await testOfflineFunctionality(page);
    await testInstallationPrompt(page);
    await testAppLikeExperience(page);
    await testPushNotificationSupport(page);
    await testPWAMetrics(page);
    await testPerformanceInAppMode(page);
    await testCacheStrategies(page);
    await testBackgroundSync(page);
    
    // Generate reports
    await generateReports();
    
  } catch (error) {
    console.error('❌ PWA testing failed:', error);
    recordTest('PWA Testing Suite', false, error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Test PWA manifest configuration
 */
async function testPWAManifest(page) {
  console.log('📋 Testing PWA Manifest...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Check manifest link in HTML
    const manifestLink = await page.$('link[rel="manifest"]');
    const hasManifestLink = !!manifestLink;
    
    if (!hasManifestLink) {
      recordTest('PWA Manifest Link', false, 'No manifest link found in HTML');
      return;
    }
    
    // Get manifest URL
    const manifestHref = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return link ? link.href : null;
    });
    
    // Fetch and validate manifest
    const manifest = await page.evaluate(async (manifestUrl) => {
      try {
        const response = await fetch(manifestUrl);
        return await response.json();
      } catch (error) {
        return null;
      }
    }, manifestHref);
    
    if (!manifest) {
      recordTest('PWA Manifest Fetch', false, 'Could not fetch manifest.json');
      return;
    }
    
    // Validate manifest properties
    const requiredProperties = ['name', 'short_name', 'start_url', 'display', 'icons'];
    const missingProperties = requiredProperties.filter(prop => !manifest[prop]);
    
    if (missingProperties.length === 0) {
      recordTest('PWA Manifest Validation', true, `Manifest is valid with all required properties`);
      testResults.pwaMetrics.manifest = manifest;
    } else {
      recordTest('PWA Manifest Validation', false, `Missing properties: ${missingProperties.join(', ')}`);
    }
    
    // Check icon sizes
    const iconSizes = manifest.icons?.map(icon => icon.sizes) || [];
    const hasRequiredIcons = iconSizes.includes('192x192') && iconSizes.includes('512x512');
    
    recordTest('PWA Icons', hasRequiredIcons, 
      hasRequiredIcons ? 'Required icon sizes present' : 'Missing required icon sizes (192x192, 512x512)');
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-manifest-validation.png'),
      fullPage: true 
    });
    
  } catch (error) {
    recordTest('PWA Manifest Test', false, error.message);
  }
}

/**
 * Test service worker registration and functionality
 */
async function testServiceWorkerRegistration(page) {
  console.log('🔧 Testing Service Worker Registration...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Wait for page to load and service worker to register
    await page.waitForTimeout(2000);
    
    // Check service worker registration
    const serviceWorkerInfo = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) {
        return { supported: false, registered: false };
      }
      
      try {
        const registration = await navigator.serviceWorker.ready;
        return {
          supported: true,
          registered: !!registration,
          scope: registration.scope,
          state: registration.active?.state,
          scriptURL: registration.active?.scriptURL
        };
      } catch (error) {
        return { 
          supported: true, 
          registered: false, 
          error: error.message 
        };
      }
    });
    
    if (!serviceWorkerInfo.supported) {
      recordTest('Service Worker Support', false, 'Service Workers not supported in this browser');
      return;
    }
    
    recordTest('Service Worker Registration', serviceWorkerInfo.registered, 
      serviceWorkerInfo.registered ? 
        `Service Worker registered: ${serviceWorkerInfo.scriptURL}` : 
        `Registration failed: ${serviceWorkerInfo.error || 'Unknown error'}`);
    
    testResults.pwaMetrics.serviceWorker = serviceWorkerInfo;
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'service-worker-registration.png'),
      fullPage: true 
    });
    
  } catch (error) {
    recordTest('Service Worker Test', false, error.message);
  }
}

/**
 * Test offline functionality
 */
async function testOfflineFunctionality(page) {
  console.log('📴 Testing Offline Functionality...');
  
  try {
    // First load the page normally
    await page.goto(TEST_CONFIG.baseUrl);
    await page.waitForTimeout(3000); // Wait for service worker to cache resources
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-online-state.png'),
      fullPage: true 
    });
    
    // Test going offline
    await page.setOfflineMode(true);
    
    // Try to navigate to a cached page
    await page.goto(TEST_CONFIG.baseUrl);
    await page.waitForTimeout(2000);
    
    // Check if page loads offline
    const pageContent = await page.content();
    const hasContent = pageContent.includes('Tishya Foods') && pageContent.length > 1000;
    
    recordTest('Offline Page Loading', hasContent, 
      hasContent ? 'Page loads successfully offline' : 'Page fails to load offline');
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-offline-state.png'),
      fullPage: true 
    });
    
    // Test cached resources
    const cachedResourcesInfo = await page.evaluate(async () => {
      try {
        const cacheNames = await caches.keys();
        let totalCachedItems = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          totalCachedItems += keys.length;
        }
        
        return {
          cacheNames,
          totalCachedItems,
          available: true
        };
      } catch (error) {
        return { available: false, error: error.message };
      }
    });
    
    recordTest('Cache Storage', cachedResourcesInfo.available, 
      cachedResourcesInfo.available ? 
        `${cachedResourcesInfo.totalCachedItems} items cached across ${cachedResourcesInfo.cacheNames.length} caches` :
        `Cache access failed: ${cachedResourcesInfo.error}`);
    
    testResults.pwaMetrics.offlineCapabilities = cachedResourcesInfo;
    
    // Restore online mode
    await page.setOfflineMode(false);
    
  } catch (error) {
    recordTest('Offline Functionality Test', false, error.message);
    // Ensure we're back online
    await page.setOfflineMode(false);
  }
}

/**
 * Test PWA installation prompt and flow
 */
async function testInstallationPrompt(page) {
  console.log('💾 Testing PWA Installation...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Check for install prompt availability
    const installationInfo = await page.evaluate(async () => {
      // Check if beforeinstallprompt event can be captured
      let promptAvailable = false;
      
      const checkInstallability = () => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(false), 3000);
          
          window.addEventListener('beforeinstallprompt', (e) => {
            clearTimeout(timeout);
            resolve(true);
          }, { once: true });
        });
      };
      
      // Check PWA installation criteria
      const criteria = {
        isSecureContext: window.isSecureContext,
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        canInstall: false
      };
      
      // Wait for beforeinstallprompt
      criteria.canInstall = await checkInstallability();
      
      return criteria;
    });
    
    const isInstallable = installationInfo.isSecureContext && 
                         installationInfo.hasManifest && 
                         installationInfo.hasServiceWorker;
    
    recordTest('PWA Installation Criteria', isInstallable, 
      isInstallable ? 'PWA meets installation criteria' : 'PWA does not meet installation criteria');
    
    recordTest('PWA Install Prompt', installationInfo.canInstall,
      installationInfo.canInstall ? 'Install prompt available' : 'Install prompt not triggered');
    
    testResults.pwaMetrics.installation = installationInfo;
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-installation-check.png'),
      fullPage: true 
    });
    
  } catch (error) {
    recordTest('PWA Installation Test', false, error.message);
  }
}

/**
 * Test app-like experience features
 */
async function testAppLikeExperience(page) {
  console.log('📱 Testing App-Like Experience...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Test viewport meta tag for mobile optimization
    const viewportMeta = await page.$('meta[name="viewport"]');
    const hasViewportMeta = !!viewportMeta;
    
    recordTest('Mobile Viewport Meta', hasViewportMeta, 
      hasViewportMeta ? 'Viewport meta tag present' : 'Missing viewport meta tag');
    
    // Test theme color
    const themeColor = await page.$eval('meta[name="theme-color"]', el => el.content).catch(() => null);
    recordTest('Theme Color', !!themeColor, 
      themeColor ? `Theme color set: ${themeColor}` : 'No theme color specified');
    
    // Test display mode
    const displayMode = await page.evaluate(() => {
      return window.matchMedia('(display-mode: standalone)').matches ? 'standalone' :
             window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
             window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' :
             'browser';
    });
    
    recordTest('Display Mode', true, `Current display mode: ${displayMode}`);
    
    // Test safe area insets for notched devices
    const safeAreaSupport = await page.evaluate(() => {
      const testElement = document.createElement('div');
      testElement.style.paddingTop = 'env(safe-area-inset-top)';
      document.body.appendChild(testElement);
      const computedStyle = getComputedStyle(testElement);
      const hasSafeAreaSupport = computedStyle.paddingTop !== '0px';
      document.body.removeChild(testElement);
      return hasSafeAreaSupport;
    });
    
    recordTest('Safe Area Support', safeAreaSupport, 
      safeAreaSupport ? 'Safe area insets supported' : 'Safe area insets not detected');
    
    // Test touch interactions
    await page.setViewport({ width: 375, height: 667 }); // iPhone size
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-mobile-experience.png'),
      fullPage: true 
    });
    
    // Test landscape orientation
    await page.setViewport({ width: 667, height: 375 });
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-landscape-experience.png'),
      fullPage: true 
    });
    
    // Test tablet size
    await page.setViewport({ width: 768, height: 1024 });
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-tablet-experience.png'),
      fullPage: true 
    });
    
    // Reset to desktop
    await page.setViewport(TEST_CONFIG.viewport);
    
  } catch (error) {
    recordTest('App-Like Experience Test', false, error.message);
  }
}

/**
 * Test push notification support
 */
async function testPushNotificationSupport(page) {
  console.log('🔔 Testing Push Notification Support...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    const notificationSupport = await page.evaluate(async () => {
      const support = {
        notificationAPI: 'Notification' in window,
        permission: Notification.permission,
        serviceWorkerSupport: 'serviceWorker' in navigator,
        pushManagerSupport: 'PushManager' in window
      };
      
      // Test notification permission request (don't actually request)
      support.canRequestPermission = typeof Notification.requestPermission === 'function';
      
      return support;
    });
    
    recordTest('Notification API Support', notificationSupport.notificationAPI, 
      notificationSupport.notificationAPI ? 'Notification API supported' : 'Notification API not supported');
    
    recordTest('Push Manager Support', notificationSupport.pushManagerSupport, 
      notificationSupport.pushManagerSupport ? 'Push Manager supported' : 'Push Manager not supported');
    
    recordTest('Notification Permission', true, `Current permission: ${notificationSupport.permission}`);
    
    testResults.pwaMetrics.notifications = notificationSupport;
    
  } catch (error) {
    recordTest('Push Notification Test', false, error.message);
  }
}

/**
 * Test PWA performance metrics
 */
async function testPWAMetrics(page) {
  console.log('📊 Testing PWA Performance Metrics...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Measure PWA-specific performance metrics
    const pwaPerformance = await page.evaluate(async () => {
      const metrics = {};
      
      // Service Worker activation time
      if ('serviceWorker' in navigator) {
        const start = performance.now();
        try {
          await navigator.serviceWorker.ready;
          metrics.serviceWorkerActivationTime = performance.now() - start;
        } catch (error) {
          metrics.serviceWorkerActivationTime = null;
        }
      }
      
      // Cache performance
      if ('caches' in window) {
        const cacheStart = performance.now();
        try {
          const cacheNames = await caches.keys();
          metrics.cacheAccessTime = performance.now() - cacheStart;
          metrics.cacheCount = cacheNames.length;
        } catch (error) {
          metrics.cacheAccessTime = null;
        }
      }
      
      // App shell load time (first meaningful paint)
      const navigation = performance.getEntriesByType('navigation')[0];
      metrics.appShellLoadTime = navigation ? navigation.loadEventEnd - navigation.navigationStart : null;
      
      return metrics;
    });
    
    recordTest('PWA Performance Metrics', true, 
      `App shell load: ${pwaPerformance.appShellLoadTime}ms, SW activation: ${pwaPerformance.serviceWorkerActivationTime}ms`);
    
    testResults.pwaMetrics.performance = pwaPerformance;
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-performance-metrics.png'),
      fullPage: true 
    });
    
  } catch (error) {
    recordTest('PWA Performance Test', false, error.message);
  }
}

/**
 * Test performance in app mode (simulated)
 */
async function testPerformanceInAppMode(page) {
  console.log('🚀 Testing App Mode Performance...');
  
  try {
    // Simulate standalone app mode
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(display-mode: standalone)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });
    
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Measure performance in simulated app mode
    const appModeMetrics = await page.metrics();
    
    recordTest('App Mode Performance', true, 
      `JS heap: ${Math.round(appModeMetrics.JSHeapUsedSize / 1024 / 1024)}MB, Nodes: ${appModeMetrics.Nodes}`);
    
    testResults.pwaMetrics.appModePerformance = appModeMetrics;
    
    await page.screenshot({ 
      path: path.join(TEST_CONFIG.screenshotDir, 'pwa-app-mode-simulation.png'),
      fullPage: true 
    });
    
  } catch (error) {
    recordTest('App Mode Performance Test', false, error.message);
  }
}

/**
 * Test cache strategies effectiveness
 */
async function testCacheStrategies(page) {
  console.log('🗂️ Testing Cache Strategies...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    await page.waitForTimeout(3000); // Allow caching
    
    // Test cache strategies by checking cached resources
    const cacheAnalysis = await page.evaluate(async () => {
      const analysis = {
        caches: {},
        strategies: {
          static: { cached: 0, urls: [] },
          dynamic: { cached: 0, urls: [] },
          images: { cached: 0, urls: [] }
        }
      };
      
      try {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          analysis.caches[cacheName] = {
            itemCount: requests.length,
            urls: requests.map(req => req.url).slice(0, 5) // First 5 URLs
          };
          
          // Categorize by cache strategy
          if (cacheName.includes('static')) {
            analysis.strategies.static.cached += requests.length;
            analysis.strategies.static.urls.push(...requests.map(req => req.url).slice(0, 3));
          } else if (cacheName.includes('dynamic')) {
            analysis.strategies.dynamic.cached += requests.length;
            analysis.strategies.dynamic.urls.push(...requests.map(req => req.url).slice(0, 3));
          } else if (cacheName.includes('image')) {
            analysis.strategies.images.cached += requests.length;
            analysis.strategies.images.urls.push(...requests.map(req => req.url).slice(0, 3));
          }
        }
      } catch (error) {
        analysis.error = error.message;
      }
      
      return analysis;
    });
    
    const totalCachedItems = Object.values(cacheAnalysis.caches)
      .reduce((sum, cache) => sum + cache.itemCount, 0);
    
    recordTest('Cache Strategy Implementation', totalCachedItems > 0, 
      `${totalCachedItems} items cached across ${Object.keys(cacheAnalysis.caches).length} cache stores`);
    
    recordTest('Static Asset Caching', cacheAnalysis.strategies.static.cached > 0,
      `${cacheAnalysis.strategies.static.cached} static assets cached`);
    
    testResults.pwaMetrics.cacheStrategies = cacheAnalysis;
    
  } catch (error) {
    recordTest('Cache Strategies Test', false, error.message);
  }
}

/**
 * Test background sync capabilities
 */
async function testBackgroundSync(page) {
  console.log('🔄 Testing Background Sync...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    const backgroundSyncSupport = await page.evaluate(async () => {
      const support = {
        serviceWorkerSupport: 'serviceWorker' in navigator,
        syncSupport: false,
        periodicSyncSupport: false
      };
      
      if (support.serviceWorkerSupport) {
        try {
          const registration = await navigator.serviceWorker.ready;
          support.syncSupport = 'sync' in registration;
          support.periodicSyncSupport = 'periodicSync' in registration;
        } catch (error) {
          support.error = error.message;
        }
      }
      
      return support;
    });
    
    recordTest('Background Sync Support', backgroundSyncSupport.syncSupport,
      backgroundSyncSupport.syncSupport ? 'Background Sync supported' : 'Background Sync not supported');
    
    recordTest('Periodic Background Sync', backgroundSyncSupport.periodicSyncSupport,
      backgroundSyncSupport.periodicSyncSupport ? 'Periodic Background Sync supported' : 'Periodic Background Sync not supported');
    
    testResults.pwaMetrics.backgroundSync = backgroundSyncSupport;
    
  } catch (error) {
    recordTest('Background Sync Test', false, error.message);
  }
}

/**
 * Record test result
 */
function recordTest(testName, passed, message) {
  const result = {
    name: testName,
    passed,
    message,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  testResults.summary.total++;
  
  if (passed) {
    testResults.summary.passed++;
    console.log(`✅ ${testName}: ${message}`);
  } else {
    testResults.summary.failed++;
    console.log(`❌ ${testName}: ${message}`);
  }
}

/**
 * Generate test recommendations
 */
function generateRecommendations() {
  const recommendations = [];
  
  // Analyze test results and generate recommendations
  const failedTests = testResults.tests.filter(test => !test.passed);
  
  if (failedTests.some(test => test.name.includes('Manifest'))) {
    recommendations.push({
      category: 'PWA Manifest',
      priority: 'High',
      issue: 'PWA manifest issues detected',
      solution: 'Ensure manifest.json includes all required properties: name, short_name, start_url, display, icons'
    });
  }
  
  if (failedTests.some(test => test.name.includes('Service Worker'))) {
    recommendations.push({
      category: 'Service Worker',
      priority: 'High', 
      issue: 'Service Worker registration issues',
      solution: 'Verify service worker script exists and registers correctly'
    });
  }
  
  if (failedTests.some(test => test.name.includes('Offline'))) {
    recommendations.push({
      category: 'Offline Functionality',
      priority: 'Medium',
      issue: 'Offline functionality not working properly',
      solution: 'Implement proper caching strategies and offline fallbacks'
    });
  }
  
  if (failedTests.some(test => test.name.includes('Installation'))) {
    recommendations.push({
      category: 'PWA Installation',
      priority: 'Medium',
      issue: 'PWA installation criteria not met',
      solution: 'Ensure HTTPS, valid manifest, and service worker registration'
    });
  }
  
  // Performance recommendations
  if (testResults.pwaMetrics.performance?.appShellLoadTime > 3000) {
    recommendations.push({
      category: 'Performance',
      priority: 'Medium',
      issue: 'Slow app shell loading',
      solution: 'Optimize critical resources and implement preloading strategies'
    });
  }
  
  // Add general recommendations
  recommendations.push(
    {
      category: 'Icon Optimization',
      priority: 'Low',
      issue: 'PWA icon recommendations',
      solution: 'Ensure icons are optimized for all device sizes and include maskable icons'
    },
    {
      category: 'Caching Strategy',
      priority: 'Medium',
      issue: 'Cache optimization',
      solution: 'Implement appropriate caching strategies for different resource types'
    },
    {
      category: 'User Experience',
      priority: 'Medium',
      issue: 'App-like experience',
      solution: 'Add install prompt, theme colors, and proper viewport configuration'
    }
  );
  
  testResults.recommendations = recommendations;
}

/**
 * Generate test reports
 */
async function generateReports() {
  console.log('\n📊 Generating PWA test reports...');
  
  generateRecommendations();
  
  // Generate JSON report
  await fs.writeFile(
    TEST_CONFIG.reportFile,
    JSON.stringify(testResults, null, 2)
  );
  
  // Generate Markdown report
  const markdownReport = generateMarkdownReport();
  await fs.writeFile(TEST_CONFIG.markdownFile, markdownReport);
  
  console.log(`\n✅ PWA test reports generated:`);
  console.log(`📄 JSON Report: ${TEST_CONFIG.reportFile}`);
  console.log(`📝 Markdown Report: ${TEST_CONFIG.markdownFile}`);
  console.log(`🖼️  Screenshots: ${TEST_CONFIG.screenshotDir}/`);
  
  // Print summary
  console.log(`\n📈 Test Summary:`);
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`📊 Success Rate: ${Math.round((testResults.summary.passed / testResults.summary.total) * 100)}%`);
}

/**
 * Generate markdown report
 */
function generateMarkdownReport() {
  return `# Progressive Web App (PWA) Testing Report

**Generated:** ${testResults.timestamp}  
**URL:** ${testResults.url}

## Executive Summary

- **Total Tests:** ${testResults.summary.total}
- **Passed:** ${testResults.summary.passed}
- **Failed:** ${testResults.summary.failed}
- **Success Rate:** ${Math.round((testResults.summary.passed / testResults.summary.total) * 100)}%

## Test Results

${testResults.tests.map(test => 
  `### ${test.passed ? '✅' : '❌'} ${test.name}\n**Result:** ${test.message}\n`
).join('\n')}

## PWA Metrics

### Manifest Configuration
${testResults.pwaMetrics.manifest ? 
  `- **Name:** ${testResults.pwaMetrics.manifest.name}
- **Short Name:** ${testResults.pwaMetrics.manifest.short_name}
- **Display Mode:** ${testResults.pwaMetrics.manifest.display}
- **Theme Color:** ${testResults.pwaMetrics.manifest.theme_color}
- **Start URL:** ${testResults.pwaMetrics.manifest.start_url}` : 
  'Manifest data not available'}

### Service Worker
${testResults.pwaMetrics.serviceWorker ? 
  `- **Supported:** ${testResults.pwaMetrics.serviceWorker.supported ? 'Yes' : 'No'}
- **Registered:** ${testResults.pwaMetrics.serviceWorker.registered ? 'Yes' : 'No'}
- **State:** ${testResults.pwaMetrics.serviceWorker.state || 'Unknown'}
- **Scope:** ${testResults.pwaMetrics.serviceWorker.scope || 'N/A'}` : 
  'Service Worker data not available'}

### Installation Capabilities
${testResults.pwaMetrics.installation ? 
  `- **Secure Context:** ${testResults.pwaMetrics.installation.isSecureContext ? 'Yes' : 'No'}
- **Has Manifest:** ${testResults.pwaMetrics.installation.hasManifest ? 'Yes' : 'No'}
- **Has Service Worker:** ${testResults.pwaMetrics.installation.hasServiceWorker ? 'Yes' : 'No'}
- **Can Install:** ${testResults.pwaMetrics.installation.canInstall ? 'Yes' : 'No'}` : 
  'Installation data not available'}

### Cache Performance
${testResults.pwaMetrics.cacheStrategies ? 
  `- **Static Assets Cached:** ${testResults.pwaMetrics.cacheStrategies.strategies.static.cached}
- **Dynamic Content Cached:** ${testResults.pwaMetrics.cacheStrategies.strategies.dynamic.cached}
- **Images Cached:** ${testResults.pwaMetrics.cacheStrategies.strategies.images.cached}
- **Total Cache Stores:** ${Object.keys(testResults.pwaMetrics.cacheStrategies.caches).length}` : 
  'Cache data not available'}

## Recommendations

${testResults.recommendations.map(rec => 
  `### ${rec.category} (${rec.priority} Priority)
**Issue:** ${rec.issue}  
**Solution:** ${rec.solution}\n`
).join('\n')}

## Screenshots

- **PWA Manifest Validation:** pwa-manifest-validation.png
- **Service Worker Registration:** service-worker-registration.png
- **Online State:** pwa-online-state.png
- **Offline State:** pwa-offline-state.png
- **Mobile Experience:** pwa-mobile-experience.png
- **Tablet Experience:** pwa-tablet-experience.png
- **Performance Metrics:** pwa-performance-metrics.png

---
*Report generated by Tishya Foods PWA Testing Suite*
`;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runPWATests().catch(console.error);
}

module.exports = { runPWATests };