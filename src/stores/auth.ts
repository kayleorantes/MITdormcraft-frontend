import { defineStore } from 'pinia'
import { authAPI, sessionAPI } from '@/services/api'
import type { RegisterData, User } from '@/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userID: null as string | null,
    token: null as string | null,
    username: null as string | null,
    bio: null as string | null,
    mitKerberos: null as string | null,
    profileImageURL: null as string | null,
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
        console.log('Registration response:', response)
        
        // The response might be the userID directly or wrapped in a userID field
        const userID = response.userID || response
        
        if (userID && typeof userID === 'string') {
          // Create a session to get a token
          console.log('Creating session for user:', userID)
          const token = await sessionAPI.createSession(userID)
          console.log('Session token created:', token)
          
          this.userID = userID
          this.token = token
          this.username = userData.username
          this.bio = userData.bio
          this.isAuthenticated = true
          
          // Store in localStorage for persistence
          localStorage.setItem('userID', userID)
          localStorage.setItem('token', token)
          localStorage.setItem('username', userData.username)
          localStorage.setItem('bio', userData.bio)
          localStorage.setItem('mitKerberos', userData.mitKerberos)
          
          return { success: true, userID: userID }
        } else {
          throw new Error('Registration failed: No userID returned from server')
        }
      } catch (error: any) {
        console.error('Registration error:', error)
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
          // Create a session to get a token
          console.log('Creating session for user:', response.userID)
          const token = await sessionAPI.createSession(response.userID)
          console.log('Session token created:', token)
          
          this.userID = response.userID
          this.token = token
          this.isAuthenticated = true
          
          // Store in localStorage for persistence
          localStorage.setItem('userID', response.userID)
          localStorage.setItem('token', token)
          
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
    async logout() {
      // Delete session from backend if we have a token
      if (this.token) {
        try {
          await sessionAPI.deleteSession(this.token)
        } catch (error) {
          console.error('Failed to delete session:', error)
          // Continue with logout even if session deletion fails
        }
      }
      
      this.userID = null
      this.token = null
      this.username = null
      this.bio = null
      this.mitKerberos = null
      this.profileImageURL = null
      this.isAuthenticated = false
      this.error = null
      
      // Clear localStorage
      localStorage.removeItem('userID')
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('bio')
      localStorage.removeItem('mitKerberos')
      localStorage.removeItem('profileImageURL')
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const userID = localStorage.getItem('userID')
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      const bio = localStorage.getItem('bio')
      const mitKerberos = localStorage.getItem('mitKerberos')
      const profileImageURL = localStorage.getItem('profileImageURL')
      
      if (userID && token) {
        this.userID = userID
        this.token = token
        this.username = username
        this.bio = bio
        this.mitKerberos = mitKerberos
        this.profileImageURL = profileImageURL
        this.isAuthenticated = true
      }
    },

    // Update profile image
    setProfileImage(imageURL: string) {
      this.profileImageURL = imageURL
      localStorage.setItem('profileImageURL', imageURL)
    },

    // Clear error state
    clearError() {
      this.error = null
    },
  },
})
