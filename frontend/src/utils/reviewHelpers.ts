// src/utils/reviewHelpers.ts
import type { ReviewResponse } from '../api/review';

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

/**
 * Calculate average rating from reviews
 */
export const calculateAverageRating = (reviews: ReviewResponse[]): number => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Get rating distribution (count or percentage)
 */
export const getRatingDistribution = (
  reviews: ReviewResponse[],
  asPercentage = true,
): RatingDistribution => {
  const distribution: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((review) => {
    distribution[review.rating as keyof RatingDistribution]++;
  });

  if (asPercentage && reviews.length > 0) {
    Object.keys(distribution).forEach((key) => {
      const rating = Number(key) as keyof RatingDistribution;
      distribution[rating] = Math.round(
        (distribution[rating] / reviews.length) * 100,
      );
    });
  }

  return distribution;
};

/**
 * Format review date (e.g., "2 days ago", "1 month ago")
 */
export const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return date.toLocaleDateString('vi-VN');
};

/**
 * Truncate review content
 */
export const truncateReviewContent = (
  content: string,
  maxLength: number,
): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

/**
 * Get reviews with images only
 */
export const getReviewsWithImages = (
  reviews: ReviewResponse[],
): ReviewResponse[] => {
  // This would need reviewImages to be populated in ReviewResponse
  // For now, return all reviews (update when images are populated)
  return reviews;
};

/**
 * Sort reviews by rating (high to low or low to high)
 */
export const sortReviewsByRating = (
  reviews: ReviewResponse[],
  order: 'high' | 'low' = 'high',
): ReviewResponse[] => {
  return [...reviews].sort((a, b) =>
    order === 'high' ? b.rating - a.rating : a.rating - b.rating,
  );
};

/**
 * Sort reviews by date (newest or oldest)
 */
export const sortReviewsByDate = (
  reviews: ReviewResponse[],
  order: 'newest' | 'oldest' = 'newest',
): ReviewResponse[] => {
  return [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Filter reviews by rating
 */
export const filterReviewsByRating = (
  reviews: ReviewResponse[],
  rating: number,
): ReviewResponse[] => {
  return reviews.filter((review) => review.rating === rating);
};
