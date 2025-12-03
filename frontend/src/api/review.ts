import axios from 'axios';
import { mockReviewService } from '../mocks/productData';

const API_BASE_URL = '/api/reviews';
const USE_MOCK = false; // Set to true for development without backend

export interface ReviewRequest {
  userId: number;
  productId: number;
  content: string;
  rating: number;
  title: string;
  email: string;
  nickname: string;
  isRecommend: boolean;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  productId: number;
  content: string;
  rating: number;
  title: string;
  email: string;
  nickname: string;
  isRecommend: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAllReviews = async (): Promise<ReviewResponse[]> => {
  if (USE_MOCK) return mockReviewService.getAllReviews();
  const response = await axios.get<ReviewResponse[]>(API_BASE_URL);
  return response.data;
};

export const getReviewById = async (
  reviewId: number,
): Promise<ReviewResponse> => {
  if (USE_MOCK) return mockReviewService.getReviewById(reviewId);
  const response = await axios.get<ReviewResponse>(
    `${API_BASE_URL}/${reviewId}`,
  );
  return response.data;
};

export const getReviewsByProductId = async (
  productId: number,
): Promise<ReviewResponse[]> => {
  if (USE_MOCK) return mockReviewService.getReviewsByProductId(productId);
  const response = await axios.get<ReviewResponse[]>(
    `${API_BASE_URL}/product/${productId}`,
  );
  return response.data;
};

export const getReviewsByUserId = async (
  userId: number,
): Promise<ReviewResponse[]> => {
  if (USE_MOCK) return mockReviewService.getReviewsByUserId(userId);
  const response = await axios.get<ReviewResponse[]>(
    `${API_BASE_URL}/user/${userId}`,
  );
  return response.data;
};

export const createReview = async (
  request: ReviewRequest,
): Promise<ReviewResponse> => {
  if (USE_MOCK) return mockReviewService.createReview(request);
  const response = await axios.post<ReviewResponse>(API_BASE_URL, request);
  return response.data;
};

export const updateReview = async (
  reviewId: number,
  request: ReviewRequest,
): Promise<ReviewResponse> => {
  if (USE_MOCK) return mockReviewService.updateReview(reviewId, request);
  const response = await axios.put<ReviewResponse>(
    `${API_BASE_URL}/${reviewId}`,
    request,
  );
  return response.data;
};

export const deleteReview = async (
  reviewId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockReviewService.deleteReview(reviewId);
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${reviewId}`,
  );
  return response.data;
};
