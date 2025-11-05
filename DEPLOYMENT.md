# 🚀 Deployment Guide - EaaS Platform

This guide will help you deploy the EaaS platform to production.

---

## 📋 Prerequisites

- GitHub repository connected (✅ Done: https://github.com/ecogetaway/eaas)
- PostgreSQL database (we'll set up during deployment)
- Redis (optional, for caching)

---

## 🎯 Recommended Deployment Stack

**Backend**: Railway or Render  
**Frontend**: Netlify or Vercel  
**Database**: Railway PostgreSQL or Render PostgreSQL

---

## Option 1: Railway (Backend) + Netlify (Frontend) ⭐ Recommended

### Step 1: Deploy Backend to Railway

1. **Sign up/Login to Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `ecogetaway/eaas` repository
   - Select `eaas-backend` folder

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will create a PostgreSQL instance
   - Note the connection string (DATABASE_URL)

4. **Set Environment Variables**
   - Go to your backend service → Variables
   - Add these variables:

   ```env
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=<from Railway PostgreSQL>
   JWT_SECRET=<generate a strong random string>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.netlify.app
   REDIS_URL=<optional, if using Redis>
   UPLOAD_DIR=./uploads
   ```

5. **Run Database Migrations**
   - In Railway, go to your backend service
   - Click "Deployments" → "View Logs"
   - Click "View Deploy Logs" → "Shell"
   - Run:
     ```bash
     npm run migrate
     npm run seed
     ```

6. **Deploy**
   - Railway will auto-deploy from GitHub
   - Get your backend URL (e.g., `https://eaas-backend-production.up.railway.app`)

### Step 2: Deploy Frontend to Netlify

1. **Sign up/Login to Netlify**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub → Select `ecogetaway/eaas` repository
   - Configure:
     - **Base directory**: `eaas-frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add:

   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_WS_URL=wss://your-backend-url.railway.app
   ```

4. **Deploy**
   - Netlify will auto-deploy
   - Get your frontend URL (e.g., `https://eaas-frontend.netlify.app`)

5. **Update Backend FRONTEND_URL**
   - Go back to Railway backend variables
   - Update `FRONTEND_URL` to your Netlify URL

---

## Option 2: Render (Backend) + Vercel (Frontend)

### Step 1: Deploy Backend to Render

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub → Select `ecogetaway/eaas` repository
   - Configure:
     - **Name**: `eaas-backend`
     - **Root Directory**: `eaas-backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Create database
   - Note the connection string

4. **Set Environment Variables**
   - In your web service → Environment
   - Add:

   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<from Render PostgreSQL>
   JWT_SECRET=<generate a strong random string>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Run Migrations**
   - In Render dashboard → Shell
   - Run:
     ```bash
     npm run migrate
     npm run seed
     ```

6. **Deploy**
   - Render will auto-deploy
   - Get your backend URL (e.g., `https://eaas-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Create New Project**
   - Click "Add New Project"
   - Import `ecogetaway/eaas` repository
   - Configure:
     - **Root Directory**: `eaas-frontend`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Set Environment Variables**
   - In project settings → Environment Variables
   - Add:

   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_WS_URL=wss://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Vercel will auto-deploy
   - Get your frontend URL (e.g., `https://eaas-frontend.vercel.app`)

---

## 🔧 Post-Deployment Checklist

### Backend
- [ ] Database migrations run successfully
- [ ] Seed data loaded
- [ ] Health check endpoint works: `https://your-backend-url/health`
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] WebSocket connection works

### Frontend
- [ ] Build completes successfully
- [ ] Environment variables set
- [ ] API calls work (check browser console)
- [ ] WebSocket connection works
- [ ] All routes accessible
- [ ] Mobile responsive

### Testing
- [ ] Login works
- [ ] Dashboard loads
- [ ] Real-time data updates
- [ ] Billing page works
- [ ] Support tickets work

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is strong and unique
- [ ] `DATABASE_URL` is secure (not exposed)
- [ ] CORS only allows your frontend domain
- [ ] Environment variables not committed to git
- [ ] HTTPS enabled (both frontend and backend)

---

## 📝 Environment Variables Reference

### Backend (.env)

```env
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.netlify.app
REDIS_URL=redis://localhost:6379  # Optional
UPLOAD_DIR=./uploads
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_WS_URL=wss://your-backend-url.railway.app
```

**Note**: For WebSocket, use `wss://` (secure) in production, not `ws://`

---

## 🐛 Troubleshooting

### Backend Issues

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure migrations ran successfully

**Port issues:**
- Railway uses dynamic ports, set `PORT` env var
- Render uses port 10000, set `PORT=10000`

**CORS errors:**
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check CORS middleware configuration

### Frontend Issues

**API connection errors:**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Verify CORS is configured

**WebSocket connection errors:**
- Use `wss://` (not `ws://`) for production
- Check backend WebSocket server is running
- Verify firewall allows WebSocket connections

**Build errors:**
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Check build logs for specific errors

---

## 🔄 Updating Deployment

Both Railway/Render and Netlify/Vercel support automatic deployments:

1. **Push to GitHub**: `git push origin main`
2. **Auto-deploy**: Platforms detect changes and redeploy
3. **Monitor**: Check deployment logs for errors

---

## 📊 Monitoring

### Railway
- View logs in dashboard
- Set up alerts for errors
- Monitor resource usage

### Render
- View logs in dashboard
- Set up health checks
- Monitor uptime

### Netlify
- View build logs
- Monitor site analytics
- Check form submissions

### Vercel
- View deployment logs
- Monitor analytics
- Check function logs

---

## 🎉 Success!

Once deployed, your EaaS platform will be live at:
- **Frontend**: `https://your-frontend-url.netlify.app`
- **Backend API**: `https://your-backend-url.railway.app/api`
- **WebSocket**: `wss://your-backend-url.railway.app`

**Demo Credentials:**
- Email: `demo1@eaas.com`
- Password: `Demo@123`

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test endpoints manually
4. Check GitHub issues

---

**Last Updated**: December 2024

