<template>
  <main class="user-profile-page">
    <div class="page-container">
      <!-- Not Logged In -->
      <div v-if="!authStore.isLoggedIn" class="login-required">
        <div class="login-card">
          <div class="login-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to view your profile.</p>
          <div class="login-buttons">
            <RouterLink to="/login" class="cta-button primary">Sign In</RouterLink>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div v-else>
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar-container">
            <img v-if="authStore.profileImageURL" :src="authStore.profileImageURL" alt="Profile" class="profile-avatar-image" />
            <div v-else class="profile-avatar">{{ getInitial(authStore.username) }}</div>
            <input type="file" accept="image/*" @change="handleProfileImageChange" ref="profileImageInput" style="display: none;" />
            <button class="edit-avatar-btn" @click="$refs.profileImageInput.click()" title="Change profile picture">
              ✏️
            </button>
          </div>
          <div class="profile-info">
            <h1>{{ authStore.username || 'User' }}</h1>
            <p class="profile-email">{{ authStore.mitKerberos || 'MIT Student' }}</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-value">{{ myPosts.length }}</span>
                <span class="stat-label">Posts</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ likedPosts.length }}</span>
                <span class="stat-label">Liked</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button
            class="tab"
            :class="{ 'active': activeTab === 'my-posts' }"
            @click="activeTab = 'my-posts'"
          >
            My Posts
          </button>
          <button
            class="tab"
            :class="{ 'active': activeTab === 'liked' }"
            @click="activeTab = 'liked'"
          >
            Liked Posts
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-section">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>

        <!-- My Posts Tab -->
        <div v-else-if="activeTab === 'my-posts'" class="posts-section">
          <div v-if="myPosts.length > 0" class="posts-grid">
            <div
              v-for="post in myPosts"
              :key="post._id"
              class="instagram-post"
            >
              <!-- Post Header -->
              <div class="post-header">
                <div class="author-info">
                  <img v-if="authStore.profileImageURL" :src="authStore.profileImageURL" alt="Profile" class="author-avatar" />
                  <div v-else class="author-avatar">{{ getInitial(authStore.username) }}</div>
                  <div class="author-details">
                    <span class="author-name">{{ authStore.username }}</span>
                    <span class="post-location">{{ getPostLocation(post.templateID) }}</span>
                  </div>
                </div>
                <div class="post-action-buttons">
                  <button class="edit-btn" @click="openEditModal(post)" title="Edit post">
                    ✏️ Edit
                  </button>
                  <button class="delete-btn" @click="deletePost(post._id)" title="Delete post">
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <!-- Post Image -->
              <div class="post-image-container">
                <img
                  :src="post.imageURL"
                  :alt="post.title"
                  class="post-image"
                  @error="handleImageError"
                />
              </div>

              <!-- Post Actions -->
              <div class="post-actions">
                <button class="action-btn like-btn" @click="toggleLike(post)">
                  <span class="heart-icon" :class="{ 'liked': isLiked(post) }">
                    {{ isLiked(post) ? '❤️' : '🤍' }}
                  </span>
                </button>
                <button class="action-btn comment-btn" @click="toggleComments(post)">
                  <span class="comment-icon">💬</span>
                </button>
              </div>

              <!-- Post Content -->
              <div class="post-content">
                <div class="post-likes">
                  <strong>{{ getLikeCount(post) }} {{ getLikeCount(post) === 1 ? 'like' : 'likes' }}</strong>
                </div>
                <div class="post-title" v-if="post.title">
                  <strong>{{ authStore.username }}</strong> {{ post.title }}
                </div>
                <div class="post-caption" v-if="post.description">
                  <span class="caption-text">{{ post.description }}</span>
                </div>
                <div class="post-comments" v-if="showComments[post._id] && getComments(post).length > 0">
                  <div
                    v-for="comment in getComments(post)"
                    :key="comment.commentID"
                    class="comment"
                  >
                    <span class="comment-author">{{ comment.authorName || getCommentAuthorName(comment.authorID) }}</span>
                    <span class="comment-text">{{ comment.text }}</span>
                  </div>
                </div>
                <div class="post-time">{{ formatTimeAgo(post.createdAt) }}</div>
              </div>

              <!-- Comment Input -->
              <div class="comment-input" v-if="showComments[post._id]">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  class="comment-field"
                  :data-post-id="post._id"
                  @keyup.enter="addComment(post, $event)"
                />
              </div>
            </div>
          </div>

          <!-- No Posts -->
          <div v-else class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Start sharing your dorm room designs!</p>
            <RouterLink to="/create-post" class="create-button">Create Your First Post</RouterLink>
          </div>
        </div>

        <!-- Liked Posts Tab -->
        <div v-else-if="activeTab === 'liked'" class="posts-section">
          <div v-if="likedPosts.length > 0" class="posts-grid">
            <div
              v-for="post in likedPosts"
              :key="post._id"
              class="instagram-post"
            >
              <!-- Post Header -->
              <div class="post-header">
                <div class="author-info">
                  <div class="author-avatar">{{ getAuthorInitial(post.authorID) }}</div>
                  <div class="author-details">
                    <span class="author-name">{{ getAuthorName(post.authorID) }}</span>
                    <span class="post-location">{{ getPostLocation(post.templateID) }}</span>
                  </div>
                </div>
              </div>

              <!-- Post Image -->
              <div class="post-image-container">
                <img
                  :src="post.imageURL"
                  :alt="post.title"
                  class="post-image"
                  @error="handleImageError"
                />
              </div>

              <!-- Post Actions -->
              <div class="post-actions">
                <button class="action-btn like-btn" @click="toggleLike(post)">
                  <span class="heart-icon liked">
                    ❤️
                  </span>
                </button>
                <button class="action-btn comment-btn" @click="toggleComments(post)">
                  <span class="comment-icon">💬</span>
                </button>
              </div>

              <!-- Post Content -->
              <div class="post-content">
                <div class="post-likes">
                  <strong>{{ getLikeCount(post) }} {{ getLikeCount(post) === 1 ? 'like' : 'likes' }}</strong>
                </div>
                <div class="post-title" v-if="post.title">
                  <strong>{{ getAuthorName(post.authorID) }}</strong> {{ post.title }}
                </div>
                <div class="post-caption" v-if="post.description">
                  <span class="caption-text">{{ post.description }}</span>
                </div>
                <div class="post-comments" v-if="showComments[post._id] && getComments(post).length > 0">
                  <div
                    v-for="comment in getComments(post)"
                    :key="comment.commentID"
                    class="comment"
                  >
                    <span class="comment-author">{{ comment.authorName || getCommentAuthorName(comment.authorID) }}</span>
                    <span class="comment-text">{{ comment.text }}</span>
                  </div>
                </div>
                <div class="post-time">{{ formatTimeAgo(post.createdAt) }}</div>
              </div>

              <!-- Comment Input -->
              <div class="comment-input" v-if="showComments[post._id]">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  class="comment-field"
                  :data-post-id="post._id"
                  @keyup.enter="addComment(post, $event)"
                />
              </div>
            </div>
          </div>

          <!-- No Liked Posts -->
          <div v-else class="empty-state">
            <div class="empty-icon">❤️</div>
            <h3>No liked posts yet</h3>
            <p>Like posts that inspire you!</p>
            <RouterLink to="/dorms" class="create-button">Browse Posts</RouterLink>
          </div>
        </div>
      </div>

      <!-- Edit Post Modal -->
      <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Edit Post</h2>
            <button class="modal-close" @click="closeEditModal">×</button>
          </div>
          
          <form @submit.prevent="saveEditPost" class="edit-form">
            <!-- Dorm Selection -->
            <div class="form-section">
              <label class="section-label">Dorm <span class="required">*</span></label>
              <select v-model="(editingPost as any).dormName" class="form-select" required>
                <option v-for="dorm in mitDorms" :key="dorm" :value="dorm">{{ dorm }}</option>
              </select>
            </div>

            <!-- Room Size Selection -->
            <div class="form-section">
              <label class="section-label">Room Size <span class="required">*</span></label>
              <select v-model="(editingPost as any).roomType" class="form-select" required>
                <option v-for="room in roomTypes" :key="room.type" :value="room.type">{{ room.type }}</option>
              </select>
            </div>

            <!-- Description -->
            <div class="form-section">
              <label class="section-label">Description <span class="required">*</span></label>
              <input v-model="(editingPost as any).title" type="text" class="form-input" required maxlength="100" />
            </div>

            <!-- Image Preview -->
            <div class="form-section">
              <label class="section-label">Image</label>
              <input type="file" accept="image/*" @change="handleImageChange" class="file-input" />
              <div v-if="editingPost.imageURL" class="image-preview">
                <img :src="editingPost.imageURL" alt="Preview" class="preview-img" />
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" @click="closeEditModal" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import { designPostAPI, engagementAPI, roomTemplateAPI } from '@/services/api'
import type { DesignPost, Comment, RoomTemplate } from '@/types/api'

