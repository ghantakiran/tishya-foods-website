const path = require('path');

const config = {
  // Base configuration
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headless: process.env.CI === 'true' || process.env.HEADLESS === 'true',
  
  // Browser configuration
  browser: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--window-size=1920,1080'
    ],
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    slowMo: process.env.CI ? 0 : 100
  },

  // Test directories
  dirs: {
    screenshots: path.join(__dirname, '../../../screenshots/e2e'),
    videos: path.join(__dirname, '../../../videos/e2e'),
    reports: path.join(__dirname, '../../../test-results'),
    fixtures: path.join(__dirname, '../fixtures')
  },

  // User agents for different devices
  userAgents: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    tablet: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },

  // Viewport configurations
  viewports: {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1366, height: 768 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
    mobileL: { width: 425, height: 896 }
  },

  // Test data
  testData: {
    users: {
      validUser: {
        email: 'test@tishyafoods.com',
        password: 'TestPassword123!',
        name: 'Test User'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }
    },
    products: {
      sampleProduct: 'protein-powder-vanilla',
      categories: ['protein', 'sweet', 'savory']
    },
    forms: {
      contact: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        subject: 'product-inquiry',
        message: 'I would like to know more about your protein products.'
      }
    }
  },

  // Performance thresholds
  performance: {
    // Core Web Vitals thresholds
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100,  // First Input Delay (ms)
    cls: 0.1,  // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    ttfb: 600, // Time to First Byte (ms)
    
    // Page load thresholds
    pageLoad: 5000,
    domContentLoaded: 3000,
    
    // Network thresholds
    networkIdle: 2000,
    
    // Resource size limits (bytes)
    maxJsSize: 1024 * 1024, // 1MB
    maxCssSize: 512 * 1024, // 512KB
    maxImageSize: 2 * 1024 * 1024 // 2MB
  },

  // Accessibility configuration
  accessibility: {
    standards: ['WCAG2A', 'WCAG2AA'],
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    exclude: [
      // Exclude third-party elements that we can't control
      '.gtm-', // Google Tag Manager
      '#google_translate_element'
    ]
  },

  // Test sharding configuration
  sharding: {
    1: [
      'homepage',
      'navigation',
      'product-catalog'
    ],
    2: [
      'product-details',
      'cart-functionality',
      'checkout-flow'
    ],
    3: [
      'user-authentication',
      'user-profile',
      'contact-forms'
    ],
    4: [
      'performance',
      'accessibility',
      'mobile-responsiveness'
    ]
  },

  // Retry configuration
  retry: {
    attempts: process.env.CI ? 3 : 1,
    delay: 1000
  },

  // Parallel execution
  parallel: process.env.CI ? 4 : 2,

  // Reporting configuration
  reporting: {
    formats: ['json', 'html', 'junit'],
    saveScreenshots: true,
    saveVideos: process.env.CI === 'true',
    saveTraces: false
  }
};

module.exports = config;