# Environment Setup Guide

## Quick Start

### Development Mode (Local)

**No `.env` file needed!** The app will automatically use the Vite proxy to connect to `localhost:8000`.

Just start your backend on port 8000 and run:
```bash
npm run dev
```

### Production Mode (Deployed)

Set the environment variable in your Render dashboard:

```bash
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

**DO NOT set this locally** - let it default to `/api` for development.

### 3. Restart Development Server

After creating or modifying `.env`, restart your dev server:

```bash
npm run dev
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` (proxied to localhost:8000 in dev) | Only for production deployment |

## How It Works

### Development (localhost)
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
// Uses '/api' → Vite proxy → localhost:8000
```

### Production (Render)
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
// Uses 'https://your-backend.onrender.com' (set in Render dashboard)
```

## Testing Your Setup

1. **Check the API URL:**
   Open browser console and verify requests are going to the correct URL

2. **Test Authentication:**
   - Register a new user
   - Login with credentials
   - Verify `userID` is stored in localStorage
   - Check that `X-User-ID` header is present in subsequent requests

3. **Test API Endpoints:**
   - Browse templates
   - View posts
   - Like a post
   - Add a comment
   - Create a post

## Common Configuration Scenarios

### Local Development
**No configuration needed!** Just run:
```bash
npm run dev
```
The Vite proxy automatically forwards `/api` requests to `localhost:8000`.

### Deployed Backend on Render.com
**Set in Render Dashboard:**
```bash
VITE_API_BASE_URL=https://mitdormcraft-backend.onrender.com
```

### Backend on Heroku
**Set in Render Dashboard:**
```bash
VITE_API_BASE_URL=https://mitdormcraft-api.herokuapp.com
```

### Backend with Custom Domain
**Set in Render Dashboard:**
```bash
VITE_API_BASE_URL=https://api.mitdormcraft.com
```

## Troubleshooting

### Environment Variable Not Loading
- Make sure the file is named exactly `.env` (not `.env.local` or `.env.development`)
- Restart your development server after creating/modifying `.env`
- Vite only loads variables prefixed with `VITE_`

### CORS Errors
If you see CORS errors in the console:
1. Verify backend has CORS configured for your frontend origin
2. Check that the backend URL is correct
3. Ensure backend is running and accessible

### 404 Errors
If API requests return 404:
1. Verify backend is running
2. Check backend console for incoming requests
3. Confirm backend API paths match frontend expectations
4. Ensure backend uses capitalized concept names (e.g., `/api/Authentication/...`)

## Security Note

⚠️ **Never commit `.env` files to version control!**

The `.env` file should be listed in `.gitignore`. Each developer should create their own `.env` file locally.

For deployment platforms (Vercel, Netlify, etc.), configure environment variables in the platform's dashboard.

