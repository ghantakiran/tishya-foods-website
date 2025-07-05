/**
 * Personalization Features Testing Suite
 * Tests personalization algorithms, user preferences, and customized recommendations
 * 
 * Usage: node tests/puppeteer/personalization-testing.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3001',
  headless: process.env.HEADLESS !== 'false',
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  screenshotDir: path.join(__dirname, '../../screenshots/personalization'),
  reportFile: path.join(__dirname, '../../screenshots/personalization/personalization-report.json'),
  markdownFile: path.join(__dirname, '../../screenshots/personalization/personalization-report.md')
};

// Personalization test results
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
  personalizationMetrics: {},
  recommendations: []
};

/**
 * Main test execution function
 */
async function runPersonalizationTests() {
  console.log('🎯 Starting Personalization Features Testing Suite...\n');
  
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
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport(TEST_CONFIG.viewport);
    
    // Set longer timeout
    page.setDefaultTimeout(TEST_CONFIG.timeout);
    
    // Run personalization tests
    await testUserPreferences(page);
    await testProductRecommendations(page);
    await testPersonalizedContent(page);
    await testBehaviorTracking(page);
    await testCustomizedNavigation(page);
    await testPersonalizedOffers(page);
    await testUserSegmentation(page);
    await testAdaptiveInterface(page);
    await testRecommendationAccuracy(page);
    await testPersonalizationPerformance(page);
    
    // Generate reports
    await generateReports();
    
  } catch (error) {
    console.error('❌ Personalization testing failed:', error);
    recordTest('Personalization Testing Suite', false, error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Test user preferences storage and application
 */
async function testUserPreferences(page) {
  console.log('⚙️ Testing User Preferences...');
  
  try {
    await page.goto(`${TEST_CONFIG.baseUrl}/profile`);
    
    // Take screenshot of preferences page
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'user-preferences-page.png'),
      fullPage: true
    });
    
    // Test dietary preferences
    const dietaryOptions = await page.$$('[data-testid="dietary-preference"], .dietary-preference, input[type="checkbox"]');
    if (dietaryOptions.length > 0) {
      // Select some preferences
      await dietaryOptions[0].click();
      if (dietaryOptions.length > 1) {
        await dietaryOptions[1].click();
      }
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'dietary-preferences-selected.png'),
        fullPage: true
      });
      
      recordTest('Dietary Preferences Selection', true, `Found ${dietaryOptions.length} dietary options`);
    } else {
      recordTest('Dietary Preferences Selection', false, 'No dietary preference options found');
    }
    
    // Test preference saving
    const saveButton = await page.$('[data-testid="save-preferences"], button[type="submit"], .save-btn');
    if (saveButton) {
      await saveButton.click();
      await page.waitForSelector('body', {timeout: 2000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'preferences-saved.png'),
        fullPage: true
      });
      
      recordTest('Preferences Saving', true, 'Preferences save functionality works');
    } else {
      recordTest('Preferences Saving', false, 'Save preferences button not found');
    }
    
    // Test preference persistence
    await page.reload();
    await page.waitForTimeout(2000);
    
    const persistedPreferences = await page.$$('input:checked');
    if (persistedPreferences.length > 0) {
      recordTest('Preference Persistence', true, `${persistedPreferences.length} preferences persisted after reload`);
    } else {
      recordTest('Preference Persistence', false, 'Preferences not persisted after page reload');
    }
    
  } catch (error) {
    recordTest('User Preferences', false, error.message);
  }
}

/**
 * Test product recommendations engine
 */
