# How to Run Migration on Railway

## Method 1: Railway CLI (Easiest - Recommended)

### Step 1: Navigate to Backend Directory
```bash
cd eaas-backend
```

### Step 2: Link to Railway Project (if not already linked)
```bash
railway link
```
- Select your project: `outstanding-energy`
- Select your service: `eaas` (NOT natural-presence)

### Step 3: Run Migration
```bash
railway run npm run migrate
```

### Step 4: Run Seed
```bash
railway run npm run seed
```

---

## Method 2: Via Railway Dashboard (Alternative)

If Railway CLI doesn't work, you can:

1. **Go to Railway Dashboard**
   - Navigate to: https://railway.app
   - Select project: `outstanding-energy`
   - Click on **"eaas"** service (NOT natural-presence)

2. **Check Variables**
   - Go to **"Variables"** tab
   - Make sure `DATABASE_URL` is set with your Supabase connection string
   - Should be: `postgresql://postgres:Mggd.2025$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require`

3. **Trigger Redeploy**
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** on the latest deployment
   - This will redeploy with the DATABASE_URL variable

4. **Run Migration via One-Time Script**
   - We can create a script that runs on deploy
   - Or use Railway's "Run Command" feature if available

---

## Method 3: Create Migration Script (Runs on Deploy)

If you want migrations to run automatically, we can modify the start script to check and run migrations.

---

## Quick Commands (Copy & Paste)

```bash
# Navigate to backend
cd eaas-backend

# Link to Railway (if needed)
railway link

# Run migration
railway run npm run migrate

# Run seed
railway run npm run seed
```

---

## Important Notes

1. **Make sure you're on the `eaas` service**, not `natural-presence`
2. **DATABASE_URL must be set** in Railway Variables before running migration
3. **Migration creates tables** - safe to run multiple times
4. **Seed populates data** - also safe to run multiple times (won't create duplicates)

---

## Verify After Running

1. **Check Supabase Dashboard**:
   - Go to Table Editor
   - Should see `plan_catalog` table with 3 rows

2. **Test API**:
   ```bash
   curl https://eaas-production.up.railway.app/api/subscriptions/plans
   ```

3. **Test Recommendation**:
   ```bash
   curl "https://eaas-production.up.railway.app/api/subscriptions/plans/recommend?monthlyBill=5000"
   ```

