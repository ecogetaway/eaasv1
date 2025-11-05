# 🔧 Fix GitHub Actions Failures

## The Main Issue

The workflows are failing because **GitHub Pages is not enabled** in the repository settings.

## ✅ Quick Fix Steps

### Step 1: Enable GitHub Pages

1. Go to: https://github.com/ecogetaway/eaas/settings/pages
2. Under **"Source"**:
   - Select: **"GitHub Actions"**
   - Click **"Save"**

### Step 2: Check Workflow Logs

1. Go to: https://github.com/ecogetaway/eaas/actions
2. Click on any failed workflow
3. Click on the failed job
4. Check the error message

## Common Error Messages & Fixes

### Error: "Pages build failed" or "No GitHub Pages site found"
**Fix**: Enable GitHub Pages (Step 1 above)

### Error: "npm ci" failed
**Fix**: Already fixed - workflows now use `npm ci || npm install` fallback

### Error: "Workflow run failed"
**Fix**: 
- Check if GitHub Pages is enabled
- Verify repository is public (or has GitHub Pages enabled for private repos)
- Check workflow logs for specific error

### Error: "Permission denied" or "Workflow permissions"
**Fix**: 
- Go to Settings → Actions → General
- Under "Workflow permissions", select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"

## ✅ Verify Everything Works

After enabling GitHub Pages:

1. **Trigger workflow manually**:
   - Go to Actions tab
   - Select "Deploy Frontend to GitHub Pages"
   - Click "Run workflow" → "Run workflow"

2. **Wait for completion** (2-3 minutes)

3. **Check deployment**:
   - Go to Settings → Pages
   - Should show: "Your site is live at https://ecogetaway.github.io/eaas/"

4. **Visit your site**: https://ecogetaway.github.io/eaas/

## 🔍 Still Having Issues?

Check the workflow logs:
1. Go to Actions tab
2. Click on the failed workflow run
3. Click on the failed job
4. Expand each step to see error details
5. Share the error message for further help

---

**Most Common Fix**: Enable GitHub Pages in Settings → Pages → Source: "GitHub Actions"

