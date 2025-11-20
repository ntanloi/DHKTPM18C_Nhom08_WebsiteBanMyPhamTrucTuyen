import type { Review } from './Review';

export interface ReviewImage {
  id: number;
  reviewId: number;
  imageUrl: string;
  review?: Review;
}
