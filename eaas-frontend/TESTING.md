# E2E Testing Guide

## Quick Start

### 1. Prerequisites

Ensure the following are running before executing tests:

```bash
# Terminal 1: Start Backend
cd eaas-backend
npm run dev

# Terminal 2: Start Frontend
cd eaas-frontend
npm run dev

# Terminal 3: Ensure database is seeded
cd eaas-backend
npm run seed
```

### 2. Install Playwright Browsers

```bash
cd eaas-frontend
npx playwright install
```

### 3. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI (recommended for first run)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug a specific test
npm run test:e2e:debug
```

### 4. View Results

```bash
# Open HTML report
npm run test:e2e:report
```

## Test Structure

```
tests/e2e/
├── fixtures.js           # Test data and custom fixtures
├── auth.spec.js          # Authentication tests
├── subscription.spec.js   # Subscription workflow tests
├── dashboard.spec.js     # Dashboard functionality tests
├── billing.spec.js       # Billing module tests
├── support.spec.js       # Support system tests
├── notifications.spec.js # Notification tests
├── profile.spec.js       # Profile management tests
├── global-setup.js       # Global test setup
└── global-teardown.js    # Global test cleanup
```

## Test Data

Tests use seeded data:
- **Email**: demo1@eaas.com
- **Password**: Demo@123

## Troubleshooting

### Tests fail with "Backend not running"
- Ensure backend is running on port 5001
- Check: `curl http://localhost:5001/health`

### Tests fail with "Frontend not accessible"
- Ensure frontend is running on port 5173
- Check: Open http://localhost:5173 in browser

### Screenshots not generated
- Check `test-results/` directory
- Screenshots are only captured on failures

### Tests timeout
- Increase timeout in `playwright.config.js`
- Check network connectivity
- Verify database has seeded data

## CI/CD Integration

The test suite is configured for CI/CD:
- Automatic retries on failure
- HTML report generation
- Screenshot capture on failures
- Video recording for failed tests

## Best Practices

1. **Run tests locally first** before committing
2. **Use UI mode** (`npm run test:e2e:ui`) for debugging
3. **Check HTML report** after test runs
4. **Keep test data consistent** with seed script
5. **Update tests** when UI changes

