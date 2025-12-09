import React, { useState } from 'react';
import { createUser, type CreateUserRequest } from '../../../api/user';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface UserCreatePageProps {
  onNavigate: (path: string) => void;
}

const UserCreatePage: React.FC<UserCreatePageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    avatarUrl: '',
    birthDay: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createUser(formData);
      alert('Tạo khách hàng thành công!');
      onNavigate('/admin/users');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Tạo khách hàng thất bại',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => onNavigate('/admin/users')}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-pink-600"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tạo Khách Hàng Mới
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Điền thông tin để tạo khách hàng mới
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
              <svg
                className="h-6 w-6 flex-shrink-0 text-red-600"
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
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Có lỗi xảy ra</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Thông Tin Tài Khoản
              </h2>
            </div>

            <div className="space-y-6 p-8">
              {/* Full Name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Họ và Tên
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên..."
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@beautybox.com"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Mật Khẩu
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
                <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Tối thiểu 8 ký tự
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
              </div>

              {/* Birth Day */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  URL Avatar
                </label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t bg-gray-50 px-8 py-6">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Tạo Người Dùng
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/users')}
                  disabled={loading}
                  className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserCreatePage;
