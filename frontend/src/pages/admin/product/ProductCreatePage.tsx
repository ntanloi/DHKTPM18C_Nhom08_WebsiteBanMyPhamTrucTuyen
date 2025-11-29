import React, { useState, useEffect } from 'react';
import { createProduct, type ProductRequest } from '../../../api/product';
import { getAllCategories, type CategoryResponse } from '../../../api/category';
import { getAllBrands, type BrandResponse } from '../../../api/brand';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface ProductCreatePageProps {
  onNavigate: (path: string) => void;
}

const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
  onNavigate,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);

  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    slug: '',
    description: '',
    categoryId: 0,
    brandId: 0,
    status: 'draft',
    variant: {
      name: 'Mặc định',
      sku: '',
      price: 0,
      salePrice: 0,
      stockQuantity: 0,
      attributes: [],
    },
  });

  const [attributes, setAttributes] = useState<
    Array<{ name: string; value: string }>
  >([{ name: '', value: '' }]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetchingData(true);
      const [categoriesData, brandsData] = await Promise.all([
        getAllCategories(),
        getAllBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setFetchingData(false);
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (name.startsWith('variant.')) {
      const variantField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        variant: {
          ...prev.variant!,
          [variantField]:
            variantField === 'price' ||
            variantField === 'salePrice' ||
            variantField === 'stockQuantity'
              ? Number(value)
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === 'categoryId' || name === 'brandId' ? Number(value) : value,
      }));
    }
  };

  const handleAttributeChange = (
    index: number,
    field: 'name' | 'value',
    value: string,
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.categoryId || !formData.brandId) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (
      !formData.variant?.sku ||
      !formData.variant?.price ||
      formData.variant?.stockQuantity === undefined
    ) {
      setError('Vui lòng điền đầy đủ thông tin phiên bản sản phẩm');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const validAttributes = attributes.filter(
        (attr) => attr.name && attr.value,
      );

      const requestData: ProductRequest = {
        ...formData,
        variant: {
          ...formData.variant!,
          attributes: validAttributes,
        },
      };

      await createProduct(requestData);
      alert('Tạo sản phẩm thành công!');
      onNavigate('/admin/products');
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || 'Failed to create product',
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => onNavigate('/admin/products')}
              className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Thêm Sản Phẩm Mới
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Điền thông tin để tạo sản phẩm mỹ phẩm mới
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
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

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Thông Tin Cơ Bản
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tên Sản Phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="VD: Sữa Rửa Mặt Trà Xanh Innisfree"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="sua-rua-mat-tra-xanh-innisfree"
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mô Tả Sản Phẩm
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Mô tả chi tiết về sản phẩm, công dụng, thành phần..."
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    >
                      <option value={0}>-- Chọn danh mục --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.parentCategoryId ? '  ↳ ' : ''}
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Thương Hiệu <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="brandId"
                      value={formData.brandId}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    >
                      <option value={0}>-- Chọn thương hiệu --</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Trạng Thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    >
                      <option value="draft">Nháp</option>
                      <option value="active">Đang bán</option>
                      <option value="inactive">Ngừng bán</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin phiên bản */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Thông Tin Biến Thể Sản Phẩm
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tên Biến Thể
                    </label>
                    <input
                      type="text"
                      name="variant.name"
                      value={formData.variant?.name}
                      onChange={handleChange}
                      placeholder="VD: Dung tích 150ml"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="variant.sku"
                      value={formData.variant?.sku}
                      onChange={handleChange}
                      placeholder="VD: INN-GTC-150ML"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Giá Gốc (₫) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="variant.price"
                      value={formData.variant?.price}
                      onChange={handleChange}
                      min={0}
                      placeholder="320000"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Giá Khuyến Mãi (₫)
                    </label>
                    <input
                      type="number"
                      name="variant.salePrice"
                      value={formData.variant?.salePrice || ''}
                      onChange={handleChange}
                      min={0}
                      placeholder="280000"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Số Lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="variant.stockQuantity"
                      value={formData.variant?.stockQuantity}
                      onChange={handleChange}
                      min={0}
                      placeholder="50"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Thuộc Tính Sản Phẩm
                </h2>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="flex items-center gap-2 rounded-xl bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 transition-colors hover:bg-pink-200"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Thêm Thuộc Tính
                </button>
              </div>
              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) =>
                          handleAttributeChange(index, 'name', e.target.value)
                        }
                        placeholder="VD: Dung tích, Màu sắc, Hương..."
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) =>
                          handleAttributeChange(index, 'value', e.target.value)
                        }
                        placeholder="VD: 150ml, Hồng, Trà Xanh..."
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="rounded-xl p-3 text-red-600 transition-colors hover:bg-red-50"
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
                ))}
                {attributes.length === 0 && (
                  <div className="rounded-xl bg-gray-50 py-8 text-center">
                    <p className="text-sm text-gray-500">
                      Chưa có thuộc tính nào. Click "Thêm Thuộc Tính" để bắt
                      đầu.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400"
              >
                {loading ? 'Đang tạo...' : 'Tạo Sản Phẩm'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/admin/products')}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductCreatePage;