const authStore = useAuthStore()

const isLoading = ref(false)
const activeTab = ref<'my-posts' | 'liked'>('my-posts')
const myPosts = ref<DesignPost[]>([])
const allPosts = ref<DesignPost[]>([])
const likedPosts = ref<DesignPost[]>([])
const likeCounts = ref<Record<string, number>>({})
const likedPostsMap = ref<Record<string, boolean>>({})
const postComments = ref<Record<string, Comment[]>>({})
const showComments = ref<Record<string, boolean>>({})
const authorCache = ref<Record<string, string>>({})
const templateCache = ref<Record<string, RoomTemplate>>({})

// Edit post modal state
const isEditModalOpen = ref(false)
const isSaving = ref(false)
const editingPost = ref<Partial<DesignPost & { dormName: string; roomType: string; imageURL: string }>>({})
const selectedImageFile = ref<File | null>(null)
const imagePreviewEdit = ref<string | null>(null)

// MIT Dorms and Room Types
const mitDorms = [
  'Baker House',
  'Burton-Conner',
  'East Campus',
  'MacGregor',
  'Maseeh Hall',
  'McCormick',
  'New House',
  'New Vassar',
  'Next House',
  'Random Hall',
  'Senior House',
  'Simmons Hall',
  'Ware Hall',
  'Westgate',
]