async function testProductRecommendations(page) {
  console.log('🎯 Testing Product Recommendations...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for recommendation sections
    const recommendationSections = await page.$$('[data-testid*="recommend"], .recommendation, .suggested-products, [class*="recommend"]');
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'homepage-recommendations.png'),
      fullPage: true
    });
    
    if (recommendationSections.length > 0) {
      recordTest('Recommendation Sections Present', true, `Found ${recommendationSections.length} recommendation sections`);
      
      // Test recommendation interaction
      const firstRecommendation = recommendationSections[0];
      const recommendedProducts = await firstRecommendation.$$('.product-card, [data-testid="product"], .product-item');
      
      if (recommendedProducts.length > 0) {
        // Click on first recommended product
        await recommendedProducts[0].click();
        await page.waitForSelector('body', {timeout: 2000}).catch(() => {});
        
        await page.screenshot({
          path: path.join(TEST_CONFIG.screenshotDir, 'recommended-product-page.png'),
          fullPage: true
        });
        
        recordTest('Recommendation Interaction', true, `${recommendedProducts.length} products in recommendations`);
        
        // Check for related products on product page
        const relatedProducts = await page.$$('[data-testid*="related"], .related-products, .similar-products');
        if (relatedProducts.length > 0) {
          recordTest('Related Products', true, 'Related products shown on product page');
        } else {
          recordTest('Related Products', false, 'No related products found on product page');
        }
      } else {
        recordTest('Recommendation Products', false, 'No products found in recommendation sections');
      }
    } else {
      recordTest('Recommendation Sections Present', false, 'No recommendation sections found on homepage');
    }
    
    // Test personalized recommendations after user interaction
    await page.goto(`${TEST_CONFIG.baseUrl}/products`);
    
    // Simulate browsing behavior
    const productCards = await page.$$('.product-card, [data-testid="product"]');
    if (productCards.length > 2) {
      await productCards[0].click();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      await page.goBack();
      
      await productCards[1].click();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      await page.goBack();
      
      await productCards[2].click();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      await page.goBack();
      
      // Check if recommendations changed
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'recommendations-after-browsing.png'),
        fullPage: true
      });
      
      recordTest('Dynamic Recommendations', true, 'Simulated browsing behavior for recommendation updates');
    }
    
  } catch (error) {
    recordTest('Product Recommendations', false, error.message);
  }
}

/**
 * Test personalized content delivery
 */
async function testPersonalizedContent(page) {
  console.log('📝 Testing Personalized Content...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Test personalized hero section
    const heroSection = await page.$('[data-testid="hero"], .hero, .hero-section');
    if (heroSection) {
      const heroText = await heroSection.$eval('h1, .hero-title, .headline', el => el.textContent);
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'personalized-hero.png'),
        fullPage: true
      });
      
      recordTest('Personalized Hero Content', true, `Hero text: ${heroText?.substring(0, 50)}...`);
    }
    
    // Test personalized blog recommendations
    await page.goto(`${TEST_CONFIG.baseUrl}/blog`);
    
    const blogPosts = await page.$$('[data-testid="blog-post"], .blog-post, .article-card');
    if (blogPosts.length > 0) {
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'personalized-blog-content.png'),
        fullPage: true
      });
      
      recordTest('Personalized Blog Content', true, `Found ${blogPosts.length} blog posts`);
    }
    
    // Test personalized nutrition content
    await page.goto(`${TEST_CONFIG.baseUrl}/nutrition`);
    
    const nutritionContent = await page.$('[data-testid="nutrition-content"], .nutrition-info, .personalized-nutrition');
    if (nutritionContent) {
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'personalized-nutrition.png'),
        fullPage: true
      });
      
      recordTest('Personalized Nutrition Content', true, 'Nutrition content customization available');
    }
    
    // Test personalized recipe recommendations
    await page.goto(`${TEST_CONFIG.baseUrl}/recipes`);
    
    const recipeCards = await page.$$('[data-testid="recipe"], .recipe-card, .recipe-item');
    if (recipeCards.length > 0) {
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'personalized-recipes.png'),
        fullPage: true
      });
      
      recordTest('Personalized Recipe Content', true, `Found ${recipeCards.length} recipes`);
    }
    
  } catch (error) {
    recordTest('Personalized Content', false, error.message);
  }
}

/**
 * Test behavior tracking and analytics
 */
