const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running mobile responsiveness tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('mobile-responsiveness');

  try {
    const responsiveResults = [];
    const testPages = [
      { path: '/', name: 'Homepage' },
      { path: '/products', name: 'Products' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/cart', name: 'Cart' }
    ];

    const viewports = [
      { name: 'mobile', ...config.viewports.mobile },
      { name: 'mobileL', ...config.viewports.mobileL },
      { name: 'tablet', ...config.viewports.tablet },
      { name: 'laptop', ...config.viewports.laptop },
      { name: 'desktop', ...config.viewports.desktop }
    ];

    // Test 1-5: Multi-viewport testing for each page
    for (const testPage of testPages) {
      console.log(`Testing ${testPage.name} across viewports...`);
      
      const pageResults = {
        page: testPage.name,
        path: testPage.path,
        viewportResults: []
      };

      for (const viewport of viewports) {
        console.log(`  Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await page.setViewport(viewport);
        await testUtils.navigateToPage(page, testPage.path);
        await testUtils.waitForElement(page, 'body');
        
        // Test layout and content visibility
        const layoutTest = await page.evaluate(() => {
          const body = document.body;
          const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
          };
          
          // Check for horizontal scrollbars
          const hasHorizontalScroll = body.scrollWidth > viewport.width;
          
          // Check for visible elements
          const visibleElements = {
            navigation: !!document.querySelector('nav'),
            mainContent: !!document.querySelector('main, [role="main"]'),
            footer: !!document.querySelector('footer'),
            header: !!document.querySelector('header')
          };
          
          // Check for overlapping elements
          const elements = Array.from(document.querySelectorAll('*')).slice(0, 50);
          let overlappingElements = 0;
          
          elements.forEach((el, i) => {
            if (i < elements.length - 1) {
              const rect1 = el.getBoundingClientRect();
              const rect2 = elements[i + 1].getBoundingClientRect();
              
              if (rect1.right > rect2.left && rect1.left < rect2.right &&
                  rect1.bottom > rect2.top && rect1.top < rect2.bottom) {
                overlappingElements++;
              }
            }
          });
          
          return {
            viewport,
            hasHorizontalScroll,
            visibleElements,
            overlappingElements
          };
        });

        // Test touch targets for mobile viewports
        let touchTargetTest = null;
        if (viewport.width <= 768) {
          touchTargetTest = await page.evaluate(() => {
            const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]');
            const adequateTargets = [];
            const inadequateTargets = [];
            
            Array.from(touchTargets).forEach(target => {
              const rect = target.getBoundingClientRect();
              const size = Math.min(rect.width, rect.height);
              
              if (size >= 44) { // WCAG AA standard
                adequateTargets.push(target.tagName);
              } else {
                inadequateTargets.push({
                  tag: target.tagName,
                  size: Math.round(size),
                  text: target.textContent.trim().substring(0, 20)
                });
              }
            });
            
            return {
              total: touchTargets.length,
              adequate: adequateTargets.length,
              inadequate: inadequateTargets.length,
              inadequateExamples: inadequateTargets.slice(0, 3)
            };
          });
        }

        // Test mobile-specific features
        const mobileFeatures = await page.evaluate(() => {
          return {
            hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
            hasHamburgerMenu: !!document.querySelector('[data-testid="mobile-menu-button"], .hamburger, .menu-toggle'),
            hasMobileNavigation: !!document.querySelector('[data-testid="mobile-menu"], .mobile-nav'),
            responsiveImages: Array.from(document.querySelectorAll('img')).some(img => 
              img.hasAttribute('srcset') || img.hasAttribute('sizes')
            ),
            responsiveFonts: getComputedStyle(document.body).fontSize !== '16px'
          };
        });

        const viewportResult = {
          viewport: viewport.name,
          dimensions: `${viewport.width}x${viewport.height}`,
          layoutTest,
          touchTargetTest,
          mobileFeatures,
          timestamp: new Date().toISOString()
        };

        pageResults.viewportResults.push(viewportResult);
        
        // Take screenshot for this viewport
        await testUtils.takeScreenshot(page, `${testPage.name}-${viewport.name}`, {
          fullPage: true
        });
      }

      responsiveResults.push(pageResults);
    }

    // Test 6: Responsive image testing
    console.log('Testing responsive images...');
    await page.setViewport(config.viewports.mobile);
    await testUtils.navigateToPage(page, '/');
    
    const imageResponsiveness = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      
      return images.map(img => ({
        src: img.src,
        hasSourceSet: !!img.srcset,
        hasSizes: !!img.sizes,
        naturalWidth: img.naturalWidth,
        displayWidth: img.offsetWidth,
        isOverflowing: img.offsetWidth > window.innerWidth,
        loading: img.loading || 'eager'
      }));
    });
    
    console.log('Responsive Images Analysis:', {
      total: imageResponsiveness.length,
      withSrcset: imageResponsiveness.filter(img => img.hasSourceSet).length,
      withSizes: imageResponsiveness.filter(img => img.hasSizes).length,
      overflowing: imageResponsiveness.filter(img => img.isOverflowing).length,
      lazyLoaded: imageResponsiveness.filter(img => img.loading === 'lazy').length
    });

    // Test 7: Mobile form usability
    console.log('Testing mobile form usability...');
    await testUtils.navigateToPage(page, '/contact');
    
    const formUsability = await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      const results = [];
      
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        const formResult = {
          inputCount: inputs.length,
          mobileOptimized: 0,
          appropriateKeyboards: 0,
          adequateSpacing: 0
        };
        
        inputs.forEach(input => {
          const style = getComputedStyle(input);
          const rect = input.getBoundingClientRect();
          
          // Check input height for mobile (should be at least 44px)
          if (rect.height >= 44) {
            formResult.mobileOptimized++;
          }
          
          // Check for appropriate input types
          if (input.type === 'email' || input.type === 'tel' || input.type === 'number') {
            formResult.appropriateKeyboards++;
          }
          
          // Check spacing between form elements
          const marginBottom = parseFloat(style.marginBottom);
          if (marginBottom >= 16) {
            formResult.adequateSpacing++;
          }
        });
        
        results.push(formResult);
      });
      
      return results;
    });
    
    console.log('Mobile Form Usability:', formUsability);

    // Test 8: Mobile menu functionality
    console.log('Testing mobile menu functionality...');
    await page.setViewport(config.viewports.mobile);
    await testUtils.navigateToPage(page, '/');
    
    const mobileMenuTest = await page.evaluate(() => {
      const menuButton = document.querySelector('[data-testid="mobile-menu-button"], .hamburger, .menu-toggle');
      const mobileMenu = document.querySelector('[data-testid="mobile-menu"], .mobile-nav, .mobile-navigation');
      
      return {
        hasMenuButton: !!menuButton,
        hasMobileMenu: !!mobileMenu,
        menuButtonVisible: menuButton ? getComputedStyle(menuButton).display !== 'none' : false,
        menuButtonAccessible: menuButton ? menuButton.getAttribute('aria-label') || menuButton.textContent.trim() : false
      };
    });
    
    if (mobileMenuTest.hasMenuButton) {
      // Test menu interaction
      await testUtils.clickElement(page, '[data-testid="mobile-menu-button"], .hamburger, .menu-toggle');
      await page.waitForTimeout(500);
      
      const menuOpenTest = await page.evaluate(() => {
        const menu = document.querySelector('[data-testid="mobile-menu"], .mobile-nav, .mobile-navigation');
        return {
          menuVisible: menu ? getComputedStyle(menu).display !== 'none' : false,
          menuAccessible: menu ? menu.getAttribute('aria-expanded') === 'true' : false
        };
      });
      
      mobileMenuTest.menuOpenTest = menuOpenTest;
      console.log('✓ Mobile menu interaction tested');
    }
    
    console.log('Mobile Menu Test:', mobileMenuTest);

    // Test 9: Orientation change handling
    console.log('Testing orientation changes...');
    
    // Portrait mode
    await page.setViewport({ width: 375, height: 667 });
    await testUtils.navigateToPage(page, '/');
    await page.waitForTimeout(1000);
    
    const portraitLayout = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
    }));
    
    // Landscape mode
    await page.setViewport({ width: 667, height: 375 });
    await page.reload();
    await page.waitForTimeout(1000);
    
    const landscapeLayout = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
    }));
    
    console.log('Orientation Test:', {
      portrait: portraitLayout,
      landscape: landscapeLayout
    });

    // Test 10: Text readability and scaling
    console.log('Testing text readability...');
    await page.setViewport(config.viewports.mobile);
    await testUtils.navigateToPage(page, '/');
    
    const textReadability = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
      const fontSizes = [];
      let smallTextCount = 0;
      
      Array.from(textElements).slice(0, 100).forEach(el => {
        if (el.textContent.trim().length > 0) {
          const style = getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          
          fontSizes.push(fontSize);
          
          if (fontSize < 16) { // Smaller than recommended mobile font size
            smallTextCount++;
          }
        }
      });
      
      return {
        totalTextElements: textElements.length,
        averageFontSize: fontSizes.length > 0 ? Math.round(fontSizes.reduce((a, b) => a + b) / fontSizes.length) : 0,
        smallTextElements: smallTextCount,
        fontSizeRange: {
          min: Math.min(...fontSizes),
          max: Math.max(...fontSizes)
        }
      };
    });
    
    console.log('Text Readability:', textReadability);

    // Test 11: Mobile performance
    console.log('Testing mobile performance...');
    await page.setViewport(config.viewports.mobile);
    await testUtils.navigateToPage(page, '/');
    
    const mobilePerformance = await testUtils.measurePerformance(page);
    console.log('Mobile Performance:', {
      pageLoad: mobilePerformance.pageLoad,
      firstContentfulPaint: mobilePerformance.firstContentfulPaint,
      resourceCount: mobilePerformance.resourceStats?.requests || 0
    });

    // Test 12: Touch gesture support
    console.log('Testing touch gesture support...');
    
    // Test swipe gestures (if carousel or swipeable content exists)
    const swipeableElements = await page.$$('[data-testid="carousel"], [data-testid="swiper"], .swiper, .carousel');
    if (swipeableElements.length > 0) {
      console.log(`Found ${swipeableElements.length} swipeable elements`);
      
      // Simulate touch swipe
      const element = swipeableElements[0];
      const boundingBox = await element.boundingBox();
      
      if (boundingBox) {
        await page.touchscreen.tap(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
        await page.waitForTimeout(500);
        console.log('✓ Touch interaction tested');
      }
    }

    // Test 13: Responsive breakpoints
    console.log('Testing responsive breakpoints...');
    const breakpointTests = [];
    
    const testBreakpoints = [320, 480, 768, 1024, 1200, 1400];
    
    for (const width of testBreakpoints) {
      await page.setViewport({ width, height: 800 });
      await testUtils.navigateToPage(page, '/');
      
      const breakpointResult = await page.evaluate((testWidth) => {
        const body = document.body;
        const computedStyle = getComputedStyle(body);
        
        return {
          width: testWidth,
          hasHorizontalScroll: body.scrollWidth > window.innerWidth,
          bodyWidth: body.offsetWidth,
          visibleNavigation: !!document.querySelector('nav:not([style*="display: none"])')
        };
      }, width);
      
      breakpointTests.push(breakpointResult);
    }
    
    console.log('Breakpoint Tests:', breakpointTests.map(test => 
      `${test.width}px: ${test.hasHorizontalScroll ? 'scroll' : 'no-scroll'}`
    ).join(', '));

    // Generate comprehensive report
    const finalReport = {
      timestamp: new Date().toISOString(),
      responsiveResults,
      imageResponsiveness: {
        summary: {
          total: imageResponsiveness.length,
          withSrcset: imageResponsiveness.filter(img => img.hasSourceSet).length,
          overflowing: imageResponsiveness.filter(img => img.isOverflowing).length
        }
      },
      formUsability: formUsability,
      mobileMenu: mobileMenuTest,
      orientationTest: {
        portrait: portraitLayout,
        landscape: landscapeLayout
      },
      textReadability,
      mobilePerformance: {
        pageLoad: mobilePerformance.pageLoad,
        fcp: mobilePerformance.firstContentfulPaint
      },
      breakpointTests,
      summary: {
        totalPagesTested: responsiveResults.length,
        totalViewportsTested: viewports.length,
        criticalIssues: responsiveResults.filter(result => 
          result.viewportResults.some(vr => vr.layoutTest.hasHorizontalScroll)
        ).length
      }
    };

    // Save responsive report
    await testUtils.saveTestResults('mobile-responsiveness-report', finalReport);
    console.log('✓ Mobile responsiveness report saved');

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'mobile-responsiveness-final');
    
    console.log('Mobile responsiveness tests completed successfully');
    console.log('Summary:', finalReport.summary);
    
    // Check for critical responsive issues
    if (finalReport.summary.criticalIssues > 0) {
      console.warn(`⚠ ${finalReport.summary.criticalIssues} pages have horizontal scroll issues`);
    }
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };