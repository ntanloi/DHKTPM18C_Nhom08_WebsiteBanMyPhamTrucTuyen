import { createContext } from 'react';
import type { AuthResponse } from '../api/auth';

// User interface
export interface User {
  userId: number;
  email: string;
  role: string;
  fullName?: string;
  hasPassword?: boolean;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
