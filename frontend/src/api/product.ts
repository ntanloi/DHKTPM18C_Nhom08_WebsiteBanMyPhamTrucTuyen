import axios from 'axios';
import { mockProductService } from '../mocks/productData';

const API_BASE_URL = '/api/products';
const USE_MOCK = true;

export interface ProductRequest {
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  brandId: number;
  status: string;
  variant?: {
    name: string;
    sku: string;
    price: number;
    salePrice?: number;
    stockQuantity: number;
    attributes?: Array<{ name: string; value: string }>;
  };
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  brandId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetailResponse extends ProductResponse {
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  productVariant?: {
    id: number;
    name: string;
    sku: string;
    price: number;
    salePrice: number | null;
    stockQuantity: number;
  };
}

export const getAllProducts = async (): Promise<ProductResponse[]> => {
  if (USE_MOCK) return mockProductService.getAllProducts();
  const response = await axios.get<ProductResponse[]>(API_BASE_URL);
  return response.data;
};

export const getProductById = async (
  productId: number,
): Promise<ProductDetailResponse> => {
  if (USE_MOCK) return mockProductService.getProductById(productId);
  const response = await axios.get<ProductDetailResponse>(
    `${API_BASE_URL}/${productId}`,
  );
  return response.data;
};

export const getProductBySlug = async (
  slug: string,
): Promise<ProductDetailResponse> => {
  if (USE_MOCK) return mockProductService.getProductBySlug(slug);
  const response = await axios.get<ProductDetailResponse>(
    `${API_BASE_URL}/slug/${slug}`,
  );
  return response.data;
};

export const getProductsByCategoryId = async (
  categoryId: number,
): Promise<ProductResponse[]> => {
  if (USE_MOCK) return mockProductService.getProductsByCategoryId(categoryId);
  const response = await axios.get<ProductResponse[]>(
    `${API_BASE_URL}/category/${categoryId}`,
  );
  return response.data;
};

export const getProductsByBrandId = async (
  brandId: number,
): Promise<ProductResponse[]> => {
  if (USE_MOCK) return mockProductService.getProductsByBrandId(brandId);
  const response = await axios.get<ProductResponse[]>(
    `${API_BASE_URL}/brand/${brandId}`,
  );
  return response.data;
};

export const getProductsByStatus = async (
  status: string,
): Promise<ProductResponse[]> => {
  if (USE_MOCK) return mockProductService.getProductsByStatus(status);
  const response = await axios.get<ProductResponse[]>(
    `${API_BASE_URL}/status/${status}`,
  );
  return response.data;
};

export const createProduct = async (
  request: ProductRequest,
): Promise<ProductResponse> => {
  if (USE_MOCK) return mockProductService.createProduct(request);
  const response = await axios.post<ProductResponse>(API_BASE_URL, request);
  return response.data;
};

export const updateProduct = async (
  productId: number,
  request: ProductRequest,
): Promise<ProductResponse> => {
  if (USE_MOCK) return mockProductService.updateProduct(productId, request);
  const response = await axios.put<ProductResponse>(
    `${API_BASE_URL}/${productId}`,
    request,
  );
  return response.data;
};

export const deleteProduct = async (
  productId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockProductService.deleteProduct(productId);
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${productId}`,
  );
  return response.data;
};

export const getVariantAttributesByVariantId = async (variantId: number) => {
  if (USE_MOCK)
    return mockProductService.getVariantAttributesByVariantId(variantId);
  const response = await axios.get(
    `/api/variant-attributes/variant/${variantId}`,
  );
  return response.data;
};
