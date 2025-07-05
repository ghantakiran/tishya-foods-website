const puppeteer = require('puppeteer');
const path = require('path');

async function debugChatbot() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Log console messages
    page.on('console', (msg) => {
      console.log('Browser console:', msg.type(), msg.text());
    });
    
    // Log page errors
    page.on('error', (err) => {
      console.log('Page error:', err.message);
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for React components to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({
      path: path.join(__dirname, 'debug-homepage.png'),
      fullPage: true
    });
    
    // Check for any chatbot-related elements
    const allElements = await page.$$eval('*[data-testid], *[class*="chatbot"], *[class*="nutrition"], button', 
      els => els.map(el => ({ 
        tagName: el.tagName, 
        testId: el.getAttribute('data-testid'), 
        className: el.className,
        text: el.textContent?.substring(0, 50)
      }))
    );
    
    console.log('All relevant elements:', allElements.filter(el => 
      el.testId?.includes('chatbot') || 
      el.className?.includes('chatbot') || 
      el.className?.includes('nutrition') ||
      el.text?.toLowerCase().includes('assistant')
    ));
    
    // Check for chatbot trigger
    const chatbotTrigger = await page.$('[data-testid="chatbot-trigger"]');
    console.log('Chatbot trigger found:', !!chatbotTrigger);
    
    if (chatbotTrigger) {
      console.log('Chatbot trigger is visible:', await chatbotTrigger.isIntersectingViewport());
      
      // Click trigger
      await chatbotTrigger.click();
      await page.waitForSelector('[data-testid="chatbot-window"]', { timeout: 5000 });
      
      await page.screenshot({
        path: path.join(__dirname, 'debug-chatbot-open.png'),
        fullPage: true
      });
      
      console.log('Chatbot opened successfully');
    }
    
    console.log('Debug completed');
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugChatbot();