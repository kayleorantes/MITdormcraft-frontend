# Backend Configuration Guide

## Environment Variables

The frontend needs to know where your backend API is running. Configure this using the `VITE_API_BASE_URL` environment variable.

### Local Development

Create a `.env.local` file in the project root with:

```
VITE_API_BASE_URL=http://localhost:8000
```

This tells the frontend to connect to your backend running locally on port 8000.

### Production Deployment

For production (e.g., when deploying to Netlify, Vercel, etc.), set the environment variable to your deployed backend URL:

```
VITE_API_BASE_URL=https://mit-dormcraft.onrender.com
```

**Important**: Do NOT include `/api` at the end - the frontend automatically appends it.

## Backend API Requirements

Your frontend now expects your backend to follow this authentication flow:

### 1. Registration Flow
1. **Register Account**: `POST /api/Authentication/registerAndCreateAccount`
   - Body: `{ username, mitKerberos, bio, credential_data }`
   - Returns: `{ userID }`
2. **Create Session**: `POST /api/Session/createSession`
   - Body: `{ userID }`
   - Returns: `{ token }`

### 2. Login Flow
1. **Verify Credentials**: `POST /api/Authentication/verifyCredentials`
   - Body: `{ mitKerberos, credential_data }`
   - Returns: `{ userID }`
2. **Create Session**: `POST /api/Session/createSession`
   - Body: `{ userID }`
   - Returns: `{ token }`

### 3. Authenticated Requests (Excluded Actions)

All write operations require the session token in the request body:

- `POST /api/DesignPost/createPost` - Body: `{ token, authorID, templateID, title, description, imageURL }`
- `POST /api/DesignPost/editPost` - Body: `{ token, postID, userID, title, description, imageURL }`
- `POST /api/DesignPost/deletePost` - Body: `{ token, postID, userID }`
- `POST /api/Engagement/toggleUpvote` - Body: `{ token, postID, userID }`
- `POST /api/Engagement/addComment` - Body: `{ token, postID, authorID, text }`
- `POST /api/Engagement/editComment` - Body: `{ token, postID, commentID, userID, newText }`
- `POST /api/Engagement/deleteComment` - Body: `{ token, postID, commentID, userID }`
- `POST /api/RoomTemplate/addTemplate` - Body: `{ token, dormName, roomType }`
- `POST /api/RoomTemplate/updateTemplate` - Body: `{ token, templateID, dormName, roomType }`
- `POST /api/RoomTemplate/deleteTemplate` - Body: `{ token, templateID }`
- `POST /api/UserAccount/updateUserProfile` - Body: `{ token, userID, bio }`

### 4. Public Read Operations (Included Actions)

These endpoints do NOT require authentication:

- `POST /api/RoomTemplate/getTemplate` - Body: `{ templateID }`
- `POST /api/RoomTemplate/findTemplates` - Body: `{}` or `{ dormName?, roomType? }`
- `POST /api/DesignPost/getPost` - Body: `{ postID }`
- `POST /api/DesignPost/findPostsByTemplate` - Body: `{ templateID }`
- `POST /api/DesignPost/findPostsByAuthor` - Body: `{ authorID }`
- `POST /api/Engagement/getEngagementForPost` - Body: `{ postID }`
- `POST /api/UserAccount/getUser` - Body: `{ userID }`
- `POST /api/UserAccount/getUserByUsername` - Body: `{ username }`

## Testing the Connection

### 1. Start Your Backend
```bash
cd /path/to/MITdormcraft
deno task start
```

Your backend should be running on `http://localhost:8000`

### 2. Start Your Frontend
```bash
cd /path/to/MITdormcraft-frontend
npm run dev
```

Your frontend should be running on `http://localhost:5173`

### 3. Test the Flow

1. **Register a new account** at http://localhost:5173/register
   - The frontend will call `/api/Authentication/registerAndCreateAccount`
   - Then automatically call `/api/Session/createSession`
   - Store the session token in localStorage

2. **Create a post** at http://localhost:5173/create-post
   - Select dorm, room type, title, and upload an image
   - The frontend will:
     - Call `/api/RoomTemplate/addTemplate` (if needed) with token
     - Call `/api/DesignPost/createPost` with token
     - Redirect to `/dorms` to view the new post

3. **View posts** at http://localhost:5173/dorms
   - The frontend will:
     - Call `/api/RoomTemplate/findTemplates` (no token)
     - Call `/api/DesignPost/findPostsByTemplate` (no token)
     - Call `/api/Engagement/getEngagementForPost` for each post (no token)

## Troubleshooting

### "Request timed out" errors
- **Cause**: Backend not running or wrong URL
- **Fix**: Ensure backend is running on the correct port and `VITE_API_BASE_URL` is set correctly

### "Not authenticated" errors
- **Cause**: Session token missing or invalid
- **Fix**: Log out and log back in to get a fresh session token

### "dormName.localeCompare is not a function"
- **Cause**: Backend returning templates with null/undefined dormName
- **Fix**: Ensure backend templates have valid `dormName` and `roomType` strings

### CORS errors (in development)
- **Cause**: Backend not allowing requests from frontend origin
- **Fix**: Configure CORS in your backend to allow `http://localhost:5173`

## Current Status

✅ Frontend configured for session-based authentication  
✅ All API calls updated to use POST with JSON bodies  
✅ Token automatically included in authenticated requests  
✅ Token stored in localStorage for persistence  
✅ Auto-redirect to login on 401/403 errors  
✅ Template data validation to prevent sorting errors  
✅ Build succeeds without errors  

Ready to connect to your deployed backend at: **https://mit-dormcraft.onrender.com**

