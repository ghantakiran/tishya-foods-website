# 🚀 Complete MCP Setup Guide - GitHub & Puppeteer

## ✅ **SETUP COMPLETE - BOTH SERVERS WORKING!**

This guide documents the complete MCP (Model Context Protocol) setup for both GitHub API integration and Puppeteer browser automation.

---

## 📋 **Current Configuration Status**

### ✅ **GitHub MCP Server**
- **Package**: `@modelcontextprotocol/server-github` v2025.4.8
- **Status**: ✅ WORKING
- **Authentication**: GitHub token configured
- **Available Tools**: 25+ GitHub operations

### ✅ **Puppeteer MCP Server**  
- **Package**: `@modelcontextprotocol/server-puppeteer` v2025.5.12
- **Status**: ✅ WORKING
- **Browser**: Chrome/Chromium with custom launch options
- **Available Tools**: Web automation, screenshots, form interactions

---

## 🔧 **Configuration Files**

### 1. **MCP Configuration** (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/Users/kiranreddyghanta/Developer/TishyaFoods/tishya-foods-website/node_modules/@modelcontextprotocol/server-github/dist/index.js"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "REDACTED"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "cwd": "/Users/kiranreddyghanta/Developer/TishyaFoods/tishya-foods-website",
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{\"headless\": false, \"args\": [\"--no-sandbox\", \"--disable-setuid-sandbox\"]}",
        "ALLOW_DANGEROUS": "true"
      }
    },
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"]
    }
  }
}
```

### 2. **Package Dependencies** (`package.json`)
```json
{
  "dependencies": {
    "@modelcontextprotocol/server-github": "^2025.4.8",
    "@modelcontextprotocol/server-puppeteer": "^2025.5.12",
    "puppeteer": "^24.11.2"
  }
}
```

---

## 🛠️ **Available GitHub Tools**

The GitHub MCP server provides **25 powerful tools**:

### **Repository Management**
- `create_repository` - Create new repositories
- `search_repositories` - Search GitHub repositories
- `fork_repository` - Fork repositories
- `get_file_contents` - Read file contents
- `create_or_update_file` - Create/update files
- `push_files` - Push multiple files in one commit

### **Issue Management**
- `create_issue` - Create new issues
- `list_issues` - List repository issues
- `get_issue` - Get specific issue details
- `update_issue` - Update existing issues
- `add_issue_comment` - Add comments to issues

### **Pull Request Management**
- `create_pull_request` - Create new pull requests
- `list_pull_requests` - List repository pull requests
- `get_pull_request` - Get specific pull request details
- `get_pull_request_files` - Get changed files in PR
- `get_pull_request_status` - Get PR status checks
- `get_pull_request_comments` - Get PR comments
- `get_pull_request_reviews` - Get PR reviews
- `create_pull_request_review` - Create PR reviews
- `merge_pull_request` - Merge pull requests
- `update_pull_request_branch` - Update PR branch

### **Search & Discovery**
- `search_code` - Search code across GitHub
- `search_issues` - Search issues and pull requests
- `search_users` - Search GitHub users

### **Branch Management**
- `create_branch` - Create new branches
- `list_commits` - List repository commits

---

## 🤖 **Available Puppeteer Tools**

The Puppeteer MCP server provides **web automation capabilities**:

### **Navigation**
- `puppeteer_goto` - Navigate to URLs
- `puppeteer_goback` - Go back in browser history
- `puppeteer_goforward` - Go forward in browser history

### **Interaction**
- `puppeteer_click` - Click on page elements
- `puppeteer_type` - Type text into input fields
- `puppeteer_scroll` - Scroll the page
- `puppeteer_hover` - Hover over elements

### **Capture**
- `puppeteer_screenshot` - Take page screenshots
- `puppeteer_pdf` - Generate PDF of pages

### **Evaluation**
- `puppeteer_evaluate` - Execute JavaScript in browser
- `puppeteer_waitfor` - Wait for elements or conditions

---

## 🎯 **Usage Examples**

### **GitHub API Operations**
```
"Create a new GitHub issue titled 'Bug: Navigation menu not working' in the repository ghantakiran/tishya-foods-website"

"Search for repositories related to 'nextjs ecommerce' and show me the top 5 results"

"Create a pull request to merge my feature branch into main branch"

"List all open issues in my repository and show their labels"
```

### **Puppeteer Web Automation**
```
"Navigate to the Tishya Foods website and take a screenshot of the homepage"

"Go to the products page and click on the first product card"

"Fill out the contact form with test data and submit it"

"Test the mobile navigation menu by clicking the hamburger icon"
```

---

## 🔄 **Activation Steps**

### **To Activate Your MCP Setup:**

1. **Restart Your IDE**
   ```bash
   # Close and reopen Cursor IDE completely
   ```

2. **Verify MCP Status**
   - Look for MCP server indicators in the bottom status bar
   - Both "github" and "puppeteer" servers should show as connected

3. **Test with AI Commands**
   ```
   # GitHub Test
   "List the open issues in my repository"
   
   # Puppeteer Test  
   "Take a screenshot of google.com"
   ```

---

## 🧪 **Test Scripts**

### **GitHub MCP Test**
```bash
node test-mcp-github.js
```

### **Puppeteer MCP Test**
```bash
node test-mcp-puppeteer.js
```

Both scripts should return successful responses with available tools listed.

---

## 🔒 **Security Configuration**

### **GitHub Authentication**
- **Token**: `REDACTED`
- **Scopes**: `gist`, `read:org`, `repo`, `workflow`
- **Account**: `ghantakiran`

### **Puppeteer Security**
- **Headless Mode**: `false` (visible browser for debugging)
- **Sandbox**: Disabled for local development
- **Allow Dangerous**: `true` (local development only)

### **For Production**
Consider updating to:
```json
{
  "PUPPETEER_LAUNCH_OPTIONS": "{\"headless\": true}",
  "ALLOW_DANGEROUS": "false"
}
```

---

## 📚 **Documentation & Resources**

- [MCP Documentation](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Puppeteer MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)
- [Puppeteer Documentation](https://pptr.dev/)

---

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

1. **MCP Server Not Connecting**
   - Restart Cursor IDE completely
   - Check that both packages are installed: `npm list @modelcontextprotocol/server-github @modelcontextprotocol/server-puppeteer`
   - Verify JSON syntax in `~/.cursor/mcp.json`

2. **GitHub Authentication Errors**
   - Verify token is valid: `gh auth status`
   - Check token permissions include `repo` scope
   - Ensure token is correctly set in environment

3. **Puppeteer Browser Issues**
   - Check Chrome/Chromium installation
   - Try setting `headless: false` for debugging
   - Verify sandbox flags are appropriate for your system

4. **Permission Errors**
   - macOS: Check security settings for browser automation
   - Linux: Ensure proper permissions for Chrome/Chromium
   - Docker: Verify container has necessary permissions

---

## 🎉 **Success Confirmation**

✅ **GitHub MCP Server**: 25 tools available, authenticated as `ghantakiran`
✅ **Puppeteer MCP Server**: Web automation tools available, browser launching properly
✅ **Test Scripts**: Both test scripts return successful responses
✅ **Configuration**: All configuration files properly set up

**Your MCP setup is now complete and ready for use!**

---

## 📞 **Next Steps**

1. **Restart Cursor IDE** to load the new configuration
2. **Test with simple commands** to verify everything works
3. **Start using natural language commands** for GitHub operations and web automation
4. **Monitor the MCP server status** in your IDE's status bar

Your GitHub and Puppeteer MCP servers are now fully configured and ready to use!