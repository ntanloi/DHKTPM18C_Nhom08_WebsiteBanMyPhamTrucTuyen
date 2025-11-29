import React from 'react';

interface FavoriteStatsCardProps {
  favoriteCount: number;
  loading?: boolean;
  onViewDetails?: () => void;
}

const FavoriteStatsCard: React.FC<FavoriteStatsCardProps> = ({
  favoriteCount,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-gradient-to-br from-pink-50 to-purple-50 p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-300"></div>
            <div className="h-6 w-20 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg">
            <svg
              className="h-7 w-7 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              Người đã yêu thích
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-pink-600">
                {favoriteCount}
              </span>
              <span className="text-sm text-gray-500">
                {favoriteCount === 1 ? 'người' : 'người'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {favoriteCount === 0 && (
        <div className="mt-4 border-t border-pink-200 pt-4">
          <p className="text-sm text-gray-500">
            Sản phẩm này chưa có ai yêu thích
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoriteStatsCard;
