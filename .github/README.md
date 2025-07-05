# 🤖 GitHub Actions Workflows

This directory contains automated workflows for the Tishya Foods website.

## Workflows

### 1. Puppeteer UX Tests (`puppeteer-ux-tests.yml`)

**Trigger:** Push to main, Pull requests, Daily schedule (2 AM UTC), Manual dispatch

**Purpose:** Comprehensive UX testing using Puppeteer to ensure optimal user experience

**Test Suites:**
- 🏠 Homepage UX Analysis
- ♿ Accessibility WCAG Compliance
- ⚡ Performance Core Web Vitals
- 📱 Mobile Navigation Testing
- 🔍 Product Discovery Flow
- ✨ Micro-interactions Testing
- 📌 Sticky Header Testing
- 🔍 SEO Optimization Audit

**Artifacts:**
- Screenshots for each test suite (30 days retention)
- JSON and Markdown reports (30 days retention)
- Consolidated HTML report with summary

**Features:**
- Matrix strategy for parallel test execution
- Automatic PR comments with test results
- Daily scheduled runs with notifications
- Critical issue detection and failure reporting

### 2. PR Quality Checks (`pr-quality-checks.yml`)

**Trigger:** Pull requests to main branch

**Purpose:** Ensure code quality and basic functionality before merging

**Checks:**
- ESLint code quality
- TypeScript type checking
- Test suite execution
- Build verification
- Quick accessibility check

**Artifacts:**
- Accessibility reports (7 days retention)

## Usage

### Manual Trigger

You can manually trigger the Puppeteer UX tests:

1. Go to the Actions tab in GitHub
2. Select "🤖 Automated Puppeteer UX Testing Suite"
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

### Viewing Results

Test results are available in several formats:

1. **GitHub Actions Summary**: Basic pass/fail status
2. **Artifacts**: Downloadable screenshots and reports
3. **PR Comments**: Automated summary for pull requests
4. **Consolidated Report**: HTML dashboard with all results

## Configuration

### Environment Variables

The workflows use the following environment variables:

- `NODE_ENV`: Set to `production` for builds, `test` for testing
- `HEADLESS`: Set to `true` for headless browser execution

### Customization

To customize the workflows:

1. **Add new test suites**: Update the matrix strategy in `puppeteer-ux-tests.yml`
2. **Change schedule**: Modify the cron expression in the schedule trigger
3. **Add notifications**: Uncomment and configure the notification section
4. **Extend quality checks**: Add more checks to `pr-quality-checks.yml`

## Notifications

The workflows support various notification methods:

- **PR Comments**: Automatically enabled for pull requests
- **Slack**: Uncomment and configure webhook URL
- **Email**: Add custom notification logic
- **GitHub Issues**: Can be configured to create issues on failures

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase the `wait-on` timeout value
2. **Screenshots not capturing**: Check viewport and element selectors
3. **Build failures**: Ensure all dependencies are properly installed
4. **Accessibility violations**: Review the accessibility report for specific issues

### Debugging

To debug test failures:

1. Check the Actions logs for detailed error messages
2. Download screenshot artifacts to see visual state
3. Review JSON reports for specific test failures
4. Run tests locally using the same commands

## Best Practices

1. **Always review test results** before merging PRs
2. **Update test expectations** when making UI changes
3. **Monitor daily test runs** for regressions
4. **Keep artifacts** for historical analysis
5. **Address critical issues** immediately

## Contributing

When adding new tests:

1. Follow the existing naming convention
2. Generate both screenshots and JSON reports
3. Add appropriate error handling
4. Update the workflow matrix if needed
5. Test locally before pushing

---

For more information about the individual test suites, see the `tests/puppeteer/` directory.