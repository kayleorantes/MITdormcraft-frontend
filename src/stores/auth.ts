import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'
import type { RegisterData, User } from '@/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userID: null as string | null,
    username: null as string | null,
    bio: null as string | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.userID !== null,
    userProfile: (state) => ({
      userID: state.userID,
      username: state.username,
      bio: state.bio,
    }),
  },

  actions: {
    // Register a new user account
    async register(userData: RegisterData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await authAPI.registerAndCreateAccount(userData)
        
        if (response.userID) {
          this.userID = response.userID
          this.username = userData.username
          this.bio = userData.bio
          this.isAuthenticated = true
          
          // Store in localStorage for persistence
          localStorage.setItem('userID', response.userID)
          localStorage.setItem('username', userData.username)
          localStorage.setItem('bio', userData.bio)
          
          return { success: true, userID: response.userID }
        } else {
          throw new Error('Registration failed: No userID returned')
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || error.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Login with credentials
    async login(mitKerberos: string, credentialData: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await authAPI.verifyCredentials({
          mitKerberos,
          credential_data: credentialData,
        })
        
        if (response.userID) {
          this.userID = response.userID
          this.isAuthenticated = true
          
          // Store in localStorage for persistence
          localStorage.setItem('userID', response.userID)
          
          // Fetch user profile data
          await this.fetchUserProfile(response.userID)
          
          return { success: true, userID: response.userID }
        } else {
          throw new Error('Invalid credentials')
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || error.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Fetch user profile data
    async fetchUserProfile(userID: string) {
      try {
        const { userAccountAPI } = await import('@/services/api')
        const response = await userAccountAPI.getUser(userID)
        
        if (response.user) {
          this.username = response.user.username
          this.bio = response.user.bio
          
          // Update localStorage
          localStorage.setItem('username', response.user.username)
          localStorage.setItem('bio', response.user.bio)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    },

    // Logout user
    logout() {
      this.userID = null
      this.username = null
      this.bio = null
      this.isAuthenticated = false
      this.error = null
      
      // Clear localStorage
      localStorage.removeItem('userID')
      localStorage.removeItem('username')
      localStorage.removeItem('bio')
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const userID = localStorage.getItem('userID')
      const username = localStorage.getItem('username')
      const bio = localStorage.getItem('bio')
      
      if (userID) {
        this.userID = userID
        this.username = username
        this.bio = bio
        this.isAuthenticated = true
      }
    },

    // Clear error state
    clearError() {
      this.error = null
    },
  },
})
