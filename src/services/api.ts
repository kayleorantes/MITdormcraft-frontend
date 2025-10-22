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

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authentication API
export const authAPI = {
  // POST /api/authentication/registerAndCreateAccount
  registerAndCreateAccount: async (data: RegisterData): Promise<UserResponse> => {
    const response = await api.post('/api/authentication/registerAndCreateAccount', data)
    return response.data
  },

  // POST /api/authentication/verifyCredentials
  verifyCredentials: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/authentication/verifyCredentials', data)
    return response.data
  },
}

// Design Post API
export const designPostAPI = {
  // POST /api/design-post/createPost
  createPost: async (data: CreatePostData): Promise<PostResponse> => {
    const response = await api.post('/api/design-post/createPost', data)
    return response.data
  },

  // GET /api/design-post/getPost
  getPost: async (postID: string): Promise<{ post: DesignPost | null }> => {
    const response = await api.get(`/api/design-post/getPost?postID=${postID}`)
    return response.data
  },

  // GET /api/design-post/findPostsByTemplate
  findPostsByTemplate: async (templateID: string): Promise<DesignPost[]> => {
    const response = await api.get(`/api/design-post/findPostsByTemplate?templateID=${templateID}`)
    return response.data
  },

  // GET /api/design-post/findPostsByAuthor
  findPostsByAuthor: async (authorID: string): Promise<DesignPost[]> => {
    const response = await api.get(`/api/design-post/findPostsByAuthor?authorID=${authorID}`)
    return response.data
  },

  // POST /api/design-post/editPost
  editPost: async (data: EditPostData): Promise<SuccessResponse> => {
    const response = await api.post('/api/design-post/editPost', data)
    return response.data
  },

  // POST /api/design-post/deletePost
  deletePost: async (data: DeletePostData): Promise<SuccessResponse> => {
    const response = await api.post('/api/design-post/deletePost', data)
    return response.data
  },
}

// Engagement API
export const engagementAPI = {
  // GET /api/Engagement/getEngagementForPost
  getEngagementForPost: async (postID: string): Promise<{ engagement: Engagement }> => {
    const response = await api.get(`/api/Engagement/getEngagementForPost?postID=${postID}`)
    return response.data
  },

  // POST /api/Engagement/toggleUpvote
  toggleUpvote: async (data: ToggleUpvoteData): Promise<UpvoteResponse> => {
    const response = await api.post('/api/Engagement/toggleUpvote', data)
    return response.data
  },

  // POST /api/Engagement/addComment
  addComment: async (data: AddCommentData): Promise<CommentResponse> => {
    const response = await api.post('/api/Engagement/addComment', data)
    return response.data
  },

  // POST /api/Engagement/deleteComment
  deleteComment: async (data: DeleteCommentData): Promise<SuccessResponse> => {
    const response = await api.post('/api/Engagement/deleteComment', data)
    return response.data
  },

  // POST /api/Engagement/editComment
  editComment: async (data: EditCommentData): Promise<SuccessResponse> => {
    const response = await api.post('/api/Engagement/editComment', data)
    return response.data
  },
}

// Room Template API
export const roomTemplateAPI = {
  // POST /api/room-template/addTemplate
  addTemplate: async (data: AddTemplateData): Promise<PostResponse> => {
    const response = await api.post('/api/room-template/addTemplate', data)
    return response.data
  },

  // GET /api/room-template/getTemplate
  getTemplate: async (templateID: string): Promise<{ template: RoomTemplate | null }> => {
    const response = await api.get(`/api/room-template/getTemplate?templateID=${templateID}`)
    return response.data
  },

  // GET /api/room-template/findTemplates
  findTemplates: async (filters: TemplateFilters = {}): Promise<RoomTemplate[]> => {
    const params = new URLSearchParams()
    if (filters.dormName) params.append('dormName', filters.dormName)
    if (filters.roomType) params.append('roomType', filters.roomType)
    
    const response = await api.get(`/api/room-template/findTemplates?${params.toString()}`)
    return response.data
  },

  // POST /api/room-template/updateTemplate
  updateTemplate: async (data: UpdateTemplateData): Promise<SuccessResponse> => {
    const response = await api.post('/api/room-template/updateTemplate', data)
    return response.data
  },

  // POST /api/room-template/deleteTemplate
  deleteTemplate: async (data: { templateID: string }): Promise<SuccessResponse> => {
    const response = await api.post('/api/room-template/deleteTemplate', data)
    return response.data
  },
}

// User Account API
export const userAccountAPI = {
  // GET /api/user/getUser
  getUser: async (userID: string): Promise<{ user: User }> => {
    const response = await api.get(`/api/user/getUser?userID=${userID}`)
    return response.data
  },

  // GET /api/user/getUserByUsername
  getUserByUsername: async (username: string): Promise<{ user: User }> => {
    const response = await api.get(`/api/user/getUserByUsername?username=${username}`)
    return response.data
  },

  // POST /api/user/updateUserProfile
  updateUserProfile: async (data: UpdateUserProfileData): Promise<SuccessResponse> => {
    const response = await api.post('/api/user/updateUserProfile', data)
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
