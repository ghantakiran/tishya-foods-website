const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running accessibility tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('accessibility');

  try {
    const accessibilityResults = [];
    const testPages = [
      { path: '/', name: 'Homepage' },
      { path: '/products', name: 'Products' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/cart', name: 'Cart' }
    ];

    // Test 1-5: Page-by-page accessibility audit
    for (const testPage of testPages) {
      console.log(`Testing accessibility for ${testPage.name}...`);
      
      await testUtils.navigateToPage(page, testPage.path);
      await testUtils.waitForElement(page, 'main, body');
      
      const result = await testUtils.checkAccessibility(page, {
        tags: config.accessibility.tags,
        exclude: config.accessibility.exclude
      });
      
      result.page = testPage.name;
      result.path = testPage.path;
      accessibilityResults.push(result);
      
      console.log(`✓ ${testPage.name} Accessibility Score: ${result.score}%`);
      console.log(`  Violations: ${result.violations.length}`);
      console.log(`  Passes: ${result.passes}`);
      
      if (result.violations.length > 0) {
        console.log('  Top violations:');
        result.violations.slice(0, 3).forEach((violation, index) => {
          console.log(`    ${index + 1}. ${violation.id}: ${violation.description}`);
        });
      }
    }

    // Test 6: Keyboard navigation
    console.log('Testing keyboard navigation...');
    await testUtils.navigateToPage(page, '/');
    
    // Test Tab navigation
    const focusableElements = await page.$$eval('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])', 
      elements => elements.length
    );
    console.log(`Found ${focusableElements} focusable elements`);
    
    // Test keyboard navigation through first few elements
    for (let i = 0; i < Math.min(10, focusableElements); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
    console.log('✓ Keyboard navigation tested');

    // Test 7: Skip links
    await testUtils.navigateToPage(page, '/');
    await page.keyboard.press('Tab');
    
    const skipLink = await page.$('[data-testid="skip-link"], a[href="#main-content"]');
    if (skipLink) {
      const skipLinkText = await skipLink.textContent();
      console.log('✓ Skip link found:', skipLinkText);
      
      await skipLink.click();
      const focusedElement = await page.evaluate(() => document.activeElement.id);
      console.log('✓ Skip link navigation tested, focused:', focusedElement);
    } else {
      console.log('⚠ Skip link not found');
    }

    // Test 8: Focus management
    console.log('Testing focus management...');
    
    // Test modal focus (if modal exists)
    const modalTrigger = await page.$('[data-testid="modal-trigger"], button[data-modal]');
    if (modalTrigger) {
      await modalTrigger.click();
      await page.waitForTimeout(500);
      
      const modal = await page.$('[role="dialog"], [data-testid="modal"]');
      if (modal) {
        const focusedElement = await page.evaluate(() => document.activeElement.tagName);
        console.log('✓ Modal focus management tested, focused element:', focusedElement);
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    // Test 9: Form accessibility
    console.log('Testing form accessibility...');
    await testUtils.navigateToPage(page, '/contact');
    
    const formAccessibility = await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      const results = [];
      
      forms.forEach((form, index) => {
        const inputs = form.querySelectorAll('input, select, textarea');
        const labels = form.querySelectorAll('label');
        
        const formResult = {
          formIndex: index,
          inputCount: inputs.length,
          labelCount: labels.length,
          inputsWithLabels: 0,
          inputsWithAriaLabel: 0,
          requiredFieldsMarked: 0
        };
        
        inputs.forEach(input => {
          // Check for labels
          const hasLabel = input.id && form.querySelector(`label[for="${input.id}"]`);
          const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
          
          if (hasLabel) formResult.inputsWithLabels++;
          if (hasAriaLabel) formResult.inputsWithAriaLabel++;
          
          // Check required field marking
          if (input.required && (input.getAttribute('aria-required') || hasLabel)) {
            formResult.requiredFieldsMarked++;
          }
        });
        
        results.push(formResult);
      });
      
      return results;
    });
    
    formAccessibility.forEach((result, index) => {
      console.log(`Form ${index + 1}:`, {
        inputs: result.inputCount,
        labels: result.labelCount,
        labeled: result.inputsWithLabels,
        ariaLabeled: result.inputsWithAriaLabel
      });
    });

    // Test 10: Color contrast
    console.log('Testing color contrast...');
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      
      Array.from(elements).slice(0, 100).forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          // This is a simplified check - in real scenarios you'd use a proper contrast calculator
          if (color === backgroundColor) {
            issues.push({
              tag: el.tagName,
              color: color,
              backgroundColor: backgroundColor
            });
          }
        }
      });
      
      return issues.slice(0, 5); // Return first 5 issues
    });
    
    console.log(`Color contrast issues found: ${contrastIssues.length}`);

    // Test 11: Image alt text
    console.log('Testing image alt text...');
    const imageAccessibility = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return {
        totalImages: images.length,
        imagesWithAlt: images.filter(img => img.alt && img.alt.trim() !== '').length,
        decorativeImages: images.filter(img => img.alt === '').length,
        imagesWithoutAlt: images.filter(img => !img.hasAttribute('alt')).length
      };
    });
    
    console.log('Image Accessibility:', imageAccessibility);

    // Test 12: Heading structure
    console.log('Testing heading structure...');
    const headingStructure = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.map(h => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent.trim().substring(0, 50),
        hasId: !!h.id
      }));
    });
    
    console.log('Heading Structure:');
    headingStructure.slice(0, 10).forEach((heading, index) => {
      console.log(`  H${heading.level}: ${heading.text}${heading.hasId ? ' (has ID)' : ''}`);
    });

    // Check for proper heading hierarchy
    let headingHierarchyValid = true;
    for (let i = 1; i < headingStructure.length; i++) {
      const current = headingStructure[i];
      const previous = headingStructure[i - 1];
      
      if (current.level > previous.level + 1) {
        headingHierarchyValid = false;
        break;
      }
    }
    console.log('✓ Heading hierarchy valid:', headingHierarchyValid);

    // Test 13: ARIA landmarks
    console.log('Testing ARIA landmarks...');
    const landmarks = await page.evaluate(() => {
      const landmarkSelectors = [
        'main, [role="main"]',
        'nav, [role="navigation"]',
        'header, [role="banner"]',
        'footer, [role="contentinfo"]',
        'aside, [role="complementary"]',
        '[role="search"]'
      ];
      
      return landmarkSelectors.map(selector => ({
        selector: selector,
        count: document.querySelectorAll(selector).length
      }));
    });
    
    console.log('ARIA Landmarks:');
    landmarks.forEach(landmark => {
      console.log(`  ${landmark.selector}: ${landmark.count}`);
    });

    // Test 14: Interactive elements
    console.log('Testing interactive elements...');
    const interactiveElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]');
      let withoutAccessibleName = 0;
      let withKeyboardAccess = 0;
      
      Array.from(elements).forEach(el => {
        const hasAccessibleName = el.textContent.trim() || 
                                 el.getAttribute('aria-label') || 
                                 el.getAttribute('aria-labelledby') ||
                                 el.getAttribute('title');
        
        if (!hasAccessibleName) withoutAccessibleName++;
        
        const isKeyboardAccessible = el.tabIndex >= 0 || 
                                   ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
        
        if (isKeyboardAccessible) withKeyboardAccess++;
      });
      
      return {
        total: elements.length,
        withoutAccessibleName,
        withKeyboardAccess
      };
    });
    
    console.log('Interactive Elements:', interactiveElements);

    // Test 15: Mobile accessibility
    console.log('Testing mobile accessibility...');
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await testUtils.waitForElement(page, 'body');
    
    const mobileAccessibility = await testUtils.checkAccessibility(page, {
      tags: ['wcag2a', 'wcag2aa'],
      exclude: config.accessibility.exclude
    });
    
    console.log('✓ Mobile Accessibility Score:', mobileAccessibility.score + '%');

    // Test 16: Touch target sizes (mobile)
    const touchTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]');
      const smallTargets = [];
      
      Array.from(interactiveElements).forEach(el => {
        const rect = el.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        
        if (size < 44) { // WCAG guideline for touch targets
          smallTargets.push({
            tag: el.tagName,
            size: Math.round(size),
            text: el.textContent.trim().substring(0, 30)
          });
        }
      });
      
      return {
        totalInteractive: interactiveElements.length,
        smallTargets: smallTargets.length,
        examples: smallTargets.slice(0, 3)
      };
    });
    
    console.log('Touch Target Analysis:', touchTargets);

    // Generate final accessibility report
    const finalReport = {
      timestamp: new Date().toISOString(),
      overallResults: accessibilityResults,
      keyboardNavigation: {
        focusableElements: focusableElements,
        tested: true
      },
      formAccessibility: formAccessibility,
      imageAccessibility: imageAccessibility,
      headingStructure: {
        total: headingStructure.length,
        hierarchyValid: headingHierarchyValid
      },
      landmarks: landmarks,
      interactiveElements: interactiveElements,
      mobileAccessibility: {
        score: mobileAccessibility.score,
        violations: mobileAccessibility.violations.length
      },
      touchTargets: touchTargets,
      summary: {
        averageScore: Math.round(accessibilityResults.reduce((sum, result) => sum + result.score, 0) / accessibilityResults.length),
        totalViolations: accessibilityResults.reduce((sum, result) => sum + result.violations.length, 0),
        criticalIssues: accessibilityResults.filter(result => result.score < 70).length
      }
    };

    // Save accessibility report
    await testUtils.saveTestResults('accessibility-report', finalReport);
    console.log('✓ Accessibility report saved');

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'accessibility-final');
    
    console.log('Accessibility tests completed successfully');
    console.log('Final Summary:', finalReport.summary);
    
    // Check for critical accessibility issues
    if (finalReport.summary.criticalIssues > 0) {
      console.warn(`⚠ ${finalReport.summary.criticalIssues} pages have critical accessibility issues (score < 70%)`);
    }
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };