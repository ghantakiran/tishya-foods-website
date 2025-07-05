/**
 * AI Chatbot Integration Testing Suite
 * Tests AI chatbot functionality, responses, and user interaction flows
 * 
 * Usage: node tests/puppeteer/ai-chatbot-testing.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3001',
  headless: process.env.HEADLESS !== 'false',
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  screenshotDir: path.join(__dirname, '../../screenshots/ai-chatbot'),
  reportFile: path.join(__dirname, '../../screenshots/ai-chatbot/ai-chatbot-report.json'),
  markdownFile: path.join(__dirname, '../../screenshots/ai-chatbot/ai-chatbot-report.md')
};

// AI Chatbot test results
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
  chatbotMetrics: {},
  recommendations: []
};

// Sample test queries for chatbot
const testQueries = [
  {
    query: "What protein snacks do you recommend?",
    expectedKeywords: ["protein", "snacks", "recommend"],
    category: "product_recommendation"
  },
  {
    query: "I'm vegetarian, what products are suitable for me?",
    expectedKeywords: ["vegetarian", "suitable", "products"],
    category: "dietary_restriction"
  },
  {
    query: "What are the nutritional benefits of your nuts?",
    expectedKeywords: ["nutritional", "benefits", "nuts"],
    category: "nutrition_info"
  },
  {
    query: "How much protein is in your protein bars?",
    expectedKeywords: ["protein", "bars", "much"],
    category: "specific_nutrition"
  },
  {
    query: "Do you have gluten-free options?",
    expectedKeywords: ["gluten-free", "options"],
    category: "dietary_restriction"
  },
  {
    query: "What's your return policy?",
    expectedKeywords: ["return", "policy"],
    category: "policy_inquiry"
  },
  {
    query: "How can I track my order?",
    expectedKeywords: ["track", "order"],
    category: "order_support"
  },
  {
    query: "What makes your products natural?",
    expectedKeywords: ["natural", "products"],
    category: "product_info"
  }
];

/**
 * Main test execution function
 */
async function runAIChatbotTests() {
  console.log('🤖 Starting AI Chatbot Integration Testing Suite...\n');
  
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
    
    // Run AI chatbot tests
    await testChatbotVisibility(page);
    await testChatbotInitialization(page);
    await testChatbotInterface(page);
    await testChatbotConversationFlow(page);
    await testChatbotProductRecommendations(page);
    await testChatbotNutritionQueries(page);
    await testChatbotSupportQueries(page);
    await testChatbotContextualResponses(page);
    await testChatbotMobileExperience(page);
    await testChatbotPerformance(page);
    
    // Generate reports
    await generateReports();
    
  } catch (error) {
    console.error('❌ AI chatbot testing failed:', error);
    recordTest('AI Chatbot Testing Suite', false, error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Test chatbot visibility and accessibility
 */
async function testChatbotVisibility(page) {
  console.log('👁️ Testing Chatbot Visibility...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for chatbot trigger/icon
    const chatbotTrigger = await page.$('[data-testid="chatbot-trigger"], [data-testid="nutrition-assistant"], .chatbot-trigger, .ai-assistant, .chat-icon');
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'homepage-chatbot-visibility.png'),
      fullPage: true
    });
    
    if (chatbotTrigger) {
      // Check if trigger is visible
      const isVisible = await chatbotTrigger.isIntersectingViewport();
      
      if (isVisible) {
        recordTest('Chatbot Trigger Visibility', true, 'Chatbot trigger is visible on homepage');
      } else {
        recordTest('Chatbot Trigger Visibility', false, 'Chatbot trigger is not visible in viewport');
      }
      
      // Test trigger positioning
      const boundingBox = await chatbotTrigger.boundingBox();
      if (boundingBox) {
        testResults.chatbotMetrics.triggerPosition = {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height
        };
        recordTest('Chatbot Trigger Positioning', true, `Trigger positioned at (${boundingBox.x}, ${boundingBox.y})`);
      }
    } else {
      recordTest('Chatbot Trigger Visibility', false, 'No chatbot trigger found on homepage');
    }
    
    // Test accessibility attributes
    const hasAriaLabel = await page.$('[data-testid="chatbot-trigger"][aria-label], [data-testid="nutrition-assistant"][aria-label]');
    if (hasAriaLabel) {
      recordTest('Chatbot Accessibility', true, 'Chatbot trigger has aria-label');
    } else {
      recordTest('Chatbot Accessibility', false, 'Chatbot trigger missing aria-label');
    }
    
  } catch (error) {
    recordTest('Chatbot Visibility', false, error.message);
  }
}

