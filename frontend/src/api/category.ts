import axios from 'axios';
import { mockCategoryService } from '../mocks/productData';

const API_BASE_URL = '/api/categories';
const USE_MOCK = false; // Set to true for development without backend

export interface CategoryRequest {
  name: string;
  slug: string;
  parentCategoryId?: number | null;
  imageUrl: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  if (USE_MOCK) return mockCategoryService.getAllCategories();
  const response = await axios.get<CategoryResponse[]>(API_BASE_URL);
  return response.data;
};

export const getCategoryById = async (
  categoryId: number,
): Promise<CategoryResponse> => {
  if (USE_MOCK) return mockCategoryService.getCategoryById(categoryId);
  const response = await axios.get<CategoryResponse>(
    `${API_BASE_URL}/${categoryId}`,
  );
  return response.data;
};

export const getCategoryBySlug = async (
  slug: string,
): Promise<CategoryResponse> => {
  if (USE_MOCK) return mockCategoryService.getCategoryBySlug(slug);
  const response = await axios.get<CategoryResponse>(
    `${API_BASE_URL}/slug/${slug}`,
  );
  return response.data;
};

export const getCategoriesByParentId = async (
  parentCategoryId: number,
): Promise<CategoryResponse[]> => {
  if (USE_MOCK)
    return mockCategoryService.getCategoriesByParentId(parentCategoryId);
  const response = await axios.get<CategoryResponse[]>(
    `${API_BASE_URL}/parent/${parentCategoryId}`,
  );
  return response.data;
};

export const createCategory = async (
  request: CategoryRequest,
): Promise<CategoryResponse> => {
  if (USE_MOCK) return mockCategoryService.createCategory(request);
  const response = await axios.post<CategoryResponse>(API_BASE_URL, request);
  return response.data;
};

export const updateCategory = async (
  categoryId: number,
  request: CategoryRequest,
): Promise<CategoryResponse> => {
  if (USE_MOCK) return mockCategoryService.updateCategory(categoryId, request);
  const response = await axios.put<CategoryResponse>(
    `${API_BASE_URL}/${categoryId}`,
    request,
  );
  return response.data;
};

export const deleteCategory = async (
  categoryId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockCategoryService.deleteCategory(categoryId);
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${categoryId}`,
  );
  return response.data;
};
