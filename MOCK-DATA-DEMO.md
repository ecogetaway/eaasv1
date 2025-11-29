# Mock Data System for Hackathon Demo

## Overview

The frontend is now configured to use **mock data as the primary source** for the hackathon demo. This ensures all features work perfectly even without backend connectivity, making it ideal for judges who will only see the frontend.

## Demo Credentials

Use these credentials to log in:

- **User 1:** `demo@eaas.com` / `demo123`
- **User 2:** `demo2@eaas.com` / `demo123`

## Features Working with Mock Data

All features are fully functional with mock data:

### ✅ Authentication
- Login/Register
- Profile management
- Password changes (simulated)

### ✅ Subscription Management
- View all plans (3 plans available)
- Plan recommendations based on monthly bill
- Create subscriptions
- View user subscriptions

### ✅ Energy Monitoring
- Real-time energy metrics (updates every 5 seconds)
- Energy history (day/week/month views)
- Dashboard summary (today/month stats)
- Live charts and visualizations

### ✅ Billing & Payments
- View all bills
- Current month bill
- Enhanced Razorpay payment mock (UPI, Cards, Net Banking, Wallets)
- Invoice download (text file in demo mode)

### ✅ Smart Meters
- View registered meters
- Meter sync functionality
- Meter registration

### ✅ Support Tickets
- Create tickets
- View all tickets
- Ticket replies
- Status updates

### ✅ Notifications
- View notifications
- Mark as read
- Unread count

### ✅ Alerts
- View alerts
- Acknowledge alerts
- Resolve alerts

### ✅ DISCOM Integration
- Net-metering applications
- Application status tracking
- Grid sync status
- Timeline visualization

## Mock Data Location

All mock data is defined in: `eaas-frontend/src/data/mockData.js`

## Switching to Real Backend

To switch from mock data to real backend, update the `USE_MOCK_DATA` constant in each service file:

```javascript
const USE_MOCK_DATA = false; // Change to false to use real backend
```

Services with this flag:
- `subscriptionService.js`
- `billingService.js`
- `energyService.js`
- `meterService.js`
- `supportService.js`
- `notificationService.js`
- `alertService.js`
- `discomService.js`
- `authService.js`
- `socketService.js`

## Mock Data Includes

### Plans
- Basic Solar (₹799/month)
- Solar + Battery (₹1,299/month)
- Premium (₹1,999/month)

### Bills
- 2 sample bills (one paid, one pending)
- Realistic energy consumption data
- Savings calculations
- Carbon offset metrics

### Energy Data
- Current energy readings with real-time variations
- Historical data for 1 day, 7 days, or 30 days
- Dashboard summaries

### Other Data
- Sample meters
- Support tickets
- Notifications
- Alerts
- DISCOM status

## Real-Time Updates

The socket service simulates real-time energy updates:
- Updates every 5 seconds
- Slight random variations to make data feel live
- All energy metrics update automatically

## Payment Simulation

The enhanced Razorpay mock includes:
- UPI payment flow
- Card payment with OTP
- Net Banking
- Wallet payments
- Processing animations
- Success/error states

## Notes for Demo

1. **All features work independently** - No backend required
2. **Realistic delays** - API calls have simulated delays (200-800ms) for realism
3. **Persistent state** - Some data persists in localStorage (user, token)
4. **Visual polish** - All UI components work smoothly with mock data
5. **Error handling** - Graceful fallbacks if any service fails

## Testing Checklist

- [x] Login with demo credentials
- [x] View dashboard with real-time updates
- [x] Browse subscription plans
- [x] Complete onboarding flow
- [x] View bills and make payments
- [x] Check energy history charts
- [x] Create support tickets
- [x] View notifications
- [x] Check DISCOM status
- [x] Download invoice

## For Judges

The demo is fully self-contained. All features work without any backend setup. Simply:
1. Open the frontend URL
2. Login with demo credentials
3. Explore all features
4. Everything works with realistic mock data!

