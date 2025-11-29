# Test Database Connection from Railway

## Problem
DATABASE_URL matches, but Railway backend still can't see `plan_catalog` table. This might be:
1. Schema issue (table in different schema)
2. Connection pooling issue
3. Backend needs restart
4. Search path issue

## Solution 1: Add Test Endpoint to Verify Connection

Let's add a simple test endpoint to see what tables Railway can actually see.

### Add to backend (temporary test):

In `eaas-backend/src/server.js`, add before other routes:

```javascript
// Test database connection
app.get('/api/test/db', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        table_schema,
        table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    res.json({ 
      success: true, 
      tables: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});
```

Then test:
```bash
curl https://eaas-production.up.railway.app/api/test/db
```

## Solution 2: Check Schema in Supabase

Run this in Supabase SQL Editor:

```sql
-- Check which schema the table is in
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'plan_catalog';

-- Check current search_path
SHOW search_path;

-- List all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

## Solution 3: Explicitly Specify Schema in Queries

If the table is in a different schema, we need to update queries to use `schema.table_name` format.

Update `subscriptionController.js`:

```javascript
// Instead of:
SELECT * FROM plan_catalog

// Use:
SELECT * FROM public.plan_catalog
```

## Solution 4: Restart Railway Service

Sometimes the connection needs to be refreshed:

1. Railway Dashboard → `eaas` service
2. Deployments → Click "Redeploy"
3. Wait for deployment to complete
4. Test again

## Solution 5: Check Connection Pooling

If using Supabase Connection Pooler, make sure:
- Using Transaction mode (not Session mode) for migrations
- Or use direct connection for backend

## Quick Test Commands

```bash
# Test if backend can see any tables
curl https://eaas-production.up.railway.app/api/test/db

# Test plans endpoint
curl https://eaas-production.up.railway.app/api/subscriptions/plans

# Check backend logs
railway logs
```

