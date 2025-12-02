import api from '../lib/api';

// Types
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  role: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth API functions
export const authApi = {
  // Register with email & password
  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', request);
    return response.data;
  },

  // Login with email & password
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', request);
    return response.data;
  },

  // Send OTP to email (passwordless login)
  sendOtp: async (request: SendOtpRequest): Promise<{ message: string; email: string }> => {
    const response = await api.post<{ message: string; email: string }>('/auth/send-otp', request);
    return response.data;
  },

  // Verify OTP and login
  verifyOtp: async (request: VerifyOtpRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/verify-otp', request);
    return response.data;
  },

  // Refresh JWT tokens
  refreshToken: async (request: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', request);
    return response.data;
  },

  // Logout (client-side)
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },
};

// Helper functions for token management
const TOKEN_KEY = 'beautybox_access_token';
const REFRESH_TOKEN_KEY = 'beautybox_refresh_token';
const USER_KEY = 'beautybox_user';

export const tokenStorage = {
  // Save tokens after login
  saveTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Save user info
  saveUser: (user: { userId: number; email: string; role: string }) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user info
  getUser: (): { userId: number; email: string; role: string } | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Clear all auth data
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authApi;
