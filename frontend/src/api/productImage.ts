import axios from 'axios';
import { mockProductImageService } from '../mocks/productData';

const API_BASE_URL = '/api/product-images';
const USE_MOCK = false; // Set to true for development without backend

export interface ProductImageResponse {
  id: number;
  productId: number;
  imageUrl: string;
}

export interface ProductImageRequest {
  productId: number;
  imageUrl: string;
}

export const getAllProductImages = async (): Promise<
  ProductImageResponse[]
> => {
  if (USE_MOCK) return mockProductImageService.getAllProductImages();
  const response = await axios.get<ProductImageResponse[]>(API_BASE_URL);
  return response.data;
};

export const getProductImageById = async (
  imageId: number,
): Promise<ProductImageResponse> => {
  if (USE_MOCK) return mockProductImageService.getProductImageById(imageId);
  const response = await axios.get<ProductImageResponse>(
    `${API_BASE_URL}/${imageId}`,
  );
  return response.data;
};

export const getProductImagesByProductId = async (
  productId: number,
): Promise<ProductImageResponse[]> => {
  if (USE_MOCK)
    return mockProductImageService.getProductImagesByProductId(productId);
  const response = await axios.get<ProductImageResponse[]>(
    `${API_BASE_URL}/product/${productId}`,
  );
  return response.data;
};

export const createProductImage = async (
  request: ProductImageRequest,
): Promise<ProductImageResponse> => {
  if (USE_MOCK) return mockProductImageService.createProductImage(request);
  const response = await axios.post<ProductImageResponse>(
    API_BASE_URL,
    request,
  );
  return response.data;
};

export const updateProductImage = async (
  imageId: number,
  request: ProductImageRequest,
): Promise<ProductImageResponse> => {
  if (USE_MOCK)
    return mockProductImageService.updateProductImage(imageId, request);
  const response = await axios.put<ProductImageResponse>(
    `${API_BASE_URL}/${imageId}`,
    request,
  );
  return response.data;
};

export const deleteProductImage = async (
  imageId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockProductImageService.deleteProductImage(imageId);
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${imageId}`,
  );
  return response.data;
};
