/**
 * Trust Signals & Social Proof Testing Suite
 * Tests and optimizes trust signals and social proof elements to increase customer confidence
 * 
 * Usage: node tests/puppeteer/trust-signals-testing.js
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
  screenshotDir: path.join(__dirname, '../../screenshots/trust-signals'),
  reportFile: path.join(__dirname, '../../screenshots/trust-signals/trust-signals-report.json'),
  markdownFile: path.join(__dirname, '../../screenshots/trust-signals/trust-signals-report.md')
};

// Trust signals test results
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
  trustMetrics: {},
  recommendations: []
};

/**
 * Main test execution function
 */
async function runTrustSignalsTests() {
  console.log('🛡️ Starting Trust Signals & Social Proof Testing Suite...\n');
  
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
    
    // Run trust signals tests
    await testCustomerTestimonials(page);
    await testSecurityBadges(page);
    await testCustomerReviews(page);
    await testSocialMediaIntegration(page);
    await testGuaranteeInfo(page);
    await testTrustIndicators(page);
    await testSocialProofElements(page);
    await testCredibilitySignals(page);
    await testReturnPolicy(page);
    await testCertifications(page);
    
    // Generate reports
    await generateReports();
    
  } catch (error) {
    console.error('❌ Trust signals testing failed:', error);
    recordTest('Trust Signals Testing Suite', false, error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Test customer testimonials display and interaction
 */
async function testCustomerTestimonials(page) {
  console.log('👥 Testing Customer Testimonials...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for testimonials section
    const testimonialsSection = await page.$('[data-testid="testimonials"], .testimonials, [class*="testimonial"]');
    const hasTestimonials = !!testimonialsSection;
    
    if (hasTestimonials) {
      await page.scrollIntoView('[data-testid="testimonials"], .testimonials, [class*="testimonial"]');
      await page.screenshot({ 
        path: path.join(TEST_CONFIG.screenshotDir, 'testimonials-section.png'),
        fullPage: false
      });
      
      // Count testimonials
      const testimonialCount = await page.$$eval(
        '[data-testid="testimonial"], .testimonial, [class*="testimonial-item"]',
        elements => elements.length
      ).catch(() => 0);
      
      recordTest('Customer Testimonials Presence', testimonialCount > 0, 
        `Found ${testimonialCount} testimonials on homepage`);
      
      // Test testimonial carousel/navigation if present
      const carouselNext = await page.$('[data-testid="testimonial-next"], .testimonial-next, [class*="next"]');
      if (carouselNext) {
        await carouselNext.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: path.join(TEST_CONFIG.screenshotDir, 'testimonials-carousel.png'),
          fullPage: false
        });
        recordTest('Testimonial Carousel', true, 'Testimonial carousel navigation working');
      } else {
        recordTest('Testimonial Carousel', false, 'No testimonial carousel found');
      }
      
      // Analyze testimonial content quality
      const testimonialData = await page.evaluate(() => {
        const testimonials = document.querySelectorAll('[data-testid="testimonial"], .testimonial, [class*="testimonial-item"]');
        return Array.from(testimonials).slice(0, 5).map(testimonial => ({
          text: testimonial.textContent?.trim().substring(0, 100) || '',
          hasAuthor: !!(testimonial.querySelector('[class*="author"], [class*="name"], .customer-name')),
          hasRating: !!(testimonial.querySelector('[class*="rating"], [class*="star"], .rating')),
          hasImage: !!(testimonial.querySelector('img'))
        }));
      });
      
      const qualityTestimonials = testimonialData.filter(t => 
        t.text.length > 20 && t.hasAuthor
      ).length;
      
      recordTest('Testimonial Quality', qualityTestimonials >= testimonialData.length / 2,
        `${qualityTestimonials}/${testimonialData.length} testimonials have good quality (author + substantial text)`);
      
      testResults.trustMetrics.testimonials = {
        count: testimonialCount,
        hasCarousel: !!carouselNext,
        qualityScore: testimonialData.length > 0 ? (qualityTestimonials / testimonialData.length) : 0,
        samples: testimonialData
      };
      
    } else {
      recordTest('Customer Testimonials Presence', false, 'No testimonials section found on homepage');
      testResults.trustMetrics.testimonials = { count: 0, hasCarousel: false, qualityScore: 0 };
    }
    
  } catch (error) {
    recordTest('Customer Testimonials Test', false, error.message);
  }
}

