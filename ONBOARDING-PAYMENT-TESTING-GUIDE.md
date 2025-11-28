# Onboarding & Payment Testing Guide

## ✅ Fixed Issues

1. **Blank Page Error**: Added ErrorBoundary components to catch and display errors gracefully
2. **Better Error Messages**: Improved error handling in all onboarding steps to show user-friendly messages
3. **API Error Handling**: Enhanced error catching for network and API failures

## 🧪 How to Test Enhanced Razorpay Payment Mock

### Method 1: Complete Onboarding Flow (Recommended)

**Steps:**
1. **Login** with demo account:
   - Email: `demo1@eaas.com` or `demo2@eaas.com`
   - Password: `Demo@123`

2. **Navigate to Services & Plans**:
   - Click on **"Services & Plans"** in the navbar (or go to `/services-plans`)
   - You'll see 3 plan cards: Solar Starter, Hybrid Freedom, Grid Independent

3. **Click "Subscribe Now"** on any plan:
   - This will navigate you to the **Onboarding** flow (`/onboarding`)

4. **Step 1 - User Information**:
   - Enter your address (e.g., "123 Main Street, Mumbai, Maharashtra 400001")
   - Enter monthly bill amount (e.g., "5000")
   - Click "Next Step"
   - ⚠️ **If you see an error**: It's okay - the recommendation is optional. You can still proceed.

5. **Step 2 - Plan Selection**:
   - Select any plan (Basic Solar, Solar + Battery, or Premium)
   - Click "Continue to Payment"

6. **Step 3 - Payment**:
   - Review the order summary
   - Click **"Pay ₹XXX"** button
   - **Razorpay Modal Opens!** 🎉

### Method 2: Test via Billing (Faster)

**Steps:**
1. **Login** with `demo1@eaas.com` / `Demo@123`
2. **Go to Billing** (`/billing`)
3. **Click on any pending bill** (one with "Pending" status)
4. **Click "Pay ₹XXX"** button
5. **Razorpay Modal Opens!** 🎉

---

## 🎨 What Users Will See in Razorpay Modal

### Payment Method Options:
1. **UPI Tab**:
   - Popular UPI Apps (GPay, PhonePe, Paytm, BHIM)
   - QR Code option
   - UPI ID input field
   - "Waiting for payment..." animation

2. **Card Tab**:
   - Card number input (auto-formats as you type)
   - Expiry date and CVV fields
   - OTP verification step (simulated)
   - Processing animation

3. **Net Banking Tab**:
   - List of banks to select
   - Bank selection dropdown

4. **Wallets Tab**:
   - Wallet options (Paytm, Freecharge, Mobikwik, etc.)

### Success Experience:
- ✅ Confetti animation
- ✅ Transaction details
- ✅ Payment receipt option
- ✅ Auto-redirect to dashboard

---

## 🐛 Troubleshooting

### Issue: "Blank Page" After Clicking Next

**Solution:**
- Check browser console (F12 → Console tab) for errors
- The ErrorBoundary should now catch errors and show a friendly message
- Try refreshing the page
- If error persists, check:
  - Backend API is running: `https://eaas-production.up.railway.app/health`
  - Network tab shows API calls are successful

### Issue: "Failed to load plans"

**Possible Causes:**
- Backend API is down
- Network connectivity issue
- CORS error (check browser console)

**Solution:**
- Verify backend is running
- Check browser console for detailed error
- Try again after a few seconds

### Issue: Payment Modal Doesn't Open

**Check:**
1. Did subscription creation succeed? (Check browser console)
2. Is `showPaymentModal` state set to `true`?
3. Check for JavaScript errors in console

---

## 📝 For Users: Quick Test Instructions

**To test the Enhanced Razorpay Payment Mock:**

1. **Login** → Use demo account: `demo1@eaas.com` / `Demo@123`

2. **Option A - Full Flow (Recommended):**
   - Click **"Services & Plans"** in the navbar
   - Click **"Subscribe Now"** on any plan
   - **Step 1**: Enter address and monthly bill → Click "Next"
   - **Step 2**: Select a plan → Click "Continue to Payment"
   - **Step 3**: Click **"Pay ₹XXX"** button
   - **Razorpay modal appears!** 🎉

3. **Option B - Quick Test via Billing:**
   - Go to **Billing** page
   - Click on any **pending bill**
   - Click **"Pay"** button
   - **Razorpay modal appears!**

4. **Try Different Payment Methods:**
   - Switch between UPI, Card, Net Banking, Wallets tabs
   - For Card: Use `4242 4242 4242 4242` as test card number
   - Complete payment → See success animation

---

## 🔍 What Was Fixed

1. **ErrorBoundary Component**: Catches React errors and shows friendly error page instead of blank screen
2. **Better Error Messages**: All API errors now show user-friendly messages
3. **Graceful Degradation**: If recommendation fails, user can still proceed
4. **Improved Error Handling**: Network errors, API errors, and validation errors all handled properly

---

## ✅ Testing Checklist

- [ ] Login with demo account
- [ ] Navigate to **Services & Plans** page
- [ ] Click **"Subscribe Now"** on a plan
- [ ] Complete Step 1 (address, monthly bill) - with/without errors
- [ ] Complete Step 2 (select plan)
- [ ] Step 3 - Payment button works
- [ ] Razorpay modal opens
- [ ] Can switch between payment method tabs (UPI, Card, Net Banking, Wallets)
- [ ] UPI payment flow works
- [ ] Card payment flow works (with OTP)
- [ ] Net Banking selection works
- [ ] Wallet selection works
- [ ] Payment success shows confetti
- [ ] Redirects to dashboard after payment

---

## 🚀 Next Steps

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check Network tab for failed API calls
3. Verify backend is running: `https://eaas-production.up.railway.app/health`
4. Report specific error messages for debugging

