import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'MANAGER' | 'SUPPORT';
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // SECURITY FIX: Verify role with backend, don't trust localStorage
  useEffect(() => {
    const verifyUserRole = async () => {
      if (!isLoggedIn || !user) {
        setIsVerifying(false);
        return;
      }

      try {
        // Call backend to get ACTUAL role from database
        const response = await authApi.verifyUser();
        setVerifiedRole(response.role);
        
        // If localStorage role doesn't match database role, update it
        if (user.role !== response.role) {
          console.warn('⚠️ Security: localStorage role mismatch! Updating from database.');
          // This could indicate an attack attempt
        }
      } catch (error) {
        console.error('Failed to verify user role:', error);
        setVerificationError('Failed to verify permissions');
        // If verification fails, log out user for security
        logout();
      } finally {
        setIsVerifying(false);
      }
    };

    verifyUserRole();
  }, [isLoggedIn, user, logout]);

  // Loading state - show while checking auth and verifying role
  if (isLoading || isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  // Verification failed
  if (verificationError) {
    return fallback || (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-red-600">
            Lỗi xác thực
          </h2>
          <p className="mb-4 text-gray-600">
            {verificationError}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn || !user) {
    return fallback || (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Yêu cầu đăng nhập
          </h2>
          <p className="mb-4 text-gray-600">
            Bạn cần đăng nhập để truy cập trang này
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Check role if required - USE VERIFIED ROLE FROM DATABASE
  if (requiredRole && verifiedRole !== requiredRole) {
    // Manager can access admin pages except user management
    const isManagerAccessingAllowed = requiredRole === 'ADMIN' && verifiedRole === 'MANAGER';
    
    if (!isManagerAccessingAllowed) {
      return fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-red-600">
              Truy cập bị từ chối
            </h2>
            <p className="mb-4 text-gray-600">
              Bạn không có quyền truy cập trang này
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Yêu cầu: <span className="font-semibold">{requiredRole}</span> <br />
              Role hiện tại: <span className="font-semibold">{verifiedRole}</span>
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