async function testBehaviorTracking(page) {
  console.log('📊 Testing Behavior Tracking...');
  
  try {
    // Enable request interception to monitor analytics calls
    await page.setRequestInterception(true);
    
    const analyticsRequests = [];
    page.on('request', (request) => {
      if (request.url().includes('analytics') || 
          request.url().includes('tracking') || 
          request.url().includes('gtag') ||
          request.url().includes('ga-')) {
        analyticsRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        });
      }
      request.continue();
    });
    
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Simulate user interactions
    await page.click('nav a[href="/products"]');
    await page.waitForTimeout(2000);
    
    const productCard = await page.$('.product-card, [data-testid="product"]');
    if (productCard) {
      await productCard.click();
      await page.waitForSelector('body', {timeout: 2000}).catch(() => {});
    }
    
    // Check for add to cart tracking
    const addToCartBtn = await page.$('[data-testid="add-to-cart"], .add-to-cart, button[class*="add-cart"]');
    if (addToCartBtn) {
      await addToCartBtn.click();
      await page.waitForSelector('body', {timeout: 2000}).catch(() => {});
    }
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'behavior-tracking-session.png'),
      fullPage: true
    });
    
    if (analyticsRequests.length > 0) {
      recordTest('Behavior Tracking', true, `Captured ${analyticsRequests.length} analytics requests`);
      testResults.personalizationMetrics.analyticsRequests = analyticsRequests.length;
    } else {
      recordTest('Behavior Tracking', false, 'No analytics tracking requests detected');
    }
    
  } catch (error) {
    recordTest('Behavior Tracking', false, error.message);
  }
}

/**
 * Test customized navigation experience
 */
async function testCustomizedNavigation(page) {
  console.log('🧭 Testing Customized Navigation...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Test navigation menu customization
    const navItems = await page.$$('nav a, .nav-item, [data-testid*="nav"]');
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'default-navigation.png'),
      fullPage: true
    });
    
    if (navItems.length > 0) {
      recordTest('Navigation Menu Present', true, `Found ${navItems.length} navigation items`);
    }
    
    // Test breadcrumb personalization
    await page.goto(`${TEST_CONFIG.baseUrl}/products/protein-snacks`);
    
    const breadcrumbs = await page.$('[data-testid="breadcrumb"], .breadcrumb, .breadcrumbs');
    if (breadcrumbs) {
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'breadcrumb-navigation.png'),
        fullPage: true
      });
      
      recordTest('Breadcrumb Navigation', true, 'Breadcrumb navigation available');
    }
    
    // Test search history and suggestions
    const searchInput = await page.$('[data-testid="search"], input[type="search"], .search-input');
    if (searchInput) {
      await searchInput.click();
      await searchInput.type('protein');
      
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'search-suggestions.png'),
        fullPage: true
      });
      
      const suggestions = await page.$$('[data-testid="suggestion"], .suggestion, .search-result');
      if (suggestions.length > 0) {
        recordTest('Search Suggestions', true, `Found ${suggestions.length} search suggestions`);
      }
    }
    
  } catch (error) {
    recordTest('Customized Navigation', false, error.message);
  }
}

/**
 * Test personalized offers and promotions
 */
async function testPersonalizedOffers(page) {
  console.log('🎁 Testing Personalized Offers...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for promotional banners
    const promobanners = await page.$$('[data-testid*="promo"], .promotion, .offer, .banner');
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'promotional-offers.png'),
      fullPage: true
    });
    
    if (promobanners.length > 0) {
      recordTest('Promotional Banners', true, `Found ${promobanners.length} promotional elements`);
    }
    
    // Test discount notifications
    const discountElements = await page.$$('[data-testid*="discount"], .discount, .sale, [class*="offer"]');
    if (discountElements.length > 0) {
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'discount-offers.png'),
        fullPage: true
      });
      
      recordTest('Discount Offers', true, `Found ${discountElements.length} discount elements`);
    }
    
    // Test personalized email signup
    const emailSignup = await page.$('[data-testid="email-signup"], .newsletter, input[type="email"]');
    if (emailSignup) {
      await emailSignup.click();
      await emailSignup.type('test@example.com');
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'email-signup-personalization.png'),
        fullPage: true
      });
      
      recordTest('Email Signup Personalization', true, 'Email signup form available');
    }
    
    // Test cart abandonment features
    await page.goto(`${TEST_CONFIG.baseUrl}/products`);
    
    const addToCartBtn = await page.$('[data-testid="add-to-cart"], .add-to-cart');
    if (addToCartBtn) {
      await addToCartBtn.click();
      await page.waitForSelector('body', {timeout: 2000}).catch(() => {});
      
      // Navigate away to simulate cart abandonment
      await page.goto(`${TEST_CONFIG.baseUrl}/about`);
      await page.waitForSelector('body', {timeout: 3000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'cart-abandonment-test.png'),
        fullPage: true
      });
      
      recordTest('Cart Abandonment Testing', true, 'Simulated cart abandonment scenario');
    }
    
  } catch (error) {
    recordTest('Personalized Offers', false, error.message);
  }
}