/**
 * Test security badges and certifications
 */
async function testSecurityBadges(page) {
  console.log('🔒 Testing Security Badges...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for security badges
    const securityBadges = await page.$$eval(
      '[data-testid="security-badge"], [class*="security"], [class*="ssl"], [class*="secure"], [alt*="secure"], [alt*="ssl"], [alt*="verified"]',
      elements => elements.map(el => ({
        type: el.tagName,
        text: el.textContent?.trim() || '',
        alt: el.alt || '',
        src: el.src || '',
        className: el.className
      }))
    ).catch(() => []);
    
    const hasSecurityBadges = securityBadges.length > 0;
    
    recordTest('Security Badges Presence', hasSecurityBadges,
      hasSecurityBadges ? `Found ${securityBadges.length} security-related elements` : 'No security badges found');
    
    if (hasSecurityBadges) {
      // Scroll to footer where security badges are typically placed
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.screenshot({ 
        path: path.join(TEST_CONFIG.screenshotDir, 'security-badges.png'),
        fullPage: false
      });
    }
    
    // Test SSL/HTTPS
    const isSecure = page.url().startsWith('https://');
    recordTest('SSL/HTTPS Security', isSecure,
      isSecure ? 'Site is served over HTTPS' : 'Site is not secure (HTTP)');
    
    // Look for specific security certifications
    const securityTypes = {
      ssl: securityBadges.filter(badge => 
        badge.text.toLowerCase().includes('ssl') || 
        badge.alt.toLowerCase().includes('ssl') ||
        badge.src.toLowerCase().includes('ssl')
      ).length,
      norton: securityBadges.filter(badge => 
        badge.text.toLowerCase().includes('norton') || 
        badge.alt.toLowerCase().includes('norton')
      ).length,
      mcafee: securityBadges.filter(badge => 
        badge.text.toLowerCase().includes('mcafee') || 
        badge.alt.toLowerCase().includes('mcafee')
      ).length,
      verified: securityBadges.filter(badge => 
        badge.text.toLowerCase().includes('verified') || 
        badge.alt.toLowerCase().includes('verified')
      ).length
    };
    
    testResults.trustMetrics.security = {
      httpsEnabled: isSecure,
      badgeCount: securityBadges.length,
      badgeTypes: securityTypes,
      badges: securityBadges
    };
    
  } catch (error) {
    recordTest('Security Badges Test', false, error.message);
  }
}

/**
 * Test customer review systems
 */
async function testCustomerReviews(page) {
  console.log('⭐ Testing Customer Reviews...');
  
  try {
    // Test reviews on product pages
    await page.goto(`${TEST_CONFIG.baseUrl}/products`);
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Find product cards and click the first one
    const productCard = await page.$('[data-testid="product-card"], .product-card, [class*="product"]');
    if (productCard) {
      await productCard.click();
      await page.waitForTimeout(2000);
      
      // Look for reviews section
      const reviewsSection = await page.$('[data-testid="customer-reviews"], [class*="review"], .reviews');
      if (reviewsSection) {
        await page.scrollIntoView('[data-testid="customer-reviews"], [class*="review"], .reviews');
        await page.screenshot({ 
          path: path.join(TEST_CONFIG.screenshotDir, 'product-reviews-section.png'),
          fullPage: false
        });
        
        // Count reviews
        const reviewCount = await page.$$eval(
          '[data-testid="customer-review"], [class*="review-item"], .review',
          elements => elements.length
        ).catch(() => 0);
        
        recordTest('Product Page Reviews', reviewCount > 0,
          `Found ${reviewCount} reviews on product page`);
        
        // Test review interaction (helpful button)
        const helpfulButton = await page.$('[data-testid="review-helpful"], [class*="helpful"], .helpful');
        if (helpfulButton) {
          await helpfulButton.click();
          await page.screenshot({ 
            path: path.join(TEST_CONFIG.screenshotDir, 'review-interaction.png'),
            fullPage: false
          });
          recordTest('Review Interaction', true, 'Review helpful button working');
        }
        
        // Analyze review quality
        const reviewData = await page.evaluate(() => {
          const reviews = document.querySelectorAll('[data-testid="customer-review"], [class*="review-item"], .review');
          return Array.from(reviews).slice(0, 5).map(review => ({
            text: review.textContent?.trim().substring(0, 150) || '',
            hasRating: !!(review.querySelector('[class*="rating"], [class*="star"], .rating')),
            hasAuthor: !!(review.querySelector('[class*="author"], [class*="name"], .reviewer')),
            hasDate: !!(review.querySelector('[class*="date"], .date, time'))
          }));
        });
        
        const qualityReviews = reviewData.filter(r => 
          r.text.length > 30 && r.hasRating && r.hasAuthor
        ).length;
        
        recordTest('Review Quality', qualityReviews >= reviewData.length / 2,
          `${qualityReviews}/${reviewData.length} reviews have good quality`);
        
        testResults.trustMetrics.reviews = {
          productPageReviews: reviewCount,
          hasInteraction: !!helpfulButton,
          qualityScore: reviewData.length > 0 ? (qualityReviews / reviewData.length) : 0,
          samples: reviewData
        };
        
      } else {
        recordTest('Product Page Reviews', false, 'No reviews section found on product page');
      }
    } else {
      recordTest('Product Page Navigation', false, 'Could not find product cards to test reviews');
    }
    
  } catch (error) {
    recordTest('Customer Reviews Test', false, error.message);
  }
}

