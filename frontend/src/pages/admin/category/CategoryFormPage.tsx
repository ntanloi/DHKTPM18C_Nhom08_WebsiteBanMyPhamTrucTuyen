import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

import {
  getCategoryById,
  createCategory,
  updateCategory,
  getAllCategories,
  type CategoryRequest,
  type CategoryResponse,
} from '../../../api/category';

interface CategoryFormPageProps {
  categoryId?: string;
  onNavigate: (path: string) => void;
  mode: 'create' | 'edit';
}

const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  categoryId,
  onNavigate,
  mode,
}) => {
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [formData, setFormData] = useState<CategoryRequest>({
    name: '',
    slug: '',
    parentCategoryId: null,
    imageUrl: '',
  });

  useEffect(() => {
    fetchCategories();
    if (mode === 'edit' && categoryId) {
      fetchCategory();
    }
  }, [mode, categoryId]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await getCategoryById(Number(categoryId));
      setFormData({
        name: category.name,
        slug: category.slug,
        parentCategoryId: category.parentCategoryId,
        imageUrl: category.imageUrl,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch category');
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (name === 'parentCategoryId') {
      setFormData((prev) => ({
        ...prev,
        parentCategoryId: value ? Number(value) : null,
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
        await createCategory(formData);
        alert('Tạo danh mục thành công!');
      } else {
        await updateCategory(Number(categoryId), formData);
        alert('Cập nhật danh mục thành công!');
      }

      onNavigate('/admin/categories');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} category`,
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

  const parentOptions = categories.filter(
    (c) => mode === 'create' || c.id !== Number(categoryId),
  );

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('/admin/categories')}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-gray-300 bg-white transition-all hover:border-pink-400 hover:bg-pink-50"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
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
              </button>
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {mode === 'create'
                    ? 'Thêm Danh Mục Mới'
                    : 'Chỉnh Sửa Danh Mục'}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {mode === 'create'
                    ? 'Điền thông tin để tạo danh mục mới'
                    : 'Cập nhật thông tin danh mục'}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4 shadow-lg">
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
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="border-b-2 border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <svg
                    className="h-5 w-5 text-pink-600"
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
                  Thông Tin Cơ Bản
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      Tên Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="VD: Serum & Tinh Chất"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg
                        className="h-4 w-4 text-purple-500"
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
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      placeholder="serum-tinh-chat"
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm shadow-sm transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
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
                      Tự động tạo từ tên danh mục
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Phân Cấp Danh Mục
                </h2>
              </div>
              <div className="p-6">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    Danh Mục Cha
                  </label>
                  <select
                    name="parentCategoryId"
                    value={formData.parentCategoryId || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  >
                    <option value="">-- Không có (Danh mục chính) --</option>
                    {parentOptions
                      .filter((c) => !c.parentCategoryId)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
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
                    Chọn danh mục cha nếu đây là danh mục con
                  </p>
                </div>
              </div>
            </div>

            {/* Image Card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="border-b-2 border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <svg
                    className="h-5 w-5 text-rose-600"
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
                  Hình Ảnh
                </h2>
              </div>
              <div className="p-6">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg
                      className="h-4 w-4 text-rose-500"
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
                    URL Hình Ảnh
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 shadow-sm transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-100 focus:outline-none"
                  />
                  {formData.imageUrl && (
                    <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
                      <p className="mb-3 text-xs font-semibold text-gray-600">
                        Preview:
                      </p>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-40 w-40 rounded-xl border-2 border-gray-200 object-cover shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-400"
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
                    {mode === 'create' ? 'Tạo Danh Mục' : 'Lưu Thay Đổi'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/admin/categories')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-bold text-gray-700 shadow-lg transition-all hover:border-gray-400 hover:bg-gray-50"
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
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryFormPage;
