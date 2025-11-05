# Testing Guide - Backend API Integration

This guide helps you verify that the frontend is correctly communicating with your new authentication sync-based backend.

## Pre-Testing Setup

### 1. Configure Environment
```bash
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

### 2. Start Backend
Make sure your backend is running on the configured URL (default: `http://localhost:8000`)

### 3. Start Frontend
```bash
npm install
npm run dev
```

## Testing Checklist

### ✅ 1. Authentication Flow

#### Register New User
1. Navigate to `/register`
2. Fill in the form:
   - Username: `testuser`
   - MIT Email: `testuser@mit.edu`
   - Bio: `Test user for API verification`
   - Password: `password123`
3. Submit the form

**Expected Behavior:**
- ✅ Request goes to `POST /api/Authentication/registerAndCreateAccount`
- ✅ Response contains `{ userID: "..." }`
- ✅ `userID` saved to localStorage
- ✅ Redirect to home page
- ✅ Navigation shows "Hello, testuser!"

**Backend Console Should Show:**
```
Requesting.request: Authentication.registerAndCreateAccount
```

#### Login
1. Navigate to `/login`
2. Enter credentials:
   - MIT Email: `testuser@mit.edu`
   - Password: `password123`
3. Submit the form

**Expected Behavior:**
- ✅ Request goes to `POST /api/Authentication/verifyCredentials`
- ✅ Response contains `{ userID: "..." }`
- ✅ `userID` saved to localStorage
- ✅ Redirect to home page

**Backend Console Should Show:**
```
Requesting.request: Authentication.verifyCredentials
```

### ✅ 2. Browse Room Templates

1. Navigate to `/dorms` (requires login)

**Expected Behavior:**
- ✅ Request goes to `POST /api/RoomTemplate/findTemplate`
- ✅ Request includes header: `X-User-ID: <userID>`
- ✅ Response is array of templates
- ✅ Templates display in grid

**Backend Console Should Show:**
```
Requesting.request: RoomTemplate.findTemplate
Auth sync validated: userID=<userID>
```

### ✅ 3. View Posts

1. Select a room template from the grid

**Expected Behavior:**
- ✅ Request goes to `POST /api/DesignPost/findPostsByTemplate`
- ✅ Request body: `{ templateID: "..." }`
- ✅ Request includes header: `X-User-ID: <userID>`
- ✅ Response is array of posts
- ✅ Posts display in feed

**Backend Console Should Show:**
```
Requesting.request: DesignPost.findPostsByTemplate
Auth sync validated: userID=<userID>
```

### ✅ 4. Engagement (Like & Comment)

#### Like a Post
1. Click the heart icon on any post

**Expected Behavior:**
- ✅ Request goes to `POST /api/Engagement/toggleUpvote`
- ✅ Request body: `{ postID: "...", userID: "..." }`
- ✅ Request includes header: `X-User-ID: <userID>`
- ✅ Response: `{ upvoted: true/false, total: number }`
- ✅ UI updates immediately

**Backend Console Should Show:**
```
Requesting.request: Engagement.toggleUpvote
Auth sync validated: userID=<userID>
```

#### Add Comment
1. Type a comment in the input field
2. Press Enter

**Expected Behavior:**
- ✅ Request goes to `POST /api/Engagement/addComment`
- ✅ Request body: `{ postID: "...", authorID: "...", text: "..." }`
- ✅ Request includes header: `X-User-ID: <userID>`
- ✅ Response contains new comment object
- ✅ Comment appears in feed

**Backend Console Should Show:**
```
Requesting.request: Engagement.addComment
Auth sync validated: userID=<userID>
```

### ✅ 5. Create Post

1. Navigate to `/create-post` (requires login)
2. Fill in the form:
   - Select a template
   - Title: `Test Post`
   - Description: `Testing API integration`
   - Image URL: `https://example.com/image.jpg`
3. Submit

