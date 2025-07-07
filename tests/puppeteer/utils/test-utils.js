const fs = require('fs').promises;
const path = require('path');
const config = require('../config/test-config');

class TestUtils {
  constructor() {
    this.screenshotCounter = 0;
    this.videoCounter = 0;
  }

  // Browser management
  async launchBrowser(puppeteer, options = {}) {
    const browserOptions = {
      headless: config.headless,
      args: config.browser.args,
      defaultViewport: config.browser.defaultViewport,
      slowMo: config.browser.slowMo,
      ...options
    };

    console.log(`Launching browser with options:`, browserOptions);
    return await puppeteer.launch(browserOptions);
  }

  async createPage(browser, viewport = 'desktop') {
    const page = await browser.newPage();
    
    // Set viewport
    if (config.viewports[viewport]) {
      await page.setViewport(config.viewports[viewport]);
    }

    // Set user agent
    if (config.userAgents[viewport === 'mobile' ? 'mobile' : 'desktop']) {
      await page.setUserAgent(config.userAgents[viewport === 'mobile' ? 'mobile' : 'desktop']);
    }

    // Enable request interception for performance monitoring
    await page.setRequestInterception(true);
    
    const resourceStats = {
      requests: 0,
      responses: 0,
      failures: 0,
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0
    };

    page.on('request', request => {
      resourceStats.requests++;
      request.continue();
    });

    page.on('response', response => {
      resourceStats.responses++;
      const contentLength = response.headers()['content-length'];
      const size = contentLength ? parseInt(contentLength) : 0;
      resourceStats.totalSize += size;

      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('javascript')) {
        resourceStats.jsSize += size;
      } else if (contentType.includes('css')) {
        resourceStats.cssSize += size;
      } else if (contentType.includes('image')) {
        resourceStats.imageSize += size;
      }
    });

    page.on('requestfailed', () => {
      resourceStats.failures++;
    });

    page.resourceStats = resourceStats;

    // Set timeouts
    page.setDefaultTimeout(config.timeout);
    page.setDefaultNavigationTimeout(config.timeout);

