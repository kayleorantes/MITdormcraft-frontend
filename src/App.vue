<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

// Computed property to check if user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
}
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
          <RouterLink to="/dorms" class="nav-link">Dorms & Layouts</RouterLink>
          <RouterLink v-if="isLoggedIn" to="/create-post" class="nav-link">Create Post</RouterLink>
          <RouterLink v-if="isLoggedIn" to="/profile" class="nav-link">My Profile</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/register" class="nav-link">Register</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/login" class="nav-link">Login</RouterLink>
        </nav>
        
        <!-- User info when logged in -->
        <div v-if="isLoggedIn" class="user-info">
          <span class="welcome-text">Hello, {{ authStore.username || 'User' }}!</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
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
  background: linear-gradient(135deg, #0a1a2e, #162447, #1f4068);
  color: white;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(29, 178, 235, 0.3);
  border-bottom: 2px solid rgba(29, 178, 235, 0.5);
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
  background: rgba(29, 178, 235, 0.3);
  border-color: rgba(29, 178, 235, 0.5);
  box-shadow: 0 0 15px rgba(29, 178, 235, 0.5);
}

.nav-link.router-link-active {
  background: rgba(29, 178, 235, 0.4);
  border-color: rgba(29, 178, 235, 0.7);
  box-shadow: 0 0 20px rgba(29, 178, 235, 0.6);
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
  padding: 6px 12px;
}

.logout-btn {
  background: rgba(220, 53, 69, 0.8);
  color: white;
  border: 2px solid rgba(220, 53, 69, 0.6);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 1);
  border-color: rgba(255, 96, 107, 0.8);
  box-shadow: 0 0 15px rgba(220, 53, 69, 0.5);
  transform: translateY(-1px);
}

.app-main {
  flex: 1;
  background: transparent;
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