/**
 * Test social media integration
 */
async function testSocialMediaIntegration(page) {
  console.log('📱 Testing Social Media Integration...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for social media elements
    const socialElements = await page.$$eval(
      '[data-testid="social-link"], [class*="social"], [href*="facebook"], [href*="instagram"], [href*="twitter"], [href*="linkedin"]',
      elements => elements.map(el => ({
        href: el.href || '',
        text: el.textContent?.trim() || '',
        platform: el.href ? new URL(el.href).hostname : 'unknown'
      }))
    ).catch(() => []);
    
    const hasSocialLinks = socialElements.length > 0;
    recordTest('Social Media Links', hasSocialLinks,
      hasSocialLinks ? `Found ${socialElements.length} social media links` : 'No social media links found');
    
    // Look for Instagram feed
    const instagramFeed = await page.$('[data-testid="instagram-feed"], [class*="instagram"], [class*="feed"]');
    if (instagramFeed) {
      await page.scrollIntoView('[data-testid="instagram-feed"], [class*="instagram"], [class*="feed"]');
      await page.screenshot({ 
        path: path.join(TEST_CONFIG.screenshotDir, 'social-media-integration.png'),
        fullPage: false
      });
      recordTest('Instagram Feed', true, 'Instagram feed found and displayed');
    } else {
      recordTest('Instagram Feed', false, 'No Instagram feed found');
    }
    
    // Test social sharing buttons on product pages
    await page.goto(`${TEST_CONFIG.baseUrl}/products`);
    const shareButtons = await page.$$eval(
      '[class*="share"], [data-testid*="share"], [aria-label*="share"]',
      elements => elements.length
    ).catch(() => 0);
    
    recordTest('Social Sharing', shareButtons > 0,
      shareButtons > 0 ? `Found ${shareButtons} social sharing elements` : 'No social sharing buttons found');
    
    testResults.trustMetrics.socialMedia = {
      socialLinks: socialElements,
      hasInstagramFeed: !!instagramFeed,
      shareButtonCount: shareButtons,
      platforms: [...new Set(socialElements.map(el => {
        if (el.href.includes('facebook')) return 'facebook';
        if (el.href.includes('instagram')) return 'instagram';
        if (el.href.includes('twitter')) return 'twitter';
        if (el.href.includes('linkedin')) return 'linkedin';
        return 'other';
      }))]
    };
    
  } catch (error) {
    recordTest('Social Media Integration Test', false, error.message);
  }
}

/**
 * Test guarantee and return policy visibility
 */
