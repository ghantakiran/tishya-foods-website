#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:3000';
const screenshotsDir = path.join(__dirname, 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

class LiveColorTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testInterval = null;
    this.isRunning = false;
  }

  async init() {
    console.log('🚀 Starting Live Color Tester...');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    console.log('✅ Browser initialized');
  }

  async testColorConsistency() {
    try {
      console.log('🎨 Testing color consistency...');
      
      // Navigate to homepage
      await this.page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
      
      // Extract color information
      const colorAnalysis = await this.page.evaluate(() => {
        const analysis = {
          timestamp: new Date().toISOString(),
          backgroundColors: [],
          textColors: [],
          borderColors: [],
          issues: []
        };

        // Get all elements with background colors
        const elements = document.querySelectorAll('*');
        const seenColors = new Set();

        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const bgColor = styles.backgroundColor;
          const textColor = styles.color;
          const borderColor = styles.borderColor;

          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            if (!seenColors.has(bgColor)) {
              analysis.backgroundColors.push(bgColor);
              seenColors.add(bgColor);
            }
          }

          if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
            if (!seenColors.has(textColor)) {
              analysis.textColors.push(textColor);
              seenColors.add(textColor);
            }
          }

          if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
            if (!seenColors.has(borderColor)) {
              analysis.borderColors.push(borderColor);
              seenColors.add(borderColor);
            }
          }
        });

        // Check for inconsistencies
        const grayColors = [...seenColors].filter(color => 
          color.includes('128, 128, 128') || 
          color.includes('169, 169, 169') || 
          color.includes('105, 105, 105')
        );

        if (grayColors.length > 0) {
          analysis.issues.push(`Found ${grayColors.length} gray colors that should be replaced`);
        }

        // Check for theme consistency
        const earthColors = [...seenColors].filter(color => 
          color.includes('160, 132, 92') || // earth-500
          color.includes('139, 111, 71') || // earth-600
          color.includes('107, 68, 35')     // earth-700
        );

        analysis.earthColorsCount = earthColors.length;
        analysis.totalColors = seenColors.size;

        return analysis;
      });

      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(screenshotsDir, `color-test-${timestamp}.png`);
      await this.page.screenshot({ 
        path: screenshotPath, 
        fullPage: true,
        type: 'png'
      });

      // Log results
      console.log('\n📊 Color Analysis Results:');
      console.log(`🎨 Total unique colors found: ${colorAnalysis.totalColors}`);
      console.log(`🌍 Earth colors in use: ${colorAnalysis.earthColorsCount}`);
      console.log(`⚠️  Issues found: ${colorAnalysis.issues.length}`);
      
      if (colorAnalysis.issues.length > 0) {
        console.log('🔧 Issues:');
        colorAnalysis.issues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        console.log('✅ No color consistency issues found!');
      }

      // Save detailed report
      const reportPath = path.join(__dirname, 'color-analysis-live.json');
      fs.writeFileSync(reportPath, JSON.stringify(colorAnalysis, null, 2));

      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      console.log(`📋 Report saved: ${reportPath}`);

      return colorAnalysis;

    } catch (error) {
      console.error('❌ Error during color testing:', error.message);
      return null;
    }
  }

  async startContinuousMonitoring() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔄 Starting continuous monitoring (every 30 seconds)...');
    console.log('Press Ctrl+C to stop monitoring');

    // Initial test
    await this.testColorConsistency();

    // Set up interval testing
    this.testInterval = setInterval(async () => {
      await this.testColorConsistency();
    }, 30000); // Test every 30 seconds

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping continuous monitoring...');
      await this.stop();
      process.exit(0);
    });
  }

  async stop() {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    this.isRunning = false;
    console.log('✅ Live Color Tester stopped');
  }
}

// CLI Usage
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  const tester = new LiveColorTester();
  await tester.init();

  if (command === 'monitor' || command === 'continuous') {
    await tester.startContinuousMonitoring();
  } else {
    // Single test
    await tester.testColorConsistency();
    await tester.stop();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = LiveColorTester;