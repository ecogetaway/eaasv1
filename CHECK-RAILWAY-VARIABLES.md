# Check Railway Variables - DATABASE_URL Override Issue

## Problem
DATABASE_URL is set to Supabase, but Railway is connecting to "railway" database instead.

## Possible Causes

### 1. Shared Variables Override
Railway has **Shared Variables** that can override service variables.

**Check:**
1. Railway Dashboard → `outstanding-energy` project (not the service)
2. Click **"Variables"** tab at the project level
3. Look for `DATABASE_URL` in **Shared Variables**
4. If it exists, it might be overriding the service variable

**Fix:**
- Either delete the shared `DATABASE_URL`
- Or update it to point to Supabase
- Service-level variables should take precedence, but shared variables can override

### 2. Railway Auto-Created Postgres Service
Railway might have auto-created a PostgreSQL service that's injecting its own DATABASE_URL.

**Check:**
1. Railway Dashboard → `outstanding-energy` project
2. Look at the **Architecture** tab
3. Do you see a **Postgres** or **PostgreSQL** service?
4. If yes, Railway might be auto-injecting `${{Postgres.DATABASE_URL}}`

**Fix:**
- The `eaas` service should use Supabase, not Railway's Postgres
- Make sure `DATABASE_URL` in `eaas` service explicitly uses Supabase connection string
- Railway's Postgres service won't have your tables

### 3. Environment Variables Priority
Railway has variable priority: Shared > Service > Default

**Check Service Variables:**
1. Railway Dashboard → `eaas` service → Variables
2. Make sure `DATABASE_URL` is in **Service Variables** (not shared)
3. Value should be the full Supabase connection string

### 4. Check "7 variables added by Railway"
The message says "> 7 variables added by Railway" - these might include a DATABASE_URL.

**Check:**
1. Railway Dashboard → `eaas` service → Variables
2. Click on "> 7 variables added by Railway" to expand
3. Look for any `DATABASE_URL` or `POSTGRES_URL` variables
4. These Railway-generated variables might be overriding yours

---

## Solution Steps

### Step 1: Check All Variables

1. **Railway Dashboard** → `eaas` service → **Variables** tab
2. **Expand "7 variables added by Railway"**
3. **Look for:**
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `POSTGRES_HOST`
   - Any variable that might override your Supabase connection

### Step 2: Check Project-Level Variables

1. **Railway Dashboard** → `outstanding-energy` project (click on project name)
2. **Variables** tab
3. **Check Shared Variables** section
4. Look for `DATABASE_URL` that might override service variables

### Step 3: Verify Service Variable

1. **Railway Dashboard** → `eaas` service → **Variables**
2. **Your `DATABASE_URL` should be:**
   - In **Service Variables** section (not shared)
   - Value: `postgresql://postgres:Maggie2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require`
   - Should NOT reference `${{Postgres.DATABASE_URL}}`

### Step 4: Force Override

If Railway is auto-injecting variables:

1. **Delete any Railway-generated DATABASE_URL** (if exists in the 7 variables)
2. **Make sure your Supabase DATABASE_URL is in Service Variables**
3. **Redeploy** the service

### Step 5: Check for Postgres Service

1. **Railway Dashboard** → `outstanding-energy` → **Architecture** tab
2. **Do you see a Postgres/PostgreSQL service?**
3. If yes, and you don't need it:
   - You can delete it (if not used by other services)
   - Or just make sure `eaas` service doesn't reference it

---

## Quick Fix: Explicitly Set in Service Variables

1. **Railway Dashboard** → `eaas` service → **Variables**
2. **Click "+ New Variable"**
3. **Add:**
   - Key: `DATABASE_URL`
   - Value: `postgresql://postgres:Maggie2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require`
4. **Make sure it's in Service Variables** (not shared)
5. **Save**
6. **Redeploy**

---

## Verify After Fix

```bash
curl https://eaas-production.up.railway.app/api/test/db
```

Should show:
- `current_database: "postgres"` (Supabase, not "railway")
- `planCatalogExists: true`
- Tables listed

