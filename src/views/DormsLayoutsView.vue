<template>
  <main class="dorms-layouts-page">
    <div class="page-container">
      <!-- Not Logged In Message -->
      <div v-if="!authStore.isLoggedIn" class="login-required">
        <div class="login-card">
          <div class="login-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>You need to be signed in to view dorm room designs. Please sign in to explore and get inspired by MIT dorm setups!</p>
          <div class="login-buttons">
            <RouterLink to="/login" class="cta-button primary">Sign In</RouterLink>
            <RouterLink to="/register" class="cta-button secondary">Create Account</RouterLink>
          </div>
        </div>
      </div>

      <!-- Content for logged in users -->
      <div v-else>
        <!-- Header -->
        <div class="hero-section">
          <h1>MIT Dorms & Layouts</h1>
          <p class="tagline">Browse dorm room designs by dorm or room size</p>
        </div>

        <!-- Filters Section -->
      <div class="filters-section">
        <!-- Dorm Filter -->
        <div class="filter-group">
          <h3>Filter by Dorm</h3>
          <div class="filter-grid">
            <button
              v-for="dorm in mitDorms"
              :key="dorm"
              class="filter-chip"
              :class="{ 'active': selectedDorms.includes(dorm) }"
              @click="toggleDorm(dorm)"
            >
              {{ dorm }}
            </button>
          </div>
        </div>

        <!-- Room Size Filter -->
        <div class="filter-group">
          <h3>Filter by Room Size</h3>
          <div class="filter-grid">
            <button
              v-for="roomType in roomTypes"
              :key="roomType.type"
              class="filter-chip"
              :class="{ 'active': selectedRoomTypes.includes(roomType.type) }"
              @click="toggleRoomType(roomType.type)"
            >
              <span class="room-icon">{{ roomType.icon }}</span>
              {{ roomType.type }}
            </button>
          </div>
        </div>

        <!-- Clear Filters -->
        <div v-if="selectedDorms.length > 0 || selectedRoomTypes.length > 0" class="clear-filters">
          <button class="clear-btn" @click="clearFilters">
            Clear All Filters
          </button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="selectedDorms.length > 0 || selectedRoomTypes.length > 0" class="active-filters">
        <span class="filter-label">Active Filters:</span>
        <span 
          v-for="dorm in selectedDorms" 
          :key="`dorm-${dorm}`" 
          class="active-filter-badge"
        >
          {{ dorm }}
          <button @click="removeDorm(dorm)" class="remove-filter">×</button>
        </span>
        <span 
          v-for="roomType in selectedRoomTypes" 
          :key="`room-${roomType}`" 
          class="active-filter-badge"
        >
          {{ roomType }}
          <button @click="removeRoomType(roomType)" class="remove-filter">×</button>
        </span>
      </div>

      <!-- Feed Section -->
      <div class="feed-section">
        <div class="feed-header">
          <div class="header-content">
            <div>
              <h2>
                <span v-if="selectedDorms.length > 0 || selectedRoomTypes.length > 0">
                  <span v-if="selectedDorms.length > 0 && selectedRoomTypes.length > 0">
                    Posts from {{ selectedDorms.join(', ') }} - {{ selectedRoomTypes.join(', ') }}
                  </span>
                  <span v-else-if="selectedDorms.length > 0">
                    Posts from {{ selectedDorms.join(', ') }}
                  </span>
                  <span v-else>
                    Posts from {{ selectedRoomTypes.join(', ') }} rooms
                  </span>
                </span>
                <span v-else>
                  All Posts
                </span>
              </h2>
              <p class="feed-subtitle">
                <span v-if="selectedDorms.length > 0 || selectedRoomTypes.length > 0">
                  Showing posts that match your filters
                </span>
                <span v-else>
                  Browse all dorm room designs from across MIT
                </span>
              </p>
            </div>
            <div class="header-actions">
              <button @click="refreshPosts" class="refresh-btn" :disabled="isLoadingPosts">
                {{ isLoadingPosts ? '⟳ Refreshing...' : '⟳ Refresh' }}
              </button>
              <RouterLink to="/create-post" class="create-post-btn">
                + Create Post
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Posts Feed -->
        <div class="posts-feed">
          <!-- Loading State -->
          <div v-if="isLoadingPosts" class="loading-section">
            <div class="loading-spinner"></div>
            <p>Loading posts...</p>
          </div>

          <!-- Posts Grid -->
          <div v-else-if="posts.length > 0" class="posts-grid">
            <div
              v-for="post in posts"
              :key="post._id"
              class="instagram-post"
            >
              <!-- Post Header -->
              <div class="post-header">
                <div class="author-info">
                  <img v-if="authStore.profileImageURL && post.authorID === authStore.userID" :src="authStore.profileImageURL" alt="Profile" class="author-avatar" />
                  <div v-else class="author-avatar">{{ getAuthorInitial(post.authorID) }}</div>
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
                    <span class="comment-author">{{ getCommentAuthorName(comment.authorID) }}</span>
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

          <!-- No Posts Found -->
          <div v-else class="no-posts">
            <div class="no-posts-icon">🔍</div>
              <h3>No posts found</h3>
            <p v-if="selectedDorms.length > 0 || selectedRoomTypes.length > 0">
              No posts match your current filters. Try adjusting your filters or viewing all posts.
            </p>
            <p v-else>
              Be the first to share a dorm room design!
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onActivated } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { roomTemplateAPI, designPostAPI, engagementAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { RoomTemplate, DesignPost, Comment } from '@/types/api'

// Auth store
const authStore = useAuthStore()
const route = useRoute()

// Filter state
const selectedDorms = ref<string[]>([])
const selectedRoomTypes = ref<string[]>([])
const selectedTemplate = ref<RoomTemplate | null>(null)

// Data state
const templates = ref<RoomTemplate[]>([])
const posts = ref<DesignPost[]>([])
const isLoadingPosts = ref(false)
const isLoadingTemplates = ref(false)
const authorCache = ref<Record<string, string>>({})
const likeCounts = ref<Record<string, number>>({})
const likedPosts = ref<Record<string, boolean>>({})
const postComments = ref<Record<string, Comment[]>>({})
const showComments = ref<Record<string, boolean>>({})

// MIT Dorms list
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

// Load templates when filters change
const loadTemplates = async () => {
  isLoadingTemplates.value = true
  try {
    const filters: { dormName?: string; roomType?: string } = {}
    // Note: Using selectedDorms and selectedRoomTypes arrays, not single values
    
    const response = await roomTemplateAPI.findTemplates(filters)
    templates.value = response || []
  } catch (error: any) {
    console.error('Error loading layouts:', error)
    templates.value = []
  } finally {
    isLoadingTemplates.value = false
  }
}

// Sample posts for demonstration - DISABLED
const getSamplePosts = (): DesignPost[] => {
  return [] // Sample posts removed
}

// Sample templates
const getSampleTemplates = (): RoomTemplate[] => {
  return [
    { _id: 'sample-template-1', dormName: 'Simmons Hall', roomType: 'Single' },
    { _id: 'sample-template-2', dormName: 'New Vassar', roomType: 'Double' },
    { _id: 'sample-template-3', dormName: 'Baker House', roomType: 'Single' },
    { _id: 'sample-template-4', dormName: 'MacGregor', roomType: 'Single' }
  ]
}

// Load all posts when no filters are selected
const loadAllPosts = async () => {
  isLoadingPosts.value = true
  try {
    console.log('Loading all posts...')
    
    // Strategy: Try multiple approaches to get all posts
    const allPosts: DesignPost[] = []
    const seenPostIds = new Set<string>()
    
    // Approach 1: Load posts for each known template
    try {
      const allTemplates = await roomTemplateAPI.findTemplates({})
      console.log('Found templates:', allTemplates.length)
      
      for (const template of allTemplates) {
        try {
          const templatePosts = await designPostAPI.findPostsByTemplate(template._id)
          console.log(`Template ${template.dormName} - ${template.roomType}: ${templatePosts.length} posts`)
          
          // Add template to cache
          templateCache.value[template._id] = template
          
          // Add posts, avoiding duplicates
          for (const post of templatePosts) {
            if (!seenPostIds.has(post._id)) {
              seenPostIds.add(post._id)
              allPosts.push(post)
            }
          }
        } catch (error) {
          console.error(`Error loading posts for template ${template._id}:`, error)
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
    
    // Approach 2: Load posts from local storage (fallback for when API doesn't work)
    try {
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
      console.log(`Found ${localPosts.length} posts in local storage`)
      
      for (const post of localPosts) {
        if (!seenPostIds.has(post._id)) {
          seenPostIds.add(post._id)
          allPosts.push(post)
          console.log(`Added local storage post: ${post.title} (${post._id})`)
          
          // Add template to cache if we have it
          if (post.template) {
            templateCache.value[post.template._id] = post.template
          }
        }
      }
    } catch (error) {
      console.error('Error loading posts from local storage:', error)
    }
    
    // Approach 3: If we have a logged-in user, try to load their posts directly
    if (authStore.userID) {
      try {
        console.log(`Loading posts for user: ${authStore.userID}`)
        const userPosts = await designPostAPI.findPostsByAuthor(authStore.userID)
        console.log(`Found ${userPosts.length} posts by current user:`, userPosts.map(p => ({ id: p._id, title: p.title })))
        
        // Add user's posts, avoiding duplicates
        for (const post of userPosts) {
          if (!seenPostIds.has(post._id)) {
            seenPostIds.add(post._id)
            allPosts.push(post)
            console.log(`Added user post: ${post.title} (${post._id})`)
            
            // Try to load template info for this post
            await loadTemplateInfo(post.templateID)
          } else {
            console.log(`Skipping duplicate post: ${post.title} (${post._id})`)
          }
        }
      } catch (error: any) {
        console.error('Error loading user posts:', error)
        console.error('Error details:', error.response?.data)
      }
    } else {
      console.log('No user logged in, skipping user posts')
    }
    
    // Sort posts by creation date (newest first)
    allPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    
    console.log('Total unique posts loaded:', allPosts.length)
    
    // Always show real posts if we have them
    // Add sample posts alongside (not as replacement) for demo purposes
    if (allPosts.length > 0) {
      console.log('Showing real posts (sample posts hidden)')
      posts.value = allPosts
    } else {
      // Only show sample posts if we have NO real posts
      console.log('No real posts found, showing sample posts as fallback')
      const sampleTemplates = getSampleTemplates()
      sampleTemplates.forEach(t => {
        templateCache.value[t._id] = t
      })
      posts.value = getSamplePosts()
      
      // Initialize sample post engagement data
      posts.value.forEach(post => {
        postComments.value[post._id] = []
        likeCounts.value[post._id] = Math.floor(Math.random() * 10) + 1
        likedPosts.value[post._id] = false
      })
    }
    
    // Load engagement data for real posts only (sample posts already have it)
    const realPosts = posts.value.filter(post => !post._id.startsWith('sample-'))
    if (realPosts.length > 0) {
      await Promise.all(realPosts.map(async (post) => {
        await loadEngagementForPost(post._id)
      }))
    }
  } catch (error: any) {
    console.error('Error loading all posts:', error)
    // On error, load sample posts
    const sampleTemplates = getSampleTemplates()
    sampleTemplates.forEach(t => {
      templateCache.value[t._id] = t
    })
    const samplePosts = getSamplePosts()
    samplePosts.forEach(post => {
      postComments.value[post._id] = []
      likeCounts.value[post._id] = Math.floor(Math.random() * 10) + 1
      likedPosts.value[post._id] = false
    })
    posts.value = samplePosts
  } finally {
    isLoadingPosts.value = false
  }
}

// Toggle a dorm filter
const toggleDorm = (dorm: string) => {
  const index = selectedDorms.value.indexOf(dorm)
  if (index > -1) {
    selectedDorms.value.splice(index, 1)
  } else {
    selectedDorms.value.push(dorm)
  }
  selectedTemplate.value = null
  loadFilteredPosts()
}

// Toggle a room type filter
const toggleRoomType = (roomType: string) => {
  const index = selectedRoomTypes.value.indexOf(roomType)
  if (index > -1) {
    selectedRoomTypes.value.splice(index, 1)
  } else {
    selectedRoomTypes.value.push(roomType)
  }
  selectedTemplate.value = null
  loadFilteredPosts()
}

// Remove a specific dorm from filters
const removeDorm = (dorm: string) => {
  const index = selectedDorms.value.indexOf(dorm)
  if (index > -1) {
    selectedDorms.value.splice(index, 1)
    loadFilteredPosts()
  }
}

// Remove a specific room type from filters
const removeRoomType = (roomType: string) => {
  const index = selectedRoomTypes.value.indexOf(roomType)
  if (index > -1) {
    selectedRoomTypes.value.splice(index, 1)
    loadFilteredPosts()
  }
}

// Clear all filters
const clearFilters = () => {
  selectedDorms.value = []
  selectedRoomTypes.value = []
  selectedTemplate.value = null
  loadAllPosts()
}

// Refresh posts manually
const refreshPosts = () => {
  console.log('Manual refresh triggered')
  if (selectedDorms.value.length === 0 && selectedRoomTypes.value.length === 0) {
    loadAllPosts()
  } else {
    loadFilteredPosts()
  }
}

// Load filtered posts based on current filters
const loadFilteredPosts = async () => {
  isLoadingPosts.value = true
  try {
    let matchingTemplates: RoomTemplate[] = []
    
    // If no filters selected, get all templates
    if (selectedDorms.value.length === 0 && selectedRoomTypes.value.length === 0) {
      matchingTemplates = await roomTemplateAPI.findTemplates({})
    } else {
      // Get all templates that match any of the selected filters
      const allTemplates = await roomTemplateAPI.findTemplates({})
      
      // Filter client-side to match multiple dorm/room type selections
      matchingTemplates = allTemplates.filter(template => {
        const matchesDorm = selectedDorms.value.length === 0 || selectedDorms.value.includes(template.dormName)
        const matchesRoomType = selectedRoomTypes.value.length === 0 || selectedRoomTypes.value.includes(template.roomType)
        return matchesDorm && matchesRoomType
      })
    }
    
    // Also include sample templates if they match the filters
    const sampleTemplates = getSampleTemplates()
    const matchingSampleTemplates = sampleTemplates.filter(template => {
      const matchesDorm = selectedDorms.value.length === 0 || selectedDorms.value.includes(template.dormName)
      const matchesRoomType = selectedRoomTypes.value.length === 0 || selectedRoomTypes.value.includes(template.roomType)
      return matchesDorm && matchesRoomType
    })
    
    // Add sample templates to cache
    matchingSampleTemplates.forEach(t => {
      templateCache.value[t._id] = t
    })
    
    // Load posts for each matching template
    const allPosts: DesignPost[] = []
    for (const template of matchingTemplates) {
      try {
        const templatePosts = await designPostAPI.findPostsByTemplate(template._id)
        allPosts.push(...templatePosts)
      } catch (error) {
        console.error(`Error loading posts for layout ${template._id}:`, error)
      }
    }
    
    // Add sample posts that match the filters
    const samplePosts = getSamplePosts()
    const matchingSamplePosts = samplePosts.filter(post => {
      const template = matchingSampleTemplates.find(t => t._id === post.templateID)
      return template !== undefined
    })
    
    allPosts.push(...matchingSamplePosts)
    
    // Load posts from localStorage and filter them
    try {
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
      console.log(`Found ${localPosts.length} posts in localStorage for filtering`)
      
      for (const post of localPosts) {
        // Check if post's template matches the selected filters
        let postMatches = false
        
        if (post.template) {
          // Post has template info embedded
          const matchesDorm = selectedDorms.value.length === 0 || selectedDorms.value.includes(post.template.dormName)
          const matchesRoomType = selectedRoomTypes.value.length === 0 || selectedRoomTypes.value.includes(post.template.roomType)
          postMatches = matchesDorm && matchesRoomType
          
          // Add template to cache
          templateCache.value[post.templateID] = post.template
        } else {
          // Try to find template info
          const template = templateCache.value[post.templateID] || 
                          matchingTemplates.find(t => t._id === post.templateID) ||
                          matchingSampleTemplates.find(t => t._id === post.templateID)
          
          if (template) {
            const matchesDorm = selectedDorms.value.length === 0 || selectedDorms.value.includes(template.dormName)
            const matchesRoomType = selectedRoomTypes.value.length === 0 || selectedRoomTypes.value.includes(template.roomType)
            postMatches = matchesDorm && matchesRoomType
            
            templateCache.value[post.templateID] = template
          } else {
            // No template info available, check against all filters
            postMatches = selectedDorms.value.length === 0 && selectedRoomTypes.value.length === 0
          }
        }
        
        if (postMatches) {
          allPosts.push(post)
          console.log(`Added local post to filtered results: ${post.title}`)
        }
      }
    } catch (error) {
      console.error('Error loading posts from localStorage for filtering:', error)
    }
    
    // Sort posts by creation date (newest first)
    allPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    
    posts.value = allPosts
    console.log(`Total posts after filtering: ${allPosts.length}`)
    
    // Load engagement data and template info for each post
    await Promise.all(posts.value.map(async (post) => {
      // For sample posts, use mock engagement data
      if (post._id.startsWith('sample-')) {
        postComments.value[post._id] = []
        likeCounts.value[post._id] = Math.floor(Math.random() * 10) + 1
        likedPosts.value[post._id] = false
      } else {
        await loadEngagementForPost(post._id)
        await loadTemplateInfo(post.templateID)
      }
    }))
  } catch (error: any) {
    console.error('Error loading filtered posts:', error)
    posts.value = []
  } finally {
    isLoadingPosts.value = false
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
  try {
    const response = await designPostAPI.findPostsByTemplate(templateID)
    posts.value = response || []

    // Load engagement data for each post
    await Promise.all(posts.value.map(async (post) => {
      await loadEngagementForPost(post._id)
    }))
  } catch (error: any) {
    console.error('Error loading posts:', error)
    posts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

// Load engagement data for a post
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
      likedPosts.value[postID] = authStore.userID ? upvotes.includes(authStore.userID) : false
      
      // Save updated data to localStorage
      saveEngagementToStorage(postID)
    }
  } catch (error) {
    console.log(`API engagement not available for post ${postID}, using localStorage`)
    
    // If we couldn't load from localStorage either, initialize defaults
    if (!loadedFromStorage) {
      postComments.value[postID] = []
      likeCounts.value[postID] = 0
      likedPosts.value[postID] = false
    }
  }
}

// Handle image errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
}

// Sample users cache - REMOVED
const sampleUsers: Record<string, string> = {}

// Instagram-like functions
const getAuthorName = (authorID: string) => {
  // If it's the current user, return their username
  if (authStore.isLoggedIn && authorID === authStore.userID) {
    return authStore.username || 'User'
  }
  return sampleUsers[authorID] || authorCache.value[authorID] || 'User'
}
const getAuthorInitial = (authorID: string) => getAuthorName(authorID).charAt(0).toUpperCase()
const getLikeCount = (post: any) => likeCounts.value[post._id] || 0
const isLiked = (post: any) => likedPosts.value[post._id] || false
const getComments = (post: any) => postComments.value[post._id] || []
const getCommentAuthorName = (authorID: string) => {
  // If it's the current user, return their username
  if (authStore.isLoggedIn && authorID === authStore.userID) {
    return authStore.username || 'User'
  }
  return sampleUsers[authorID] || authorCache.value[authorID] || 'User'
}
const templateCache = ref<Record<string, RoomTemplate>>({})

// Get post location from template
const getPostLocation = (templateID: string) => {
  if (templateCache.value[templateID]) {
    const template = templateCache.value[templateID]
    return `${template.dormName} - ${template.roomType}`
  }
  return 'MIT Dorm'
}

// Helper to load template info if needed
const loadTemplateInfo = async (templateID: string) => {
  if (!templateCache.value[templateID]) {
    try {
      const response = await roomTemplateAPI.getTemplate(templateID)
      if (response.template) {
        templateCache.value[templateID] = response.template
      }
    } catch (error) {
      console.error(`Error loading template ${templateID}:`, error)
      
      // Create a fallback template from the templateID if it follows our naming convention
      // e.g., "new-vassar-double" -> { dormName: "New Vassar", roomType: "Double" }
      if (templateID.includes('-')) {
        const parts = templateID.split('-')
        if (parts.length >= 2) {
          const roomType = parts[parts.length - 1]
          const dormName = parts.slice(0, -1).map(p => 
            p.charAt(0).toUpperCase() + p.slice(1)
          ).join(' ')
          
          templateCache.value[templateID] = {
            _id: templateID,
            dormName: dormName,
            roomType: roomType ? roomType.charAt(0).toUpperCase() + roomType.slice(1) : 'Unknown'
          }
          console.log(`Created fallback template for ${templateID}:`, templateCache.value[templateID])
        }
      }
    }
  }
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

// Save engagement data (likes and comments) to localStorage
const saveEngagementToStorage = (postId: string) => {
  try {
    // Get existing engagement data
    const engagementData = JSON.parse(localStorage.getItem('postEngagement') || '{}')
    
    // Save for this post with current user ID
    const currentUserID = authStore.userID
    engagementData[postId] = {
      likeCount: likeCounts.value[postId] || 0,
      likedByUserID: likedPosts.value[postId] ? currentUserID : null,
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
      likedPosts.value[postId] = postEngagement.likedByUserID === currentUserID
      
      postComments.value[postId] = postEngagement.comments || []
      
      // Cache usernames from comments
      if (postEngagement.comments) {
        for (const comment of postEngagement.comments) {
          if (comment.authorID) {
            authorCache.value[comment.authorID] = getCommentAuthorName(comment.authorID)
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

const toggleComments = (post: any) => {
  showComments.value[post._id] = !showComments.value[post._id]
}

const toggleLike = async (post: any) => {
  if (!authStore.userID) return
  const postId = post._id
  
  // Get current state
  const currentlyLiked = likedPosts.value[postId] || false
  const currentCount = likeCounts.value[postId] || 0
  
  // Toggle immediately for better UX
  if (currentlyLiked) {
    likeCounts.value[postId] = Math.max(0, currentCount - 1)
    likedPosts.value[postId] = false
  } else {
    likeCounts.value[postId] = currentCount + 1
    likedPosts.value[postId] = true
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
      likedPosts.value[postId] = response.upvoted
      // Update localStorage with API response
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
      // Replace local comment with API version (which has official ID)
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

// Load initial posts
onMounted(() => {
  loadAllPosts()
})

// Reload posts when the route is activated (when navigating back to this page)
onActivated(() => {
  // Reload posts when coming back to this page
  if (selectedDorms.value.length === 0 && selectedRoomTypes.value.length === 0) {
    loadAllPosts()
  } else {
    loadFilteredPosts()
  }
})

// Watch for route changes to refresh data
watch(() => route.path, (newPath, oldPath) => {
  // If we're navigating back to this page from create-post
  if (newPath === '/dorms' && oldPath) {
    console.log('Route changed to /dorms, refreshing posts...')
    if (selectedDorms.value.length === 0 && selectedRoomTypes.value.length === 0) {
      loadAllPosts()
    } else {
      loadFilteredPosts()
    }
  }
})
</script>

<style scoped>
.dorms-layouts-page {
  background: transparent;
  min-height: calc(100vh - 80px);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
}

.hero-section h1 {
  color: white;
  margin-bottom: 10px;
  font-size: 48px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-section .tagline {
  color: white;
  font-size: 22px;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.filters-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.filter-group {
  margin-bottom: 30px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.filter-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-chip {
  background: #f8f9fa;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.filter-chip:hover {
  border-color: rgba(29, 178, 235, 0.5);
  background: #e3f2fd;
}

.filter-chip.active {
  background: rgba(29, 178, 235, 0.4);
  border-color: rgba(29, 178, 235, 0.7);
  color: white;
  box-shadow: 0 0 20px rgba(29, 178, 235, 0.6);
}

.room-icon {
  font-size: 16px;
}

.clear-filters {
  margin-top: 20px;
  text-align: center;
}

.clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.clear-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(220, 53, 69, 0.5);
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.active-filter-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.remove-filter {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.feed-section {
  margin-top: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.feed-header h2 {
  color: white;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.feed-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.refresh-btn {
  background: linear-gradient(135deg, #1db2eb, #00d4ff);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #00d4ff, #1db2eb);
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(29, 178, 235, 0.6), 0 0 50px rgba(0, 212, 255, 0.4);
}

.refresh-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.create-post-btn {
  background: linear-gradient(135deg, #1db2eb, #00d4ff);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: inline-block;
}

.create-post-btn:hover {
  background: linear-gradient(135deg, #00d4ff, #1db2eb);
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(29, 178, 235, 0.6), 0 0 50px rgba(0, 212, 255, 0.4);
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

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

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

.no-posts {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.no-posts-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.no-posts h3 {
  color: #495057;
  margin-bottom: 12px;
  font-size: 24px;
}

.no-posts p {
  color: #6c757d;
  font-size: 16px;
}

/* Login Required Section */
.login-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  background: linear-gradient(145deg, rgba(22, 36, 71, 0.95), rgba(31, 64, 104, 0.95));
  padding: 60px 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(29, 178, 235, 0.3), 0 0 60px rgba(0, 212, 255, 0.15);
  text-align: center;
  max-width: 500px;
  border: 2px solid rgba(29, 178, 235, 0.4);
}

.login-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.login-card h2 {
  color: #1db2eb;
  margin-bottom: 15px;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 0 20px rgba(29, 178, 235, 0.5);
}

.login-card p {
  color: white;
  font-size: 16px;
  line-height: 1.6;
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
  display: inline-block;
}

.cta-button.primary {
  background: linear-gradient(135deg, #1db2eb, #00d4ff);
  color: white;
}

.cta-button.primary:hover {
  background: linear-gradient(135deg, #00d4ff, #1db2eb);
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(29, 178, 235, 0.6), 0 0 50px rgba(0, 212, 255, 0.4);
}

.cta-button.secondary {
  background: rgba(29, 178, 235, 0.2);
  color: white;
  border: 2px solid rgba(29, 178, 235, 0.5);
}

.cta-button.secondary:hover {
  background: rgba(29, 178, 235, 0.3);
  border-color: rgba(29, 178, 235, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(29, 178, 235, 0.4);
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px 15px;
  }
  
  h1 {
    font-size: 32px;
  }
  
  .filter-grid {
    gap: 8px;
  }
  
  .filter-chip {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
