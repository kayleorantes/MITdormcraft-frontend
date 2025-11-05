# Backend Migration Guide - Authentication Syncs Update

## Overview
This guide documents the frontend updates made to work with the new authentication sync-based backend API.

## What Changed

### 1. API Endpoint Paths
All API paths have been updated to use **capitalized concept names** (PascalCase) instead of lowercase kebab-case:

#### Before:
- `/api/authentication/registerAndCreateAccount`
- `/api/design-post/createPost`
- `/api/engagement/toggleUpvote`
- `/api/room-template/addTemplate`
- `/api/user/getUser`

#### After:
- `/api/Authentication/registerAndCreateAccount`
- `/api/DesignPost/createPost`
- `/api/Engagement/toggleUpvote`
- `/api/RoomTemplate/addTemplate`
- `/api/UserAccount/getUser`

### 2. HTTP Method Changes
**All endpoints now use POST requests** with JSON request bodies (as per the Concept Engine specification).

#### Previously GET requests (now POST):
- `getPost` - Now: `POST /api/DesignPost/getPost` with `{ postID }`
- `findPostsByTemplate` - Now: `POST /api/DesignPost/findPostsByTemplate` with `{ templateID }`
- `findPostsByAuthor` - Now: `POST /api/DesignPost/findPostsByAuthor` with `{ authorID }`
- `getEngagementForPost` - Now: `POST /api/Engagement/getEngagementForPost` with `{ postID }`
- `getTemplate` - Now: `POST /api/RoomTemplate/getTemplate` with `{ templateID }`
- `findTemplate` - Now: `POST /api/RoomTemplate/findTemplate` with optional filters
- `getUser` - Now: `POST /api/UserAccount/getUser` with `{ userID }`
- `getUserByUsername` - Now: `POST /api/UserAccount/getUserByUsername` with `{ username }`

### 3. Authentication Headers
The frontend now automatically includes authentication information in all requests:

```typescript
// Request interceptor adds X-User-ID header
config.headers['X-User-ID'] = userID
```

The `userID` from localStorage is automatically injected into all API requests.

### 4. Error Handling
Added automatic handling for authentication failures:

- **401 Unauthorized** or **403 Forbidden** responses trigger:
  - Automatic logout (clears localStorage)
  - Redirect to login page
  - User session cleanup

### 5. Environment Configuration
The backend URL is now configurable via environment variables:

#### Setup Instructions:
1. Create a `.env` file in the project root:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

2. For deployed backend (e.g., Render):
```bash
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

3. The app defaults to `http://localhost:8000` if not specified.

## Code Changes Summary

### Updated Files:
- `src/services/api.ts` - Complete API service rewrite
  - Added axios interceptors for authentication
  - Updated all endpoint paths
  - Converted GET to POST requests
  - Added environment variable support

### API Service Structure:
```typescript
// Authentication automatically added to all requests
api.interceptors.request.use((config) => {
  const userID = localStorage.getItem('userID')
  if (userID) {
    config.headers['X-User-ID'] = userID
  }
  return config
})

// Automatic logout on auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data and redirect to login
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Testing with Backend

### Verify Request Format:
Watch your backend console logs to confirm:
1. Requests are hitting the correct `/api/ConceptName/actionName` endpoints
2. Authentication headers (`X-User-ID`) are being received
3. Request bodies contain the expected JSON data
4. No more GET requests with query parameters

### Expected Request Format Example:
```http
POST /api/DesignPost/createPost HTTP/1.1
Host: localhost:8000
Content-Type: application/json
X-User-ID: 507f1f77bcf86cd799439011

{
  "authorID": "507f1f77bcf86cd799439011",
  "templateID": "507f1f77bcf86cd799439012",
  "title": "My Cozy Dorm Room",
  "description": "A minimalist approach to dorm living",
  "imageURL": "https://example.com/image.jpg"
}
```

## Deployment Checklist

### Local Development:
- [x] Backend running on `http://localhost:8000`
- [x] Frontend `.env` configured
- [x] All API calls using POST method
- [x] Authentication headers included

### Production Deployment:
- [ ] Update `.env` with production backend URL
- [ ] Test registration and login flow
- [ ] Verify authentication persistence
- [ ] Test authenticated actions (create post, like, comment)
- [ ] Confirm expired session handling
- [ ] Validate all API endpoints

## Common Issues & Solutions

### Issue: 404 Not Found
**Cause:** Backend endpoint paths don't match frontend
**Solution:** Verify backend uses capitalized concept names (`/api/Authentication/...`)

### Issue: 401 Unauthorized
**Cause:** Authentication token not included or expired
**Solution:** 
- Check localStorage has `userID`
- Verify interceptor is adding `X-User-ID` header
- Confirm backend is validating auth correctly

### Issue: CORS Errors
**Cause:** Backend not configured for frontend origin
**Solution:** Add CORS headers on backend for your frontend URL

### Issue: Request body empty
**Cause:** GET requests instead of POST
**Solution:** All requests should use POST with JSON body

## Migration Benefits

1. **Standardized API Format** - All endpoints follow Concept Engine specification
2. **Automatic Authentication** - No manual token management needed
3. **Better Error Handling** - Automatic logout and redirect on auth failures
4. **Environment Flexibility** - Easy switching between local/dev/prod backends
5. **Type Safety** - TypeScript types ensure correct request/response formats

## Next Steps

1. Test all user flows:
   - Registration → Login → Browse → Like/Comment → Create Post
2. Verify backend console shows correct `Requesting.request` actions
3. Test authentication expiration handling
4. Deploy and test on production backend
5. Monitor for any API mismatches

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify network requests in DevTools (check headers, body, response)
3. Compare backend logs with frontend requests
4. Ensure backend and frontend are in sync on API contract

---

**Last Updated:** November 4, 2025  
**Frontend Version:** Post Authentication-Syncs Migration  
**Backend Repo:** https://github.com/kayleorantes/MITdormcraft

