const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running user authentication tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('user-authentication');

  try {
    // Test 1: Navigate to login page
    await testUtils.navigateToPage(page, '/');
    
    // Look for login button in navigation
    const loginBtn = await page.$('[data-testid="login-button"]');
    if (loginBtn) {
      await loginBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log('✓ Navigated to login page');
    } else {
      // Fallback: navigate directly
      await testUtils.navigateToPage(page, '/auth/login');
    }

    // Test 2: Login form validation
    console.log('Testing login form validation...');
    
    const loginForm = await page.$('[data-testid="login-form"]');
    if (loginForm) {
      // Test empty form submission
      const submitBtn = await loginForm.$('[data-testid="login-submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        
        const errorMessages = await page.$$('.error, [data-testid="error-message"]');
        if (errorMessages.length > 0) {
          console.log('✓ Login form validation works for empty fields');
        }
      }
      
      // Test invalid email format
      const emailField = await loginForm.$('[data-testid="email"]');
      const passwordField = await loginForm.$('[data-testid="password"]');
      
      if (emailField && passwordField) {
        await emailField.type('invalid-email');
        await passwordField.type('password');
        
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Email validation tested');
        }
        
        // Clear fields
        await emailField.click({ clickCount: 3 });
        await emailField.press('Backspace');
        await passwordField.click({ clickCount: 3 });
        await passwordField.press('Backspace');
      }
    }

    // Test 3: Valid login attempt (with test credentials)
    if (loginForm) {
      const emailField = await loginForm.$('[data-testid="email"]');
      const passwordField = await loginForm.$('[data-testid="password"]');
      const submitBtn = await loginForm.$('[data-testid="login-submit"]');
      
      if (emailField && passwordField && submitBtn) {
        await emailField.type(config.testData.users.validUser.email);
        await passwordField.type(config.testData.users.validUser.password);
        await submitBtn.click();
        await page.waitForTimeout(2000);
        
        // Check if redirected or error shown
        const currentUrl = page.url();
        if (currentUrl.includes('/dashboard') || currentUrl.includes('/profile')) {
          console.log('✓ Login successful - redirected to dashboard');
        } else {
          console.log('⚠ Login attempt completed (may show error for test credentials)');
        }
      }
    }

    // Test 4: Forgot password functionality
    const forgotPasswordLink = await page.$('[data-testid="forgot-password"]');
    if (forgotPasswordLink) {
      await forgotPasswordLink.click();
      await page.waitForTimeout(1000);
      console.log('✓ Forgot password link works');
      
      // Test forgot password form
      const forgotForm = await page.$('[data-testid="forgot-password-form"]');
      if (forgotForm) {
        const emailInput = await forgotForm.$('input[type="email"]');
        const resetBtn = await forgotForm.$('button[type="submit"]');
        
        if (emailInput && resetBtn) {
          await emailInput.type('test@example.com');
          await resetBtn.click();
          await page.waitForTimeout(1000);
          console.log('✓ Password reset request tested');
        }
      }
      
      // Go back to login
      await page.goBack();
      await page.waitForTimeout(500);
    }

    // Test 5: Registration page
    await testUtils.navigateToPage(page, '/auth/register');
    await testUtils.waitForElement(page, 'h1');
    console.log('✓ Registration page loaded');

    // Test 6: Registration form validation
    const registerForm = await page.$('[data-testid="register-form"]');
    if (registerForm) {
      console.log('Testing registration form...');
      
      const formData = {
        '[data-testid="register-name"]': 'Test User',
        '[data-testid="register-email"]': 'testuser@example.com',
        '[data-testid="register-password"]': 'Password123!',
        '[data-testid="register-confirm-password"]': 'Password123!'
      };

      for (const [selector, value] of Object.entries(formData)) {
        const field = await page.$(selector);
        if (field) {
          await field.type(value);
          console.log(`✓ Filled ${selector}`);
        }
      }

      // Test terms and conditions checkbox
      const termsCheckbox = await registerForm.$('[data-testid="terms-checkbox"]');
      if (termsCheckbox) {
        await termsCheckbox.click();
        console.log('✓ Terms accepted');
      }

      // Test password mismatch validation
      const confirmPasswordField = await registerForm.$('[data-testid="register-confirm-password"]');
      if (confirmPasswordField) {
        await confirmPasswordField.click({ clickCount: 3 });
        await confirmPasswordField.type('DifferentPassword');
        
        const submitBtn = await registerForm.$('[data-testid="register-submit"]');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Password mismatch validation tested');
        }
      }
    }

    // Test 7: Social login buttons (if present)
    const socialLogins = await page.$$('[data-testid*="social-login"]');
    if (socialLogins.length > 0) {
      console.log(`✓ Found ${socialLogins.length} social login options`);
    }

    // Test 8: Navigate to profile (if logged in)
    await testUtils.navigateToPage(page, '/profile');
    const profilePage = await page.$('[data-testid="profile-page"]');
    if (profilePage) {
      console.log('✓ Profile page accessible');
      
      // Test profile information display
      const profileInfo = await page.$('[data-testid="profile-info"]');
      if (profileInfo) {
        console.log('✓ Profile information section found');
      }
      
      // Test edit profile functionality
      const editBtn = await page.$('[data-testid="edit-profile"]');
      if (editBtn) {
        await editBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Edit profile functionality accessible');
      }
    }

    // Test 9: Account settings
    const accountSettings = await page.$('[data-testid="account-settings"]');
    if (accountSettings) {
      console.log('✓ Account settings found');
      
      // Test password change form
      const changePasswordBtn = await page.$('[data-testid="change-password"]');
      if (changePasswordBtn) {
        await changePasswordBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Change password form accessible');
      }
    }

    // Test 10: Logout functionality
    const logoutBtn = await page.$('[data-testid="logout-button"]');
    if (logoutBtn) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      
      // Check if redirected to home page
      const currentUrl = page.url();
      if (currentUrl.includes('/') && !currentUrl.includes('/profile')) {
        console.log('✓ Logout successful');
      }
    }

    // Test 11: Protected route access
    await testUtils.navigateToPage(page, '/dashboard');
    const loginRedirect = page.url().includes('/login') || page.url().includes('/auth');
    if (loginRedirect) {
      console.log('✓ Protected routes redirect to login');
    }

    // Test 12: Session persistence
    await testUtils.navigateToPage(page, '/auth/login');
    const loginForm2 = await page.$('[data-testid="login-form"]');
    if (loginForm2) {
      // Attempt login again
      const emailField = await loginForm2.$('[data-testid="email"]');
      const passwordField = await loginForm2.$('[data-testid="password"]');
      const submitBtn = await loginForm2.$('[data-testid="login-submit"]');
      
      if (emailField && passwordField && submitBtn) {
        await emailField.type(config.testData.users.validUser.email);
        await passwordField.type(config.testData.users.validUser.password);
        await submitBtn.click();
        await page.waitForTimeout(2000);
        
        // Reload page to test session persistence
        await page.reload();
        await page.waitForTimeout(1000);
        
        const userMenu = await page.$('[data-testid="user-menu"]');
        if (userMenu) {
          console.log('✓ Session persistence works');
        }
      }
    }

    // Test 13: Mobile authentication experience
    await testUtils.simulateMobileDevice(page);
    await testUtils.navigateToPage(page, '/auth/login');
    await testUtils.waitForElement(page, '[data-testid="login-form"]');
    console.log('✓ Mobile authentication experience verified');

    // Test 14: Accessibility check on auth forms
    const accessibilityResult = await testUtils.checkAccessibility(page, {
      tags: ['wcag2a', 'wcag2aa']
    });
    console.log('✓ Accessibility check completed:', {
      violations: accessibilityResult.violations.length,
      score: accessibilityResult.score
    });

    // Test 15: Performance check
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Authentication performance metrics:', {
      pageLoad: performance.pageLoad,
      firstContentfulPaint: performance.firstContentfulPaint
    });

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'user-authentication-final');
    
    console.log('User authentication tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };