# API Configuration - Quick Reference

## ⚡ TL;DR

**To update your backend URL for production:**

1. Edit `.env.production`
2. Replace `VITE_API_BASE_URL` with your backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
3. Commit and push
4. Redeploy on Render

That's it! ✅

---

## 📁 Environment Files

| File | Used For | Should Commit? |
|------|----------|----------------|
| `.env.example` | Template/Documentation | ✅ Yes |
| `.env.development` | Local development (`npm run dev`) | ✅ Yes |
| `.env.production` | Production builds (`npm run build`) | ✅ Yes |
| `.env.local` | Personal overrides (optional) | ❌ No (ignored by git) |

## 🔧 Current Configuration

### Development (npm run dev)
```bash
VITE_API_BASE_URL=/api
```
→ Proxied to `http://localhost:8000` by Vite

### Production (npm run build)
```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```
→ **⚠️ UPDATE THIS before deploying!**

## 📝 Step-by-Step: Updating Backend URL

### Option 1: Update .env.production File (Recommended)

```bash
# 1. Edit the file
nano .env.production  # or use your favorite editor

# 2. Change this line:
VITE_API_BASE_URL=https://your-actual-backend-url.onrender.com

# 3. Save, commit, and push
git add .env.production
git commit -m "Update production backend URL"
git push origin main

# 4. Redeploy on Render (automatic if connected to GitHub)
```

### Option 2: Set in Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your frontend service
3. Click "Environment" tab
4. Add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com`
5. Click "Save Changes"
6. Render will automatically redeploy

**Note:** Dashboard variables override `.env.production` file!

## 🧪 Testing

### Test Local Development
```bash
npm run dev
# Should connect to http://localhost:8000/api
```

### Test Production Build Locally
```bash
# Option 1: Temporarily override
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.production.local
npm run build
npm run preview

# Option 2: Test with actual production URL
npm run build
npm run preview
# Check browser console for API calls
```

## 🔍 Debugging

### Check Current API URL
Open browser console and run:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || '/api')
```

### Common Issues

**Problem**: API calls failing in production
- ✅ Check `.env.production` has correct URL
- ✅ Ensure URL includes `https://` (no trailing slash)
- ✅ Verify backend is deployed and accessible
- ✅ Check Render logs for CORS errors

**Problem**: Working locally but not in production
- ✅ Did you commit `.env.production` changes?
- ✅ Did Render redeploy after pushing?
- ✅ Check Render environment variables aren't overriding

**Problem**: CORS errors
- ✅ Backend must allow frontend domain in CORS settings
- ✅ Check backend CORS configuration

## 📚 More Details

See [QUICK_SETUP_GUIDE.md](./QUICK_SETUP_GUIDE.md) for comprehensive documentation.

## 🎯 Code Reference

API configuration is in: `src/services/api.ts:33`

```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
```

This automatically:
- Uses environment variable if set
- Falls back to `/api` for local development proxy
- Works seamlessly across all environments

