// Type definitions for API responses and data structures

export interface User {
  userID: string
  username: string
  bio: string
  createdAt: string
}

export interface Credential {
  userID: string
  mitKerberos: string
  credential_data: string
}

export interface RoomTemplate {
  _id: string
  dormName: string
  roomType: string
}

export interface DesignPost {
  _id: string
  authorID: string
  templateID: string
  title: string
  description: string
  imageURL: string
  createdAt: string
}

export interface Comment {
  commentID: string
  authorID: string
  text: string
  createdAt: string
}

export interface Engagement {
  upvotes: string[]
  comments: Comment[]
}

// API Response types
export interface AuthResponse {
  userID: string | null
}

export interface PostResponse {
  postID: string
}

export interface UserResponse {
  userID: string
}

export interface SuccessResponse {
  success: boolean
}

export interface UpvoteResponse {
  upvoted: boolean
  total: number
}

export interface CommentResponse {
  comment: Comment
}

export interface ErrorResponse {
  error: string
}

// Form data types
export interface RegisterData {
  username: string
  mitKerberos: string
  bio: string
  credential_data: string
}

export interface LoginData {
  mitKerberos: string
  credential_data: string
}

export interface CreatePostData {
  authorID: string
  templateID: string
  title: string
  description: string
  imageURL: string
}

export interface EditPostData {
  postID: string
  userID: string
  title: string
  description: string
  imageURL: string
}

export interface DeletePostData {
  postID: string
  userID: string
}

export interface ToggleUpvoteData {
  postID: string
  userID: string
}

export interface AddCommentData {
  postID: string
  authorID: string
  text: string
}

export interface DeleteCommentData {
  postID: string
  commentID: string
  userID: string
}

export interface EditCommentData {
  postID: string
  commentID: string
  userID: string
  newText: string
}

export interface TemplateFilters {
  dormName?: string
  roomType?: string
}

export interface AddTemplateData {
  dormName: string
  roomType: string
}

export interface UpdateTemplateData {
  templateID: string
  dormName: string
  roomType: string
}

export interface UpdateUserProfileData {
  userID: string
  bio: string
}
