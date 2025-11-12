# Assignment 4c: Design Document

## MITDormCraft

**Author:** Kayle Orantes  
**Date:** November 11, 2025  
**Backend Repository:** https://github.com/kayleorantes/MITdormcraft  
**Frontend Repository:** https://github.com/kayleorantes/MITdormcraft-frontend  
**Deployed Frontend:** https://mit-dormcraft.onrender.com  
**Deployed Backend:** https://mit-dormcraft-backend.onrender.com

---

## Executive Summary

MITDormCraft is a social platform where MIT students share and discover dorm room design inspiration. This document summarizes how the final implementation evolved from the initial concept design (Assignment 2) and visual design (Assignment 4b), with emphasis on backend synchronizations added in Assignment 4c.

---

## 1. Evolution from Initial Concept Design (Assignment 2)

### Key Architectural Changes

**Assignment 2 Approach:**
- Concepts operated independently
- Frontend directly called concept actions
- No authentication enforcement on backend
- Security relied on frontend validation

**Assignment 4c Final Design:**
- Added **Requesting** concept as middleware layer
- Implemented backend **synchronizations** to coordinate concepts
- **Session** concept manages authentication state
- Security enforced server-side through syncs

### Major Concept Refinements

#### Session Management (New in 4c)
- **Purpose:** Track authenticated user sessions
- **Actions:** `createSession(userID)`, `deleteSession(token)`, `verifySession(token)`
- **Integration:** Used by authentication sync to validate all protected routes
- **Storage:** userID acts as session token, stored in localStorage on frontend

#### Authentication + UserAccount Sync
```
When: User registers via Authentication.registerAndCreateAccount
Then: Automatically create UserAccount with username and default bio
Result: Single API call creates both credentials and profile
```

**Benefit:** Eliminated separate "create profile" step, smoother onboarding

#### DesignPost Authorization Syncs
```
Sync: Author-only editing
When: editPost or deletePost requested
Where: post.authorID === requesting userID
Then: Allow action
Else: Return 403 Forbidden
```

**Before (A2):** Frontend checked ownership before showing edit button  
**After (4c):** Backend validates ownership on every request  
**Benefit:** Users can't bypass authorization by modifying client code

#### Engagement Anti-Abuse Syncs
- **Duplicate upvote prevention:** Backend checks if user already upvoted
- **Comment validation:** Ensures text length and author identity
- **State consistency:** Single source of truth on server

---

## 2. Changes from Visual Design (Assignment 4b)

### UI/UX Refinements

#### Enhanced Error Handling
- **4b:** Basic error messages in alerts
- **4c:** Styled error banners with specific messaging
- **Added:** Automatic redirect on 401/403 errors with user-friendly messages

#### Loading States
- **4b:** Simple "Loading..." text
- **4c:** CSS spinners, skeleton screens, disabled buttons during async operations
- **Improvement:** Better perceived performance and prevents duplicate submissions

#### Navigation Protection
- **4b:** Frontend route guards checked localStorage
- **4c:** Backend validates every action; frontend gracefully handles auth failures
- **Flow:** Axios interceptor catches 401/403 → clears auth → redirects to login

### Functionality Additions

#### Protected Routes Implementation
```javascript
// Axios request interceptor (added in 4c)
api.interceptors.request.use(config => {
  const userID = localStorage.getItem('userID');
  if (userID) {
    config.headers['X-User-ID'] = userID;
  }
  return config;
});

// Response interceptor for auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth and redirect
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### Real Session Management
- **4b:** userID stored in localStorage, never validated
- **4c:** Session concept validates userID on every protected request
- **Security:** Impossible to fake authentication without database access

---

## 3. Backend Synchronization Architecture

### The Requesting Concept

Acts as a middleware layer routing requests:

**Included Actions** (public, no auth required):
- `RoomTemplate.findTemplates` - Browse dorm templates
- `Authentication.registerAndCreateAccount` - Create new account
- `Authentication.verifyCredentials` - Login
- Public read operations

**Excluded Actions** (require authentication):
- `DesignPost.createPost`, `editPost`, `deletePost`
- `Engagement.toggleUpvote`, `addComment`, `deleteComment`
- `UserAccount.updateUserProfile`

### Critical Syncs

#### 1. Universal Authentication Sync
```
For all excluded actions:
  1. Extract X-User-ID header
  2. Call Session.verifySession(userID)
  3. If valid → execute requested action
  4. If invalid → return 401 Unauthorized
```

#### 2. Registration Sync
```
When: Authentication.registerAndCreateAccount(username, kerberos, bio, password)
Then:
  1. Create credentials in Authentication concept
  2. Automatically create UserAccount with same username
  3. Return userID
