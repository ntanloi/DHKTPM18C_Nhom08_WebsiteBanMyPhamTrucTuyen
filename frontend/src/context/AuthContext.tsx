import { useState, useEffect, type ReactNode } from 'react';
import { tokenStorage } from '../api/auth';
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

  // Check auth state on mount
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
              console.warn('⚠️ Security: Role mismatch detected on init. Updated from database.');
              tokenStorage.saveUser(verifiedUser);
            }
          } catch (error) {
            console.error('Failed to verify user on init:', error);
            // If verification fails, clear auth data for security
            tokenStorage.clearAll();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        tokenStorage.clearAll();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

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