/**
 * Test chatbot initialization and opening
 */
async function testChatbotInitialization(page) {
  console.log('🚀 Testing Chatbot Initialization...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Find and click chatbot trigger
    const chatbotTrigger = await page.$('[data-testid="chatbot-trigger"], [data-testid="nutrition-assistant"], .chatbot-trigger, .ai-assistant, .chat-icon');
    
    if (chatbotTrigger) {
      await chatbotTrigger.click();
      
      // Wait for chatbot to open
      await page.waitForSelector('[data-testid="chatbot-window"], [data-testid="nutrition-assistant-modal"], .chatbot-window, .chat-modal, .ai-chat', { timeout: 5000 }).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-opened.png'),
        fullPage: true
      });
      
      // Check if chatbot window is visible
      const chatbotWindow = await page.$('[data-testid="chatbot-window"], [data-testid="nutrition-assistant-modal"], .chatbot-window, .chat-modal, .ai-chat');
      
      if (chatbotWindow) {
        recordTest('Chatbot Initialization', true, 'Chatbot window opens successfully');
        
        // Test initial greeting message
        const greetingMessage = await page.$('[data-testid="welcome-message"], .greeting, .initial-message, .welcome-text');
        if (greetingMessage) {
          const greetingText = await greetingMessage.textContent();
          recordTest('Chatbot Greeting Message', true, `Greeting: ${greetingText?.substring(0, 50)}...`);
        } else {
          recordTest('Chatbot Greeting Message', false, 'No greeting message found');
        }
        
        // Test chatbot header/title
        const chatbotHeader = await page.$('[data-testid="chatbot-header"], .chat-header, .ai-title');
        if (chatbotHeader) {
          const headerText = await chatbotHeader.textContent();
          recordTest('Chatbot Header', true, `Header: ${headerText?.substring(0, 30)}...`);
        } else {
          recordTest('Chatbot Header', false, 'No chatbot header found');
        }
      } else {
        recordTest('Chatbot Initialization', false, 'Chatbot window did not open');
      }
    } else {
      recordTest('Chatbot Initialization', false, 'No chatbot trigger found to test initialization');
    }
    
  } catch (error) {
    recordTest('Chatbot Initialization', false, error.message);
  }
}

/**
 * Test chatbot interface elements
 */
