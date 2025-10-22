# MIT DormCraft Frontend - API Service

This document explains how to use the API service layer in the MIT DormCraft frontend application.

## Overview

The API service is located at `src/services/api.js` and provides a clean interface to all backend endpoints using Axios. The service is organized into logical modules:

- **Authentication API** (`authAPI`) - User registration and login
- **Design Post API** (`designPostAPI`) - Managing dorm room design posts
- **Engagement API** (`engagementAPI`) - Upvotes and comments
- **Room Template API** (`roomTemplateAPI`) - MIT dorm room templates
- **User Account API** (`userAccountAPI`) - User profile management

## Authentication Store

The Pinia store at `src/stores/auth.ts` manages user authentication state and provides methods for login, registration, and logout.

## Usage Examples

### Authentication

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Register a new user
await authStore.register({
  username: 'john_doe',
  mitKerberos: 'johndoe@mit.edu',
  bio: 'MIT student who loves interior design',
  credential_data: 'password123'
})

// Login
await authStore.login('johndoe@mit.edu', 'password123')

// Logout
authStore.logout()
```

### Design Posts

```javascript
import { designPostAPI } from '@/services/api'

// Create a new post
const newPost = await designPostAPI.createPost({
  authorID: 'user123',
  templateID: 'template456',
  title: 'My Cozy Single Room',
  description: 'A minimalist approach to dorm living',
  imageURL: 'https://example.com/image.jpg'
})

// Get a specific post
const post = await designPostAPI.getPost('post789')

// Find posts by template
const posts = await designPostAPI.findPostsByTemplate('template456')

// Find posts by author
const userPosts = await designPostAPI.findPostsByAuthor('user123')
```

### Room Templates

```javascript
import { roomTemplateAPI } from '@/services/api'

// Get all templates
const allTemplates = await roomTemplateAPI.findTemplate()

// Search templates by dorm name
const nextHouseTemplates = await roomTemplateAPI.findTemplate({
  dormName: 'Next House'
})

// Search templates by room type
const singleRooms = await roomTemplateAPI.findTemplate({
  roomType: 'Single'
})

// Get specific template
const template = await roomTemplateAPI.getTemplate('template123')
```

### Engagement (Upvotes & Comments)

```javascript
import { engagementAPI } from '@/services/api'

// Get engagement for a post
const engagement = await engagementAPI.getEngagementForPost('post123')

// Toggle upvote
const upvoteResult = await engagementAPI.toggleUpvote({
  postID: 'post123',
  userID: 'user456'
})

// Add comment
const newComment = await engagementAPI.addComment({
  postID: 'post123',
  authorID: 'user456',
  text: 'Great design!'
})

// Edit comment
await engagementAPI.editComment({
  postID: 'post123',
  commentID: 'comment789',
  userID: 'user456',
  newText: 'Updated comment text'
})

// Delete comment
await engagementAPI.deleteComment({
  postID: 'post123',
  commentID: 'comment789',
  userID: 'user456'
})
```

### User Accounts

```javascript
import { userAccountAPI } from '@/services/api'

// Get user by ID
const user = await userAccountAPI.getUser('user123')

// Get user by username
const userByUsername = await userAccountAPI.getUserByUsername('john_doe')

// Update user profile
await userAccountAPI.updateUserProfile({
  userID: 'user123',
  bio: 'Updated bio text'
})
```

## Error Handling

All API methods return promises that can be handled with try/catch blocks:

```javascript
try {
  const result = await designPostAPI.createPost(postData)
  console.log('Post created:', result.postID)
} catch (error) {
  console.error('Error creating post:', error.response?.data?.error || error.message)
}
```

## HTTP Methods

- **GET methods**: Used for retrieving data (get, find operations)
- **POST methods**: Used for creating, updating, and deleting data

## Backend API Base URL

The API service is configured to connect to `http://localhost:8000/api`. Make sure your backend server is running on this URL.

## State Management

The authentication state is managed by Pinia and automatically persists to localStorage. The auth store provides:

- `userID`: Current user's ID
- `username`: Current user's username  
- `bio`: Current user's bio
- `isAuthenticated`: Boolean indicating login status
- `isLoading`: Boolean indicating if an operation is in progress
- `error`: Current error message (if any)

## Components

Two example components are provided:

1. **AuthComponent.vue** - Complete authentication interface with login/register forms
2. **ApiExamples.vue** - Examples of using various API endpoints

These components are included in the HomeView for testing purposes.
