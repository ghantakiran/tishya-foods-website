#!/usr/bin/env node

const { spawn } = require('child_process');
const config = require('./config/test-config');

async function runAllTests() {
  const totalShards = Object.keys(config.sharding).length;
  const promises = [];

  console.log(`Running ${totalShards} test shards in parallel...`);

  // Run all shards in parallel
  for (let i = 1; i <= totalShards; i++) {
    const promise = new Promise((resolve, reject) => {
      const child = spawn('node', ['tests/puppeteer/run-shard.js', i.toString()], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ shard: i, success: true });
        } else {
          reject(new Error(`Shard ${i} failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start shard ${i}: ${error.message}`));
      });
    });

    promises.push(promise);
  }

  try {
    const results = await Promise.all(promises);
    console.log('\n🎉 All test shards completed successfully!');
    console.log('Results:', results);
  } catch (error) {
    console.error('\n❌ Some test shards failed:', error.message);
    process.exit(1);
  }
}

runAllTests();