<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Create Account</h2>
      <p class="subtitle">Join MIT DormCraft to share your dorm room designs</p>
      
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Username Field -->
        <div class="form-group">
          <label for="username" class="form-label">
            Username <span class="required">*</span>
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="form-input"
            :class="{ 'error': errors.username }"
            placeholder="Choose a unique username"
            required
            @blur="validateUsername"
          />
          <div v-if="errors.username" class="error-message">
            {{ errors.username }}
          </div>
        </div>

        <!-- MIT Kerberos Field -->
        <div class="form-group">
          <label for="mitKerberos" class="form-label">
            MIT Kerberos <span class="required">*</span>
          </label>
          <input
            id="mitKerberos"
            v-model="formData.mitKerberos"
            type="email"
            class="form-input"
            :class="{ 'error': errors.mitKerberos }"
            placeholder="your-kerberos@mit.edu"
            required
            @blur="validateKerberos"
          />
          <div v-if="errors.mitKerberos" class="error-message">
            {{ errors.mitKerberos }}
          </div>
        </div>

        <!-- Bio Field -->
        <div class="form-group">
          <label for="bio" class="form-label">
            Bio
          </label>
          <textarea
            id="bio"
            v-model="formData.bio"
            class="form-textarea"
            :class="{ 'error': errors.bio }"
            placeholder="Tell us about yourself and your design interests..."
            rows="4"
            @blur="validateBio"
          ></textarea>
          <div v-if="errors.bio" class="error-message">
            {{ errors.bio }}
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">
            Password <span class="required">*</span>
          </label>
          <input
            id="password"
            v-model="formData.credential_data"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password }"
            placeholder="Choose a secure password"
            required
            @blur="validatePassword"
          />
          <div v-if="errors.password" class="error-message">
            {{ errors.password }}
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            Confirm Password <span class="required">*</span>
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Confirm your password"
            required
            @blur="validateConfirmPassword"
          />
          <div v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- API Error Message -->
        <div v-if="apiError" class="api-error-message">
          {{ apiError }}
        </div>
      </form>

      <!-- Login Link -->
      <div class="login-link">
        <p>Already have an account? <a href="#" @click.prevent="$emit('switch-to-login')">Sign in here</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { RegisterData } from '@/types/api'

// Define emits
const emit = defineEmits<{
  'switch-to-login': []
}>()

// Use auth store and router
const authStore = useAuthStore()
const router = useRouter()

// Form data
const formData = reactive<RegisterData & { confirmPassword: string }>({
  username: '',
  mitKerberos: '',
  bio: '',
  credential_data: '',
  confirmPassword: '',
})

// Form state
const isLoading = ref(false)
const apiError = ref('')
const successMessage = ref('')

// Validation errors
const errors = reactive<Record<string, string>>({
  username: '',
  mitKerberos: '',
  bio: '',
  password: '',
  confirmPassword: '',
})

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return formData.username.trim() !== '' &&
         formData.mitKerberos.trim() !== '' &&
         formData.credential_data.trim() !== '' &&
         formData.confirmPassword.trim() !== '' &&
         Object.values(errors).every(error => error === '')
})

// Validation functions
const validateUsername = () => {
  const username = formData.username.trim()
  if (!username) {
    errors.username = 'Username is required'
  } else if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters long'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores'
  } else {
    errors.username = ''
  }
}

const validateKerberos = () => {
  const kerberos = formData.mitKerberos.trim()
  if (!kerberos) {
    errors.mitKerberos = 'MIT Kerberos is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@mit\.edu$/i.test(kerberos)) {
    errors.mitKerberos = 'Please enter a valid MIT email address'
  } else {
    errors.mitKerberos = ''
  }
}

const validateBio = () => {
  const bio = formData.bio.trim()
  if (bio.length > 500) {
    errors.bio = 'Bio must be 500 characters or less'
  } else {
    errors.bio = ''
  }
}

const validatePassword = () => {
  const password = formData.credential_data.trim()
  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long'
  } else {
    errors.password = ''
  }
  
  // Re-validate confirm password if it's already filled
  if (formData.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  const password = formData.credential_data.trim()
  const confirmPassword = formData.confirmPassword.trim()
  
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  } else {
    errors.confirmPassword = ''
  }
}

// Clear all errors
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  apiError.value = ''
  successMessage.value = ''
}

// Handle form submission
const handleSubmit = async () => {
  // Clear previous messages
  clearErrors()
  
  // Validate all fields
  validateUsername()
  validateKerberos()
  validateBio()
  validatePassword()
  validateConfirmPassword()
  
  // Check if form is valid
  if (!isFormValid.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Prepare data for API call
    const registrationData: RegisterData = {
      username: formData.username.trim(),
      mitKerberos: formData.mitKerberos.trim(),
      bio: formData.bio.trim(),
      credential_data: formData.credential_data.trim(),
    }
    
    // Call the auth store register method
    const result = await authStore.register(registrationData)
    
    if (result.success) {
      // Success - user is now logged in via Pinia store
      successMessage.value = `Account created successfully! Welcome, ${authStore.username || 'user'}!`
      
      // Reset form
      Object.keys(formData).forEach(key => {
        (formData as any)[key] = ''
      })
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      throw new Error(result.error || 'Registration failed')
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle different types of errors
    if (error.response?.data?.error) {
      const errorMessage = error.response.data.error
      
      // Handle specific error cases
      if (errorMessage.includes('username') && errorMessage.includes('exist')) {
        errors.username = 'This username is already taken'
      } else if (errorMessage.includes('mitKerberos') && errorMessage.includes('exist')) {
        errors.mitKerberos = 'This MIT Kerberos is already registered'
      } else {
        apiError.value = errorMessage
      }
    } else {
      apiError.value = error.message || 'Registration failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.register-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.register-form h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #6c757d;
  margin-bottom: 30px;
  font-size: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 6px;
  font-size: 14px;
}

.required {
  color: #dc3545;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #fff;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: #dc3545;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
  font-weight: 500;
}

.submit-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3, #004085);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin-top: 16px;
  font-weight: 500;
}

.api-error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-top: 16px;
  font-weight: 500;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.login-link p {
  color: #6c757d;
  margin: 0;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 600px) {
  .register-container {
    padding: 10px;
  }
  
  .register-form {
    padding: 20px;
  }
  
  .register-form h2 {
    font-size: 24px;
  }
}
</style>
