# Deployment Guide - Render

This guide walks you through deploying your MITdormcraft frontend to Render.

## Prerequisites

✅ Backend already deployed to Render (e.g., `https://mitdormcraft-backend.onrender.com`)  
✅ Frontend code updated with correct API configuration (using `/api` pattern)  
✅ All changes committed and pushed to GitHub

## Step 1: Prepare Your Repository

### Commit Your Changes

```bash
cd /Users/korantes/MITdormcraft-frontend
git add .
git commit -m "Configure frontend for Render deployment with environment-based API"
git push origin main
```

## Step 2: Create Render Service

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +"** → Select **"Static Site"**
3. **Connect your GitHub repository:**
   - Select `MITdormcraft-frontend` repository
   - Click **Connect**

## Step 3: Configure Build Settings

In the Render setup page, configure:

| Setting | Value |
|---------|-------|
| **Name** | `mitdormcraft-frontend` (or your preferred name) |
| **Branch** | `main` |
| **Root Directory** | *(leave empty)* |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

## Step 4: Set Environment Variables

**This is the critical step!** Click on **"Advanced"** and add environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend-app.onrender.com` |

**Example:**
```
VITE_API_BASE_URL=https://mitdormcraft-backend.onrender.com
```

⚠️ **Important:** Replace `your-backend-app` with your actual backend URL from Step 1!

## Step 5: Deploy

1. Click **"Create Static Site"**
2. Wait for deployment to complete (2-5 minutes)
3. Render will show you your deployed URL: `https://mitdormcraft-frontend.onrender.com`

## Step 6: Verify Deployment

### Test Your Deployed App

1. **Open your deployed URL** in browser
2. **Open Browser Console** (F12 → Console tab)
3. **Check Network Tab** (F12 → Network tab)

### Verify API Calls

When you interact with the app, check that:
- ✅ API requests go to `https://your-backend.onrender.com/api/...`
- ✅ NOT going to `localhost:8000`
- ✅ NOT going to `/api/...` (relative URL)

### Test Full User Flow

1. **Register** a new account
2. **Login** with credentials
3. **Browse** room templates
4. **Like** and **comment** on posts
5. **Create** a new post

All should work with the deployed backend!

## Common Issues & Solutions

### Issue: API calls going to wrong URL

**Check:** Browser Network tab shows requests going to `/api/...` instead of full backend URL

**Solution:** 
- Environment variable not set correctly in Render
- Go to Render Dashboard → Your Static Site → Environment
- Add or fix `VITE_API_BASE_URL`
- Trigger manual redeploy

### Issue: CORS errors

**Check:** Browser console shows CORS policy errors

**Solution:**
- Backend needs to allow your frontend origin
- Update backend CORS configuration:
```typescript
// Backend CORS config
cors({
  origin: ['https://mitdormcraft-frontend.onrender.com'],
  credentials: true
})
```

### Issue: Build fails

**Check:** Render build logs show errors

**Common causes:**
- Missing dependencies → Check `package.json`
- TypeScript errors → Fix linter errors locally first
- Build command incorrect → Should be `npm install && npm run build`

### Issue: Blank page after deployment

**Check:** Browser console for errors

**Solution:**
- Check that `dist` is set as publish directory
- Verify `npm run build` works locally
- Check Render logs for build errors

## Updating Your Deployment

### Option 1: Auto-Deploy (Recommended)

Render auto-deploys when you push to `main`:

```bash
git add .
git commit -m "Update frontend features"
git push origin main
# Render automatically rebuilds and deploys
```

### Option 2: Manual Deploy

From Render Dashboard:
1. Go to your Static Site
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Environment Variables Management

### View Current Variables

Render Dashboard → Your Static Site → Environment

### Update Backend URL

If your backend URL changes:
1. Update `VITE_API_BASE_URL` in Render
2. Trigger manual redeploy

### For Multiple Environments

You can create multiple Render services:
- `mitdormcraft-frontend-dev` → Points to dev backend
- `mitdormcraft-frontend-staging` → Points to staging backend  
- `mitdormcraft-frontend-prod` → Points to production backend

## Custom Domain (Optional)

### Add Custom Domain

1. Render Dashboard → Your Static Site → Settings → Custom Domains
2. Add your domain (e.g., `dormcraft.mit.edu`)
3. Update DNS records as instructed by Render
4. Render automatically provisions SSL certificate

### Update Backend CORS

After adding custom domain, update backend CORS to allow your domain.

## Performance Optimization

### Enable Compression

Render automatically serves static files with compression (gzip/brotli).

### CDN Caching

Render's CDN automatically caches your static assets.

### Build Optimization

Your build already includes:
- ✅ Code splitting
- ✅ Minification
- ✅ Tree shaking
- ✅ Asset optimization

## Monitoring Your Deployment

### Build Logs

Render Dashboard → Your Static Site → Logs

Shows:
- Build process
- Any errors or warnings
- Deploy status

### Analytics

Consider adding:
- Google Analytics
- Plausible Analytics
- Simple Analytics

For privacy-friendly analytics.

## Rollback

If deployment breaks:

1. Render Dashboard → Your Static Site → Builds
2. Find previous successful build
3. Click **"Redeploy"** on that build

## Security Best Practices

✅ **Environment variables** - Never commit secrets to git  
✅ **HTTPS** - Render provides free SSL certificates  
✅ **CORS** - Backend only allows your frontend domain  
✅ **Content Security Policy** - Consider adding CSP headers  

## Cost

Render Static Sites are **FREE** for:
- ✅ Unlimited bandwidth
- ✅ Automatic SSL
- ✅ CDN hosting
- ✅ Continuous deployment

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Backend is deployed and working
- [ ] `VITE_API_BASE_URL` is set in Render environment
- [ ] Backend URL in environment variable is correct (no trailing slash)
- [ ] Build command is `npm install && npm run build`
- [ ] Publish directory is `dist`
- [ ] Backend CORS allows frontend domain
- [ ] API requests in browser go to correct backend URL
- [ ] No console errors in deployed site

## Getting Help

**Render Documentation:** https://render.com/docs/static-sites  
**Render Community:** https://community.render.com/  

**Check Your Backend:** Ensure backend is working first before debugging frontend!

---

## Quick Deploy Checklist

- [ ] Commit and push frontend code
- [ ] Create Static Site on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `dist`
- [ ] Add environment variable: `VITE_API_BASE_URL=<your-backend-url>`
- [ ] Deploy and wait for build
- [ ] Test deployed site
- [ ] Verify API calls go to deployed backend
- [ ] Test full user flow

**Your frontend is now live! 🎉**

