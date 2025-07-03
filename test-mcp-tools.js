#!/usr/bin/env node

// Detailed test script for MCP Puppeteer tools availability
const { spawn } = require('child_process');

console.log('🔧 Testing MCP Puppeteer Tools Availability...\n');

// Test if the MCP server can list its tools
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

mcpServer.stdin.write(initMessage);

setTimeout(() => {
  mcpServer.stdin.write(toolsMessage);
}, 1000);

setTimeout(() => {
  mcpServer.kill();
  
  console.log('📋 MCP Server Response:');
  console.log('stdout:', output || 'No output');
  console.log('stderr:', errorOutput || 'No errors');
  
  // Parse and display tools
  try {
    const lines = output.split('\n').filter(line => line.trim());
    let foundTools = false;
    
    for (const line of lines) {
      if (line.includes('tools')) {
        const parsed = JSON.parse(line);
        if (parsed.result && parsed.result.tools) {
          console.log('\n🛠️  Available Tools:');
          parsed.result.tools.forEach(tool => {
            console.log(`- ${tool.name}: ${tool.description}`);
          });
          foundTools = true;
        }
      }
    }
    
    if (foundTools) {
      console.log('\n✅ SUCCESS: MCP Puppeteer tools are available!');
    } else {
      console.log('\n⚠️  Could not retrieve tools list');
    }
  } catch (e) {
    console.log('\n⚠️  Error parsing response:', e.message);
  }
}, 3000);

mcpServer.on('error', (error) => {
  console.error('❌ Error starting MCP server:', error.message);
});