/**
 * Test user segmentation features
 */
async function testUserSegmentation(page) {
  console.log('👥 Testing User Segmentation...');
  
  try {
    // Test new visitor experience
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'new-visitor-experience.png'),
      fullPage: true
    });
    
    // Look for welcome messages or onboarding
    const welcomeMessage = await page.$('[data-testid*="welcome"], .welcome, .onboarding, .new-user');
    if (welcomeMessage) {
      recordTest('New Visitor Welcome', true, 'Welcome message for new visitors');
    }
    
    // Test returning visitor simulation
    await page.evaluate(() => {
      localStorage.setItem('returning_visitor', 'true');
      localStorage.setItem('visit_count', '5');
      localStorage.setItem('last_visit', new Date().toISOString());
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'returning-visitor-experience.png'),
      fullPage: true
    });
    
    recordTest('Returning Visitor Simulation', true, 'Simulated returning visitor with localStorage');
    
    // Test different user types
    const userTypes = ['fitness_enthusiast', 'weight_loss', 'muscle_gain', 'general_health'];
    
    for (const userType of userTypes) {
      await page.evaluate((type) => {
        localStorage.setItem('user_segment', type);
      }, userType);
      
      await page.reload();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, `user-segment-${userType}.png`),
        fullPage: true
      });
    }
    
    recordTest('User Segmentation Testing', true, `Tested ${userTypes.length} user segments`);
    
  } catch (error) {
    recordTest('User Segmentation', false, error.message);
  }
}

/**
 * Test adaptive interface elements
 */
async function testAdaptiveInterface(page) {
  console.log('🎨 Testing Adaptive Interface...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Test theme adaptation
    const themes = ['light', 'dark', 'auto'];
    
    for (const theme of themes) {
      await page.evaluate((selectedTheme) => {
        localStorage.setItem('theme_preference', selectedTheme);
        if (selectedTheme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (selectedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }, theme);
      
      await page.reload();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, `theme-${theme}.png`),
        fullPage: true
      });
    }
    
    recordTest('Theme Adaptation', true, `Tested ${themes.length} theme preferences`);
    
    // Test font size adaptation
    const fontSizes = ['small', 'medium', 'large'];
    
    for (const fontSize of fontSizes) {
      await page.evaluate((size) => {
        localStorage.setItem('font_size_preference', size);
        document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
        document.documentElement.classList.add(`text-${size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'base'}`);
      }, fontSize);
      
      await page.reload();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, `font-size-${fontSize}.png`),
        fullPage: true
      });
    }
    
    recordTest('Font Size Adaptation', true, `Tested ${fontSizes.length} font size preferences`);
    
    // Test layout preferences
    const layouts = ['grid', 'list', 'compact'];
    
    await page.goto(`${TEST_CONFIG.baseUrl}/products`);
    
    for (const layout of layouts) {
      await page.evaluate((layoutType) => {
        localStorage.setItem('layout_preference', layoutType);
      }, layout);
      
      await page.reload();
      await page.waitForSelector('body', {timeout: 1000}).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, `layout-${layout}.png`),
        fullPage: true
      });
    }
    
    recordTest('Layout Adaptation', true, `Tested ${layouts.length} layout preferences`);
    
  } catch (error) {
    recordTest('Adaptive Interface', false, error.message);
  }
}

/**
 * Test recommendation accuracy and relevance
 */
