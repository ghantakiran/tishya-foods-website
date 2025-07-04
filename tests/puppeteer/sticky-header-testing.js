/**
 * Sticky Header & Navigation Testing - Issue #5
 * Test and optimize sticky header behavior and navigation transitions for Apple-like smoothness
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class StickyHeaderTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: [],
      testResults: []
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/sticky-header');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('🍎 Initializing Sticky Header & Navigation Testing...');
    
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

  async runStickyHeaderTests() {
    console.log('📋 Starting Sticky Header & Navigation Analysis...');
    
    try {
      // Test initial header state
      await this.testInitialHeaderState();
      
      // Test sticky behavior during scroll
      await this.testStickyBehavior();
      
      // Test navigation hover effects
      await this.testNavigationHoverEffects();
      
      // Test navigation animations
      await this.testNavigationAnimations();
      
      // Test scroll performance
      await this.testScrollPerformance();
      
      // Test mobile navigation behavior
      await this.testMobileNavigationBehavior();
      
      // Test Apple-style visual effects
      await this.testAppleStyleEffects();
      
      // Test cross-browser consistency
      await this.testCrossBrowserConsistency();
      
      console.log('✅ Sticky Header & Navigation testing completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during sticky header testing:', error);
      this.results.issues.push({
        type: 'critical',
        category: 'testing',
        message: `Sticky header testing failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testInitialHeaderState() {
    console.log('🎯 Step 1: Testing initial header state...');
    
    try {
      // Navigate to homepage
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Wait for header to load
      await this.page.waitForSelector('header, [data-testid*="header"], .header', { timeout: 5000 });
      
      // Capture initial header state
      await this.takeScreenshot('header-initial-state', 'Header initial state at top of page');
      
      // Get header properties
      const headerMetrics = await this.page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        
        const rect = header.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(header);
        
        return {
          position: computedStyle.position,
          top: computedStyle.top,
          zIndex: computedStyle.zIndex,
          backgroundColor: computedStyle.backgroundColor,
          backdropFilter: computedStyle.backdropFilter,
          opacity: computedStyle.opacity,
          height: rect.height,
          width: rect.width,
          isVisible: rect.height > 0 && rect.width > 0
        };
      });
      
      this.results.metrics.initialHeader = headerMetrics;
      
      // Test if header is properly positioned
      if (headerMetrics && headerMetrics.position === 'fixed') {
        this.results.metrics.isSticky = true;
        console.log('✅ Header is properly configured as sticky (position: fixed)');
      } else {
        this.results.issues.push({
          type: 'warning',
          category: 'header_positioning',
          message: 'Header may not be properly configured for sticky behavior'
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Initial header state test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'initial_header',
        message: `Initial header test issue: ${error.message}`
      });
    }
  }

  async testStickyBehavior() {
    console.log('📌 Step 2: Testing sticky behavior during scroll...');
    
    try {
      // Test scroll positions
      const scrollPositions = [100, 300, 500, 1000, 1500, 2000];
      
      for (const scrollPos of scrollPositions) {
        // Scroll to position
        await this.page.evaluate((pos) => {
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }, scrollPos);
        
        // Wait for scroll animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture header state at this scroll position
        await this.takeScreenshot(
          `header-scroll-${scrollPos}px`,
          `Header state at ${scrollPos}px scroll`
        );
        
        // Get header metrics at this position
        const scrollMetrics = await this.page.evaluate(() => {
          const header = document.querySelector('header');
          if (!header) return null;
          
          const rect = header.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(header);
          
          return {
            scrollY: window.scrollY,
            headerTop: rect.top,
            headerBottom: rect.bottom,
            isVisible: rect.top < window.innerHeight && rect.bottom > 0,
            opacity: computedStyle.opacity,
            backgroundColor: computedStyle.backgroundColor,
            backdropFilter: computedStyle.backdropFilter,
            transform: computedStyle.transform
          };
        });
        
        this.results.metrics[`scroll_${scrollPos}`] = scrollMetrics;
      }
      
      // Test scroll back to top
      await this.page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.takeScreenshot('header-back-to-top', 'Header state after scrolling back to top');
      
    } catch (error) {
      console.warn('⚠️ Sticky behavior test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'sticky_behavior',
        message: `Sticky behavior test issue: ${error.message}`
      });
    }
  }

  async testNavigationHoverEffects() {
    console.log('🎨 Step 3: Testing navigation hover effects...');
    
    try {
      // Scroll back to top for consistent testing
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find navigation links
      const navLinks = await this.page.$$('nav a, header a[href]');
      
      if (navLinks.length > 0) {
        // Test hover on first few navigation links
        for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
          const link = navLinks[i];
          
          // Get link text for identification
          const linkText = await this.page.evaluate(el => el.textContent, link);
          
          if (linkText && linkText.trim()) {
            // Hover over the link
            await link.hover();
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Capture hover state
            await this.takeScreenshot(
              `nav-hover-${linkText.toLowerCase().replace(/\s+/g, '-')}`,
              `Navigation hover effect on "${linkText}"`
            );
            
            // Get hover state metrics
            const hoverMetrics = await this.page.evaluate((el) => {
              const rect = el.getBoundingClientRect();
              const computedStyle = window.getComputedStyle(el);
              
              return {
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor,
                transform: computedStyle.transform,
                textDecoration: computedStyle.textDecoration,
                borderBottom: computedStyle.borderBottom,
                transition: computedStyle.transition
              };
            }, link);
            
            this.results.metrics[`hover_${linkText.replace(/\s+/g, '_')}`] = hoverMetrics;
          }
        }
        
        // Move mouse away to clear hover states
        await this.page.mouse.move(50, 50);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.results.metrics.navigationHoverWorks = true;
        
      } else {
        this.results.issues.push({
          type: 'warning',
          category: 'navigation',
          message: 'No navigation links found for hover testing'
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Navigation hover effects test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'navigation_hover',
        message: `Navigation hover test issue: ${error.message}`
      });
    }
  }

  async testNavigationAnimations() {
    console.log('🎬 Step 4: Testing navigation animations...');
    
    try {
      // Test mobile menu animation if available
      const mobileMenuToggle = await this.page.$('[data-testid="mobile-menu-toggle"]');
      
      if (mobileMenuToggle) {
        // Set mobile viewport for testing
        await this.page.setViewport({ width: 375, height: 667 });
        await this.page.reload({ waitUntil: 'networkidle2' });
        
        // Capture closed state
        await this.takeScreenshot('mobile-menu-closed', 'Mobile menu closed state');
        
        // Open mobile menu
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture opened state
        await this.takeScreenshot('mobile-menu-opened', 'Mobile menu opened state');
        
        // Check if menu is visible
        const menuVisible = await this.page.$('[data-testid="mobile-menu"]');
        if (menuVisible) {
          this.results.metrics.mobileMenuAnimationWorks = true;
          
          // Get animation properties
          const animationMetrics = await this.page.evaluate(() => {
            const menu = document.querySelector('[data-testid="mobile-menu"]');
            if (!menu) return null;
            
            const computedStyle = window.getComputedStyle(menu);
            return {
              opacity: computedStyle.opacity,
              transform: computedStyle.transform,
              transition: computedStyle.transition,
              animation: computedStyle.animation,
              height: computedStyle.height
            };
          });
          
          this.results.metrics.mobileMenuAnimation = animationMetrics;
        }
        
        // Close menu
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reset viewport
        await this.page.setViewport({ width: 1200, height: 800 });
        await this.page.reload({ waitUntil: 'networkidle2' });
      }
      
      // Test any dropdown animations
      const dropdownTriggers = await this.page.$$('[data-testid*="dropdown"], .dropdown-trigger, .has-dropdown');
      
      if (dropdownTriggers.length > 0) {
        for (let i = 0; i < Math.min(dropdownTriggers.length, 3); i++) {
          const trigger = dropdownTriggers[i];
          
          // Hover to trigger dropdown
          await trigger.hover();
          await new Promise(resolve => setTimeout(resolve, 300));
          
          await this.takeScreenshot(
            `dropdown-animation-${i}`,
            `Dropdown animation test ${i + 1}`
          );
        }
        
        this.results.metrics.dropdownAnimationsFound = dropdownTriggers.length;
      }
      
    } catch (error) {
      console.warn('⚠️ Navigation animations test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'navigation_animations',
        message: `Navigation animations test issue: ${error.message}`
      });
    }
  }

  async testScrollPerformance() {
    console.log('⚡ Step 5: Testing scroll performance...');
    
    try {
      // Reset to top
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Test scroll performance
      const scrollMetrics = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          let scrollCount = 0;
          let frameCount = 0;
          const startTime = performance.now();
          
          const scrollHandler = () => {
            scrollCount++;
            if (scrollCount >= 20) {
              window.removeEventListener('scroll', scrollHandler);
              const endTime = performance.now();
              resolve({
                scrollCount,
                duration: endTime - startTime,
                averageScrollTime: (endTime - startTime) / scrollCount,
                finalScrollY: window.scrollY
              });
            }
          };
          
          window.addEventListener('scroll', scrollHandler);
          
          // Perform smooth scrolling
          window.scrollTo({ top: 2000, behavior: 'smooth' });
        });
      });
      
      this.results.metrics.scrollPerformance = scrollMetrics;
      
      // Test header performance during scroll
      const headerPerformance = await this.page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        
        const observer = new PerformanceObserver((list) => {
          console.log('Performance entries:', list.getEntries());
        });
        
        observer.observe({ entryTypes: ['paint', 'navigation'] });
        
        const rect = header.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(header);
        
        return {
          hasBackdropFilter: computedStyle.backdropFilter !== 'none',
          hasBlur: computedStyle.backdropFilter.includes('blur'),
          hasOpacity: parseFloat(computedStyle.opacity) < 1,
          headerHeight: rect.height,
          isFixed: computedStyle.position === 'fixed'
        };
      });
      
      this.results.metrics.headerPerformance = headerPerformance;
      
      console.log(`📊 Scroll Performance: ${scrollMetrics.duration.toFixed(2)}ms for ${scrollMetrics.scrollCount} scroll events`);
      
    } catch (error) {
      console.warn('⚠️ Scroll performance test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'scroll_performance',
        message: `Scroll performance test issue: ${error.message}`
      });
    }
  }

  async testMobileNavigationBehavior() {
    console.log('📱 Step 6: Testing mobile navigation behavior...');
    
    try {
      // Test mobile viewport
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      // Test header behavior on mobile
      const mobileHeaderMetrics = await this.page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        
        const rect = header.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(header);
        
        return {
          height: rect.height,
          position: computedStyle.position,
          top: computedStyle.top,
          width: rect.width,
          isFullWidth: rect.width >= window.innerWidth * 0.95,
          zIndex: computedStyle.zIndex
        };
      });
      
      this.results.metrics.mobileHeader = mobileHeaderMetrics;
      
      // Test mobile scroll behavior
      await this.page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.takeScreenshot('mobile-header-scrolled', 'Mobile header during scroll');
      
      // Test mobile navigation accessibility
      const mobileNavAccessibility = await this.page.evaluate(() => {
        const menuToggle = document.querySelector('[data-testid="mobile-menu-toggle"]');
        if (!menuToggle) return { hasToggle: false };
        
        return {
          hasToggle: true,
          hasAriaLabel: menuToggle.hasAttribute('aria-label'),
          hasAriaExpanded: menuToggle.hasAttribute('aria-expanded'),
          isKeyboardAccessible: menuToggle.tabIndex >= 0,
          buttonRole: menuToggle.getAttribute('role') || menuToggle.tagName.toLowerCase()
        };
      });
      
      this.results.metrics.mobileNavAccessibility = mobileNavAccessibility;
      
      // Reset viewport
      await this.page.setViewport({ width: 1200, height: 800 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      
    } catch (error) {
      console.warn('⚠️ Mobile navigation behavior test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'mobile_navigation',
        message: `Mobile navigation test issue: ${error.message}`
      });
    }
  }

  async testAppleStyleEffects() {
    console.log('🍎 Step 7: Testing Apple-style visual effects...');
    
    try {
      // Test backdrop blur effects
      const appleStyleMetrics = await this.page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        
        const computedStyle = window.getComputedStyle(header);
        
        // Check for Apple-style properties
        const hasBackdropBlur = computedStyle.backdropFilter.includes('blur');
        const hasGlassEffect = computedStyle.backgroundColor.includes('rgba') || 
                              computedStyle.background.includes('rgba');
        const hasProperTransitions = computedStyle.transition !== 'none';
        
        return {
          backdropFilter: computedStyle.backdropFilter,
          backgroundColor: computedStyle.backgroundColor,
          background: computedStyle.background,
          transition: computedStyle.transition,
          hasBackdropBlur,
          hasGlassEffect,
          hasProperTransitions,
          borderRadius: computedStyle.borderRadius,
          boxShadow: computedStyle.boxShadow
        };
      });
      
      this.results.metrics.appleStyleEffects = appleStyleMetrics;
      
      // Test scroll-based opacity changes
      await this.page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const scrollBasedEffects = await this.page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        
        const computedStyle = window.getComputedStyle(header);
        
        return {
          opacity: computedStyle.opacity,
          backgroundColor: computedStyle.backgroundColor,
          backdropFilter: computedStyle.backdropFilter,
          scrollY: window.scrollY
        };
      });
      
      this.results.metrics.scrollBasedEffects = scrollBasedEffects;
      
      await this.takeScreenshot('apple-style-effects', 'Apple-style header effects during scroll');
      
      // Check for smooth animations
      const animationQuality = await this.page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        let elementsWithTransitions = 0;
        let elementsWithProperTiming = 0;
        
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.transition !== 'none' && style.transition !== '') {
            elementsWithTransitions++;
            
            // Check for smooth timing functions
            if (style.transition.includes('ease') || 
                style.transition.includes('cubic-bezier')) {
              elementsWithProperTiming++;
            }
          }
        });
        
        return {
          elementsWithTransitions,
          elementsWithProperTiming,
          transitionQuality: elementsWithTransitions > 0 ? 
            (elementsWithProperTiming / elementsWithTransitions) * 100 : 0
        };
      });
      
      this.results.metrics.animationQuality = animationQuality;
      
    } catch (error) {
      console.warn('⚠️ Apple-style effects test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'apple_style',
        message: `Apple-style effects test issue: ${error.message}`
      });
    }
  }

  async testCrossBrowserConsistency() {
    console.log('🌐 Step 8: Testing cross-browser consistency...');
    
    try {
      // Test user agent consistency
      const userAgent = await this.page.evaluate(() => navigator.userAgent);
      
      // Test CSS feature support
      const browserSupport = await this.page.evaluate(() => {
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        
        const support = {
          backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
          position_sticky: CSS.supports('position', 'sticky'),
          flexbox: CSS.supports('display', 'flex'),
          grid: CSS.supports('display', 'grid'),
          transforms: CSS.supports('transform', 'translateX(10px)'),
          transitions: CSS.supports('transition', 'all 0.3s ease'),
          customProperties: CSS.supports('--custom-property', 'value')
        };
        
        document.body.removeChild(testElement);
        return support;
      });
      
      this.results.metrics.browserSupport = {
        userAgent,
        features: browserSupport
      };
      
      // Test header consistency across different contexts
      const headerConsistency = await this.page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        
        const rect = header.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(header);
        
        return {
          height: rect.height,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex,
          display: computedStyle.display,
          boxSizing: computedStyle.boxSizing,
          layout: {
            marginTop: computedStyle.marginTop,
            marginBottom: computedStyle.marginBottom,
            paddingTop: computedStyle.paddingTop,
            paddingBottom: computedStyle.paddingBottom
          }
        };
      });
      
      this.results.metrics.headerConsistency = headerConsistency;
      
    } catch (error) {
      console.warn('⚠️ Cross-browser consistency test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'cross_browser',
        message: `Cross-browser consistency test issue: ${error.message}`
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
    console.log('💡 Generating sticky header recommendations...');
    
    const recommendations = [];
    
    // Sticky behavior recommendations
    if (!this.results.metrics.isSticky) {
      recommendations.push({
        category: 'Header Positioning',
        priority: 'High',
        issue: 'Header not properly configured as sticky',
        recommendation: 'Ensure header has position: fixed or position: sticky',
        metric: 'Header position: Not sticky'
      });
    }
    
    // Apple-style effects recommendations
    if (this.results.metrics.appleStyleEffects && !this.results.metrics.appleStyleEffects.hasBackdropBlur) {
      recommendations.push({
        category: 'Visual Effects',
        priority: 'Medium',
        issue: 'Missing backdrop blur effect',
        recommendation: 'Add backdrop-filter: blur() for Apple-style glass effect',
        metric: 'Backdrop blur: Not implemented'
      });
    }
    
    // Animation quality recommendations
    if (this.results.metrics.animationQuality && this.results.metrics.animationQuality.transitionQuality < 50) {
      recommendations.push({
        category: 'Animations',
        priority: 'Medium',
        issue: 'Poor animation timing functions',
        recommendation: 'Use ease-out or cubic-bezier timing functions for smoother animations',
        metric: `Animation quality: ${this.results.metrics.animationQuality.transitionQuality.toFixed(1)}%`
      });
    }
    
    // Performance recommendations
    if (this.results.metrics.scrollPerformance && this.results.metrics.scrollPerformance.averageScrollTime > 16.67) {
      recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: 'Slow scroll performance',
        recommendation: 'Optimize scroll handlers and reduce layout thrashing',
        metric: `Average scroll time: ${this.results.metrics.scrollPerformance.averageScrollTime.toFixed(2)}ms`
      });
    }
    
    // Mobile navigation recommendations
    if (this.results.metrics.mobileNavAccessibility && !this.results.metrics.mobileNavAccessibility.hasAriaLabel) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'Medium',
        issue: 'Missing mobile menu accessibility labels',
        recommendation: 'Add aria-label and aria-expanded attributes to mobile menu toggle',
        metric: 'Mobile menu accessibility: Incomplete'
      });
    }
    
    // Browser support recommendations
    if (this.results.metrics.browserSupport && !this.results.metrics.browserSupport.features.backdropFilter) {
      recommendations.push({
        category: 'Browser Support',
        priority: 'Low',
        issue: 'Backdrop filter not supported',
        recommendation: 'Provide fallback styles for browsers without backdrop-filter support',
        metric: 'Backdrop filter support: Not available'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating sticky header analysis report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Sticky Header & Navigation Analysis Report',
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      summary: {
        totalScreenshots: this.results.screenshots.length,
        totalIssues: this.results.issues.length,
        totalRecommendations: this.results.recommendations.length,
        overallScore: this.calculateOverallScore()
      },
      metrics: this.results.metrics,
      screenshots: this.results.screenshots,
      issues: this.results.issues,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Implement high-priority header positioning fixes',
        'Enhance Apple-style visual effects and animations',
        'Optimize scroll performance and responsiveness',
        'Improve mobile navigation accessibility',
        'Add cross-browser compatibility fallbacks'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'sticky-header-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'sticky-header-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // Deduct points for missing sticky behavior
    if (!this.results.metrics.isSticky) score -= 20;
    
    // Deduct points for missing Apple-style effects
    if (this.results.metrics.appleStyleEffects && !this.results.metrics.appleStyleEffects.hasBackdropBlur) score -= 15;
    
    // Deduct points for poor animation quality
    if (this.results.metrics.animationQuality && this.results.metrics.animationQuality.transitionQuality < 50) score -= 10;
    
    // Deduct points for accessibility issues
    if (this.results.metrics.mobileNavAccessibility && !this.results.metrics.mobileNavAccessibility.hasAriaLabel) score -= 10;
    
    // Deduct points for issues
    score -= this.results.issues.filter(i => i.type === 'critical').length * 20;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 5;
    
    return Math.max(0, Math.round(score));
  }

  generateMarkdownReport(report) {
    return `# Sticky Header & Navigation Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}

## 🎯 Header Functionality Status

| Feature | Status |
|---------|--------|
| Sticky Position | ${report.metrics.isSticky ? '✅ Working' : '❌ Not Working'} |
| Mobile Menu Animation | ${report.metrics.mobileMenuAnimationWorks ? '✅ Working' : '❌ Not Working'} |
| Navigation Hover Effects | ${report.metrics.navigationHoverWorks ? '✅ Working' : '❌ Not Working'} |
| Apple-Style Blur | ${report.metrics.appleStyleEffects?.hasBackdropBlur ? '✅ Implemented' : '❌ Missing'} |
| Glass Effect | ${report.metrics.appleStyleEffects?.hasGlassEffect ? '✅ Implemented' : '❌ Missing'} |

## ⚡ Performance Metrics

${report.metrics.scrollPerformance ? `
### Scroll Performance
- **Total Scroll Events:** ${report.metrics.scrollPerformance.scrollCount}
- **Duration:** ${report.metrics.scrollPerformance.duration.toFixed(2)}ms
- **Average per Event:** ${report.metrics.scrollPerformance.averageScrollTime.toFixed(2)}ms
- **Final Scroll Position:** ${report.metrics.scrollPerformance.finalScrollY}px
` : ''}

${report.metrics.animationQuality ? `
### Animation Quality
- **Elements with Transitions:** ${report.metrics.animationQuality.elementsWithTransitions}
- **Elements with Proper Timing:** ${report.metrics.animationQuality.elementsWithProperTiming}
- **Transition Quality Score:** ${report.metrics.animationQuality.transitionQuality.toFixed(1)}%
` : ''}

## 🍎 Apple-Style Effects Analysis

${report.metrics.appleStyleEffects ? `
- **Backdrop Filter:** ${report.metrics.appleStyleEffects.backdropFilter || 'None'}
- **Background:** ${report.metrics.appleStyleEffects.backgroundColor || 'Default'}
- **Transitions:** ${report.metrics.appleStyleEffects.hasProperTransitions ? 'Implemented' : 'Missing'}
- **Box Shadow:** ${report.metrics.appleStyleEffects.boxShadow || 'None'}
` : 'Apple-style effects not analyzed'}

## 📱 Mobile Navigation Analysis

${report.metrics.mobileNavAccessibility ? `
- **Has Toggle Button:** ${report.metrics.mobileNavAccessibility.hasToggle ? 'Yes' : 'No'}
- **Aria Label:** ${report.metrics.mobileNavAccessibility.hasAriaLabel ? 'Yes' : 'No'}
- **Aria Expanded:** ${report.metrics.mobileNavAccessibility.hasAriaExpanded ? 'Yes' : 'No'}
- **Keyboard Accessible:** ${report.metrics.mobileNavAccessibility.isKeyboardAccessible ? 'Yes' : 'No'}
` : 'Mobile navigation not analyzed'}

## 🌐 Browser Support

${report.metrics.browserSupport ? `
- **Backdrop Filter:** ${report.metrics.browserSupport.features.backdropFilter ? '✅' : '❌'}
- **Position Sticky:** ${report.metrics.browserSupport.features.position_sticky ? '✅' : '❌'}
- **Flexbox:** ${report.metrics.browserSupport.features.flexbox ? '✅' : '❌'}
- **CSS Grid:** ${report.metrics.browserSupport.features.grid ? '✅' : '❌'}
- **Transforms:** ${report.metrics.browserSupport.features.transforms ? '✅' : '❌'}
- **Transitions:** ${report.metrics.browserSupport.features.transitions ? '✅' : '❌'}
` : 'Browser support not analyzed'}

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
*Report generated by Tishya Foods Sticky Header Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runStickyHeaderTest() {
  const tester = new StickyHeaderTester();
  
  try {
    await tester.initialize();
    await tester.runStickyHeaderTests();
    const report = await tester.generateReport();
    
    console.log('\n🎉 Sticky Header & Navigation Testing Complete!');
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
module.exports = { StickyHeaderTester, runStickyHeaderTest };

// Run if called directly
if (require.main === module) {
  runStickyHeaderTest()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}