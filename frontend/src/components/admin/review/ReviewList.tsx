import React from 'react';
import type { ReviewResponse } from '../../../api/review';
import ReviewItem from './ReviewItem';

interface ReviewListProps {
  reviews: ReviewResponse[];
  loading?: boolean;
  onDelete?: (reviewId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  showActions?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading = false,
  onDelete,
  onLoadMore,
  hasMore = false,
  showActions = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-gray-300"></div>
                <div className="h-4 w-1/4 rounded bg-gray-300"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-gray-300"></div>
              <div className="h-4 w-5/6 rounded bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
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
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <p className="mt-4 text-lg font-medium text-gray-900">
          Chưa có đánh giá nào
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Hãy là người đầu tiên đánh giá sản phẩm này!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          showActions={showActions}
          onDelete={onDelete}
        />
      ))}

      {hasMore && onLoadMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 hover:bg-gray-200"
          >
            Xem thêm đánh giá
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
