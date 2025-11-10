# Assignment 4c: Design Document

## Project: MITDormCraft
**Date:** November 10, 2025  
**Backend Repository:** https://github.com/kayleorantes/MITdormcraft  
**Frontend Repository:** https://github.com/korantes/MITdormcraft-frontend  
**Deployed App URL:** [To be filled in after deployment]

---

## Executive Summary

MITDormCraft is a social platform where MIT students can share and discover dorm room design inspiration. This document summarizes the evolution of the design from initial concept specifications (Assignment 2) through visual design (Assignment 4b) to the final implementation with backend synchronizations (Assignment 4c).

---

## 1. Changes from Initial Concept Design (Assignment 2)

### 1.1 Concept Specifications Evolution

#### Authentication Concept
**Initial Design (A2):**
- Basic credential verification
- No session management
- Actions: `registerCredentials`, `verifyCredentials`

**Final Design (A4c):**
- Integrated with UserAccount concept through syncs
- Session-based authentication using userID as token
- Backend syncs enforce authentication on protected routes
- Actions excluded from direct frontend access: [List which actions]
- Frontend now sends `X-User-ID` header on all authenticated requests

**Rationale:** Moving authentication checks to backend syncs ensures security - frontend code can no longer bypass authentication by skipping API calls.

#### DesignPost Concept
**Changes:**
- [Document any changes to post creation, editing, deletion]
- [Note any new validation or authorization requirements]
- [Explain how syncs now enforce author-only edits/deletes]

**Example:**
```
Before: Frontend checked if currentUserID === post.authorID before showing edit button
After: Backend sync validates user ownership before allowing editPost action
Benefit: Users can't bypass authorization by making direct API calls
```

#### Engagement Concept
**Changes:**
- [Document changes to upvoting, commenting]
- [Note any duplicate prevention mechanisms]
- [Explain sync-based validation]

#### RoomTemplate Concept
**Changes:**
- [Document any template management changes]
- [Note admin/moderation features if added]

#### UserAccount Concept
**Changes:**
- [Document profile updates, image uploads]
- [Note privacy/access control features]

### 1.2 New Syncs Introduced

#### Authentication Syncs
```
Sync: requireAuth(action)
When: Any excluded action is requested
Where: Authentication.verifySession(userID) succeeds
Then: Execute the requested action
Else: Return 401 Unauthorized

Purpose: Centralized authentication check for all protected routes
Actions using this sync: [List all excluded actions that require auth]
```

#### Authorization Syncs
```
Sync: authorOnlyEdit(postID, userID)
When: DesignPost.editPost requested
Where: post.authorID === userID
Then: Allow edit
Else: Return 403 Forbidden

Purpose: Ensure users can only edit their own posts
```

[Add more syncs as implemented]

### 1.3 API Changes

**Endpoint Format Changes:**
- Before: Various HTTP methods (GET, POST, PUT, DELETE)
- After: All POST requests with JSON bodies
- Before: `/api/design-post/getPost?postID=123`
- After: `/api/DesignPost/getPost` with body `{postID: "123"}`

**Authentication Header:**
- All requests now include `X-User-ID` header
- Automatic injection via Axios interceptor
- Backend validates on excluded actions

---

## 2. Changes from Visual Design (Assignment 4b)

### 2.1 UI/UX Refinements

#### Ocean Theme Enhancements
**4b State:**
- Basic ocean color palette implemented
- Gradient backgrounds on main components

**4c Final:**
- [Document any additional polish added]
- [Note improvements to loading states, error messages]
- [Describe enhanced transitions or animations]

#### Navigation Improvements
- [Document any navigation changes]
- [Note improved routing or breadcrumbs]

#### Form Validation
- [Document client-side vs server-side validation improvements]
- [Note enhanced error messaging]

### 2.2 Functionality Additions

#### Protected Routes
**Before (4b):**
- Frontend-only route guards
- Users could bypass by manipulating localStorage

**After (4c):**
- Backend enforces authentication on all excluded actions
- Frontend automatically redirects on 401/403 errors
- Secure session management

#### User Experience
- [Document improvements to post creation flow]
- [Note enhancements to commenting/liking interactions]
- [Describe profile management improvements]

---

## 3. Backend Synchronization Architecture

### 3.1 Requesting Concept