async function testGuaranteeInfo(page) {
  console.log('✅ Testing Guarantee Information...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for guarantee section
    const guaranteeSection = await page.$('[data-testid="guarantee-section"], [class*="guarantee"], [class*="return-policy"]');
    if (guaranteeSection) {
      await page.scrollIntoView('[data-testid="guarantee-section"], [class*="guarantee"], [class*="return-policy"]');
      await page.screenshot({ 
        path: path.join(TEST_CONFIG.screenshotDir, 'guarantee-section.png'),
        fullPage: false
      });
      recordTest('Guarantee Section', true, 'Guarantee/return policy section found');
      
      // Analyze guarantee content
      const guaranteeText = await page.evaluate(() => {
        const section = document.querySelector('[data-testid="guarantee-section"], [class*="guarantee"], [class*="return-policy"]');
        return section ? section.textContent?.trim() : '';
      });
      
      const hasMoneyBack = guaranteeText.toLowerCase().includes('money back') || 
                          guaranteeText.toLowerCase().includes('refund');
      const hasDaysPeriod = /\d+\s*days?/i.test(guaranteeText);
      
      recordTest('Money Back Guarantee', hasMoneyBack, 
        hasMoneyBack ? 'Money back guarantee mentioned' : 'No money back guarantee found');
      
      recordTest('Guarantee Period', hasDaysPeriod,
        hasDaysPeriod ? 'Specific guarantee period mentioned' : 'No specific guarantee period found');
      
      testResults.trustMetrics.guarantee = {
        hasSection: true,
        hasMoneyBack,
        hasDaysPeriod,
        text: guaranteeText.substring(0, 200)
      };
      
    } else {
      recordTest('Guarantee Section', false, 'No guarantee section found');
      testResults.trustMetrics.guarantee = { hasSection: false };
    }
    
    // Look for return policy in footer
    const footerLinks = await page.$$eval(
      'footer a, [data-testid="footer"] a',
      links => links.map(link => ({
        text: link.textContent?.trim().toLowerCase() || '',
        href: link.href || ''
      }))
    ).catch(() => []);
    
    const returnPolicyLink = footerLinks.find(link => 
      link.text.includes('return') || 
      link.text.includes('refund') || 
      link.text.includes('policy')
    );
    
    recordTest('Return Policy Link', !!returnPolicyLink,
      returnPolicyLink ? 'Return policy link found in footer' : 'No return policy link found');
    
  } catch (error) {
    recordTest('Guarantee Information Test', false, error.message);
  }
}

/**
 * Test general trust indicators
 */
async function testTrustIndicators(page) {
  console.log('🎯 Testing Trust Indicators...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for various trust indicators
    const trustIndicators = {
      contactInfo: await page.$('[href^="tel:"], [href^="mailto:"], [class*="contact"]') !== null,
      address: await page.evaluate(() => 
        document.body.textContent?.includes('Address') || 
        document.body.textContent?.includes('Location') ||
        /\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+/.test(document.body.textContent || '')
      ),
      businessHours: await page.evaluate(() =>
        /\d+:\d+\s*(AM|PM|am|pm)/.test(document.body.textContent || '') ||
        document.body.textContent?.toLowerCase().includes('hours') ||
        document.body.textContent?.toLowerCase().includes('open')
      ),
      aboutUs: await page.$('a[href*="about"], [href="/about"]') !== null,
      privacyPolicy: await page.$('a[href*="privacy"], [href*="terms"]') !== null
    };
    
    const trustScore = Object.values(trustIndicators).filter(Boolean).length;
    const maxScore = Object.keys(trustIndicators).length;
    
    recordTest('Trust Indicators', trustScore >= maxScore / 2,
      `${trustScore}/${maxScore} trust indicators found`);
    
    // Test business information completeness
    recordTest('Contact Information', trustIndicators.contactInfo,
      trustIndicators.contactInfo ? 'Contact information available' : 'No contact information found');
    
    recordTest('Business Address', trustIndicators.address,
      trustIndicators.address ? 'Business address found' : 'No business address found');
    
    recordTest('Business Hours', trustIndicators.businessHours,
      trustIndicators.businessHours ? 'Business hours mentioned' : 'No business hours found');
    
    testResults.trustMetrics.trustIndicators = {
      ...trustIndicators,
      trustScore: trustScore / maxScore
    };
    
  } catch (error) {
    recordTest('Trust Indicators Test', false, error.message);
  }
}

/**
 * Test social proof elements
 */
async function testSocialProofElements(page) {
  console.log('👏 Testing Social Proof Elements...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for customer count, sales numbers, etc.
    const socialProofText = await page.evaluate(() => document.body.textContent || '');
    
    const socialProofElements = {
      customerCount: /(\d+[,\s]*\d*)\s*(customers?|clients?|users?)/i.test(socialProofText),
      salesNumbers: /(\d+[,\s]*\d*)\s*(sold|sales?|orders?)/i.test(socialProofText),
      yearInBusiness: /(\d+)\s*(years?|decades?)/i.test(socialProofText),
      awards: /(award|winner|featured|certified)/i.test(socialProofText),
      pressLogos: await page.$('[class*="press"], [class*="media"], [class*="featured"]') !== null
    };
    
    const socialProofScore = Object.values(socialProofElements).filter(Boolean).length;
    
    recordTest('Social Proof Elements', socialProofScore > 0,
      `${socialProofScore} social proof elements found`);
    
    // Test for trust badges and certifications
    const certifications = await page.$$eval(
      'img[alt*="certified"], img[alt*="organic"], img[alt*="quality"], [class*="badge"], [class*="certification"]',
      elements => elements.map(el => ({
        alt: el.alt || '',
        src: el.src || '',
        className: el.className
      }))
    ).catch(() => []);
    
    recordTest('Certifications & Badges', certifications.length > 0,
      `${certifications.length} certification badges found`);
    
    testResults.trustMetrics.socialProof = {
      ...socialProofElements,
      certifications,
      socialProofScore: socialProofScore / Object.keys(socialProofElements).length
    };
    
    if (socialProofScore > 0 || certifications.length > 0) {
      await page.screenshot({ 
        path: path.join(TEST_CONFIG.screenshotDir, 'social-proof-elements.png'),
        fullPage: true
      });
    }
    
  } catch (error) {
    recordTest('Social Proof Elements Test', false, error.message);
  }
}

/**
 * Test credibility signals
 */
async function testCredibilitySignals(page) {
  console.log('📜 Testing Credibility Signals...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for professional design elements
    const credibilitySignals = {
      professionalLogo: await page.$('img[alt*="logo"], [class*="logo"]') !== null,
      consistentBranding: true, // Would need more complex analysis
      clearNavigation: await page.$$eval('nav a, header a', links => links.length >= 3).catch(() => false),
      footerCompleteness: await page.$$eval('footer a, footer div', elements => elements.length >= 5).catch(() => false),
      errorHandling: true // Assume good for now, would need error page testing
    };
    
    // Test page load speed as credibility factor
    const navigationStart = await page.evaluate(() => performance.timing.navigationStart);
    const loadComplete = await page.evaluate(() => performance.timing.loadEventEnd);
    const loadTime = loadComplete - navigationStart;
    
    credibilitySignals.fastLoading = loadTime < 3000; // Under 3 seconds
    
    recordTest('Page Load Speed', credibilitySignals.fastLoading,
      `Page loaded in ${loadTime}ms`);
    
    const credibilityScore = Object.values(credibilitySignals).filter(Boolean).length;
    
    recordTest('Credibility Signals', credibilityScore >= 4,
      `${credibilityScore}/${Object.keys(credibilitySignals).length} credibility signals present`);
    
    testResults.trustMetrics.credibility = {
      ...credibilitySignals,
      loadTime,
      credibilityScore: credibilityScore / Object.keys(credibilitySignals).length
    };
    
  } catch (error) {
    recordTest('Credibility Signals Test', false, error.message);
  }
}

/**
 * Test return policy visibility and clarity
 */
async function testReturnPolicy(page) {
  console.log('🔄 Testing Return Policy...');
  
  try {
    // Look for return policy page
    await page.goto(TEST_CONFIG.baseUrl);
    
    const policyLinks = await page.$$eval('a', links => 
      links.filter(link => 
        link.textContent?.toLowerCase().includes('return') ||
        link.textContent?.toLowerCase().includes('refund') ||
        link.href.includes('return') ||
        link.href.includes('policy')
      ).map(link => ({
        text: link.textContent?.trim(),
        href: link.href
      }))
    );
    
    if (policyLinks.length > 0) {
      recordTest('Return Policy Links', true, `Found ${policyLinks.length} return policy links`);
      
      // Try to visit return policy page
      const policyLink = policyLinks[0];
      try {
        await page.goto(policyLink.href);
        await page.waitForSelector('body', { timeout: 5000 });
        
        const policyContent = await page.evaluate(() => document.body.textContent || '');
        const hasClearTerms = policyContent.length > 200;
        const hasTimeframe = /\d+\s*days?/i.test(policyContent);
        
        recordTest('Return Policy Content', hasClearTerms,
          hasClearTerms ? 'Return policy has detailed content' : 'Return policy content is too brief');
        
        recordTest('Return Timeframe', hasTimeframe,
          hasTimeframe ? 'Return timeframe clearly stated' : 'No clear return timeframe');
        
        await page.screenshot({ 
          path: path.join(TEST_CONFIG.screenshotDir, 'return-policy-page.png'),
          fullPage: true
        });
        
        testResults.trustMetrics.returnPolicy = {
          hasLinks: true,
          hasClearTerms,
          hasTimeframe,
          contentLength: policyContent.length
        };
        
      } catch (error) {
        recordTest('Return Policy Page', false, 'Could not access return policy page');
      }
    } else {
      recordTest('Return Policy Links', false, 'No return policy links found');
      testResults.trustMetrics.returnPolicy = { hasLinks: false };
    }
    
  } catch (error) {
    recordTest('Return Policy Test', false, error.message);
  }
}

