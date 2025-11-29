# Use Supabase Connection Pooler for Railway

## Problem
Getting `ENETUNREACH` IPv6 connection error. Railway has issues with direct Supabase connections.

## Solution: Use Supabase Connection Pooler

Connection Pooler is more reliable for Railway deployments and handles IPv4/IPv6 better.

### Step 1: Get Connection Pooler String

1. **Supabase Dashboard** → `eaas-project` → **Settings** → **Database**
2. Scroll to **"Connection Pooling"** section
3. Find **"Connection string"** (Session mode or Transaction mode)
4. Copy the connection string
5. Format should be:
   ```
   postgresql://postgres.znrijfsbcovdggwvifbw:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   Notice: Uses `pooler.supabase.com` (not direct `db.`)

### Step 2: URL-Encode Password

Your password `Maggie2025$` needs encoding:
- `$` → `%24`
- So password becomes: `Maggie2025%24`

### Step 3: Update DATABASE_URL in Railway

1. **Railway Dashboard** → `eaas` service → **Variables**
2. **Edit `DATABASE_URL`**
3. **Replace with Connection Pooler string:**
   ```
   postgresql://postgres.znrijfsbcovdggwvifbw:Maggie2025%24@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   ```
   Replace `[REGION]` with your actual region (e.g., `us-east-1`, `ap-southeast-1`)
4. **Add `?sslmode=require` at the end**
5. **Save**

### Step 4: Find Your Region

If you don't know the region:
1. **Supabase Dashboard** → Settings → General
2. Look for "Region" or check the pooler URL format
3. Common regions: `us-east-1`, `ap-southeast-1`, `eu-west-1`

Or check the direct connection string - it might show the region.

### Step 5: Redeploy and Test

1. **Railway will auto-redeploy**
2. **Wait 2-3 minutes**
3. **Test:**
   ```bash
   curl https://eaas-production-7a55.up.railway.app/api/test/db
   ```

---

## Why Connection Pooler?

- ✅ Better IPv4/IPv6 handling
- ✅ More reliable for Railway
- ✅ Handles connection pooling automatically
- ✅ Better for production workloads

---

## Alternative: Force IPv4

If you want to keep direct connection, you might need to configure Railway to use IPv4 only, but Connection Pooler is the recommended solution.

