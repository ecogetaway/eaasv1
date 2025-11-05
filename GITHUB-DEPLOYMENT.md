# 🚀 GitHub Deployment Guide

This guide will help you deploy the EaaS platform using GitHub Pages and GitHub Actions.

---

## ✅ Current Status

**Repository**: https://github.com/ecogetaway/eaas  
**Status**: ✅ Code is pushed to GitHub  
**Branch**: `main`

---

## 📋 Step 1: Enable GitHub Pages

1. **Go to your repository**: https://github.com/ecogetaway/eaas
2. **Click "Settings"** (top menu)
3. **Scroll to "Pages"** (left sidebar)
4. **Under "Source"**:
   - Select: **"GitHub Actions"**
   - Click **"Save"**

---

## 📋 Step 2: Set Repository Secrets (Optional)

If you want to use custom API URLs for GitHub Pages deployment:

1. **Go to Settings → Secrets and variables → Actions**
2. **Click "New repository secret"**
3. **Add these secrets** (optional):

   ```
   Name: VITE_API_URL
   Value: https://your-backend-api.com/api
   
   Name: VITE_WS_URL
   Value: wss://your-backend-api.com
   ```

   **Note**: If not set, defaults to `http://localhost:5001` (for development)

---

## 📋 Step 3: Trigger Deployment

### Option A: Automatic (Recommended)
- **Push any change** to `main` branch
- GitHub Actions will automatically:
  1. Build the frontend
  2. Deploy to GitHub Pages
  3. Make it available at: `https://ecogetaway.github.io/eaas/`

### Option B: Manual Trigger
1. Go to **Actions** tab
2. Select **"Deploy Frontend to GitHub Pages"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

---

## 📋 Step 4: Verify Deployment

1. **Wait for workflow to complete** (check Actions tab)
2. **Visit your site**: `https://ecogetaway.github.io/eaas/`
3. **Check GitHub Pages settings**:
   - Settings → Pages
   - Should show: "Your site is live at https://ecogetaway.github.io/eaas/"

---

## 🔧 What Gets Deployed

### Frontend (GitHub Pages)
- ✅ React application
- ✅ Static assets (HTML, CSS, JS)
- ✅ Auto-deploys on every push to `main`

### Backend (Not Deployed)
- ⚠️ Backend API requires a server (Node.js)
- For backend, you'll need:
  - Railway
  - Render
  - Heroku
  - Or your own server

---

## 🧪 CI/CD Pipeline

GitHub Actions will:

1. **On Push to `main`**:
   - ✅ Lint backend code
   - ✅ Lint frontend code
   - ✅ Build frontend
   - ✅ Deploy to GitHub Pages

2. **On Pull Request**:
   - ✅ Run linting checks
   - ✅ Build frontend (for testing)
   - ❌ No deployment (only on merge)

---

## 📝 GitHub Actions Workflows

### 1. `ci.yml` - Continuous Integration
- Runs on every push/PR
- Lints code
- Builds frontend
- No deployment

### 2. `deploy-frontend.yml` - Frontend Deployment
- Runs on push to `main` (when frontend files change)
- Builds frontend
- Deploys to GitHub Pages

---

## 🔍 Monitoring Deployments

1. **Check Actions Tab**:
   - View workflow runs
   - See build logs
   - Debug failures

2. **Check Pages Tab**:
   - View deployment history
   - See live URL
   - Check build status

---

## 🐛 Troubleshooting

### Build Fails
- Check Actions → Latest workflow → View logs
- Common issues:
  - Missing dependencies
  - Build errors
  - Environment variables

### Site Not Loading
- Verify GitHub Pages is enabled
- Check repository visibility (public/private)
- Wait a few minutes for DNS propagation

### API Not Working
- Frontend is deployed, but backend needs separate hosting
- Update `VITE_API_URL` secret if backend is deployed elsewhere
- Or use local backend for development

---

## 📊 Deployment Status

After setup, you can check:
- **Actions**: https://github.com/ecogetaway/eaas/actions
- **Pages**: https://github.com/ecogetaway/eaas/settings/pages
- **Live Site**: https://ecogetaway.github.io/eaas/

---

## 🎯 Next Steps

1. ✅ Enable GitHub Pages (Settings → Pages)
2. ✅ Push workflow files (already done)
3. ✅ Wait for first deployment
4. ⚠️ Deploy backend separately (Railway/Render/etc.)
5. ⚠️ Update frontend API URL secrets

---

**Note**: GitHub Pages only hosts static sites. Your backend API needs separate hosting.

---

**Last Updated**: December 2024