async function testChatbotInterface(page) {
  console.log('🎨 Testing Chatbot Interface...');
  
  try {
    // Ensure chatbot is open
    await ensureChatbotOpen(page);
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-interface.png'),
      fullPage: true
    });
    
    // Test input field
    const inputField = await page.$('[data-testid="chat-input"], input[type="text"], textarea, .message-input');
    if (inputField) {
      recordTest('Chatbot Input Field', true, 'Chat input field found');
      
      // Test placeholder text
      const placeholder = await inputField.getAttribute('placeholder');
      if (placeholder) {
        recordTest('Input Placeholder', true, `Placeholder: ${placeholder}`);
      }
    } else {
      recordTest('Chatbot Input Field', false, 'No chat input field found');
    }
    
    // Test send button
    const sendButton = await page.$('[data-testid="send-button"], button[type="submit"], .send-btn, .chat-send');
    if (sendButton) {
      recordTest('Chatbot Send Button', true, 'Send button found');
    } else {
      recordTest('Chatbot Send Button', false, 'No send button found');
    }
    
    // Test close button
    const closeButton = await page.$('[data-testid="close-chatbot"], .close-btn, .modal-close, [aria-label*="close"]');
    if (closeButton) {
      recordTest('Chatbot Close Button', true, 'Close button found');
    } else {
      recordTest('Chatbot Close Button', false, 'No close button found');
    }
    
    // Test messages container
    const messagesContainer = await page.$('[data-testid="messages-container"], .messages, .chat-messages, .conversation');
    if (messagesContainer) {
      recordTest('Messages Container', true, 'Messages container found');
    } else {
      recordTest('Messages Container', false, 'No messages container found');
    }
    
    // Test quick reply buttons (if any)
    const quickReplies = await page.$$('[data-testid="quick-reply"], .quick-reply, .suggestion-btn');
    if (quickReplies.length > 0) {
      recordTest('Quick Reply Buttons', true, `Found ${quickReplies.length} quick reply options`);
    } else {
      recordTest('Quick Reply Buttons', false, 'No quick reply buttons found');
    }
    
  } catch (error) {
    recordTest('Chatbot Interface', false, error.message);
  }
}

/**
 * Test chatbot conversation flow
 */
async function testChatbotConversationFlow(page) {
  console.log('💬 Testing Chatbot Conversation Flow...');
  
  try {
    await ensureChatbotOpen(page);
    
    // Test sending a message
    const inputField = await page.$('[data-testid="chat-input"], input[type="text"], textarea, .message-input');
    const sendButton = await page.$('[data-testid="send-button"], button[type="submit"], .send-btn, .chat-send');
    
    if (inputField && sendButton) {
      const testMessage = "Hello, I need help with nutrition advice";
      
      await inputField.click();
      await inputField.type(testMessage);
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-typing-message.png'),
        fullPage: true
      });
      
      await sendButton.click();
      
      // Wait for response
      await page.waitForSelector('.message, .chat-message, [data-testid="message"]', { timeout: 10000 }).catch(() => {});
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-conversation-started.png'),
        fullPage: true
      });
      
      // Check if message appears in conversation
      const messages = await page.$$('.message, .chat-message, [data-testid="message"]');
      if (messages.length > 0) {
        recordTest('Message Sending', true, `Found ${messages.length} messages in conversation`);
        
        // Check for bot response
        const botMessages = await page.$$('.bot-message, .ai-message, [data-sender="bot"]');
        if (botMessages.length > 0) {
          recordTest('Bot Response', true, 'Bot responded to user message');
          
          // Get response content
          const latestBotMessage = botMessages[botMessages.length - 1];
          const responseText = await latestBotMessage.textContent();
          testResults.chatbotMetrics.sampleResponse = responseText?.substring(0, 100);
        } else {
          recordTest('Bot Response', false, 'No bot response detected');
        }
      } else {
        recordTest('Message Sending', false, 'Message did not appear in conversation');
      }
      
      // Test typing indicator (if available)
      const typingIndicator = await page.$('.typing-indicator, .bot-typing, [data-testid="typing"]');
      if (typingIndicator) {
        recordTest('Typing Indicator', true, 'Typing indicator present during response');
      }
      
    } else {
      recordTest('Conversation Flow', false, 'Missing input field or send button');
    }
    
  } catch (error) {
    recordTest('Chatbot Conversation Flow', false, error.message);
  }
}

/**
 * Test chatbot product recommendations
 */
