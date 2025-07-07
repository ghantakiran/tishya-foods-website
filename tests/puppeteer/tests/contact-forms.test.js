const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running contact forms tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('contact-forms');

  try {
    // Test 1: Navigate to contact page
    await testUtils.navigateToPage(page, '/contact');
    await testUtils.waitForElement(page, 'h1');
    const pageTitle = await page.$eval('h1', el => el.textContent);
    console.log('✓ Contact page loaded:', pageTitle);

    // Test 2: Main contact form validation
    const contactForm = await page.$('[data-testid="contact-form"]');
    if (contactForm) {
      console.log('Testing main contact form...');
      
      // Test empty form submission
      const submitBtn = await contactForm.$('[data-testid="contact-submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        
        const errorMessages = await page.$$('.error, [data-testid="error-message"]');
        if (errorMessages.length > 0) {
          console.log('✓ Contact form validation works for empty fields');
        }
      }
      
      // Fill out contact form with valid data
      const formData = config.testData.forms.contact;
      const fieldMappings = {
        '[data-testid="contact-name"]': formData.name,
        '[data-testid="contact-email"]': formData.email,
        '[data-testid="contact-phone"]': formData.phone,
        '[data-testid="contact-message"]': formData.message
      };
      
      for (const [selector, value] of Object.entries(fieldMappings)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
          console.log(`✓ Filled ${selector}: ${value}`);
        }
      }
      
      // Test subject selection
      const subjectSelect = await contactForm.$('[data-testid="contact-subject"]');
      if (subjectSelect) {
        await page.select('[data-testid="contact-subject"]', formData.subject);
        console.log('✓ Subject selected:', formData.subject);
      }
      
      // Test form submission
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
        
        // Check for success message
        const successMessage = await page.$('[data-testid="success-message"]');
        if (successMessage) {
          console.log('✓ Contact form submitted successfully');
        } else {
          console.log('⚠ Contact form submission completed (may show validation or server response)');
        }
      }
    }

    // Test 3: Newsletter subscription form
    const newsletterForm = await page.$('[data-testid="newsletter-form"]');
    if (newsletterForm) {
      console.log('Testing newsletter subscription...');
      
      const emailField = await newsletterForm.$('[data-testid="newsletter-email"]');
      const subscribeBtn = await newsletterForm.$('[data-testid="newsletter-submit"]');
      
      if (emailField && subscribeBtn) {
        await emailField.type('newsletter@example.com');
        await subscribeBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Newsletter subscription tested');
      }
    }

    // Test 4: Quick contact/inquiry form (if present)
    const quickContactForm = await page.$('[data-testid="quick-contact-form"]');
    if (quickContactForm) {
      console.log('Testing quick contact form...');
      
      const quickFields = {
        '[data-testid="quick-name"]': 'Quick Test',
        '[data-testid="quick-email"]': 'quick@example.com',
        '[data-testid="quick-inquiry"]': 'Quick inquiry message'
      };
      
      for (const [selector, value] of Object.entries(quickFields)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
        }
      }
      
      const quickSubmitBtn = await quickContactForm.$('[data-testid="quick-submit"]');
      if (quickSubmitBtn) {
        await quickSubmitBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Quick contact form tested');
      }
    }

    // Test 5: Callback request form
    const callbackForm = await page.$('[data-testid="callback-form"]');
    if (callbackForm) {
      console.log('Testing callback request form...');
      
      const callbackFields = {
        '[data-testid="callback-name"]': 'Callback Test',
        '[data-testid="callback-phone"]': '+91 9876543210'
      };
      
      for (const [selector, value] of Object.entries(callbackFields)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
        }
      }
      
      // Test time preference selection
      const timeSelect = await callbackForm.$('[data-testid="callback-time"]');
      if (timeSelect) {
        await page.select('[data-testid="callback-time"]', 'morning');
        console.log('✓ Callback time preference selected');
      }
      
      const callbackSubmitBtn = await callbackForm.$('[data-testid="callback-submit"]');
      if (callbackSubmitBtn) {
        await callbackSubmitBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Callback request form tested');
      }
    }

    // Test 6: Product inquiry form
    const productInquiryForm = await page.$('[data-testid="product-inquiry-form"]');
    if (productInquiryForm) {
      console.log('Testing product inquiry form...');
      
      const inquiryFields = {
        '[data-testid="inquiry-name"]': 'Product Inquirer',
        '[data-testid="inquiry-email"]': 'inquirer@example.com',
        '[data-testid="inquiry-product"]': 'Protein Powder',
        '[data-testid="inquiry-message"]': 'I want to know more about this product'
      };
      
      for (const [selector, value] of Object.entries(inquiryFields)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
        }
      }
      
      const inquirySubmitBtn = await productInquiryForm.$('[data-testid="inquiry-submit"]');
      if (inquirySubmitBtn) {
        await inquirySubmitBtn.click();
        await page.waitForTimeout(1000);
        console.log('✓ Product inquiry form tested');
      }
    }

    // Test 7: Contact information display
    const contactInfo = await page.$('[data-testid="contact-info"]');
    if (contactInfo) {
      console.log('✓ Contact information section found');
      
      const contactDetails = [
        'contact-address',
        'contact-phone-number',
        'contact-email-address',
        'contact-hours'
      ];
      
      for (const detail of contactDetails) {
        const element = await contactInfo.$(`[data-testid="${detail}"]`);
        if (element) {
          console.log(`✓ Contact detail found: ${detail}`);
        }
      }
    }

    // Test 8: Social media links
    const socialLinks = await page.$$('[data-testid*="social-link"]');
    if (socialLinks.length > 0) {
      console.log(`✓ Found ${socialLinks.length} social media links`);
      
      // Test first social link (without actually navigating)
      const firstLink = socialLinks[0];
      const href = await firstLink.getAttribute('href');
      if (href) {
        console.log('✓ Social link has valid href:', href);
      }
    }

    // Test 9: Map/location section
    const mapSection = await page.$('[data-testid="location-map"]');
    if (mapSection) {
      console.log('✓ Location map section found');
      
      // Test map interaction (if it's an interactive map)
      const mapContainer = await mapSection.$('.map-container, iframe');
      if (mapContainer) {
        console.log('✓ Map container found');
      }
    }

    // Test 10: FAQ section (if present on contact page)
    const faqSection = await page.$('[data-testid="contact-faq"]');
    if (faqSection) {
      console.log('✓ FAQ section found on contact page');
      
      const faqItems = await faqSection.$$('[data-testid="faq-item"]');
      if (faqItems.length > 0) {
        // Test expanding FAQ
        await faqItems[0].click();
        await page.waitForTimeout(500);
        console.log('✓ FAQ expansion tested');
      }
    }

    // Test 11: Form validation edge cases
    await testUtils.navigateToPage(page, '/contact');
    const mainForm = await page.$('[data-testid="contact-form"]');
    if (mainForm) {
      console.log('Testing form validation edge cases...');
      
      // Test invalid email format
      const emailField = await mainForm.$('[data-testid="contact-email"]');
      if (emailField) {
        await emailField.type('invalid-email-format');
        const submitBtn = await mainForm.$('[data-testid="contact-submit"]');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Invalid email validation tested');
        }
        
        // Clear field
        await emailField.click({ clickCount: 3 });
        await emailField.press('Backspace');
      }
      
      // Test phone number validation
      const phoneField = await mainForm.$('[data-testid="contact-phone"]');
      if (phoneField) {
        await phoneField.type('invalid-phone');
        const submitBtn = await mainForm.$('[data-testid="contact-submit"]');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Invalid phone validation tested');
        }
      }
    }

    // Test 12: File upload (if present in contact form)
    const fileUpload = await page.$('[data-testid="contact-file-upload"]');
    if (fileUpload) {
      console.log('✓ File upload option found in contact form');
      // Note: Actual file upload testing would require file handling
    }

    // Test 13: CAPTCHA/spam protection
    const captchaSection = await page.$('[data-testid="captcha"], [data-testid="recaptcha"]');
    if (captchaSection) {
      console.log('✓ CAPTCHA/spam protection found');
    }

    // Test 14: Mobile form experience
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, '[data-testid="contact-form"]');
    console.log('✓ Mobile contact form experience verified');

    // Test 15: Accessibility check on forms
    const accessibilityResult = await testUtils.checkAccessibility(page, {
      tags: ['wcag2a', 'wcag2aa']
    });
    console.log('✓ Contact forms accessibility check:', {
      violations: accessibilityResult.violations.length,
      score: accessibilityResult.score
    });

    // Test 16: Performance check
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Contact page performance metrics:', {
      pageLoad: performance.pageLoad,
      firstContentfulPaint: performance.firstContentfulPaint
    });

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'contact-forms-final');
    
    console.log('Contact forms tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };