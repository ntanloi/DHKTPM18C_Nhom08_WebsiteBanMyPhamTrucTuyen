import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

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
  const { user, isLoggedIn, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
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

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Manager can access admin pages except user management
    const isManagerAccessingAllowed = requiredRole === 'ADMIN' && user.role === 'MANAGER';
    
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
              Role hiện tại: <span className="font-semibold">{user.role}</span>
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