async function testChatbotProductRecommendations(page) {
  console.log('🛍️ Testing Chatbot Product Recommendations...');
  
  try {
    await ensureChatbotOpen(page);
    
    const productQuery = "Can you recommend some high-protein snacks?";
    await sendChatMessage(page, productQuery);
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-product-recommendation.png'),
      fullPage: true
    });
    
    // Look for product links or recommendations
    const productLinks = await page.$$('a[href*="/products"], .product-link, [data-testid="product-recommendation"]');
    if (productLinks.length > 0) {
      recordTest('Product Recommendations', true, `Found ${productLinks.length} product recommendations`);
    } else {
      recordTest('Product Recommendations', false, 'No product links found in response');
    }
    
    // Test another product query
    const specificQuery = "What protein bars do you have?";
    await sendChatMessage(page, specificQuery);
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-specific-product-query.png'),
      fullPage: true
    });
    
  } catch (error) {
    recordTest('Chatbot Product Recommendations', false, error.message);
  }
}

/**
 * Test chatbot nutrition queries
 */
async function testChatbotNutritionQueries(page) {
  console.log('🥗 Testing Chatbot Nutrition Queries...');
  
  try {
    await ensureChatbotOpen(page);
    
    const nutritionQueries = [
      "How much protein should I eat daily?",
      "What are the benefits of natural foods?",
      "Can you help me with meal planning?"
    ];
    
    for (let i = 0; i < nutritionQueries.length; i++) {
      const query = nutritionQueries[i];
      await sendChatMessage(page, query);
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, `nutrition-query-${i + 1}.png`),
        fullPage: true
      });
      
      // Check for nutrition-related keywords in response
      const latestResponse = await getLatestBotResponse(page);
      if (latestResponse) {
        const nutritionKeywords = ['protein', 'nutrition', 'healthy', 'calories', 'vitamins', 'minerals'];
        const hasNutritionContent = nutritionKeywords.some(keyword => 
          latestResponse.toLowerCase().includes(keyword)
        );
        
        if (hasNutritionContent) {
          recordTest(`Nutrition Query ${i + 1}`, true, `Response contains nutrition content`);
        } else {
          recordTest(`Nutrition Query ${i + 1}`, false, `Response lacks nutrition content`);
        }
      }
    }
    
  } catch (error) {
    recordTest('Chatbot Nutrition Queries', false, error.message);
  }
}

/**
 * Test chatbot support queries
 */
async function testChatbotSupportQueries(page) {
  console.log('🆘 Testing Chatbot Support Queries...');
  
  try {
    await ensureChatbotOpen(page);
    
    const supportQueries = [
      "How can I track my order?",
      "What's your return policy?",
      "Do you offer free shipping?",
      "How do I cancel my subscription?"
    ];
    
    for (let i = 0; i < supportQueries.length; i++) {
      const query = supportQueries[i];
      await sendChatMessage(page, query);
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, `support-query-${i + 1}.png`),
        fullPage: true
      });
      
      // Check for support-related keywords in response
      const latestResponse = await getLatestBotResponse(page);
      if (latestResponse) {
        const supportKeywords = ['order', 'return', 'shipping', 'policy', 'cancel', 'support'];
        const hasSupportContent = supportKeywords.some(keyword => 
          latestResponse.toLowerCase().includes(keyword)
        );
        
        if (hasSupportContent) {
          recordTest(`Support Query ${i + 1}`, true, `Response contains support content`);
        } else {
          recordTest(`Support Query ${i + 1}`, false, `Response lacks support content`);
        }
      }
    }
    
  } catch (error) {
    recordTest('Chatbot Support Queries', false, error.message);
  }
}

/**
 * Test chatbot contextual responses
 */
