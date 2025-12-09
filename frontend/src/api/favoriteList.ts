// src/api/favorite.ts
import { api } from '../lib/api';
import { mockFavoriteService } from '../mocks/favoriteData';

const API_BASE_URL = '/favorites'; // Bỏ /api vì baseURL đã có rồi
const USE_MOCK = false; // Set to true for development without backend

export interface FavoriteListRequest {
  userId: number;
  productId: number;
}

export interface FavoriteListResponse {
  id: number;
  userId: number;
  productId: number;
  productName?: string;
  productSlug?: string;
  productImageUrl?: string;
  productPrice?: number;
  productSalePrice?: number;
  createdAt?: string;
}

export const getAllFavorites = async (): Promise<FavoriteListResponse[]> => {
  if (USE_MOCK) return mockFavoriteService.getAllFavorites();
  const response = await api.get<FavoriteListResponse[]>(API_BASE_URL);
  return response.data;
};

export const getFavoriteById = async (
  favoriteId: number,
): Promise<FavoriteListResponse> => {
  if (USE_MOCK) return mockFavoriteService.getFavoriteById(favoriteId);
  const response = await api.get<FavoriteListResponse>(
    `${API_BASE_URL}/${favoriteId}`,
  );
  return response.data;
};

export const getFavoritesByUserId = async (
  userId: number,
): Promise<FavoriteListResponse[]> => {
  if (USE_MOCK) return mockFavoriteService.getFavoritesByUserId(userId);
  const response = await api.get<FavoriteListResponse[]>(
    `${API_BASE_URL}/user/${userId}`,
  );
  return response.data;
};

export const getFavoritesByProductId = async (
  productId: number,
): Promise<FavoriteListResponse[]> => {
  if (USE_MOCK) return mockFavoriteService.getFavoritesByProductId(productId);
  const response = await api.get<FavoriteListResponse[]>(
    `${API_BASE_URL}/product/${productId}`,
  );
  return response.data;
};

export const getFavoriteCountByProductId = async (
  productId: number,
): Promise<number> => {
  if (USE_MOCK)
    return mockFavoriteService.getFavoriteCountByProductId(productId);
  const response = await api.get<{ count: number }>(
    `${API_BASE_URL}/product/${productId}/count`,
  );
  return response.data.count;
};

export const checkIsFavorited = async (
  userId: number,
  productId: number,
): Promise<boolean> => {
  if (USE_MOCK) return mockFavoriteService.checkIsFavorited(userId, productId);
  const response = await api.get<{ isFavorited: boolean }>(
    `${API_BASE_URL}/check?userId=${userId}&productId=${productId}`,
  );
  return response.data.isFavorited;
};

export const createFavorite = async (
  request: FavoriteListRequest,
): Promise<FavoriteListResponse> => {
  if (USE_MOCK) return mockFavoriteService.createFavorite(request);
  const response = await api.post<FavoriteListResponse>(API_BASE_URL, request);
  return response.data;
};

export const deleteFavorite = async (
  favoriteId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockFavoriteService.deleteFavorite(favoriteId);
  const response = await api.delete<{ message: string }>(
    `${API_BASE_URL}/${favoriteId}`,
  );
  return response.data;
};

export const deleteFavoriteByUserAndProduct = async (
  userId: number,
  productId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK)
    return mockFavoriteService.deleteFavoriteByUserAndProduct(
      userId,
      productId,
    );
  const response = await api.delete<{ message: string }>(
    `${API_BASE_URL}/user/${userId}/product/${productId}`,
  );
  return response.data;
};

export const getTopFavoritedProducts = async (limit = 5) => {
  if (USE_MOCK) return mockFavoriteService.getTopFavoritedProducts(limit);
  const response = await api.get<Array<{ productId: number; count: number }>>(
    `${API_BASE_URL}/top?limit=${limit}`,
  );
  return response.data;
};
