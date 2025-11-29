# Database Setup for Railway Backend

## Overview
The backend needs two scripts to be run:
1. **Migration** (`migrate.js`) - Creates all database tables
2. **Seed** (`seed.js`) - Populates database with demo data (plans, users, etc.)

## Option 1: Run via Railway CLI (Recommended)

### Prerequisites
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link to your project: `railway link`

### Steps

1. **Run Migration** (Creates all tables):
```bash
cd eaas-backend
railway run npm run migrate
```

2. **Run Seed** (Populates with demo data):
```bash
railway run npm run seed
```

---

## Option 2: Run via Railway Dashboard

### Steps

1. **Go to Railway Dashboard**
   - Navigate to your `eaas` service
   - Click on **"Deployments"** tab
   - Click on the latest deployment
   - Click **"View logs"** or use the **"Shell"** option

2. **Run Migration**:
   - In the shell/console, run:
   ```bash
   npm run migrate
   ```

3. **Run Seed**:
   ```bash
   npm run seed
   ```

---

## Option 3: Run Locally (If you have DATABASE_URL)

### Steps

1. **Set DATABASE_URL**:
   ```bash
   export DATABASE_URL="postgresql://user:password@host:port/database"
   ```
   Or get it from Railway Dashboard → Service → Variables → `DATABASE_URL`

2. **Run Migration**:
   ```bash
   cd eaas-backend
   npm run migrate
   ```

3. **Run Seed**:
   ```bash
   npm run seed
   ```

---

## What Gets Created

### Migration (`migrate.js`) Creates:
- ✅ `users` table
- ✅ `subscriptions` table
- ✅ `smart_meters` table
- ✅ `energy_data` table
- ✅ `bills` table
- ✅ `payments` table
- ✅ `payment_methods` table
- ✅ `support_tickets` table
- ✅ `ticket_updates` table
- ✅ `notifications` table
- ✅ `alerts` table
- ✅ **`plan_catalog` table** ← This fixes the error!
- ✅ `discom_integration` table
- ✅ `system_events` table

### Seed (`seed.js`) Creates:
- ✅ 3 Plans (Basic Solar, Solar + Battery, Premium)
- ✅ 5 Demo Users (demo1@eaas.com through demo5@eaas.com)
- ✅ Subscriptions for each user
- ✅ Smart meters
- ✅ 30 days of energy data (hourly readings)
- ✅ Bills (2 per user - 1 paid, 1 pending)
- ✅ Support tickets
- ✅ Notifications

---

## Demo Credentials (After Seeding)

All users have password: `Demo@123`

- `demo1@eaas.com`
- `demo2@eaas.com`
- `demo3@eaas.com`
- `demo4@eaas.com`
- `demo5@eaas.com`

---

## Verification

After running both scripts, verify:

1. **Check if tables exist**:
   ```bash
   # Via Railway CLI
   railway run psql $DATABASE_URL -c "\dt"
   ```

2. **Check if plans exist**:
   ```bash
   curl https://eaas-production.up.railway.app/api/subscriptions/plans
   ```

3. **Test recommendation endpoint**:
   ```bash
   curl "https://eaas-production.up.railway.app/api/subscriptions/plans/recommend?monthlyBill=5000"
   ```

---

## Troubleshooting

### Error: "relation does not exist"
- **Solution**: Run `npm run migrate` first

### Error: "connection refused" or "database not found"
- **Solution**: Check `DATABASE_URL` in Railway Variables
- Make sure PostgreSQL service is running in Railway

### Error: "permission denied"
- **Solution**: Check database user has CREATE TABLE permissions
- Railway's default database user should have all permissions

### Migration/Seed Already Run?
- Both scripts are **idempotent** (safe to run multiple times)
- They use `CREATE TABLE IF NOT EXISTS` and check for existing data
- Running again won't create duplicates

---

## Quick Command Reference

```bash
# Via Railway CLI
cd eaas-backend
railway run npm run migrate    # Create tables
railway run npm run seed       # Populate data

# Or locally (if DATABASE_URL is set)
cd eaas-backend
npm run migrate
npm run seed
```

