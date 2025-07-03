const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://tishya-foods-website-1j8o6z6yp-kirans-projects-994c7420.vercel.app';

const pages = [
  { name: 'homepage', url: '/' },
  { name: 'about-page', url: '/about' },
  { name: 'products-page', url: '/products' },
  { name: 'blog-page', url: '/blog' },
  { name: 'contact-page', url: '/contact' },
  { name: 'nutrition-page', url: '/nutrition' },
  { name: 'recipes-page', url: '/recipes' },
  { name: 'checkout-page', url: '/checkout' },
  { name: 'compare-page', url: '/compare' },
  { name: 'loyalty-page', url: '/loyalty' },
  { name: 'subscription-page', url: '/subscription' },
  { name: 'recommendations-page', url: '/recommendations' }
];

async function takeScreenshots() {
  console.log('🚀 Starting screenshot analysis of Tishya Foods website...');
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewport({ width: 1920, height: 1080 });

  const analysis = {
    pages: [],
    designIssues: [],
    recommendations: []
  };

  for (const pageInfo of pages) {
    try {
      console.log(`📸 Taking screenshot of ${pageInfo.name}...`);
      
      const fullUrl = `${baseUrl}${pageInfo.url}`;
      await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for page to fully load
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      const screenshotPath = path.join(screenshotsDir, `${pageInfo.name}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true,
        type: 'png'
      });
      
      // Analyze page elements for design consistency
      const pageAnalysis = await page.evaluate(() => {
        const analysis = {
          title: document.title,
          hasHeader: !!document.querySelector('header'),
          hasFooter: !!document.querySelector('footer'),
          hasNavigation: !!document.querySelector('nav'),
          backgroundColor: getComputedStyle(document.body).backgroundColor,
          fontFamily: getComputedStyle(document.body).fontFamily,
          headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          buttonCount: document.querySelectorAll('button').length,
          linkCount: document.querySelectorAll('a').length,
          imageCount: document.querySelectorAll('img').length,
          formCount: document.querySelectorAll('form').length,
          mainContentArea: !!document.querySelector('main'),
          darkThemeClasses: document.documentElement.classList.contains('dark') || 
                           document.body.classList.contains('dark') ||
                           document.body.className.includes('bg-gray-900'),
          primaryColors: []
        };
        
        // Check for common dark theme classes
        const darkThemeElements = document.querySelectorAll('[class*="bg-gray-"], [class*="text-gray-"], [class*="border-gray-"]');
        analysis.darkThemeElementCount = darkThemeElements.length;
        
        // Check for consistent spacing classes
        const spacingElements = document.querySelectorAll('[class*="p-"], [class*="m-"], [class*="px-"], [class*="py-"], [class*="mx-"], [class*="my-"]');
        analysis.spacingElementCount = spacingElements.length;
        
        return analysis;
      });
      
      analysis.pages.push({
        name: pageInfo.name,
        url: pageInfo.url,
        screenshot: screenshotPath,
        ...pageAnalysis
      });
      
      console.log(`✅ Screenshot saved: ${screenshotPath}`);
      
    } catch (error) {
      console.error(`❌ Error taking screenshot of ${pageInfo.name}:`, error.message);
      analysis.designIssues.push(`Failed to capture ${pageInfo.name}: ${error.message}`);
    }
  }

  await browser.close();
  
  // Analyze consistency across pages
  console.log('\n🔍 Analyzing design consistency...');
  
  const backgroundColors = [...new Set(analysis.pages.map(p => p.backgroundColor))];
  const fontFamilies = [...new Set(analysis.pages.map(p => p.fontFamily))];
  const pagesWithoutHeader = analysis.pages.filter(p => !p.hasHeader);
  const pagesWithoutFooter = analysis.pages.filter(p => !p.hasFooter);
  const pagesWithoutNavigation = analysis.pages.filter(p => !p.hasNavigation);
  const pagesWithoutMain = analysis.pages.filter(p => !p.mainContentArea);
  
  // Design consistency analysis
  if (backgroundColors.length > 1) {
    analysis.designIssues.push(`Inconsistent background colors: ${backgroundColors.join(', ')}`);
  }
  
  if (fontFamilies.length > 1) {
    analysis.designIssues.push(`Inconsistent font families: ${fontFamilies.join(', ')}`);
  }
  
  if (pagesWithoutHeader.length > 0) {
    analysis.designIssues.push(`Pages missing header: ${pagesWithoutHeader.map(p => p.name).join(', ')}`);
  }
  
  if (pagesWithoutFooter.length > 0) {
    analysis.designIssues.push(`Pages missing footer: ${pagesWithoutFooter.map(p => p.name).join(', ')}`);
  }
  
  if (pagesWithoutNavigation.length > 0) {
    analysis.designIssues.push(`Pages missing navigation: ${pagesWithoutNavigation.map(p => p.name).join(', ')}`);
  }
  
  if (pagesWithoutMain.length > 0) {
    analysis.designIssues.push(`Pages missing main content area: ${pagesWithoutMain.map(p => p.name).join(', ')}`);
  }
  
  // Generate recommendations
  analysis.recommendations = [
    'Ensure all pages have consistent header and footer',
    'Use consistent spacing classes throughout (px-4, py-6, etc.)',
    'Maintain consistent dark theme classes (bg-gray-900, text-gray-100)',
    'Ensure all pages have proper semantic HTML structure',
    'Use consistent button styles and colors',
    'Maintain consistent typography hierarchy',
    'Ensure consistent navigation across all pages'
  ];
  
  // Save analysis report
  const reportPath = path.join(__dirname, 'design-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
  
  console.log('\n📊 Design Analysis Summary:');
  console.log(`✅ Screenshots taken: ${analysis.pages.length}`);
  console.log(`⚠️  Design issues found: ${analysis.designIssues.length}`);
  console.log(`💡 Recommendations: ${analysis.recommendations.length}`);
  
  if (analysis.designIssues.length > 0) {
    console.log('\n🔧 Design Issues Found:');
    analysis.designIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  console.log('\n💡 Design Recommendations:');
  analysis.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  
  console.log(`\n📋 Full analysis report saved to: ${reportPath}`);
  console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
  
  return analysis;
}

takeScreenshots().catch(console.error);