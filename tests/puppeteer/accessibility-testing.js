#!/usr/bin/env node

const puppeteer = require('puppeteer');
const config = require('./config/test-config');
const testUtils = require('./utils/test-utils');

async function runAccessibilityTests() {
  console.log('♿ Starting Accessibility Testing Suite...');
  
  const browser = await testUtils.launchBrowser(puppeteer);
  const results = {
    testType: 'accessibility',
    startTime: new Date(),
    pages: [],
    summary: {
      averageScore: 0,
      totalViolations: 0,
      totalPages: 0,
      passedPages: 0,
      failedPages: 0,
      criticalIssues: 0
    }
  };

  try {
    const testPages = [
      { path: '/', name: 'Homepage' },
      { path: '/products', name: 'Products' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/cart', name: 'Cart' },
      { path: '/auth/login', name: 'Login' }
    ];

    for (const testPage of testPages) {
      console.log(`\n♿ Testing accessibility for ${testPage.name}...`);
      
      const page = await testUtils.createPage(browser);
      
      try {
        // Navigate to page
        await testUtils.navigateToPage(page, testPage.path);
        await testUtils.waitForElement(page, 'body');
        
        // Run accessibility audit
        const accessibilityResult = await testUtils.checkAccessibility(page, {
          tags: config.accessibility.tags,
          exclude: config.accessibility.exclude
        });

        // Additional accessibility checks
        const additionalChecks = await page.evaluate(() => {
          // Check for alt text on images
          const images = Array.from(document.querySelectorAll('img'));
          const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
          
          // Check for heading hierarchy
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          let headingHierarchyValid = true;
          for (let i = 1; i < headings.length; i++) {
            const current = parseInt(headings[i].tagName.substring(1));
            const previous = parseInt(headings[i - 1].tagName.substring(1));
            if (current > previous + 1) {
              headingHierarchyValid = false;
              break;
            }
          }
          
          // Check for focus indicators
          const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          
          // Check for ARIA landmarks
          const landmarks = {
            main: document.querySelectorAll('main, [role="main"]').length,
            nav: document.querySelectorAll('nav, [role="navigation"]').length,
            header: document.querySelectorAll('header, [role="banner"]').length,
            footer: document.querySelectorAll('footer, [role="contentinfo"]').length
          };
          
          return {
            images: {
              total: images.length,
              withoutAlt: imagesWithoutAlt.length
            },
            headings: {
              total: headings.length,
              hierarchyValid: headingHierarchyValid
            },
            focusableElements: focusableElements.length,
            landmarks
          };
        });

        const pageResult = {
          page: testPage.name,
          path: testPage.path,
          score: accessibilityResult.score,
          violations: accessibilityResult.violations.length,
          violationDetails: accessibilityResult.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length
          })),
          passes: accessibilityResult.passes,
          additionalChecks,
          passed: accessibilityResult.score >= 70 && accessibilityResult.violations.length === 0,
          timestamp: new Date().toISOString()
        };

        results.pages.push(pageResult);
        
        console.log(`  📊 Accessibility Score: ${accessibilityResult.score}%`);
        console.log(`  🔍 Violations: ${accessibilityResult.violations.length}`);
        console.log(`  ✅ Passes: ${accessibilityResult.passes}`);
        console.log(`  🖼️  Images without alt: ${additionalChecks.images.withoutAlt}/${additionalChecks.images.total}`);
        console.log(`  📑 Heading hierarchy: ${additionalChecks.headings.hierarchyValid ? 'Valid' : 'Invalid'}`);
        
        if (accessibilityResult.violations.length > 0) {
          console.log('  ⚠️  Top violations:');
          accessibilityResult.violations.slice(0, 3).forEach((violation, index) => {
            console.log(`    ${index + 1}. ${violation.id} (${violation.impact}): ${violation.description}`);
          });
        }
        
        if (pageResult.passed) {
          results.summary.passedPages++;
          console.log(`  ✅ ${testPage.name} passed accessibility checks`);
        } else {
          results.summary.failedPages++;
          console.log(`  ❌ ${testPage.name} has accessibility issues`);
          
          if (accessibilityResult.score < 50) {
            results.summary.criticalIssues++;
          }
        }
        
        // Take screenshot
        await testUtils.takeScreenshot(page, `accessibility-${testPage.name.toLowerCase()}`);
        
      } catch (error) {
        console.error(`  ❌ Error testing ${testPage.name}:`, error.message);
      } finally {
        await page.close();
      }
    }

    // Calculate summary statistics
    results.summary.totalPages = results.pages.length;
    if (results.pages.length > 0) {
      results.summary.averageScore = Math.round(
        results.pages.reduce((sum, page) => sum + page.score, 0) / results.pages.length
      );
      results.summary.totalViolations = results.pages.reduce((sum, page) => sum + page.violations, 0);
    }

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;

    // Save results
    await testUtils.saveTestResults('accessibility-suite', results);

    // Print final summary
    console.log('\n♿ Accessibility Testing Summary:');
    console.log('=====================================');
    console.log(`Total Pages Tested: ${results.summary.totalPages}`);
    console.log(`Average Score: ${results.summary.averageScore}%`);
    console.log(`Total Violations: ${results.summary.totalViolations}`);
    console.log(`Passed Pages: ${results.summary.passedPages}`);
    console.log(`Failed Pages: ${results.summary.failedPages}`);
    console.log(`Critical Issues: ${results.summary.criticalIssues}`);
    console.log(`Test Duration: ${Math.round(results.duration / 1000)}s`);

    if (results.summary.failedPages > 0) {
      console.log('\n⚠️  Accessibility Issues Found:');
      results.pages.forEach(page => {
        if (!page.passed) {
          console.log(`  - ${page.page}: Score ${page.score}%, ${page.violations} violations`);
        }
      });
      
      if (results.summary.criticalIssues > 0) {
        console.log(`\n🚨 ${results.summary.criticalIssues} pages have critical accessibility issues (score < 50%)`);
        process.exit(1);
      } else {
        console.log('\n⚠️  Some accessibility issues found, but no critical failures');
      }
    } else {
      console.log('\n🎉 All pages passed accessibility checks!');
    }

  } catch (error) {
    console.error('💥 Accessibility testing failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  runAccessibilityTests();
}

module.exports = { runAccessibilityTests };