/**
 * Test certifications and quality badges
 */
async function testCertifications(page) {
  console.log('🏆 Testing Certifications...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for certification and quality badges
    const certificationElements = await page.$$eval(
      'img[alt*="organic"], img[alt*="certified"], img[alt*="quality"], img[alt*="iso"], img[alt*="fda"], [class*="certification"], [class*="badge"]',
      elements => elements.map(el => ({
        alt: el.alt || '',
        src: el.src || '',
        title: el.title || '',
        className: el.className
      }))
    ).catch(() => []);
    
    const hasCertifications = certificationElements.length > 0;
    
    recordTest('Quality Certifications', hasCertifications,
      hasCertifications ? `Found ${certificationElements.length} certification badges` : 'No certification badges found');
    
    if (hasCertifications) {
      // Scroll to certifications area (usually footer)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.screenshot({ 
        path: path.join(TEST_CONFIG.screenshotDir, 'certifications-badges.png'),
        fullPage: false
      });
      
      // Analyze certification types
      const certTypes = {
        organic: certificationElements.filter(cert => 
          cert.alt.toLowerCase().includes('organic') || 
          cert.src.toLowerCase().includes('organic')
        ).length,
        quality: certificationElements.filter(cert => 
          cert.alt.toLowerCase().includes('quality') || 
          cert.alt.toLowerCase().includes('iso')
        ).length,
        fda: certificationElements.filter(cert => 
          cert.alt.toLowerCase().includes('fda') || 
          cert.src.toLowerCase().includes('fda')
        ).length,
        other: certificationElements.filter(cert => 
          cert.alt.toLowerCase().includes('certified') ||
          cert.alt.toLowerCase().includes('approved')
        ).length
      };
      
      testResults.trustMetrics.certifications = {
        total: certificationElements.length,
        types: certTypes,
        badges: certificationElements
      };
    } else {
      testResults.trustMetrics.certifications = { total: 0, types: {}, badges: [] };
    }
    
  } catch (error) {
    recordTest('Certifications Test', false, error.message);
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
  const metrics = testResults.trustMetrics;
  
  // Testimonial recommendations
  if (!metrics.testimonials?.count || metrics.testimonials.count < 3) {
    recommendations.push({
      category: 'Customer Testimonials',
      priority: 'High',
      issue: 'Insufficient customer testimonials',
      solution: 'Add at least 3-5 high-quality customer testimonials with photos, names, and specific benefits'
    });
  }
  
  if (metrics.testimonials?.qualityScore < 0.7) {
    recommendations.push({
      category: 'Testimonial Quality',
      priority: 'Medium',
      issue: 'Low quality testimonials detected',
      solution: 'Ensure testimonials include customer names, photos, and specific product benefits (avoid generic praise)'
    });
  }
  
  // Security recommendations
  if (!metrics.security?.httpsEnabled) {
    recommendations.push({
      category: 'Security',
      priority: 'Critical',
      issue: 'Site not served over HTTPS',
      solution: 'Implement SSL certificate and redirect all HTTP traffic to HTTPS'
    });
  }
  
  if (metrics.security?.badgeCount === 0) {
    recommendations.push({
      category: 'Security Badges',
      priority: 'Medium',
      issue: 'No security badges displayed',
      solution: 'Add SSL certificate badge, Norton/McAfee security badges, or other trust seals'
    });
  }
  
  // Review system recommendations
  if (!metrics.reviews?.productPageReviews) {
    recommendations.push({
      category: 'Customer Reviews',
      priority: 'High',
      issue: 'No customer review system on product pages',
      solution: 'Implement customer review system with star ratings and written reviews for each product'
    });
  }
  
  // Social proof recommendations
  if (metrics.socialProof?.socialProofScore < 0.3) {
    recommendations.push({
      category: 'Social Proof',
      priority: 'Medium',
      issue: 'Limited social proof elements',
      solution: 'Add customer count, sales numbers, years in business, awards, or press mentions'
    });
  }
  
  // Social media recommendations
  if (!metrics.socialMedia?.socialLinks?.length) {
    recommendations.push({
      category: 'Social Media',
      priority: 'Medium',
      issue: 'No social media presence visible',
      solution: 'Add social media links and consider Instagram feed integration'
    });
  }
  
  // Guarantee recommendations
  if (!metrics.guarantee?.hasSection) {
    recommendations.push({
      category: 'Money Back Guarantee',
      priority: 'High',
      issue: 'No visible money back guarantee',
      solution: 'Add prominent money back guarantee with specific timeframe (30-60 days)'
    });
  }
  
  // Trust indicators recommendations
  if (metrics.trustIndicators?.trustScore < 0.6) {
    recommendations.push({
      category: 'Trust Indicators',
      priority: 'Medium',
      issue: 'Missing basic trust indicators',
      solution: 'Add complete contact information, business address, hours, and about us page'
    });
  }
  
  // Certification recommendations
  if (metrics.certifications?.total === 0) {
    recommendations.push({
      category: 'Certifications',
      priority: 'Low',
      issue: 'No quality certifications displayed',
      solution: 'Display relevant certifications (organic, FDA approved, quality standards, etc.)'
    });
  }
  
  // Performance recommendations
  if (metrics.credibility?.loadTime > 3000) {
    recommendations.push({
      category: 'Performance',
      priority: 'Medium',
      issue: 'Slow page loading affects credibility',
      solution: 'Optimize page load speed to under 3 seconds for better user trust'
    });
  }
  
  testResults.recommendations = recommendations;
}