const roomTypes = [
  { type: 'Single', icon: '🛏️' },
  { type: 'Double', icon: '🛏️🛏️' },
  { type: 'Triple', icon: '🛏️🛏️🛏️' },
  { type: 'Quad', icon: '🏠' }
]

// Load user's posts
const loadMyPosts = async () => {
  if (!authStore.userID) return
  
  try {
    const posts: DesignPost[] = []
    
    // Try to load posts from API
    try {
      console.log('Loading posts for user from API:', authStore.userID)
      const apiPosts = await designPostAPI.findPostsByAuthor(authStore.userID)
      console.log('Found user posts from API:', apiPosts.length)
      posts.push(...apiPosts)
    } catch (error) {
      console.log('Error loading posts from API, trying local storage:', error)
    }
    
    // Also load posts from local storage
    try {
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
      const userLocalPosts = localPosts.filter((post: any) => post.authorID === authStore.userID)
      console.log('Found user posts from local storage:', userLocalPosts.length)
      posts.push(...userLocalPosts)
    } catch (error) {
      console.error('Error loading posts from local storage:', error)
    }
    
    // Remove duplicates
    const uniquePosts = posts.filter((post, index, self) => 
      index === self.findIndex((p) => p._id === post._id)
    )
    
    console.log('Total unique user posts:', uniquePosts.length)
    myPosts.value = uniquePosts
    
    // Load engagement data for each post
    for (const post of uniquePosts) {
      await loadEngagementForPost(post._id)
      if (post.template) {
        templateCache.value[post.template._id] = post.template
      } else {
        await loadTemplateInfo(post.templateID)
      }
    }
  } catch (error) {
    console.error('Error loading my posts:', error)
  }
}

