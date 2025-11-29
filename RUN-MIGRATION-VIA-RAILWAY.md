# Run Migration via Railway CLI

## Step 1: Link to Railway Service

Open your terminal and run:

```bash
cd eaas-backend
railway link
```

When prompted:
1. Select workspace: **EcoGetaway's Projects** (or your workspace)
2. Select project: **outstanding-energy**
3. Select service: **eaas** (NOT natural-presence)

---

## Step 2: Run Migration

```bash
railway run npm run migrate
```

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

## Step 3: Run Seed

```bash
railway run npm run seed
```

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

## Step 4: Verify

### Test API:
```bash
curl https://eaas-production.up.railway.app/api/subscriptions/plans
```

### Test Recommendation:
```bash
curl "https://eaas-production.up.railway.app/api/subscriptions/plans/recommend?monthlyBill=5000"
```

### Check Supabase Dashboard:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"Table Editor"**
4. You should see:
   - ✅ `plan_catalog` (3 rows)
   - ✅ `users` (5 demo users)
   - ✅ All other tables

---

## Troubleshooting

### If `railway link` fails:
- Make sure Railway CLI is installed: `npm i -g @railway/cli`
- Login first: `railway login`

### If migration fails:
- Check that `DATABASE_URL` is set in Railway Variables
- Verify Supabase database is accessible
- Check Railway logs: `railway logs`

### If connection error:
- Verify DATABASE_URL in Railway Variables includes `?sslmode=require`
- Check Supabase project is active

