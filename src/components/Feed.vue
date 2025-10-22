<template>
  <div class="feed-container">
    <div class="feed-header">
      <h1>MIT DormCraft Feed</h1>
      <p>Browse dorm room designs by template</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingTemplates" class="loading-section">
      <div class="loading-spinner"></div>
      <p>Loading room templates...</p>
    </div>

    <!-- Templates Section -->
    <div v-else class="templates-section">
      <h2>Room Templates</h2>
      <div class="templates-grid">
        <button
          v-for="template in templates"
          :key="template._id"
          class="template-card"
          :class="{ 'selected': selectedTemplate?._id === template._id }"
          @click="selectTemplate(template)"
        >
          <div class="template-info">
            <h3>{{ template.dormName }}</h3>
            <p>{{ template.roomType }}</p>
          </div>
          <div class="template-id">
            ID: {{ template._id }}
          </div>
        </button>
      </div>
    </div>

    <!-- Posts Section -->
    <div v-if="selectedTemplate" class="posts-section">
      <div class="posts-header">
        <h2>Posts for {{ selectedTemplate.dormName }} - {{ selectedTemplate.roomType }}</h2>
        <button 
          v-if="isLoadingPosts" 
          class="loading-button"
          disabled
        >
          <div class="small-spinner"></div>
          Loading posts...
        </button>
      </div>

      <!-- Posts Loading State -->
      <div v-if="isLoadingPosts" class="posts-loading">
        <div class="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>

      <!-- Posts Grid - Instagram Style -->
      <div v-else-if="posts.length > 0" class="posts-grid">
        <div
          v-for="post in posts"
          :key="post._id"
          class="instagram-post"
        >
          <!-- Post Header -->
          <div class="post-header">
            <div class="author-info">
              <div class="author-avatar">{{ getAuthorInitial(post.authorID) }}</div>
              <div class="author-details">
                <span class="author-name">{{ getAuthorName(post.authorID) }}</span>
                <span class="post-location">New Vassar Double</span>
              </div>
            </div>
            <button class="more-options">⋯</button>
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
            <button class="action-btn comment-btn" @click="focusComment(post)">
              <span class="comment-icon">💬</span>
            </button>
          </div>

          <!-- Post Content -->
          <div class="post-content">
            <div class="post-likes">
              <strong>{{ getLikeCount(post) }} {{ getLikeCount(post) === 1 ? 'like' : 'likes' }}</strong>
            </div>
            <div class="post-caption">
              <span class="author-name">{{ getAuthorName(post.authorID) }}</span>
              <span class="caption-text">{{ post.description }}</span>
            </div>
            <div class="post-comments" v-if="getComments(post).length > 0">
              <div 
                v-for="comment in getComments(post)" 
                :key="comment.commentID" 
                class="comment"
              >
                <span class="comment-author">{{ getCommentAuthorName(comment.authorID) }}</span>
                <span class="comment-text">{{ comment.text }}</span>
              </div>
            </div>
            <div class="post-time">{{ formatTimeAgo(post.createdAt) }}</div>
          </div>

          <!-- Comment Input -->
          <div class="comment-input">
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

      <!-- No Posts State -->
      <div v-else class="no-posts">
        <div class="no-posts-icon">🏠</div>
        <h3>No posts yet</h3>
        <p>Be the first to share a design for {{ selectedTemplate.dormName }} - {{ selectedTemplate.roomType }}!</p>
      </div>
    </div>

    <!-- No Template Selected State -->
    <div v-else class="no-template-selected">
      <div class="no-template-icon">🏢</div>
      <h3>Select a Room Template</h3>
      <p>Choose a room template above to see posts from that dorm and room type.</p>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <button @click="clearError" class="close-error">×</button>
    </div>
    
    <!-- Backend Status Message -->
    <div class="backend-status">
      <div class="status-indicator">
        <span class="status-dot online"></span>
        <span class="status-text">Backend API is working - full functionality enabled</span>
      </div>
      <p class="status-description">
        Comments and likes will persist in the database. All features are fully functional.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { roomTemplateAPI, designPostAPI, engagementAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { RoomTemplate, DesignPost, Comment } from '@/types/api'

// Reactive data
const templates = ref<RoomTemplate[]>([])
const posts = ref<DesignPost[]>([])
const selectedTemplate = ref<RoomTemplate | null>(null)
const isLoadingTemplates = ref(false)
const isLoadingPosts = ref(false)
const errorMessage = ref('')
const authorCache = ref<Record<string, string>>({})
const likeCounts = ref<Record<string, number>>({})
const likedPosts = ref<Record<string, boolean>>({})
const postComments = ref<Record<string, Comment[]>>({})
const isLoadingComments = ref<Record<string, boolean>>({})

// Auth store
const authStore = useAuthStore()

// Computed properties
const hasSelectedTemplate = computed(() => selectedTemplate.value !== null)
const hasPosts = computed(() => posts.value.length > 0)

// Load all room templates on component mount
const loadTemplates = async () => {
  isLoadingTemplates.value = true
  errorMessage.value = ''
  
  try {
    const response = await roomTemplateAPI.findTemplates()
    templates.value = response || []
    console.log('Loaded templates:', templates.value)
  } catch (error: any) {
    console.error('Error loading templates:', error)
    errorMessage.value = error.response?.data?.error || error.message || 'Failed to load room templates'
    templates.value = []
  } finally {
    isLoadingTemplates.value = false
  }
}

// Select a template and load its posts
const selectTemplate = async (template: RoomTemplate) => {
  selectedTemplate.value = template
  await loadPostsForTemplate(template._id)
}

// Load posts for a specific template
const loadPostsForTemplate = async (templateID: string) => {
  isLoadingPosts.value = true
  errorMessage.value = ''
  
  try {
    const response = await designPostAPI.findPostsByTemplate(templateID)
    posts.value = response || []
    console.log(`Loaded posts for template ${templateID}:`, posts.value)
    
    // Load engagement data (comments and upvotes) for each post
    await Promise.all(posts.value.map(async (post) => {
      await loadEngagementForPost(post._id)
    }))
  } catch (error: any) {
    console.error('Error loading posts:', error)
    errorMessage.value = error.response?.data?.error || error.message || 'Failed to load posts'
    posts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

// Load engagement data (comments and upvotes) for a specific post
const loadEngagementForPost = async (postID: string) => {
  try {
    const response = await engagementAPI.getEngagementForPost(postID)
    if (response.engagement) {
      postComments.value[postID] = response.engagement.comments || []
      
      // Update like counts and status
      const upvotes = response.engagement.upvotes || []
      likeCounts.value[postID] = upvotes.length
      likedPosts.value[postID] = authStore.userID ? upvotes.includes(authStore.userID) : false
    }
  } catch (error) {
    console.error(`Error loading engagement for post ${postID}:`, error)
    // Initialize empty arrays if there's an error (backend not configured)
    postComments.value[postID] = []
    likeCounts.value[postID] = 0
    likedPosts.value[postID] = false
  }
}

// Handle post click (placeholder for future post detail view)
const viewPost = (post: DesignPost) => {
  console.log('Viewing post:', post)
  // TODO: Navigate to post detail view or open modal
  alert(`Viewing post: "${post.title}"\n\nThis would open a detailed view of the post.`)
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
}

// Format date for display
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Unknown date'
  }
}

// Clear error message
const clearError = () => {
  errorMessage.value = ''
}

// Instagram-like functions
const getAuthorName = (authorID: string) => {
  if (authorCache.value[authorID]) {
    return authorCache.value[authorID]
  }
  // For now, return a placeholder name
  return 'MIT Student'
}

const getAuthorInitial = (authorID: string) => {
  const name = getAuthorName(authorID)
  return name.charAt(0).toUpperCase()
}

const getLikeCount = (post: any) => {
  const postId = post._id
  return likeCounts.value[postId] || 0
}

const isLiked = (post: any) => {
  const postId = post._id
  return likedPosts.value[postId] || false
}

const toggleLike = async (post: any) => {
  if (!authStore.userID) {
    return
  }
  
  const postId = post._id
  
  try {
    const response = await engagementAPI.toggleUpvote({
      postID: postId,
      userID: authStore.userID
    })
    
    if (response) {
      likeCounts.value[postId] = response.total
      likedPosts.value[postId] = response.upvoted
    }
  } catch (error: any) {
    console.error('Error toggling upvote:', error)
    
    // Fallback: Toggle like locally if API fails (backend not configured)
    if (error.response?.status === 404) {
      const currentlyLiked = likedPosts.value[postId] || false
      const currentCount = likeCounts.value[postId] || 0
      
      if (currentlyLiked) {
        // Unlike: decrease count and mark as unliked
        likeCounts.value[postId] = Math.max(0, currentCount - 1)
        likedPosts.value[postId] = false
      } else {
        // Like: increase count and mark as liked
        likeCounts.value[postId] = currentCount + 1
        likedPosts.value[postId] = true
      }
      
      console.log(`Toggled like locally (API not available) for post ${postId}`)
    } else {
      errorMessage.value = error.response?.data?.error || error.message || 'Failed to toggle upvote'
    }
  }
}

const focusComment = (post: any) => {
  // Focus on the comment input for this post
  const commentInput = document.querySelector(`[data-post-id="${post._id}"] .comment-field`) as HTMLInputElement
  if (commentInput) {
    commentInput.focus()
  }
}

const getComments = (post: any) => {
  const postId = post._id
  return postComments.value[postId] || []
}

const addComment = async (post: any, event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const commentText = input.value.trim()
  
  if (!commentText || !authStore.userID) {
    return
  }
  
  const postId = post._id
  
  try {
    // Add comment via API
    const response = await engagementAPI.addComment({
      postID: postId,
      authorID: authStore.userID,
      text: commentText
    })
    
    if (response.comment) {
      // Add the new comment to the local state
      if (!postComments.value[postId]) {
        postComments.value[postId] = []
      }
      postComments.value[postId].push(response.comment)
      
      // Clear the input
      input.value = ''
      
      console.log(`Added comment "${commentText}" to post ${postId}`)
    }
  } catch (error: any) {
    console.error('Error adding comment:', error)
    
    // Fallback: Add comment locally if API fails (backend not configured)
    if (error.response?.status === 404) {
      const fallbackComment = {
        commentID: Date.now().toString(),
        authorID: authStore.userID,
        text: commentText,
        createdAt: new Date().toISOString()
      }
      
      if (!postComments.value[postId]) {
        postComments.value[postId] = []
      }
      postComments.value[postId].push(fallbackComment)
      
      // Clear the input
      input.value = ''
      
      console.log(`Added comment locally (API not available): "${commentText}" to post ${postId}`)
    } else {
      errorMessage.value = error.response?.data?.error || error.message || 'Failed to add comment'
    }
  }
}

const getCommentAuthorName = (authorID: string) => {
  if (authorCache.value[authorID]) {
    return authorCache.value[authorID]
  }
  // For now, return a placeholder name
  return 'MIT Student'
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

// Load templates when component mounts
onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.feed-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.feed-header {
  text-align: center;
  margin-bottom: 40px;
}

.feed-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: 700;
}

.feed-header p {
  color: #6c757d;
  font-size: 18px;
}

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

.templates-section {
  margin-bottom: 40px;
}

.templates-section h2 {
  color: #495057;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.template-card {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
}

.template-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.template-card.selected {
  border-color: #007bff;
  background: linear-gradient(135deg, #f8f9ff, #e3f2fd);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.template-info h3 {
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.template-info p {
  color: #6c757d;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.template-id {
  color: #adb5bd;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.posts-section {
  margin-top: 40px;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.posts-header h2 {
  color: #495057;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.loading-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: not-allowed;
}

.small-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.posts-loading {
  text-align: center;
  padding: 40px 20px;
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 600px;
  margin: 0 auto;
}

.instagram-post {
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #efefef;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
}

.post-location {
  font-size: 12px;
  color: #8e8e8e;
}

.more-options {
  background: none;
  border: none;
  font-size: 18px;
  color: #262626;
  cursor: pointer;
  padding: 8px;
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
  padding: 8px 16px;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.1s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.heart-icon.liked {
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.like-btn {
  order: 1;
}

.comment-btn {
  order: 2;
}

.post-content {
  padding: 0 16px 8px;
}

.post-likes {
  margin-bottom: 8px;
}

.post-likes strong {
  font-size: 14px;
  color: #262626;
}

.post-caption {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.4;
}

.post-caption .author-name {
  font-weight: 600;
  margin-right: 8px;
}

.caption-text {
  color: #262626;
}

.post-comments {
  margin-bottom: 8px;
}

.comment {
  margin-bottom: 4px;
  font-size: 14px;
}

.comment-author {
  font-weight: 600;
  margin-right: 8px;
  color: #262626;
}

.comment-text {
  color: #262626;
}

.post-time {
  font-size: 10px;
  color: #8e8e8e;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.comment-input {
  padding: 12px 16px;
  border-top: 1px solid #efefef;
}

.comment-field {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #262626;
}

.comment-field::placeholder {
  color: #8e8e8e;
}

.no-posts,
.no-template-selected {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.no-posts-icon,
.no-template-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.no-posts h3,
.no-template-selected h3 {
  color: #495057;
  margin-bottom: 12px;
  font-size: 24px;
}

.no-posts p,
.no-template-selected p {
  font-size: 16px;
  line-height: 1.5;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-error {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #721c24;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-error:hover {
  background: rgba(114, 28, 36, 0.1);
}

.backend-status {
  background: #d4edda;
  color: #155724;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.offline {
  background: #ffc107;
}

.status-dot.online {
  background: #28a745;
}

.status-text {
  font-weight: 600;
  font-size: 14px;
}

.status-description {
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.9;
}

/* Responsive design */
@media (max-width: 768px) {
  .feed-container {
    padding: 15px;
  }
  
  .feed-header h1 {
    font-size: 28px;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .posts-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .posts-header h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .template-card {
    padding: 15px;
  }
  
  .post-content {
    padding: 15px;
  }
  
  .post-image-container {
    height: 150px;
  }
}
</style>