// Load all posts to find liked ones
const loadAllPosts = async () => {
  try {
    const posts: DesignPost[] = []
    
    // Load from API
    try {
      const allTemplates = await roomTemplateAPI.findTemplates({})
      for (const template of allTemplates) {
        try {
          const templatePosts = await designPostAPI.findPostsByTemplate(template._id)
          posts.push(...templatePosts)
        } catch (error) {
          console.error(`Error loading posts for template ${template._id}:`, error)
        }
      }
    } catch (error) {
      console.log('Error loading posts from API, trying localStorage')
    }
    
    // Also load from localStorage
    try {
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
      posts.push(...localPosts)
    } catch (error) {
      console.error('Error loading posts from localStorage:', error)
    }
    
    // Remove duplicates
    const uniquePosts = posts.filter((post, index, self) => 
      index === self.findIndex((p) => p._id === post._id)
    )
    
    allPosts.value = uniquePosts
    
    // Load engagement for all posts
    for (const post of uniquePosts) {
      await loadEngagementForPost(post._id)
      if (post.template) {
        templateCache.value[post.template._id] = post.template
      } else {
        await loadTemplateInfo(post.templateID)
      }
    }
    
    // Filter liked posts
    likedPosts.value = uniquePosts.filter(post => likedPostsMap.value[post._id])
  } catch (error) {
    console.error('Error loading all posts:', error)
  }
}

// Load engagement for a post
const loadEngagementForPost = async (postID: string) => {
  // First try to load from localStorage
  const loadedFromStorage = loadEngagementFromStorage(postID)
  
  // Then try to get from API and merge
  try {
    const response = await engagementAPI.getEngagementForPost(postID)
    if (response.engagement) {
      postComments.value[postID] = response.engagement.comments || []
      const upvotes = response.engagement.upvotes || []
      likeCounts.value[postID] = upvotes.length
      
      if (authStore.userID) {
        likedPostsMap.value[postID] = upvotes.includes(authStore.userID)
      }
      
      saveEngagementToStorage(postID)
    }
  } catch (error) {
    console.log(`API engagement not available for post ${postID}, using localStorage`)
    
    if (!loadedFromStorage) {
      postComments.value[postID] = []
      likeCounts.value[postID] = 0
      likedPostsMap.value[postID] = false
    }
  }
}

// Load template info
const loadTemplateInfo = async (templateID: string) => {
  if (!templateCache.value[templateID]) {
    try {
      const response = await roomTemplateAPI.getTemplate(templateID)
      if (response.template) {
        templateCache.value[templateID] = response.template
      }
    } catch (error) {
      console.error(`Error loading template ${templateID}:`, error)
    }
  }
}

