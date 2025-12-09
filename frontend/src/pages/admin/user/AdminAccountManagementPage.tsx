import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import {
  adminUserApi,
  type AdminUser,
  type AdminUserStats,
} from '../../../api/adminUser';
import { useAuth } from '../../../hooks/useAuth';

interface AdminAccountManagementPageProps {
  onNavigate: (path: string) => void;
}

const AdminAccountManagementPage: React.FC<AdminAccountManagementPageProps> = ({
  onNavigate,
}) => {
  const { user } = useAuth();
  const currentUserId = user?.userId;
  const [accounts, setAccounts] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const data = await adminUserApi.getStats();
      setStats(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Không thể tải thống kê tài khoản',
      );
    }
  };

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminUserApi.getUsers({
        page,
        size: 10,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setAccounts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Không thể tải danh sách tài khoản',
      );
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [roleFilter, search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchAccounts();
    }, 250);

    return () => clearTimeout(debounce);
  }, [fetchAccounts]);

  const handleRoleChange = async (accountId: number, roleName: string) => {
    try {
      setSavingId(accountId);
      const updated = await adminUserApi.updateRole(accountId, roleName);
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id ? { ...acc, ...updated } : acc)),
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Cập nhật quyền thất bại',
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleStatus = async (accountId: number) => {
    if (accountId === currentUserId) {
      setError('Bạn không thể tự vô hiệu hóa tài khoản của mình.');
      return;
    }

    try {
      setSavingId(accountId);
      const updated = await adminUserApi.toggleStatus(accountId);
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id ? { ...acc, ...updated } : acc)),
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Cập nhật trạng thái thất bại',
      );
    } finally {
      setSavingId(null);
    }
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    setPage((prev) => {
      if (direction === 'prev') return Math.max(prev - 1, 0);
      return Math.min(prev + 1, totalPages - 1);
    });
  };

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý tài khoản & phân quyền
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Admin có đầy đủ quyền của Manager và thêm quyền thiết lập tài khoản,
                phân quyền người dùng.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/admin/users')}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-pink-700 shadow-sm ring-1 ring-pink-100 transition hover:bg-pink-50"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Quản lý khách hàng
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tổng tài khoản</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.totalUsers ?? '--'}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Admin</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.adminCount ?? '--'}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Manager</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.managerCount ?? '--'}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Khách hàng</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.userCount ?? '--'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo email hoặc tên..."
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  <svg
                    className="absolute top-3.5 left-3.5 h-5 w-5 text-gray-400"
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
                  value={roleFilter}
                  onChange={(e) => {
                    setPage(0);
                    setRoleFilter(e.target.value);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100"
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="USER">Khách hàng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accounts table */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                Đang tải danh sách tài khoản...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Mật khẩu
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {accounts.map((account) => {
                      const isSelf = currentUserId === account.id;
                      return (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100 text-sm font-bold text-pink-600">
                                {account.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {account.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {account.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={account.roleName || 'USER'}
                              disabled={savingId === account.id || isSelf}
                              onChange={(e) =>
                                handleRoleChange(account.id, e.target.value)
                              }
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-pink-500 focus:outline-none"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MANAGER">Manager</option>
                              <option value="USER">Khách hàng</option>
                            </select>
                            {isSelf && (
                              <p className="mt-1 text-xs text-gray-400">
                                Không thể tự đổi vai trò
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                account.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {account.isActive ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {account.hasPassword ? 'Đã đặt' : 'Chưa đặt'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  onNavigate(`/admin/users/${account.id}`)
                                }
                                className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700 transition hover:bg-blue-100"
                              >
                                Xem
                              </button>
                              <button
                                onClick={() => handleToggleStatus(account.id)}
                                disabled={savingId === account.id || isSelf}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                  account.isActive
                                    ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                } ${savingId === account.id || isSelf ? 'cursor-not-allowed opacity-60' : ''}`}
                              >
                                {account.isActive ? 'Vô hiệu' : 'Mở khóa'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {accounts.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          Không có tài khoản phù hợp
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div>
                Trang {page + 1} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={page === 0}
                  className="rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={page + 1 >= totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAccountManagementPage;