    return page;
  }

  // Navigation helpers
  async navigateToPage(page, path = '', options = {}) {
    const url = `${config.baseUrl}${path}`;
    console.log(`Navigating to: ${url}`);
    
    const navigationOptions = {
      waitUntil: 'networkidle2',
      timeout: config.timeout,
      ...options
    };

    const startTime = Date.now();
    const response = await page.goto(url, navigationOptions);
    const loadTime = Date.now() - startTime;

    console.log(`Page loaded in ${loadTime}ms`);
    
    if (!response.ok()) {
      throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`);
    }

    return { response, loadTime };
  }

  // Wait helpers
  async waitForElement(page, selector, options = {}) {
    const defaultOptions = {
      visible: true,
      timeout: config.timeout,
      ...options
    };

    console.log(`Waiting for element: ${selector}`);
    return await page.waitForSelector(selector, defaultOptions);
  }

  async waitForText(page, text, options = {}) {
    const defaultOptions = {
      timeout: config.timeout,
      ...options
    };

    console.log(`Waiting for text: ${text}`);
    return await page.waitForFunction(
      (text) => document.body.innerText.includes(text),
      defaultOptions,
      text
    );
  }

  async waitForNetworkIdle(page, timeout = config.performance.networkIdle) {
    console.log('Waiting for network idle...');
    return await page.waitForLoadState?.('networkidle', { timeout }) || 
           await page.waitForTimeout(timeout);
  }

  // Interaction helpers
  async clickElement(page, selector, options = {}) {
    console.log(`Clicking element: ${selector}`);
    await this.waitForElement(page, selector);
    
    const element = await page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    // Scroll element into view
    await element.scrollIntoView();
    
    // Wait for element to be clickable
    await page.waitForFunction(
      (selector) => {
        const el = document.querySelector(selector);
        return el && !el.disabled && getComputedStyle(el).pointerEvents !== 'none';
      },
      {},
      selector
    );

    await element.click(options);
    
    // Wait for any navigation or state changes
    await page.waitForTimeout(500);
  }

  async fillForm(page, formData) {
    console.log('Filling form with data:', Object.keys(formData));
    
    for (const [selector, value] of Object.entries(formData)) {
      await this.waitForElement(page, selector);
      await page.focus(selector);
      await page.evaluate(selector => {
        document.querySelector(selector).value = '';
      }, selector);
      await page.type(selector, value, { delay: 50 });
    }
  }

  // Screenshot and recording
  async takeScreenshot(page, name, options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${name}-${++this.screenshotCounter}.png`;
    const filepath = path.join(config.dirs.screenshots, filename);

    await this.ensureDirectoryExists(config.dirs.screenshots);
    
    const screenshotOptions = {
      path: filepath,
      fullPage: true,
      ...options
    };

    console.log(`Taking screenshot: ${filename}`);
    await page.screenshot(screenshotOptions);
    
    return filepath;
  }

  async startVideoRecording(page, name) {
    if (!config.reporting.saveVideos) return null;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${name}-${++this.videoCounter}.webm`;
    const filepath = path.join(config.dirs.videos, filename);

    await this.ensureDirectoryExists(config.dirs.videos);

    console.log(`Starting video recording: ${filename}`);
    
    // Note: Puppeteer doesn't have native video recording
    // This is a placeholder for external recording tools
    return {
      filepath,
      stop: async () => {
        console.log(`Stopped video recording: ${filename}`);
        return filepath;
      }
    };
  }

  // Performance measurement
  async measurePerformance(page) {
    console.log('Measuring page performance...');
    
    const metrics = await page.metrics();
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        // Classic timing API
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        
        // Navigation timing API
        ttfb: navigation?.responseStart || 0,
        domInteractive: navigation?.domInteractive || 0,
        domComplete: navigation?.domComplete || 0,
        
        // Memory usage
        usedHeapSize: performance.memory?.usedJSHeapSize || 0,
        totalHeapSize: performance.memory?.totalJSHeapSize || 0,
        heapSizeLimit: performance.memory?.jsHeapSizeLimit || 0
      };
    });

    // Core Web Vitals
    const coreWebVitals = await this.measureCoreWebVitals(page);

    return {
      ...performanceTiming,
      ...coreWebVitals,
      metrics,
      resourceStats: page.resourceStats || {}
    };
  }

  async measureCoreWebVitals(page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};

          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.cls = (vitals.cls || 0) + entry.value;
            }
          });

          if (Object.keys(vitals).length > 0) {
            resolve(vitals);
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
  }

  // Accessibility testing
  async checkAccessibility(page, options = {}) {
    console.log('Running accessibility checks...');
    
    // Inject axe-core
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.8.2/axe.min.js'
    });

    const results = await page.evaluate((options) => {
      return axe.run(document, {
        tags: options.tags || ['wcag2a', 'wcag2aa'],
        exclude: options.exclude || []
      });
    }, options);

    return {
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
      score: this.calculateAccessibilityScore(results)
    };
  }

  calculateAccessibilityScore(results) {
    const total = results.violations.length + results.passes.length;
    if (total === 0) return 100;
    return Math.round((results.passes.length / total) * 100);
  }

  // Utility methods
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async saveTestResults(testName, results) {
    const timestamp = new Date().toISOString();
    const filename = `${testName}-${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(config.dirs.reports, filename);

    await this.ensureDirectoryExists(config.dirs.reports);
    
    const testResults = {
      testName,
      timestamp,
      results,
      environment: {
        baseUrl: config.baseUrl,
        userAgent: 'Puppeteer Test Runner',
        viewport: config.browser.defaultViewport
      }
    };

    await fs.writeFile(filepath, JSON.stringify(testResults, null, 2));
    console.log(`Test results saved: ${filepath}`);
    
    return filepath;
  }

  // Retry mechanism
  async retry(fn, attempts = config.retry.attempts, delay = config.retry.delay) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        console.log(`Attempt ${i + 1} failed:`, error.message);
        
        if (i === attempts - 1) {
          throw error;
        }
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }

  // Mobile testing helpers
  async simulateMobileDevice(page, deviceName = 'mobile') {
    const viewport = config.viewports[deviceName];
    const userAgent = config.userAgents[deviceName] || config.userAgents.mobile;

    await page.setViewport(viewport);
    await page.setUserAgent(userAgent);

    // Simulate touch events
    await page.evaluate(() => {
      // Override mouse events to simulate touch
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click') {
          originalAddEventListener.call(this, 'touchstart', listener, options);
          originalAddEventListener.call(this, 'touchend', listener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    });
  }

  // Form validation helpers
  async validateFormField(page, selector, validationMessage) {
    const isValid = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element && element.checkValidity();
    }, selector);

    if (!isValid && validationMessage) {
      const actualMessage = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element ? element.validationMessage : '';
      }, selector);

      if (actualMessage !== validationMessage) {
        throw new Error(`Expected validation message "${validationMessage}", got "${actualMessage}"`);
      }
    }

    return isValid;
  }

  // Error handling
  createErrorHandler(testName) {
    return async (error, page) => {
      console.error(`Error in test ${testName}:`, error);
      
      if (page && !page.isClosed()) {
        await this.takeScreenshot(page, `error-${testName}`);
        
        // Log console messages
        const logs = await page.evaluate(() => {
          return window.console.logs || [];
        });
        
        if (logs.length > 0) {
          console.log('Console logs:', logs);
        }
      }
      
      throw error;
    };
  }
}

module.exports = new TestUtils();