<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

// Computed property to check if user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="app-title">MIT DormCraft</h1>
          <p class="app-subtitle">Share your dorm room designs</p>
        </div>
        
        <nav class="main-nav">
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/register" class="nav-link">Register</RouterLink>
          <RouterLink to="/login" class="nav-link">Login</RouterLink>
          <RouterLink to="/about" class="nav-link">About</RouterLink>
        </nav>
        
        <!-- User info when logged in -->
        <div v-if="isLoggedIn" class="user-info">
          <span class="welcome-text">Welcome, {{ authStore.username || 'User' }}!</span>
          <button @click="authStore.logout()" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.logo-section {
  flex: 1;
  min-width: 200px;
}

.app-title {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.app-subtitle {
  margin: 0;
  font-size: 14px;
  color: #bdc3c7;
  font-weight: 400;
}

.main-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.welcome-text {
  color: #ecf0f1;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background: #c0392b;
}

.app-main {
  flex: 1;
  background: #f8f9fa;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .logo-section {
    min-width: auto;
  }
  
  .app-title {
    font-size: 24px;
  }
  
  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .user-info {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 15px;
  }
  
  .app-title {
    font-size: 20px;
  }
  
  .main-nav {
    gap: 8px;
  }
  
  .nav-link {
    padding: 5px 10px;
    font-size: 13px;
  }
}
</style>
