<template>
  <div class="auth-container">
    <div v-if="!authStore.isLoggedIn" class="auth-forms">
      <!-- Login Form -->
      <div class="form-section">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-kerberos">MIT Kerberos:</label>
            <input
              id="login-kerberos"
              v-model="loginForm.mitKerberos"
              type="text"
              required
              placeholder="your-kerberos@mit.edu"
            />
          </div>
          <div class="form-group">
            <label for="login-password">Password:</label>
            <input
              id="login-password"
              v-model="loginForm.credentialData"
              type="password"
              required
              placeholder="Your password"
            />
          </div>
          <button type="submit" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>

      <!-- Registration Form -->
      <div class="form-section">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="reg-username">Username:</label>
            <input
              id="reg-username"
              v-model="registerForm.username"
              type="text"
              required
              placeholder="Choose a username"
            />
          </div>
          <div class="form-group">
            <label for="reg-kerberos">MIT Kerberos:</label>
            <input
              id="reg-kerberos"
              v-model="registerForm.mitKerberos"
              type="text"
              required
              placeholder="your-kerberos@mit.edu"
            />
          </div>
          <div class="form-group">
            <label for="reg-bio">Bio:</label>
            <textarea
              id="reg-bio"
              v-model="registerForm.bio"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="reg-password">Password:</label>
            <input
              id="reg-password"
              v-model="registerForm.credentialData"
              type="password"
              required
              placeholder="Choose a password"
            />
          </div>
          <button type="submit" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Registering...' : 'Register' }}
          </button>
        </form>
      </div>
    </div>

    <!-- User Profile (when logged in) -->
    <div v-else class="user-profile">
      <h2>Welcome, {{ authStore.username }}!</h2>
      <p><strong>User ID:</strong> {{ authStore.userID }}</p>
      <p><strong>Bio:</strong> {{ authStore.bio || 'No bio set' }}</p>
      <button @click="authStore.logout()" class="logout-btn">
        Logout
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
      <button @click="authStore.clearError()" class="close-error">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login form data
const loginForm = ref({
  mitKerberos: '',
  credentialData: '',
})

// Registration form data
const registerForm = ref({
  username: '',
  mitKerberos: '',
  bio: '',
  credentialData: '',
})

// Handle login
const handleLogin = async () => {
  const result = await authStore.login(
    loginForm.value.mitKerberos,
    loginForm.value.credentialData
  )
  
  if (result.success) {
    // Clear form
    loginForm.value.mitKerberos = ''
    loginForm.value.credentialData = ''
  }
}

// Handle registration
const handleRegister = async () => {
  const result = await authStore.register({
    username: registerForm.value.username,
    mitKerberos: registerForm.value.mitKerberos,
    bio: registerForm.value.bio,
    credential_data: registerForm.value.credentialData
  })
  
  if (result.success) {
    // Clear form
    registerForm.value.username = ''
    registerForm.value.mitKerberos = ''
    registerForm.value.bio = ''
    registerForm.value.credentialData = ''
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.auth-forms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.form-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.form-section h2 {
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.logout-btn {
  background: #dc3545;
}

.logout-btn:hover {
  background: #c82333;
}

.user-profile {
  background: #e8f5e8;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.user-profile h2 {
  color: #2d5a2d;
  margin-top: 0;
}

.user-profile p {
  margin: 10px 0;
  color: #555;
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

@media (max-width: 768px) {
  .auth-forms {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
