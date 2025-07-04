/**
 * Accessibility Testing & WCAG Compliance - Issue #8
 * Comprehensive accessibility analysis and WCAG 2.1 compliance testing
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AccessibilityTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      screenshots: [],
      metrics: {},
      issues: [],
      recommendations: [],
      accessibilityTests: [],
      wcagCompliance: {}
    };
    
    // Create screenshots directory
    this.screenshotDir = path.join(__dirname, '../../screenshots/accessibility');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('♿ Initializing Accessibility Testing & WCAG Compliance Analysis...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--force-prefers-reduced-motion',
        '--enable-features=NavigationThreadingOptimizations'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Enable console logging for accessibility
    this.page.on('console', msg => {
      if (msg.text().includes('accessibility') || msg.text().includes('a11y')) {
        console.log('A11Y LOG:', msg.text());
      }
    });
    
    // Set up accessibility preferences
    await this.page.evaluateOnNewDocument(() => {
      // Simulate reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
    });
  }

  async runAccessibilityTests() {
    console.log('🔍 Starting Accessibility Testing & WCAG Compliance Analysis...');
    
    try {
      // Test 1: Color contrast and visual accessibility
      await this.testColorContrast();
      
      // Test 2: Keyboard navigation testing
      await this.testKeyboardNavigation();
      
      // Test 3: Screen reader compatibility
      await this.testScreenReaderCompatibility();
      
      // Test 4: Form accessibility
      await this.testFormAccessibility();
      
      // Test 5: Image accessibility
      await this.testImageAccessibility();
      
      // Test 6: Focus management
      await this.testFocusManagement();
      
      // Test 7: ARIA labels and roles
      await this.testAriaLabelsAndRoles();
      
      // Test 8: Mobile accessibility
      await this.testMobileAccessibility();
      
      // Test 9: Animation and motion accessibility
      await this.testAnimationAccessibility();
      
      // Test 10: Text scaling and zoom
      await this.testTextScalingZoom();
      
      // Test 11: Page structure and headings
      await this.testPageStructure();
      
      // Test 12: Link accessibility
      await this.testLinkAccessibility();
      
      console.log('✅ Accessibility Testing & WCAG Compliance analysis completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during accessibility testing:', error);
      this.results.issues.push({
        type: 'critical',
        category: 'testing',
        message: `Accessibility testing failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testColorContrast() {
    console.log('🎨 Step 1: Testing Color Contrast & Visual Accessibility...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze color contrast ratios
      const contrastAnalysis = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const contrastIssues = [];
        const colorPairs = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const backgroundColor = style.backgroundColor;
          const fontSize = parseFloat(style.fontSize);
          
          if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            const textContent = el.textContent?.trim();
            if (textContent && textContent.length > 0) {
              colorPairs.push({
                element: el.tagName.toLowerCase(),
                color: color,
                backgroundColor: backgroundColor,
                fontSize: fontSize,
                text: textContent.substring(0, 50),
                isLargeText: fontSize >= 18 || (fontSize >= 14 && style.fontWeight >= 700)
              });
            }
          }
        });
        
        // Calculate approximate contrast ratio (simplified)
        function getContrastRatio(color1, color2) {
          // This is a simplified contrast calculation
          // In a real implementation, you'd use a proper color contrast library
          const rgb1 = color1.match(/\d+/g);
          const rgb2 = color2.match(/\d+/g);
          
          if (!rgb1 || !rgb2) return 4.5; // Default safe value
          
          const luminance1 = (0.299 * rgb1[0] + 0.587 * rgb1[1] + 0.114 * rgb1[2]) / 255;
          const luminance2 = (0.299 * rgb2[0] + 0.587 * rgb2[1] + 0.114 * rgb2[2]) / 255;
          
          const lighter = Math.max(luminance1, luminance2);
          const darker = Math.min(luminance1, luminance2);
          
          return (lighter + 0.05) / (darker + 0.05);
        }
        
        colorPairs.forEach(pair => {
          const contrastRatio = getContrastRatio(pair.color, pair.backgroundColor);
          const requiredRatio = pair.isLargeText ? 3 : 4.5;
          
          if (contrastRatio < requiredRatio) {
            contrastIssues.push({
              element: pair.element,
              text: pair.text,
              contrast: contrastRatio.toFixed(2),
              required: requiredRatio,
              color: pair.color,
              backgroundColor: pair.backgroundColor
            });
          }
        });
        
        return {
          totalElements: colorPairs.length,
          contrastIssues: contrastIssues,
          averageContrast: colorPairs.length > 0 ? 
            colorPairs.reduce((sum, pair) => sum + getContrastRatio(pair.color, pair.backgroundColor), 0) / colorPairs.length : 0
        };
      });
      
      // Test high contrast mode simulation
      await this.page.emulateMediaFeatures([{
        name: 'prefers-contrast',
        value: 'high'
      }]);
      
      await this.takeScreenshot('color-contrast-high-contrast', 'High contrast mode simulation');
      
      // Reset media features
      await this.page.emulateMediaFeatures([]);
      
      // Test dark mode contrast
      await this.page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.takeScreenshot('color-contrast-dark-mode', 'Dark mode color contrast');
      
      this.results.metrics.colorContrast = contrastAnalysis;
      this.results.wcagCompliance.colorContrast = {
        level: contrastIssues.length === 0 ? 'AA' : contrastIssues.length < 5 ? 'A' : 'Fail',
        issues: contrastAnalysis.contrastIssues.length,
        averageRatio: contrastAnalysis.averageContrast.toFixed(2)
      };
      
      console.log(`🎨 Color Contrast Analysis:`);
      console.log(`  Total Elements Tested: ${contrastAnalysis.totalElements}`);
      console.log(`  Contrast Issues: ${contrastAnalysis.contrastIssues.length}`);
      console.log(`  Average Contrast Ratio: ${contrastAnalysis.averageContrast.toFixed(2)}`);
      console.log(`  WCAG Level: ${this.results.wcagCompliance.colorContrast.level}`);
      
    } catch (error) {
      console.warn('⚠️ Color contrast test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'color_contrast',
        message: `Color contrast test issue: ${error.message}`
      });
    }
  }

  async testKeyboardNavigation() {
    console.log('⌨️ Step 2: Testing Keyboard Navigation...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test Tab navigation
      const tabNavigationTest = await this.page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        
        const navigationResults = {
          totalFocusableElements: focusableElements.length,
          tabOrder: [],
          skipLinks: document.querySelectorAll('a[href^="#"]').length,
          focusTraps: 0,
          keyboardAccessible: 0
        };
        
        // Simulate tab navigation
        let currentIndex = 0;
        focusableElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const tabIndex = element.tabIndex;
          const isVisible = rect.width > 0 && rect.height > 0;
          
          if (isVisible) {
            navigationResults.keyboardAccessible++;
            navigationResults.tabOrder.push({
              element: element.tagName.toLowerCase(),
              tabIndex: tabIndex,
              text: element.textContent?.substring(0, 30) || element.getAttribute('aria-label') || '',
              href: element.href || '',
              type: element.type || ''
            });
          }
        });
        
        return navigationResults;
      });
      
      // Test actual keyboard navigation
      await this.takeScreenshot('keyboard-nav-initial', 'Initial state before keyboard navigation');
      
      // Test Tab key navigation
      for (let i = 0; i < Math.min(10, tabNavigationTest.totalFocusableElements); i++) {
        await this.page.keyboard.press('Tab');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (i === 2 || i === 5 || i === 9) {
          await this.takeScreenshot(`keyboard-nav-tab-${i + 1}`, `Keyboard navigation - Tab ${i + 1}`);
        }
      }
      
      // Test Shift+Tab (reverse navigation)
      await this.page.keyboard.down('Shift');
      await this.page.keyboard.press('Tab');
      await this.page.keyboard.press('Tab');
      await this.page.keyboard.up('Shift');
      await this.takeScreenshot('keyboard-nav-shift-tab', 'Reverse keyboard navigation (Shift+Tab)');
      
      // Test Enter key activation
      await this.page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.takeScreenshot('keyboard-nav-enter-activation', 'Enter key activation');
      
      // Test Escape key functionality
      await this.page.keyboard.press('Escape');
      await new Promise(resolve => setTimeout(resolve, 300));
      await this.takeScreenshot('keyboard-nav-escape', 'Escape key functionality');
      
      this.results.metrics.keyboardNavigation = tabNavigationTest;
      this.results.wcagCompliance.keyboardAccessible = {
        level: tabNavigationTest.keyboardAccessible >= tabNavigationTest.totalFocusableElements * 0.9 ? 'AA' : 'A',
        focusableElements: tabNavigationTest.totalFocusableElements,
        accessibleElements: tabNavigationTest.keyboardAccessible,
        percentage: ((tabNavigationTest.keyboardAccessible / tabNavigationTest.totalFocusableElements) * 100).toFixed(1)
      };
      
      console.log(`⌨️ Keyboard Navigation:`);
      console.log(`  Total Focusable Elements: ${tabNavigationTest.totalFocusableElements}`);
      console.log(`  Keyboard Accessible: ${tabNavigationTest.keyboardAccessible}`);
      console.log(`  Skip Links: ${tabNavigationTest.skipLinks}`);
      console.log(`  Accessibility: ${this.results.wcagCompliance.keyboardAccessible.percentage}%`);
      
    } catch (error) {
      console.warn('⚠️ Keyboard navigation test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'keyboard_navigation',
        message: `Keyboard navigation test issue: ${error.message}`
      });
    }
  }

  async testScreenReaderCompatibility() {
    console.log('🔊 Step 3: Testing Screen Reader Compatibility...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze semantic structure and ARIA
      const screenReaderAnalysis = await this.page.evaluate(() => {
        const analysis = {
          headingStructure: [],
          landmarks: [],
          ariaLabels: 0,
          ariaDescriptions: 0,
          altText: 0,
          missingAltText: 0,
          semanticElements: {},
          formLabels: 0,
          missingFormLabels: 0
        };
        
        // Analyze heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          analysis.headingStructure.push({
            level: parseInt(heading.tagName.charAt(1)),
            text: heading.textContent?.trim().substring(0, 50) || '',
            id: heading.id || ''
          });
        });
        
        // Analyze landmarks
        const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
        landmarks.forEach(landmark => {
          analysis.landmarks.push({
            element: landmark.tagName.toLowerCase(),
            role: landmark.getAttribute('role') || landmark.tagName.toLowerCase(),
            label: landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || ''
          });
        });
        
        // Count ARIA attributes
        analysis.ariaLabels = document.querySelectorAll('[aria-label]').length;
        analysis.ariaDescriptions = document.querySelectorAll('[aria-describedby]').length;
        
        // Analyze images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (img.alt !== undefined && img.alt !== '') {
            analysis.altText++;
          } else {
            analysis.missingAltText++;
          }
        });
        
        // Count semantic elements
        const semanticTags = ['article', 'section', 'nav', 'aside', 'header', 'footer', 'main'];
        semanticTags.forEach(tag => {
          analysis.semanticElements[tag] = document.querySelectorAll(tag).length;
        });
        
        // Analyze form labels
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(element => {
          const label = document.querySelector(`label[for="${element.id}"]`) ||
                       element.closest('label') ||
                       element.getAttribute('aria-label') ||
                       element.getAttribute('aria-labelledby');
          
          if (label) {
            analysis.formLabels++;
          } else {
            analysis.missingFormLabels++;
          }
        });
        
        return analysis;
      });
      
      // Test screen reader announcement simulation
      await this.page.evaluate(() => {
        // Create a live region for testing
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.id = 'sr-test-region';
        document.body.appendChild(liveRegion);
        
        // Test announcement
        setTimeout(() => {
          liveRegion.textContent = 'Screen reader compatibility test in progress';
        }, 100);
      });
      
      await this.takeScreenshot('screen-reader-structure', 'Screen reader semantic structure analysis');
      
      this.results.metrics.screenReaderCompatibility = screenReaderAnalysis;
      this.results.wcagCompliance.screenReader = {
        level: this.calculateScreenReaderLevel(screenReaderAnalysis),
        headings: screenReaderAnalysis.headingStructure.length,
        landmarks: screenReaderAnalysis.landmarks.length,
        altTextCoverage: screenReaderAnalysis.altText / (screenReaderAnalysis.altText + screenReaderAnalysis.missingAltText) * 100 || 100
      };
      
      console.log(`🔊 Screen Reader Compatibility:`);
      console.log(`  Heading Structure: ${screenReaderAnalysis.headingStructure.length} headings`);
      console.log(`  Landmarks: ${screenReaderAnalysis.landmarks.length}`);
      console.log(`  ARIA Labels: ${screenReaderAnalysis.ariaLabels}`);
      console.log(`  Alt Text Coverage: ${this.results.wcagCompliance.screenReader.altTextCoverage.toFixed(1)}%`);
      console.log(`  Form Labels: ${screenReaderAnalysis.formLabels}/${screenReaderAnalysis.formLabels + screenReaderAnalysis.missingFormLabels}`);
      
    } catch (error) {
      console.warn('⚠️ Screen reader compatibility test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'screen_reader',
        message: `Screen reader compatibility test issue: ${error.message}`
      });
    }
  }

  async testFormAccessibility() {
    console.log('📝 Step 4: Testing Form Accessibility...');
    
    try {
      // Navigate to contact page for form testing
      await this.page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
      
      // Analyze form accessibility
      const formAnalysis = await this.page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const analysis = {
          totalForms: forms.length,
          formElements: [],
          labelIssues: [],
          validationIssues: [],
          fieldsets: 0,
          legends: 0
        };
        
        forms.forEach((form, formIndex) => {
          const formInputs = form.querySelectorAll('input, textarea, select');
          const fieldsets = form.querySelectorAll('fieldset');
          const legends = form.querySelectorAll('legend');
          
          analysis.fieldsets += fieldsets.length;
          analysis.legends += legends.length;
          
          formInputs.forEach((input, inputIndex) => {
            const label = form.querySelector(`label[for="${input.id}"]`) ||
                         input.closest('label') ||
                         input.getAttribute('aria-label') ||
                         input.getAttribute('aria-labelledby');
            
            const elementData = {
              type: input.type || input.tagName.toLowerCase(),
              hasLabel: !!label,
              hasRequired: input.hasAttribute('required'),
              hasAriaDescribedBy: !!input.getAttribute('aria-describedby'),
              hasValidation: !!input.getAttribute('pattern') || !!input.getAttribute('min') || !!input.getAttribute('max'),
              placeholder: input.placeholder || '',
              id: input.id || `form-${formIndex}-input-${inputIndex}`
            };
            
            analysis.formElements.push(elementData);
            
            if (!elementData.hasLabel) {
              analysis.labelIssues.push({
                element: elementData.type,
                id: elementData.id,
                issue: 'Missing label'
              });
            }
            
            if (elementData.hasRequired && !elementData.hasAriaDescribedBy) {
              analysis.validationIssues.push({
                element: elementData.type,
                id: elementData.id,
                issue: 'Required field without proper description'
              });
            }
          });
        });
        
        return analysis;
      });
      
      // Test form interaction with keyboard
      const formFields = await this.page.$$('input, textarea, select');
      
      if (formFields.length > 0) {
        // Test first form field
        await formFields[0].focus();
        await this.takeScreenshot('form-accessibility-focus', 'Form field focus state');
        
        // Test form validation
        if (formFields.length > 1) {
          await formFields[0].type('test@example.com');
          await formFields[1].type('Test User');
          await this.takeScreenshot('form-accessibility-filled', 'Form fields filled');
          
          // Test tab to submit button
          await this.page.keyboard.press('Tab');
          await this.page.keyboard.press('Tab');
          await this.takeScreenshot('form-accessibility-submit-focus', 'Submit button focus');
        }
      } else {
        // Test on homepage forms if contact page has none
        await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        
        const homeFormFields = await this.page.$$('input, textarea');
        if (homeFormFields.length > 0) {
          await homeFormFields[0].focus();
          await this.takeScreenshot('form-accessibility-homepage', 'Homepage form accessibility');
        }
      }
      
      this.results.metrics.formAccessibility = formAnalysis;
      this.results.wcagCompliance.forms = {
        level: this.calculateFormAccessibilityLevel(formAnalysis),
        totalForms: formAnalysis.totalForms,
        labelIssues: formAnalysis.labelIssues.length,
        validationIssues: formAnalysis.validationIssues.length
      };
      
      console.log(`📝 Form Accessibility:`);
      console.log(`  Total Forms: ${formAnalysis.totalForms}`);
      console.log(`  Form Elements: ${formAnalysis.formElements.length}`);
      console.log(`  Label Issues: ${formAnalysis.labelIssues.length}`);
      console.log(`  Validation Issues: ${formAnalysis.validationIssues.length}`);
      console.log(`  Fieldsets/Legends: ${formAnalysis.fieldsets}/${formAnalysis.legends}`);
      
    } catch (error) {
      console.warn('⚠️ Form accessibility test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'form_accessibility',
        message: `Form accessibility test issue: ${error.message}`
      });
    }
  }

  async testImageAccessibility() {
    console.log('🖼️ Step 5: Testing Image Accessibility...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze image accessibility
      const imageAnalysis = await this.page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const analysis = {
          totalImages: images.length,
          withAltText: 0,
          withEmptyAlt: 0,
          withoutAlt: 0,
          decorativeImages: 0,
          informativeImages: 0,
          complexImages: 0,
          issues: []
        };
        
        images.forEach((img, index) => {
          const alt = img.getAttribute('alt');
          const src = img.src;
          const isDecorative = alt === '' || img.getAttribute('role') === 'presentation';
          
          if (alt !== null) {
            if (alt === '') {
              analysis.withEmptyAlt++;
              analysis.decorativeImages++;
            } else {
              analysis.withAltText++;
              
              // Categorize by alt text length
              if (alt.length > 100) {
                analysis.complexImages++;
              } else {
                analysis.informativeImages++;
              }
              
              // Check for poor alt text patterns
              const poorPatterns = ['image', 'picture', 'photo', 'img', 'graphic'];
              if (poorPatterns.some(pattern => alt.toLowerCase().includes(pattern))) {
                analysis.issues.push({
                  index: index,
                  src: src.substring(src.lastIndexOf('/') + 1),
                  alt: alt,
                  issue: 'Generic alt text detected'
                });
              }
            }
          } else {
            analysis.withoutAlt++;
            analysis.issues.push({
              index: index,
              src: src.substring(src.lastIndexOf('/') + 1),
              alt: null,
              issue: 'Missing alt attribute'
            });
          }
        });
        
        return analysis;
      });
      
      // Test image loading states
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.takeScreenshot('image-accessibility-loaded', 'Images loaded with accessibility analysis');
      
      // Test images with reduced motion
      await this.page.emulateMediaFeatures([{
        name: 'prefers-reduced-motion',
        value: 'reduce'
      }]);
      
      await this.takeScreenshot('image-accessibility-reduced-motion', 'Images with reduced motion preference');
      
      // Reset media features
      await this.page.emulateMediaFeatures([]);
      
      this.results.metrics.imageAccessibility = imageAnalysis;
      this.results.wcagCompliance.images = {
        level: imageAnalysis.withoutAlt === 0 && imageAnalysis.issues.length < 2 ? 'AA' : 'A',
        altTextCoverage: ((imageAnalysis.withAltText + imageAnalysis.withEmptyAlt) / imageAnalysis.totalImages * 100) || 100,
        issues: imageAnalysis.issues.length
      };
      
      console.log(`🖼️ Image Accessibility:`);
      console.log(`  Total Images: ${imageAnalysis.totalImages}`);
      console.log(`  With Alt Text: ${imageAnalysis.withAltText}`);
      console.log(`  Decorative (empty alt): ${imageAnalysis.withEmptyAlt}`);
      console.log(`  Without Alt: ${imageAnalysis.withoutAlt}`);
      console.log(`  Issues: ${imageAnalysis.issues.length}`);
      console.log(`  Coverage: ${this.results.wcagCompliance.images.altTextCoverage.toFixed(1)}%`);
      
    } catch (error) {
      console.warn('⚠️ Image accessibility test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'image_accessibility',
        message: `Image accessibility test issue: ${error.message}`
      });
    }
  }

  async testFocusManagement() {
    console.log('🎯 Step 6: Testing Focus Management...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test focus visibility
      const focusAnalysis = await this.page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        
        const analysis = {
          totalFocusable: focusableElements.length,
          withVisibleFocus: 0,
          withCustomFocus: 0,
          focusOrder: [],
          skipLinks: [],
          focusTraps: []
        };
        
        // Test focus visibility
        focusableElements.forEach((element, index) => {
          element.focus();
          const style = window.getComputedStyle(element, ':focus');
          const outlineStyle = style.outline;
          const boxShadow = style.boxShadow;
          
          if (outlineStyle !== 'none' || boxShadow !== 'none') {
            analysis.withVisibleFocus++;
          }
          
          // Check for custom focus styles
          if (style.getPropertyValue('--focus-ring') || 
              boxShadow.includes('rgb') || 
              element.classList.contains('focus:')) {
            analysis.withCustomFocus++;
          }
          
          element.blur();
        });
        
        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"], .skip-link');
        skipLinks.forEach(link => {
          analysis.skipLinks.push({
            href: link.href,
            text: link.textContent?.trim(),
            visible: window.getComputedStyle(link).visibility !== 'hidden'
          });
        });
        
        return analysis;
      });
      
      // Test focus order and navigation
      await this.page.keyboard.press('Tab');
      await this.takeScreenshot('focus-management-first-tab', 'First Tab focus');
      
      await this.page.keyboard.press('Tab');
      await this.page.keyboard.press('Tab');
      await this.takeScreenshot('focus-management-third-tab', 'Third Tab focus');
      
      // Test modal focus management (if modals exist)
      const modalTrigger = await this.page.$('[data-testid*="modal"], [aria-haspopup="dialog"], button[data-modal]');
      if (modalTrigger) {
        await modalTrigger.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.takeScreenshot('focus-management-modal', 'Modal focus management');
        
        // Test Escape to close
        await this.page.keyboard.press('Escape');
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Test focus restoration
      await this.page.evaluate(() => {
        const firstButton = document.querySelector('button');
        if (firstButton) {
          firstButton.focus();
          firstButton.click();
        }
      });
      
      await this.takeScreenshot('focus-management-restoration', 'Focus restoration test');
      
      this.results.metrics.focusManagement = focusAnalysis;
      this.results.wcagCompliance.focus = {
        level: focusAnalysis.withVisibleFocus >= focusAnalysis.totalFocusable * 0.9 ? 'AA' : 'A',
        visibleFocusPercentage: (focusAnalysis.withVisibleFocus / focusAnalysis.totalFocusable * 100) || 100,
        skipLinks: focusAnalysis.skipLinks.length
      };
      
      console.log(`🎯 Focus Management:`);
      console.log(`  Total Focusable: ${focusAnalysis.totalFocusable}`);
      console.log(`  With Visible Focus: ${focusAnalysis.withVisibleFocus}`);
      console.log(`  Custom Focus Styles: ${focusAnalysis.withCustomFocus}`);
      console.log(`  Skip Links: ${focusAnalysis.skipLinks.length}`);
      console.log(`  Focus Visibility: ${this.results.wcagCompliance.focus.visibleFocusPercentage.toFixed(1)}%`);
      
    } catch (error) {
      console.warn('⚠️ Focus management test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'focus_management',
        message: `Focus management test issue: ${error.message}`
      });
    }
  }

  async testAriaLabelsAndRoles() {
    console.log('🏷️ Step 7: Testing ARIA Labels and Roles...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze ARIA implementation
      const ariaAnalysis = await this.page.evaluate(() => {
        const analysis = {
          ariaLabels: 0,
          ariaLabelledBy: 0,
          ariaDescribedBy: 0,
          ariaRoles: {},
          ariaStates: {},
          ariaProperties: {},
          customComponents: 0,
          ariaIssues: []
        };
        
        const elements = document.querySelectorAll('*');
        
        elements.forEach((element, index) => {
          // Count ARIA attributes
          if (element.hasAttribute('aria-label')) analysis.ariaLabels++;
          if (element.hasAttribute('aria-labelledby')) analysis.ariaLabelledBy++;
          if (element.hasAttribute('aria-describedby')) analysis.ariaDescribedBy++;
          
          // Analyze roles
          const role = element.getAttribute('role');
          if (role) {
            analysis.ariaRoles[role] = (analysis.ariaRoles[role] || 0) + 1;
          }
          
          // Check for ARIA states and properties
          Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('aria-')) {
              if (attr.name.match(/aria-(expanded|selected|checked|disabled|hidden|pressed)/)) {
                analysis.ariaStates[attr.name] = (analysis.ariaStates[attr.name] || 0) + 1;
              } else {
                analysis.ariaProperties[attr.name] = (analysis.ariaProperties[attr.name] || 0) + 1;
              }
            }
          });
          
          // Check for custom components that might need ARIA
          if (element.classList.contains('dropdown') || 
              element.classList.contains('modal') ||
              element.classList.contains('tab') ||
              element.getAttribute('data-component')) {
            analysis.customComponents++;
            
            // Check if custom component has proper ARIA
            if (!role && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
              analysis.ariaIssues.push({
                element: element.tagName.toLowerCase(),
                class: Array.from(element.classList).join(' '),
                issue: 'Custom component missing ARIA attributes'
              });
            }
          }
          
          // Check for ARIA label references
          const labelledBy = element.getAttribute('aria-labelledby');
          if (labelledBy) {
            const referencedElement = document.getElementById(labelledBy);
            if (!referencedElement) {
              analysis.ariaIssues.push({
                element: element.tagName.toLowerCase(),
                id: element.id || `element-${index}`,
                issue: `aria-labelledby references non-existent element: ${labelledBy}`
              });
            }
          }
          
          const describedBy = element.getAttribute('aria-describedby');
          if (describedBy) {
            const referencedElement = document.getElementById(describedBy);
            if (!referencedElement) {
              analysis.ariaIssues.push({
                element: element.tagName.toLowerCase(),
                id: element.id || `element-${index}`,
                issue: `aria-describedby references non-existent element: ${describedBy}`
              });
            }
          }
        });
        
        return analysis;
      });
      
      // Test dynamic ARIA updates
      await this.page.evaluate(() => {
        // Simulate dynamic content change
        const buttons = document.querySelectorAll('button');
        if (buttons.length > 0) {
          const button = buttons[0];
          button.setAttribute('aria-pressed', 'false');
          
          setTimeout(() => {
            button.setAttribute('aria-pressed', 'true');
          }, 500);
        }
      });
      
      await this.takeScreenshot('aria-labels-roles', 'ARIA labels and roles analysis');
      
      // Test live regions
      await this.page.evaluate(() => {
        const liveRegion = document.querySelector('[aria-live]') || 
                          document.getElementById('sr-test-region');
        
        if (liveRegion) {
          liveRegion.textContent = 'Dynamic content update for screen readers';
        }
      });
      
      await this.takeScreenshot('aria-live-regions', 'ARIA live regions test');
      
      this.results.metrics.ariaLabelsAndRoles = ariaAnalysis;
      this.results.wcagCompliance.aria = {
        level: ariaAnalysis.ariaIssues.length === 0 ? 'AA' : ariaAnalysis.ariaIssues.length < 3 ? 'A' : 'Fail',
        labels: ariaAnalysis.ariaLabels,
        roles: Object.keys(ariaAnalysis.ariaRoles).length,
        issues: ariaAnalysis.ariaIssues.length
      };
      
      console.log(`🏷️ ARIA Labels and Roles:`);
      console.log(`  ARIA Labels: ${ariaAnalysis.ariaLabels}`);
      console.log(`  ARIA Roles: ${Object.keys(ariaAnalysis.ariaRoles).length} types`);
      console.log(`  ARIA States: ${Object.keys(ariaAnalysis.ariaStates).length} types`);
      console.log(`  Custom Components: ${ariaAnalysis.customComponents}`);
      console.log(`  ARIA Issues: ${ariaAnalysis.ariaIssues.length}`);
      
    } catch (error) {
      console.warn('⚠️ ARIA labels and roles test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'aria_labels_roles',
        message: `ARIA labels and roles test issue: ${error.message}`
      });
    }
  }

  async testMobileAccessibility() {
    console.log('📱 Step 8: Testing Mobile Accessibility...');
    
    try {
      // Switch to mobile viewport
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test mobile accessibility features
      const mobileA11yAnalysis = await this.page.evaluate(() => {
        const analysis = {
          touchTargets: [],
          viewportMeta: null,
          mobileNavigation: false,
          textScaling: false,
          orientation: window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
        };
        
        // Check viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          analysis.viewportMeta = viewportMeta.getAttribute('content');
        }
        
        // Analyze touch targets
        const interactiveElements = document.querySelectorAll(
          'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])'
        );
        
        interactiveElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          
          if (isVisible) {
            analysis.touchTargets.push({
              width: rect.width,
              height: rect.height,
              area: rect.width * rect.height,
              meets44px: rect.width >= 44 && rect.height >= 44,
              element: element.tagName.toLowerCase(),
              text: element.textContent?.substring(0, 20) || ''
            });
          }
        });
        
        // Check for mobile navigation
        const mobileNav = document.querySelector('[data-testid*="mobile"], .mobile-menu, .hamburger');
        analysis.mobileNavigation = !!mobileNav;
        
        return analysis;
      });
      
      // Test mobile navigation if it exists
      const mobileMenuToggle = await this.page.$('[data-testid*="mobile-menu"]');
      if (mobileMenuToggle) {
        await mobileMenuToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.takeScreenshot('mobile-accessibility-menu-open', 'Mobile menu accessibility');
        
        // Test keyboard navigation in mobile menu
        await this.page.keyboard.press('Tab');
        await this.page.keyboard.press('Tab');
        await this.takeScreenshot('mobile-accessibility-menu-keyboard', 'Mobile menu keyboard navigation');
        
        await mobileMenuToggle.click(); // Close menu
      }
      
      // Test touch target sizes
      await this.takeScreenshot('mobile-accessibility-touch-targets', 'Mobile touch targets analysis');
      
      // Test text scaling
      await this.page.evaluate(() => {
        document.documentElement.style.fontSize = '150%';
      });
      
      await this.takeScreenshot('mobile-accessibility-text-scaled', 'Mobile accessibility with scaled text');
      
      // Reset text scaling
      await this.page.evaluate(() => {
        document.documentElement.style.fontSize = '';
      });
      
      // Test landscape orientation
      await this.page.setViewport({ width: 667, height: 375 });
      await this.page.reload({ waitUntil: 'networkidle2' });
      await this.takeScreenshot('mobile-accessibility-landscape', 'Mobile accessibility landscape orientation');
      
      // Reset to desktop viewport
      await this.page.setViewport({ width: 1200, height: 800 });
      
      // Calculate touch target compliance
      const touchTargetCompliance = mobileA11yAnalysis.touchTargets.filter(t => t.meets44px).length;
      const touchTargetTotal = mobileA11yAnalysis.touchTargets.length;
      
      this.results.metrics.mobileAccessibility = mobileA11yAnalysis;
      this.results.wcagCompliance.mobile = {
        level: touchTargetCompliance >= touchTargetTotal * 0.9 ? 'AA' : 'A',
        touchTargetCompliance: touchTargetTotal > 0 ? (touchTargetCompliance / touchTargetTotal * 100) : 100,
        hasViewportMeta: !!mobileA11yAnalysis.viewportMeta,
        hasMobileNavigation: mobileA11yAnalysis.mobileNavigation
      };
      
      console.log(`📱 Mobile Accessibility:`);
      console.log(`  Touch Targets: ${touchTargetTotal}`);
      console.log(`  44px Compliant: ${touchTargetCompliance}`);
      console.log(`  Compliance: ${this.results.wcagCompliance.mobile.touchTargetCompliance.toFixed(1)}%`);
      console.log(`  Viewport Meta: ${!!mobileA11yAnalysis.viewportMeta}`);
      console.log(`  Mobile Navigation: ${mobileA11yAnalysis.mobileNavigation}`);
      
    } catch (error) {
      console.warn('⚠️ Mobile accessibility test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'mobile_accessibility',
        message: `Mobile accessibility test issue: ${error.message}`
      });
    }
  }

  async testAnimationAccessibility() {
    console.log('🎭 Step 9: Testing Animation & Motion Accessibility...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test default animations
      const animationAnalysis = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const analysis = {
          animatedElements: 0,
          autoplayingAnimations: 0,
          reducedMotionSupport: false,
          longAnimations: 0,
          infiniteAnimations: 0,
          flashingElements: 0
        };
        
        elements.forEach(element => {
          const style = window.getComputedStyle(element);
          const animation = style.animation;
          const transition = style.transition;
          
          // Check for animations
          if (animation !== 'none' && animation !== '') {
            analysis.animatedElements++;
            
            // Check for long animations (>5 seconds)
            const duration = animation.match(/(\d+\.?\d*)s/);
            if (duration && parseFloat(duration[1]) > 5) {
              analysis.longAnimations++;
            }
            
            // Check for infinite animations
            if (animation.includes('infinite')) {
              analysis.infiniteAnimations++;
            }
          }
          
          // Check for transitions
          if (transition !== 'none' && transition !== '') {
            const duration = transition.match(/(\d+\.?\d*)s/);
            if (duration && parseFloat(duration[1]) > 0.5) {
              analysis.animatedElements++;
            }
          }
          
          // Check for autoplay
          if (element.autoplay) {
            analysis.autoplayingAnimations++;
          }
        });
        
        // Check for prefers-reduced-motion support
        const stylesheets = Array.from(document.styleSheets);
        analysis.reducedMotionSupport = stylesheets.some(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            return rules.some(rule => 
              rule.conditionText && rule.conditionText.includes('prefers-reduced-motion')
            );
          } catch (e) {
            return false;
          }
        });
        
        return analysis;
      });
      
      await this.takeScreenshot('animation-accessibility-default', 'Default animation state');
      
      // Test with reduced motion preference
      await this.page.emulateMediaFeatures([{
        name: 'prefers-reduced-motion',
        value: 'reduce'
      }]);
      
      await this.page.reload({ waitUntil: 'networkidle2' });
      await this.takeScreenshot('animation-accessibility-reduced-motion', 'Reduced motion preference');
      
      // Test reduced motion implementation
      const reducedMotionAnalysis = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let reducedAnimations = 0;
        
        elements.forEach(element => {
          const style = window.getComputedStyle(element);
          const animation = style.animation;
          const transition = style.transition;
          
          // Check if animations are reduced
          if ((animation === 'none' || animation === '') && 
              (transition === 'none' || transition === '')) {
            reducedAnimations++;
          }
        });
        
        return { reducedAnimations };
      });
      
      // Reset media features
      await this.page.emulateMediaFeatures([]);
      
      // Test pause controls for animations
      await this.page.evaluate(() => {
        // Look for animation controls
        const playPauseButtons = document.querySelectorAll('[aria-label*="pause"], [aria-label*="play"], .animation-control');
        return playPauseButtons.length;
      });
      
      this.results.metrics.animationAccessibility = {
        ...animationAnalysis,
        reducedMotionImplementation: reducedMotionAnalysis
      };
      
      this.results.wcagCompliance.animations = {
        level: animationAnalysis.reducedMotionSupport && animationAnalysis.flashingElements === 0 ? 'AA' : 'A',
        reducedMotionSupport: animationAnalysis.reducedMotionSupport,
        autoplayingAnimations: animationAnalysis.autoplayingAnimations,
        longAnimations: animationAnalysis.longAnimations,
        infiniteAnimations: animationAnalysis.infiniteAnimations
      };
      
      console.log(`🎭 Animation Accessibility:`);
      console.log(`  Animated Elements: ${animationAnalysis.animatedElements}`);
      console.log(`  Reduced Motion Support: ${animationAnalysis.reducedMotionSupport}`);
      console.log(`  Autoplaying: ${animationAnalysis.autoplayingAnimations}`);
      console.log(`  Long Animations: ${animationAnalysis.longAnimations}`);
      console.log(`  Infinite Animations: ${animationAnalysis.infiniteAnimations}`);
      
    } catch (error) {
      console.warn('⚠️ Animation accessibility test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'animation_accessibility',
        message: `Animation accessibility test issue: ${error.message}`
      });
    }
  }

  async testTextScalingZoom() {
    console.log('🔍 Step 10: Testing Text Scaling and Zoom...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test default state
      await this.takeScreenshot('text-scaling-100', 'Text scaling - 100% (default)');
      
      // Test 150% zoom
      await this.page.evaluate(() => {
        document.documentElement.style.fontSize = '150%';
        document.body.style.zoom = '1.5';
      });
      
      await this.takeScreenshot('text-scaling-150', 'Text scaling - 150%');
      
      // Test 200% zoom
      await this.page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
        document.body.style.zoom = '2.0';
      });
      
      await this.takeScreenshot('text-scaling-200', 'Text scaling - 200%');
      
      // Analyze layout at 200% zoom
      const scalingAnalysis = await this.page.evaluate(() => {
        const analysis = {
          overflowElements: 0,
          hiddenContent: 0,
          brokenLayout: 0,
          inaccessibleElements: 0
        };
        
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          
          // Check for overflow
          if (style.overflow === 'hidden' && rect.width > window.innerWidth) {
            analysis.overflowElements++;
          }
          
          // Check for hidden content
          if (style.visibility === 'hidden' || style.display === 'none') {
            analysis.hiddenContent++;
          }
          
          // Check for elements outside viewport
          if (rect.left > window.innerWidth || rect.top > window.innerHeight) {
            analysis.inaccessibleElements++;
          }
        });
        
        return analysis;
      });
      
      // Test user zoom (browser zoom)
      await this.page.evaluate(() => {
        document.documentElement.style.fontSize = '';
        document.body.style.zoom = '';
      });
      
      await this.page.setViewport({ width: 600, height: 400 }); // Simulate zoomed viewport
      await this.takeScreenshot('text-scaling-browser-zoom', 'Browser zoom simulation');
      
      // Reset viewport
      await this.page.setViewport({ width: 1200, height: 800 });
      
      this.results.metrics.textScalingZoom = scalingAnalysis;
      this.results.wcagCompliance.textScaling = {
        level: scalingAnalysis.inaccessibleElements === 0 && scalingAnalysis.overflowElements < 3 ? 'AA' : 'A',
        overflowElements: scalingAnalysis.overflowElements,
        inaccessibleElements: scalingAnalysis.inaccessibleElements
      };
      
      console.log(`🔍 Text Scaling and Zoom:`);
      console.log(`  Overflow Elements: ${scalingAnalysis.overflowElements}`);
      console.log(`  Inaccessible Elements: ${scalingAnalysis.inaccessibleElements}`);
      console.log(`  Hidden Content: ${scalingAnalysis.hiddenContent}`);
      
    } catch (error) {
      console.warn('⚠️ Text scaling and zoom test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'text_scaling_zoom',
        message: `Text scaling and zoom test issue: ${error.message}`
      });
    }
  }

  async testPageStructure() {
    console.log('🏗️ Step 11: Testing Page Structure and Headings...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze page structure
      const structureAnalysis = await this.page.evaluate(() => {
        const analysis = {
          headingStructure: [],
          landmarks: [],
          pageTitle: document.title,
          lang: document.documentElement.lang,
          skipLinks: [],
          contentStructure: {
            hasMain: !!document.querySelector('main'),
            hasNav: !!document.querySelector('nav'),
            hasHeader: !!document.querySelector('header'),
            hasFooter: !!document.querySelector('footer'),
            hasAside: !!document.querySelector('aside')
          }
        };
        
        // Analyze heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let h1Count = 0;
        
        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1));
          const text = heading.textContent?.trim() || '';
          
          if (level === 1) h1Count++;
          
          analysis.headingStructure.push({
            level: level,
            text: text.substring(0, 60),
            id: heading.id || '',
            hasProperSequence: level <= previousLevel + 1,
            isEmpty: text.length === 0
          });
          
          previousLevel = level;
        });
        
        analysis.h1Count = h1Count;
        
        // Analyze landmarks
        const landmarkSelectors = [
          'main', 'nav', 'header', 'footer', 'aside', 'section',
          '[role="main"]', '[role="navigation"]', '[role="banner"]',
          '[role="contentinfo"]', '[role="complementary"]'
        ];
        
        landmarkSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            analysis.landmarks.push({
              element: element.tagName.toLowerCase(),
              role: element.getAttribute('role') || element.tagName.toLowerCase(),
              label: element.getAttribute('aria-label') || 
                     element.getAttribute('aria-labelledby') || '',
              id: element.id || ''
            });
          });
        });
        
        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"], .skip-link, .sr-only a');
        skipLinks.forEach(link => {
          const rect = link.getBoundingClientRect();
          analysis.skipLinks.push({
            href: link.href,
            text: link.textContent?.trim(),
            visible: rect.width > 0 && rect.height > 0,
            target: link.href.split('#')[1]
          });
        });
        
        return analysis;
      });
      
      await this.takeScreenshot('page-structure-overview', 'Page structure and landmarks');
      
      // Test heading navigation
      const headings = await this.page.$$('h1, h2, h3, h4, h5, h6');
      if (headings.length > 0) {
        for (let i = 0; i < Math.min(3, headings.length); i++) {
          await headings[i].scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        await this.takeScreenshot('page-structure-headings', 'Heading structure navigation');
      }
      
      // Test landmark navigation
      const main = await this.page.$('main');
      if (main) {
        await main.scrollIntoView();
        await this.takeScreenshot('page-structure-main-landmark', 'Main landmark');
      }
      
      this.results.metrics.pageStructure = structureAnalysis;
      this.results.wcagCompliance.structure = {
        level: this.calculateStructureLevel(structureAnalysis),
        hasPageTitle: !!structureAnalysis.pageTitle,
        hasLang: !!structureAnalysis.lang,
        h1Count: structureAnalysis.h1Count,
        landmarkCount: structureAnalysis.landmarks.length,
        skipLinkCount: structureAnalysis.skipLinks.length
      };
      
      console.log(`🏗️ Page Structure:`);
      console.log(`  Page Title: "${structureAnalysis.pageTitle}"`);
      console.log(`  Language: ${structureAnalysis.lang || 'Not set'}`);
      console.log(`  H1 Count: ${structureAnalysis.h1Count}`);
      console.log(`  Total Headings: ${structureAnalysis.headingStructure.length}`);
      console.log(`  Landmarks: ${structureAnalysis.landmarks.length}`);
      console.log(`  Skip Links: ${structureAnalysis.skipLinks.length}`);
      
    } catch (error) {
      console.warn('⚠️ Page structure test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'page_structure',
        message: `Page structure test issue: ${error.message}`
      });
    }
  }

  async testLinkAccessibility() {
    console.log('🔗 Step 12: Testing Link Accessibility...');
    
    try {
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Analyze link accessibility
      const linkAnalysis = await this.page.evaluate(() => {
        const links = document.querySelectorAll('a[href]');
        const analysis = {
          totalLinks: links.length,
          internalLinks: 0,
          externalLinks: 0,
          emptyLinks: 0,
          ambiguousLinks: 0,
          linksWithoutContext: 0,
          linksWithAriaLabel: 0,
          linkIssues: []
        };
        
        const currentDomain = window.location.hostname;
        const ambiguousTexts = ['click here', 'read more', 'more', 'here', 'link'];
        
        links.forEach((link, index) => {
          const href = link.href;
          const text = link.textContent?.trim() || '';
          const ariaLabel = link.getAttribute('aria-label');
          const title = link.title;
          
          // Categorize links
          try {
            const url = new URL(href);
            if (url.hostname === currentDomain || url.hostname === 'localhost') {
              analysis.internalLinks++;
            } else {
              analysis.externalLinks++;
            }
          } catch (e) {
            // Relative or malformed URL
            analysis.internalLinks++;
          }
          
          // Check for empty links
          if (!text && !ariaLabel && !title) {
            analysis.emptyLinks++;
            analysis.linkIssues.push({
              index: index,
              href: href.substring(0, 50),
              issue: 'Empty link without accessible text'
            });
          }
          
          // Check for ambiguous text
          if (ambiguousTexts.some(ambiguous => text.toLowerCase().includes(ambiguous))) {
            analysis.ambiguousLinks++;
            analysis.linkIssues.push({
              index: index,
              text: text,
              href: href.substring(0, 50),
              issue: 'Ambiguous link text'
            });
          }
          
          // Check for ARIA labels
          if (ariaLabel) {
            analysis.linksWithAriaLabel++;
          }
          
          // Check for links without sufficient context
          if (text.length > 0 && text.length < 4 && !ariaLabel && !title) {
            analysis.linksWithoutContext++;
            analysis.linkIssues.push({
              index: index,
              text: text,
              href: href.substring(0, 50),
              issue: 'Link text too short without additional context'
            });
          }
        });
        
        return analysis;
      });
      
      // Test link focus and hover states
      const links = await this.page.$$('a[href]');
      if (links.length > 0) {
        // Test first few links
        for (let i = 0; i < Math.min(3, links.length); i++) {
          await links[i].focus();
          await new Promise(resolve => setTimeout(resolve, 200));
          
          if (i === 0) {
            await this.takeScreenshot('link-accessibility-focus', 'Link focus state');
          }
          
          await links[i].hover();
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Test external link indicators
      await this.page.evaluate(() => {
        const externalLinks = document.querySelectorAll('a[href*="http"]:not([href*="localhost"])');
        externalLinks.forEach(link => {
          // Highlight external links for screenshot
          link.style.outline = '2px solid orange';
        });
      });
      
      await this.takeScreenshot('link-accessibility-external', 'External link indicators');
      
      this.results.metrics.linkAccessibility = linkAnalysis;
      this.results.wcagCompliance.links = {
        level: linkAnalysis.emptyLinks === 0 && linkAnalysis.ambiguousLinks < 3 ? 'AA' : 'A',
        totalLinks: linkAnalysis.totalLinks,
        emptyLinks: linkAnalysis.emptyLinks,
        ambiguousLinks: linkAnalysis.ambiguousLinks,
        issues: linkAnalysis.linkIssues.length
      };
      
      console.log(`🔗 Link Accessibility:`);
      console.log(`  Total Links: ${linkAnalysis.totalLinks}`);
      console.log(`  Internal/External: ${linkAnalysis.internalLinks}/${linkAnalysis.externalLinks}`);
      console.log(`  Empty Links: ${linkAnalysis.emptyLinks}`);
      console.log(`  Ambiguous Links: ${linkAnalysis.ambiguousLinks}`);
      console.log(`  With ARIA Labels: ${linkAnalysis.linksWithAriaLabel}`);
      console.log(`  Issues: ${linkAnalysis.linkIssues.length}`);
      
    } catch (error) {
      console.warn('⚠️ Link accessibility test warning:', error.message);
      this.results.issues.push({
        type: 'warning',
        category: 'link_accessibility',
        message: `Link accessibility test issue: ${error.message}`
      });
    }
  }

  // Helper methods for calculating WCAG levels
  calculateScreenReaderLevel(analysis) {
    const issues = analysis.missingAltText + analysis.missingFormLabels;
    const hasProperStructure = analysis.headingStructure.length > 0 && analysis.landmarks.length > 2;
    
    if (issues === 0 && hasProperStructure && analysis.ariaLabels > 0) return 'AA';
    if (issues < 3 && hasProperStructure) return 'A';
    return 'Fail';
  }

  calculateFormAccessibilityLevel(analysis) {
    if (analysis.labelIssues.length === 0 && analysis.validationIssues.length === 0) return 'AA';
    if (analysis.labelIssues.length < 2 && analysis.validationIssues.length < 2) return 'A';
    return 'Fail';
  }

  calculateStructureLevel(analysis) {
    const hasBasicStructure = analysis.contentStructure.hasMain && 
                            analysis.contentStructure.hasHeader;
    const hasGoodHeadings = analysis.h1Count === 1 && 
                          analysis.headingStructure.length > 2;
    
    if (hasBasicStructure && hasGoodHeadings && analysis.landmarks.length >= 3) return 'AA';
    if (hasBasicStructure && hasGoodHeadings) return 'A';
    return 'Fail';
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
    console.log('💡 Generating accessibility recommendations...');
    
    const recommendations = [];
    
    // Color contrast recommendations
    if (this.results.wcagCompliance.colorContrast?.level === 'Fail') {
      recommendations.push({
        category: 'Color Contrast',
        priority: 'High',
        issue: 'Poor color contrast ratios',
        recommendation: 'Ensure text has a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text',
        wcagGuideline: '1.4.3 Contrast (Minimum)'
      });
    }
    
    // Keyboard navigation recommendations
    if (this.results.wcagCompliance.keyboardAccessible?.percentage < 90) {
      recommendations.push({
        category: 'Keyboard Navigation',
        priority: 'High',
        issue: 'Insufficient keyboard accessibility',
        recommendation: 'Ensure all interactive elements are keyboard accessible and have visible focus indicators',
        wcagGuideline: '2.1.1 Keyboard, 2.4.7 Focus Visible'
      });
    }
    
    // Image accessibility recommendations
    if (this.results.wcagCompliance.images?.altTextCoverage < 95) {
      recommendations.push({
        category: 'Image Accessibility',
        priority: 'Medium',
        issue: 'Missing or inadequate alt text',
        recommendation: 'Provide meaningful alt text for informative images and empty alt text for decorative images',
        wcagGuideline: '1.1.1 Non-text Content'
      });
    }
    
    // Form accessibility recommendations
    if (this.results.wcagCompliance.forms?.labelIssues > 0) {
      recommendations.push({
        category: 'Form Accessibility',
        priority: 'High',
        issue: 'Form elements missing labels',
        recommendation: 'Associate all form controls with descriptive labels using label elements or aria-label',
        wcagGuideline: '1.3.1 Info and Relationships, 3.3.2 Labels or Instructions'
      });
    }
    
    // ARIA recommendations
    if (this.results.wcagCompliance.aria?.issues > 0) {
      recommendations.push({
        category: 'ARIA Implementation',
        priority: 'Medium',
        issue: 'ARIA attributes implementation issues',
        recommendation: 'Fix ARIA reference errors and ensure proper implementation of ARIA roles and properties',
        wcagGuideline: '4.1.2 Name, Role, Value'
      });
    }
    
    // Mobile accessibility recommendations
    if (this.results.wcagCompliance.mobile?.touchTargetCompliance < 90) {
      recommendations.push({
        category: 'Mobile Accessibility',
        priority: 'Medium',
        issue: 'Touch targets too small',
        recommendation: 'Ensure touch targets are at least 44x44 pixels for better accessibility',
        wcagGuideline: '2.5.5 Target Size'
      });
    }
    
    // Animation recommendations
    if (!this.results.wcagCompliance.animations?.reducedMotionSupport) {
      recommendations.push({
        category: 'Animation Accessibility',
        priority: 'Medium',
        issue: 'Missing reduced motion support',
        recommendation: 'Implement prefers-reduced-motion media query to respect user motion preferences',
        wcagGuideline: '2.3.3 Animation from Interactions'
      });
    }
    
    // Page structure recommendations
    if (this.results.wcagCompliance.structure?.h1Count !== 1) {
      recommendations.push({
        category: 'Page Structure',
        priority: 'Medium',
        issue: 'Improper heading structure',
        recommendation: 'Use exactly one H1 per page and maintain proper heading hierarchy',
        wcagGuideline: '1.3.1 Info and Relationships'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating Accessibility & WCAG Compliance report...');
    
    this.generateRecommendations();
    
    const report = {
      title: 'Accessibility Testing & WCAG Compliance Analysis Report',
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      summary: {
        totalScreenshots: this.results.screenshots.length,
        totalIssues: this.results.issues.length,
        totalRecommendations: this.results.recommendations.length,
        overallScore: this.calculateOverallScore(),
        wcagLevel: this.calculateOverallWCAGLevel()
      },
      wcagCompliance: this.results.wcagCompliance,
      metrics: this.results.metrics,
      accessibilityTests: this.results.accessibilityTests,
      screenshots: this.results.screenshots,
      issues: this.results.issues,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Address high-priority accessibility issues',
        'Implement missing ARIA labels and roles',
        'Improve color contrast for better readability',
        'Enhance keyboard navigation support',
        'Add prefers-reduced-motion support',
        'Conduct user testing with assistive technologies'
      ]
    };
    
    // Save report as JSON
    const reportPath = path.join(this.screenshotDir, 'accessibility-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save report as readable markdown
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'accessibility-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    
    return report;
  }

  calculateOverallScore() {
    let score = 100;
    
    // WCAG compliance scoring (50% of total)
    Object.values(this.results.wcagCompliance).forEach(compliance => {
      if (compliance.level === 'Fail') score -= 15;
      else if (compliance.level === 'A') score -= 8;
      // AA level gets no penalty
    });
    
    // Specific issue penalties (30% of total)
    if (this.results.metrics.colorContrast?.contrastIssues?.length > 5) score -= 10;
    if (this.results.metrics.imageAccessibility?.withoutAlt > 0) score -= 8;
    if (this.results.metrics.formAccessibility?.labelIssues?.length > 2) score -= 8;
    if (this.results.metrics.ariaLabelsAndRoles?.ariaIssues?.length > 3) score -= 8;
    
    // General issues penalties (20% of total)
    score -= this.results.issues.filter(i => i.type === 'critical').length * 10;
    score -= this.results.issues.filter(i => i.type === 'warning').length * 3;
    
    return Math.max(0, Math.round(score));
  }

  calculateOverallWCAGLevel() {
    const levels = Object.values(this.results.wcagCompliance).map(c => c.level);
    
    if (levels.includes('Fail')) return 'Fail';
    if (levels.includes('A')) return 'A';
    return 'AA';
  }

  generateMarkdownReport(report) {
    const wcag = report.wcagCompliance;
    const metrics = report.metrics;
    
    return `# Accessibility Testing & WCAG Compliance Analysis Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**URL:** ${report.url}  
**Overall Score:** ${report.summary.overallScore}/100  
**WCAG Compliance Level:** ${report.summary.wcagLevel}

## 📊 Summary

- **Screenshots Captured:** ${report.summary.totalScreenshots}
- **Issues Found:** ${report.summary.totalIssues}
- **Recommendations:** ${report.summary.totalRecommendations}
- **Overall WCAG Level:** ${report.summary.wcagLevel}

## ♿ WCAG 2.1 Compliance Status

| Test Category | Level | Status | Details |
|---------------|-------|--------|---------|
| **Color Contrast** | ${wcag.colorContrast?.level || 'N/A'} | ${wcag.colorContrast?.level === 'AA' ? '✅ Pass' : wcag.colorContrast?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.colorContrast?.issues || 0} issues, avg ratio: ${wcag.colorContrast?.averageRatio || 'N/A'} |
| **Keyboard Navigation** | ${wcag.keyboardAccessible?.level || 'N/A'} | ${wcag.keyboardAccessible?.level === 'AA' ? '✅ Pass' : wcag.keyboardAccessible?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.keyboardAccessible?.percentage || 'N/A'}% accessible |
| **Screen Reader** | ${wcag.screenReader?.level || 'N/A'} | ${wcag.screenReader?.level === 'AA' ? '✅ Pass' : wcag.screenReader?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.screenReader?.headings || 0} headings, ${wcag.screenReader?.landmarks || 0} landmarks |
| **Forms** | ${wcag.forms?.level || 'N/A'} | ${wcag.forms?.level === 'AA' ? '✅ Pass' : wcag.forms?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.forms?.labelIssues || 0} label issues |
| **Images** | ${wcag.images?.level || 'N/A'} | ${wcag.images?.level === 'AA' ? '✅ Pass' : wcag.images?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.images?.altTextCoverage?.toFixed(1) || 'N/A'}% coverage |
| **Focus Management** | ${wcag.focus?.level || 'N/A'} | ${wcag.focus?.level === 'AA' ? '✅ Pass' : wcag.focus?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.focus?.visibleFocusPercentage?.toFixed(1) || 'N/A'}% visible focus |
| **ARIA Implementation** | ${wcag.aria?.level || 'N/A'} | ${wcag.aria?.level === 'AA' ? '✅ Pass' : wcag.aria?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.aria?.issues || 0} issues |
| **Mobile Accessibility** | ${wcag.mobile?.level || 'N/A'} | ${wcag.mobile?.level === 'AA' ? '✅ Pass' : wcag.mobile?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.mobile?.touchTargetCompliance?.toFixed(1) || 'N/A'}% touch compliance |
| **Animations** | ${wcag.animations?.level || 'N/A'} | ${wcag.animations?.level === 'AA' ? '✅ Pass' : wcag.animations?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | Reduced motion: ${wcag.animations?.reducedMotionSupport ? 'Yes' : 'No'} |
| **Page Structure** | ${wcag.structure?.level || 'N/A'} | ${wcag.structure?.level === 'AA' ? '✅ Pass' : wcag.structure?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.structure?.h1Count || 0} H1, ${wcag.structure?.landmarkCount || 0} landmarks |
| **Links** | ${wcag.links?.level || 'N/A'} | ${wcag.links?.level === 'AA' ? '✅ Pass' : wcag.links?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.links?.issues || 0} issues |
| **Text Scaling** | ${wcag.textScaling?.level || 'N/A'} | ${wcag.textScaling?.level === 'AA' ? '✅ Pass' : wcag.textScaling?.level === 'A' ? '⚠️ Partial' : '❌ Fail'} | ${wcag.textScaling?.overflowElements || 0} overflow elements |

## 🔍 Detailed Analysis

### Color Contrast (WCAG 1.4.3)
- **Total Elements Tested:** ${metrics.colorContrast?.totalElements || 'N/A'}
- **Contrast Issues:** ${metrics.colorContrast?.contrastIssues?.length || 0}
- **Average Contrast Ratio:** ${metrics.colorContrast?.averageContrast?.toFixed(2) || 'N/A'}

### Keyboard Navigation (WCAG 2.1.1, 2.4.7)
- **Focusable Elements:** ${metrics.keyboardNavigation?.totalFocusableElements || 'N/A'}
- **Keyboard Accessible:** ${metrics.keyboardNavigation?.keyboardAccessible || 'N/A'}
- **Skip Links:** ${metrics.keyboardNavigation?.skipLinks || 0}

### Screen Reader Compatibility (WCAG 1.3.1, 4.1.2)
- **Heading Structure:** ${metrics.screenReaderCompatibility?.headingStructure?.length || 0} headings
- **Landmarks:** ${metrics.screenReaderCompatibility?.landmarks?.length || 0}
- **ARIA Labels:** ${metrics.screenReaderCompatibility?.ariaLabels || 0}
- **Form Labels:** ${metrics.screenReaderCompatibility?.formLabels || 0}/${(metrics.screenReaderCompatibility?.formLabels || 0) + (metrics.screenReaderCompatibility?.missingFormLabels || 0)}

### Image Accessibility (WCAG 1.1.1)
- **Total Images:** ${metrics.imageAccessibility?.totalImages || 'N/A'}
- **With Alt Text:** ${metrics.imageAccessibility?.withAltText || 0}
- **Decorative (empty alt):** ${metrics.imageAccessibility?.withEmptyAlt || 0}
- **Missing Alt:** ${metrics.imageAccessibility?.withoutAlt || 0}

### Mobile Accessibility (WCAG 2.5.5)
- **Touch Targets Tested:** ${metrics.mobileAccessibility?.touchTargets?.length || 'N/A'}
- **44px Compliant:** ${metrics.mobileAccessibility?.touchTargets?.filter(t => t.meets44px).length || 'N/A'}
- **Viewport Meta:** ${wcag.mobile?.hasViewportMeta ? 'Present' : 'Missing'}
- **Mobile Navigation:** ${wcag.mobile?.hasMobileNavigation ? 'Present' : 'Missing'}

## 📸 Screenshots Captured

${report.screenshots.map(s => `- **${s.filename}:** ${s.description}`).join('\n')}

## ⚠️ Issues Found

${report.issues.length > 0 ? report.issues.map(issue => 
  `- **${issue.type.toUpperCase()}:** ${issue.message}${issue.category ? ` (Category: ${issue.category})` : ''}`
).join('\n') : 'No critical issues found.'}

## 💡 Recommendations

${report.recommendations.map(rec => 
  `### ${rec.category} - ${rec.priority} Priority
- **Issue:** ${rec.issue}
- **Recommendation:** ${rec.recommendation}
- **WCAG Guideline:** ${rec.wcagGuideline}
`).join('\n')}

## 🎯 Next Steps

${report.nextSteps.map(step => `- ${step}`).join('\n')}

---
*Report generated by Tishya Foods Accessibility Testing & WCAG Compliance Analysis Tool*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runAccessibilityTest() {
  const tester = new AccessibilityTester();
  
  try {
    await tester.initialize();
    await tester.runAccessibilityTests();
    const report = await tester.generateReport();
    
    console.log('\n🎉 Accessibility Testing & WCAG Compliance Analysis Complete!');
    console.log('📊 Overall Score:', report.summary.overallScore + '/100');
    console.log('♿ WCAG Level:', report.summary.wcagLevel);
    console.log('📁 Results saved to:', tester.screenshotDir);
    
    // Display key accessibility metrics
    console.log('\n📈 Key Accessibility Metrics:');
    if (report.wcagCompliance.colorContrast) {
      console.log(`🎨 Color Contrast: ${report.wcagCompliance.colorContrast.level} (${report.wcagCompliance.colorContrast.issues} issues)`);
    }
    if (report.wcagCompliance.keyboardAccessible) {
      console.log(`⌨️ Keyboard Access: ${report.wcagCompliance.keyboardAccessible.percentage}% accessible`);
    }
    if (report.wcagCompliance.images) {
      console.log(`🖼️ Image Alt Text: ${report.wcagCompliance.images.altTextCoverage.toFixed(1)}% coverage`);
    }
    if (report.wcagCompliance.mobile) {
      console.log(`📱 Touch Targets: ${report.wcagCompliance.mobile.touchTargetCompliance.toFixed(1)}% compliant`);
    }
    
    return report;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  } finally {
    await tester.cleanup();
  }
}

// Export for use in other modules
module.exports = { AccessibilityTester, runAccessibilityTest };

// Run if called directly
if (require.main === module) {
  runAccessibilityTest()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}