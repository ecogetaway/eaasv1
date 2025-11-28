# Quick Setup: Supabase Database on Railway

## Your Supabase Connection String
```
postgresql://postgres:Mggd.2025$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres
```

## Step 1: Add DATABASE_URL to Railway

### Via Railway Dashboard:
1. Go to: https://railway.app
2. Navigate to your `eaas` service
3. Click **"Variables"** tab
4. Click **"+ New Variable"**
5. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:Mggd.2025$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require`
   - ⚠️ **Important**: Add `?sslmode=require` at the end for SSL
6. Click **"Save"**
7. Railway will automatically redeploy

### Via Railway CLI:
```bash
railway variables set DATABASE_URL="postgresql://postgres:Mggd.2025$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require"
```

---

## Step 2: Wait for Railway to Redeploy

- Check Railway Dashboard → Deployments
- Wait for deployment to complete (2-3 minutes)
- Verify status is "Active"

---

## Step 3: Run Migration (Create Tables)

### Option A: Via Railway CLI (Recommended)
```bash
cd eaas-backend
railway run npm run migrate
```

### Option B: Via Railway Dashboard
1. Go to Railway → Your service → Deployments
2. Click latest deployment → "View logs" or use "Shell"
3. Run: `npm run migrate`

**Expected Output:**
```
🔄 Starting database migration...
📦 Enabling UUID extension...
✅ UUID extension enabled
📋 Creating users table...
✅ users table created
...
✅ plan_catalog table created
🎉 All tables created successfully!
```

---

## Step 4: Run Seed (Populate Demo Data)

### Via Railway CLI:
```bash
railway run npm run seed
```

### Via Railway Dashboard:
- Same as above, run: `npm run seed`

**Expected Output:**
```
🔄 Starting database seeding...
📋 Step 1: Creating plans...
  ✅ Created plan: Basic Solar
  ✅ Created plan: Solar + Battery
  ✅ Created plan: Premium
👥 Step 2: Creating demo users...
  ✅ Created user: demo1@eaas.com
...
🎉 Database seeded successfully!
```

---

## Step 5: Verify

### Check API Endpoints:
```bash
# Test plans endpoint
curl https://eaas-production.up.railway.app/api/subscriptions/plans

# Test recommendation endpoint
curl "https://eaas-production.up.railway.app/api/subscriptions/plans/recommend?monthlyBill=5000"
```

### Check in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"Table Editor"**
4. You should see:
   - ✅ `plan_catalog` (3 rows)
   - ✅ `users` (5 demo users)
   - ✅ `subscriptions`, `bills`, etc.

---

## Demo Credentials (After Seeding)

All users have password: `Demo@123`

- `demo1@eaas.com`
- `demo2@eaas.com`
- `demo3@eaas.com`
- `demo4@eaas.com`
- `demo5@eaas.com`

---

## Troubleshooting

### If migration fails with SSL error:
- Make sure connection string has `?sslmode=require` at the end

### If "relation does not exist" error:
- Run `npm run migrate` first

### If connection refused:
- Verify DATABASE_URL is set correctly in Railway Variables
- Check Supabase project is active