**Expected Behavior:**
- ✅ Request goes to `POST /api/DesignPost/createPost`
- ✅ Request includes header: `X-User-ID: <userID>`
- ✅ Response: `{ postID: "..." }`
- ✅ Redirect to feed or success message

**Backend Console Should Show:**
```
Requesting.request: DesignPost.createPost
Auth sync validated: userID=<userID>
```

### ✅ 6. User Profile

1. Navigate to `/profile`

**Expected Behavior:**
- ✅ Request goes to `POST /api/UserAccount/getUser`
- ✅ Request body: `{ userID: "..." }`
- ✅ Request includes header: `X-User-ID: <userID>`
- ✅ Response contains user profile data
- ✅ Profile displays correctly

**Backend Console Should Show:**
```
Requesting.request: UserAccount.getUser
Auth sync validated: userID=<userID>
```

### ✅ 7. Authentication Failure Handling

1. Open browser DevTools → Application → Local Storage
2. Delete the `userID` entry
3. Try to like a post or perform any authenticated action

**Expected Behavior:**
- ✅ Backend returns 401 or 403
- ✅ Frontend automatically clears localStorage
- ✅ Redirect to `/login`
- ✅ User must re-authenticate

## Browser DevTools Verification

### Network Tab Checklist

For each request, verify:
1. **Request URL:** Uses capitalized concept names (e.g., `/api/DesignPost/createPost`)
2. **Request Method:** POST (not GET)
3. **Request Headers:** Contains `X-User-ID: <userID>`
4. **Request Body:** Valid JSON with expected parameters
5. **Response Status:** 200 OK (or appropriate status)
6. **Response Body:** Matches API specification

### Console Checks

No errors should appear for:
- CORS issues
- 404 Not Found errors
- Authentication failures (unless intentionally triggered)
- Request format errors

## Common Issues & Debugging

### Issue: "CORS Error"
**Solution:**
- Verify backend has CORS enabled for your frontend URL
- Check backend is running and accessible
- Confirm `VITE_API_BASE_URL` is correct

### Issue: "401 Unauthorized on all requests"
**Check:**
- `userID` exists in localStorage
- `X-User-ID` header is being sent
- Backend authentication sync is working

### Issue: "404 Not Found"
**Check:**
- Backend uses capitalized concept names
- Frontend paths match backend exactly
- Backend routes are registered correctly

### Issue: "Request body is empty"
**Check:**
- All requests are POST (not GET)
- JSON body is included in request
- Content-Type header is `application/json`

## Backend Logs Verification

Your backend should log each request showing:
```
Requesting.request: <ConceptName>.<actionName>
Auth sync: Validating userID=<userID>
Auth sync: Validation passed
```

If you don't see these logs, the sync mechanism may not be configured correctly on the backend.

## Success Criteria

✅ All API requests use correct endpoint paths  
✅ All requests include authentication headers  
✅ Backend logs show `Requesting.request` actions  
✅ Backend validates auth syncs successfully  
✅ No CORS or 404 errors  
✅ User flow works end-to-end: Register → Login → Browse → Interact → Create  
✅ Authentication failure triggers logout and redirect  

## Performance Testing

Test these scenarios:
1. **Multiple rapid requests** (e.g., clicking like/unlike quickly)
2. **Concurrent actions** (like and comment at same time)
3. **Long sessions** (leave logged in, come back later)
4. **Network interruption** (disconnect/reconnect)

## Deployment Testing

After deploying to production:

1. Update `.env` with production backend URL
2. Rebuild and deploy frontend
3. Repeat all tests above
4. Monitor for production-specific issues:
   - HTTPS/SSL issues
   - CORS with production domains
   - API latency
   - Authentication persistence

## Reporting Issues

If you find issues, provide:
1. **Frontend request** (from Network tab)
   - URL, method, headers, body
2. **Backend response** (from Network tab)
   - Status code, headers, body
3. **Backend logs** (from backend console)
4. **Browser console errors** (if any)
5. **Steps to reproduce**

---

**Happy Testing! 🎉**

If all tests pass, your frontend is successfully integrated with the authentication sync-based backend!

