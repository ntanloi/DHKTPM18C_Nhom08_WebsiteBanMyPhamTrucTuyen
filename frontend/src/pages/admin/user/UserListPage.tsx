import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  type UserResponse,
} from '../../../api/user';
import { useAuth } from '../../../hooks/useAuth';

import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface UserListPageProps {
  onNavigate: (path: string) => void;
}

const UserListPage: React.FC<UserListPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const canEditCustomer = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const isCustomerRole = (u: UserResponse) =>
    !u.roleName || u.roleName === 'USER' || u.roleName === 'CUSTOMER';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      const onlyCustomers = data.filter(isCustomerRole);
      setUsers(onlyCustomers);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && user.isActive) ||
      (filterActive === 'inactive' && !user.isActive);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    verified: users.filter((u) => u.emailVerifiedAt).length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản Lý Khách Hàng
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Quản lý khách hàng (CUSTOMER/USER). Admin & Manager được chỉnh sửa thông tin cho phép; không thêm/xóa.
                </p>
              </div>
              {/* Creation disabled as requested */}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng số</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                    <svg
                      className="h-8 w-8 text-white"
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
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Hoạt động
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                      {stats.active}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-3">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Vô hiệu hóa
                    </p>
                    <p className="mt-2 text-3xl font-bold text-red-600">
                      {stats.inactive}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-red-500 to-rose-500 p-3">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Đã xác thực
                    </p>
                    <p className="mt-2 text-3xl font-bold text-purple-600">
                      {stats.verified}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  />
                  <svg
                    className="absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-pink-50/30"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName}
                              className="h-12 w-12 rounded-full border-2 border-pink-200"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-200 bg-gradient-to-br from-pink-100 to-purple-100 text-lg font-bold text-pink-600">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-900">{user.email}</p>
                          <p className="text-gray-500">
                            {user.phoneNumber || 'Chưa có'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-green-600' : 'bg-red-600'}`}
                            ></span>
                            {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                          </span>
                          {user.emailVerifiedAt && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                              <svg
                                className="h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Đã xác thực
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              onNavigate(`/admin/users/${user.id}`)
                            }
                            className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700 transition-colors hover:bg-blue-200"
                            title="Xem chi tiết"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          {canEditCustomer && (
                            <button
                              onClick={() =>
                                onNavigate(`/admin/users/${user.id}/edit`)
                              }
                              className="rounded-lg bg-green-100 px-3 py-2 text-green-700 transition-colors hover:bg-green-200"
                              title="Chỉnh sửa"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <p className="mt-4 text-gray-600">
                  Không tìm thấy khách hàng nào
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserListPage;
