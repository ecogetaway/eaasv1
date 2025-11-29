# Fix: Railway Connected to Wrong Database

## Problem Identified

The test shows:
- `current_database: "railway"` ← Railway is using its own database
- `tables: []` ← No tables found
- `planCatalogExists: false` ← Tables don't exist here

**But you created tables in Supabase**, which is a different database!

## Solution Options

### Option 1: Use Supabase Database (Recommended)

Railway's `DATABASE_URL` should point to Supabase, not Railway's database.

**Steps:**

1. **Check Railway Services:**
   - Railway Dashboard → `outstanding-energy` project
   - Look for a **PostgreSQL service** (might be called "Postgres" or "Database")
   - This is Railway's own database - we want to use Supabase instead

2. **Verify DATABASE_URL Points to Supabase:**
   - Railway Dashboard → `eaas` service → Variables
   - Check `DATABASE_URL` value
   - Should be: `postgresql://postgres:...@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres`
   - If it's pointing to Railway's database, that's the problem!

3. **If DATABASE_URL is Wrong:**
   - Update `DATABASE_URL` in Railway Variables
   - Use your Supabase connection string:
     ```
     postgresql://postgres:Mggd.2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require
     ```
   - Save and redeploy

4. **If Railway Auto-Generated DATABASE_URL:**
   - Railway might have auto-created a PostgreSQL service
   - Check if there's a "Postgres" or "Database" service in your project
   - You can either:
     - **Option A:** Delete Railway's database service (if not needed)
     - **Option B:** Keep it but make sure `eaas` service uses Supabase's DATABASE_URL

### Option 2: Create Tables in Railway's Database

If you want to use Railway's database instead:

1. **Get Railway Database Connection String:**
   - Railway Dashboard → PostgreSQL service (if exists)
   - Go to Variables tab
   - Copy the connection string (usually `${{Postgres.DATABASE_URL}}`)

2. **Run Migration in Railway Database:**
   - Use Railway CLI:
     ```bash
     cd eaas-backend
     railway run npm run migrate
     railway run npm run seed
     ```
   - Or use Supabase SQL Editor but connect to Railway's database

---

## Quick Fix: Update DATABASE_URL

**Most Likely Issue:** Railway auto-created a PostgreSQL service and `eaas` is using that instead of Supabase.

**Fix:**

1. **Railway Dashboard** → `eaas` service → **Variables** tab
2. **Find `DATABASE_URL`**
3. **Check the value:**
   - If it says `${{Postgres.DATABASE_URL}}` → This is Railway's database (wrong!)
   - If it says `postgresql://...@db.znrjfbovxodgwwtlbx.supabase.co` → Should be correct

4. **If it's using Railway's database:**
   - Click Edit on `DATABASE_URL`
   - Replace with Supabase connection string:
     ```
     postgresql://postgres:Mggd.2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require
     ```
   - Click Save
   - Railway will auto-redeploy

5. **Wait for redeploy** (2-3 minutes)

6. **Test again:**
   ```bash
   curl https://eaas-production.up.railway.app/api/test/db
   ```
   - Should now show `current_database: "postgres"` (Supabase)
   - Should show `planCatalogExists: true`

---

## Verify Which Database You're Using

**Check Railway Variables:**
- `DATABASE_URL` should explicitly show Supabase hostname
- Should NOT reference `${{Postgres.DATABASE_URL}}` or Railway's database

**Check Railway Services:**
- If you see a "Postgres" service, that's Railway's database
- Your `eaas` service should use Supabase, not Railway's Postgres

---

## After Fixing

Once `DATABASE_URL` points to Supabase:

1. **Test connection:**
   ```bash
   curl https://eaas-production.up.railway.app/api/test/db
   ```
   - Should show `current_database: "postgres"`
   - Should show `planCatalogExists: true`
   - Should list all your tables

2. **Test plans:**
   ```bash
   curl https://eaas-production.up.railway.app/api/subscriptions/plans
   ```
   - Should return your 6 plans from Supabase

