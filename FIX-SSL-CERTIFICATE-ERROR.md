# Fix SSL Certificate Error

## Current Error
`self-signed certificate in certificate chain`

Even with `rejectUnauthorized: false`, the SSL error persists.

## Solution 1: Verify NODE_ENV in Railway

Railway might not have `NODE_ENV=production` set, so SSL config isn't being applied.

**Check:**
1. Railway Dashboard → `eaas` service → **Variables**
2. Look for `NODE_ENV`
3. If missing, add it:
   - Key: `NODE_ENV`
   - Value: `production`
4. Save and redeploy

## Solution 2: Check Connection String Format

The Connection Pooler string might need adjustment.

**Verify in Railway Variables:**
- `DATABASE_URL` should end with `?sslmode=require`
- Should NOT have conflicting SSL parameters

**Correct format:**
```
postgresql://postgres.znrijfsbcovdggwvifbw:Maggie2025%24@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

## Solution 3: Update Database Config (Already Done)

I've updated the code to always use SSL for Supabase connections. After Railway redeploys, it should work.

**Wait for redeploy** (2-3 minutes after the code push), then test again.

## Solution 4: Alternative - Use Direct Connection with IPv4

If Connection Pooler still fails, try direct connection but ensure it uses IPv4:

1. Supabase Dashboard → Settings → Database
2. Get the **direct "URI" connection string** (not pooler)
3. Update `DATABASE_URL` in Railway
4. Make sure it has `?sslmode=require` at the end

## Test After Fix

```bash
curl https://eaas-production-7a55.up.railway.app/api/test/db
```

Should show:
- `success: true`
- `current_database: "postgres"`
- `planCatalogExists: true`