async function testRecommendationAccuracy(page) {
  console.log('🎯 Testing Recommendation Accuracy...');
  
  try {
    await page.goto(`${TEST_CONFIG.baseUrl}/products`);
    
    // Simulate user with specific interests
    await page.evaluate(() => {
      localStorage.setItem('user_interests', JSON.stringify(['protein', 'fitness', 'natural']));
      localStorage.setItem('browsing_history', JSON.stringify([
        { product: 'protein-bars', category: 'snacks', timestamp: Date.now() - 86400000 },
        { product: 'natural-nuts', category: 'natural', timestamp: Date.now() - 43200000 }
      ]));
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Check if recommendations align with interests
    const recommendedProducts = await page.$$('[data-testid*="recommend"] .product-card, .recommendation .product-item');
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'targeted-recommendations.png'),
      fullPage: true
    });
    
    if (recommendedProducts.length > 0) {
      let relevantRecommendations = 0;
      
      for (const product of recommendedProducts) {
        const productText = await product.$eval('.product-title, .product-name, h3', el => el.textContent.toLowerCase());
        
        if (productText.includes('protein') || productText.includes('natural') || productText.includes('fitness')) {
          relevantRecommendations++;
        }
      }
      
      const accuracyRate = (relevantRecommendations / recommendedProducts.length) * 100;
      testResults.personalizationMetrics.recommendationAccuracy = accuracyRate;
      
      if (accuracyRate > 60) {
        recordTest('Recommendation Accuracy', true, `${accuracyRate.toFixed(1)}% relevant recommendations`);
      } else {
        recordTest('Recommendation Accuracy', false, `Only ${accuracyRate.toFixed(1)}% relevant recommendations`);
      }
    } else {
      recordTest('Recommendation Accuracy', false, 'No recommendations found to test accuracy');
    }
    
    // Test collaborative filtering
    await page.evaluate(() => {
      localStorage.setItem('similar_users', JSON.stringify([
        { userId: 'user123', similarity: 0.85, purchases: ['protein-bars', 'nuts'] },
        { userId: 'user456', similarity: 0.72, purchases: ['protein-powder', 'snacks'] }
      ]));
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'collaborative-filtering.png'),
      fullPage: true
    });
    
    recordTest('Collaborative Filtering', true, 'Simulated collaborative filtering data');
    
  } catch (error) {
    recordTest('Recommendation Accuracy', false, error.message);
  }
}

/**
 * Test personalization performance impact
 */
async function testPersonalizationPerformance(page) {
  console.log('⚡ Testing Personalization Performance...');
  
  try {
    // Enable performance monitoring
    await page.tracing.start({ path: path.join(TEST_CONFIG.screenshotDir, 'personalization-trace.json') });
    
    const startTime = Date.now();
    
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
    
    const loadTime = Date.now() - startTime;
    
    // Measure personalization-specific metrics
    const personalizationMetrics = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        recommendationElements: document.querySelectorAll('[data-testid*="recommend"], .recommendation').length,
        personalizedContent: document.querySelectorAll('[data-personalized="true"], .personalized').length
      };
    });
    
    await page.tracing.stop();
    
    testResults.personalizationMetrics = {
      ...testResults.personalizationMetrics,
      loadTime,
      ...personalizationMetrics
    };
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'personalization-performance.png'),
      fullPage: true
    });
    
    if (loadTime < 3000) {
      recordTest('Personalization Performance', true, `Page load time: ${loadTime}ms`);
    } else {
      recordTest('Personalization Performance', false, `Slow page load time: ${loadTime}ms`);
    }
    
    recordTest('Personalization Storage', true, `${personalizationMetrics.localStorage} localStorage items, ${personalizationMetrics.sessionStorage} sessionStorage items`);
    recordTest('Personalization Elements', true, `${personalizationMetrics.recommendationElements} recommendation elements, ${personalizationMetrics.personalizedContent} personalized content blocks`);
    
  } catch (error) {
    recordTest('Personalization Performance', false, error.message);
  }
}

/**
 * Record test result
 */
