import React, { useEffect, useState } from 'react';
import {
  getAllProducts,
  deleteProduct,
  type ProductResponse,
} from '../../../api/product';
import { getAllCategories, type CategoryResponse } from '../../../api/category';
import { getAllBrands, type BrandResponse } from '../../../api/brand';
import {
  getAllProductImages,
  type ProductImageResponse,
} from '../../../api/productImage';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface ProductListPageProps {
  onNavigate: (path: string) => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [productImages, setProductImages] = useState<ProductImageResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, brandsData, imagesData] =
        await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllBrands(),
          getAllProductImages(),
        ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
      setProductImages(imagesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await deleteProduct(productId);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : '—';
  };

  const getBrandName = (brandId: number): string => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : '—';
  };

  const getProductImage = (productId: number): string | null => {
    const image = productImages.find((img) => img.productId === productId);
    return image ? image.imageUrl : null;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || product.categoryId === Number(filterCategory);

    const matchesBrand =
      filterBrand === 'all' || product.brandId === Number(filterBrand);

    const matchesStatus =
      filterStatus === 'all' || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

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
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Quản Lý Sản Phẩm
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý sản phẩm mỹ phẩm trong cửa hàng
              </p>
            </div>
            <button
              onClick={() => onNavigate('/admin/products/create')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 sm:px-6 sm:py-3 sm:text-base"
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
              <span className="hidden sm:inline">Thêm Sản Phẩm Mới</span>
              <span className="sm:hidden">Thêm Mới</span>
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-lg sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none sm:px-4 sm:py-3"
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none sm:px-4 sm:py-3"
              >
                <option value="all">Tất cả danh mục</option>
                {categories
                  .filter((c) => !c.parentCategoryId)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none sm:px-4 sm:py-3"
              >
                <option value="all">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none sm:px-4 sm:py-3"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>

          {/* Product Table - Desktop */}
          <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-lg lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="w-16 px-4 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    ID
                  </th>
                  <th className="min-w-[250px] px-4 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Tên Sản Phẩm
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Danh Mục
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Thương Hiệu
                  </th>
                  <th className="min-w-[120px] px-4 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Trạng Thái
                  </th>
                  <th className="min-w-[280px] px-4 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-pink-50"
                  >
                    <td className="w-16 px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {product.id}
                    </td>
                    <td className="min-w-[250px] px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                          {getProductImage(product.id) ? (
                            <img
                              src={getProductImage(product.id)!}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `
                                  <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                `;
                              }}
                            />
                          ) : (
                            <svg
                              className="h-8 w-8 text-purple-600"
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
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            /{product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                      <span className="rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-800">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                      <span className="rounded-lg bg-pink-100 px-3 py-1.5 text-xs font-medium text-pink-800">
                        {getBrandName(product.brandId)}
                      </span>
                    </td>
                    <td className="min-w-[120px] px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status === 'active'
                          ? 'Đang bán'
                          : product.status === 'inactive'
                            ? 'Ngừng bán'
                            : 'Nháp'}
                      </span>
                    </td>
                    <td className="min-w-[280px] px-4 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            onNavigate(`/admin/products/${product.id}`)
                          }
                          className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1.5 font-semibold text-purple-700 transition-all hover:bg-purple-200"
                          title="Xem Chi Tiết"
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
                          Xem
                        </button>
                        <button
                          onClick={() =>
                            onNavigate(`/admin/products/${product.id}/edit`)
                          }
                          className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 font-semibold text-blue-700 transition-all hover:bg-blue-200"
                          title="Sửa"
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
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 font-semibold text-red-700 transition-all hover:bg-red-200"
                          title="Xóa"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product Cards - Mobile/Tablet */}
          <div className="space-y-4 lg:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-4 shadow-lg"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                    {getProductImage(product.id) ? (
                      <img
                        src={getProductImage(product.id)!}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-8 w-8 text-purple-600"
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
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 text-sm font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="mb-2 text-xs text-gray-500">
                      ID: {product.id} • /{product.slug}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                        {getCategoryName(product.categoryId)}
                      </span>
                      <span className="rounded-lg bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">
                        {getBrandName(product.brandId)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status === 'active'
                          ? 'Đang bán'
                          : product.status === 'inactive'
                            ? 'Ngừng bán'
                            : 'Nháp'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate(`/admin/products/${product.id}`)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-200"
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
                    Xem
                  </button>
                  <button
                    onClick={() =>
                      onNavigate(`/admin/products/${product.id}/edit`)
                    }
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-200"
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
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition-all hover:bg-red-200"
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
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-6 rounded-2xl bg-white py-12 text-center shadow-lg">
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-600">
                Không tìm thấy sản phẩm nào
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          )}

          {/* Statistics Footer */}
          {filteredProducts.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
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
                    Tổng số sản phẩm: {filteredProducts.length}/
                    {products.length}
                  </p>
                  {(searchTerm ||
                    filterCategory !== 'all' ||
                    filterBrand !== 'all' ||
                    filterStatus !== 'all') && (
                    <p className="text-sm text-blue-700">
                      Đang lọc theo điều kiện
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

export default ProductListPage;