async function testChatbotContextualResponses(page) {
  console.log('🧠 Testing Chatbot Contextual Responses...');
  
  try {
    await ensureChatbotOpen(page);
    
    // Test follow-up questions
    await sendChatMessage(page, "I'm looking for protein snacks");
    await sendChatMessage(page, "I'm vegetarian");
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-contextual-response.png'),
      fullPage: true
    });
    
    const latestResponse = await getLatestBotResponse(page);
    if (latestResponse) {
      const hasVegetarianContext = latestResponse.toLowerCase().includes('vegetarian') || 
                                   latestResponse.toLowerCase().includes('plant-based');
      
      if (hasVegetarianContext) {
        recordTest('Contextual Understanding', true, 'Bot understands vegetarian context');
      } else {
        recordTest('Contextual Understanding', false, 'Bot lacks contextual understanding');
      }
    }
    
    // Test conversation memory
    await sendChatMessage(page, "What about the protein content?");
    
    const followUpResponse = await getLatestBotResponse(page);
    if (followUpResponse) {
      const hasProteinInfo = followUpResponse.toLowerCase().includes('protein');
      
      if (hasProteinInfo) {
        recordTest('Conversation Memory', true, 'Bot remembers previous context');
      } else {
        recordTest('Conversation Memory', false, 'Bot lacks conversation memory');
      }
    }
    
  } catch (error) {
    recordTest('Chatbot Contextual Responses', false, error.message);
  }
}

/**
 * Test chatbot mobile experience
 */
async function testChatbotMobileExperience(page) {
  console.log('📱 Testing Chatbot Mobile Experience...');
  
  try {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(TEST_CONFIG.baseUrl);
    
    await page.screenshot({
      path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-mobile-view.png'),
      fullPage: true
    });
    
    // Test chatbot trigger on mobile
    const chatbotTrigger = await page.$('[data-testid="chatbot-trigger"], [data-testid="nutrition-assistant"], .chatbot-trigger');
    if (chatbotTrigger) {
      const isVisible = await chatbotTrigger.isIntersectingViewport();
      if (isVisible) {
        recordTest('Mobile Chatbot Trigger', true, 'Chatbot trigger visible on mobile');
        
        await chatbotTrigger.click();
        
        // Test mobile chatbot interface
        const chatbotWindow = await page.$('[data-testid="chatbot-window"], [data-testid="nutrition-assistant-modal"], .chatbot-window');
        if (chatbotWindow) {
          const boundingBox = await chatbotWindow.boundingBox();
          const viewportWidth = 375;
          
          if (boundingBox && boundingBox.width <= viewportWidth) {
            recordTest('Mobile Chatbot Layout', true, 'Chatbot fits mobile viewport');
          } else {
            recordTest('Mobile Chatbot Layout', false, 'Chatbot layout issues on mobile');
          }
          
          await page.screenshot({
            path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-mobile-opened.png'),
            fullPage: true
          });
        }
      } else {
        recordTest('Mobile Chatbot Trigger', false, 'Chatbot trigger not visible on mobile');
      }
    } else {
      recordTest('Mobile Chatbot Trigger', false, 'No chatbot trigger found on mobile');
    }
    
    // Reset viewport
    await page.setViewport(TEST_CONFIG.viewport);
    
  } catch (error) {
    recordTest('Chatbot Mobile Experience', false, error.message);
  }
}

/**
 * Test chatbot performance metrics
 */
async function testChatbotPerformance(page) {
  console.log('⚡ Testing Chatbot Performance...');
  
  try {
    await page.goto(TEST_CONFIG.baseUrl);
    
    const startTime = Date.now();
    
    // Open chatbot and measure response time
    const chatbotTrigger = await page.$('[data-testid="chatbot-trigger"], [data-testid="nutrition-assistant"], .chatbot-trigger');
    if (chatbotTrigger) {
      await chatbotTrigger.click();
      
      const openTime = Date.now() - startTime;
      testResults.chatbotMetrics.openTime = openTime;
      
      if (openTime < 2000) {
        recordTest('Chatbot Open Performance', true, `Opens in ${openTime}ms`);
      } else {
        recordTest('Chatbot Open Performance', false, `Slow opening: ${openTime}ms`);
      }
      
      // Test message response time
      const messageStartTime = Date.now();
      await sendChatMessage(page, "Hello");
      
      // Wait for response
      await page.waitForSelector('.bot-message, .ai-message, [data-sender="bot"]', { timeout: 15000 }).catch(() => {});
      
      const responseTime = Date.now() - messageStartTime;
      testResults.chatbotMetrics.responseTime = responseTime;
      
      if (responseTime < 5000) {
        recordTest('Chatbot Response Performance', true, `Responds in ${responseTime}ms`);
      } else {
        recordTest('Chatbot Response Performance', false, `Slow response: ${responseTime}ms`);
      }
      
      await page.screenshot({
        path: path.join(TEST_CONFIG.screenshotDir, 'chatbot-performance-test.png'),
        fullPage: true
      });
    }
    
  } catch (error) {
    recordTest('Chatbot Performance', false, error.message);
  }
}

