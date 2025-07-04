/**
 * Homepage User Experience Analysis - Issue #2
 * Test and analyze homepage UX flow for Tishya Foods website
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class HomepageUXAnalyzer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: []
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/homepage-ux');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('🚀 Initializing Homepage UX Analysis...');
    
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
    
    // Track network requests for performance
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      request.continue();
    });
  }

  async analyzeHomepage() {
    console.log('📊 Starting Homepage Analysis...');
    
    try {
      // Navigate to homepage
      console.log('🏠 Navigating to homepage...');
      const navigationStart = Date.now();
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      const navigationEnd = Date.now();
      
      this.results.metrics.navigationTime = navigationEnd - navigationStart;
      
      // Take initial screenshot
      await this.takeScreenshot('homepage-initial', 'Homepage initial load');
      
      // Test hero section
      await this.testHeroSection();
      
      // Test product showcase
      await this.testProductShowcase();
      
      // Test testimonials section
      await this.testTestimonialsSection();
      
      // Test Instagram feed
      await this.testInstagramFeed();
      
      // Test navigation
      await this.testNavigation();
      
      // Test mobile responsiveness
      await this.testMobileResponsiveness();
      
      // Analyze page performance
      await this.analyzePerformance();
      
      console.log('✅ Homepage analysis completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during homepage analysis:', error);
      this.results.issues.push({
        type: 'critical',
        message: `Analysis failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testHeroSection() {
    console.log('🎯 Testing hero section...');
    
    try {
      // Wait for hero section to load
      await this.page.waitForSelector('[data-testid="hero-section"], .hero, section:first-of-type', { timeout: 5000 });
      
      // Test hero section animations
      const heroAnimationStart = Date.now();
      
      // Check if hero section is visible
      const heroElement = await this.page.$('[data-testid="hero-section"], .hero, section:first-of-type');
      if (heroElement) {
        const heroBox = await heroElement.boundingBox();
        
        if (heroBox && heroBox.height > 300) {
          this.results.metrics.heroSectionHeight = heroBox.height;
          await this.takeScreenshot('hero-section', 'Hero section loaded');
          
          // Test CTA button if present
          const ctaButton = await this.page.$('[data-testid="cta-button"], .cta, .btn-primary, a[href*="product"]');
          if (ctaButton) {
            await ctaButton.hover();
            await this.takeScreenshot('hero-cta-hover', 'Hero CTA button hover state');
          }
        }
      }
      
      const heroAnimationEnd = Date.now();
      this.results.metrics.heroLoadTime = heroAnimationEnd - heroAnimationStart;
      
    } catch (error) {
      console.warn('⚠️ Hero section test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'hero',
        message: `Hero section issue: ${error.message}`
      });
    }
  }

  async testProductShowcase() {
    console.log('🛍️ Testing product showcase...');
    
    try {
      // Look for product carousel or grid
      const productSection = await this.page.$('[data-testid="product-carousel"], [data-testid="product-showcase"], .products, .product-grid');
      
      if (productSection) {
        await productSection.scrollIntoView();
        await this.takeScreenshot('product-showcase', 'Product showcase section');
        
        // Test carousel navigation if present
        const nextButton = await this.page.$('[data-testid="carousel-next"], .carousel-next, .next-btn');
        if (nextButton) {
          await nextButton.click();
          await this.page.waitForTimeout(500);
          await this.takeScreenshot('product-carousel-next', 'Product carousel after next click');
        }
        
        // Test product card interactions
        const productCards = await this.page.$$('[data-testid="product-card"], .product-card, .product');
        if (productCards.length > 0) {
          await productCards[0].hover();
          await this.takeScreenshot('product-card-hover', 'Product card hover interaction');
          this.results.metrics.productCardCount = productCards.length;
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Product showcase test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'products',
        message: `Product showcase issue: ${error.message}`
      });
    }
  }

  async testTestimonialsSection() {
    console.log('💬 Testing testimonials section...');
    
    try {
      const testimonialsSection = await this.page.$('[data-testid="testimonials"], .testimonials, .reviews');
      
      if (testimonialsSection) {
        await testimonialsSection.scrollIntoView();
        await this.takeScreenshot('testimonials-section', 'Testimonials section');
        
        // Test testimonial cards
        const testimonialCards = await this.page.$$('[data-testid="testimonial"], .testimonial, .review');
        if (testimonialCards.length > 0) {
          this.results.metrics.testimonialCount = testimonialCards.length;
          
          // Test testimonial navigation if present
          const testimonialNext = await this.page.$('[data-testid="testimonial-next"], .testimonial-next');
          if (testimonialNext) {
            await testimonialNext.click();
            await this.page.waitForTimeout(500);
            await this.takeScreenshot('testimonials-navigation', 'Testimonials after navigation');
          }
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Testimonials test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'testimonials',
        message: `Testimonials issue: ${error.message}`
      });
    }
  }

  async testInstagramFeed() {
    console.log('📸 Testing Instagram feed integration...');
    
    try {
      const instagramSection = await this.page.$('[data-testid="instagram-feed"], .instagram, .social-feed');
      
      if (instagramSection) {
        await instagramSection.scrollIntoView();
        await this.takeScreenshot('instagram-feed', 'Instagram feed section');
        
        // Test Instagram posts
        const instagramPosts = await this.page.$$('[data-testid="instagram-post"], .instagram-post, .social-post');
        if (instagramPosts.length > 0) {
          this.results.metrics.instagramPostCount = instagramPosts.length;
          
          // Test hover on first post
          await instagramPosts[0].hover();
          await this.takeScreenshot('instagram-hover', 'Instagram post hover effect');
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Instagram feed test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'instagram',
        message: `Instagram feed issue: ${error.message}`
      });
    }
  }

  async testNavigation() {
    console.log('🧭 Testing navigation...');
    
    try {
      // Test main navigation
      const navElement = await this.page.$('nav, [data-testid="navigation"], .navigation, header nav');
      
      if (navElement) {
        await this.takeScreenshot('navigation', 'Main navigation');
        
        // Test navigation links
        const navLinks = await this.page.$$('nav a, [data-testid="nav-link"], .nav-link');
        this.results.metrics.navigationLinkCount = navLinks.length;
        
        // Test hover effects on navigation
        if (navLinks.length > 0) {
          await navLinks[0].hover();
          await this.takeScreenshot('navigation-hover', 'Navigation link hover effect');
        }
        
        // Test mobile menu if present
        const mobileMenuButton = await this.page.$('[data-testid="mobile-menu-toggle"], .mobile-menu-btn, .hamburger');
        if (mobileMenuButton) {
          await mobileMenuButton.click();
          await this.page.waitForTimeout(500);
          await this.takeScreenshot('mobile-menu-open', 'Mobile menu opened');
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Navigation test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'navigation',
        message: `Navigation issue: ${error.message}`
      });
    }
  }

  async testMobileResponsiveness() {
    console.log('📱 Testing mobile responsiveness...');
    
    try {
      // Test mobile viewport
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      await this.takeScreenshot('mobile-homepage', 'Homepage in mobile view');
      
      // Test tablet viewport
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      await this.takeScreenshot('tablet-homepage', 'Homepage in tablet view');
      
      // Reset to desktop viewport
      await this.page.setViewport({ width: 1200, height: 800 });
      
    } catch (error) {
      console.warn('⚠️ Mobile responsiveness test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'responsive',
        message: `Mobile responsiveness issue: ${error.message}`
      });
    }
  }

  async analyzePerformance() {
    console.log('⚡ Analyzing performance...');
    
    try {
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
      
      this.results.metrics.performance = performanceMetrics;
      
      // Check for accessibility issues
      const accessibilityIssues = await this.page.evaluate(() => {
        const issues = [];
        
        // Check for missing alt text
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (!img.alt) {
            issues.push('Image missing alt text');
          }
        });
        
        // Check for heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
          issues.push('No heading elements found');
        }
        
        return issues;
      });
      
      this.results.issues.push(...accessibilityIssues.map(issue => ({
        type: 'accessibility',
        message: issue
      })));
      
    } catch (error) {
      console.warn('⚠️ Performance analysis warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        section: 'performance',
        message: `Performance analysis issue: ${error.message}`
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
    console.log('💡 Generating UX recommendations...');
    
    const recommendations = [];
    
    // Performance recommendations
    if (this.results.metrics.navigationTime > 3000) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'Slow page load time',
        recommendation: 'Optimize images, enable lazy loading, and consider code splitting',
        metric: `Load time: ${this.results.metrics.navigationTime}ms`
      });
    }
    
    // Content recommendations
    if (this.results.metrics.productCardCount < 3) {
      recommendations.push({
        category: 'Content',
        priority: 'Medium',
        issue: 'Limited product showcase',
        recommendation: 'Display more products on homepage to increase engagement',
        metric: `Products shown: ${this.results.metrics.productCardCount || 0}`
      });
    }
    
    // Social proof recommendations
    if (this.results.metrics.testimonialCount < 3) {
      recommendations.push({
        category: 'Social Proof',
        priority: 'Medium',
        issue: 'Limited testimonials',
        recommendation: 'Add more customer testimonials to build trust',
        metric: `Testimonials: ${this.results.metrics.testimonialCount || 0}`
      });
    }
    
    // Accessibility recommendations
    const accessibilityIssues = this.results.issues.filter(issue => issue.type === 'accessibility');
    if (accessibilityIssues.length > 0) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'High',
        issue: 'Accessibility compliance issues',
        recommendation: 'Fix accessibility issues to ensure WCAG compliance',
        metric: `Issues found: ${accessibilityIssues.length}`
      });
    }
    
    // Navigation recommendations
    if (this.results.metrics.navigationLinkCount < 5) {
      recommendations.push({
        category: 'Navigation',
        priority: 'Low',
        issue: 'Limited navigation options',
        recommendation: 'Consider adding more navigation links for better site discovery',
        metric: `Nav links: ${this.results.metrics.navigationLinkCount || 0}`
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating UX analysis report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Homepage User Experience Analysis Report',
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
        'Implement high-priority recommendations',
        'Set up performance monitoring',
        'Schedule regular UX audits',
        'A/B test proposed changes'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'homepage-ux-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'homepage-ux-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // Deduct points for issues
    score -= this.results.issues.filter(i => i.type === 'critical').length * 20;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 10;
    score -= this.results.issues.filter(i => i.type === 'accessibility').length * 15;
    
    // Performance penalties
    if (this.results.metrics.navigationTime > 3000) score -= 15;
    if (this.results.metrics.navigationTime > 5000) score -= 25;
    
    return Math.max(0, score);
  }

  generateMarkdownReport(report) {
    return `# Homepage User Experience Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}

## ⚡ Performance Metrics

${report.metrics.navigationTime ? `- **Page Load Time:** ${report.metrics.navigationTime}ms` : ''}
${report.metrics.heroLoadTime ? `- **Hero Section Load:** ${report.metrics.heroLoadTime}ms` : ''}
${report.metrics.productCardCount ? `- **Products Displayed:** ${report.metrics.productCardCount}` : ''}
${report.metrics.testimonialCount ? `- **Testimonials:** ${report.metrics.testimonialCount}` : ''}

## 📸 Screenshots Captured

${report.screenshots.map(s => `- **${s.filename}:** ${s.description}`).join('\n')}

## ⚠️ Issues Found

${report.issues.length > 0 ? report.issues.map(issue => 
  `- **${issue.type.toUpperCase()}:** ${issue.message}${issue.section ? ` (Section: ${issue.section})` : ''}`
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
*Report generated by Tishya Foods UX Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runHomepageUXAnalysis() {
  const analyzer = new HomepageUXAnalyzer();
  
  try {
    await analyzer.initialize();
    await analyzer.analyzeHomepage();
    const report = await analyzer.generateReport();
    
    console.log('\n🎉 Homepage UX Analysis Complete!');
    console.log('📊 Overall Score:', report.summary.overallScore + '/100');
    console.log('📁 Results saved to:', analyzer.screenshotDir);
    
    return report;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  } finally {
    await analyzer.cleanup();
  }
}

// Export for use in other modules
module.exports = { HomepageUXAnalyzer, runHomepageUXAnalysis };

// Run if called directly
if (require.main === module) {
  runHomepageUXAnalysis()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}