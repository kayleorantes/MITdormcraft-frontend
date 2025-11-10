# Assignment 4c: Complete Deployment Checklist

## Overview

This comprehensive checklist guides you through deploying both your backend and frontend to Render for Assignment 4c.

---

## Pre-Deployment Checklist

### Code Readiness
- [ ] All features working locally
- [ ] No console errors in browser
- [ ] Backend starts without errors
- [ ] All tests passing (if you have tests)
- [ ] No linter errors in critical files
- [ ] Code committed and pushed to GitHub

### Documentation
- [ ] README.md updated with project description
- [ ] Environment variables documented
- [ ] API endpoints documented (if applicable)

### Data Preparation
- [ ] MongoDB Atlas account created (free tier)
- [ ] Database cluster created and running
- [ ] Database connection string obtained
- [ ] Database seeded with initial data (optional)

---

## Part 1: Deploy Backend First

### Step 1.1: Set Up MongoDB Atlas

**Why:** Your deployed backend needs a cloud database, not localhost.

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account
   - Verify email

2. **Create Cluster:**
   - Click "Build a Database"
   - Select FREE tier (M0)
   - Choose cloud provider: AWS
   - Choose region: Closest to Render's region (e.g., US East for `us-east`)
   - Name your cluster: `mitdormcraft` (or any name)
   - Click "Create"
   - Wait 3-5 minutes for cluster to deploy

3. **Configure Access:**
   - **Database Access** → Add User
     - Username: `mitdormcraft_user`
     - Password: Generate secure password (save it!)
     - Role: Atlas Admin (or Read/Write)
     - Click "Add User"
   
   - **Network Access** → Add IP Address
     - Click "Add IP Address"
     - Select "Allow Access from Anywhere" (`0.0.0.0/0`)
     - Or add Render's IP ranges if known
     - Click "Confirm"

4. **Get Connection String:**
   - Go to **Database** → **Connect**
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: Latest
   - Copy connection string:
     ```
     mongodb+srv://mitdormcraft_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Important:** Replace `<password>` with your actual password
   - Save this connection string securely

### Step 1.2: Prepare Backend Repository

1. **Ensure `.gitignore` excludes secrets:**
   ```
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   node_modules/
   ```

2. **Create `.env.example` in backend:**
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mitdormcraft

   # Server
   PORT=8000

   # CORS
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

3. **Check your backend start script:**
   - Should be able to run with: `deno run start` or `deno task start`
   - Verify in `deno.json`:
     ```json
     {
       "tasks": {
         "start": "deno run --allow-all server/server.ts"
       }
     }
     ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

### Step 1.3: Deploy Backend to Render

1. **Go to Render Dashboard:**
   - Navigate to https://dashboard.render.com/
   - Sign up or log in (can use GitHub login)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your backend repository: `MITdormcraft` or similar
   - Click "Connect"

3. **Configure Service:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `mitdormcraft-backend` |
   | **Region** | `US East (Ohio)` or closest to you |
   | **Branch** | `main` |
   | **Root Directory** | *(leave empty)* |
   | **Runtime** | `Docker` or `Native` |
   | **Build Command** | `deno run build` or `echo "No build needed"` |
   | **Start Command** | `deno run --allow-all start` or `deno run start` |
   | **Instance Type** | `Free` |

4. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/mitdormcraft` |
   | `PORT` | `8000` (Render may override this) |
   | `FRONTEND_URL` | `https://mitdormcraft-frontend.onrender.com` (update after frontend deploys) |
   | `NODE_ENV` | `production` |

   **Note:** You'll need to update `FRONTEND_URL` after deploying frontend.

5. **Create Service:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes first time)
   - Watch logs for any errors

