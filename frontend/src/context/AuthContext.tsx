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
    const initAuth = () => {
      try {
        const savedUser = tokenStorage.getUser();
        const accessToken = tokenStorage.getAccessToken();

        if (savedUser && accessToken) {
          setUser(savedUser);
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
    console.log('🔐 Login called with response:', authResponse);
    const { accessToken, refreshToken, userId, email, role } = authResponse;

    console.log('🔑 Saving tokens...');
    console.log(
      '  - accessToken:',
      accessToken ? accessToken.substring(0, 50) + '...' : 'MISSING',
    );
    console.log(
      '  - refreshToken:',
      refreshToken ? refreshToken.substring(0, 50) + '...' : 'MISSING',
    );

    // Save tokens
    tokenStorage.saveTokens(accessToken, refreshToken);

    // Save user info
    const userInfo: User = { userId, email, role };
    tokenStorage.saveUser(userInfo);
    setUser(userInfo);

    // Verify tokens were saved
    const savedToken = tokenStorage.getAccessToken();
    console.log('✅ Token saved successfully:', !!savedToken);
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
