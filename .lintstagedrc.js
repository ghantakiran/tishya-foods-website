module.exports = {
  // Lint & format TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // Format JSON, CSS, and Markdown files
  '*.{json,css,md}': [
    'prettier --write',
  ],
  
  // Run tests for TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': () => [
    'npm run test -- --bail --findRelatedTests --passWithNoTests',
  ],
  
  // Type check TypeScript files
  '*.{ts,tsx}': () => 'npm run type-check',
  
  // Check for secrets and sensitive information
  '*': [
    'git secrets --scan',
  ],
}