<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Sign In</h2>
      <p class="subtitle">Welcome back to MIT DormCraft</p>
      
      <form @submit.prevent="handleSubmit" class="form">
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
            :disabled="isLoading"
          />
          <div v-if="errors.mitKerberos" class="error-message">
            {{ errors.mitKerberos }}
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">
            Password <span class="required">*</span>
          </label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Enter your password"
              required
              @blur="validatePassword"
              :disabled="isLoading"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
              :disabled="isLoading"
            >
              <span v-if="showPassword">👁️</span>
              <span v-else>👁️‍🗨️</span>
            </button>
          </div>
          <div v-if="errors.password" class="error-message">
            {{ errors.password }}
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message-block">
          {{ errorMessage }}
        </div>
      </form>

      <!-- Register Link -->
      <div class="register-link">
        <p>Don't have an account? <a href="#" @click.prevent="$emit('switch-to-register')">Create one here</a></p>
      </div>

      <!-- Forgot Password Link -->
      <div class="forgot-password-link">
        <a href="#" @click.prevent="handleForgotPassword">Forgot your password?</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { LoginData } from '@/types/api'

// Define emits
const emit = defineEmits<{
  'switch-to-register': []
}>()

// Use auth store
const authStore = useAuthStore()
const router = useRouter()

// Form data
const formData = reactive({
  mitKerberos: '',
  password: '',
})

// Form state
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

// Validation errors
const errors = reactive<Record<string, string>>({
  mitKerberos: '',
  password: '',
})

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return formData.mitKerberos.trim() !== '' &&
         formData.password.trim() !== '' &&
         Object.values(errors).every(error => error === '')
})

// Validation functions
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

const validatePassword = () => {
  const password = formData.password.trim()
  if (!password) {
    errors.password = 'Password is required'
  } else {
    errors.password = ''
  }
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Clear all messages and errors
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// Handle form submission
const handleSubmit = async () => {
  // Clear previous messages
  clearMessages()
  
  // Validate all fields
  validateKerberos()
  validatePassword()
  
  // Check if form is valid
  if (!isFormValid.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Prepare data for API call
    const loginData = {
      mitKerberos: formData.mitKerberos.trim(),
      credential_data: formData.password.trim(),
    }
    
    // Call the login method from auth store (which uses verifyCredentials internally)
    const result = await authStore.login(loginData.mitKerberos, loginData.credential_data)
    
    if (result.success) {
      // Success - user is now logged in via Pinia store
      successMessage.value = `Welcome back! Successfully signed in as ${authStore.username || 'user'}.`
      
      // Clear form
      formData.mitKerberos = ''
      formData.password = ''
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      // Login failed
      errorMessage.value = result.error || 'Invalid credentials'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Handle different types of errors
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Invalid credentials'
    }
  } finally {
    isLoading.value = false
  }
}

// Handle forgot password
const handleForgotPassword = () => {
  // For now, just show an alert
  // In a real app, this would redirect to a password reset page or show a modal
  alert('Password reset functionality would be implemented here.\n\nFor now, please contact your system administrator.')
}
</script>

<style scoped>
.login-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.login-form h2 {
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

.form-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.error {
  border-color: #dc3545;
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
  font-weight: 500;
}

.submit-button {
  background: linear-gradient(135deg, #28a745, #20c997);
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
  background: linear-gradient(135deg, #20c997, #17a2b8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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

.error-message-block {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-top: 16px;
  font-weight: 500;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.register-link p {
  color: #6c757d;
  margin: 0;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

.forgot-password-link {
  text-align: center;
  margin-top: 16px;
}

.forgot-password-link a {
  color: #6c757d;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password-link a:hover {
  color: #007bff;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 600px) {
  .login-container {
    padding: 10px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .login-form h2 {
    font-size: 24px;
  }
}
</style>
