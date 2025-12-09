import React, { useState, useEffect } from 'react';
import { getUserById, type UserResponse } from '../../../api/user';
import {
  getAddressesByUserId,
  type AddressResponse,
} from '../../../api/address';
import {
  getFavoritesByUserId,
  deleteFavorite,
} from '../../../api/favoriteList';
import { getProductById } from '../../../api/product';
import { getProductImagesByProductId } from '../../../api/productImage';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { useAuth } from '../../../hooks/useAuth';

interface UserDetailPageProps {
  userId: string;
  onNavigate: (path: string) => void;
}

interface FavoriteProduct {
  favoriteId: number;
  productId: number;
  productName: string;
  productImage?: string;
  createdAt: string;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({
  userId,
  onNavigate,
}) => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    [],
  );
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    fetchUserDetails();
    fetchUserFavorites();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(Number(userId));
      setUser(userData);

      const addressData = await getAddressesByUserId(Number(userId));
      setAddresses(addressData);

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      setLoadingFavorites(true);
      const favorites = await getFavoritesByUserId(Number(userId));

      const enrichedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          try {
            const [product, images] = await Promise.all([
              getProductById(fav.productId),
              getProductImagesByProductId(fav.productId),
            ]);

            return {
              favoriteId: fav.id,
              productId: fav.productId,
              productName: product.name,
              productImage: images[0]?.imageUrl,
              createdAt: fav.createdAt || '',
            };
          } catch {
            return {
              favoriteId: fav.id,
              productId: fav.productId,
              productName: `Product #${fav.productId}`,
              productImage: undefined,
              createdAt: fav.createdAt || '',
            };
          }
        }),
      );

      setFavoriteProducts(enrichedFavorites);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleDeleteFavorite = async (favoriteId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa favorite này?')) return;

    try {
      await deleteFavorite(favoriteId);
      alert('Xóa favorite thành công!');
      fetchUserFavorites();
    } catch (err: any) {
      alert(err.message || 'Failed to delete favorite');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
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
              <div>
                <h3 className="font-semibold text-red-900">Có lỗi xảy ra</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-gray-600">Không tìm thấy người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-5xl">
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

            <div className="flex items-center justify-between">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Chi Tiết Người Dùng
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Thông tin chi tiết và hoạt động của người dùng
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => onNavigate(`/admin/users/${userId}/edit`)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-rose-700"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Chỉnh Sửa
                </button>
              )}
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Thông Tin Cá Nhân
              </h2>
            </div>

            <div className="p-8">
              <div className="mb-8 flex items-start gap-6">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-28 w-28 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 text-4xl font-bold text-white shadow-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    {user.fullName}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {user.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                    </span>
                    {user.emailVerifiedAt && (
                      <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-800">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Email Đã Xác Thực
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">
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
                  </label>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>

                <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">
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
                  <p className="font-medium text-gray-900">
                    {user.phoneNumber || 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">
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
                  <p className="font-medium text-gray-900">
                    {user.birthDay || 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    ID Người Dùng
                  </label>
                  <p className="font-medium text-gray-900">#{user.id}</p>
                </div>

                <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Ngày Tạo
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Cập Nhật Lần Cuối
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Products Section */}
          <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  Sản Phẩm Yêu Thích
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">
                    {favoriteProducts.length}
                  </span>
                </h2>
                {favoriteProducts.length > 5 && (
                  <button
                    onClick={() =>
                      onNavigate(`/admin/favorites?userId=${userId}`)
                    }
                    className="text-sm font-medium text-white hover:text-pink-100"
                  >
                    Xem Tất Cả →
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              {loadingFavorites ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : favoriteProducts.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-600">
                    Chưa có sản phẩm yêu thích
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Người dùng chưa thêm sản phẩm nào vào danh sách yêu thích
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteProducts.slice(0, 5).map((fav) => (
                    <div
                      key={fav.favoriteId}
                      className="flex items-center justify-between rounded-xl border-2 border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50 p-4 transition-all hover:border-pink-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          className="h-6 w-6 text-pink-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <button
                            onClick={() =>
                              onNavigate(`/admin/products/${fav.productId}`)
                            }
                            className="font-semibold text-gray-900 transition-colors hover:text-pink-600"
                          >
                            {fav.productName}
                          </button>
                          <p className="text-xs text-gray-600">
                            Thêm vào:{' '}
                            {new Date(fav.createdAt).toLocaleDateString(
                              'vi-VN',
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFavorite(fav.favoriteId)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Xóa"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                Địa Chỉ Nhận Hàng
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">
                  {addresses.length}
                </span>
              </h2>
            </div>

            <div className="p-8">
              {addresses.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-600">
                    Chưa có địa chỉ
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Người dùng chưa thêm địa chỉ nhận hàng
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-xl border-2 border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 transition-all hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-1 h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {address.recipientName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.recipientPhone}
                            </p>
                          </div>
                        </div>
                        {address.isDefault && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            Mặc Định
                          </span>
                        )}
                      </div>
                      <p className="ml-8 text-sm text-gray-700">
                        {address.streetAddress}, {address.ward},{' '}
                        {address.district}, {address.city}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetailPage;
