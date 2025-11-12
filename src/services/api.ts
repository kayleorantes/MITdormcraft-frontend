import axios from "axios";
import type {
  AddCommentData,
  AddTemplateData,
  AuthResponse,
  Comment,
  CommentResponse,
  CreatePostData,
  DeleteCommentData,
  DeletePostData,
  DesignPost,
  EditCommentData,
  EditPostData,
  Engagement,
  ErrorResponse,
  LoginData,
  PostResponse,
  RegisterData,
  RoomTemplate,
  SuccessResponse,
  TemplateFilters,
  TemplateResponse,
  ToggleUpvoteData,
  UpdateTemplateData,
  UpdateUserProfileData,
  UpvoteResponse,
  User,
  UserResponse,
} from "@/types/api";

// Get backend URL from environment variable or use default
// In production (Render), VITE_API_BASE_URL will be set to deployed backend URL
// In development, defaults to '/api' which Vite proxies to localhost:8000
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication headers
api.interceptors.request.use(
  (config) => {
    // Get userID from localStorage (acts as session token)
    const userID = localStorage.getItem("userID");
    if (userID) {
      // Add userID to headers for authentication
      config.headers["X-User-ID"] = userID;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden errors
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear authentication data
      localStorage.removeItem("userID");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("bio");
      localStorage.removeItem("mitKerberos");
      localStorage.removeItem("profileImageURL");

      // Redirect to login page if not already there
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Session API
export const sessionAPI = {
  // POST /api/Session/createSession
  createSession: async (userID: string): Promise<string> => {
    const response = await api.post("/Session/createSession", { userID });
    // Backend returns the token as a plain string
    return response.data;
  },

  // POST /api/Session/deleteSession
  deleteSession: async (token: string): Promise<SuccessResponse> => {
    const response = await api.post("/Session/deleteSession", { token });
    return response.data;
  },
};

// Authentication API
export const authAPI = {
  // POST /api/Authentication/registerAndCreateAccount
  registerAndCreateAccount: async (
    data: RegisterData,
  ): Promise<UserResponse> => {
    const response = await api.post(
      "/Authentication/registerAndCreateAccount",
      data,
    );
    return response.data;
  },

  // POST /api/Authentication/verifyCredentials
  verifyCredentials: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/Authentication/verifyCredentials", data);
    return response.data;
  },
};

// Design Post API
export const designPostAPI = {
  // POST /api/DesignPost/createPost
  createPost: async (data: CreatePostData): Promise<PostResponse> => {
    const response = await api.post("/DesignPost/createPost", data);
    return response.data;
  },

  // POST /api/DesignPost/getPost
  getPost: async (postID: string): Promise<{ post: DesignPost | null }> => {
    const response = await api.post("/DesignPost/getPost", { postID });
    return response.data;
  },

  // POST /api/DesignPost/findPostsByTemplate
  findPostsByTemplate: async (templateID: string): Promise<DesignPost[]> => {
    const response = await api.post("/DesignPost/findPostsByTemplate", {
      templateID,
    });
    // Transform postID to _id if needed
    const posts = response.data;
    return posts.map((post: any) => ({
      ...post,
      _id: post._id || post.postID,
    }));
  },

  // POST /api/DesignPost/findPostsByAuthor
  findPostsByAuthor: async (authorID: string): Promise<DesignPost[]> => {
    const response = await api.post("/DesignPost/findPostsByAuthor", {
      authorID,
    });
    // Transform postID to _id if needed
    const posts = response.data;
    return posts.map((post: any) => ({
      ...post,
      _id: post._id || post.postID,
    }));
  },

  // POST /api/DesignPost/findPosts
  findPosts: async (options: { limit?: number } = {}): Promise<DesignPost[]> => {
    const response = await api.post("/DesignPost/findPosts", options);
    // Transform postID to _id if needed
    const posts = response.data;
    return posts.map((post: any) => ({
      ...post,
      _id: post._id || post.postID,
    }));
  },

  // POST /api/DesignPost/editPost
  editPost: async (data: EditPostData): Promise<SuccessResponse> => {
    const response = await api.post("/DesignPost/editPost", data);
    return response.data;
  },

  // POST /api/DesignPost/deletePost
  deletePost: async (data: DeletePostData): Promise<SuccessResponse> => {
    const response = await api.post("/DesignPost/deletePost", data);
    return response.data;
  },
};

// Engagement API
export const engagementAPI = {
  // POST /api/Engagement/getEngagementForPost
  getEngagementForPost: async (
    postID: string,
  ): Promise<{ engagement: Engagement }> => {
    const response = await api.post("/Engagement/getEngagementForPost", {
      postID,
    });

    const data = response.data ?? {};
    const rawEngagement = data.engagement ?? data ?? {};

    const normalizeUpvoteIds = (input: unknown): { ids: string[]; count?: number } => {
      if (Array.isArray(input)) {
        const filtered = input.filter((value): value is string => typeof value === "string");
        return { ids: filtered, count: filtered.length };
      }

      if (typeof input === "number") {
        return { ids: [], count: input };
      }

      if (input && typeof input === "object") {
        const maybeObject = input as Record<string, unknown>;

        if (Array.isArray(maybeObject.items)) {
          const filtered = maybeObject.items.filter(
            (value): value is string => typeof value === "string",
          );
          const count =
            typeof maybeObject.count === "number"
              ? maybeObject.count
              : typeof maybeObject.size === "number"
                ? maybeObject.size
                : filtered.length;
          return { ids: filtered, count };
        }

        if (Array.isArray(maybeObject.userIDs)) {
          const filtered = maybeObject.userIDs.filter(
            (value): value is string => typeof value === "string",
          );
          const count =
            typeof maybeObject.count === "number"
              ? maybeObject.count
              : typeof maybeObject.size === "number"
                ? maybeObject.size
                : filtered.length;
          return { ids: filtered, count };
        }

        const values = Object.values(maybeObject).filter(
          (value): value is string => typeof value === "string",
        );
        if (values.length > 0) {
          return {
            ids: values,
            count:
              typeof maybeObject.count === "number"
                ? maybeObject.count
                : typeof maybeObject.size === "number"
                  ? maybeObject.size
                  : values.length,
          };
        }

        if (
          typeof maybeObject.count === "number" ||
          typeof maybeObject.size === "number"
        ) {
          return {
            ids: [],
            count:
              typeof maybeObject.count === "number"
                ? maybeObject.count
                : (maybeObject.size as number),
          };
        }
      }

      return { ids: [], count: undefined };
    };

    const { ids: upvoteIds, count: explicitCount } = normalizeUpvoteIds(
      rawEngagement.upvotes,
    );

    const comments = Array.isArray(rawEngagement.comments)
      ? rawEngagement.comments.filter(
          (comment: any): comment is Comment =>
            comment !== null &&
            typeof comment === "object" &&
            typeof (comment as Comment).commentID === "string",
        )
      : [];

    const normalizedEngagement: Engagement = {
      upvotes: upvoteIds,
      comments,
    };

    const countCandidate =
      typeof rawEngagement.upvoteCount === "number"
        ? rawEngagement.upvoteCount
        : explicitCount;

    if (typeof countCandidate === "number") {
      normalizedEngagement.upvoteCount = countCandidate;
    }

    if (typeof rawEngagement.userHasUpvoted === "boolean") {
      normalizedEngagement.userHasUpvoted = rawEngagement.userHasUpvoted;
    } else if (typeof rawEngagement.hasUserUpvoted === "boolean") {
      normalizedEngagement.userHasUpvoted = rawEngagement.hasUserUpvoted;
    }

    return {
      engagement: normalizedEngagement,
    };
  },

  // POST /api/Engagement/toggleUpvote
  toggleUpvote: async (data: ToggleUpvoteData): Promise<UpvoteResponse> => {
    const response = await api.post("/Engagement/toggleUpvote", data);
    return response.data;
  },

  // POST /api/Engagement/addComment
  addComment: async (data: AddCommentData): Promise<CommentResponse> => {
    const response = await api.post("/Engagement/addComment", data);
    return response.data;
  },

  // POST /api/Engagement/deleteComment
  deleteComment: async (data: DeleteCommentData): Promise<SuccessResponse> => {
    const response = await api.post("/Engagement/deleteComment", data);
    return response.data;
  },

  // POST /api/Engagement/editComment
  editComment: async (data: EditCommentData): Promise<SuccessResponse> => {
    const response = await api.post("/Engagement/editComment", data);
    return response.data;
  },
};

// Room Template API
export const roomTemplateAPI = {
  // POST /api/RoomTemplate/addTemplate
  addTemplate: async (data: AddTemplateData): Promise<TemplateResponse> => {
    const response = await api.post("/RoomTemplate/addTemplate", data);
    return response.data;
  },

  // POST /api/RoomTemplate/getTemplate
  getTemplate: async (
    templateID: string,
  ): Promise<{ template: RoomTemplate | null }> => {
    const response = await api.post("/RoomTemplate/getTemplate", {
      templateID,
    });
    return response.data;
  },

  // POST /api/RoomTemplate/findTemplates
  findTemplates: async (
    filters: TemplateFilters = {},
  ): Promise<RoomTemplate[]> => {
    const response = await api.post("/RoomTemplate/findTemplates", filters);
    return response.data;
  },

  // POST /api/RoomTemplate/updateTemplate
  updateTemplate: async (
    data: UpdateTemplateData,
  ): Promise<SuccessResponse> => {
    const response = await api.post("/RoomTemplate/updateTemplate", data);
    return response.data;
  },

  // POST /api/RoomTemplate/deleteTemplate
  deleteTemplate: async (
    data: { templateID: string },
  ): Promise<SuccessResponse> => {
    const response = await api.post("/RoomTemplate/deleteTemplate", data);
    return response.data;
  },
};

// User Account API
export const userAccountAPI = {
  // POST /api/UserAccount/getUser
  getUser: async (userID: string): Promise<{ user: User }> => {
    const response = await api.post("/UserAccount/getUser", { userID });
    return response.data;
  },

  // POST /api/UserAccount/getUserByUsername
  getUserByUsername: async (username: string): Promise<{ user: User }> => {
    const response = await api.post("/UserAccount/getUserByUsername", {
      username,
    });
    return response.data;
  },

  // POST /api/UserAccount/updateUserProfile
  updateUserProfile: async (
    data: UpdateUserProfileData,
  ): Promise<SuccessResponse> => {
    const response = await api.post("/UserAccount/updateUserProfile", data);
    return response.data;
  },
};

// Export all APIs as a single object for convenience
export default {
  session: sessionAPI,
  auth: authAPI,
  designPost: designPostAPI,
  engagement: engagementAPI,
  roomTemplate: roomTemplateAPI,
  userAccount: userAccountAPI,
};

// Export the axios instance for custom requests if needed
export { api };
