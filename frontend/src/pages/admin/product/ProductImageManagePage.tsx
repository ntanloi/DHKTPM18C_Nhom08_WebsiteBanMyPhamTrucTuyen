import React, { useEffect, useState } from 'react';
import {
  getProductImagesByProductId,
  createProductImage,
  updateProductImage,
  deleteProductImage,
  type ProductImageResponse,
} from '../../../api/productImage';
import {
  getProductById,
  type ProductDetailResponse,
} from '../../../api/product';
import ProductImageUploader from '../../../components/admin/product/ProductImageUploader';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface ProductImageManagePageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

const ProductImageManagePage: React.FC<ProductImageManagePageProps> = ({
  productId,
  onNavigate,
}) => {
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [images, setImages] = useState<ProductImageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editingUrl, setEditingUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productData, imagesData] = await Promise.all([
        getProductById(Number(productId)),
        getProductImagesByProductId(Number(productId)),
      ]);

      console.log('📦 Product Data:', productData);
      console.log('🖼️ Images Data:', imagesData);
      console.log('🔍 Is Array?', Array.isArray(imagesData));

      setProduct(productData);
      setImages(Array.isArray(imagesData) ? imagesData : []);
      setError(null);
    } catch (err: any) {
      console.error('❌ Fetch Error:', err);
      setError(err.message || 'Failed to fetch data');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (uploadedUrls: string[]) => {
    try {
      const promises = uploadedUrls.map((url) =>
        createProductImage({
          productId: Number(productId),
          imageUrl: url,
        }),
      );

      await Promise.all(promises);
      setShowUploader(false);
      fetchData();
      alert('Thêm ảnh thành công!');
    } catch (err: any) {
      alert(err.message || 'Failed to create product images');
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;

    try {
      await deleteProductImage(imageId);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  };

  const handleEditUrl = (image: ProductImageResponse) => {
    setEditingImageId(image.id);
    setEditingUrl(image.imageUrl);
  };

  const handleSaveUrl = async (imageId: number) => {
    if (!editingUrl.trim()) {
      alert('URL không được để trống');
      return;
    }

    try {
      await updateProductImage(imageId, {
        productId: Number(productId),
        imageUrl: editingUrl,
      });
      setEditingImageId(null);
      setEditingUrl('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update image');
    }
  };

  const handleCancelEdit = () => {
    setEditingImageId(null);
    setEditingUrl('');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;
  if (!product) return <div className="p-6">Không tìm thấy sản phẩm</div>;

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <button
            onClick={() => onNavigate(`/admin/products/${productId}`)}
            className="mb-3 flex items-center gap-2 font-medium text-pink-600 hover:text-pink-700"
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
            Quay lại chi tiết sản phẩm
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Hình Ảnh
              </h1>
              <p className="mt-1 text-sm text-gray-600">{product.name}</p>
            </div>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
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
              {showUploader ? 'Ẩn Upload' : 'Thêm Ảnh Mới'}
            </button>
          </div>
        </div>

        {showUploader && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Upload Hình Ảnh
            </h2>
            <ProductImageUploader
              productId={Number(productId)}
              onUploadComplete={handleUploadComplete}
              maxImages={10}
              maxSizePerFileMB={5}
            />
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh Sách Hình Ảnh ({images.length})
            </h2>
            {images.length > 1 && (
              <p className="text-sm text-gray-500">
                💡 Kéo thả để sắp xếp lại thứ tự ảnh
              </p>
            )}
          </div>

          {images.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2">Chưa có hình ảnh nào</p>
              <button
                onClick={() => setShowUploader(true)}
                className="mt-4 font-medium text-pink-600 hover:text-pink-700"
              >
                Thêm ảnh đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative cursor-move overflow-hidden rounded-lg border-2 transition-all ${
                    draggedIndex === index
                      ? 'border-pink-500 opacity-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={`Product image ${image.id}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 left-2 rounded bg-pink-500 px-2 py-1 text-xs font-bold text-white">
                      ẢNH CHÍNH
                    </div>
                  )}
                  <div className="bg-opacity-60 absolute top-2 right-2 rounded bg-black px-2 py-1 text-xs font-bold text-white">
                    #{index + 1}
                  </div>

                  <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center gap-2 bg-black opacity-0 transition-all group-hover:opacity-100">
                    <button
                      onClick={() => handleEditUrl(image)}
                      className="rounded-lg bg-white p-2 text-gray-800 transition-colors hover:bg-gray-100"
                      title="Chỉnh sửa URL"
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
                    </button>

                    <button
                      onClick={() => handleDelete(image.id)}
                      className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                      title="Xóa ảnh"
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

                  {/* Image Info */}
                  <div className="bg-gray-50 p-3">
                    <p className="truncate text-xs text-gray-500">
                      ID: {image.id}
                    </p>
                    {editingImageId === image.id ? (
                      <div className="mt-2 space-y-2">
                        <input
                          type="url"
                          value={editingUrl}
                          onChange={(e) => setEditingUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSaveUrl(image.id)}
                            className="flex-1 rounded bg-pink-600 px-2 py-1 text-xs text-white hover:bg-pink-700"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 rounded bg-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-400"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className="mt-1 truncate text-xs text-gray-700"
                        title={image.imageUrl}
                      >
                        {image.imageUrl}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductImageManagePage;
