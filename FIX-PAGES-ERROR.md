# 🔧 Fix GitHub Pages Deployment Errors

## Common Issues and Solutions

### Issue 1: "Error: No GitHub Pages site found"

**Solution:**
1. Go to: https://github.com/ecogetaway/eaas/settings/pages
2. Under **"Source"**, select **"GitHub Actions"**
3. Click **"Save"**
4. Wait 1-2 minutes for GitHub to create the Pages environment

### Issue 2: "Error: Workflow permissions"

**Solution:**
1. Go to: https://github.com/ecogetaway/eaas/settings/actions
2. Scroll to **"Workflow permissions"**
3. Select: **"Read and write permissions"**
4. Check: **"Allow GitHub Actions to create and approve pull requests"**
5. Click **"Save"**

### Issue 3: "Error: Environment 'github-pages' not found"

**Solution:**
This happens when GitHub Pages isn't enabled. Follow Issue 1 above.

### Issue 4: "Error: Failed to deploy"

**Solution:**
1. Check if repository is **public** (required for free GitHub Pages)
2. Or upgrade to GitHub Pro/Team for private repo Pages
3. Verify GitHub Pages is enabled (Issue 1)

### Issue 5: Build succeeds but deployment fails

**Solution:**
- Check workflow logs for specific error
- Verify `dist` folder exists after build
- Check artifact upload step succeeded

## ✅ Step-by-Step Fix

### Step 1: Enable GitHub Pages
1. Repository → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. **Save**

### Step 2: Set Workflow Permissions
1. Repository → **Settings** → **Actions** → **General**
2. Workflow permissions: **Read and write permissions**
3. **Save**

### Step 3: Trigger Workflow
1. Go to **Actions** tab
2. Select **"Deploy Frontend to GitHub Pages"**
3. Click **"Run workflow"** → **"Run workflow"**

### Step 4: Check Logs
1. Click on the running workflow
2. Expand each step to see details
3. Look for error messages

## 🔍 Debugging Workflow Failures

### Check Build Step
- Look for "Build" step output
- Verify `dist/index.html` exists
- Check for build errors

### Check Upload Step
- Look for "Upload artifact" step
- Verify path is correct: `./eaas-frontend/dist`
- Check file count matches

### Check Deploy Step
- Look for "Deploy to GitHub Pages" step
- Check for permission errors
- Verify environment exists

## 📋 Verification Checklist

- [ ] Repository is public (or Pro/Team plan)
- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Workflow permissions set (Settings → Actions → Read and write)
- [ ] Workflow file syntax is correct
- [ ] `package-lock.json` exists in `eaas-frontend/`
- [ ] Build works locally (`npm run build`)

## 🚀 After Fixing

Once the workflow succeeds:
1. Wait 2-3 minutes for deployment
2. Visit: https://ecogetaway.github.io/eaas/
3. Check Settings → Pages for deployment status

---

**Most Common Fix**: Enable GitHub Pages in Settings → Pages → Source: "GitHub Actions"

