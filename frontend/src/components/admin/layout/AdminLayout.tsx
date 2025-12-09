import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface MenuItem {
  id: string;
  icon: React.ReactElement;
  label: string;
  link?: string;
  subItems?: { label: string; link: string }[];
  roles?: Array<'ADMIN' | 'MANAGER'>;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onNavigate }) => {
  const { user, logout } = useAuth();
  const role = user?.role;
  const isAdmin = role === 'ADMIN';
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const baseMenuItems: MenuItem[] = [
    {
      id: 'overview',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: 'Tổng quan',
      link: '/admin',
    },
    {
      id: 'products',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      label: 'Quản lý sản phẩm',
      subItems: [
        { label: 'Sản phẩm', link: '/admin/products' },
        { label: 'Danh mục', link: '/admin/categories' },
        { label: 'Thương hiệu', link: '/admin/brands' },
      ],
    },
    {
      id: 'orders',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      label: 'Quản lý đơn hàng',
      link: '/admin/orders',
    },
    {
      id: 'customers',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      label: 'Quản lý khách hàng',
      link: '/admin/users',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'promotions',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
      label: 'Khuyến mãi',
      link: '/admin/coupons',
    },
    {
      id: 'payments',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      label: 'Phương thức thanh toán',
      link: '/admin/payment-methods',
      roles: ['ADMIN'],
    },
    {
      id: 'analytics',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      label: 'Thống kê',
      link: '/admin/analytics',
    },
  ];

  const menuItems: MenuItem[] = [
    ...baseMenuItems,
    ...(isAdmin
      ? [
          {
            id: 'accounts',
            icon: (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A4 4 0 019 15h6a4 4 0 013.879 2.804M12 22s7-2.5 7-8V7l-7-3-7 3v7c0 5.5 7 8 7 8z"
                />
              </svg>
            ),
            label: 'Tài khoản & phân quyền',
            link: '/admin/accounts',
            roles: ['ADMIN'],
          },
        ]
      : []),
  ].filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return (
      item.roles.includes(role as any) ||
      (role === 'ADMIN' && item.roles.includes('MANAGER'))
    );
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gradient-to-b from-pink-600 to-rose-600 text-white shadow-2xl">
        {/* Logo */}
        <div className="border-b border-pink-500 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">BeautyBox</h1>
              <p className="text-xs text-pink-200">Admin Panel</p>
            </div>
            <button
              onClick={() => onNavigate('/')}
              className="group rounded-lg p-2 transition-all hover:bg-white/10"
              title="Về trang chủ"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.link ? (
                <button
                  onClick={() => onNavigate(item.link!)}
                  className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="transition-transform group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setActiveSidebar(
                        activeSidebar === item.id ? null : item.id,
                      )
                    }
                    className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="transition-transform group-hover:scale-110">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.subItems && (
                      <svg
                        className={`h-4 w-4 transition-transform ${activeSidebar === item.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {item.subItems && activeSidebar === item.id && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.link}
                          onClick={() => onNavigate(subItem.link)}
                          className="block w-full rounded-lg px-4 py-2 text-left text-sm text-pink-100 transition-all hover:bg-white/10 hover:text-white"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-64 border-t border-pink-500 p-4">
          <div
            className="group relative rounded-lg p-2 transition-colors hover:bg-white/10"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
          >
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">
                  {user?.email || 'Tài khoản nội bộ'}
                </p>
                <p className="truncate text-xs text-pink-200">
                  {role ? `Role: ${role}` : 'Đang xác thực quyền'}
                </p>
              </div>
              <svg
                className={`h-4 w-4 text-white/80 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {accountMenuOpen && (
              <div className="absolute right-2 bottom-14 w-48 rounded-lg bg-white/95 p-2 text-sm text-pink-700 shadow-lg backdrop-blur">
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onNavigate('/admin');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-pink-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0h4m-4 0H7"
                    />
                  </svg>
                  {isAdmin ? 'Quản trị hệ thống' : 'Vận hành hệ thống'}
                </button>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    logout();
                    onNavigate('/');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-pink-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default AdminLayout;
