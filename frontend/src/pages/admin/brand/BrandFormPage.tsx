import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

import {
  getBrandById,
  createBrand,
  updateBrand,
  type BrandRequest,
} from '../../../api/brand';

interface BrandFormPageProps {
  brandId?: string;
  onNavigate: (path: string) => void;
  mode: 'create' | 'edit';
}

const BrandFormPage: React.FC<BrandFormPageProps> = ({
  brandId,
  onNavigate,
  mode,
}) => {
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BrandRequest>({
    name: '',
    slug: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (mode === 'edit' && brandId) {
      fetchBrand();
    }
  }, [mode, brandId]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const brand = await getBrandById(Number(brandId));
      setFormData({
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch brand');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (mode === 'create') {
        await createBrand(formData);
        alert('Tạo thương hiệu thành công!');
      } else {
        await updateBrand(Number(brandId), formData);
        alert('Cập nhật thương hiệu thành công!');
      }

      onNavigate('/admin/brands');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} brand`,
      );
    } finally {
      setSaving(false);
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

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <button
              onClick={() => onNavigate('/admin/brands')}
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
                  {mode === 'create' ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  )}
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {mode === 'create'
                    ? 'Thêm Thương Hiệu Mới'
                    : 'Chỉnh Sửa Thương Hiệu'}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {mode === 'create'
                    ? 'Điền thông tin để tạo thương hiệu mới'
                    : 'Cập nhật thông tin thương hiệu'}
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

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Thông Tin Thương Hiệu
              </h2>
            </div>

            <div className="space-y-6 p-8">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tên Thương Hiệu
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="VD: Innisfree, COSRX, La Roche-Posay"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                />
              </div>

              {/* Slug */}
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Slug (URL)
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="innisfree, cosrx, la-roche-posay"
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  Tự động tạo từ tên thương hiệu
                </p>
              </div>

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
                  URL Logo
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
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
                  Khuyến nghị: 200x100px, nền trong suốt (PNG)
                </p>
              </div>
            </div>

            <div className="border-t bg-gray-50 px-8 py-6">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {mode === 'create' ? 'Đang tạo...' : 'Đang lưu...'}
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {mode === 'create' ? 'Tạo Thương Hiệu' : 'Lưu Thay Đổi'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/brands')}
                  disabled={saving}
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

export default BrandFormPage;
