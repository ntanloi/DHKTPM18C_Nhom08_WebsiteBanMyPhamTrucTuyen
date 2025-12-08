import { useState, useEffect, type ReactNode } from 'react';
import { tokenStorage, authApi } from '../api/auth';
import type { AuthResponse } from '../api/auth';
import { AuthContext } from './auth-context';
import type { User } from './auth-context';

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth state on mount and on window focus
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = tokenStorage.getUser();
        const accessToken = tokenStorage.getAccessToken();

        if (savedUser && accessToken) {
          // SECURITY FIX: Verify with backend instead of trusting localStorage
          try {
            const response = await authApi.verifyUser();
            
            // Update user with verified role from database
            const verifiedUser: User = {
              userId: response.userId,
              email: response.email,
              role: response.role,
            };
            
            setUser(verifiedUser);
            
            // Update localStorage if role changed
            if (savedUser.role !== response.role) {
              console.warn('⚠️ Security: Role mismatch detected. Updated from database.');
              tokenStorage.saveUser(verifiedUser);
            }
          } catch (error) {
            console.error('Failed to verify user:', error);
            // If verification fails (401/403), clear auth data
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 401 || err.response?.status === 403) {
              console.log('Token invalid or expired, clearing auth state');
              tokenStorage.clearAll();
              setUser(null);
            } else {
              // For other errors (network, server error), keep user logged in
              console.warn('Verification failed but keeping user logged in:', err.response?.status);
              setUser(savedUser);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Only clear auth if it's a critical error
        // Don't clear on network errors
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Note: Removed window focus handler to prevent unnecessary re-verification
    // initAuth already verifies on mount/reload, no need to re-verify on every focus
    // This prevents potential logout issues from failed re-verification attempts
  }, []); // Empty dependency - only run once on mount

  // Login function - save tokens and user info
  const login = (authResponse: AuthResponse) => {
    const { accessToken, refreshToken, userId, email, role } = authResponse;

    // Save tokens
    tokenStorage.saveTokens(accessToken, refreshToken);

    // Save user info
    const userInfo: User = { userId, email, role };
    tokenStorage.saveUser(userInfo);
    setUser(userInfo);
  };

  // Logout function - clear all auth data
  const logout = () => {
    tokenStorage.clearAll();
    setUser(null);
  };

  // Update user info
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      tokenStorage.saveUser(updatedUser);
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