// Helper functions
const getInitial = (name: string) => name?.charAt(0).toUpperCase() || 'U'
const getAuthorName = (authorID: string) => {
  // If it's the current user, return their username
  if (authStore.isLoggedIn && authorID === authStore.userID) {
    return authStore.username || 'User'
  }
  return authorCache.value[authorID] || 'User'
}
const getAuthorInitial = (authorID: string) => getAuthorName(authorID).charAt(0).toUpperCase()
const getPostLocation = (templateID: string) => {
  if (templateCache.value[templateID]) {
    const template = templateCache.value[templateID]
    return `${template.dormName} - ${template.roomType}`
  }
  return 'MIT Dorm'
}
const getLikeCount = (post: any) => likeCounts.value[post._id] || 0
const isLiked = (post: any) => likedPostsMap.value[post._id] || false
const getComments = (post: any) => postComments.value[post._id] || []
const getCommentAuthorName = (authorID: string) => {
  // If it's the current user, return their username
  if (authStore.isLoggedIn && authorID === authStore.userID) {
    return authStore.username || 'User'
  }
  return authorCache.value[authorID] || 'User'
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  // Less than 1 minute
  if (diffInSeconds < 60) return 'now'
  
  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  // Days
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  // Weeks
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`
  
  // More than a month, show date like "Jan 15"
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
}

const toggleComments = (post: any) => {
  showComments.value[post._id] = !showComments.value[post._id]
}

// Save engagement data to localStorage
const saveEngagementToStorage = (postId: string) => {
  try {
    const engagementData = JSON.parse(localStorage.getItem('postEngagement') || '{}')
    
    // Save for this post with current user ID
    const currentUserID = authStore.userID
    engagementData[postId] = {
      likeCount: likeCounts.value[postId] || 0,
      likedByUserID: likedPostsMap.value[postId] ? currentUserID : null,
      comments: postComments.value[postId] || [],
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('postEngagement', JSON.stringify(engagementData))
  } catch (error) {
    console.error('Failed to save engagement to localStorage:', error)
  }
}

// Load engagement data from localStorage
const loadEngagementFromStorage = (postId: string) => {
  try {
    const engagementData = JSON.parse(localStorage.getItem('postEngagement') || '{}')
    const postEngagement = engagementData[postId]
    if (postEngagement) {
      likeCounts.value[postId] = postEngagement.likeCount || 0
      
      // Check if the current user is the one who liked it
      const currentUserID = authStore.userID
      likedPostsMap.value[postId] = postEngagement.likedByUserID === currentUserID
      
      postComments.value[postId] = postEngagement.comments || []
      
      // Cache usernames from comments
      if (postEngagement.comments) {
        for (const comment of postEngagement.comments) {
          if (comment.authorName && comment.authorID) {
            authorCache.value[comment.authorID] = comment.authorName
          }
        }
      }
      
      return true
    }
  } catch (error) {
    console.error('Failed to load engagement from localStorage:', error)
  }
  return false
}

const toggleLike = async (post: any) => {
  if (!authStore.userID) return
  const postId = post._id
  
  // Get current state
  const currentlyLiked = likedPostsMap.value[postId] || false
  const currentCount = likeCounts.value[postId] || 0
  
  // Toggle immediately for better UX
  if (currentlyLiked) {
    likeCounts.value[postId] = Math.max(0, currentCount - 1)
    likedPostsMap.value[postId] = false
    likedPosts.value = likedPosts.value.filter(p => p._id !== postId)
  } else {
    likeCounts.value[postId] = currentCount + 1
    likedPostsMap.value[postId] = true
    if (!likedPosts.value.find(p => p._id === postId)) {
      likedPosts.value.push(post)
    }
  }
  
  // Save to localStorage immediately
  saveEngagementToStorage(postId)
  
  // Try to save to API as well
  try {
    const response = await engagementAPI.toggleUpvote({
      postID: postId,
      userID: authStore.userID
    })
    if (response) {
      likeCounts.value[postId] = response.total
      likedPostsMap.value[postId] = response.upvoted
      saveEngagementToStorage(postId)
    }
  } catch (error: any) {
    console.log('API toggleUpvote failed, using localStorage:', error.message)
  }
}

const addComment = async (post: any, event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const commentText = input.value.trim()
  if (!commentText || !authStore.userID) return
  const postId = post._id
  
  // Cache the current user's name
  authorCache.value[authStore.userID] = authStore.username || 'MIT Student'
  
  // Create comment immediately
  const newComment = {
    commentID: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    authorID: authStore.userID,
    authorName: authStore.username || 'MIT Student', // Store username
    text: commentText,
    createdAt: new Date().toISOString()
  }
  
  if (!postComments.value[postId]) {
    postComments.value[postId] = []
  }
  postComments.value[postId].push(newComment)
  input.value = ''
  
  // Save to localStorage immediately
  saveEngagementToStorage(postId)
  
  // Try to save to API as well
  try {
    const response = await engagementAPI.addComment({
      postID: postId,
      authorID: authStore.userID,
      text: commentText
    })
    if (response.comment) {
      // Replace local comment with API version
      const index = postComments.value[postId].findIndex(c => c.commentID === newComment.commentID)
      if (index !== -1) {
        postComments.value[postId][index] = response.comment
        saveEngagementToStorage(postId)
      }
    }
  } catch (error: any) {
    console.log('API addComment failed, using localStorage:', error.message)
  }
}

// Compress image helper
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressedDataUrl)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Open edit modal
const openEditModal = (post: DesignPost) => {
  const editData: any = {
    _id: post._id,
    title: post.title,
    imageURL: post.imageURL,
    dormName: post.template?.dormName || '',
    roomType: post.template?.roomType || ''
  }
  editingPost.value = editData
  imagePreviewEdit.value = null
  selectedImageFile.value = null
  isEditModalOpen.value = true
}

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false
  editingPost.value = {}
  imagePreviewEdit.value = null
  selectedImageFile.value = null
}

// Handle image change in edit modal
const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB')
      return
    }
    
    try {
      const compressed = await compressImage(file)
      const editData = editingPost.value as any
      editData.imageURL = compressed
      selectedImageFile.value = file
    } catch (error) {
      console.error('Failed to compress image:', error)
      alert('Failed to process image')
    }
  }
}

// Save edited post
const saveEditPost = async () => {
  const editData = editingPost.value as any
  if (!editData._id) return
  
  isSaving.value = true
  
  try {
    // Update the post in myPosts
    const postIndex = myPosts.value.findIndex(p => p._id === editData._id)
    if (postIndex !== -1) {
      const post = myPosts.value[postIndex]
      
      // Update post data
      post.title = editData.title || ''
      post.description = ''
      
      // Handle image update
      if (editData.imageURL && editData.imageURL !== post.imageURL) {
        post.imageURL = editData.imageURL
      }
      
      // Update template info if dorm/room type changed
      if (post.template && (editData.dormName || editData.roomType)) {
        post.template.dormName = editData.dormName || post.template.dormName
        post.template.roomType = editData.roomType || post.template.roomType
      }
      
      // Update in localStorage
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
      const localIndex = localPosts.findIndex((p: any) => p._id === post._id)
      if (localIndex !== -1) {
        localPosts[localIndex] = post
        localStorage.setItem('localPosts', JSON.stringify(localPosts))
      }
      
      // Try to update via API
      try {
        await designPostAPI.editPost({
          postID: post._id,
          userID: authStore.userID!,
          title: post.title,
          description: '',
          imageURL: post.imageURL
        })
      } catch (error) {
        console.log('API edit failed, saved to localStorage:', error)
      }
      
      alert('Post updated successfully!')
      closeEditModal()
    }
  } catch (error) {
    console.error('Error saving post:', error)
    alert('Failed to update post. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Handle profile image upload
const handleProfileImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB')
      return
    }
    
    try {
      const compressed = await compressImage(file)
      authStore.setProfileImage(compressed)
      alert('Profile picture updated!')
    } catch (error) {
      console.error('Failed to compress image:', error)
      alert('Failed to process image')
    }
  }
}

// Delete post
const deletePost = async (postID: string) => {
  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }
  
  try {
    // Remove from myPosts array
    const postIndex = myPosts.value.findIndex(p => p._id === postID)
    if (postIndex !== -1) {
      myPosts.value.splice(postIndex, 1)
    }
    
    // Remove from localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
    const filteredPosts = localPosts.filter((p: any) => p._id !== postID)
    localStorage.setItem('localPosts', JSON.stringify(filteredPosts))
    
    // Try to call API
    try {
      await designPostAPI.deletePost(postID)
    } catch (error) {
      console.log('API delete failed, removed from localStorage:', error)
    }
    
    alert('Post deleted successfully!')
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('Failed to delete post')
  }
}

// Load data on mount
onMounted(async () => {
  if (authStore.isLoggedIn) {
    isLoading.value = true
    await Promise.all([loadMyPosts(), loadAllPosts()])
    isLoading.value = false
  }
})
</script>

<style scoped>
.user-profile-page {
  background: transparent;
  min-height: calc(100vh - 80px);
  padding: 40px 20px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  display: flex;
  gap: 30px;
  align-items: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1db2eb 0%, #00d4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 0 30px rgba(29, 178, 235, 0.4), 0 0 60px rgba(0, 212, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.profile-info h1 {
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 32px;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.profile-email {
  color: #6c757d;
  margin-bottom: 20px;
}

.profile-stats {
  display: flex;
  gap: 30px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  justify-content: center;
}

.tab {
  padding: 12px 32px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 18px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.tab:hover {
  color: rgba(29, 178, 235, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.tab.active {
  color: white;
  border-bottom-color: rgba(29, 178, 235, 0.7);
  text-shadow: 0 0 10px rgba(29, 178, 235, 0.6);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Loading */
.loading-section {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Posts Grid */
.section-title {
  color: white;
  margin-bottom: 20px;
  font-size: 24px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Instagram Post Styles (reusing from DormsLayoutsView) */
.instagram-post {
  background: linear-gradient(145deg, rgba(22, 36, 71, 0.8), rgba(15, 30, 53, 0.9));
  border: 2px solid rgba(29, 178, 235, 0.3);
  border-radius: 8px;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(29, 178, 235, 0.2);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: 13px;
  color: #1db2eb;
}

.post-location {
  font-size: 11px;
  color: #4dd0e1;
}

.post-image-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-actions {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.1s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.post-content {
  padding: 0 12px 6px;
}

.post-likes {
  margin-bottom: 6px;
}

.post-likes strong {
  font-size: 13px;
  color: #e8f4f8;
}

.post-title {
  margin-bottom: 6px;
  font-size: 13px;
  color: #e8f4f8;
}

.post-title strong {
  font-weight: 700;
}

.post-caption {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.3;
}

.caption-text {
  color: white;
}

.post-comments {
  margin-bottom: 6px;
}

.comment {
  margin-bottom: 3px;
  font-size: 13px;
}

.comment-author {
  font-weight: 600;
  margin-right: 6px;
  color: #B0E0E6;
}

.comment-text {
  color: white;
}

.post-time {
  font-size: 9px;
  color: #B0E0E6;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.comment-input {
  padding: 8px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.comment-field {
  width: 100%;
  border: none;
  outline: none;
  font-size: 13px;
  color: white;
  background: transparent;
}

.comment-field::placeholder {
  color: #B0E0E6;
}

/* Empty State */
.empty-state {
  background: white;
  padding: 60px 20px;
  border-radius: 12px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 24px;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 30px;
}

.create-button {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.create-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Login Required */
.login-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  background: white;
  padding: 60px 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.login-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.login-card h2 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.login-card p {
  color: #6c757d;
  margin-bottom: 30px;
}

.login-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.cta-button {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: #007bff;
  color: white;
}

.cta-button.primary:hover {
  background: #0056b3;
}

/* Avatar Container */
.avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 30px rgba(29, 178, 235, 0.4), 0 0 60px rgba(0, 212, 255, 0.2);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(29, 178, 235, 0.9);
  border: 2px solid white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.edit-avatar-btn:hover {
  background: rgba(0, 212, 255, 0.9);
  transform: scale(1.1);
}

/* Post Action Buttons */
.post-action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn {
  background: linear-gradient(135deg, #1db2eb, #00d4ff);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #00d4ff, #1db2eb);
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(29, 178, 235, 0.5);
}

.delete-btn {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #c82333, #bd2130);
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(220, 53, 69, 0.5);
}

/* Edit Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(145deg, rgba(22, 36, 71, 0.95), rgba(31, 64, 104, 0.95));
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(29, 178, 235, 0.3), 0 0 60px rgba(0, 212, 255, 0.15);
  border: 2px solid rgba(29, 178, 235, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h2 {
  margin: 0;
  color: #1db2eb;
  font-size: 24px;
  text-shadow: 0 0 15px rgba(29, 178, 235, 0.4);
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.edit-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.required {
  color: #dc3545;
}

.form-select,
.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.file-input {
  width: 100%;
  padding: 8px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
}

.image-preview {
  margin-top: 10px;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
}

.save-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-profile-page {
    padding: 20px 15px;
  }
}
</style>

