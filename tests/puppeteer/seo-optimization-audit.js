/**
 * SEO Optimization & Technical SEO Audit Tool
 * Comprehensive SEO analysis for Tishya Foods website
 * 
 * Test Categories:
 * 1. Meta Tags & Title Optimization
 * 2. Heading Structure (H1-H6)
 * 3. Internal Linking Strategy
 * 4. Image SEO & Alt Text
 * 5. Schema Markup Validation
 * 6. URL Structure & Canonicals
 * 7. Page Speed & Core Web Vitals
 * 8. Mobile-First Indexing
 * 9. Content Quality Analysis
 * 10. Technical SEO Issues
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class SEOAuditTool {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      url: '',
      timestamp: new Date().toISOString(),
      overallScore: 0,
      seoLevel: 'Poor',
      summary: {
        totalTests: 0,
        passedTests: 0,
        warningTests: 0,
        failedTests: 0
      },
      categories: {},
      screenshots: [],
      issues: [],
      recommendations: []
    };
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set user agent for realistic testing
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  }

  async navigateToSite(url) {
    console.log(`🔍 Starting SEO audit for: ${url}`);
    this.results.url = url;
    
    await this.page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Take initial screenshot
    await this.captureScreenshot('seo-audit-initial', 'Initial page load for SEO audit');
  }

  async captureScreenshot(filename, description) {
    const screenshotPath = path.join('screenshots', 'seo', `${filename}.png`);
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    
    this.results.screenshots.push({
      filename: `${filename}.png`,
      description,
      path: screenshotPath,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  async auditMetaTags() {
    console.log('📋 Auditing Meta Tags & Title Optimization...');
    
    const metaData = await this.page.evaluate(() => {
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
      const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
      const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
      const robots = document.querySelector('meta[name="robots"]')?.content || '';
      const viewport = document.querySelector('meta[name="viewport"]')?.content || '';
      const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
      const ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';
      const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.content || '';
      
      return {
        title,
        titleLength: title.length,
        metaDescription,
        descriptionLength: metaDescription.length,
        metaKeywords,
        canonical,
        robots,
        viewport,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard
      };
    });

    // Title optimization analysis
    const titleScore = this.evaluateTitle(metaData);
    const descriptionScore = this.evaluateDescription(metaData);
    const socialScore = this.evaluateSocialMeta(metaData);

    this.results.categories.metaTags = {
      score: Math.round((titleScore + descriptionScore + socialScore) / 3),
      details: metaData,
      analysis: {
        title: titleScore >= 80 ? 'Excellent' : titleScore >= 60 ? 'Good' : 'Needs Improvement',
        description: descriptionScore >= 80 ? 'Excellent' : descriptionScore >= 60 ? 'Good' : 'Needs Improvement',
        socialMeta: socialScore >= 80 ? 'Excellent' : socialScore >= 60 ? 'Good' : 'Needs Improvement'
      }
    };

    await this.captureScreenshot('meta-tags-analysis', 'Meta tags and title optimization analysis');
  }

  evaluateTitle(metaData) {
    let score = 0;
    const { title, titleLength } = metaData;
    
    if (title) score += 20;
    if (titleLength >= 30 && titleLength <= 60) score += 30;
    else if (titleLength > 0) score += 15;
    
    if (title.includes('Tishya Foods')) score += 20;
    if (title.includes('Protein') || title.includes('Health')) score += 15;
    if (title.includes('|') || title.includes('-')) score += 15;
    
    return Math.min(score, 100);
  }

  evaluateDescription(metaData) {
    let score = 0;
    const { metaDescription, descriptionLength } = metaData;
    
    if (metaDescription) score += 30;
    if (descriptionLength >= 120 && descriptionLength <= 160) score += 40;
    else if (descriptionLength > 0) score += 20;
    
    if (metaDescription.includes('protein') || metaDescription.includes('health')) score += 15;
    if (metaDescription.includes('natural') || metaDescription.includes('organic')) score += 15;
    
    return Math.min(score, 100);
  }

  evaluateSocialMeta(metaData) {
    let score = 0;
    
    if (metaData.ogTitle) score += 25;
    if (metaData.ogDescription) score += 25;
    if (metaData.ogImage) score += 25;
    if (metaData.twitterCard) score += 25;
    
    return score;
  }

  async auditHeadingStructure() {
    console.log('📝 Auditing Heading Structure...');
    
    const headingData = await this.page.evaluate(() => {
      const headings = [];
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      headingElements.forEach((heading, index) => {
        headings.push({
          level: parseInt(heading.tagName.substring(1)),
          text: heading.textContent.trim(),
          id: heading.id || '',
          index: index
        });
      });
      
      return {
        headings,
        h1Count: document.querySelectorAll('h1').length,
        totalHeadings: headingElements.length
      };
    });

    const structureScore = this.evaluateHeadingStructure(headingData);
    
    this.results.categories.headingStructure = {
      score: structureScore,
      details: headingData,
      analysis: this.analyzeHeadingStructure(headingData)
    };

    await this.captureScreenshot('heading-structure', 'Heading structure and hierarchy analysis');
  }

  evaluateHeadingStructure(data) {
    let score = 0;
    
    // H1 analysis
    if (data.h1Count === 1) score += 30;
    else if (data.h1Count > 1) score += 10;
    
    // Hierarchy analysis
    if (data.headings.length > 0) {
      let hierarchyValid = true;
      let currentLevel = 0;
      
      data.headings.forEach(heading => {
        if (currentLevel === 0 || heading.level <= currentLevel + 1) {
          currentLevel = heading.level;
        } else {
          hierarchyValid = false;
        }
      });
      
      if (hierarchyValid) score += 40;
      else score += 20;
    }
    
    // Content quality
    if (data.totalHeadings >= 3) score += 30;
    else if (data.totalHeadings > 0) score += 15;
    
    return Math.min(score, 100);
  }

  analyzeHeadingStructure(data) {
    const issues = [];
    const recommendations = [];
    
    if (data.h1Count === 0) {
      issues.push('Missing H1 tag');
      recommendations.push('Add exactly one H1 tag per page');
    } else if (data.h1Count > 1) {
      issues.push('Multiple H1 tags found');
      recommendations.push('Use only one H1 tag per page');
    }
    
    if (data.totalHeadings < 3) {
      recommendations.push('Consider adding more heading tags for better content structure');
    }
    
    return { issues, recommendations };
  }

  async auditInternalLinking() {
    console.log('🔗 Auditing Internal Linking Strategy...');
    
    const linkData = await this.page.evaluate(() => {
      const links = document.querySelectorAll('a[href]');
      const internalLinks = [];
      const externalLinks = [];
      const currentDomain = window.location.hostname;
      
      links.forEach(link => {
        const href = link.href;
        const text = link.textContent.trim();
        const hasTitle = !!link.title;
        
        if (href.includes(currentDomain) || href.startsWith('/')) {
          internalLinks.push({
            href,
            text,
            hasTitle,
            isEmpty: text.length === 0
          });
        } else if (href.startsWith('http')) {
          externalLinks.push({
            href,
            text,
            hasTitle,
            isEmpty: text.length === 0
          });
        }
      });
      
      return {
        totalLinks: links.length,
        internalLinks: internalLinks.length,
        externalLinks: externalLinks.length,
        internalLinkDetails: internalLinks,
        externalLinkDetails: externalLinks,
        emptyLinks: internalLinks.filter(link => link.isEmpty).length
      };
    });

    const linkingScore = this.evaluateInternalLinking(linkData);
    
    this.results.categories.internalLinking = {
      score: linkingScore,
      details: linkData,
      analysis: this.analyzeLinkingStrategy(linkData)
    };

    await this.captureScreenshot('internal-linking', 'Internal linking structure analysis');
  }

  evaluateInternalLinking(data) {
    let score = 0;
    
    // Internal link count
    if (data.internalLinks >= 5) score += 30;
    else if (data.internalLinks >= 2) score += 20;
    else if (data.internalLinks > 0) score += 10;
    
    // Link quality
    if (data.emptyLinks === 0) score += 25;
    else score += Math.max(0, 25 - data.emptyLinks * 5);
    
    // Balance check
    const ratio = data.internalLinks / (data.externalLinks + 1);
    if (ratio >= 2) score += 25;
    else if (ratio >= 1) score += 15;
    else score += 10;
    
    // Navigation structure
    if (data.totalLinks >= 10) score += 20;
    else if (data.totalLinks >= 5) score += 15;
    else score += 10;
    
    return Math.min(score, 100);
  }

  analyzeLinkingStrategy(data) {
    const recommendations = [];
    
    if (data.internalLinks < 5) {
      recommendations.push('Add more internal links to improve site navigation and SEO');
    }
    
    if (data.emptyLinks > 0) {
      recommendations.push('Fix empty links - all links should have descriptive anchor text');
    }
    
    if (data.internalLinks < data.externalLinks) {
      recommendations.push('Consider adding more internal links to balance external links');
    }
    
    return { recommendations };
  }

  async auditImageSEO() {
    console.log('🖼️ Auditing Image SEO & Alt Text...');
    
    const imageData = await this.page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const imageDetails = [];
      
      images.forEach(img => {
        imageDetails.push({
          src: img.src,
          alt: img.alt || '',
          hasAlt: !!img.alt,
          title: img.title || '',
          hasTitle: !!img.title,
          loading: img.loading || '',
          isLazy: img.loading === 'lazy',
          width: img.width,
          height: img.height
        });
      });
      
      return {
        totalImages: images.length,
        imagesWithAlt: imageDetails.filter(img => img.hasAlt).length,
        imagesWithTitle: imageDetails.filter(img => img.hasTitle).length,
        lazyImages: imageDetails.filter(img => img.isLazy).length,
        imageDetails
      };
    });

    const imageSEOScore = this.evaluateImageSEO(imageData);
    
    this.results.categories.imageSEO = {
      score: imageSEOScore,
      details: imageData,
      analysis: this.analyzeImageSEO(imageData)
    };

    await this.captureScreenshot('image-seo', 'Image SEO and alt text analysis');
  }

  evaluateImageSEO(data) {
    let score = 0;
    
    if (data.totalImages === 0) return 100; // No images to optimize
    
    // Alt text coverage
    const altTextRatio = data.imagesWithAlt / data.totalImages;
    score += altTextRatio * 50;
    
    // Lazy loading
    const lazyLoadingRatio = data.lazyImages / data.totalImages;
    score += lazyLoadingRatio * 30;
    
    // Title attributes
    const titleRatio = data.imagesWithTitle / data.totalImages;
    score += titleRatio * 20;
    
    return Math.min(score, 100);
  }

  analyzeImageSEO(data) {
    const issues = [];
    const recommendations = [];
    
    const missingAlt = data.totalImages - data.imagesWithAlt;
    if (missingAlt > 0) {
      issues.push(`${missingAlt} images missing alt text`);
      recommendations.push('Add descriptive alt text to all images for better accessibility and SEO');
    }
    
    const notLazy = data.totalImages - data.lazyImages;
    if (notLazy > 0) {
      recommendations.push('Consider adding lazy loading to images for better performance');
    }
    
    return { issues, recommendations };
  }

  async auditSchemaMarkup() {
    console.log('📊 Auditing Schema Markup...');
    
    const schemaData = await this.page.evaluate(() => {
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      const schemas = [];
      
      jsonLdScripts.forEach(script => {
        try {
          const schema = JSON.parse(script.textContent);
          schemas.push({
            type: schema['@type'] || 'Unknown',
            context: schema['@context'] || '',
            content: schema
          });
        } catch (e) {
          schemas.push({
            type: 'Invalid',
            error: e.message
          });
        }
      });
      
      return {
        totalSchemas: schemas.length,
        schemas,
        hasOrganization: schemas.some(s => s.type === 'Organization'),
        hasWebSite: schemas.some(s => s.type === 'WebSite'),
        hasProduct: schemas.some(s => s.type === 'Product')
      };
    });

    const schemaScore = this.evaluateSchemaMarkup(schemaData);
    
    this.results.categories.schemaMarkup = {
      score: schemaScore,
      details: schemaData,
      analysis: this.analyzeSchemaMarkup(schemaData)
    };

    await this.captureScreenshot('schema-markup', 'Schema markup validation');
  }

  evaluateSchemaMarkup(data) {
    let score = 0;
    
    if (data.totalSchemas > 0) score += 30;
    if (data.hasOrganization) score += 25;
    if (data.hasWebSite) score += 25;
    if (data.hasProduct) score += 20;
    
    return Math.min(score, 100);
  }

  analyzeSchemaMarkup(data) {
    const recommendations = [];
    
    if (!data.hasOrganization) {
      recommendations.push('Add Organization schema markup for better business representation');
    }
    
    if (!data.hasWebSite) {
      recommendations.push('Add WebSite schema markup for better search engine understanding');
    }
    
    if (!data.hasProduct) {
      recommendations.push('Consider adding Product schema markup for product pages');
    }
    
    return { recommendations };
  }

  async auditTechnicalSEO() {
    console.log('⚙️ Auditing Technical SEO...');
    
    const technicalData = await this.page.evaluate(() => {
      return {
        hasRobotsTxt: true, // We'll check this separately
        hasXmlSitemap: true, // We'll check this separately
        hasSSL: window.location.protocol === 'https:',
        hasServiceWorker: 'serviceWorker' in navigator,
        pageSpeed: {
          // We'll measure this with Lighthouse-style metrics
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
          loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
        },
        mobileOptimized: window.innerWidth <= 768 ? true : !!document.querySelector('meta[name="viewport"]'),
        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
        hasHreflang: !!document.querySelector('link[rel="alternate"][hreflang]')
      };
    });

    // Check robots.txt and sitemap
    try {
      const robotsResponse = await this.page.goto(`${this.results.url}/robots.txt`);
      technicalData.hasRobotsTxt = robotsResponse.status() === 200;
    } catch (e) {
      technicalData.hasRobotsTxt = false;
    }

    try {
      const sitemapResponse = await this.page.goto(`${this.results.url}/sitemap.xml`);
      technicalData.hasXmlSitemap = sitemapResponse.status() === 200;
    } catch (e) {
      technicalData.hasXmlSitemap = false;
    }

    // Return to main page
    await this.page.goto(this.results.url);

    const technicalScore = this.evaluateTechnicalSEO(technicalData);
    
    this.results.categories.technicalSEO = {
      score: technicalScore,
      details: technicalData,
      analysis: this.analyzeTechnicalSEO(technicalData)
    };

    await this.captureScreenshot('technical-seo', 'Technical SEO analysis');
  }

  evaluateTechnicalSEO(data) {
    let score = 0;
    
    if (data.hasSSL) score += 20;
    if (data.hasRobotsTxt) score += 15;
    if (data.hasXmlSitemap) score += 15;
    if (data.hasCanonical) score += 15;
    if (data.mobileOptimized) score += 20;
    if (data.pageSpeed.loadComplete < 3000) score += 15;
    
    return Math.min(score, 100);
  }

  analyzeTechnicalSEO(data) {
    const issues = [];
    const recommendations = [];
    
    if (!data.hasSSL) {
      issues.push('Site not using HTTPS');
      recommendations.push('Implement SSL certificate for security and SEO benefits');
    }
    
    if (!data.hasRobotsTxt) {
      recommendations.push('Create robots.txt file to guide search engine crawlers');
    }
    
    if (!data.hasXmlSitemap) {
      recommendations.push('Create XML sitemap for better search engine indexing');
    }
    
    if (data.pageSpeed.loadComplete > 3000) {
      recommendations.push('Optimize page load speed - current load time is over 3 seconds');
    }
    
    return { issues, recommendations };
  }

  calculateOverallScore() {
    const categories = Object.values(this.results.categories);
    const totalScore = categories.reduce((sum, category) => sum + category.score, 0);
    const averageScore = Math.round(totalScore / categories.length);
    
    this.results.overallScore = averageScore;
    this.results.seoLevel = averageScore >= 90 ? 'Excellent' : 
                           averageScore >= 80 ? 'Very Good' : 
                           averageScore >= 70 ? 'Good' : 
                           averageScore >= 60 ? 'Fair' : 'Poor';
    
    // Count test results
    categories.forEach(category => {
      this.results.summary.totalTests++;
      if (category.score >= 80) {
        this.results.summary.passedTests++;
      } else if (category.score >= 60) {
        this.results.summary.warningTests++;
      } else {
        this.results.summary.failedTests++;
      }
    });
  }

  async generateReport() {
    console.log('📄 Generating SEO audit report...');
    
    const reportPath = path.join('screenshots', 'seo', 'seo-audit-report.md');
    const reportData = this.formatReport();
    
    await fs.writeFile(reportPath, reportData);
    
    // Generate JSON report
    const jsonPath = path.join('screenshots', 'seo', 'seo-audit-report.json');
    await fs.writeFile(jsonPath, JSON.stringify(this.results, null, 2));
    
    console.log(`✅ SEO audit report generated: ${reportPath}`);
    return { reportPath, jsonPath };
  }

  formatReport() {
    const { overallScore, seoLevel, categories } = this.results;
    
    let report = `# SEO Optimization & Technical SEO Audit Report

**Generated:** ${new Date(this.results.timestamp).toLocaleString()}  
**URL:** ${this.results.url}  
**Overall Score:** ${overallScore}/100  
**SEO Level:** ${seoLevel}

## 📊 Summary

- **Screenshots Captured:** ${this.results.screenshots.length}
- **Tests Passed:** ${this.results.summary.passedTests}
- **Tests with Warnings:** ${this.results.summary.warningTests}
- **Tests Failed:** ${this.results.summary.failedTests}
- **Overall SEO Level:** ${seoLevel}

## 🎯 SEO Categories Analysis

| Category | Score | Status | Key Findings |
|----------|-------|--------|--------------|
`;

    Object.entries(categories).forEach(([key, category]) => {
      const status = category.score >= 80 ? '✅ Excellent' : 
                    category.score >= 60 ? '⚠️ Good' : '❌ Needs Work';
      const categoryName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      report += `| **${categoryName}** | ${category.score}/100 | ${status} | ${this.getKeyFindings(key, category)} |\n`;
    });

    report += `\n## 🔍 Detailed Analysis\n\n`;

    Object.entries(categories).forEach(([key, category]) => {
      const categoryName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      report += `### ${categoryName} (${category.score}/100)\n\n`;
      report += this.formatCategoryDetails(key, category);
      report += '\n\n';
    });

    report += `## 📸 Screenshots Captured\n\n`;
    this.results.screenshots.forEach(screenshot => {
      report += `- **${screenshot.filename}:** ${screenshot.description}\n`;
    });

    report += `\n## 🚨 Issues Found\n\n`;
    if (this.results.issues.length === 0) {
      report += 'No critical SEO issues detected.\n';
    } else {
      this.results.issues.forEach(issue => {
        report += `- **${issue.type.toUpperCase()}:** ${issue.message}\n`;
      });
    }

    report += `\n## 💡 Recommendations\n\n`;
    this.results.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });

    report += `\n## 🎯 Next Steps\n\n`;
    report += `- Implement missing meta tags and schema markup\n`;
    report += `- Optimize page speed and Core Web Vitals\n`;
    report += `- Improve internal linking structure\n`;
    report += `- Add missing alt text to images\n`;
    report += `- Create or optimize robots.txt and sitemap.xml\n`;
    report += `- Monitor SEO performance regularly\n`;

    report += `\n---\n*Report generated by Tishya Foods SEO Optimization & Technical SEO Audit Tool*\n`;

    return report;
  }

  getKeyFindings(key, category) {
    switch (key) {
      case 'metaTags':
        return `Title: ${category.analysis.title}, Description: ${category.analysis.description}`;
      case 'headingStructure':
        return `${category.details.h1Count} H1 tags, ${category.details.totalHeadings} total headings`;
      case 'internalLinking':
        return `${category.details.internalLinks} internal links, ${category.details.externalLinks} external`;
      case 'imageSEO':
        return `${category.details.imagesWithAlt}/${category.details.totalImages} images with alt text`;
      case 'schemaMarkup':
        return `${category.details.totalSchemas} schema types found`;
      case 'technicalSEO':
        return `SSL: ${category.details.hasSSL ? 'Yes' : 'No'}, Mobile: ${category.details.mobileOptimized ? 'Yes' : 'No'}`;
      default:
        return 'Analysis completed';
    }
  }

  formatCategoryDetails(key, category) {
    let details = '';
    
    switch (key) {
      case 'metaTags':
        details += `**Title:** ${category.details.title} (${category.details.titleLength} chars)\n`;
        details += `**Description:** ${category.details.metaDescription.substring(0, 100)}... (${category.details.descriptionLength} chars)\n`;
        details += `**Open Graph:** ${category.details.ogTitle ? 'Present' : 'Missing'}\n`;
        details += `**Twitter Card:** ${category.details.twitterCard || 'Not set'}\n`;
        break;
      case 'headingStructure':
        details += `**H1 Count:** ${category.details.h1Count}\n`;
        details += `**Total Headings:** ${category.details.totalHeadings}\n`;
        details += `**Structure:** ${category.analysis.issues.length === 0 ? 'Valid' : 'Issues found'}\n`;
        break;
      case 'internalLinking':
        details += `**Internal Links:** ${category.details.internalLinks}\n`;
        details += `**External Links:** ${category.details.externalLinks}\n`;
        details += `**Empty Links:** ${category.details.emptyLinks}\n`;
        break;
      case 'imageSEO':
        details += `**Total Images:** ${category.details.totalImages}\n`;
        details += `**With Alt Text:** ${category.details.imagesWithAlt}\n`;
        details += `**Lazy Loaded:** ${category.details.lazyImages}\n`;
        break;
      case 'schemaMarkup':
        details += `**Schema Types:** ${category.details.totalSchemas}\n`;
        details += `**Organization Schema:** ${category.details.hasOrganization ? 'Present' : 'Missing'}\n`;
        details += `**Website Schema:** ${category.details.hasWebSite ? 'Present' : 'Missing'}\n`;
        break;
      case 'technicalSEO':
        details += `**HTTPS:** ${category.details.hasSSL ? 'Yes' : 'No'}\n`;
        details += `**Robots.txt:** ${category.details.hasRobotsTxt ? 'Found' : 'Missing'}\n`;
        details += `**XML Sitemap:** ${category.details.hasXmlSitemap ? 'Found' : 'Missing'}\n`;
        details += `**Load Time:** ${Math.round(category.details.pageSpeed.loadComplete)}ms\n`;
        break;
    }
    
    return details;
  }

  async runFullAudit(url = 'http://localhost:3000') {
    try {
      await this.initialize();
      await this.navigateToSite(url);
      
      await this.auditMetaTags();
      await this.auditHeadingStructure();
      await this.auditInternalLinking();
      await this.auditImageSEO();
      await this.auditSchemaMarkup();
      await this.auditTechnicalSEO();
      
      this.calculateOverallScore();
      
      await this.captureScreenshot('seo-audit-complete', 'Final SEO audit overview');
      
      const reports = await this.generateReport();
      
      console.log(`\n🎉 SEO Audit Complete!`);
      console.log(`📊 Overall Score: ${this.results.overallScore}/100 (${this.results.seoLevel})`);
      console.log(`📄 Report saved to: ${reports.reportPath}`);
      
      return this.results;
      
    } catch (error) {
      console.error('❌ SEO audit failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the audit if this file is executed directly
if (require.main === module) {
  const audit = new SEOAuditTool();
  audit.runFullAudit().catch(console.error);
}

module.exports = SEOAuditTool;