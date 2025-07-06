#!/usr/bin/env node

// Test script for GitHub MCP configuration
const { spawn } = require('child_process');

console.log('🐙 Testing GitHub MCP Configuration...\n');

// Test GitHub MCP server
const githubMcpServer = spawn('node', [
  '/Users/kiranreddyghanta/Developer/TishyaFoods/tishya-foods-website/node_modules/@modelcontextprotocol/server-github/dist/index.js'
], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    GITHUB_PERSONAL_ACCESS_TOKEN: 'REDACTED'
  }
});

let output = '';
let errorOutput = '';

githubMcpServer.stdout.on('data', (data) => {
  output += data.toString();
});

githubMcpServer.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// Send initialization message
const initMessage = JSON.stringify({
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

// Send tools list request
const toolsMessage = JSON.stringify({
  jsonrpc: "2.0",
  id: 2,
  method: "tools/list",
  params: {}
}) + '\n';

githubMcpServer.stdin.write(initMessage);

setTimeout(() => {
  githubMcpServer.stdin.write(toolsMessage);
}, 1000);

setTimeout(() => {
  githubMcpServer.kill();
  
  console.log('📋 GitHub MCP Server Response:');
  console.log('stdout:', output || 'No output');
  console.log('stderr:', errorOutput || 'No errors');
  
  // Check for GitHub tools
  if (output.includes('github') || output.includes('repository')) {
    console.log('\n✅ SUCCESS: GitHub MCP server is working!');
    console.log('\n🔧 Available GitHub Tools:');
    console.log('- Create repositories');
    console.log('- Manage issues');
    console.log('- Create pull requests');
    console.log('- Search code');
    console.log('- Fork repositories');
    console.log('- And more...');
  } else {
    console.log('\n⚠️  GitHub MCP server may need additional configuration');
  }
}, 3000);

githubMcpServer.on('error', (error) => {
  console.error('❌ Error starting GitHub MCP server:', error.message);
});