```

#### 3. Post Ownership Sync
```
When: editPost or deletePost requested
Then:
  1. Get post.authorID from database
  2. Compare with requesting userID
  3. Allow if match, else 403
```

### Security Improvements

| Aspect | Before (A2/4b) | After (4c) |
|--------|---------------|-----------|
| Authentication | Frontend only | Backend enforced |
| Authorization | Client-side checks | Server-side validation |
| Session validation | None | Every protected request |
| Data integrity | Hope for the best | Guaranteed by syncs |
| Attack surface | Anyone with browser | Need database access |

---

## 4. Deployment Architecture

### Development vs Production

**Development Environment:**
- Frontend: `localhost:5173` (Vite dev server)
- Backend: `localhost:8000` (Deno)
- Database: MongoDB local instance
- API calls: Proxied through Vite (`/api` → `http://localhost:8000/api`)

**Production Environment (Render):**
- Frontend: Static site on Render CDN
  - Environment: `VITE_API_BASE_URL=https://mit-dormcraft-backend.onrender.com/api`
- Backend: Deno web service
  - CORS: Allows `https://mit-dormcraft.onrender.com`
- Database: MongoDB Atlas (cloud)

### Key Configuration Files

**.env.development:**
```bash
VITE_API_BASE_URL=/api  # Uses Vite proxy
```

**.env.production:**
```bash
VITE_API_BASE_URL=https://mit-dormcraft-backend.onrender.com/api
```

**vite.config.ts:** Dynamic import of Vue DevTools only in development mode to avoid localStorage errors during Render builds

---

## 5. Design Decisions & Rationale

### Why Backend Syncs?

**Considered Alternatives:**
1. **Frontend validation only** → ❌ Easily bypassed
2. **Custom middleware** → ❌ More boilerplate code
3. **Backend syncs** → ✅ Declarative, secure, maintainable

**Chosen Approach Benefits:**
- Clear separation of concerns
- Single source of truth for business logic
- Easy to audit and modify
- Impossible to bypass without server compromise

### Why Session-Based Auth with userID?

**Choice:** Store userID in localStorage, validate on backend

**Rationale:**
- Simple enough for MVP
- No JWT complexity for small-scale app
- Easy to implement and debug
- Backend validates every request anyway

**Acknowledgment:** Production app would need proper token-based auth with expiration

### Why POST for All Requests?

**Decision:** All API calls use POST with JSON body

**Rationale:**
- Consistent request format
- Type-safe request/response handling
- Easier to validate and log
- Syncs treat all actions uniformly

---

## 6. Visual Design: Ocean Theme

**Color Palette:**
- Primary: `#4a8bb8` (deep ocean)
- Accent: `#1db2eb` (bright cyan)
- Highlight: `#00d4ff` (bioluminescent glow)

**Typography:**
- Headings: 'Fredoka' (friendly, rounded)
- Body: 'Kalam' (handwritten, personal)

**Design Principles:**
1. **Clarity:** Every action has immediate visual feedback
2. **Consistency:** Same patterns across all pages
3. **Delight:** Subtle glow effects and smooth transitions

---

## 7. Deployment Challenges & Solutions

### Vue DevTools localStorage Error
**Problem:** Build failed on Render with "Cannot initialize local storage" error  
**Root Cause:** Vue DevTools imported at module level, tries to access localStorage during Node.js build  
**Solution:** Dynamic import only in development mode
```typescript
plugins: [
  vue(),
  ...(mode === 'development' ? [(await import('vite-plugin-vue-devtools')).default()] : [])
]
```

### Frontend-Backend Connection
**Problem:** Frontend calling itself instead of backend on Render  
**Root Cause:** Missing production environment variable  
**Solution:** Created `.env.production` with correct backend URL

### Session Concept Integration
**Problem:** Authentication worked but sessions weren't being created/validated  
**Root Cause:** Incomplete sync between Authentication and Session concepts  
**Solution:** Added session creation on login, validation on all excluded actions

---

## 8. Key Takeaways

### What Worked Well
- Concept-based architecture made adding features straightforward
- Backend syncs provided clean separation of security concerns
- Vue.js reactivity handled real-time UI updates elegantly

### What Was Challenging
- Understanding when logic belongs in concepts vs syncs
- Debugging full-stack issues across three layers (frontend/backend/database)
- **Deployment took significantly longer than expected** (see Reflections)

### If I Could Start Over
1. Design syncs earlier in the process
2. Set up deployment environment from day one
3. Plan for production configuration from the start

---

**Last Updated:** November 11, 2025
