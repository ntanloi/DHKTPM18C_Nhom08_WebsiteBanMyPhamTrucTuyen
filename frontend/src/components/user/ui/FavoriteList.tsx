import { useState } from 'react';

// Mock data cho sản phẩm yêu thích
const mockFavorites = [
  {
    id: 1,
    name: 'Son Thạch Bông Thuần Chay Amuse Jel-Fit Tint 3.8g',
    price: 399000,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: '[Mua 5 tặng 5] Mặt Nạ Cấp Ẩm Dermatory Pro Hyal Shot Moisture Ampoule Mask 35g',
    price: 260000,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=100&h=100&fit=crop',
  },
];

interface FavoriteSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

function FavoriteSidebar({ isOpen, onClose }: FavoriteSidebarProps) {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
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
          <h2 className="text-lg font-medium text-gray-900">Ưa thích</h2>
          <button
            onClick={() => setFavorites([])}
            className="text-sm font-medium text-gray-900 transition-colors hover:text-pink-500"
          >
            Xoá tất cả
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {favorites.length === 0 ? (
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
                  className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 flex-shrink-0 rounded object-cover"
                  />

                  {/* Product Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="line-clamp-2 text-sm leading-tight text-gray-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
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
      </div>
    </>
  );
}

// Component HeartIcon với badge đỏ
export function HeartIconWithBadge({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative transition-colors hover:text-pink-500"
    >
      {/* Heart Icon */}
      <svg
        className="h-6 w-6"
        fill={count > 0 ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={count > 0 ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Red Badge */}
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export default FavoriteSidebar;
