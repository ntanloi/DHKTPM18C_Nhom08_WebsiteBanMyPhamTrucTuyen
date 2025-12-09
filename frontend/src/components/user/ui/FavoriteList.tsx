import { useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth-context';
import { useFavorites } from '../../../context/FavoriteContext';
import { Toast } from './Toast';
import { useToast } from '../../../hooks/useToast';

interface FavoriteSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function FavoriteSidebar({ isOpen, onClose }: FavoriteSidebarProps) {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { toast, showToast, hideToast } = useToast();

  const {
    favorites,
    loading,
    error,
    removeFavoriteById,
    clearAllFavorites,
    refreshFavorites,
  } = useFavorites();

  // Refresh favorites when sidebar opens
  useEffect(() => {
    if (isOpen && user) {
      refreshFavorites();
    }
  }, [isOpen, user]);

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await removeFavoriteById(favoriteId);
      showToast('Đã xóa sản phẩm khỏi danh sách yêu thích', 'success');
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      showToast('Không thể xóa sản phẩm yêu thích', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?')) return;

    try {
      await clearAllFavorites();
      showToast('Đã xóa tất cả sản phẩm yêu thích', 'success');
    } catch (err: any) {
      console.error('Error clearing favorites:', err);
      showToast('Không thể xóa tất cả sản phẩm yêu thích', 'error');
    }
  };

  const handleProductClick = (slug: string) => {
    onClose();
    // Navigate to product detail page
    window.location.href = `/product/${slug}`;
  };

  const formatPrice = (price?: number) => {
    if (!price) return '0đ';
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[400px] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">
            Ưa thích {favorites.length > 0 && `(${favorites.length})`}
          </h2>
          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-pink-500"
            >
              Xoá tất cả
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="mb-4 h-16 w-16 text-gray-300"
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
              <p className="text-gray-500">
                Vui lòng đăng nhập để xem danh sách yêu thích
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-pink-600"></div>
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={refreshFavorites}
                className="mt-4 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                Thử lại
              </button>
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="mb-4 h-16 w-16 text-gray-300"
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
              <p className="text-gray-500">Chưa có sản phẩm yêu thích</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                  onClick={() =>
                    item.productSlug && handleProductClick(item.productSlug)
                  }
                >
                  {/* Product Image */}
                  <img
                    src={
                      item.productImageUrl || 'https://via.placeholder.com/64'
                    }
                    alt={item.productName || 'Product'}
                    className="h-16 w-16 flex-shrink-0 rounded object-cover"
                  />

                  {/* Product Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="line-clamp-2 text-sm leading-tight text-gray-900">
                      {item.productName || 'Sản phẩm'}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {item.productSalePrice &&
                        item.productSalePrice < (item.productPrice || 0) ? (
                          <>
                            <p className="text-sm font-semibold text-pink-600">
                              {formatPrice(item.productSalePrice)}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(item.productPrice)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.productPrice)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(item.id);
                        }}
                        className="flex-shrink-0 text-sm font-medium text-gray-900 transition-colors hover:text-pink-500"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </>
  );
}

// Component HeartIcon với badge đỏ
export function HeartIconWithBadge({ onClick }: { onClick: () => void }) {
  const { favoriteCount } = useFavorites();

  return (
    <button
      onClick={onClick}
      className="relative transition-colors hover:text-pink-500"
    >
      {/* Heart Icon */}
      <svg
        className="h-6 w-6"
        fill={favoriteCount > 0 ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={favoriteCount > 0 ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Red Badge */}
      {favoriteCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {favoriteCount}
        </span>
      )}
    </button>
  );
}

export default FavoriteSidebar;
