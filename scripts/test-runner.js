#!/usr/bin/env node

const { spawn, execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
}

// Utility functions
const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

const logSection = (title) => {
  log(`\n${'='.repeat(50)}`, 'cyan')
  log(`${title}`, 'cyan')
  log(`${'='.repeat(50)}`, 'cyan')
}

const runCommand = (command, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

const checkDependencies = () => {
  logSection('Checking Dependencies')
  
  const dependencies = [
    'jest',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@playwright/test'
  ]

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

  const missing = dependencies.filter(dep => !allDeps[dep])
  
  if (missing.length > 0) {
    log(`Missing dependencies: ${missing.join(', ')}`, 'red')
    log('Please install missing dependencies before running tests', 'yellow')
    process.exit(1)
  }

  log('All dependencies are installed ✓', 'green')
}

const runUnitTests = async () => {
  logSection('Running Unit Tests')
  
  try {
    await runCommand('npm', ['run', 'test:unit'])
    log('Unit tests passed ✓', 'green')
  } catch (error) {
    log('Unit tests failed ✗', 'red')
    throw error
  }
}

const runIntegrationTests = async () => {
  logSection('Running Integration Tests')
  
  try {
    await runCommand('npm', ['run', 'test:integration'])
    log('Integration tests passed ✓', 'green')
  } catch (error) {
    log('Integration tests failed ✗', 'red')
    throw error
  }
}

const runE2ETests = async () => {
  logSection('Running End-to-End Tests')
  
  try {
    // Install Playwright browsers if needed
    await runCommand('npx', ['playwright', 'install'])
    
    // Run E2E tests
    await runCommand('npm', ['run', 'test:e2e'])
    log('E2E tests passed ✓', 'green')
  } catch (error) {
    log('E2E tests failed ✗', 'red')
    throw error
  }
}

const generateCoverageReport = async () => {
  logSection('Generating Coverage Report')
  
  try {
    await runCommand('npm', ['run', 'test:coverage'])
    log('Coverage report generated ✓', 'green')
    log('Coverage report available at: coverage/lcov-report/index.html', 'cyan')
  } catch (error) {
    log('Coverage report generation failed ✗', 'red')
    throw error
  }
}

const lintCode = async () => {
  logSection('Running Code Linting')
  
  try {
    await runCommand('npm', ['run', 'lint'])
    log('Linting passed ✓', 'green')
  } catch (error) {
    log('Linting failed ✗', 'red')
    throw error
  }
}

const typeCheck = async () => {
  logSection('Running Type Check')
  
  try {
    await runCommand('npm', ['run', 'type-check'])
    log('Type check passed ✓', 'green')
  } catch (error) {
    log('Type check failed ✗', 'red')
    throw error
  }
}

const buildProject = async () => {
  logSection('Building Project')
  
  try {
    await runCommand('npm', ['run', 'build'])
    log('Build successful ✓', 'green')
  } catch (error) {
    log('Build failed ✗', 'red')
    throw error
  }
}

// Main test runner function
const runAllTests = async () => {
  const startTime = Date.now()
  
  log('🚀 Starting Tishya Foods Test Suite', 'magenta')
  log(`Started at: ${new Date().toLocaleString()}`, 'cyan')
  
  try {
    // Pre-flight checks
    checkDependencies()
    
    // Code quality checks
    await lintCode()
    await typeCheck()
    
    // Test execution
    await runUnitTests()
    await runIntegrationTests()
    
    // Build verification
    await buildProject()
    
    // E2E tests (optional, can be skipped in CI)
    if (!process.env.SKIP_E2E) {
      await runE2ETests()
    }
    
    // Coverage report
    if (!process.env.SKIP_COVERAGE) {
      await generateCoverageReport()
    }
    
    // Success summary
    const duration = Math.round((Date.now() - startTime) / 1000)
    logSection('Test Suite Complete')
    log('🎉 All tests passed successfully!', 'green')
    log(`Total duration: ${duration}s`, 'cyan')
    
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000)
    logSection('Test Suite Failed')
    log('❌ Test suite failed!', 'red')
    log(`Total duration: ${duration}s`, 'cyan')
    log(`Error: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)

const showHelp = () => {
  log('Tishya Foods Test Runner', 'cyan')
  log('Usage: node scripts/test-runner.js [command]', 'white')
  log('\nCommands:', 'yellow')
  log('  all          Run all tests (default)', 'white')
  log('  unit         Run unit tests only', 'white')
  log('  integration  Run integration tests only', 'white')
  log('  e2e          Run end-to-end tests only', 'white')
  log('  coverage     Generate coverage report', 'white')
  log('  lint         Run linting', 'white')
  log('  type-check   Run type checking', 'white')
  log('  build        Build project', 'white')
  log('  help         Show this help message', 'white')
  log('\nEnvironment Variables:', 'yellow')
  log('  SKIP_E2E=true      Skip end-to-end tests', 'white')
  log('  SKIP_COVERAGE=true Skip coverage report', 'white')
}

// Handle different commands
const command = args[0] || 'all'

switch (command) {
  case 'unit':
    runUnitTests().catch(() => process.exit(1))
    break
  case 'integration':
    runIntegrationTests().catch(() => process.exit(1))
    break
  case 'e2e':
    runE2ETests().catch(() => process.exit(1))
    break
  case 'coverage':
    generateCoverageReport().catch(() => process.exit(1))
    break
  case 'lint':
    lintCode().catch(() => process.exit(1))
    break
  case 'type-check':
    typeCheck().catch(() => process.exit(1))
    break
  case 'build':
    buildProject().catch(() => process.exit(1))
    break
  case 'help':
    showHelp()
    break
  case 'all':
  default:
    runAllTests()
    break
}