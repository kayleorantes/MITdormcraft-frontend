# Quick Setup Guide - MITdormcraft Frontend

## 🚀 Easy API Configuration

The frontend is pre-configured to automatically connect to the right backend based on your environment!

### How It Works

The frontend uses the `VITE_API_BASE_URL` environment variable to determine where to send API requests:

- **Local Development**: Automatically uses `localhost:8000`
- **Production**: Uses your deployed Render backend URL

### Setup Steps

#### 1. For Local Development

Just run:
```bash
npm run dev
```

✅ **That's it!** The app will automatically proxy `/api` requests to `http://localhost:8000` (your local backend).

#### 2. For Production Deployment on Render

**Before deploying, update the backend URL:**

1. Open `.env.production`
2. Replace `https://your-backend-url.onrender.com` with your actual backend URL
3. Example:
   ```bash
   VITE_API_BASE_URL=https://mitdormcraft-backend.onrender.com
   ```

4. Commit and push:
   ```bash
   git add .env.production
   git commit -m "Update production backend URL"
   git push
   ```

**On Render Dashboard:**

No additional environment variables needed! The `.env.production` file will be used automatically during build.

Alternatively, you can set it in Render's dashboard:
- Go to your frontend service on Render
- Navigate to "Environment" tab
- Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`

### Current Configuration

| Environment | File | API Base URL |
|------------|------|-------------|
| Development | `.env.development` | `/api` (proxied to localhost:8000) |
| Production | `.env.production` | `https://your-backend-url.onrender.com` (update this!) |

### File Structure

```
MITdormcraft-frontend/
├── .env.example          # Template (not used, for reference)
├── .env.development      # Used in: npm run dev
├── .env.production       # Used in: npm run build
├── src/
│   └── services/
│       └── api.ts        # API configuration (already set up!)
└── vite.config.ts        # Dev proxy configuration
```

### Checking Your Configuration

To see which backend URL is being used, add this to your browser console:

```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || '/api')
```

### Troubleshooting

**Issue**: Frontend can't connect to backend in development
- ✅ Make sure your backend is running on `http://localhost:8000`
- ✅ Check `vite.config.ts` proxy settings

**Issue**: Frontend can't connect to backend in production
- ✅ Update `.env.production` with correct backend URL
- ✅ Make sure backend URL includes `https://` and no trailing slash
- ✅ Rebuild and redeploy: `npm run build`

**Issue**: CORS errors
- ✅ Make sure backend has CORS enabled for frontend domain
- ✅ Check backend is deployed and accessible

### Advanced: Testing Production Build Locally

To test the production build with local backend:

```bash
# Create temporary .env.production.local (ignored by git)
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.production.local

# Build and preview
npm run build
npm run preview
```

---

## 🎉 You're All Set!

The configuration is now automated. Just:
1. Update `.env.production` with your backend URL
2. Deploy to Render
3. Your frontend will automatically connect to the right backend!

