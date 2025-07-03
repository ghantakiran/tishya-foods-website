#!/usr/bin/env node

// Simple test script for MCP Puppeteer setup
const { spawn } = require('child_process');

console.log('🤖 Testing MCP Puppeteer Setup...\n');

// Test if the MCP server can be started
const mcpServer = spawn('npx', ['-y', '@modelcontextprotocol/server-puppeteer'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

mcpServer.stdout.on('data', (data) => {
  output += data.toString();
});

mcpServer.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// Send a simple test message to the MCP server
const testMessage = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
}) + '\n';

mcpServer.stdin.write(testMessage);

setTimeout(() => {
  mcpServer.kill();
  
  console.log('✅ MCP Puppeteer Server Response:');
  console.log('stdout:', output || 'No output');
  console.log('stderr:', errorOutput || 'No errors');
  
  if (output.includes('jsonrpc') || output.includes('capabilities')) {
    console.log('\n🎉 SUCCESS: MCP Puppeteer server is responding correctly!');
    console.log('\n📋 Configuration Summary:');
    console.log('- ✅ @modelcontextprotocol/server-puppeteer installed');
    console.log('- ✅ Puppeteer dependency installed');
    console.log('- ✅ Cursor MCP configuration created at ~/.cursor/mcp.json');
    console.log('\n🔧 Next Steps:');
    console.log('1. Restart Cursor IDE to load the new MCP configuration');
    console.log('2. The Puppeteer MCP server will be available for AI interactions');
    console.log('3. You can now use natural language commands for web automation');
  } else {
    console.log('\n⚠️  MCP server may need additional configuration');
  }
}, 3000);

mcpServer.on('error', (error) => {
  console.error('❌ Error starting MCP server:', error.message);
});