import React, { useState, useEffect } from 'react';
import {
  getProductById,
  deleteProduct,
  getVariantAttributesByVariantId,
  type ProductDetailResponse,
} from '../../../api/product';
import type { VariantAttributeResponse } from '../../../api/variantAttribute';
import type { ReviewResponse } from '../../../api/review';
import { getReviewsByProductId, deleteReview } from '../../../api/review';
import {
  calculateAverageRating,
  getRatingDistribution,
  filterReviewsByRating,
} from '../../../utils/reviewHelpers';
import ProductImageGallery from '../../../components/admin/product/ProductImageGallery';
import ReviewSummary from '../../../components/admin/review/ReviewSummary';
import ReviewList from '../../../components/admin/review/ReviewList';
import { getFavoriteCountByProductId } from '../../../api/favoriteList';
import FavoriteStatsCard from '../../../components/admin/favorite/FavoriteStatsCard';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [attributes, setAttributes] = useState<VariantAttributeResponse[]>([]);

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewResponse[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchFavoriteCount();
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (selectedRating) {
      setFilteredReviews(filterReviewsByRating(reviews, selectedRating));
    } else {
      setFilteredReviews(reviews);
    }
  }, [selectedRating, reviews]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(Number(productId));
      setProduct(productData);

      if (productData.productVariant) {
        try {
          const attrs = await getVariantAttributesByVariantId(
            productData.productVariant.id,
          );
          setAttributes(attrs);
        } catch (err) {
          console.error('Failed to load attributes:', err);
        }
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const reviewData = await getReviewsByProductId(Number(productId));
      setReviews(reviewData);
      setFilteredReviews(reviewData);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      alert('Xóa review thành công!');
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await deleteProduct(Number(productId));
      alert('Xóa sản phẩm thành công!');
      onNavigate('/admin/products');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number): number => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      active: 'Đang bán',
      inactive: 'Ngừng bán',
      draft: 'Nháp',
    };
    return (
      <span
        className={`rounded-full px-4 py-2 text-sm font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const fetchFavoriteCount = async () => {
    try {
      setLoadingFavorites(true);
      const count = await getFavoriteCountByProductId(Number(productId));
      setFavoriteCount(count);
    } catch (err) {
      console.error('Failed to load favorite count:', err);
    } finally {
      setLoadingFavorites(false);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-gray-600">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating(reviews);
  const ratingDistribution = getRatingDistribution(reviews, true);
  const displayReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 5);

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <div className="mx-auto max-w-5xl">
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Chi Tiết Sản Phẩm
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Xem thông tin chi tiết sản phẩm mỹ phẩm
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    onNavigate(`/admin/products/${productId}/edit`)
                  }
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
                >
                  Chỉnh Sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-lg transition-colors hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Hình Ảnh Sản Phẩm
              </h3>
              <button
                onClick={() =>
                  onNavigate(`/admin/products/${productId}/images`)
                }
                className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-pink-700"
              >
                Quản Lý Ảnh
              </button>
            </div>
            <ProductImageGallery productId={product.id} />
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500">/{product.slug}</p>
              </div>
              {getStatusBadge(product.status)}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-purple-50 p-4">
                <label className="mb-1 block text-sm font-medium text-purple-700">
                  ID Sản Phẩm
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  #{product.id}
                </p>
              </div>

              <div className="rounded-xl bg-pink-50 p-4">
                <label className="mb-1 block text-sm font-medium text-pink-700">
                  Danh Mục
                </label>
                <span className="inline-block rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800">
                  {product.category?.name || '—'}
                </span>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <label className="mb-1 block text-sm font-medium text-blue-700">
                  Thương Hiệu
                </label>
                <span className="inline-block rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800">
                  {product.brand?.name || '—'}
                </span>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <label className="mb-1 block text-sm font-medium text-green-700">
                  Ngày Tạo
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mô Tả
              </label>
              <p className="leading-relaxed text-gray-700">
                {product.description || 'Chưa có mô tả'}
              </p>
            </div>
          </div>

          {product.productVariant && (
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Thông Tin Phiên Bản & Giá
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-purple-50 p-4">
                  <label className="mb-1 block text-sm font-medium text-purple-700">
                    Tên Phiên Bản
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.productVariant.name}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <p className="rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm font-medium text-gray-900">
                    {product.productVariant.sku}
                  </p>
                </div>

                <div className="rounded-xl bg-pink-50 p-4">
                  <label className="mb-2 block text-sm font-medium text-pink-700">
                    Giá Bán
                  </label>
                  <div className="flex items-baseline gap-3">
                    {product.productVariant.salePrice &&
                    product.productVariant.salePrice <
                      product.productVariant.price ? (
                      <>
                        <span className="text-2xl font-bold text-pink-600">
                          {formatPrice(product.productVariant.salePrice)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.productVariant.price)}
                        </span>
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          -
                          {calculateDiscount(
                            product.productVariant.price,
                            product.productVariant.salePrice,
                          )}
                          %
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.productVariant.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <label className="mb-1 block text-sm font-medium text-green-700">
                    Tồn Kho
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${
                        product.productVariant.stockQuantity < 10
                          ? 'text-red-600'
                          : product.productVariant.stockQuantity < 50
                            ? 'text-orange-600'
                            : 'text-green-600'
                      }`}
                    >
                      {product.productVariant.stockQuantity}
                    </span>
                    <span className="text-gray-600">sản phẩm</span>
                  </div>
                  {product.productVariant.stockQuantity < 10 && (
                    <span className="mt-2 inline-block rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      Sắp hết hàng
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {attributes.length > 0 && (
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Thuộc Tính Sản Phẩm
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-pink-100">
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        {attr.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {attr.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-6 text-xl font-bold text-gray-900">
              Thống Kê Yêu Thích
            </h3>
            <FavoriteStatsCard
              favoriteCount={favoriteCount}
              loading={loadingFavorites}
              onViewDetails={() =>
                onNavigate(`/admin/favorites?productId=${productId}`)
              }
            />
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-6 text-xl font-bold text-gray-900">
              Đánh Giá Sản Phẩm
            </h3>

            {loadingReviews ? (
              <div className="py-8 text-center text-gray-500">
                Đang tải đánh giá...
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-xl bg-gray-50 py-8 text-center text-gray-500">
                Chưa có đánh giá nào cho sản phẩm này
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <ReviewSummary
                    totalReviews={reviews.length}
                    averageRating={averageRating}
                    ratingDistribution={ratingDistribution}
                    onFilterByRating={setSelectedRating}
                    selectedRating={selectedRating}
                  />
                </div>

                <ReviewList
                  reviews={displayReviews}
                  showActions={true}
                  onDelete={handleDeleteReview}
                />

                {filteredReviews.length > 5 && !showAllReviews && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700"
                    >
                      Xem tất cả {filteredReviews.length} đánh giá
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Timestamps */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <span className="block text-sm font-medium text-blue-700">
                  Ngày tạo
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {new Date(product.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="rounded-xl bg-purple-50 p-4">
                <span className="block text-sm font-medium text-purple-700">
                  Cập nhật lần cuối
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {new Date(product.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductDetailPage;
