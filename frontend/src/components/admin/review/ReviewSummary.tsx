import React from 'react';
import ReviewStars from './ReviewStars';
import type { RatingDistribution } from '../../../utils/reviewHelpers';

interface ReviewSummaryProps {
  totalReviews: number;
  averageRating: number;
  ratingDistribution?: RatingDistribution;
  onFilterByRating?: (rating: number | null) => void;
  selectedRating?: number | null;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  totalReviews,
  averageRating,
  ratingDistribution,
  onFilterByRating,
  selectedRating,
}) => {
  const distribution = ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className="rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center border-r border-gray-200 md:border-r">
          <div className="mb-2 text-6xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <ReviewStars rating={averageRating} size="lg" />
          <p className="mt-2 text-sm text-gray-600">{totalReviews} đánh giá</p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = distribution[rating as keyof RatingDistribution];
            const isSelected = selectedRating === rating;

            return (
              <button
                key={rating}
                onClick={() => onFilterByRating?.(isSelected ? null : rating)}
                className={`flex w-full items-center gap-3 rounded px-2 py-1 transition-colors ${
                  isSelected
                    ? 'bg-pink-100'
                    : 'hover:bg-opacity-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    {rating}
                  </span>
                  <svg
                    className="h-4 w-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="min-w-[3rem] text-right text-sm font-medium text-gray-600">
                  {percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedRating && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-3">
          <span className="text-sm text-gray-700">
            Đang lọc: <strong>{selectedRating} sao</strong>
          </span>
          <button
            onClick={() => onFilterByRating?.(null)}
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            Xóa lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
