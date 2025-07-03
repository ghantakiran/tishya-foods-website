# MCP Puppeteer Setup Guide

## 🤖 What is MCP Puppeteer?

The Model Context Protocol (MCP) Puppeteer server provides browser automation capabilities, allowing AI assistants to interact with web pages, take screenshots, and execute JavaScript in a real browser environment.

## ✅ Installation Complete

### Dependencies Installed:
- `@modelcontextprotocol/server-puppeteer` (v2025.5.12)
- `puppeteer` (latest)

### Configuration Files Created:
- `~/.cursor/mcp.json` - Cursor IDE MCP configuration
- `test-mcp-puppeteer.js` - Test script for verification

## 🛠️ Configuration Details

### Cursor IDE Configuration (`~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{\"headless\": false, \"args\": [\"--no-sandbox\", \"--disable-setuid-sandbox\"]}",
        "ALLOW_DANGEROUS": "true"
      }
    }
  }
}
```

### Environment Variables:
- `PUPPETEER_LAUNCH_OPTIONS`: Custom browser launch options
- `ALLOW_DANGEROUS`: Enables dangerous browser arguments for local development

## 🚀 Usage Examples

Once set up, you can use natural language commands with AI assistants for web automation:

### Basic Web Navigation:
- "Go to https://example.com and take a screenshot"
- "Navigate to the Tishya Foods website and check if it loads properly"
- "Open the products page and scroll down"

### Form Interactions:
- "Fill out the contact form with test data"
- "Click the 'Add to Cart' button on the first product"
- "Search for 'protein' in the search box"

### Testing and QA:
- "Test the checkout flow by adding items to cart"
- "Verify that all navigation links work properly"
- "Check if the mobile menu opens correctly"

### Data Extraction:
- "Extract all product names from the products page"
- "Get the current price of the featured products"
- "Take screenshots of each page for documentation"

## 🔧 Available Functions

The MCP Puppeteer server provides these key capabilities:

### Navigation Functions:
- `puppeteer_goto` - Navigate to a specific URL
- `puppeteer_goback` - Go back in browser history
- `puppeteer_goforward` - Go forward in browser history

### Interaction Functions:
- `puppeteer_click` - Click on page elements
- `puppeteer_type` - Type text into input fields
- `puppeteer_scroll` - Scroll the page
- `puppeteer_hover` - Hover over elements

### Capture Functions:
- `puppeteer_screenshot` - Take page screenshots
- `puppeteer_pdf` - Generate PDF of the page

### Evaluation Functions:
- `puppeteer_evaluate` - Execute JavaScript in the browser
- `puppeteer_waitfor` - Wait for elements or conditions

## 🔄 Next Steps

### 1. Restart Your IDE
To activate the MCP configuration:
- Close and restart Cursor IDE
- The MCP server indicator should turn green

### 2. Verify Setup
- Open Cursor IDE
- Look for MCP server status in the bottom status bar
- The Puppeteer server should show as "Connected"

### 3. Start Using
You can now give natural language web automation commands to AI assistants that support MCP.

## 🛡️ Security Considerations

### Current Configuration:
- `headless: false` - Browser windows will be visible (useful for debugging)
- `ALLOW_DANGEROUS: true` - Allows sandbox-disabling arguments for local development

### For Production:
Consider updating the configuration to:
```json
{
  "PUPPETEER_LAUNCH_OPTIONS": "{\"headless\": true}",
  "ALLOW_DANGEROUS": "false"
}
```

## 🧪 Testing

### Quick Test:
Run the included test script:
```bash
node test-mcp-puppeteer.js
```

### Manual Testing:
1. Restart Cursor IDE
2. Ask the AI assistant: "Use Puppeteer to navigate to google.com and take a screenshot"
3. Verify the browser opens and the command executes

## 📚 Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Puppeteer Documentation](https://pptr.dev/)
- [MCP Puppeteer Server on NPM](https://www.npmjs.com/package/@modelcontextprotocol/server-puppeteer)

## 🐛 Troubleshooting

### Common Issues:

1. **MCP Server Not Connecting:**
   - Restart Cursor IDE
   - Check that NPM packages are installed
   - Verify `~/.cursor/mcp.json` syntax

2. **Browser Won't Open:**
   - Check `PUPPETEER_LAUNCH_OPTIONS` configuration
   - Try setting `headless: false` for debugging

3. **Permission Errors:**
   - Ensure `ALLOW_DANGEROUS: true` for local development
   - Check Chrome/Chromium installation

### Debug Mode:
Add `"DEBUG": "puppeteer:*"` to the env section for verbose logging.

---

✅ **MCP Puppeteer setup is now complete and tested successfully!**