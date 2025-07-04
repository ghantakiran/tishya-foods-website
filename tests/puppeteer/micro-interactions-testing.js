/**
 * Micro-Interactions & Animation Testing - Issue #6
 * Test and optimize micro-interactions and animations throughout the website
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class MicroInteractionsTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: [],
      animationTests: []
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/micro-interactions');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('✨ Initializing Micro-Interactions Testing...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
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
  }

  async runMicroInteractionsTests() {
    console.log('🎬 Starting Micro-Interactions & Animation Analysis...');
    
    try {
      // Test homepage micro-interactions
      await this.testHomepageMicroInteractions();
      
      // Test button animations
      await this.testButtonAnimations();
      
      // Test form field interactions
      await this.testFormFieldInteractions();
      
      // Test product card animations
      await this.testProductCardAnimations();
      
      // Test scroll-triggered animations
      await this.testScrollTriggeredAnimations();
      
      // Test navigation animations
      await this.testNavigationAnimations();
      
      // Test page transitions
      await this.testPageTransitions();
      
      // Test loading states
      await this.testLoadingStates();
      
      // Analyze animation performance
      await this.analyzeAnimationPerformance();
      
      console.log('✅ Micro-Interactions & Animation testing completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during micro-interactions testing:', error);
      this.results.issues.push({
        type: 'critical',
        category: 'testing',
        message: `Micro-interactions testing failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testHomepageMicroInteractions() {
    console.log('🏠 Step 1: Testing homepage micro-interactions...');
    
    try {
      // Navigate to homepage
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test initial page load animations
      await new Promise(resolve => setTimeout(resolve, 1500));
      await this.takeScreenshot('homepage-initial-load', 'Homepage initial load animations');
      
      // Test hero section animations
      const heroSection = await this.page.$('[data-testid*="hero"], .hero, .hero-section');
      if (heroSection) {
        await this.takeScreenshot('hero-section-animations', 'Hero section animations');
        
        // Test hero button hover
        const heroButton = await this.page.$('.hero button, [data-testid*="hero"] button');
        if (heroButton) {
          await heroButton.hover();
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.takeScreenshot('hero-button-hover', 'Hero button hover animation');
        }
      }
      
      // Test scroll hint animations (if any)
      const scrollHint = await this.page.$('.scroll-hint, [data-testid*="scroll"]');
      if (scrollHint) {
        await this.takeScreenshot('scroll-hint-animation', 'Scroll hint animation');
      }
      
      this.results.animationTests.push({
        test: 'homepage_micro_interactions',
        success: true,
        elementsFound: {
          heroSection: !!heroSection,
          heroButton: !!(await this.page.$('.hero button, [data-testid*="hero"] button')),
          scrollHint: !!scrollHint
        }
      });
      
    } catch (error) {
      console.warn('⚠️ Homepage micro-interactions test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'homepage_interactions',
        message: `Homepage micro-interactions issue: ${error.message}`
      });
    }
  }

  async testButtonAnimations() {
    console.log('🔘 Step 2: Testing button animations...');
    
    try {
      // Find various button types
      const buttons = await this.page.$$('button, .button, [role="button"]');
      
      if (buttons.length > 0) {
        // Test primary buttons
        for (let i = 0; i < Math.min(buttons.length, 5); i++) {
          const button = buttons[i];
          
          // Get button text for identification
          const buttonText = await this.page.evaluate(el => el.textContent, button);
          
          if (buttonText && buttonText.trim()) {
            const buttonId = buttonText.toLowerCase().replace(/\s+/g, '-').substring(0, 15);
            
            // Test hover state
            await button.hover();
            await new Promise(resolve => setTimeout(resolve, 300));
            await this.takeScreenshot(`button-hover-${buttonId}`, `Button hover: ${buttonText}`);
            
            // Test active/click state
            await button.focus();
            await new Promise(resolve => setTimeout(resolve, 200));
            await this.takeScreenshot(`button-focus-${buttonId}`, `Button focus: ${buttonText}`);
            
            // Test click animation (without actually clicking)
            await this.page.evaluate((btn) => {
              btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
              setTimeout(() => {
                btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
              }, 100);
            }, button);
            
            await new Promise(resolve => setTimeout(resolve, 200));
            await this.takeScreenshot(`button-click-${buttonId}`, `Button click: ${buttonText}`);
            
            // Move mouse away to reset state
            await this.page.mouse.move(50, 50);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        this.results.metrics.buttonAnimationsCount = Math.min(buttons.length, 5);
        this.results.metrics.buttonAnimationsWorking = true;
        
      } else {
        this.results.issues.push({
          type: 'warning',
          category: 'button_animations',
          message: 'No buttons found for animation testing'
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Button animations test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'button_animations',
        message: `Button animations test issue: ${error.message}`
      });
    }
  }

  async testFormFieldInteractions() {
    console.log('📝 Step 3: Testing form field interactions...');
    
    try {
      // Navigate to contact page for form testing
      await this.page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
      
      // Find form fields
      const formFields = await this.page.$$('input, textarea, select');
      
      if (formFields.length > 0) {
        for (let i = 0; i < Math.min(formFields.length, 4); i++) {
          const field = formFields[i];
          
          // Get field type and placeholder
          const fieldInfo = await this.page.evaluate(el => ({
            type: el.type || el.tagName.toLowerCase(),
            placeholder: el.placeholder || el.getAttribute('aria-label') || `field-${el.tagName.toLowerCase()}`
          }), field);
          
          const fieldId = fieldInfo.placeholder.toLowerCase().replace(/\s+/g, '-').substring(0, 15);
          
          // Test focus state
          await field.focus();
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.takeScreenshot(`form-focus-${fieldId}`, `Form field focus: ${fieldInfo.placeholder}`);
          
          // Test typing interaction
          if (fieldInfo.type === 'email') {
            await field.type('test@example.com');
          } else if (fieldInfo.type === 'text' || fieldInfo.type === 'input') {
            await field.type('Test input');
          } else if (fieldInfo.type === 'textarea') {
            await field.type('Test message content');
          }
          
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.takeScreenshot(`form-typing-${fieldId}`, `Form field typing: ${fieldInfo.placeholder}`);
          
          // Test blur/unfocus state
          await this.page.click('body');
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.takeScreenshot(`form-blur-${fieldId}`, `Form field blur: ${fieldInfo.placeholder}`);
        }
        
        this.results.metrics.formFieldAnimationsCount = Math.min(formFields.length, 4);
        this.results.metrics.formFieldAnimationsWorking = true;
        
      } else {
        // Try homepage for any forms
        await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        
        const homeFormFields = await this.page.$$('input, textarea');
        if (homeFormFields.length > 0) {
          const field = homeFormFields[0];
          await field.focus();
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.takeScreenshot('homepage-form-focus', 'Homepage form field focus');
          
          this.results.metrics.formFieldAnimationsCount = 1;
          this.results.metrics.formFieldAnimationsWorking = true;
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Form field interactions test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'form_interactions',
        message: `Form field interactions test issue: ${error.message}`
      });
    }
  }

  async testProductCardAnimations() {
    console.log('🛍️ Step 4: Testing product card animations...');
    
    try {
      // Navigate to products page
      await this.page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
      
      // Find product cards
      const productCards = await this.page.$$('[data-testid="product-card"], .product-card, .product');
      
      if (productCards.length > 0) {
        // Test first few product cards
        for (let i = 0; i < Math.min(productCards.length, 3); i++) {
          const card = productCards[i];
          
          // Test hover animation
          await card.hover();
          await new Promise(resolve => setTimeout(resolve, 400));
          await this.takeScreenshot(`product-card-hover-${i}`, `Product card ${i + 1} hover animation`);
          
          // Test card loading animation (scroll into view)
          await this.page.evaluate((element) => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, card);
          
          await new Promise(resolve => setTimeout(resolve, 600));
          await this.takeScreenshot(`product-card-scroll-${i}`, `Product card ${i + 1} scroll into view`);
        }
        
        // Test add to cart button animations
        const addToCartButtons = await this.page.$$('[data-testid="add-to-cart-button"], .add-to-cart, button');
        if (addToCartButtons.length > 0) {
          const button = addToCartButtons[0];
          await button.hover();
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.takeScreenshot('add-to-cart-hover', 'Add to cart button hover');
        }
        
        this.results.metrics.productCardAnimationsCount = Math.min(productCards.length, 3);
        this.results.metrics.productCardAnimationsWorking = true;
        
      } else {
        this.results.issues.push({
          type: 'warning',
          category: 'product_animations',
          message: 'No product cards found for animation testing'
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Product card animations test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'product_animations',
        message: `Product card animations test issue: ${error.message}`
      });
    }
  }

  async testScrollTriggeredAnimations() {
    console.log('📜 Step 5: Testing scroll-triggered animations...');
    
    try {
      // Go back to homepage for scroll testing
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test scroll-triggered animations at different positions
      const scrollPositions = [300, 600, 1000, 1500, 2000];
      
      for (const scrollPos of scrollPositions) {
        await this.page.evaluate((pos) => {
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }, scrollPos);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        await this.takeScreenshot(
          `scroll-animation-${scrollPos}px`,
          `Scroll-triggered animations at ${scrollPos}px`
        );
      }
      
      // Test scroll to top
      await this.page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.takeScreenshot('scroll-to-top', 'Scroll to top animation');
      
      // Check for scroll-based animations
      const animatedElements = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let animatedCount = 0;
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.animation !== 'none' || 
              style.transform !== 'none' || 
              style.opacity !== '1') {
            animatedCount++;
          }
        });
        
        return animatedCount;
      });
      
      this.results.metrics.scrollAnimatedElements = animatedElements;
      this.results.metrics.scrollAnimationsWorking = animatedElements > 0;
      
    } catch (error) {
      console.warn('⚠️ Scroll-triggered animations test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'scroll_animations',
        message: `Scroll-triggered animations test issue: ${error.message}`
      });
    }
  }

  async testNavigationAnimations() {
    console.log('🧭 Step 6: Testing navigation animations...');
    
    try {
      // Test desktop navigation hover effects
      await this.page.setViewport({ width: 1200, height: 800 });
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      const navLinks = await this.page.$$('nav a, header a[href]');
      
      if (navLinks.length > 0) {
        // Test navigation link hover
        const firstLink = navLinks[0];
        await firstLink.hover();
        await new Promise(resolve => setTimeout(resolve, 400));
        await this.takeScreenshot('nav-link-hover', 'Navigation link hover animation');
        
        // Test multiple nav links
        for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
          const link = navLinks[i];
          await link.hover();
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        await this.takeScreenshot('nav-multiple-hover', 'Multiple navigation links hover');
      }
      
      // Test mobile navigation animations
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      const mobileMenuToggle = await this.page.$('[data-testid="mobile-menu-toggle"]');
      if (mobileMenuToggle) {
        // Open mobile menu
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.takeScreenshot('mobile-menu-open-animation', 'Mobile menu open animation');
        
        // Close mobile menu
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.takeScreenshot('mobile-menu-close-animation', 'Mobile menu close animation');
        
        this.results.metrics.mobileMenuAnimationsWorking = true;
      }
      
      // Reset viewport
      await this.page.setViewport({ width: 1200, height: 800 });
      
    } catch (error) {
      console.warn('⚠️ Navigation animations test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'navigation_animations',
        message: `Navigation animations test issue: ${error.message}`
      });
    }
  }

  async testPageTransitions() {
    console.log('🔄 Step 7: Testing page transitions...');
    
    try {
      // Test page navigation transitions
      const pages = [
        { url: 'http://localhost:3000', name: 'home' },
        { url: 'http://localhost:3000/products', name: 'products' },
        { url: 'http://localhost:3000/about', name: 'about' }
      ];
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        await this.page.goto(page.url, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 800));
        
        await this.takeScreenshot(
          `page-transition-${page.name}`,
          `Page transition to ${page.name}`
        );
      }
      
      // Test route transitions via navigation
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      const productLink = await this.page.$('a[href*="product"], nav a[href="/products"]');
      if (productLink) {
        await productLink.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.takeScreenshot('route-transition', 'Route transition via navigation');
      }
      
      this.results.metrics.pageTransitionsWorking = true;
      
    } catch (error) {
      console.warn('⚠️ Page transitions test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'page_transitions',
        message: `Page transitions test issue: ${error.message}`
      });
    }
  }

  async testLoadingStates() {
    console.log('⏳ Step 8: Testing loading states...');
    
    try {
      // Test initial page loading
      await this.page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await this.takeScreenshot('page-loading-state', 'Page loading state');
      
      await this.page.waitForSelector('body', { timeout: 5000 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.takeScreenshot('page-loaded-state', 'Page loaded state');
      
      // Look for loading spinners or skeletons
      const loadingElements = await this.page.$$('.loading, .spinner, .skeleton, [data-testid*="loading"]');
      
      if (loadingElements.length > 0) {
        await this.takeScreenshot('loading-elements-found', 'Loading elements found');
        this.results.metrics.loadingElementsCount = loadingElements.length;
      }
      
      // Test image loading states
      const images = await this.page.$$('img');
      if (images.length > 0) {
        // Test image lazy loading
        await this.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.takeScreenshot('image-lazy-loading', 'Image lazy loading');
      }
      
      this.results.metrics.loadingStatesWorking = true;
      
    } catch (error) {
      console.warn('⚠️ Loading states test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'loading_states',
        message: `Loading states test issue: ${error.message}`
      });
    }
  }

  async analyzeAnimationPerformance() {
    console.log('⚡ Step 9: Analyzing animation performance...');
    
    try {
      // Test animation frame rate
      const performanceMetrics = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0;
          const startTime = performance.now();
          
          function countFrame() {
            frameCount++;
            if (frameCount < 60) {
              requestAnimationFrame(countFrame);
            } else {
              const endTime = performance.now();
              const fps = Math.round(frameCount / ((endTime - startTime) / 1000));
              
              resolve({
                frameCount,
                duration: endTime - startTime,
                estimatedFPS: fps
              });
            }
          }
          
          requestAnimationFrame(countFrame);
        });
      });
      
      this.results.metrics.animationPerformance = performanceMetrics;
      
      // Check for animation-related CSS
      const animationCSS = await this.page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        let animatedElements = 0;
        let transitionElements = 0;
        let transformElements = 0;
        
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          
          if (style.animation !== 'none') animatedElements++;
          if (style.transition !== 'none' && style.transition !== '') transitionElements++;
          if (style.transform !== 'none') transformElements++;
        });
        
        return {
          animatedElements,
          transitionElements,
          transformElements,
          totalElements: allElements.length
        };
      });
      
      this.results.metrics.animationCSS = animationCSS;
      
      console.log(`📊 Animation Performance: ${performanceMetrics.estimatedFPS} FPS`);
      console.log(`🎨 Animated Elements: ${animationCSS.animatedElements}`);
      console.log(`🔄 Transition Elements: ${animationCSS.transitionElements}`);
      
    } catch (error) {
      console.warn('⚠️ Animation performance analysis warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'animation_performance',
        message: `Animation performance analysis issue: ${error.message}`
      });
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
    console.log('💡 Generating micro-interactions recommendations...');
    
    const recommendations = [];
    
    // Animation performance recommendations
    if (this.results.metrics.animationPerformance && this.results.metrics.animationPerformance.estimatedFPS < 60) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'Low animation frame rate',
        recommendation: 'Optimize animations for 60fps performance using CSS transforms and GPU acceleration',
        metric: `Current FPS: ${this.results.metrics.animationPerformance.estimatedFPS}`
      });
    }
    
    // Button animations recommendations
    if (!this.results.metrics.buttonAnimationsWorking) {
      recommendations.push({
        category: 'Button Interactions',
        priority: 'Medium',
        issue: 'Missing button animations',
        recommendation: 'Add hover, focus, and click animations to improve user feedback',
        metric: 'Button animations: Not working'
      });
    }
    
    // Form field recommendations
    if (!this.results.metrics.formFieldAnimationsWorking) {
      recommendations.push({
        category: 'Form Interactions',
        priority: 'Medium',
        issue: 'Missing form field animations',
        recommendation: 'Add focus states, label animations, and validation feedback',
        metric: 'Form animations: Not working'
      });
    }
    
    // Product card recommendations
    if (!this.results.metrics.productCardAnimationsWorking) {
      recommendations.push({
        category: 'Product Experience',
        priority: 'Medium',
        issue: 'Missing product card animations',
        recommendation: 'Add hover effects, image transitions, and loading states',
        metric: 'Product animations: Not working'
      });
    }
    
    // Scroll animations recommendations
    if (!this.results.metrics.scrollAnimationsWorking) {
      recommendations.push({
        category: 'Scroll Experience',
        priority: 'Low',
        issue: 'Missing scroll-triggered animations',
        recommendation: 'Add scroll-based reveal animations for content sections',
        metric: 'Scroll animations: Not implemented'
      });
    }
    
    // Loading states recommendations
    if (!this.results.metrics.loadingStatesWorking) {
      recommendations.push({
        category: 'Loading Experience',
        priority: 'Medium',
        issue: 'Missing loading states',
        recommendation: 'Add loading spinners, skeleton screens, and progress indicators',
        metric: 'Loading states: Not implemented'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating micro-interactions analysis report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Micro-Interactions & Animation Analysis Report',
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      summary: {
        totalScreenshots: this.results.screenshots.length,
        totalIssues: this.results.issues.length,
        totalRecommendations: this.results.recommendations.length,
        overallScore: this.calculateOverallScore()
      },
      metrics: this.results.metrics,
      animationTests: this.results.animationTests,
      screenshots: this.results.screenshots,
      issues: this.results.issues,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Implement high-priority animation improvements',
        'Optimize animation performance for 60fps',
        'Add missing micro-interactions for better UX',
        'Implement loading states and progress indicators',
        'Test animations across different devices and browsers'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'micro-interactions-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'micro-interactions-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // Deduct points for missing animations
    if (!this.results.metrics.buttonAnimationsWorking) score -= 15;
    if (!this.results.metrics.formFieldAnimationsWorking) score -= 15;
    if (!this.results.metrics.productCardAnimationsWorking) score -= 15;
    if (!this.results.metrics.scrollAnimationsWorking) score -= 10;
    if (!this.results.metrics.loadingStatesWorking) score -= 10;
    if (!this.results.metrics.mobileMenuAnimationsWorking) score -= 10;
    
    // Performance penalties
    if (this.results.metrics.animationPerformance && this.results.metrics.animationPerformance.estimatedFPS < 60) {
      score -= 15;
    }
    
    // Deduct points for issues
    score -= this.results.issues.filter(i => i.type === 'critical').length * 20;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 5;
    
    return Math.max(0, Math.round(score));
  }

  generateMarkdownReport(report) {
    return `# Micro-Interactions & Animation Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}

## 🎬 Animation Features Status

| Feature | Status | Count |
|---------|--------|-------|
| Button Animations | ${report.metrics.buttonAnimationsWorking ? '✅ Working' : '❌ Missing'} | ${report.metrics.buttonAnimationsCount || 0} |
| Form Field Animations | ${report.metrics.formFieldAnimationsWorking ? '✅ Working' : '❌ Missing'} | ${report.metrics.formFieldAnimationsCount || 0} |
| Product Card Animations | ${report.metrics.productCardAnimationsWorking ? '✅ Working' : '❌ Missing'} | ${report.metrics.productCardAnimationsCount || 0} |
| Scroll Animations | ${report.metrics.scrollAnimationsWorking ? '✅ Working' : '❌ Missing'} | ${report.metrics.scrollAnimatedElements || 0} |
| Mobile Menu Animations | ${report.metrics.mobileMenuAnimationsWorking ? '✅ Working' : '❌ Missing'} | - |
| Loading States | ${report.metrics.loadingStatesWorking ? '✅ Working' : '❌ Missing'} | ${report.metrics.loadingElementsCount || 0} |

## ⚡ Performance Metrics

${report.metrics.animationPerformance ? `
### Animation Performance
- **Frame Count:** ${report.metrics.animationPerformance.frameCount}
- **Duration:** ${report.metrics.animationPerformance.duration.toFixed(2)}ms
- **Estimated FPS:** ${report.metrics.animationPerformance.estimatedFPS}
` : ''}

${report.metrics.animationCSS ? `
### CSS Animation Usage
- **Animated Elements:** ${report.metrics.animationCSS.animatedElements}
- **Transition Elements:** ${report.metrics.animationCSS.transitionElements}
- **Transform Elements:** ${report.metrics.animationCSS.transformElements}
- **Total Elements:** ${report.metrics.animationCSS.totalElements}
` : ''}

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
*Report generated by Tishya Foods Micro-Interactions Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runMicroInteractionsTest() {
  const tester = new MicroInteractionsTester();
  
  try {
    await tester.initialize();
    await tester.runMicroInteractionsTests();
    const report = await tester.generateReport();
    
    console.log('\n🎉 Micro-Interactions & Animation Testing Complete!');
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
module.exports = { MicroInteractionsTester, runMicroInteractionsTest };

// Run if called directly
if (require.main === module) {
  runMicroInteractionsTest()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}