/**
 * Helper function to ensure chatbot is open
 */
async function ensureChatbotOpen(page) {
  const chatbotWindow = await page.$('[data-testid="chatbot-window"], [data-testid="nutrition-assistant-modal"], .chatbot-window, .chat-modal');
  
  if (!chatbotWindow) {
    const chatbotTrigger = await page.$('[data-testid="chatbot-trigger"], [data-testid="nutrition-assistant"], .chatbot-trigger');
    if (chatbotTrigger) {
      await chatbotTrigger.click();
      await page.waitForSelector('[data-testid="chatbot-window"], [data-testid="nutrition-assistant-modal"], .chatbot-window, .chat-modal', { timeout: 5000 }).catch(() => {});
    }
  }
}

/**
 * Helper function to send a chat message
 */
async function sendChatMessage(page, message) {
  try {
    const inputField = await page.$('[data-testid="chat-input"], input[type="text"], textarea, .message-input');
    const sendButton = await page.$('[data-testid="send-button"], button[type="submit"], .send-btn, .chat-send');
    
    if (inputField && sendButton) {
      await inputField.click();
      await inputField.fill(''); // Clear previous text
      await inputField.type(message);
      await sendButton.click();
      
      // Wait a bit for the message to be processed
      await page.waitForSelector('body', {timeout: 2000}).catch(() => {});
    }
  } catch (error) {
    console.log('Error sending message:', error.message);
  }
}

/**
 * Helper function to get latest bot response
 */
