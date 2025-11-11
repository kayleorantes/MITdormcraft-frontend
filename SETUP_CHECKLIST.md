# Setup Checklist for MITDormCraft

## ✅ All Issues Fixed

### Previously Reported Issues
- [x] **"a.dormName.localeCompare is not a function"** - Fixed with template validation filter
- [x] **Missing viewable dorms** - Ready to display all templates from backend
- [x] **Post creation timeout** - Fixed with 30s timeout and optimized flow
- [x] **Posts not appearing after creation** - Fixed redirect timing
- [x] **Request timed out errors** - Fixed with increased timeout

### Backend Integration Completed
- [x] Session-based authentication implemented
- [x] Token included in all authenticated requests
- [x] All API endpoints updated to POST with JSON bodies
- [x] Proper error handling for 401/403
- [x] Session validation on app load
- [x] Automatic logout and redirect on auth failure

## 🚀 Quick Start Guide

### Step 1: Configure Backend URL

Create a `.env.local` file in the project root:

**For Local Development:**
```bash
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
```

**For Production (with deployed backend):**
```bash
echo "VITE_API_BASE_URL=https://mit-dormcraft.onrender.com" > .env.local
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Step 4: Test the Application

#### 1. Register a New Account
- Navigate to http://localhost:5173/register
- Fill in:
  - Username
  - MIT Kerberos ID
  - Bio (optional)
  - Password
- Click "Register"
- Should automatically create session and log you in

#### 2. Login
- Navigate to http://localhost:5173/login
- Enter MIT Kerberos and password
- Click "Sign In"
- Should create session and redirect to home

#### 3. Browse Dorms
- Navigate to http://localhost:5173/dorms
- Should see list of room templates (dorms and room types)
- Click on different templates to filter posts
- Posts should load for each template

#### 4. Create a Post
- Navigate to http://localhost:5173/create-post
- Select dorm (e.g., "Simmons Hall")
- Select room type (e.g., "Single")
- Enter title
- Enter description (optional)
- Upload an image
- Click "Publish Post"
- Should redirect to /dorms and show your new post

#### 5. Interact with Posts
- Like a post (heart icon)
- Add a comment
- View post details

#### 6. View Profile
- Click your username in the nav bar
- View "My Posts" tab (shows your posts)
- View "Liked Posts" tab (shows posts you liked)
- Update your bio
- Upload a profile picture

## 🔍 Troubleshooting

### Issue: "Network Error" or "Request failed"
**Cause**: Backend not running or wrong URL  
**Fix**:
1. Check backend is running: `curl http://localhost:8000/` (should return response)
2. Verify `.env.local` has correct URL
3. Restart dev server after changing `.env.local`

### Issue: "Not authenticated" errors
**Cause**: Session token missing or expired  
**Fix**:
1. Open browser DevTools → Application → Local Storage
2. Check if `sessionToken` exists
3. If not, log out and log back in
4. If yes, verify backend is validating tokens correctly

### Issue: Empty dorms list
**Cause**: Backend has no room templates  
**Fix**: Create a post - the frontend will automatically create a template if needed

### Issue: Posts not showing after creation
**Cause**: Template ID mismatch or backend not returning created post  
**Fix**:
1. Check browser console for errors
2. Verify post was created (check backend logs)
3. Try refreshing the page

### Issue: CORS errors in development
**Cause**: Backend not allowing frontend origin  
**Fix**: Configure CORS in backend to allow `http://localhost:5173`

## 📋 API Endpoints Reference

### Session Flow

1. **Register**: POST `/api/Authentication/registerAndCreateAccount`
   ```json
   { "username": "alex", "mitKerberos": "alex", "bio": "Hi!", "credential_data": "password" }
   → { "userID": "abc123" }
   ```

2. **Create Session**: POST `/api/Session/createSession`
   ```json
   { "userID": "abc123" }
   → { "token": "xyz789..." }
   ```

3. **Create Post** (authenticated): POST `/api/DesignPost/createPost`
   ```json
   { 
     "token": "xyz789...",
     "authorID": "abc123",
     "templateID": "template1",
     "title": "My Room",
     "description": "Cozy setup",
     "imageURL": "data:image/jpeg;base64,..."
   }
   → { "postID": "post123" }
   ```

## 🎯 Expected Backend Behavior

Your backend should:
1. ✅ Accept all requests as POST with JSON body
2. ✅ Return session token after `createSession`
3. ✅ Validate token for all excluded actions
4. ✅ Return 401 if token is invalid/expired
5. ✅ Return proper data structures (see `src/types/api.ts`)
6. ✅ Handle CORS for frontend origin
7. ✅ Store templates with valid `dormName` and `roomType` strings

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Netlify/Vercel

1. Set environment variable: `VITE_API_BASE_URL=https://mit-dormcraft.onrender.com`
2. Build command: `npm run build`
3. Publish directory: `dist`

## ✨ Success Indicators

When everything is working correctly:
- ✅ No console errors
- ✅ Session token in localStorage
- ✅ Dorms list populates
- ✅ Posts load for each template
- ✅ Can create new posts
- ✅ Posts appear immediately after creation
- ✅ Can like and comment on posts
- ✅ Profile shows your posts and liked posts
- ✅ Logout clears session and redirects to login

## 📚 Documentation

- **[BACKEND_CONFIG.md](./BACKEND_CONFIG.md)** - Detailed backend configuration
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Technical changes summary
- **[README.md](./README.md)** - Project overview

## 🎉 You're Ready!

Your frontend is now fully integrated with your backend synchronization system. All issues have been fixed and the application is ready to test!

**Next Step**: Start your backend, configure the `.env.local`, and test the complete flow! 🚀

