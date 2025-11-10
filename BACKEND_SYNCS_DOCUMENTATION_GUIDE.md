# Backend Synchronizations Documentation Guide

## Purpose

This guide helps you document which actions are **included** (passed through directly) vs. **excluded** (require syncs) in your backend, and helps you verify that your syncs are working correctly.

---

## Part 1: Understanding Included vs. Excluded Actions

### What are Included Actions?

**Included actions** are passed directly through to the concept without any sync processing. These are typically:
- Public endpoints that don't need authentication
- Read-only operations on public data
- Registration endpoints (since user doesn't have session yet)

**Example:**
```
User visits /api/RoomTemplate/findTemplates
→ Backend directly calls RoomTemplate.findTemplates()
→ Returns list of templates
→ No authentication or syncs required
```

### What are Excluded Actions?

**Excluded actions** are turned into `Requesting.request` actions that must be handled by syncs. These are typically:
- Any action that modifies data
- Actions that need authentication
- Actions that need authorization (checking ownership)
- Actions that coordinate multiple concepts

**Example:**
```
User calls /api/DesignPost/createPost
→ Backend creates Requesting.request("DesignPost/createPost", params)
→ Sync checks authentication (userID valid?)
→ Sync calls DesignPost.createPost()
→ Sync might call Engagement.createEngagementForPost()
→ Returns result
```

---

## Part 2: Documenting Your Actions

### Step 1: Run Your Backend

```bash
cd /path/to/MITdormcraft-backend
deno run build
deno run start
```

### Step 2: Review Console Output

When you start your backend, you should see output like:
```
🚀 Starting Concept Engine...
📋 Routes registered:

✅ INCLUDED (direct pass-through):
   - /api/Authentication/registerAndCreateAccount
   - /api/RoomTemplate/findTemplates
   - /api/RoomTemplate/getTemplate

❌ EXCLUDED (requires sync):
   - /api/Authentication/verifyCredentials
   - /api/DesignPost/createPost
   - /api/DesignPost/editPost
   - /api/DesignPost/deletePost
   - /api/Engagement/toggleUpvote
   - /api/Engagement/addComment
   - /api/UserAccount/updateUserProfile
   
⚠️  UNVERIFIED (not explicitly included or excluded):
   - /api/DesignPost/getPost
   - /api/DesignPost/findPostsByTemplate
```

### Step 3: Make Decisions About Unverified Routes

For each unverified route, decide:
- Does this action need authentication? → **Exclude it**
- Does this action modify data? → **Exclude it**
- Is this public read-only data? → **Include it**

### Step 4: Document Your Decisions

**Create a file in your backend repo: `ACTIONS_DOCUMENTATION.md`**

```markdown
# Backend Actions: Included vs. Excluded

## Design Philosophy

- **Include:** Public, read-only operations
- **Exclude:** Authenticated operations, data modifications

---

## Included Actions (Direct Pass-Through)

### Authentication Concept

#### `registerAndCreateAccount`
- **Why included:** User doesn't have session yet
- **Public:** Yes
- **Note:** Still creates user via sync after registration

### RoomTemplate Concept

#### `findTemplates`
- **Why included:** Browsing templates is public
- **Public:** Yes
- **Note:** All students can see all room layouts

#### `getTemplate`
- **Why included:** Viewing single template is public
- **Public:** Yes

### DesignPost Concept

#### `getPost`
- **Why included:** Viewing posts is public
- **Public:** Yes

#### `findPostsByTemplate`
- **Why included:** Browsing posts is public
- **Public:** Yes

#### `findPostsByAuthor`
- **Why included:** User profiles are public
- **Public:** Yes

### Engagement Concept

#### `getEngagementForPost`
- **Why included:** View counts and comments are public
- **Public:** Yes

### UserAccount Concept

#### `getUser`
- **Why included:** User profiles are public
- **Public:** Yes

#### `getUserByUsername`
- **Why included:** User profiles are public
- **Public:** Yes

---

## Excluded Actions (Require Syncs)

### Authentication Concept

#### `verifyCredentials`
- **Why excluded:** Needs sync to establish session
- **Requires auth:** No (but establishes it)
- **Syncs used:** LoginSync, SessionSync
- **Security:** Validates password, creates session

### DesignPost Concept

#### `createPost`
- **Why excluded:** Requires authentication
- **Requires auth:** Yes
- **Syncs used:** AuthSync, CreatePostSync
- **Security:** Must have valid userID

#### `editPost`
- **Why excluded:** Requires authentication + authorization
- **Requires auth:** Yes
- **Requires ownership:** Yes
- **Syncs used:** AuthSync, OwnershipSync
- **Security:** Only author can edit

#### `deletePost`
- **Why excluded:** Requires authentication + authorization
- **Requires auth:** Yes
- **Requires ownership:** Yes
- **Syncs used:** AuthSync, OwnershipSync, CleanupSync
- **Security:** Only author can delete
- **Note:** Also deletes associated engagement data

### Engagement Concept

#### `toggleUpvote`
- **Why excluded:** Requires authentication
- **Requires auth:** Yes
- **Syncs used:** AuthSync, UpvoteSync
- **Security:** Must have valid userID
- **Note:** Prevents duplicate upvotes from same user

#### `addComment`
- **Why excluded:** Requires authentication
- **Requires auth:** Yes
- **Syncs used:** AuthSync, CommentSync
- **Security:** Must have valid userID

#### `deleteComment`
- **Why excluded:** Requires authentication + authorization
- **Requires auth:** Yes
- **Requires ownership:** Yes
- **Syncs used:** AuthSync, CommentOwnershipSync
- **Security:** Only commenter can delete their comment

#### `editComment`
- **Why excluded:** Requires authentication + authorization
- **Requires auth:** Yes
- **Requires ownership:** Yes
- **Syncs used:** AuthSync, CommentOwnershipSync
- **Security:** Only commenter can edit their comment

### RoomTemplate Concept

#### `addTemplate`
- **Why excluded:** Requires admin authentication
- **Requires auth:** Yes
- **Requires admin:** Yes (if implemented)
- **Syncs used:** AuthSync, AdminSync
- **Security:** Only admins can add room templates

#### `updateTemplate`
- **Why excluded:** Requires admin authentication
- **Requires auth:** Yes
- **Requires admin:** Yes (if implemented)
- **Syncs used:** AuthSync, AdminSync
- **Security:** Only admins can modify templates

#### `deleteTemplate`
- **Why excluded:** Requires admin authentication
- **Requires auth:** Yes
- **Requires admin:** Yes (if implemented)
- **Syncs used:** AuthSync, AdminSync, CleanupSync
- **Security:** Only admins can remove templates
- **Note:** May need to handle posts using this template

### UserAccount Concept

#### `updateUserProfile`
- **Why excluded:** Requires authentication + ownership
- **Requires auth:** Yes
- **Requires ownership:** Yes
- **Syncs used:** AuthSync, ProfileOwnershipSync
- **Security:** Users can only edit their own profile

---

## Summary Statistics

- **Total Actions:** [count]
- **Included (Public):** [count]
- **Excluded (Authenticated):** [count]
- **Excluded (Authorization):** [count]

---

## Security Model

### Authentication Flow
1. User provides credentials
2. Backend verifies via `Authentication.verifyCredentials` (excluded)
3. Sync validates password
4. Sync creates/returns userID (session token)
5. Frontend stores userID in localStorage
6. Frontend includes userID in `X-User-ID` header on subsequent requests
7. Backend syncs validate userID before executing excluded actions

### Authorization Levels
1. **Public:** Anyone can access (included actions)
2. **Authenticated:** Must have valid userID (excluded with AuthSync)
3. **Ownership:** Must own the resource (excluded with OwnershipSync)
4. **Admin:** Must be administrator (excluded with AdminSync) [if implemented]

---
```

---

## Part 3: Verify Your Syncs Are Working

### Test 1: Public Endpoints (Should Work Without Auth)

```bash
# Test finding templates (included - should work)
curl -X POST http://localhost:8000/api/RoomTemplate/findTemplates \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: Returns list of templates
# Backend log: Direct call to RoomTemplate.findTemplates (no sync)
```

### Test 2: Protected Endpoints Without Auth (Should Fail)

```bash
# Test creating post without auth (excluded - should fail)
curl -X POST http://localhost:8000/api/DesignPost/createPost \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "templateID": "123", "imageURL": "http://..."}'

# Expected: 401 Unauthorized
# Backend log: Requesting.request, then Auth sync failed
```

### Test 3: Protected Endpoints With Auth (Should Work)

```bash
# First register
curl -X POST http://localhost:8000/api/Authentication/registerAndCreateAccount \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "mitKerberos": "test@mit.edu", ...}'

# Get userID from response

# Then create post with auth
curl -X POST http://localhost:8000/api/DesignPost/createPost \
  -H "Content-Type: application/json" \
  -H "X-User-ID: <userID from above>" \
  -d '{"title": "Test", "templateID": "123", "imageURL": "http://..."}'

# Expected: Success, post created
# Backend log: Requesting.request, Auth sync validated, action executed
```

### Test 4: Authorization (Ownership)

```bash
# Try to edit someone else's post
curl -X POST http://localhost:8000/api/DesignPost/editPost \
  -H "Content-Type: application/json" \
  -H "X-User-ID: <your userID>" \
  -d '{"postID": "<someone else's postID>", "title": "Hacked!"}'

# Expected: 403 Forbidden
# Backend log: Auth sync passed, Ownership sync failed
```

### Test 5: End-to-End Frontend Test

1. **Open frontend in browser**
2. **Open browser console (DevTools)**
3. **Open Network tab**
4. **Perform actions:**
   - Register account
   - Login
   - Browse templates (should work, included action)
   - Like a post (should work with auth, excluded action)
   - Create a post (should work with auth, excluded action)
   - Try to edit someone else's post (should fail)

5. **In Backend Console, verify:**
```
Requesting.request: Authentication.registerAndCreateAccount
→ Sync: CreateAccountSync
→ Result: userID created

Requesting.request: RoomTemplate.findTemplates
→ No sync (included action)
→ Result: templates returned

Requesting.request: Engagement.toggleUpvote
→ Sync: AuthSync validated (userID: abc123)
→ Sync: UpvoteSync
→ Result: upvoted

Requesting.request: DesignPost.createPost
→ Sync: AuthSync validated (userID: abc123)
→ Sync: CreatePostSync
→ Result: post created
```

---

## Part 4: Common Sync Patterns

### Pattern 1: Simple Authentication Sync

```typescript
// Sync: Require authentication for action
when Requesting.request(path, params)
where path is "Concept/action" AND params.userID exists
then {
  // Validate userID is real session
  if (Authentication.validateSession(params.userID)) {
    // Execute the action
    Concept.action(params)
  } else {
    // Return 401
    throw new Error("Unauthorized")
  }
}
```

### Pattern 2: Authentication + Authorization Sync

```typescript
// Sync: Require ownership for edit
when Requesting.request(path, params)
where path is "DesignPost/editPost"
then {
  // First check auth
  if (!Authentication.validateSession(params.userID)) {
    throw new Error("Unauthorized")
  }
  
  // Then check ownership
  const post = DesignPost.getPost(params.postID)
  if (post.authorID !== params.userID) {
    throw new Error("Forbidden: Not post owner")
  }
  
  // Proceed with edit
  DesignPost.editPost(params)
}
```

### Pattern 3: Registration Sync (No Auth Needed)

```typescript
// Sync: Auto-create user account when registering credentials
when Authentication.registerCredentials(username, password)
then {
  // Create the credentials
  const credentialID = Authentication.registerCredentials(username, password)
  
  // Also create user account
  const userID = UserAccount.createUser(username, defaultBio)
  
  // Link them
  return { credentialID, userID }
}
```

### Pattern 4: Cascade Delete Sync

```typescript
// Sync: Clean up engagement when post is deleted
when DesignPost.deletePost(postID)
then {
  // First check auth & ownership (omitted for brevity)
  
  // Delete the post
  DesignPost.deletePost(postID)
  
  // Also delete associated engagement
  Engagement.deleteEngagementForPost(postID)
  
  return { success: true }
}
```

---

## Part 5: Updating Your Design Document

Once you've documented and verified your syncs, update your `DESIGN_DOCUMENT_4C.md`:

1. **List all included actions** with rationale
2. **List all excluded actions** with rationale
3. **Describe key syncs** with purpose and security benefit
4. **Include trace examples** showing syncs in action
5. **Explain security model** (public, authenticated, authorized)

---

## Checklist

- [ ] Backend starts without warnings about unverified routes
- [ ] All actions are explicitly included or excluded
- [ ] Public endpoints work without authentication
- [ ] Protected endpoints reject requests without auth (401)
- [ ] Ownership checks prevent unauthorized edits (403)
- [ ] Backend logs show `Requesting.request` for excluded actions
- [ ] Backend logs show sync validation messages
- [ ] Frontend automatically includes auth headers
- [ ] Frontend handles 401/403 by redirecting to login
- [ ] `ACTIONS_DOCUMENTATION.md` created in backend repo
- [ ] Design document updated with sync information

---

## Example Backend Log (What Good Looks Like)

```
🚀 Server started on port 8000

📋 Routes registered:
   ✅ 8 included actions
   ❌ 12 excluded actions
   ⚠️  0 unverified actions

---

[15:30:45] Requesting.request: Authentication.registerAndCreateAccount
           Sync: CreateAccountSync
           Result: {userID: "user_abc123"}

[15:30:50] GET /api/RoomTemplate/findTemplates
           Direct call (included)
           Result: [5 templates]

[15:31:10] Requesting.request: Engagement.toggleUpvote
           Auth validated: user_abc123
           Sync: UpvoteSync
           Result: {upvoted: true, count: 15}

[15:31:30] Requesting.request: DesignPost.editPost
           Auth validated: user_abc123
           Ownership check: PASS (user is author)
           Sync: EditPostSync
           Result: {success: true}

[15:32:00] Requesting.request: DesignPost.deletePost
           Auth validated: user_abc123
           Ownership check: PASS (user is author)
           Sync: DeletePostSync
           Sync: CleanupEngagementSync
           Result: {success: true}
```

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025

---

**Next Steps:**
1. Review your backend console output
2. Create `ACTIONS_DOCUMENTATION.md` in your backend repo
3. Test each action type (public, authenticated, authorized)
4. Verify syncs work with frontend
5. Capture trace for video demo
6. Update design document with sync information

