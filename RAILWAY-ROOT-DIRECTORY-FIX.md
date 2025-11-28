# Fix Railway Root Directory Setting

## Problem
Railway is trying to deploy from the root directory (`eaas`) instead of `eaas-backend`, causing build failures.

## Solution: Set Root Directory in Railway Dashboard

### Step-by-Step Instructions:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Navigate to your project: `outstanding-energy` → `production`
   - Click on the **"eaas"** service

2. **Open Service Settings**
   - Click on the **"Settings"** tab
   - Scroll down to find **"Root Directory"** section

3. **Set Root Directory**
   - In the **"Root Directory"** field, enter: `eaas-backend`
   - Click **"Save"** or the update button

4. **Redeploy**
   - Railway should automatically trigger a new deployment
   - OR manually trigger by going to **"Deployments"** tab → Click **"Redeploy"**

5. **Verify**
   - Wait 2-3 minutes for the build to complete
   - Check that the deployment succeeds
   - Verify the service is running

---

## Alternative: Using Railway CLI

If you have Railway CLI installed:

```bash
railway service
# Select your eaas service
railway variables set RAILWAY_ROOT_DIRECTORY=eaas-backend
```

---

## What This Does

Setting the Root Directory to `eaas-backend` tells Railway:
- Look for `package.json` in `eaas-backend/` folder
- Run `npm install` in `eaas-backend/` folder
- Execute `npm start` from `eaas-backend/` folder
- Use `nixpacks.toml` from `eaas-backend/` folder

---

## Expected Result

After setting the root directory:
- ✅ Build should find `package.json` in `eaas-backend/`
- ✅ Dependencies will install correctly
- ✅ Server will start from `eaas-backend/src/server.js`
- ✅ Deployment should succeed

---

## Troubleshooting

If the setting doesn't appear:
1. Make sure you're in the correct service (not the project level)
2. Check that you have admin/owner permissions
3. Try refreshing the page
4. Contact Railway support if the option is missing