The new `Requesting` concept acts as a middleware layer:
- **Included Actions:** Passed directly to concepts (e.g., public data fetching)
- **Excluded Actions:** Converted to request actions for sync processing

**Included Routes (Public):**
```
[List routes that don't require authentication]
Example:
- /api/RoomTemplate/findTemplates (browsing templates)
- /api/Authentication/registerAndCreateAccount (registration)
```

**Excluded Routes (Authenticated):**
```
[List all excluded routes]
Example:
- /api/DesignPost/createPost (requires auth)
- /api/Engagement/toggleUpvote (requires auth)
- /api/UserAccount/updateUserProfile (requires auth + ownership)
```

### 3.2 Key Syncs and Their Purpose

#### 1. Registration Sync
```
Purpose: Automatically create user account when credentials are registered
When: Authentication.registerCredentials(username, password)
Then: UserAccount.createUser(username, defaultBio, defaultImage)
Benefit: Single API call creates both auth credentials and user profile
```

#### 2. Authentication Sync
```
Purpose: Validate user session on all protected routes
When: Requesting.request(path, params) AND path is excluded
Where: X-User-ID header present AND valid session
Then: Execute requested action
Else: Return 401
Benefit: Centralized, secure authentication enforcement
```

#### 3. [Add more syncs]
```
[Document each major sync with:]
- Purpose
- When it triggers
- Conditions (Where clause)
- Actions taken (Then clause)
- Security/UX benefit
```

### 3.3 Security Improvements

**Before (Frontend Syncs):**
- ❌ Users could modify client code to bypass checks
- ❌ Authentication logic scattered across components
- ❌ No guarantee of data integrity

**After (Backend Syncs):**
- ✅ Server-side validation on all sensitive operations
- ✅ Centralized security logic
- ✅ Impossible to bypass without server access
- ✅ Clear audit trail in backend logs

---

## 4. Deployment Architecture

### 4.1 Development Environment
- **Frontend:** Vite dev server (`localhost:5173`)
- **Backend:** Deno server (`localhost:8000`)
- **Proxy:** Vite proxies `/api` requests to backend
- **Database:** MongoDB local instance

### 4.2 Production Environment (Render)
- **Frontend:** Static site on Render CDN
  - Build command: `npm install && npm run build`
  - Publish directory: `dist`
  - Environment: `VITE_API_BASE_URL=<backend-url>`
  
- **Backend:** Deno web service on Render
  - Start command: `deno run start`
  - Environment: MongoDB Atlas connection string
  - CORS configured for frontend domain

- **Database:** MongoDB Atlas (cloud)

### 4.3 Environment Configuration Strategy

**Why Multiple .env Files:**
- `.env.development`: Local dev settings (uses proxy)
- `.env.production`: Production settings (full backend URL)
- `.env.example`: Template for new developers

**Key Variables:**
```env
# Frontend
VITE_API_BASE_URL=/api (dev) or https://backend.onrender.com (prod)

# Backend
MONGODB_URI=mongodb://localhost:27017 (dev) or mongodb+srv://... (prod)
PORT=8000
```

---

## 5. Testing Strategy

### 5.1 Backend Trace Verification

**How to verify syncs are working:**
1. Start backend with `deno run start`
2. Perform actions in frontend
3. Check backend console for logs:
   ```
   Requesting.request: Authentication.registerAndCreateAccount
   Auth sync validated: userID=abc123
   Requesting.request: DesignPost.createPost
   ```

### 5.2 Authentication Flow Testing

**Test Cases:**
1. ✅ Register new account → Should auto-login
2. ✅ Login with credentials → Should receive userID
3. ✅ Make authenticated request → Should include X-User-ID header
4. ✅ Session expires → Should auto-logout and redirect
5. ✅ Try to access protected route without auth → Should return 401

### 5.3 Authorization Testing

**Test Cases:**
1. ✅ Edit own post → Should succeed
2. ❌ Edit someone else's post → Should return 403
3. ✅ Delete own post → Should succeed
4. ❌ Delete someone else's post → Should return 403

---

## 6. Known Issues and Future Improvements