async function getLatestBotResponse(page) {
  try {
    const botMessages = await page.$$('.bot-message, .ai-message, [data-sender="bot"]');
    if (botMessages.length > 0) {
      const latestMessage = botMessages[botMessages.length - 1];
      return await latestMessage.textContent();
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Record test result
 */
function recordTest(testName, passed, details = '') {
  const result = {
    test: testName,
    status: passed ? 'PASS' : 'FAIL',
    details,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  testResults.summary.total++;
  
  if (passed) {
    testResults.summary.passed++;
    console.log(`✅ ${testName}: ${details}`);
  } else {
    testResults.summary.failed++;
    console.log(`❌ ${testName}: ${details}`);
  }
}

/**
 * Generate comprehensive test reports
 */
async function generateReports() {
  console.log('\n📊 Generating AI Chatbot Test Reports...');
  
  // Calculate final metrics
  testResults.summary.successRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1);
  
  // Generate recommendations
  if (testResults.summary.successRate < 80) {
    testResults.recommendations.push('Improve chatbot response accuracy and reliability');
  }
  
  if (!testResults.chatbotMetrics.responseTime || testResults.chatbotMetrics.responseTime > 5000) {
    testResults.recommendations.push('Optimize chatbot response time for better user experience');
  }
  
  if (!testResults.chatbotMetrics.openTime || testResults.chatbotMetrics.openTime > 2000) {
    testResults.recommendations.push('Improve chatbot initialization performance');
  }
  
  testResults.recommendations.push('Implement comprehensive natural language processing');
  testResults.recommendations.push('Add more contextual understanding capabilities');
  testResults.recommendations.push('Enhance mobile chatbot experience');
  testResults.recommendations.push('Add voice input/output functionality');
  testResults.recommendations.push('Implement chatbot analytics and conversation tracking');
  
  // Save JSON report
  await fs.writeFile(TEST_CONFIG.reportFile, JSON.stringify(testResults, null, 2));
  
  // Generate Markdown report
  const markdownReport = generateMarkdownReport();
  await fs.writeFile(TEST_CONFIG.markdownFile, markdownReport);
  
  console.log(`✅ Reports generated:`);
  console.log(`   📄 JSON: ${TEST_CONFIG.reportFile}`);
  console.log(`   📝 Markdown: ${TEST_CONFIG.markdownFile}`);
  console.log(`\n🤖 AI Chatbot Test Summary:`);
  console.log(`   Total Tests: ${testResults.summary.total}`);
  console.log(`   Passed: ${testResults.summary.passed}`);
  console.log(`   Failed: ${testResults.summary.failed}`);
  console.log(`   Success Rate: ${testResults.summary.successRate}%`);
}

/**
 * Generate markdown report
 */
function generateMarkdownReport() {
  return `# AI Chatbot Integration Testing Report

## Test Summary
- **Date**: ${new Date(testResults.timestamp).toLocaleString()}
- **URL**: ${testResults.url}
- **Total Tests**: ${testResults.summary.total}
- **Passed**: ${testResults.summary.passed}
- **Failed**: ${testResults.summary.failed}
- **Success Rate**: ${testResults.summary.successRate}%

## Chatbot Performance Metrics
${Object.entries(testResults.chatbotMetrics).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

## Test Results

### ✅ Passed Tests
${testResults.tests.filter(t => t.status === 'PASS').map(t => `- **${t.test}**: ${t.details}`).join('\n')}

### ❌ Failed Tests
${testResults.tests.filter(t => t.status === 'FAIL').map(t => `- **${t.test}**: ${t.details}`).join('\n')}

## Recommendations
${testResults.recommendations.map(r => `- ${r}`).join('\n')}

## AI Chatbot Features Analysis

### Visibility and Accessibility
The chatbot should be easily discoverable and accessible:
- Prominent trigger button placement
- Clear visual indicators
- Proper ARIA labels for screen readers
- Consistent branding and styling

### User Interface
Essential interface components:
- Input field for typing messages
- Send button for message submission
- Message history display
- Close/minimize functionality
- Quick reply suggestions

### Conversation Flow
Natural conversation experience:
- Welcome message on initialization
- Typing indicators during processing
- Message timestamps and status
- Conversation memory and context
- Error handling for failed messages

### AI Capabilities
Intelligent response features:
- Product recommendations based on queries
- Nutrition advice and information
- Support query handling
- Contextual understanding
- Follow-up question processing

### Performance Requirements
Optimal performance standards:
- Chatbot opens in < 2 seconds
- Responses generated in < 5 seconds
- Smooth scrolling and interactions
- Minimal impact on page load time
- Efficient memory usage

### Mobile Experience
Mobile-optimized functionality:
- Responsive chatbot interface
- Touch-friendly controls
- Proper viewport handling
- Keyboard integration
- Gesture support

## Integration Points

### Product Recommendations
- Link to product pages
- Display product images and prices
- Integration with shopping cart
- Personalized suggestions based on user data

### Nutrition Assistant
- Calorie and macro calculations
- Meal planning suggestions
- Dietary restriction considerations
- Health goal alignment

### Customer Support
- Order tracking assistance
- Policy information delivery
- FAQ automated responses
- Escalation to human support when needed

## Next Steps
1. Implement missing chatbot functionality
2. Optimize response times and accuracy
3. Add natural language processing capabilities
4. Integrate with existing user data and preferences
5. Set up chatbot analytics and monitoring
6. Regular testing and improvement cycles

---
*Report generated by AI Chatbot Testing Suite*
`;
}

// Run the tests
if (require.main === module) {
  runAIChatbotTests().catch(console.error);
}

module.exports = { runAIChatbotTests };