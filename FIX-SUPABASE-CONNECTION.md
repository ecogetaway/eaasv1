# Fix Supabase Connection Error: ENOTFOUND

## Problem
The error `ENOTFOUND db.znrjfbovxodgwwtlbx.supabase.co` means the DNS lookup is failing. This could be:
1. DATABASE_URL not set correctly in Railway
2. Connection string needs URL encoding (the `$` in password)
3. Supabase project might be paused
4. Wrong connection string format

## Solution 1: Verify DATABASE_URL in Railway

### Check Current Value:
1. Go to Railway Dashboard → `eaas` service → **"Variables"** tab
2. Look for `DATABASE_URL`
3. Check if it's set correctly

### Update DATABASE_URL:
The password contains `$` which needs to be URL-encoded as `%24`:

**Original:**
```
postgresql://postgres:Mggd.2025$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres
```

**URL-Encoded (Use This):**
```
postgresql://postgres:Mggd.2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require
```

**Steps:**
1. Railway Dashboard → `eaas` service → Variables
2. Edit `DATABASE_URL`
3. Use the URL-encoded version above
4. Make sure to include `?sslmode=require` at the end
5. Save

---

## Solution 2: Use Connection Pooler (Recommended)

Supabase Connection Pooler is more reliable. Get it from:

1. **Supabase Dashboard** → Your project
2. **Settings** → **Database**
3. **Connection Pooling** section
4. Copy the **"Connection string"** (Session mode or Transaction mode)

Format:
```
postgresql://postgres.znrjfbovxodgwwtlbx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**Steps:**
1. Get the pooler connection string from Supabase
2. URL-encode the password (replace `$` with `%24`)
3. Update `DATABASE_URL` in Railway Variables
4. Save and redeploy

---

## Solution 3: Verify Supabase Project Status

1. Go to: https://supabase.com/dashboard
2. Check if your project is **Active** (not paused)
3. If paused, click **"Restore"** to reactivate
4. Wait a few minutes for it to come online

---

## Solution 4: Test Connection String Locally

Test if the connection string works:

```bash
# Test with psql (if installed)
psql "postgresql://postgres:Mggd.2025\$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require" -c "SELECT version();"
```

If this fails, the connection string or Supabase project has an issue.

---

## Quick Fix: Update DATABASE_URL in Railway

1. **Get URL-Encoded Connection String:**
   ```
   postgresql://postgres:Mggd.2025%24@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require
   ```

2. **Railway Dashboard:**
   - Go to `eaas` service → Variables
   - Update `DATABASE_URL` with the URL-encoded version
   - Save

3. **Redeploy:**
   - Railway will auto-redeploy
   - Or manually trigger redeploy

4. **Run Migration Again:**
   ```bash
   railway run npm run migrate
   railway run npm run seed
   ```

---

## Alternative: Use Supabase SQL Editor

If Railway connection keeps failing, you can run the migration SQL directly in Supabase:

1. **Supabase Dashboard** → Your project
2. Click **"SQL Editor"**
3. Copy the SQL from `migrate.js` and run it
4. Then run the seed data

---

## Password URL Encoding Reference

Special characters in passwords need encoding:
- `$` → `%24`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

Your password `Mggd.2025$` should be `Mggd.2025%24` in the connection string.

