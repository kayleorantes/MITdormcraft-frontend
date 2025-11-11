import axios from 'axios'
import type {
  RegisterData,
  LoginData,
  CreatePostData,
  EditPostData,
  DeletePostData,
  ToggleUpvoteData,
  AddCommentData,
  DeleteCommentData,
  EditCommentData,
  TemplateFilters,
  AddTemplateData,
  UpdateTemplateData,
  UpdateUserProfileData,
  AuthResponse,
  PostResponse,
  TemplateResponse,
  UserResponse,
  SuccessResponse,
  UpvoteResponse,
  CommentResponse,
  User,
  RoomTemplate,
  DesignPost,
  Engagement,
  ErrorResponse
} from '@/types/api'

// Get backend URL from environment variable or use default
// In production (Render), VITE_API_BASE_URL will be set to deployed backend URL
// In development, defaults to '/api' which Vite proxies to localhost:8000
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication headers
api.interceptors.request.use(
  (config) => {
    // Get userID from localStorage (acts as session token)
    const userID = localStorage.getItem('userID')
    if (userID) {
      // Add userID to headers for authentication
      config.headers['X-User-ID'] = userID
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear authentication data
      localStorage.removeItem('userID')
      localStorage.removeItem('username')
      localStorage.removeItem('bio')
      localStorage.removeItem('mitKerberos')
      localStorage.removeItem('profileImageURL')
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  // POST /api/Authentication/registerAndCreateAccount
  registerAndCreateAccount: async (data: RegisterData): Promise<UserResponse> => {
    const response = await api.post('/Authentication/registerAndCreateAccount', data)
    return response.data
  },

  // POST /api/Authentication/verifyCredentials
  verifyCredentials: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/Authentication/verifyCredentials', data)
    return response.data
  },
}

// Design Post API
export const designPostAPI = {
  // POST /api/DesignPost/createPost
  createPost: async (data: CreatePostData): Promise<PostResponse> => {
    const response = await api.post('/DesignPost/createPost', data)
    return response.data
  },

  // POST /api/DesignPost/getPost
  getPost: async (postID: string): Promise<{ post: DesignPost | null }> => {
    const response = await api.post('/DesignPost/getPost', { postID })
    return response.data
  },

  // POST /api/DesignPost/findPostsByTemplate
  findPostsByTemplate: async (templateID: string): Promise<DesignPost[]> => {
    const response = await api.post('/DesignPost/findPostsByTemplate', { templateID })
    return response.data
  },

  // POST /api/DesignPost/findPostsByAuthor
  findPostsByAuthor: async (authorID: string): Promise<DesignPost[]> => {
    const response = await api.post('/DesignPost/findPostsByAuthor', { authorID })
    return response.data
  },

  // POST /api/DesignPost/editPost
  editPost: async (data: EditPostData): Promise<SuccessResponse> => {
    const response = await api.post('/DesignPost/editPost', data)
    return response.data
  },

  // POST /api/DesignPost/deletePost
  deletePost: async (data: DeletePostData): Promise<SuccessResponse> => {
    const response = await api.post('/DesignPost/deletePost', data)
    return response.data
  },
}

// Engagement API
export const engagementAPI = {
  // POST /api/Engagement/getEngagementForPost
  getEngagementForPost: async (postID: string): Promise<{ engagement: Engagement }> => {
    const response = await api.post('/Engagement/getEngagementForPost', { postID })
    return response.data
  },

  // POST /api/Engagement/toggleUpvote
  toggleUpvote: async (data: ToggleUpvoteData): Promise<UpvoteResponse> => {
    const response = await api.post('/Engagement/toggleUpvote', data)
    return response.data
  },

  // POST /api/Engagement/addComment
  addComment: async (data: AddCommentData): Promise<CommentResponse> => {
    const response = await api.post('/Engagement/addComment', data)
    return response.data
  },

  // POST /api/Engagement/deleteComment
  deleteComment: async (data: DeleteCommentData): Promise<SuccessResponse> => {
    const response = await api.post('/Engagement/deleteComment', data)
    return response.data
  },

  // POST /api/Engagement/editComment
  editComment: async (data: EditCommentData): Promise<SuccessResponse> => {
    const response = await api.post('/Engagement/editComment', data)
    return response.data
  },
}

// Room Template API
export const roomTemplateAPI = {
  // POST /api/RoomTemplate/addTemplate
  addTemplate: async (data: AddTemplateData): Promise<TemplateResponse> => {
    const response = await api.post('/RoomTemplate/addTemplate', data)
    return response.data
  },

  // POST /api/RoomTemplate/getTemplate
  getTemplate: async (templateID: string): Promise<{ template: RoomTemplate | null }> => {
    const response = await api.post('/RoomTemplate/getTemplate', { templateID })
    return response.data
  },

  // POST /api/RoomTemplate/findTemplates
  findTemplates: async (filters: TemplateFilters = {}): Promise<RoomTemplate[]> => {
    const response = await api.post('/RoomTemplate/findTemplates', filters)
    return response.data
  },

  // POST /api/RoomTemplate/updateTemplate
  updateTemplate: async (data: UpdateTemplateData): Promise<SuccessResponse> => {
    const response = await api.post('/RoomTemplate/updateTemplate', data)
    return response.data
  },

  // POST /api/RoomTemplate/deleteTemplate
  deleteTemplate: async (data: { templateID: string }): Promise<SuccessResponse> => {
    const response = await api.post('/RoomTemplate/deleteTemplate', data)
    return response.data
  },
}

// User Account API
export const userAccountAPI = {
  // POST /api/UserAccount/getUser
  getUser: async (userID: string): Promise<{ user: User }> => {
    const response = await api.post('/UserAccount/getUser', { userID })
    return response.data
  },

  // POST /api/UserAccount/getUserByUsername
  getUserByUsername: async (username: string): Promise<{ user: User }> => {
    const response = await api.post('/UserAccount/getUserByUsername', { username })
    return response.data
  },

  // POST /api/UserAccount/updateUserProfile
  updateUserProfile: async (data: UpdateUserProfileData): Promise<SuccessResponse> => {
    const response = await api.post('/UserAccount/updateUserProfile', data)
    return response.data
  },
}

// Export all APIs as a single object for convenience
export default {
  auth: authAPI,
  designPost: designPostAPI,
  engagement: engagementAPI,
  roomTemplate: roomTemplateAPI,
  userAccount: userAccountAPI,
}

// Export the axios instance for custom requests if needed
export { api }