/**
 * Generate test reports
 */
async function generateReports() {
  console.log('\n📊 Generating trust signals test reports...');
  
  generateRecommendations();
  
  // Generate JSON report
  await fs.writeFile(
    TEST_CONFIG.reportFile,
    JSON.stringify(testResults, null, 2)
  );
  
  // Generate Markdown report
  const markdownReport = generateMarkdownReport();
  await fs.writeFile(TEST_CONFIG.markdownFile, markdownReport);
  
  console.log(`\n✅ Trust signals test reports generated:`);
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
  const metrics = testResults.trustMetrics;
  
  return `# Trust Signals & Social Proof Testing Report

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

## Trust Metrics Analysis

### Customer Testimonials
${metrics.testimonials ? 
  `- **Count:** ${metrics.testimonials.count}
- **Has Carousel:** ${metrics.testimonials.hasCarousel ? 'Yes' : 'No'}
- **Quality Score:** ${Math.round(metrics.testimonials.qualityScore * 100)}%` : 
  'No testimonials data available'}

### Security & Trust Badges
${metrics.security ? 
  `- **HTTPS Enabled:** ${metrics.security.httpsEnabled ? 'Yes' : 'No'}
- **Security Badges:** ${metrics.security.badgeCount}
- **SSL Badges:** ${metrics.security.badgeTypes?.ssl || 0}
- **Verification Badges:** ${metrics.security.badgeTypes?.verified || 0}` : 
  'No security data available'}

### Customer Reviews
${metrics.reviews ? 
  `- **Product Page Reviews:** ${metrics.reviews.productPageReviews || 0}
- **Has Interaction:** ${metrics.reviews.hasInteraction ? 'Yes' : 'No'}
- **Quality Score:** ${Math.round((metrics.reviews.qualityScore || 0) * 100)}%` : 
  'No reviews data available'}

### Social Media Integration
${metrics.socialMedia ? 
  `- **Social Links:** ${metrics.socialMedia.socialLinks?.length || 0}
- **Instagram Feed:** ${metrics.socialMedia.hasInstagramFeed ? 'Yes' : 'No'}
- **Share Buttons:** ${metrics.socialMedia.shareButtonCount || 0}
- **Platforms:** ${metrics.socialMedia.platforms?.join(', ') || 'None'}` : 
  'No social media data available'}

### Guarantee & Return Policy
${metrics.guarantee ? 
  `- **Has Guarantee Section:** ${metrics.guarantee.hasSection ? 'Yes' : 'No'}
- **Money Back Guarantee:** ${metrics.guarantee.hasMoneyBack ? 'Yes' : 'No'}
- **Time Period Specified:** ${metrics.guarantee.hasDaysPeriod ? 'Yes' : 'No'}` : 
  'No guarantee data available'}

${metrics.returnPolicy ? 
  `- **Return Policy Links:** ${metrics.returnPolicy.hasLinks ? 'Yes' : 'No'}
- **Clear Terms:** ${metrics.returnPolicy.hasClearTerms ? 'Yes' : 'No'}
- **Return Timeframe:** ${metrics.returnPolicy.hasTimeframe ? 'Yes' : 'No'}` : ''}

### Trust Indicators
${metrics.trustIndicators ? 
  `- **Contact Information:** ${metrics.trustIndicators.contactInfo ? 'Yes' : 'No'}
- **Business Address:** ${metrics.trustIndicators.address ? 'Yes' : 'No'}
- **Business Hours:** ${metrics.trustIndicators.businessHours ? 'Yes' : 'No'}
- **About Us Page:** ${metrics.trustIndicators.aboutUs ? 'Yes' : 'No'}
- **Privacy Policy:** ${metrics.trustIndicators.privacyPolicy ? 'Yes' : 'No'}
- **Trust Score:** ${Math.round(metrics.trustIndicators.trustScore * 100)}%` : 
  'No trust indicators data available'}

### Social Proof Elements
${metrics.socialProof ? 
  `- **Customer Count:** ${metrics.socialProof.customerCount ? 'Yes' : 'No'}
- **Sales Numbers:** ${metrics.socialProof.salesNumbers ? 'Yes' : 'No'}
- **Years in Business:** ${metrics.socialProof.yearInBusiness ? 'Yes' : 'No'}
- **Awards/Recognition:** ${metrics.socialProof.awards ? 'Yes' : 'No'}
- **Press/Media Logos:** ${metrics.socialProof.pressLogos ? 'Yes' : 'No'}
- **Social Proof Score:** ${Math.round(metrics.socialProof.socialProofScore * 100)}%` : 
  'No social proof data available'}

### Certifications & Quality Badges
${metrics.certifications ? 
  `- **Total Certifications:** ${metrics.certifications.total}
- **Organic Certifications:** ${metrics.certifications.types?.organic || 0}
- **Quality Standards:** ${metrics.certifications.types?.quality || 0}
- **FDA Approvals:** ${metrics.certifications.types?.fda || 0}
- **Other Certifications:** ${metrics.certifications.types?.other || 0}` : 
  'No certifications data available'}

### Performance & Credibility
${metrics.credibility ? 
  `- **Page Load Time:** ${metrics.credibility.loadTime}ms
- **Fast Loading:** ${metrics.credibility.fastLoading ? 'Yes' : 'No'}
- **Professional Logo:** ${metrics.credibility.professionalLogo ? 'Yes' : 'No'}
- **Clear Navigation:** ${metrics.credibility.clearNavigation ? 'Yes' : 'No'}
- **Complete Footer:** ${metrics.credibility.footerCompleteness ? 'Yes' : 'No'}
- **Credibility Score:** ${Math.round(metrics.credibility.credibilityScore * 100)}%` : 
  'No credibility data available'}

## Recommendations

${testResults.recommendations.map(rec => 
  `### ${rec.category} (${rec.priority} Priority)
**Issue:** ${rec.issue}  
**Solution:** ${rec.solution}\n`
).join('\n')}

## Screenshots

- **Testimonials Section:** testimonials-section.png
- **Security Badges:** security-badges.png
- **Product Reviews:** product-reviews-section.png
- **Social Media Integration:** social-media-integration.png
- **Guarantee Section:** guarantee-section.png
- **Social Proof Elements:** social-proof-elements.png
- **Return Policy Page:** return-policy-page.png
- **Certifications:** certifications-badges.png

---
*Report generated by Tishya Foods Trust Signals Testing Suite*
`;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTrustSignalsTests().catch(console.error);
}

module.exports = { runTrustSignalsTests };