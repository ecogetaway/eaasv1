# Fix: Wrong Supabase Project Reference ID

## Problem Found!

Your Supabase project URL shows: `znrijfsbcovdggwvifbw`
But your DATABASE_URL uses: `znrjfbovxodgwwtlbx`

**These don't match!** That's why the DNS lookup fails.

## Solution: Get Correct Connection String

### Step 1: Get Correct Connection String from Supabase

1. **Supabase Dashboard** → Your project (`eaas-project`)
2. **Settings** → **Database**
3. **Connection string** section
4. **Copy the "URI" connection string**
5. It should have the correct project reference: `znrijfsbcovdggwvifbw`

### Step 2: Update DATABASE_URL in Railway

1. **Railway Dashboard** → `eaas` service → **Variables**
2. **Edit `DATABASE_URL`**
3. **Replace with the correct connection string** from Supabase
4. **Make sure to URL-encode the password:**
   - `$` → `%24`
5. **Add `?sslmode=require` at the end** (if not already there)
6. **Save**

### Step 3: Correct Format

The connection string should look like:
```
postgresql://postgres:[PASSWORD]@db.znrijfsbcovdggwvifbw.supabase.co:5432/postgres?sslmode=require
```

Notice: `znrijfsbcovdggwvifbw` (matches your project URL)

NOT: `znrjfbovxodgwwtlbx` (old/wrong project ID)

### Step 4: Redeploy and Test

1. **Railway will auto-redeploy** after saving
2. **Wait 2-3 minutes**
3. **Test:**
   ```bash
   curl https://eaas-production-7a55.up.railway.app/api/test/db
   ```

---

## Quick Fix Steps

1. **Supabase Dashboard** → Settings → Database
2. **Copy the "URI" connection string**
3. **URL-encode password** (`$` → `%24`)
4. **Update `DATABASE_URL` in Railway Variables**
5. **Save and wait for redeploy**
6. **Test again**

---

## Verify After Fix

The test should show:
- `current_database: "postgres"` ✅
- `planCatalogExists: true` ✅
- `tables` array with all your tables ✅

