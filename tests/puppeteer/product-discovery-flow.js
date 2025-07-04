/**
 * Product Discovery Flow Testing - Issue #3
 * Test and analyze complete product discovery user journey
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ProductDiscoveryFlowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: [],
      flowSteps: []
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/product-discovery');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('🚀 Initializing Product Discovery Flow Testing...');
    
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

  async testProductDiscoveryFlow() {
    console.log('📊 Starting Product Discovery Flow Analysis...');
    
    try {
      // Step 1: Start from homepage
      await this.testHomepageToProducts();
      
      // Step 2: Test product page navigation and filters
      await this.testProductPageInteractions();
      
      // Step 3: Test product search functionality
      await this.testProductSearch();
      
      // Step 4: Test product filtering and sorting
      await this.testProductFiltering();
      
      // Step 5: Test individual product interactions
      await this.testProductCardInteractions();
      
      // Step 6: Test add to cart flow
      await this.testAddToCartFlow();
      
      // Step 7: Test different view modes
      await this.testViewModes();
      
      // Step 8: Test responsive behavior
      await this.testResponsiveProductDiscovery();
      
      // Step 9: Analyze overall performance
      await this.analyzeDiscoveryPerformance();
      
      console.log('✅ Product Discovery Flow analysis completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during product discovery analysis:', error);
      this.results.issues.push({
        type: 'critical',
        step: 'flow_analysis',
        message: `Flow analysis failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testHomepageToProducts() {
    console.log('🏠 Step 1: Testing navigation from homepage to products...');
    
    const stepStart = Date.now();
    
    try {
      // Navigate to homepage first
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('homepage-start', 'Starting from homepage');
      
      // Look for products navigation link
      const productLinks = await this.page.$$('a[href*="product"], nav a, [data-testid*="product"]');
      
      if (productLinks.length > 0) {
        // Try to find the main products link
        let productLink = null;
        
        for (const link of productLinks) {
          const text = await this.page.evaluate(el => el.textContent, link);
          if (text && (text.toLowerCase().includes('product') || text.toLowerCase().includes('shop'))) {
            productLink = link;
            break;
          }
        }
        
        if (productLink) {
          await productLink.click();
          await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
        } else {
          // Navigate directly to products page
          await this.page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
        }
      } else {
        // Navigate directly to products page
        await this.page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
      }
      
      await this.takeScreenshot('products-page-loaded', 'Products page loaded');
      
      const stepEnd = Date.now();
      this.results.flowSteps.push({
        step: 'homepage_to_products',
        duration: stepEnd - stepStart,
        success: true,
        url: this.page.url()
      });
      
    } catch (error) {
      console.warn('⚠️ Homepage to products navigation issue:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'homepage_navigation',
        message: `Navigation issue: ${error.message}`
      });
    }
  }

  async testProductPageInteractions() {
    console.log('🛍️ Step 2: Testing product page interactions...');
    
    try {
      // Wait for products page to fully load
      await this.page.waitForSelector('body', { timeout: 2000 }).catch(() => {});
      
      // Check for main page elements
      const pageTitle = await this.page.$('h1');
      if (pageTitle) {
        const titleText = await this.page.evaluate(el => el.textContent, pageTitle);
        console.log(`Found page title: ${titleText}`);
      }
      
      // Check for search input
      const searchInput = await this.page.$('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
      if (searchInput) {
        this.results.metrics.hasSearchInput = true;
        await this.takeScreenshot('search-input-found', 'Search input located');
      }
      
      // Check for filter options
      const filterElements = await this.page.$$('select, button[role="button"], .filter, [data-testid*="filter"]');
      this.results.metrics.filterElementsCount = filterElements.length;
      
      // Check for product cards
      const productCards = await this.page.$$('.grid > div, [data-testid*="product"], .product-card, .product');
      this.results.metrics.initialProductCount = productCards.length;
      
      console.log(`Found ${productCards.length} product cards`);
      
      if (productCards.length > 0) {
        await this.takeScreenshot('products-grid-view', 'Products grid view');
      }
      
    } catch (error) {
      console.warn('⚠️ Product page interaction test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'product_page_interactions',
        message: `Product page interaction issue: ${error.message}`
      });
    }
  }

  async testProductSearch() {
    console.log('🔍 Step 3: Testing product search functionality...');
    
    const searchStart = Date.now();
    
    try {
      // Find search input
      const searchInput = await this.page.$('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
      
      if (searchInput) {
        // Test search functionality
        await searchInput.click();
        await searchInput.click({ clickCount: 3 });
        await searchInput.press('Backspace');
        await searchInput.type('protein');
        
        await this.takeScreenshot('search-typing', 'Typing in search box');
        
        // Wait for search results
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if results updated
        const searchResults = await this.page.$$('.grid > div, [data-testid*="product"], .product-card, .product');
        this.results.metrics.searchResultsCount = searchResults.length;
        
        await this.takeScreenshot('search-results', 'Search results for "protein"');
        
        // Test search with no results
        await searchInput.click({ clickCount: 3 });
        await searchInput.press('Backspace');
        await searchInput.type('xyz123nonexistent');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const noResults = await this.page.$('.text-center, .no-results, [data-testid*="no-results"]');
        if (noResults) {
          this.results.metrics.hasNoResultsMessage = true;
          await this.takeScreenshot('search-no-results', 'No results message');
        }
        
        // Clear search
        await searchInput.click({ clickCount: 3 });
        await searchInput.press('Backspace');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const searchEnd = Date.now();
        this.results.metrics.searchResponseTime = searchEnd - searchStart;
        
      } else {
        this.results.issues.push({
          type: 'warning',
          step: 'search_test',
          message: 'Search input not found'
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Product search test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'product_search',
        message: `Search functionality issue: ${error.message}`
      });
    }
  }

  async testProductFiltering() {
    console.log('🔧 Step 4: Testing product filtering and sorting...');
    
    try {
      // Test category filter
      const categorySelect = await this.page.$('select');
      if (categorySelect) {
        // Get initial product count
        const initialProducts = await this.page.$$('.grid > div, [data-testid*="product"], .product-card, .product');
        const initialCount = initialProducts.length;
        
        // Try to select a category
        await categorySelect.select('sweet-treats');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const filteredProducts = await this.page.$$('.grid > div, [data-testid*="product"], .product-card, .product');
        const filteredCount = filteredProducts.length;
        
        this.results.metrics.categoryFilterWorks = filteredCount !== initialCount;
        await this.takeScreenshot('category-filtered', 'Category filter applied');
        
        // Reset to all categories
        await categorySelect.select('all');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Test filter buttons (Gluten Free, Vegan, Organic)
      const filterButtons = await this.page.$$('button');
      const glutenFreeButton = await this.findButtonByText(filterButtons, 'Gluten Free');
      
      if (glutenFreeButton) {
        await glutenFreeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.takeScreenshot('gluten-free-filter', 'Gluten Free filter applied');
        
        // Click again to remove filter
        await glutenFreeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Test sorting
      const sortSelects = await this.page.$$('select');
      if (sortSelects.length >= 2) {
        const sortSelect = sortSelects[1]; // Assuming second select is sort
        await sortSelect.select('price-low');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.takeScreenshot('price-sort-low', 'Sorted by price low to high');
        
        await sortSelect.select('price-high');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.takeScreenshot('price-sort-high', 'Sorted by price high to low');
      }
      
    } catch (error) {
      console.warn('⚠️ Product filtering test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'product_filtering',
        message: `Filtering functionality issue: ${error.message}`
      });
    }
  }

  async testProductCardInteractions() {
    console.log('🛒 Step 5: Testing product card interactions...');
    
    try {
      const productCards = await this.page.$$('.grid > div, [data-testid*="product"], .product-card, .product');
      
      if (productCards.length > 0) {
        // Test hover effect on first product card
        await productCards[0].hover();
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.takeScreenshot('product-card-hover', 'Product card hover effect');
        
        // Test product card content
        const firstCard = productCards[0];
        const cardText = await this.page.evaluate(el => el.textContent, firstCard);
        
        // Check if card has essential elements
        this.results.metrics.productCardHasPrice = cardText.includes('₹') || cardText.includes('$');
        this.results.metrics.productCardHasName = cardText.length > 10;
        
        // Look for Add to Cart button
        const addToCartButtons = await firstCard.$$('button');
        for (const button of addToCartButtons) {
          const buttonText = await this.page.evaluate(el => el.textContent, button);
          if (buttonText && buttonText.toLowerCase().includes('cart')) {
            this.results.metrics.hasAddToCartButton = true;
            break;
          }
        }
        
      }
      
    } catch (error) {
      console.warn('⚠️ Product card interaction test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'product_card_interactions',
        message: `Product card interaction issue: ${error.message}`
      });
    }
  }

  async testAddToCartFlow() {
    console.log('🛒 Step 6: Testing add to cart flow...');
    
    try {
      const productCards = await this.page.$$('.grid > div, [data-testid*="product"], .product-card, .product');
      
      if (productCards.length > 0) {
        const firstCard = productCards[0];
        
        // Look for Add to Cart button
        const buttons = await firstCard.$$('button');
        let addToCartButton = null;
        
        for (const button of buttons) {
          const buttonText = await this.page.evaluate(el => el.textContent, button);
          if (buttonText && buttonText.toLowerCase().includes('cart')) {
            addToCartButton = button;
            break;
          }
        }
        
        if (addToCartButton) {
          // Click Add to Cart
          await addToCartButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await this.takeScreenshot('add-to-cart-clicked', 'Add to cart button clicked');
          
          // Check if cart indicator updated or notification appeared
          const cartIndicators = await this.page.$$('[data-testid*="cart"], .cart-count, .cart-badge');
          if (cartIndicators.length > 0) {
            this.results.metrics.cartIndicatorExists = true;
          }
          
          // Look for success message or notification
          const notifications = await this.page.$$('.notification, .toast, .alert, [role="alert"]');
          if (notifications.length > 0) {
            this.results.metrics.hasAddToCartFeedback = true;
            await this.takeScreenshot('cart-feedback', 'Add to cart feedback');
          }
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Add to cart test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'add_to_cart',
        message: `Add to cart flow issue: ${error.message}`
      });
    }
  }

  async testViewModes() {
    console.log('👁️ Step 7: Testing view modes (grid/list)...');
    
    try {
      // Look for view mode toggle buttons
      const viewButtons = await this.page.$$('button[data-testid*="view"], button svg, .view-toggle');
      
      if (viewButtons.length >= 2) {
        // Try list view
        await viewButtons[1].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.takeScreenshot('list-view-mode', 'List view mode');
        
        // Switch back to grid view
        await viewButtons[0].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.takeScreenshot('grid-view-mode', 'Grid view mode');
        
        this.results.metrics.hasViewModeToggle = true;
      }
      
    } catch (error) {
      console.warn('⚠️ View modes test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'view_modes',
        message: `View modes issue: ${error.message}`
      });
    }
  }

  async testResponsiveProductDiscovery() {
    console.log('📱 Step 8: Testing responsive product discovery...');
    
    try {
      // Test mobile view
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      await this.takeScreenshot('mobile-products-page', 'Products page on mobile');
      
      // Test search on mobile
      const mobileSearchInput = await this.page.$('input[type="text"]');
      if (mobileSearchInput) {
        await mobileSearchInput.click();
        await this.takeScreenshot('mobile-search-focus', 'Mobile search input focused');
      }
      
      // Test tablet view
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      await this.takeScreenshot('tablet-products-page', 'Products page on tablet');
      
      // Reset to desktop view
      await this.page.setViewport({ width: 1200, height: 800 });
      
    } catch (error) {
      console.warn('⚠️ Responsive test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'responsive_discovery',
        message: `Responsive discovery issue: ${error.message}`
      });
    }
  }

  async analyzeDiscoveryPerformance() {
    console.log('⚡ Step 9: Analyzing discovery performance...');
    
    try {
      // Navigate back to products page
      await this.page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
      
      // Measure performance metrics
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
      
      // Count final elements
      const finalProductCount = await this.page.$$eval('.grid > div, [data-testid*="product"], .product-card, .product', 
        elements => elements.length);
      this.results.metrics.finalProductCount = finalProductCount;
      
      // Check for essential UX elements
      const hasSearch = await this.page.$('input[type="text"]') !== null;
      const hasFilters = await this.page.$$('select, button').then(btns => btns.length > 0);
      const hasSort = await this.page.$$('select').then(selects => selects.length >= 2);
      
      this.results.metrics.discoveryFeatures = {
        hasSearch,
        hasFilters,
        hasSort,
        productCount: finalProductCount
      };
      
    } catch (error) {
      console.warn('⚠️ Performance analysis warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        step: 'performance_analysis',
        message: `Performance analysis issue: ${error.message}`
      });
    }
  }

  async findButtonByText(buttons, text) {
    for (const button of buttons) {
      const buttonText = await this.page.evaluate(el => el.textContent, button);
      if (buttonText && buttonText.includes(text)) {
        return button;
      }
    }
    return null;
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
    console.log('💡 Generating product discovery recommendations...');
    
    const recommendations = [];
    
    // Search functionality recommendations
    if (!this.results.metrics.hasSearchInput) {
      recommendations.push({
        category: 'Search',
        priority: 'High',
        issue: 'Missing search functionality',
        recommendation: 'Add a prominent search input field for product discovery',
        metric: 'Search input: Not found'
      });
    }
    
    if (this.results.metrics.searchResponseTime > 2000) {
      recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: 'Slow search response',
        recommendation: 'Optimize search performance with debouncing and efficient filtering',
        metric: `Search response: ${this.results.metrics.searchResponseTime}ms`
      });
    }
    
    // Product count recommendations
    if (this.results.metrics.initialProductCount < 4) {
      recommendations.push({
        category: 'Content',
        priority: 'Medium',
        issue: 'Low product count',
        recommendation: 'Display more products to improve discovery options',
        metric: `Products shown: ${this.results.metrics.initialProductCount}`
      });
    }
    
    // Filter functionality recommendations
    if (this.results.metrics.filterElementsCount < 3) {
      recommendations.push({
        category: 'Filtering',
        priority: 'Medium',
        issue: 'Limited filtering options',
        recommendation: 'Add more filter options (price range, ratings, dietary preferences)',
        metric: `Filter elements: ${this.results.metrics.filterElementsCount}`
      });
    }
    
    // Add to cart recommendations
    if (!this.results.metrics.hasAddToCartButton) {
      recommendations.push({
        category: 'E-commerce',
        priority: 'High',
        issue: 'Missing add to cart functionality',
        recommendation: 'Ensure all product cards have visible "Add to Cart" buttons',
        metric: 'Add to cart: Not found'
      });
    }
    
    if (!this.results.metrics.hasAddToCartFeedback) {
      recommendations.push({
        category: 'UX Feedback',
        priority: 'Medium',
        issue: 'No add to cart feedback',
        recommendation: 'Add visual feedback when items are added to cart',
        metric: 'Cart feedback: Missing'
      });
    }
    
    // View mode recommendations
    if (!this.results.metrics.hasViewModeToggle) {
      recommendations.push({
        category: 'Display Options',
        priority: 'Low',
        issue: 'Missing view mode options',
        recommendation: 'Add grid/list view toggle for better user preference support',
        metric: 'View modes: Not available'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating product discovery analysis report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Product Discovery Flow Analysis Report',
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000/products',
      summary: {
        totalScreenshots: this.results.screenshots.length,
        totalIssues: this.results.issues.length,
        totalRecommendations: this.results.recommendations.length,
        flowStepsCompleted: this.results.flowSteps.length,
        overallScore: this.calculateOverallScore()
      },
      metrics: this.results.metrics,
      flowSteps: this.results.flowSteps,
      screenshots: this.results.screenshots,
      issues: this.results.issues,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Implement high-priority recommendations',
        'Optimize search and filtering performance',
        'Enhance add to cart feedback',
        'Add advanced filtering options'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'product-discovery-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'product-discovery-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // Deduct points for missing features
    if (!this.results.metrics.hasSearchInput) score -= 20;
    if (!this.results.metrics.hasAddToCartButton) score -= 25;
    if (!this.results.metrics.categoryFilterWorks) score -= 15;
    if (!this.results.metrics.hasAddToCartFeedback) score -= 10;
    if (!this.results.metrics.hasViewModeToggle) score -= 5;
    
    // Deduct points for issues
    score -= this.results.issues.filter(i => i.type === 'critical').length * 20;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 5;
    
    // Performance penalties
    if (this.results.metrics.searchResponseTime > 2000) score -= 10;
    
    return Math.max(0, score);
  }

  generateMarkdownReport(report) {
    return `# Product Discovery Flow Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Flow Steps Completed:** ${report.summary.flowStepsCompleted}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}

## 🔄 Flow Steps Analysis

${report.flowSteps.map(step => 
  `### ${step.step.replace(/_/g, ' ').toUpperCase()}
- **Duration:** ${step.duration}ms
- **Status:** ${step.success ? '✅ Success' : '❌ Failed'}
- **URL:** ${step.url || 'N/A'}
`).join('\n')}

## ⚡ Performance Metrics

${report.metrics.performance ? `
- **Page Load Time:** ${report.metrics.performance.totalLoadTime}ms
- **DOM Content Loaded:** ${report.metrics.performance.domContentLoaded}ms
- **First Paint:** ${report.metrics.performance.firstPaint}ms
` : ''}

- **Initial Product Count:** ${report.metrics.initialProductCount || 0}
- **Search Response Time:** ${report.metrics.searchResponseTime || 'N/A'}ms
- **Filter Elements:** ${report.metrics.filterElementsCount || 0}

## 🎯 Discovery Features Status

| Feature | Status |
|---------|--------|
| Search Input | ${report.metrics.hasSearchInput ? '✅ Available' : '❌ Missing'} |
| Product Filtering | ${report.metrics.categoryFilterWorks ? '✅ Working' : '❌ Not Working'} |
| Add to Cart | ${report.metrics.hasAddToCartButton ? '✅ Available' : '❌ Missing'} |
| Cart Feedback | ${report.metrics.hasAddToCartFeedback ? '✅ Available' : '❌ Missing'} |
| View Modes | ${report.metrics.hasViewModeToggle ? '✅ Available' : '❌ Missing'} |

## 📸 Screenshots Captured

${report.screenshots.map(s => `- **${s.filename}:** ${s.description}`).join('\n')}

## ⚠️ Issues Found

${report.issues.length > 0 ? report.issues.map(issue => 
  `- **${issue.type.toUpperCase()}:** ${issue.message}${issue.step ? ` (Step: ${issue.step})` : ''}`
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
*Report generated by Tishya Foods Product Discovery Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runProductDiscoveryFlowTest() {
  const tester = new ProductDiscoveryFlowTester();
  
  try {
    await tester.initialize();
    await tester.testProductDiscoveryFlow();
    const report = await tester.generateReport();
    
    console.log('\n🎉 Product Discovery Flow Analysis Complete!');
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
module.exports = { ProductDiscoveryFlowTester, runProductDiscoveryFlowTest };

// Run if called directly
if (require.main === module) {
  runProductDiscoveryFlowTest()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}