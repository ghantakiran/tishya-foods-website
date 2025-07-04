/**
 * Mobile Navigation & Responsiveness Testing - Issue #4
 * Comprehensive mobile experience testing across multiple device sizes and orientations
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class MobileNavigationTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: [],
      deviceTests: []
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/mobile-navigation');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
    
    // Define test viewports
    this.viewports = [
      { width: 375, height: 667, name: 'iPhone SE', category: 'mobile' },
      { width:414, height: 896, name: 'iPhone 11 Pro Max', category: 'mobile' },
      { width: 768, height: 1024, name: 'iPad', category: 'tablet' },
      { width: 1024, height: 768, name: 'iPad Landscape', category: 'tablet' },
      { width: 360, height: 640, name: 'Android Small', category: 'mobile' },
      { width: 320, height: 568, name: 'iPhone 5s', category: 'mobile' }
    ];
  }

  async initialize() {
    console.log('📱 Initializing Mobile Navigation Testing...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    });
    
    // Track performance metrics
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      request.continue();
    });
    
    // Enable touch events
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: false,
        value: 1,
      });
    });
  }

  async runMobileNavigationTests() {
    console.log('🔍 Starting Mobile Navigation Testing...');
    
    try {
      // Test each viewport
      for (const viewport of this.viewports) {
        await this.testViewport(viewport);
      }
      
      // Test specific mobile interactions
      await this.testMobileInteractions();
      
      // Test touch targets
      await this.testTouchTargets();
      
      // Test mobile forms
      await this.testMobileFormExperience();
      
      // Test mobile performance
      await this.testMobilePerformance();
      
      // Analyze mobile navigation patterns
      await this.analyzeMobileNavigation();
      
      console.log('✅ Mobile Navigation Testing completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during mobile navigation testing:', error);
      this.results.issues.push({
        type: 'critical',
        category: 'testing',
        message: `Mobile navigation testing failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testViewport(viewport) {
    console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
    
    const testStart = Date.now();
    
    try {
      // Set viewport
      await this.page.setViewport({ 
        width: viewport.width, 
        height: viewport.height,
        isMobile: viewport.category === 'mobile',
        hasTouch: viewport.category === 'mobile'
      });
      
      // Navigate to homepage
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Wait for initial load
      await this.page.waitForSelector('body', { timeout: 5000 });
      
      // Take homepage screenshot
      await this.takeScreenshot(
        `homepage-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
        `Homepage on ${viewport.name}`
      );
      
      // Test navigation elements
      await this.testNavigationElements(viewport);
      
      // Test main content areas
      await this.testMainContentAreas(viewport);
      
      // Test interactive elements
      await this.testInteractiveElements(viewport);
      
      // Test scrolling behavior
      await this.testScrollingBehavior(viewport);
      
      const testEnd = Date.now();
      
      // Record device test results
      this.results.deviceTests.push({
        device: viewport.name,
        category: viewport.category,
        dimensions: `${viewport.width}x${viewport.height}`,
        duration: testEnd - testStart,
        success: true,
        issues: []
      });
      
    } catch (error) {
      console.warn(`⚠️ Issue testing ${viewport.name}:`, error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'viewport',
        device: viewport.name,
        message: `Viewport testing issue: ${error.message}`
      });
    }
  }

  async testNavigationElements(viewport) {
    console.log(`🧭 Testing navigation elements for ${viewport.name}...`);
    
    try {
      // Check for mobile menu toggle
      const mobileMenuToggle = await this.page.$('[data-testid*="mobile"], [data-testid*="menu"], button svg, .hamburger, .menu-toggle');
      
      if (mobileMenuToggle) {
        this.results.metrics.hasMobileMenuToggle = true;
        
        // Test mobile menu toggle
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.takeScreenshot(
          `mobile-menu-open-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
          `Mobile menu opened on ${viewport.name}`
        );
        
        // Check if menu is visible
        const menuVisible = await this.page.$('[data-testid*="mobile-menu"], .mobile-menu, nav ul, .navigation-menu');
        if (menuVisible) {
          this.results.metrics.mobileMenuWorks = true;
          
          // Test menu items
          const menuItems = await this.page.$$('[data-testid*="mobile-menu"] a, .mobile-menu a, nav a');
          this.results.metrics.mobileMenuItemsCount = menuItems.length;
          
          // Test menu item clicks
          if (menuItems.length > 0) {
            // Click first menu item (likely Products)
            await menuItems[0].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await this.takeScreenshot(
              `mobile-menu-navigation-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
              `Navigation from mobile menu on ${viewport.name}`
            );
            
            // Go back to homepage
            await this.page.goBack();
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        // Close mobile menu
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } else {
        // Check for desktop navigation visibility
        const desktopNav = await this.page.$('nav, .navigation, header nav');
        if (desktopNav) {
          const navVisible = await this.page.evaluate((nav) => {
            const rect = nav.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          }, desktopNav);
          
          if (navVisible && viewport.category === 'mobile') {
            this.results.issues.push({
              type: 'warning',
              category: 'navigation',
              device: viewport.name,
              message: 'Desktop navigation visible on mobile device'
            });
          }
        }
      }
      
    } catch (error) {
      console.warn(`⚠️ Navigation elements test warning for ${viewport.name}:`, error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'navigation',
        device: viewport.name,
        message: `Navigation elements issue: ${error.message}`
      });
    }
  }

  async testMainContentAreas(viewport) {
    console.log(`📄 Testing main content areas for ${viewport.name}...`);
    
    try {
      // Test hero section
      const heroSection = await this.page.$('[data-testid*="hero"], .hero, .hero-section');
      if (heroSection) {
        const heroRect = await heroSection.boundingBox();
        if (heroRect) {
          this.results.metrics[`hero_${viewport.name.replace(/\s+/g, '_')}`] = {
            width: heroRect.width,
            height: heroRect.height,
            visible: heroRect.width > 0 && heroRect.height > 0
          };
        }
      }
      
      // Test product showcase
      const productShowcase = await this.page.$('[data-testid*="product"], .product-showcase, .products-section');
      if (productShowcase) {
        await this.takeScreenshot(
          `product-showcase-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
          `Product showcase on ${viewport.name}`
        );
      }
      
      // Test footer
      const footer = await this.page.$('footer');
      if (footer) {
        // Scroll to footer
        await this.page.evaluate((footer) => {
          footer.scrollIntoView({ behavior: 'smooth' });
        }, footer);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.takeScreenshot(
          `footer-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
          `Footer on ${viewport.name}`
        );
      }
      
    } catch (error) {
      console.warn(`⚠️ Main content areas test warning for ${viewport.name}:`, error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'content',
        device: viewport.name,
        message: `Main content areas issue: ${error.message}`
      });
    }
  }

  async testInteractiveElements(viewport) {
    console.log(`🎯 Testing interactive elements for ${viewport.name}...`);
    
    try {
      // Test buttons
      const buttons = await this.page.$$('button, [role="button"], .button, .btn');
      let buttonTestResults = [];
      
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const button = buttons[i];
        const buttonRect = await button.boundingBox();
        
        if (buttonRect) {
          const buttonText = await this.page.evaluate(btn => btn.textContent || btn.getAttribute('aria-label'), button);
          
          buttonTestResults.push({
            text: buttonText,
            width: buttonRect.width,
            height: buttonRect.height,
            touchFriendly: buttonRect.width >= 44 && buttonRect.height >= 44
          });
        }
      }
      
      this.results.metrics[`buttons_${viewport.name.replace(/\s+/g, '_')}`] = buttonTestResults;
      
      // Test links
      const links = await this.page.$$('a');
      let linkTestResults = [];
      
      for (let i = 0; i < Math.min(links.length, 10); i++) {
        const link = links[i];
        const linkRect = await link.boundingBox();
        
        if (linkRect) {
          const linkText = await this.page.evaluate(l => l.textContent, link);
          
          linkTestResults.push({
            text: linkText,
            width: linkRect.width,
            height: linkRect.height,
            touchFriendly: linkRect.width >= 44 && linkRect.height >= 44
          });
        }
      }
      
      this.results.metrics[`links_${viewport.name.replace(/\s+/g, '_')}`] = linkTestResults;
      
    } catch (error) {
      console.warn(`⚠️ Interactive elements test warning for ${viewport.name}:`, error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'interactive',
        device: viewport.name,
        message: `Interactive elements issue: ${error.message}`
      });
    }
  }

  async testScrollingBehavior(viewport) {
    console.log(`📜 Testing scrolling behavior for ${viewport.name}...`);
    
    try {
      // Get page height
      const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = viewport.height;
      
      // Test scroll performance
      const scrollStart = Date.now();
      
      // Scroll to middle
      await this.page.evaluate((height) => {
        window.scrollTo(0, height / 2);
      }, pageHeight);
      
      await this.page.waitForTimeout(500);
      
      await this.takeScreenshot(
        `scroll-middle-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
        `Scrolled to middle on ${viewport.name}`
      );
      
      // Scroll to bottom
      await this.page.evaluate((height) => {
        window.scrollTo(0, height);
      }, pageHeight);
      
      await this.page.waitForTimeout(500);
      
      await this.takeScreenshot(
        `scroll-bottom-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`,
        `Scrolled to bottom on ${viewport.name}`
      );
      
      // Scroll back to top
      await this.page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      await this.page.waitForTimeout(500);
      
      const scrollEnd = Date.now();
      
      this.results.metrics[`scroll_${viewport.name.replace(/\s+/g, '_')}`] = {
        pageHeight,
        viewportHeight,
        scrollTime: scrollEnd - scrollStart,
        scrollable: pageHeight > viewportHeight
      };
      
    } catch (error) {
      console.warn(`⚠️ Scrolling behavior test warning for ${viewport.name}:`, error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'scrolling',
        device: viewport.name,
        message: `Scrolling behavior issue: ${error.message}`
      });
    }
  }

  async testMobileInteractions() {
    console.log('📱 Testing mobile-specific interactions...');
    
    try {
      // Test with iPhone SE (smallest mobile viewport)
      await this.page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test touch gestures
      await this.testTouchGestures();
      
      // Test mobile forms
      await this.testMobileFormInteractions();
      
      // Test mobile-specific UI elements
      await this.testMobileUIElements();
      
    } catch (error) {
      console.warn('⚠️ Mobile interactions test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'mobile_interactions',
        message: `Mobile interactions issue: ${error.message}`
      });
    }
  }

  async testTouchGestures() {
    console.log('👆 Testing touch gestures...');
    
    try {
      // Test tap gestures
      const tappableElements = await this.page.$$('button, a, [data-testid*="button"], [data-testid*="link"]');
      
      if (tappableElements.length > 0) {
        // Test first tappable element
        await tappableElements[0].tap();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.takeScreenshot('touch-gesture-tap', 'Touch gesture tap test');
      }
      
      // Test swipe gestures (simulate by scrolling)
      await this.page.evaluate(() => {
        window.scrollBy(0, 100);
      });
      
      await this.page.waitForTimeout(500);
      
      await this.takeScreenshot('touch-gesture-swipe', 'Touch gesture swipe test');
      
      this.results.metrics.touchGesturesWorking = true;
      
    } catch (error) {
      console.warn('⚠️ Touch gestures test warning:', error.message);
      this.results.metrics.touchGesturesWorking = false;
    }
  }

  async testMobileFormInteractions() {
    console.log('📝 Testing mobile form interactions...');
    
    try {
      // Navigate to contact page or find forms
      const forms = await this.page.$$('form, input, textarea');
      
      if (forms.length > 0) {
        // Test first form input
        const firstInput = await this.page.$('input[type="text"], input[type="email"], textarea');
        
        if (firstInput) {
          await firstInput.tap();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await this.takeScreenshot('mobile-form-focus', 'Mobile form input focus');
          
          // Test typing
          await firstInput.type('Test input');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await this.takeScreenshot('mobile-form-typing', 'Mobile form typing test');
          
          this.results.metrics.mobileFormsWorking = true;
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Mobile form interactions test warning:', error.message);
      this.results.metrics.mobileFormsWorking = false;
    }
  }

  async testMobileUIElements() {
    console.log('🎨 Testing mobile UI elements...');
    
    try {
      // Test mobile-specific elements
      const mobileElements = await this.page.$$('[data-testid*="mobile"], .mobile-only, .mobile-visible, .d-block.d-md-none');
      
      this.results.metrics.mobileSpecificElements = mobileElements.length;
      
      if (mobileElements.length > 0) {
        await this.takeScreenshot('mobile-ui-elements', 'Mobile-specific UI elements');
      }
      
      // Test hidden desktop elements
      const desktopElements = await this.page.$$('.desktop-only, .d-none.d-md-block');
      
      this.results.metrics.hiddenDesktopElements = desktopElements.length;
      
    } catch (error) {
      console.warn('⚠️ Mobile UI elements test warning:', error.message);
    }
  }

  async testTouchTargets() {
    console.log('🎯 Testing touch target sizes...');
    
    try {
      // Test with mobile viewport
      await this.page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Get all interactive elements
      const interactiveElements = await this.page.$$('button, a, [role="button"], input, select, textarea, [data-testid*="button"], [data-testid*="link"]');
      
      let touchTargetResults = [];
      let smallTouchTargets = [];
      
      for (const element of interactiveElements) {
        const rect = await element.boundingBox();
        
        if (rect) {
          const isTouchFriendly = rect.width >= 44 && rect.height >= 44;
          const elementText = await this.page.evaluate(el => el.textContent || el.getAttribute('aria-label') || el.tagName, element);
          
          const targetInfo = {
            text: elementText,
            width: rect.width,
            height: rect.height,
            touchFriendly: isTouchFriendly,
            area: rect.width * rect.height
          };
          
          touchTargetResults.push(targetInfo);
          
          if (!isTouchFriendly) {
            smallTouchTargets.push(targetInfo);
          }
        }
      }
      
      this.results.metrics.touchTargets = {
        total: touchTargetResults.length,
        touchFriendly: touchTargetResults.filter(t => t.touchFriendly).length,
        tooSmall: smallTouchTargets.length,
        compliance: touchTargetResults.length > 0 ? (touchTargetResults.filter(t => t.touchFriendly).length / touchTargetResults.length * 100).toFixed(1) : 0
      };
      
      // Report issues for small touch targets
      if (smallTouchTargets.length > 0) {
        this.results.issues.push({
          type: 'warning',
          category: 'touch_targets',
          message: `Found ${smallTouchTargets.length} touch targets smaller than 44x44px`,
          details: smallTouchTargets.slice(0, 5) // Show first 5 examples
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Touch targets test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'touch_targets',
        message: `Touch targets testing issue: ${error.message}`
      });
    }
  }

  async testMobileFormExperience() {
    console.log('📱 Testing mobile form experience...');
    
    try {
      // Navigate to contact page
      await this.page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
      
      await this.takeScreenshot('mobile-contact-form', 'Mobile contact form');
      
      // Test form fields
      const formFields = await this.page.$$('input, textarea, select');
      
      for (const field of formFields) {
        const fieldRect = await field.boundingBox();
        
        if (fieldRect) {
          // Test field focus
          await field.tap();
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Check if keyboard would appear (simulate)
          const fieldType = await this.page.evaluate(f => f.type, field);
          
          if (fieldType === 'email') {
            await this.takeScreenshot('mobile-email-field', 'Mobile email field focus');
          } else if (fieldType === 'tel') {
            await this.takeScreenshot('mobile-phone-field', 'Mobile phone field focus');
          }
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Mobile form experience test warning:', error.message);
      // Non-critical if contact page doesn't exist
    }
  }

  async testMobilePerformance() {
    console.log('⚡ Testing mobile performance...');
    
    try {
      // Test with mobile viewport
      await this.page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
      
      // Simulate slower network
      await this.page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: Math.round(1.5 * 1024 * 1024 / 8), // 1.5 Mbps
        uploadThroughput: Math.round(750 * 1024 / 8), // 750 Kbps
        latency: 40 // 40ms
      });
      
      const performanceStart = Date.now();
      
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      const performanceEnd = Date.now();
      
      // Get performance metrics
      const performanceMetrics = await this.page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstPaint: perfData.responseEnd - perfData.requestStart,
          totalLoadTime: perfData.loadEventEnd - perfData.fetchStart
        };
      });
      
      this.results.metrics.mobilePerformance = {
        ...performanceMetrics,
        totalTestTime: performanceEnd - performanceStart,
        networkCondition: '1.5 Mbps / 750 Kbps'
      };
      
      // Clear network throttling
      await this.page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: -1,
        uploadThroughput: -1,
        latency: 0
      });
      
    } catch (error) {
      console.warn('⚠️ Mobile performance test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'performance',
        message: `Mobile performance testing issue: ${error.message}`
      });
    }
  }

  async analyzeMobileNavigation() {
    console.log('📊 Analyzing mobile navigation patterns...');
    
    try {
      // Test navigation on different pages
      const pages = [
        'http://localhost:3000',
        'http://localhost:3000/products',
        'http://localhost:3000/about',
        'http://localhost:3000/contact'
      ];
      
      for (const pageUrl of pages) {
        try {
          await this.page.goto(pageUrl, { waitUntil: 'networkidle2' });
          
          const pageName = pageUrl.split('/').pop() || 'home';
          
          // Test navigation consistency
          const navElements = await this.page.$$('nav, .navigation, [data-testid*="nav"]');
          
          if (navElements.length > 0) {
            await this.takeScreenshot(
              `navigation-consistency-${pageName}`,
              `Navigation consistency on ${pageName} page`
            );
          }
          
        } catch (error) {
          console.warn(`⚠️ Could not test navigation on ${pageUrl}:`, error.message);
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Mobile navigation analysis warning:', error.message);
    }
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
    console.log('💡 Generating mobile navigation recommendations...');
    
    const recommendations = [];
    
    // Mobile menu recommendations
    if (!this.results.metrics.hasMobileMenuToggle) {
      recommendations.push({
        category: 'Navigation',
        priority: 'High',
        issue: 'Missing mobile menu toggle',
        recommendation: 'Add a hamburger menu button for mobile navigation',
        metric: 'Mobile menu toggle: Not found'
      });
    }
    
    if (!this.results.metrics.mobileMenuWorks) {
      recommendations.push({
        category: 'Navigation',
        priority: 'High',
        issue: 'Mobile menu not functional',
        recommendation: 'Ensure mobile menu opens and closes properly',
        metric: 'Mobile menu functionality: Not working'
      });
    }
    
    // Touch target recommendations
    if (this.results.metrics.touchTargets && this.results.metrics.touchTargets.compliance < 80) {
      recommendations.push({
        category: 'Touch Targets',
        priority: 'Medium',
        issue: 'Low touch target compliance',
        recommendation: 'Increase touch target sizes to minimum 44x44px',
        metric: `Touch target compliance: ${this.results.metrics.touchTargets.compliance}%`
      });
    }
    
    // Performance recommendations
    if (this.results.metrics.mobilePerformance && this.results.metrics.mobilePerformance.totalTestTime > 5000) {
      recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: 'Slow mobile loading',
        recommendation: 'Optimize images and assets for mobile networks',
        metric: `Mobile load time: ${this.results.metrics.mobilePerformance.totalTestTime}ms`
      });
    }
    
    // Form experience recommendations
    if (this.results.metrics.mobileFormsWorking === false) {
      recommendations.push({
        category: 'Forms',
        priority: 'Medium',
        issue: 'Mobile form experience issues',
        recommendation: 'Improve mobile form accessibility and usability',
        metric: 'Mobile forms: Not working properly'
      });
    }
    
    // Device coverage recommendations
    const testedDevices = this.results.deviceTests.filter(test => test.success).length;
    if (testedDevices < 4) {
      recommendations.push({
        category: 'Device Coverage',
        priority: 'Low',
        issue: 'Limited device testing',
        recommendation: 'Test on more device sizes and orientations',
        metric: `Devices tested: ${testedDevices}`
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating mobile navigation analysis report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Mobile Navigation & Responsiveness Analysis Report',
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      summary: {
        totalScreenshots: this.results.screenshots.length,
        totalIssues: this.results.issues.length,
        totalRecommendations: this.results.recommendations.length,
        devicesTestedSuccessfully: this.results.deviceTests.filter(test => test.success).length,
        overallScore: this.calculateOverallScore()
      },
      metrics: this.results.metrics,
      deviceTests: this.results.deviceTests,
      screenshots: this.results.screenshots,
      issues: this.results.issues,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Implement high-priority mobile navigation improvements',
        'Optimize touch target sizes for better accessibility',
        'Test on additional mobile devices and screen sizes',
        'Improve mobile performance and loading times',
        'Enhance mobile form experience'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'mobile-navigation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'mobile-navigation-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // Deduct points for missing features
    if (!this.results.metrics.hasMobileMenuToggle) score -= 25;
    if (!this.results.metrics.mobileMenuWorks) score -= 20;
    if (this.results.metrics.touchTargets && this.results.metrics.touchTargets.compliance < 80) {
      score -= (80 - this.results.metrics.touchTargets.compliance) * 0.5;
    }
    
    // Deduct points for issues
    score -= this.results.issues.filter(i => i.type === 'critical').length * 20;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 5;
    
    // Performance penalties
    if (this.results.metrics.mobilePerformance && this.results.metrics.mobilePerformance.totalTestTime > 5000) {
      score -= 10;
    }
    
    return Math.max(0, Math.round(score));
  }

  generateMarkdownReport(report) {
    return `# Mobile Navigation & Responsiveness Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Devices Tested Successfully:** ${report.summary.devicesTestedSuccessfully}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}

## 📱 Device Testing Results

${report.deviceTests.map(test => 
  `### ${test.device} (${test.category})
- **Dimensions:** ${test.dimensions}
- **Duration:** ${test.duration}ms
- **Status:** ${test.success ? '✅ Success' : '❌ Failed'}
- **Issues:** ${test.issues.length || 0}
`).join('\n')}

## 🎯 Key Metrics

${report.metrics.touchTargets ? `
### Touch Target Compliance
- **Total Interactive Elements:** ${report.metrics.touchTargets.total}
- **Touch-Friendly Elements:** ${report.metrics.touchTargets.touchFriendly}
- **Too Small Elements:** ${report.metrics.touchTargets.tooSmall}
- **Compliance Rate:** ${report.metrics.touchTargets.compliance}%
` : ''}

${report.metrics.mobilePerformance ? `
### Mobile Performance
- **Load Time:** ${report.metrics.mobilePerformance.totalTestTime}ms
- **Network Condition:** ${report.metrics.mobilePerformance.networkCondition}
- **DOM Content Loaded:** ${report.metrics.mobilePerformance.domContentLoaded}ms
- **First Paint:** ${report.metrics.mobilePerformance.firstPaint}ms
` : ''}

## 🧭 Navigation Features Status

| Feature | Status |
|---------|--------|
| Mobile Menu Toggle | ${report.metrics.hasMobileMenuToggle ? '✅ Available' : '❌ Missing'} |
| Mobile Menu Functionality | ${report.metrics.mobileMenuWorks ? '✅ Working' : '❌ Not Working'} |
| Touch Gestures | ${report.metrics.touchGesturesWorking ? '✅ Working' : '❌ Not Working'} |
| Mobile Forms | ${report.metrics.mobileFormsWorking ? '✅ Working' : '❌ Issues Found'} |

## 📸 Screenshots Captured

${report.screenshots.map(s => `- **${s.filename}:** ${s.description}`).join('\n')}

## ⚠️ Issues Found

${report.issues.length > 0 ? report.issues.map(issue => 
  `- **${issue.type.toUpperCase()}:** ${issue.message}${issue.device ? ` (Device: ${issue.device})` : ''}`
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
*Report generated by Tishya Foods Mobile Navigation Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runMobileNavigationTest() {
  const tester = new MobileNavigationTester();
  
  try {
    await tester.initialize();
    await tester.runMobileNavigationTests();
    const report = await tester.generateReport();
    
    console.log('\n🎉 Mobile Navigation Testing Complete!');
    console.log('📊 Overall Score:', report.summary.overallScore + '/100');
    console.log('📁 Results saved to:', tester.screenshotDir);
    
    return report;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  } finally {
    await tester.cleanup();
  }
}

// Export for use in other modules
module.exports = { MobileNavigationTester, runMobileNavigationTest };

// Run if called directly
if (require.main === module) {
  runMobileNavigationTest()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}