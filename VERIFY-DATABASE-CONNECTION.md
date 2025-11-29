# Verify Database Connection

## Problem
The `plan_catalog` table exists in Supabase (6 rows), but Railway backend still says "relation does not exist". This means Railway might be connected to a different database or schema.

## Solution 1: Verify DATABASE_URL in Railway

1. **Railway Dashboard** → `eaas` service → **"Variables"** tab
2. Check `DATABASE_URL` value
3. Make sure it points to the **same Supabase project** where you created the tables
4. Format should be:
   ```
   postgresql://postgres:Mggd.2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require
   ```

## Solution 2: Check Schema

Supabase might be using a different schema. Try:

1. **Supabase SQL Editor** → Run:
   ```sql
   SELECT table_schema, table_name 
   FROM information_schema.tables 
   WHERE table_name = 'plan_catalog';
   ```

2. If it shows `public.plan_catalog`, that's correct
3. If it shows a different schema, we need to update the connection string

## Solution 3: Test Connection from Railway

Create a test endpoint to verify the connection:

1. **Railway Dashboard** → `eaas` service → **"Deployments"**
2. Check logs to see if there are any connection errors
3. Or add a test route in the backend to list all tables

## Solution 4: Verify Tables in Supabase

1. **Supabase Dashboard** → **"Table Editor"**
2. Confirm you see `plan_catalog` table
3. Click on it - should show 6 rows
4. Check the table structure matches what we created

## Quick Check: Test Direct Connection

If you have `psql` installed, test the connection:

```bash
psql "postgresql://postgres:Mggd.2025\$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require" -c "\dt plan_catalog"
```

This should list the `plan_catalog` table if the connection works.

## Most Likely Issue

The Railway `DATABASE_URL` might be pointing to a **different Supabase project** or **different database** than where you created the tables.

**Fix:**
1. Verify which Supabase project you created the tables in
2. Get the correct connection string from that project
3. Update `DATABASE_URL` in Railway
4. Redeploy

