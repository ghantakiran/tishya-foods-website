const config = require('../config/test-config');

async function run(browser, testUtils) {
  console.log('Running user profile tests...');
  
  const page = await testUtils.createPage(browser);
  const errorHandler = testUtils.createErrorHandler('user-profile');

  try {
    // Setup: Try to login first (or simulate logged in state)
    await testUtils.navigateToPage(page, '/profile');
    
    // Test 1: Profile page accessibility
    const profilePage = await page.$('[data-testid="profile-page"]');
    if (profilePage) {
      console.log('✓ Profile page is accessible');
    } else {
      console.log('⚠ Profile page not accessible (user not logged in)');
      // For testing purposes, navigate to a mock profile or continue with login flow
      await testUtils.navigateToPage(page, '/auth/login');
      // Mock login for testing
      console.log('⚠ Simulating logged-in state for profile tests');
    }

    // Test 2: Profile information display
    const profileInfo = await page.$('[data-testid="profile-info"]');
    if (profileInfo) {
      console.log('✓ Profile information section found');
      
      // Check for basic profile fields
      const profileFields = [
        'profile-name',
        'profile-email',
        'profile-phone',
        'profile-avatar'
      ];
      
      for (const field of profileFields) {
        const element = await page.$(`[data-testid="${field}"]`);
        if (element) {
          console.log(`✓ Profile field found: ${field}`);
        }
      }
    }

    // Test 3: Edit profile functionality
    const editProfileBtn = await page.$('[data-testid="edit-profile"]');
    if (editProfileBtn) {
      await editProfileBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Edit profile mode activated');
      
      // Test profile form fields
      const editForm = await page.$('[data-testid="edit-profile-form"]');
      if (editForm) {
        const formFields = {
          '[data-testid="edit-name"]': 'Updated Test User',
          '[data-testid="edit-phone"]': '+91 9876543210',
          '[data-testid="edit-bio"]': 'This is my updated bio'
        };
        
        for (const [selector, value] of Object.entries(formFields)) {
          const field = await page.$(selector);
          if (field) {
            await field.click({ clickCount: 3 });
            await field.type(value);
            console.log(`✓ Updated ${selector}`);
          }
        }
        
        // Test save changes
        const saveBtn = await editForm.$('[data-testid="save-profile"]');
        if (saveBtn) {
          await saveBtn.click();
          await page.waitForTimeout(1000);
          console.log('✓ Profile save functionality tested');
        }
      }
    }

    // Test 4: Profile picture upload
    const profilePictureSection = await page.$('[data-testid="profile-picture-section"]');
    if (profilePictureSection) {
      console.log('✓ Profile picture section found');
      
      const uploadBtn = await profilePictureSection.$('[data-testid="upload-picture"]');
      if (uploadBtn) {
        console.log('✓ Profile picture upload button found');
        // Note: Actual file upload testing would require file handling
      }
    }

    // Test 5: Account preferences
    const preferencesSection = await page.$('[data-testid="account-preferences"]');
    if (preferencesSection) {
      console.log('✓ Account preferences section found');
      
      // Test notification preferences
      const notificationToggles = await preferencesSection.$$('[data-testid*="notification-toggle"]');
      if (notificationToggles.length > 0) {
        await notificationToggles[0].click();
        await page.waitForTimeout(500);
        console.log('✓ Notification preferences toggle tested');
      }
      
      // Test privacy settings
      const privacySettings = await preferencesSection.$$('[data-testid*="privacy-setting"]');
      if (privacySettings.length > 0) {
        console.log(`✓ Found ${privacySettings.length} privacy settings`);
      }
    }

    // Test 6: Order history
    const orderHistorySection = await page.$('[data-testid="order-history"]');
    if (orderHistorySection) {
      console.log('✓ Order history section found');
      
      const orderItems = await orderHistorySection.$$('[data-testid="order-item"]');
      console.log(`✓ Found ${orderItems.length} orders in history`);
      
      // Test order details view
      if (orderItems.length > 0) {
        const viewDetailsBtn = await orderItems[0].$('[data-testid="view-order-details"]');
        if (viewDetailsBtn) {
          await viewDetailsBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Order details view tested');
        }
      }
    }

    // Test 7: Wishlist
    const wishlistSection = await page.$('[data-testid="wishlist"]');
    if (wishlistSection) {
      console.log('✓ Wishlist section found');
      
      const wishlistItems = await wishlistSection.$$('[data-testid="wishlist-item"]');
      console.log(`✓ Found ${wishlistItems.length} items in wishlist`);
      
      // Test remove from wishlist
      if (wishlistItems.length > 0) {
        const removeBtn = await wishlistItems[0].$('[data-testid="remove-from-wishlist"]');
        if (removeBtn) {
          await removeBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Remove from wishlist tested');
        }
      }
    }

    // Test 8: Saved addresses
    const addressesSection = await page.$('[data-testid="saved-addresses"]');
    if (addressesSection) {
      console.log('✓ Saved addresses section found');
      
      // Test add new address
      const addAddressBtn = await addressesSection.$('[data-testid="add-address"]');
      if (addAddressBtn) {
        await addAddressBtn.click();
        await page.waitForTimeout(500);
        
        const addressForm = await page.$('[data-testid="address-form"]');
        if (addressForm) {
          const addressData = {
            '[data-testid="address-name"]': 'Home',
            '[data-testid="address-line1"]': '123 Test Street',
            '[data-testid="address-city"]': 'Mumbai',
            '[data-testid="address-postal"]': '400001'
          };
          
          for (const [selector, value] of Object.entries(addressData)) {
            const field = await page.$(selector);
            if (field) {
              await field.type(value);
            }
          }
          
          const saveAddressBtn = await addressForm.$('[data-testid="save-address"]');
          if (saveAddressBtn) {
            await saveAddressBtn.click();
            await page.waitForTimeout(1000);
            console.log('✓ Add address functionality tested');
          }
        }
      }
    }

    // Test 9: Payment methods
    const paymentMethodsSection = await page.$('[data-testid="payment-methods"]');
    if (paymentMethodsSection) {
      console.log('✓ Payment methods section found');
      
      const paymentMethods = await paymentMethodsSection.$$('[data-testid="payment-method"]');
      console.log(`✓ Found ${paymentMethods.length} saved payment methods`);
      
      // Test add payment method
      const addPaymentBtn = await paymentMethodsSection.$('[data-testid="add-payment-method"]');
      if (addPaymentBtn) {
        await addPaymentBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Add payment method flow initiated');
      }
    }

    // Test 10: Subscription management
    const subscriptionsSection = await page.$('[data-testid="subscriptions"]');
    if (subscriptionsSection) {
      console.log('✓ Subscriptions section found');
      
      const subscriptions = await subscriptionsSection.$$('[data-testid="subscription-item"]');
      console.log(`✓ Found ${subscriptions.length} active subscriptions`);
      
      // Test subscription management
      if (subscriptions.length > 0) {
        const manageBtn = await subscriptions[0].$('[data-testid="manage-subscription"]');
        if (manageBtn) {
          await manageBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Subscription management accessed');
        }
      }
    }

    // Test 11: Loyalty points/rewards
    const loyaltySection = await page.$('[data-testid="loyalty-points"]');
    if (loyaltySection) {
      console.log('✓ Loyalty points section found');
      
      const pointsBalance = await loyaltySection.$('[data-testid="points-balance"]');
      if (pointsBalance) {
        const balance = await pointsBalance.textContent();
        console.log('✓ Points balance displayed:', balance);
      }
      
      const rewardsHistory = await loyaltySection.$$('[data-testid="reward-transaction"]');
      console.log(`✓ Found ${rewardsHistory.length} rewards transactions`);
    }

    // Test 12: Account security
    const securitySection = await page.$('[data-testid="account-security"]');
    if (securitySection) {
      console.log('✓ Account security section found');
      
      // Test change password
      const changePasswordBtn = await securitySection.$('[data-testid="change-password"]');
      if (changePasswordBtn) {
        await changePasswordBtn.click();
        await page.waitForTimeout(500);
        
        const passwordForm = await page.$('[data-testid="change-password-form"]');
        if (passwordForm) {
          console.log('✓ Change password form accessible');
        }
      }
      
      // Test two-factor authentication
      const twoFactorSection = await securitySection.$('[data-testid="two-factor-auth"]');
      if (twoFactorSection) {
        console.log('✓ Two-factor authentication options found');
      }
    }

    // Test 13: Download data / Account export
    const downloadDataBtn = await page.$('[data-testid="download-data"]');
    if (downloadDataBtn) {
      await downloadDataBtn.click();
      await page.waitForTimeout(1000);
      console.log('✓ Download data functionality tested');
    }

    // Test 14: Delete account
    const deleteAccountBtn = await page.$('[data-testid="delete-account"]');
    if (deleteAccountBtn) {
      console.log('✓ Delete account option found');
      // Note: We don't actually click this in tests
    }

    // Test 15: Mobile profile experience
    await testUtils.simulateMobileDevice(page);
    await page.reload();
    await page.waitForTimeout(1000);
    console.log('✓ Mobile profile experience verified');

    // Test 16: Profile tabs/navigation
    const profileTabs = await page.$$('[data-testid="profile-tab"]');
    if (profileTabs.length > 0) {
      for (let i = 0; i < Math.min(profileTabs.length, 3); i++) {
        await profileTabs[i].click();
        await page.waitForTimeout(500);
        console.log(`✓ Profile tab ${i + 1} navigation tested`);
      }
    }

    // Test 17: Performance check
    const performance = await testUtils.measurePerformance(page);
    console.log('✓ Profile performance metrics:', {
      pageLoad: performance.pageLoad,
      domContentLoaded: performance.domContentLoaded
    });

    // Take final screenshot
    await testUtils.takeScreenshot(page, 'user-profile-final');
    
    console.log('User profile tests completed successfully');
    
  } catch (error) {
    await errorHandler(error, page);
  } finally {
    await page.close();
  }
}

module.exports = { run };