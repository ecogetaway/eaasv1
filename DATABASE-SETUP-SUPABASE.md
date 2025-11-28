# Database Setup for Supabase

## Overview
Since you're using Supabase, the migration scripts will work the same way. You just need to:
1. Get your Supabase connection string
2. Run the migration script
3. Run the seed script

## Step 1: Get Supabase Connection String

### From Supabase Dashboard:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection string** section
5. Copy the **URI** connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Or use Connection Pooling (Recommended for production):
- Use the **Connection Pooler** connection string
- It's in the same section, under "Connection Pooling"
- Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

---

## Step 2: Set DATABASE_URL

### Option A: Set in Railway Environment Variables

1. Go to Railway Dashboard → Your `eaas` service
2. Click **"Variables"** tab
3. Add/Update `DATABASE_URL`:
   - Key: `DATABASE_URL`
   - Value: Your Supabase connection string
4. Click **"Save"**
5. Railway will automatically redeploy

### Option B: Run Locally

```bash
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

---

## Step 3: Run Migration Script

### Via Railway CLI (Recommended):

```bash
cd eaas-backend
railway run npm run migrate
```

### Via Railway Dashboard:
1. Go to Railway → Your service → Deployments
2. Click latest deployment → "View logs" or use "Shell"
3. Run: `npm run migrate`

### Locally (if DATABASE_URL is set):
```bash
cd eaas-backend
npm run migrate
```

**Expected Output:**
```
🔄 Starting database migration...
📦 Enabling UUID extension...
✅ UUID extension enabled
📋 Creating users table...
✅ users table created
...
🎉 All tables created successfully!
```

---

## Step 4: Run Seed Script

### Via Railway CLI:
```bash
railway run npm run seed
```

### Via Railway Dashboard:
- Same as above, but run: `npm run seed`

### Locally:
```bash
npm run seed
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

## Step 5: Verify in Supabase Dashboard

1. Go to Supabase Dashboard → Your project
2. Click **"Table Editor"** in the left sidebar
3. You should see all tables:
   - ✅ `users`
   - ✅ `subscriptions`
   - ✅ `smart_meters`
   - ✅ `energy_data`
   - ✅ `bills`
   - ✅ `payments`
   - ✅ `plan_catalog` ← **This fixes the error!**
   - ✅ `support_tickets`
   - ✅ `notifications`
   - ✅ And more...

4. Check `plan_catalog` table:
   - Should have 3 rows (Basic Solar, Solar + Battery, Premium)

5. Check `users` table:
   - Should have 5 demo users

---

## Quick Command Reference

```bash
# Set DATABASE_URL (if running locally)
export DATABASE_URL="your-supabase-connection-string"

# Run migrations
cd eaas-backend
npm run migrate

# Seed database
npm run seed

# Or via Railway CLI
railway run npm run migrate
railway run npm run seed
```

---

## Troubleshooting

### Error: "relation does not exist"
- **Solution**: Run `npm run migrate` first

### Error: "connection refused" or "SSL required"
- **Solution**: Make sure your connection string includes SSL parameters
- Supabase requires SSL: Add `?sslmode=require` to connection string

### Error: "password authentication failed"
- **Solution**: Check your Supabase password
- Reset password in Supabase Dashboard → Settings → Database → Reset database password

### Error: "permission denied"
- **Solution**: Make sure you're using the `postgres` user connection string
- Check Supabase project settings

### Migration Already Run?
- Both scripts are **idempotent** (safe to run multiple times)
- They use `CREATE TABLE IF NOT EXISTS`
- Won't create duplicates

---

## Supabase Connection String Format

### Direct Connection:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

### Connection Pooler (Recommended):
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

Replace:
- `[PASSWORD]` - Your Supabase database password
- `[PROJECT-REF]` - Your Supabase project reference ID
- `[REGION]` - Your Supabase region (e.g., `us-east-1`)

---

## After Setup

✅ All tables created in Supabase
✅ Demo data populated
✅ Plans available via API
✅ Recommendation endpoint works
✅ Onboarding flow works without errors

**Test:**
```bash
curl https://eaas-production.up.railway.app/api/subscriptions/plans
```

---

## Demo Credentials (After Seeding)

All users have password: `Demo@123`

- `demo1@eaas.com`
- `demo2@eaas.com`
- `demo3@eaas.com`
- `demo4@eaas.com`
- `demo5@eaas.com`