6. **Verify Backend is Running:**
   - Render will show you the URL: `https://mitdormcraft-backend.onrender.com`
   - Copy this URL (you'll need it for frontend)
   - Test a public endpoint:
     ```bash
     curl -X POST https://mitdormcraft-backend.onrender.com/api/RoomTemplate/findTemplates \
       -H "Content-Type: application/json" \
       -d '{}'
     ```
   - Should return data or at least not error

### Step 1.4: Troubleshoot Backend (if needed)

**Check Logs:**
- Render Dashboard → Your Service → "Logs" tab
- Look for errors during startup

**Common Issues:**

**Issue: "Port already in use"**
- Solution: Don't hardcode port 8000. Use `Deno.env.get("PORT") || "8000"`

**Issue: "MONGODB connection failed"**
- Solution: Check connection string, ensure password is correct
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas

**Issue: "Module not found"**
- Solution: Ensure all imports use correct paths
- Check `deno.json` for import maps

**Issue: "Permission denied"**
- Solution: Ensure start command includes `--allow-all` flag

---

## Part 2: Deploy Frontend

### Step 2.1: Prepare Frontend Repository

1. **Create/Update `.env.production`:**
   ```env
   # Backend API URL (update with your actual backend URL)
   VITE_API_BASE_URL=https://mitdormcraft-backend.onrender.com
   ```

2. **Verify `.env.development` exists:**
   ```env
   # For local development (proxied by Vite)
   VITE_API_BASE_URL=/api
   ```

3. **Create `.env.example`:**
   ```env
   # Backend API URL
   # Development: /api (proxied by Vite to localhost:8000)
   # Production: https://your-backend.onrender.com
   VITE_API_BASE_URL=/api
   ```

4. **Update `.gitignore` (should already have):**
   ```
   # local env files
   .env.local
   .env.*.local
   
   # but DO include these for Render
   # (they don't contain secrets, just config)
   !.env.development
   !.env.production
   !.env.example
   ```

5. **Test production build locally:**
   ```bash
   npm run build
   npm run preview
   ```
   - Open http://localhost:4173
   - Check that it connects to deployed backend
   - Verify authentication works

6. **Commit and push:**
   ```bash
   git add .
   git commit -m "Configure frontend for Render deployment"
   git push origin main
   ```

### Step 2.2: Deploy Frontend to Render

1. **Go to Render Dashboard:**
   - Navigate to https://dashboard.render.com/

2. **Create New Static Site:**
   - Click "New +" → "Static Site"
   - Select your frontend repository: `MITdormcraft-frontend` or similar
   - Click "Connect"

3. **Configure Static Site:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `mitdormcraft-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | *(leave empty)* |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://mitdormcraft-backend.onrender.com` |

   **Important:** Use your actual backend URL from Step 1.3!

5. **Create Static Site:**
   - Click "Create Static Site"
   - Wait for build and deployment (3-5 minutes)
   - Watch logs for any errors

6. **Get Frontend URL:**
   - Render will show you the URL: `https://mitdormcraft-frontend.onrender.com`
   - Copy this URL

### Step 2.3: Update Backend CORS

**Important:** Now that frontend is deployed, update backend to allow it!

1. **Go back to Backend Service in Render:**
   - Dashboard → `mitdormcraft-backend` → "Environment"

2. **Update `FRONTEND_URL` environment variable:**
   - Change from temporary value to actual frontend URL:
   - `FRONTEND_URL=https://mitdormcraft-frontend.onrender.com`

3. **Check Backend CORS Configuration:**
   - Your backend code should have CORS middleware that uses this env var:
   ```typescript
   // In your backend server setup
   const allowedOrigins = [
     Deno.env.get("FRONTEND_URL"),
     "http://localhost:5173", // for local dev
   ]
   
   app.use(cors({
     origin: (origin) => allowedOrigins.includes(origin),
     credentials: true,
   }))
   ```

4. **Redeploy Backend** (if CORS config changed):
   - Manual Deploy → "Deploy latest commit"
   - Or push a new commit to trigger auto-deploy

---

## Part 3: Verify Deployment

### Step 3.1: Test Public Endpoints

1. **Open Frontend URL** in browser
2. **Open Browser DevTools** (F12)
3. **Go to Network tab**
4. **Browse room templates** (no login needed)
5. **Verify in Network tab:**
   - Request goes to `https://your-backend.onrender.com/api/...`
   - Status: 200 OK
   - Response contains data

### Step 3.2: Test Authentication Flow

1. **Register new account:**
   - Fill out registration form
   - Submit
   - Check Network tab: request to `/api/Authentication/registerAndCreateAccount`
   - Should redirect to home page after success

2. **Logout and login:**
   - Click logout
   - Go to login page
   - Enter credentials
   - Check Network tab: request to `/api/Authentication/verifyCredentials`
   - Should return userID
   - Should redirect to home page

3. **Check LocalStorage:**
   - DevTools → Application tab → Local Storage
   - Should see `userID`, `username`, etc.

### Step 3.3: Test Protected Actions

**While logged in:**

1. **Like a post:**
   - Click heart icon on a post
   - Check Network tab: request includes `X-User-ID` header
   - Should succeed

2. **Comment on a post:**
   - Add a comment
   - Should appear in UI
   - Check Network tab: authenticated request

3. **Create a post:**
   - Go to Create Post page
   - Fill out form
   - Upload image
   - Submit
   - Should redirect to home/feed
   - New post should appear

4. **Edit your own post:**
   - Go to your profile
   - Click edit on one of your posts
   - Make changes
   - Save
   - Should succeed

5. **Try to edit someone else's post** (if possible):
   - Should fail with 403 Forbidden

### Step 3.4: Check Backend Logs

1. **Go to Render Dashboard:**
   - Your backend service → "Logs" tab

2. **Verify sync traces:**
   - Should see `Requesting.request` logs
   - Should see auth validation logs
   - Should see action execution logs

3. **Look for errors:**
   - No 500 errors
   - No database connection errors
   - No CORS errors

### Step 3.5: Test on Different Devices/Browsers

- [ ] Desktop Chrome
- [ ] Desktop Firefox/Safari
- [ ] Mobile browser (if possible)
- [ ] Incognito/private mode

---

## Part 4: Post-Deployment Tasks

### Step 4.1: Update README Files

**Backend README.md:**
```markdown
# MITDormCraft Backend

[Project description]

## Deployed App
- **Frontend:** https://mitdormcraft-frontend.onrender.com
- **Backend:** https://mitdormcraft-backend.onrender.com

## Assignment 4c Deliverables
- **Demo Video:** [YouTube link]
- **Design Document:** [DESIGN_DOCUMENT_4C.md](./DESIGN_DOCUMENT_4C.md)
- **Reflections:** [REFLECTIONS_4C.md](./REFLECTIONS_4C.md)
- **Backend Trace:** [BACKEND_TRACE_4C.txt](./BACKEND_TRACE_4C.txt)

[Rest of README...]
```

**Frontend README.md:**
```markdown
# MITDormCraft Frontend

[Project description]

## Deployed App
https://mitdormcraft-frontend.onrender.com

## Backend Repository
https://github.com/kayleorantes/MITdormcraft

[Rest of README...]
```

### Step 4.2: Record Demo Video

- [ ] Follow instructions in `VIDEO_AND_TRACE_INSTRUCTIONS.md`
- [ ] Use deployed app for demo
- [ ] Narrate throughout
- [ ] Keep under 3 minutes
- [ ] Upload to YouTube (unlisted)

### Step 4.3: Capture Backend Trace

- [ ] Access Render logs for backend
- [ ] Perform demo actions again (matching video)
- [ ] Copy/download logs
- [ ] Save as `BACKEND_TRACE_4C.txt` in backend repo
- [ ] Commit and push

### Step 4.4: Complete Documentation

**In Backend Repository:**

- [ ] `DESIGN_DOCUMENT_4C.md` - completed and committed
- [ ] `REFLECTIONS_4C.md` - completed and committed
- [ ] `BACKEND_TRACE_4C.txt` - captured and committed
- [ ] `ACTIONS_DOCUMENTATION.md` - actions documented
- [ ] `README.md` - updated with all links

### Step 4.5: Final Commits

```bash
# In backend repo
git add DESIGN_DOCUMENT_4C.md REFLECTIONS_4C.md BACKEND_TRACE_4C.txt README.md
git commit -m "Add Assignment 4c deliverables"
git push origin main

# In frontend repo
git add README.md .env.production
git commit -m "Update README with deployment info"
git push origin main
```

### Step 4.6: Get Commit Hashes

```bash
# In backend repo
git log -1 --format="%H"
# Copy this hash

# In frontend repo
git log -1 --format="%H"
# Copy this hash
```

### Step 4.7: Submit Google Form

- [ ] Find the Assignment 4c Google Form (from assignment page)
- [ ] Fill in:
  - Backend commit hash
  - Frontend commit hash
  - Deployed app URL
  - Demo video link
- [ ] Submit form

### Step 4.8: Fill Out Survey (Within 24 hours)

- [ ] Complete the course survey
- [ ] Provide feedback on the assignment

---

## Common Deployment Issues

### Issue: Frontend shows blank page

**Check:**
- Browser console for errors
- Network tab for failed requests
- Verify `dist` folder was created in build
- Check Render build logs

**Solutions:**
- Ensure build command succeeded
- Check publish directory is `dist`
- Verify all routes use `createWebHistory` not `createWebHashHistory`

### Issue: API calls failing (404 or CORS)

**Check:**
- Network tab: where are requests going?
- Are they going to correct backend URL?
- Check CORS configuration in backend
- Verify `VITE_API_BASE_URL` in Render environment

**Solutions:**
- Update backend CORS to allow frontend domain
- Verify environment variable is set correctly
- Redeploy frontend after fixing env vars

### Issue: Authentication not working

**Check:**
- Is `X-User-ID` header being sent?
- Is userID being stored in localStorage?
- Backend logs: is auth sync validating?

**Solutions:**
- Check axios interceptor is adding header
- Verify backend is reading header correctly
- Test login flow, check what userID is returned

### Issue: Database connection errors

**Check:**
- Backend logs for MongoDB errors
- Connection string format
- MongoDB Atlas IP whitelist
- MongoDB Atlas user permissions

**Solutions:**
- Ensure connection string password is correct
- Add 0.0.0.0/0 to IP whitelist
- Check database user has correct permissions
- Test connection string locally first

### Issue: Render service crashes or won't start

**Check:**
- Render logs for error messages
- Start command is correct
- All permissions included in Deno command
- Port configuration

**Solutions:**
- Add `--allow-all` to start command
- Use `Deno.env.get("PORT")` not hardcoded port
- Check all imports are accessible
- Ensure all environment variables are set

### Issue: Free tier limitations

**Render Free Tier Limits:**
- Backend "spins down" after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime
- Build time: 300 build minutes/month

**Solutions:**
- Accept the spin-down delay (it's free!)
- Mention in video: "Loading may take a moment"
- For demo: visit site a minute before recording
- Consider upgrading to paid tier if needed for presentation

---

## Final Checklist

### Deployment
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] MongoDB Atlas database connected
- [ ] CORS configured correctly
- [ ] All endpoints working

### Testing
- [ ] Public endpoints work
- [ ] Registration works
- [ ] Login works
- [ ] Authenticated actions work
- [ ] Authorization checks work (can't edit others' posts)
- [ ] Tested on multiple browsers/devices

### Documentation
- [ ] Design document complete
- [ ] Reflections document complete
- [ ] Backend trace captured
- [ ] README files updated with links
- [ ] All docs in backend repository

### Video & Submission
- [ ] Demo video recorded (under 3 minutes)
- [ ] Video uploaded and accessible
- [ ] Video link in README
- [ ] Backend trace corresponds to video
- [ ] Both repos committed and pushed
- [ ] Commit hashes obtained
- [ ] Google form submitted
- [ ] Survey completed (within 24 hours)

---

## Helpful Commands

### Check Deployment Status
```bash
# Using curl to test backend
curl -X POST https://your-backend.onrender.com/api/RoomTemplate/findTemplates \
  -H "Content-Type: application/json" \
  -d '{}'
```

### View Recent Commits
```bash
git log --oneline -5
```

### Get Current Commit Hash
```bash
git rev-parse HEAD
```

### Force Redeploy on Render
- Dashboard → Service → "Manual Deploy" → "Deploy latest commit"

### View Environment Variables
- Dashboard → Service → "Environment" tab

---

## Support Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Course Staff:** Office hours or Piazza
- **Debugging:** Check Render logs first, then browser console

---

## Success! 🎉

Once all checkboxes are complete, you've successfully deployed your app and completed Assignment 4c!

**Your deployed app is now live and accessible to anyone on the internet.**

**Remember to:**
- Keep your Render account active
- Don't delete your repositories
- Save all commit hashes
- Keep a local backup of your code

Good luck with your submission!

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025