### 6.1 Current Limitations
- [Document any known bugs or limitations]
- [Note features that didn't make it into final version]

### 6.2 Potential Enhancements
- **Real-time Updates:** WebSocket support for live comments/likes
- **Image Optimization:** Compress and resize uploaded images
- **Search Functionality:** Full-text search across posts
- **Moderation Tools:** Admin dashboard for content management
- **Notifications:** Alert users when posts are commented on

### 6.3 Technical Debt
- [Note any code that could be refactored]
- [Document any temporary workarounds]

---

## 7. Design Decision Rationale

### 7.1 Why Backend Syncs?

**Decision:** Move authentication and authorization to backend syncs

**Alternatives Considered:**
1. Keep authentication in frontend
   - ❌ Not secure - users can bypass
2. Custom middleware in backend
   - ❌ More code to maintain, less declarative
3. Backend syncs (chosen)
   - ✅ Declarative and clear
   - ✅ Centralized security logic
   - ✅ Easy to audit and modify

### 7.2 Why Session-Based Auth with userID?

**Decision:** Use userID as session token stored in localStorage

**Alternatives Considered:**
1. JWT tokens
   - ❌ Overkill for this app's scale
   - ❌ More complex to implement
2. Cookie-based sessions
   - ❌ More complicated with separate frontend/backend domains
3. userID as token (chosen)
   - ✅ Simple and effective for MVP
   - ✅ Easy to implement and debug
   - ⚠️ Would need upgrading for production app

### 7.3 Why POST for All Requests?

**Decision:** Standardize on POST with JSON bodies

**Rationale:**
- Consistent request format
- Request bodies easier to type-check
- Syncs treat all actions uniformly
- No mixing of query params, body params, route params

---

## 8. Visual Design Philosophy

### 8.1 Ocean/Luminara Theme

**Inspiration:** Ocean bioluminescence - mysterious yet inviting

**Color Palette:**
- Primary: `#4a8bb8` (Deep ocean blue)
- Accent: `#1db2eb` (Bright cyan)
- Highlight: `#00d4ff` (Luminous blue)
- Text: White with ocean glow effects

**Typography:**
- Headings: 'Fredoka' (friendly, rounded)
- Body: 'Kalam' (handwritten, personal)
- Code/Data: System monospace

### 8.2 User Experience Principles

1. **Clarity:** Every action has clear visual feedback
2. **Consistency:** Same patterns across all pages
3. **Accessibility:** High contrast, clear focus states
4. **Delight:** Subtle animations and glow effects

---

## 9. Lessons Learned

### 9.1 What Worked Well
- [Document successful design decisions]
- [Note effective development practices]
- [Highlight good collaboration patterns]

### 9.2 What Could Be Improved
- [Document challenges faced]
- [Note areas where more planning would have helped]
- [Identify skills that need development]

### 9.3 Surprises
- [Note unexpected challenges or discoveries]
- [Document features that were easier/harder than expected]

---

## 10. Code Links and References

### 10.1 Key Files

**Backend:**
- Concept definitions: `server/concepts/`
- Sync definitions: `server/syncs.ts`
- Requesting concept: `server/concepts/requesting.ts`

**Frontend:**
- API service: `src/services/api.ts` (lines 44-57: interceptor)
- Auth store: `src/stores/auth.ts`
- Main views: `src/views/`

### 10.2 Commit History

**Major Milestones:**
- Initial concepts: [commit hash / date]
- Visual design: [commit hash / date]
- Backend syncs: [commit hash / date]
- Deployment: [commit hash / date]

### 10.3 External Resources

- [Link to concept specifications in backend repo]
- [Link to visual design mockups]
- [Link to API documentation]

---

## Appendix: Sync Trace Example

```
[2025-11-10 15:30:45] Requesting.request: Authentication.registerAndCreateAccount
  → params: {username: "alex_mit", mitKerberos: "alex@mit.edu", ...}
  → sync: CreateAccountSync
  → result: {userID: "abc123"}

[2025-11-10 15:31:02] Requesting.request: DesignPost.createPost
  → headers: {X-User-ID: "abc123"}
  → sync: AuthSync → validated
  → sync: CreatePostSync
  → result: {postID: "xyz789"}

[2025-11-10 15:31:15] Requesting.request: Engagement.toggleUpvote
  → headers: {X-User-ID: "abc123"}
  → sync: AuthSync → validated
  → result: {upvoted: true, count: 42}
```

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Authors:** [Your name]

