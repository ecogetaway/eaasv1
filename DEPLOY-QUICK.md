# ⚡ Quick Deploy Guide

## 🚀 Fastest Way to Deploy (Railway + Netlify)

### Backend (Railway) - 5 minutes

1. Go to https://railway.app → Sign up with GitHub
2. New Project → Deploy from GitHub → Select `ecogetaway/eaas` → Select `eaas-backend` folder
3. Add PostgreSQL: "+ New" → Database → PostgreSQL
4. Set Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<from PostgreSQL>
   JWT_SECRET=<random-string>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-site.netlify.app
   ```
5. In Shell: `npm run migrate && npm run seed`
6. Copy backend URL

### Frontend (Netlify) - 3 minutes

1. Go to https://netlify.com → Sign up with GitHub
2. Add new site → Import from GitHub → Select `ecogetaway/eaas`
3. Settings:
   - Base directory: `eaas-frontend`
   - Build command: `npm run build`
   - Publish: `dist`
4. Environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_WS_URL=wss://your-backend.railway.app
   ```
5. Deploy!

### Update Backend CORS

Go back to Railway → Variables → Update `FRONTEND_URL` to your Netlify URL

**Done!** 🎉

Your app is live at: `https://your-site.netlify.app`

