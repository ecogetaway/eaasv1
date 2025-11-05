# E2E Test Suite for EaaS Platform

This directory contains comprehensive end-to-end tests for the Energy-as-a-Service platform using Playwright.

## Test Coverage

### 1. Authentication Flow (`auth.spec.js`)
- User registration with valid data
- User registration with invalid data (duplicate email)
- User login with correct credentials
- User login with incorrect credentials
- Logout functionality
- Session persistence

### 2. Subscription Workflow (`subscription.spec.js`)
- View available plans
- Select a plan
- Complete 3-step onboarding
- Mock Razorpay payment
- Verify subscription created

### 3. Dashboard Functionality (`dashboard.spec.js`)
- Dashboard loads with data
- Real-time metrics update
- Charts render correctly
- WebSocket connection established
- Energy data displays

### 4. Billing Module (`billing.spec.js`)
- View bills list
- Filter bills by status
- View bill details
- Download invoice (check file download)
- Make payment

### 5. Support System (`support.spec.js`)
- Create new ticket
- View ticket list
- View ticket details
- Add comment to ticket

### 6. Notifications (`notifications.spec.js`)
- Notification center opens
- Notifications display
- Mark as read
- Badge count updates

### 7. Profile Management (`profile.spec.js`)
- Update personal information
- Change password
- Update notification preferences
- View subscription details

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests:
```bash
npm run test:e2e
```

### Run tests in UI mode:
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

### Debug tests:
```bash
npm run test:e2e:debug
```

### View HTML report:
```bash
npm run test:e2e:report
```

## Test Configuration

- **Base URL**: http://localhost:5173
- **API URL**: http://localhost:5001
- **Test User**: demo1@eaas.com / Demo@123

## Prerequisites

Before running tests, ensure:

1. Backend server is running on port 5001:
```bash
cd ../eaas-backend
npm run dev
```

2. Frontend server is running on port 5173:
```bash
npm run dev
```

3. Database is seeded with test data:
```bash
cd ../eaas-backend
npm run seed
```

## Test Data

Tests use the following test accounts from the seed script:
- **Email**: demo1@eaas.com
- **Password**: Demo@123

## Screenshots and Videos

- Screenshots are automatically captured on test failures
- Videos are retained for failed tests
- Both are saved in `test-results/` directory

## HTML Report

After running tests, an HTML report is generated in `playwright-report/` directory. Open `index.html` in a browser to view detailed test results.

## CI/CD Integration

The test suite is configured to:
- Retry failed tests 2 times in CI
- Run in parallel when not in CI
- Generate HTML reports for test results
- Take screenshots on failures

