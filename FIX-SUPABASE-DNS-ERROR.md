# Fix Supabase DNS Error: ENOTFOUND

## Problem
Backend is running, but getting DNS error: `getaddrinfo ENOTFOUND db.znrjfbovxodgwwtlbx.supabase.co`

This means Railway can't resolve the Supabase hostname.

## Possible Causes

### 1. Supabase Project is Paused
Supabase free tier projects pause after inactivity.

**Check:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Check if it shows "Paused" or needs to be restored
4. If paused, click **"Restore"** or **"Resume"**
5. Wait 2-3 minutes for it to come online

### 2. DATABASE_URL Not Set After Service Recreation
After generating new domain, Railway might have reset variables.

**Check:**
1. Railway Dashboard → `eaas` service → **Variables** tab
2. Verify `DATABASE_URL` is still set
3. Value should be: `postgresql://postgres:Maggie2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require`
4. If missing, add it again

### 3. Wrong Supabase Project Reference
The hostname might be incorrect.

**Verify:**
1. Supabase Dashboard → Your project
2. Settings → Database
3. Check the connection string hostname
4. Should match: `db.znrjfbovxodgwwtlbx.supabase.co`
5. If different, update DATABASE_URL in Railway

### 4. Network/DNS Issue
Railway might have temporary DNS issues.

**Try:**
- Wait 5 minutes and test again
- Or use Supabase Connection Pooler instead

---

## Solution Steps

### Step 1: Check Supabase Project Status

1. **Supabase Dashboard** → Your project
2. **Check if project is active** (not paused)
3. **If paused:**
   - Click "Restore" or "Resume"
   - Wait 2-3 minutes
   - Test again

### Step 2: Verify DATABASE_URL in Railway

1. **Railway Dashboard** → `eaas` service → **Variables**
2. **Check `DATABASE_URL` exists**
3. **Verify the value:**
   ```
   postgresql://postgres:Maggie2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require
   ```
4. **If wrong or missing, update it**

### Step 3: Use Connection Pooler (Alternative)

If direct connection fails, try Supabase Connection Pooler:

1. **Supabase Dashboard** → Settings → Database
2. **Connection Pooling** section
3. **Copy the "Connection string"** (Session mode)
4. **URL-encode the password** (`$` → `%24`)
5. **Update `DATABASE_URL` in Railway**
6. **Redeploy**

Connection Pooler format:
```
postgresql://postgres.znrjfbovxodgwwtlbx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

### Step 4: Test Connection

After fixing:

```bash
curl https://eaas-production-7a55.up.railway.app/api/test/db
```

Should show:
- `success: true`
- `current_database: "postgres"` (Supabase)
- `planCatalogExists: true`

---

## Quick Checklist

- [ ] Supabase project is active (not paused)
- [ ] DATABASE_URL is set in Railway Variables
- [ ] DATABASE_URL has correct Supabase hostname
- [ ] Password is URL-encoded (`%24` for `$`)
- [ ] Connection string includes `?sslmode=require`

---

## Most Likely Issue

**Supabase project is paused.** Free tier projects auto-pause after inactivity.

**Fix:**
1. Go to Supabase Dashboard
2. Restore/Resume the project
3. Wait 2-3 minutes
4. Test again

