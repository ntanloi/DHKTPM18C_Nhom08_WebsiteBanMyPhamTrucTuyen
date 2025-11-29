import React, { useEffect, useState } from 'react';
import {
  getAllBrands,
  deleteBrand,
  type BrandResponse,
} from '../../../api/brand';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface BrandListPageProps {
  onNavigate: (path: string) => void;
}

const BrandListPage: React.FC<BrandListPageProps> = ({ onNavigate }) => {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getAllBrands();
      setBrands(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brandId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;

    try {
      await deleteBrand(brandId);
      fetchBrands();
    } catch (err: any) {
      alert(err.message || 'Failed to delete brand');
    }
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Quản Lý Thương Hiệu
                  </h1>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <span>Quản lý các thương hiệu mỹ phẩm</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                      {brands.length}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/admin/brands/create')}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm Thương Hiệu
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-12 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
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
              )}
            </div>
          </div>

          {filteredBrands.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-lg">
              <svg
                className="mx-auto h-20 w-20 text-gray-400"
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
              <p className="mt-4 text-lg font-medium text-gray-600">
                {searchTerm
                  ? 'Không tìm thấy thương hiệu nào'
                  : 'Chưa có thương hiệu nào'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Thử tìm kiếm với từ khóa khác'
                  : 'Bắt đầu bằng cách thêm thương hiệu mới'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => onNavigate('/admin/brands/create')}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-rose-700"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Thêm Thương Hiệu Đầu Tiên
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 text-4xl font-bold text-white shadow-lg">
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-gray-600 backdrop-blur-sm">
                      ID: {brand.id}
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="p-5">
                    <h3 className="mb-2 text-center text-lg font-bold text-gray-900">
                      {brand.name}
                    </h3>
                    <div className="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
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
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span className="font-mono">/{brand.slug}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          onNavigate(`/admin/brands/${brand.id}/edit`)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100"
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
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition-all hover:border-red-300 hover:bg-red-100"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredBrands.length > 0 && (
            <div className="mt-8 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-blue-600"
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
                <div>
                  <p className="font-semibold text-blue-900">
                    Tổng số thương hiệu: {filteredBrands.length}/{brands.length}
                  </p>
                  {searchTerm && (
                    <p className="text-sm text-blue-700">
                      Đang lọc theo từ khóa: "{searchTerm}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrandListPage;
