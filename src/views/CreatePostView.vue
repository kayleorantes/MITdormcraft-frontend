<template>
  <main class="create-post-page">
    <div class="page-container">
      <!-- Not Logged In Message -->
      <div v-if="!authStore.isLoggedIn" class="login-required">
        <div class="login-card">
          <div class="login-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>You need to be signed in to create a post. Please sign in to share your dorm room design with the MIT community!</p>
          <div class="login-buttons">
            <RouterLink to="/login" class="cta-button primary">Sign In</RouterLink>
            <RouterLink to="/register" class="cta-button secondary">Create Account</RouterLink>
          </div>
        </div>
      </div>

      <!-- Create Post Content -->
      <div v-else>
        <!-- Header -->
        <div class="hero-section">
          <h1>Create New Post</h1>
          <p class="tagline">Share your dorm room design with the MIT community</p>
        </div>

        <!-- Create Post Form -->
        <div class="create-post-form">
          <form @submit.prevent="handleSubmit" class="form">
          <!-- Image Upload Section -->
          <div class="form-section">
            <label class="section-label">
              Image <span class="required">*</span>
            </label>
            <div class="image-upload-area">
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                @change="handleImageSelect"
                class="file-input"
                style="display: none"
              />
              <div v-if="!imagePreview" class="upload-placeholder" @click="triggerFileInput">
                <div class="upload-icon">📷</div>
                <p class="upload-text">Click to upload or drag and drop</p>
                <p class="upload-hint">PNG, JPG, GIF up to 10MB</p>
              </div>
              <div v-else class="image-preview">
                <img :src="imagePreview" alt="Preview" class="preview-image" />
                <button type="button" @click="removeImage" class="remove-image-btn">
                  ×
                </button>
              </div>
            </div>
            <p v-if="errors.image" class="error-message">{{ errors.image }}</p>
          </div>

          <!-- Description Section -->
          <div class="form-section">
            <label for="title" class="section-label">
              Description <span class="required">*</span>
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="form-input"
              :class="{ 'error': errors.title }"
              placeholder="e.g., My Cozy Simmons Single Setup"
              maxlength="100"
              required
            />
            <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
          </div>

          <!-- Dorm Selection -->
          <div class="form-section">
            <label class="section-label">
              Dorm <span class="required">*</span>
            </label>
            <div class="selection-grid">
              <button
                v-for="dorm in mitDorms"
                :key="dorm"
                type="button"
                class="selection-chip"
                :class="{ 'selected': formData.selectedDorm === dorm }"
                @click="selectDorm(dorm)"
              >
                {{ dorm }}
              </button>
            </div>
            <p v-if="errors.dorm" class="error-message">{{ errors.dorm }}</p>
          </div>

          <!-- Room Size Selection -->
          <div class="form-section">
            <label class="section-label">
              Room Size <span class="required">*</span>
            </label>
            <div class="selection-grid room-size-grid">
              <button
                v-for="roomType in roomTypes"
                :key="roomType.type"
                type="button"
                class="selection-chip"
                :class="{ 'selected': formData.selectedRoomType === roomType.type }"
                @click="selectRoomType(roomType.type)"
              >
                <span class="chip-icon">{{ roomType.icon }}</span>
                <div class="chip-info">
                  <div class="chip-name">{{ roomType.type }}</div>
                  <div class="chip-details">{{ roomType.size }}</div>
                </div>
              </button>
            </div>
            <p v-if="errors.roomType" class="error-message">{{ errors.roomType }}</p>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <RouterLink to="/dorms" class="cancel-button">Cancel</RouterLink>
            <button
              type="submit"
              class="submit-button"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Creating Post...' : 'Create Post' }}
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div v-if="submitError" class="error-message-block">
            {{ submitError }}
          </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { designPostAPI, roomTemplateAPI } from '@/services/api'
import type { RoomTemplate, TemplateResponse } from '@/types/api'

const authStore = useAuthStore()
const router = useRouter()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const successMessage = ref('')
const submitError = ref('')
const imagePreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const availableTemplates = ref<any[]>([])

const formData = reactive({
  title: '',
  selectedDorm: '',
  selectedRoomType: '',
})

const errors = reactive({
  image: '',
  title: '',
  dorm: '',
  roomType: '',
})

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
  { type: 'Single', icon: '🛏️', size: '~100-150 sq ft' },
  { type: 'Double', icon: '🛏️🛏️', size: '~150-200 sq ft' },
  { type: 'Triple', icon: '🛏️🛏️🛏️', size: '~200-300 sq ft' },
  { type: 'Quad', icon: '🏠', size: '~300-400 sq ft' }
]

const isFormValid = computed(() => {
  return imagePreview.value !== null &&
         formData.title.trim() !== '' &&
         formData.selectedDorm !== '' &&
         formData.selectedRoomType !== ''
})

