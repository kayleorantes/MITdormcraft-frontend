# API Specification: Authentication Concept

**Purpose:** To manage user sign-up, login, and session identity

---

## API Endpoints

### POST /api/Authentication/registerAndCreateAccount

**Description:** Creates a new user account with credentials and returns the user ID.

**Requirements:**
- `username` must not exist in the 'users' collection
- `mitKerberos` must not exist in the 'credentials' collection

**Effects:**
- Hashes the `credential_data`
- Creates a new `User` document
- Creates a new `Credential` document linked to the new `userID`
- Returns the new `userID` as a string

**Request Body:**
```json
{
  "username": "string",
  "mitKerberos": "string",
  "bio": "string",
  "credential_data": "string"
}
```

**Success Response Body (Action):**
```json
{
  "userID": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Authentication/verifyCredentials

**Description:** Verifies user credentials and returns the user ID if valid.

**Requirements:**
- User with `mitKerberos` exists

**Effects:**
- Compares the provided `credential_data` with the stored hash. If they match, returns the `userID`. If not, returns `null`

**Request Body:**
```json
{
  "mitKerberos": "string",
  "credential_data": "string"
}
```

**Success Response Body (Action):**
```json
{
  "userID": "string | null"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---






# API Specification: Design Post Concept

**Purpose:** To store the core user-generated content: the photos and descriptions of a decorated dorm room.

---

## API Endpoints

### POST /api/DesignPost/createPost

**Description:** Creates, stores, and returns the new post ID.

**Requirements:**
- `authorID` and `templateID` must be valid IDs

**Effects:**
- Creates, stores, and returns the new `postID`

**Request Body:**
```json
{
  "authorID": "string",
  "templateID": "string",
  "title": "string",
  "description": "string",
  "imageURL": "string"
}
```

**Success Response Body (Action):**
```json
{
  "postID": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/getPost

**Description:** Returns a specific Post, or null if not found.

**Requirements:**
- None

**Effects:**
- Returns a specific Post, or null if not found

**Request Body:**
```json
{
  "postID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "post": {
    "postID": "string",
    "authorID": "string",
    "templateID": "string",
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "createdAt": "string"
  } | null
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/findPostsByTemplate

**Description:** Returns all posts for a specific room template, sorted newest first.

**Requirements:**
- None

**Effects:**
- Returns all posts for a specific room template, sorted newest first

**Request Body:**
```json
{
  "templateID": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "postID": "string",
    "authorID": "string",
    "templateID": "string",
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/findPostsByAuthor

**Description:** Returns all posts from a specific author, sorted newest first.

**Requirements:**
- None

**Effects:**
- Returns all posts from a specific author, sorted newest first

**Request Body:**
```json
{
  "authorID": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "postID": "string",
    "authorID": "string",
    "templateID": "string",
    "title": "string",
    "description": "string",
    "imageURL": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/editPost

**Description:** Updates the post's editable fields (title, description, image) and returns true on success.

**Requirements:**
- The `userID` must match the `authorID` of the post

**Effects:**
- Updates the post's editable fields (title, description, image) and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "userID": "string",
  "title": "string",
  "description": "string",
  "imageURL": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/DesignPost/deletePost

**Description:** Removes a post and returns true on success.

**Requirements:**
- The `userID` must match the `authorID` of the post

**Effects:**
- Removes a post and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "userID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---











# API Specification: Engagement Concept

**Purpose:** To manage all social interactions related to a post, namely upvotes and comments.

---

## API Endpoints

### POST /api/Engagement/getEngagementForPost

**Description:** Returns the upvotes and comments for a post. If none exists, returns an empty object.

**Requirements:**
- None

**Effects:**
- Returns the upvotes and comments for a post. If none exists, returns an empty object

**Request Body:**
```json
{
  "postID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "engagement": {
    "upvotes": ["string"],
    "comments": [
      {
        "commentID": "string",
        "authorID": "string",
        "text": "string",
        "createdAt": "string"
      }
    ]
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/toggleUpvote

**Description:** Adds a user ID to the upvotes set, or removes it if already present. Returns the user's new upvote status and the new set size.

**Requirements:**
- `postID` and `userID` must be valid

**Effects:**
- Adds a `userID` to the `upvotes` set, or removes it if already present. Returns the user's new upvote status and the new set size

**Request Body:**
```json
{
  "postID": "string",
  "userID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "upvoted": "boolean",
  "total": "number"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/addComment

**Description:** Adds a new comment to the comments list and returns the created comment object.

**Requirements:**
- `postID` and `authorID` must be valid

**Effects:**
- Adds a new comment to the `comments` list and returns the created comment object

**Request Body:**
```json
{
  "postID": "string",
  "authorID": "string",
  "text": "string"
}
```

**Success Response Body (Action):**
```json
{
  "comment": {
    "commentID": "string",
    "authorID": "string",
    "text": "string",
    "createdAt": "string"
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/deleteComment

**Description:** Removes a comment from the comments list and returns true on success.

**Requirements:**
- `userID` must match the `authorID` of the comment

**Effects:**
- Removes a comment from the `comments` list and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "commentID": "string",
  "userID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Engagement/editComment

**Description:** Updates the text of a specific comment and returns true on success.

**Requirements:**
- `userID` must match the `authorID` of the comment

**Effects:**
- Updates the `text` of a specific comment and returns true on success

**Request Body:**
```json
{
  "postID": "string",
  "commentID": "string",
  "userID": "string",
  "newText": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---








# API Specification: Room Template Concept

**Purpose:** To provide a standardized and managed catalog of all possible dorm rooms at MIT. This serves as the "tag" or "category".

---

## API Endpoints

### POST /api/RoomTemplate/addTemplate

**Description:** Creates, stores, and returns the unique ID of a new RoomTemplate object.

**Requirements:**
- An admin-level permission

**Effects:**
- Creates, stores, and returns the unique ID of a new RoomTemplate object

**Request Body:**
```json
{
  "dormName": "string",
  "roomType": "string"
}
```

**Success Response Body (Action):**
```json
{
  "templateID": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/RoomTemplate/getTemplate

**Description:** Retrieves a specific RoomTemplate, or null if not found.

**Requirements:**
- None

**Effects:**
- Retrieves a specific RoomTemplate, or null if not found

**Request Body:**
```json
{
  "templateID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "template": {
    "templateID": "string",
    "dormName": "string",
    "roomType": "string"
  } | null
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/RoomTemplate/findTemplate

**Description:** Returns a list of templates matching the filter criteria. If no filters are provided, it returns all templates.

**Requirements:**
- None

**Effects:**
- Returns a list of templates matching the filter criteria. If no filters are provided, it returns all templates

**Request Body:**
```json
{
  "dormName": "string",
  "roomType": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "templateID": "string",
    "dormName": "string",
    "roomType": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/RoomTemplate/updateTemplate

**Description:** Updates a template's details and returns true on success.

**Requirements:**
- An admin-level permission

**Effects:**
- Updates a template's details and returns true on success

**Request Body:**
```json
{
  "templateID": "string",
  "dormName": "string",
  "roomType": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/RoomTemplate/deleteTemplate

**Description:** Deletes a template and returns true on success.

**Requirements:**
- An admin-level permission

**Effects:**
- Deletes a template and returns true on success

**Request Body:**
```json
{
  "templateID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---









# API Specification: UserAccount Concept

**Purpose:** To manage user identity and profile information

---

## API Endpoints

### POST /api/UserAccount/getUser

**Description:** Retrieves a user's public profile information by their user ID.

**Requirements:**
- None specified

**Effects:**
- Returns the public-facing user object, or null if not found.

**Request Body:**
```json
{
  "userID": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": {
    "userID": "string",
    "username": "string", 
    "bio": "string",
    "createdAt": "string"
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAccount/getUserByUsername

**Description:** Retrieves a user's public profile information by their username.

**Requirements:**
- None specified

**Effects:**
- Returns the public-facing user object, or null if not found.

**Request Body:**
```json
{
  "username": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": {
    "userID": "string",
    "username": "string",
    "bio": "string", 
    "createdAt": "string"
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAccount/updateUserProfile

**Description:** Updates a user's bio information in their profile.

**Requirements:**
- `userID` must correspond to an existing user.

**Effects:**
- Updates the `bio` field for the specified user and returns true on success.

**Request Body:**
```json
{
  "userID": "string",
  "bio": "string"
}
```

**Success Response Body (Action):**
```json
{
  "success": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---
