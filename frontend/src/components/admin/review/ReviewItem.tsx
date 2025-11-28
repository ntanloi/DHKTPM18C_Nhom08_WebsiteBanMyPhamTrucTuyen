import React, { useState, useEffect } from 'react';
import type { ReviewResponse } from '../../../api/review';
import type { ReviewImageResponse } from '../../../api/reviewImage';
import ReviewStars from './ReviewStars';
import ReviewImageGallery from './ReviewImageGallery';
import { formatReviewDate } from '../../../utils/reviewHelpers';
import { getReviewImagesByReviewId } from '../../../api/reviewImage';

interface ReviewItemProps {
  review: ReviewResponse;
  showActions?: boolean;
  onDelete?: (reviewId: number) => void;
  onEdit?: (reviewId: number) => void;
  showProductInfo?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  showActions = false,
  onDelete,
  onEdit,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewImages, setReviewImages] = useState<ReviewImageResponse[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchReviewImages = async () => {
      try {
        const images = await getReviewImagesByReviewId(review.id);
        setReviewImages(images);
      } catch (err) {
        console.error('Failed to load review images:', err);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchReviewImages();
  }, [review.id]);

  const shouldTruncate = review.content.length > 200;
  const displayContent =
    expanded || !shouldTruncate
      ? review.content
      : review.content.substring(0, 200) + '...';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white">
            <span className="text-lg font-bold">
              {review.nickname.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <p className="font-semibold text-gray-900">{review.nickname}</p>
            <div className="mt-1 flex items-center gap-2">
              <ReviewStars rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatReviewDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review.id)}
                className="rounded p-1 text-blue-600 hover:bg-blue-50"
                title="Chỉnh sửa"
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
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa review này?')) {
                    onDelete(review.id);
                  }
                }}
                className="rounded p-1 text-red-600 hover:bg-red-50"
                title="Xóa"
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
            )}
          </div>
        )}
      </div>

      {review.title && (
        <h4 className="mb-2 font-bold text-gray-900">{review.title}</h4>
      )}

      <p className="mb-3 leading-relaxed text-gray-700">
        {displayContent}
        {shouldTruncate && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="ml-1 font-medium text-pink-600 hover:text-pink-700"
          >
            Xem thêm
          </button>
        )}
      </p>

      {!loadingImages && reviewImages.length > 0 && (
        <div className="mb-3">
          <ReviewImageGallery images={reviewImages} />
        </div>
      )}

      <div className="flex items-center gap-3 text-sm">
        {review.isRecommend && (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-800">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Recommend
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
