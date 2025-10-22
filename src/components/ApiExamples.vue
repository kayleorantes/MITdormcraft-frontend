<template>
  <div class="api-examples">
    <h2>API Service Examples</h2>
    
    <!-- Room Templates Section -->
    <div class="section">
      <h3>Room Templates</h3>
      <div class="form-group">
        <label>Dorm Name:</label>
        <input v-model="templateFilters.dormName" placeholder="e.g., Next House" />
      </div>
      <div class="form-group">
        <label>Room Type:</label>
        <input v-model="templateFilters.roomType" placeholder="e.g., Single" />
      </div>
      <button @click="searchTemplates" :disabled="isLoading">
        {{ isLoading ? 'Searching...' : 'Search Templates' }}
      </button>
      
      <div v-if="templates.length > 0" class="results">
        <h4>Found Templates:</h4>
        <div v-for="template in templates" :key="template.templateID" class="template-item">
          <strong>{{ template.dormName }} - {{ template.roomType }}</strong>
          <small>(ID: {{ template.templateID }})</small>
        </div>
      </div>
    </div>

    <!-- Design Posts Section -->
    <div class="section">
      <h3>Design Posts</h3>
      <div class="form-group">
        <label>Template ID:</label>
        <input v-model="postFilters.templateID" placeholder="Enter template ID" />
      </div>
      <button @click="searchPosts" :disabled="isLoading">
        {{ isLoading ? 'Searching...' : 'Search Posts' }}
      </button>
      
      <div v-if="posts.length > 0" class="results">
        <h4>Found Posts:</h4>
        <div v-for="post in posts" :key="post.postID" class="post-item">
          <h5>{{ post.title }}</h5>
          <p>{{ post.description }}</p>
          <small>By: {{ post.authorID }} | Created: {{ post.createdAt }}</small>
        </div>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="section">
      <h3>User Profile</h3>
      <div class="form-group">
        <label>User ID:</label>
        <input v-model="userFilters.userID" placeholder="Enter user ID" />
      </div>
      <button @click="getUserProfile" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Get User Profile' }}
      </button>
      
      <div v-if="userProfile" class="results">
        <h4>User Profile:</h4>
        <div class="user-item">
          <p><strong>Username:</strong> {{ userProfile.username }}</p>
          <p><strong>Bio:</strong> {{ userProfile.bio || 'No bio set' }}</p>
          <p><strong>Created:</strong> {{ userProfile.createdAt }}</p>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="error = null" class="close-error">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { roomTemplateAPI, designPostAPI, userAccountAPI } from '@/services/api'
import type { RoomTemplate, DesignPost, User, TemplateFilters } from '@/types/api'

// Reactive data
const isLoading = ref(false)
const error = ref<string | null>(null)
const templates = ref<RoomTemplate[]>([])
const posts = ref<DesignPost[]>([])
const userProfile = ref<User | null>(null)

// Filter objects
const templateFilters = ref<TemplateFilters>({
  dormName: '',
  roomType: '',
})

const postFilters = ref<{ templateID: string }>({
  templateID: '',
})

const userFilters = ref<{ userID: string }>({
  userID: '',
})

// Search templates
const searchTemplates = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const filters: TemplateFilters = {}
    if (templateFilters.value.dormName) filters.dormName = templateFilters.value.dormName
    if (templateFilters.value.roomType) filters.roomType = templateFilters.value.roomType
    
    const response = await roomTemplateAPI.findTemplate(filters)
    templates.value = response || []
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to search templates'
    templates.value = []
  } finally {
    isLoading.value = false
  }
}

// Search posts
const searchPosts = async () => {
  if (!postFilters.value.templateID) {
    error.value = 'Please enter a template ID'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await designPostAPI.findPostsByTemplate(postFilters.value.templateID)
    posts.value = response || []
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to search posts'
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

// Get user profile
const getUserProfile = async () => {
  if (!userFilters.value.userID) {
    error.value = 'Please enter a user ID'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await userAccountAPI.getUser(userFilters.value.userID)
    userProfile.value = response.user
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to get user profile'
    userProfile.value = null
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.api-examples {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  background: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.section h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.results {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.template-item,
.post-item,
.user-item {
  padding: 10px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #28a745;
}

.template-item:last-child,
.post-item:last-child,
.user-item:last-child {
  margin-bottom: 0;
}

.post-item h5 {
  margin: 0 0 5px 0;
  color: #333;
}

.post-item p {
  margin: 5px 0;
  color: #666;
}

.post-item small,
.template-item small {
  color: #888;
  font-size: 12px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  position: relative;
}

.close-error {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #721c24;
  padding: 0;
  width: 20px;
  height: 20px;
}

.close-error:hover {
  background: rgba(114, 28, 36, 0.1);
  border-radius: 50%;
}
</style>
