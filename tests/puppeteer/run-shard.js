#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const config = require('./config/test-config');
const testUtils = require('./utils/test-utils');

async function runShard(shardNumber) {
  const shardTests = config.sharding[shardNumber];
  
  if (!shardTests) {
    console.error(`Invalid shard number: ${shardNumber}`);
    process.exit(1);
  }

  console.log(`Running test shard ${shardNumber}: ${shardTests.join(', ')}`);
  
  const browser = await testUtils.launchBrowser(puppeteer);
  const results = {
    shard: shardNumber,
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    },
    startTime: new Date(),
    endTime: null,
    duration: 0
  };

  try {
    // Run each test in the shard
    for (const testName of shardTests) {
      console.log(`\n--- Running test: ${testName} ---`);
      
      const testResult = {
        name: testName,
        status: 'running',
        startTime: new Date(),
        endTime: null,
        duration: 0,
        error: null,
        screenshots: [],
        performance: null
      };

      try {
        const testRunner = require(`./tests/${testName}.test.js`);
        await testRunner.run(browser, testUtils);
        
        testResult.status = 'passed';
        testResult.endTime = new Date();
        testResult.duration = testResult.endTime - testResult.startTime;
        results.summary.passed++;
        
        console.log(`✅ Test ${testName} passed in ${testResult.duration}ms`);
        
      } catch (error) {
        testResult.status = 'failed';
        testResult.error = error.message;
        testResult.endTime = new Date();
        testResult.duration = testResult.endTime - testResult.startTime;
        results.summary.failed++;
        
        console.error(`❌ Test ${testName} failed:`, error.message);
        
        // Take screenshot on failure
        try {
          const pages = await browser.pages();
          if (pages.length > 0) {
            const screenshotPath = await testUtils.takeScreenshot(
              pages[0], 
              `shard-${shardNumber}-${testName}-failure`
            );
            testResult.screenshots.push(screenshotPath);
          }
        } catch (screenshotError) {
          console.error('Failed to take failure screenshot:', screenshotError);
        }
      }
      
      results.tests.push(testResult);
      results.summary.total++;
    }

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;

    // Save results
    await testUtils.saveTestResults(`shard-${shardNumber}`, results);

    console.log(`\n--- Shard ${shardNumber} Complete ---`);
    console.log(`Total: ${results.summary.total}`);
    console.log(`Passed: ${results.summary.passed}`);
    console.log(`Failed: ${results.summary.failed}`);
    console.log(`Duration: ${results.duration}ms`);

    if (results.summary.failed > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Shard execution failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Get shard number from command line arguments
const shardNumber = process.argv[2];
if (!shardNumber) {
  console.error('Usage: node run-shard.js <shard-number>');
  process.exit(1);
}

runShard(parseInt(shardNumber));