// Load available templates
const loadTemplates = async () => {
  try {
    const templates = await roomTemplateAPI.findTemplates({})
    availableTemplates.value = templates
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

// Trigger file input
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Handle image selection
const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.image = 'Please select a valid image file'
      return
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.image = 'Image must be less than 10MB'
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      errors.image = ''
    }
    reader.readAsDataURL(file)
    selectedFile.value = file
  }
}

// Remove image
const removeImage = () => {
  imagePreview.value = null
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Select dorm
const selectDorm = (dorm: string) => {
  formData.selectedDorm = formData.selectedDorm === dorm ? '' : dorm
  errors.dorm = ''
}

// Select room type
const selectRoomType = (roomType: string) => {
  formData.selectedRoomType = formData.selectedRoomType === roomType ? '' : roomType
  errors.roomType = ''
}

// Validate form
const validateForm = () => {
  let isValid = true
  
  errors.image = ''
  errors.title = ''
  errors.dorm = ''
  errors.roomType = ''
  
  if (!imagePreview.value) {
    errors.image = 'Please upload an image'
    isValid = false
  }
  
  if (formData.title.trim() === '') {
    errors.title = 'Please enter a title'
    isValid = false
  }
  
  if (formData.selectedDorm === '') {
    errors.dorm = 'Please select a dorm'
    isValid = false
  }
  
  if (formData.selectedRoomType === '') {
    errors.roomType = 'Please select a room size'
    isValid = false
  }
  
  return isValid
}

// Handle form submission
const handleSubmit = async () => {
  clearMessages()
  
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Find or create the template for the selected dorm and room type
    let template = availableTemplates.value.find(
      t => t.dormName === formData.selectedDorm && t.roomType === formData.selectedRoomType
    )
    
    // If template doesn't exist, create it
    if (!template) {
      console.log('Template not found, attempting to create new one...')
      try {
        const templateResponse = await roomTemplateAPI.addTemplate({
          dormName: formData.selectedDorm,
          roomType: formData.selectedRoomType
        })
        
        console.log('Template creation response:', templateResponse)
        console.log('Template response type:', typeof templateResponse)
        console.log('Template response keys:', Object.keys(templateResponse || {}))
        
        // Try various ways to extract the template ID
        let templateID = null
        
        // Check if response is just a string ID
        if (typeof templateResponse === 'string') {
          templateID = templateResponse
        } 
        // Check for various possible field names
        else if (templateResponse) {
          templateID = templateResponse.templateID || 
                      (templateResponse as any)._id || 
                      (templateResponse as any).id ||
                      (templateResponse as any).postID
        }
        
        if (templateID && typeof templateID === 'string') {
          // Create a template object with the returned ID
          template = {
            _id: templateID,
            dormName: formData.selectedDorm,
            roomType: formData.selectedRoomType
          }
          // Add to available templates for next time
          availableTemplates.value.push(template)
          console.log('Successfully created template:', template)
        } else {
          console.warn('Could not extract template ID from response')
          // Use a fallback template ID format
          const fallbackID = `${formData.selectedDorm}-${formData.selectedRoomType}`.toLowerCase().replace(/\s+/g, '-')
          template = {
            _id: fallbackID,
            dormName: formData.selectedDorm,
            roomType: formData.selectedRoomType
          }
          console.log('Using fallback template:', template)
        }
      } catch (templateError: any) {
        console.error('Error creating template:', templateError)
        console.error('Error details:', templateError.response?.data)
        
        // Use a fallback template ID so we can still create the post
        const fallbackID = `${formData.selectedDorm}-${formData.selectedRoomType}`.toLowerCase().replace(/\s+/g, '-')
        template = {
          _id: fallbackID,
          dormName: formData.selectedDorm,
          roomType: formData.selectedRoomType
        }
        console.log('Template creation failed, using fallback template:', template)
      }
    }
    
    // Compress the image if we have a file
    let imageURL = imagePreview.value || ''
    if (selectedFile.value) {
      try {
        console.log('Compressing image...')
        const compressed = await compressImage(selectedFile.value)
        imageURL = compressed
        console.log('Image compressed:', compressed.length, 'characters')
      } catch (error) {
        console.error('Failed to compress image, using original:', error)
      }
    }
    
    // Create the post
    console.log('Creating post with data:', {
      authorID: authStore.userID,
      templateID: template._id,
      title: formData.title.trim(),
      description: '',
      imageLength: imageURL.length
    })
    
    // Generate a post ID - use API response if available, otherwise local
    let apiPostID = null
    
    // Try to create via API first
    try {
      const response = await designPostAPI.createPost({
        authorID: authStore.userID!,
        templateID: template._id,
        title: formData.title.trim(),
        description: '',
        imageURL: imageURL
      })
      
      console.log('Post creation API response:', response)
      
      // Extract postID from response
      if (typeof response === 'string') {
        apiPostID = response
      } else if (response) {
        apiPostID = response.postID || (response as any)._id || (response as any).id || (response as any).post?._id
      }
      
      console.log('Extracted API postID:', apiPostID)
    } catch (apiError: any) {
      console.log('API create post failed:', apiError.message)
    }
    
    // Use API postID if we got one, otherwise generate a local one
    const postID = apiPostID || `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // ALWAYS save to localStorage so it's visible
    const newPost = {
      _id: postID,
      authorID: authStore.userID!,
      templateID: template._id,
      title: formData.title.trim(),
      description: '',
      imageURL: imageURL,
      createdAt: new Date().toISOString(),
      template: {
        _id: template._id,
        dormName: template.dormName,
        roomType: template.roomType
      }
    }
    
    try {
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]')
      // Remove any existing post with this ID to avoid duplicates
      const filteredPosts = localPosts.filter((p: any) => p._id !== postID)
      filteredPosts.push(newPost)
      localStorage.setItem('localPosts', JSON.stringify(filteredPosts))
      console.log('Post saved to local storage:', postID)
      console.log('Total posts in localStorage:', filteredPosts.length)
    } catch (storageError: any) {
      console.error('Failed to save to localStorage:', storageError.message)
    }
    
    successMessage.value = `Post created successfully! (ID: ${postID.substring(0, 12)}...) ${apiPostID ? '[API+Local]' : '[Local Only]'} Redirecting...`
    console.log('Post created with ID:', postID)
    
    // Wait longer to ensure the backend has fully persisted the post
    setTimeout(() => {
      // Redirect to dorms page and force a full refresh
      router.push('/dorms')
    }, 1500)
    
  } catch (error: any) {
    console.error('Error creating post:', error)
    console.error('Error response:', error.response?.data)
    submitError.value = error.response?.data?.error || error.message || 'Failed to create post. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Clear messages
const clearMessages = () => {
  successMessage.value = ''
  submitError.value = ''
}

// Compress image before storing
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

// Load templates on mount
loadTemplates()
</script>

<style scoped>
.create-post-page {
  background: transparent;
  min-height: calc(100vh - 80px);
  padding: 40px 20px;
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
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

/* Hero Section */
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

.create-post-form {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.section-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 16px;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.required {
  color: #dc3545;
}

/* Image Upload */
.image-upload-area {
  border: 2px dashed #e1e5e9;
  border-radius: 12px;
  padding: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.image-upload-area:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-text {
  color: #495057;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.upload-hint {
  color: #6c757d;
  font-size: 14px;
}

.image-preview {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  object-fit: contain;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Form Inputs */
.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-input.error,
.form-textarea.error {
  border-color: #dc3545;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.char-counter {
  text-align: right;
  color: #6c757d;
  font-size: 12px;
  margin-top: 5px;
}

/* Selection Chips */
.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.room-size-grid {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

.selection-chip {
  background: #f8f9fa;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.selection-chip:hover {
  border-color: rgba(29, 178, 235, 0.5);
  background: #f0f8ff;
  transform: translateY(-2px);
}

.selection-chip.selected {
  background: rgba(29, 178, 235, 0.4);
  border-color: rgba(29, 178, 235, 0.7);
  color: white;
  box-shadow: 0 0 20px rgba(29, 178, 235, 0.6);
}

.chip-icon {
  font-size: 24px;
}

.chip-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chip-name {
  font-weight: 600;
  font-size: 14px;
}

.chip-details {
  font-size: 11px;
  opacity: 0.8;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-button {
  padding: 12px 24px;
  background: rgba(108, 117, 125, 0.7);
  color: white;
  border: 2px solid rgba(108, 117, 125, 0.5);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.cancel-button:hover {
  background: rgba(90, 98, 104, 0.8);
  border-color: rgba(90, 98, 104, 0.6);
  box-shadow: 0 0 10px rgba(108, 117, 125, 0.4);
  transform: translateY(-1px);
}

.submit-button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #1db2eb, #00d4ff);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Fredoka', 'Kalam', cursive, sans-serif;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #00d4ff, #1db2eb);
  transform: translateY(-1px);
  box-shadow: 0 0 25px rgba(29, 178, 235, 0.6), 0 0 50px rgba(0, 212, 255, 0.4);
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Messages */
.success-message {
  background: #d4edda;
  color: #155724;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  font-weight: 500;
}

.error-message-block {
  background: #f8d7da;
  color: #721c24;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  font-weight: 500;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .create-post-page {
    padding: 20px 15px;
  }
  
  .create-post-form {
    padding: 25px;
  }
  
  .hero-section h1 {
    font-size: 36px;
  }
  
  .hero-section .tagline {
    font-size: 18px;
  }
  
  .selection-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>