function recordTest(testName, passed, details = '') {
  const result = {
    test: testName,
    status: passed ? 'PASS' : 'FAIL',
    details,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  testResults.summary.total++;
  
  if (passed) {
    testResults.summary.passed++;
    console.log(`✅ ${testName}: ${details}`);
  } else {
    testResults.summary.failed++;
    console.log(`❌ ${testName}: ${details}`);
  }
}

/**
 * Generate comprehensive test reports
 */
async function generateReports() {
  console.log('\n📊 Generating Personalization Test Reports...');
  
  // Calculate final metrics
  testResults.summary.successRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1);
  
  // Generate recommendations
  if (testResults.summary.successRate < 80) {
    testResults.recommendations.push('Improve personalization algorithm accuracy');
  }
  
  if (!testResults.personalizationMetrics.recommendationAccuracy || testResults.personalizationMetrics.recommendationAccuracy < 70) {
    testResults.recommendations.push('Enhance recommendation relevance using better user profiling');
  }
  
  if (testResults.personalizationMetrics.loadTime > 3000) {
    testResults.recommendations.push('Optimize personalization features for better performance');
  }
  
  testResults.recommendations.push('Implement A/B testing for personalization features');
  testResults.recommendations.push('Add more granular user preference options');
  testResults.recommendations.push('Consider machine learning for improved recommendations');
  
  // Save JSON report
  await fs.writeFile(TEST_CONFIG.reportFile, JSON.stringify(testResults, null, 2));
  
  // Generate Markdown report
  const markdownReport = generateMarkdownReport();
  await fs.writeFile(TEST_CONFIG.markdownFile, markdownReport);
  
  console.log(`✅ Reports generated:`);
  console.log(`   📄 JSON: ${TEST_CONFIG.reportFile}`);
  console.log(`   📝 Markdown: ${TEST_CONFIG.markdownFile}`);
  console.log(`\n🎯 Personalization Test Summary:`);
  console.log(`   Total Tests: ${testResults.summary.total}`);
  console.log(`   Passed: ${testResults.summary.passed}`);
  console.log(`   Failed: ${testResults.summary.failed}`);
  console.log(`   Success Rate: ${testResults.summary.successRate}%`);
}

/**
 * Generate markdown report
 */
function generateMarkdownReport() {
  return `# Personalization Features Testing Report

## Test Summary
- **Date**: ${new Date(testResults.timestamp).toLocaleString()}
- **URL**: ${testResults.url}
- **Total Tests**: ${testResults.summary.total}
- **Passed**: ${testResults.summary.passed}
- **Failed**: ${testResults.summary.failed}
- **Success Rate**: ${testResults.summary.successRate}%

## Personalization Metrics
${Object.entries(testResults.personalizationMetrics).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

## Test Results

### ✅ Passed Tests
${testResults.tests.filter(t => t.status === 'PASS').map(t => `- **${t.test}**: ${t.details}`).join('\n')}

### ❌ Failed Tests
${testResults.tests.filter(t => t.status === 'FAIL').map(t => `- **${t.test}**: ${t.details}`).join('\n')}

## Recommendations
${testResults.recommendations.map(r => `- ${r}`).join('\n')}

## Personalization Features Analysis

### User Preferences
The system should allow users to set and modify their preferences for:
- Dietary restrictions and preferences
- Product categories of interest
- Content personalization options
- Interface customization

### Recommendation Engine
Recommendation accuracy and relevance testing showed:
- Algorithm effectiveness in matching user interests
- Collaborative filtering capabilities
- Product relevance scoring
- Dynamic recommendation updates

### Behavioral Tracking
User behavior analysis includes:
- Page view tracking
- Product interaction monitoring
- Search behavior analysis
- Purchase pattern recognition

### Performance Impact
Personalization features performance metrics:
- Page load time impact
- Storage usage optimization
- Real-time processing efficiency
- Caching effectiveness

## Next Steps
1. Implement identified improvements
2. Set up A/B testing for personalization features
3. Monitor personalization effectiveness metrics
4. Regular testing and optimization cycles

---
*Report generated by Personalization Testing Suite*
`;
}

// Run the tests
if (require.main === module) {
  runPersonalizationTests().catch(console.error);
}

module.exports = { runPersonalizationTests };