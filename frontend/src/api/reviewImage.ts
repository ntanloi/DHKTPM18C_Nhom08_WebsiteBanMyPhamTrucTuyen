import axios from 'axios';
import { mockReviewImageService } from '../mocks/productData';

const API_BASE_URL = '/api/review-images';
const USE_MOCK = true;

export interface ReviewImageRequest {
  reviewId: number;
  imageUrl: string;
}

export interface ReviewImageResponse {
  id: number;
  reviewId: number;
  imageUrl: string;
}

export const getReviewImagesByReviewId = async (
  reviewId: number,
): Promise<ReviewImageResponse[]> => {
  if (USE_MOCK)
    return mockReviewImageService.getReviewImagesByReviewId(reviewId);
  const response = await axios.get<ReviewImageResponse[]>(
    `${API_BASE_URL}/review/${reviewId}`,
  );
  return response.data;
};

export const createReviewImage = async (
  request: ReviewImageRequest,
): Promise<ReviewImageResponse> => {
  if (USE_MOCK) return mockReviewImageService.createReviewImage(request);
  const response = await axios.post<ReviewImageResponse>(API_BASE_URL, request);
  return response.data;
};

export const deleteReviewImage = async (
  imageId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockReviewImageService.deleteReviewImage(imageId);
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${imageId}`,
  );
  return response.data;
};
