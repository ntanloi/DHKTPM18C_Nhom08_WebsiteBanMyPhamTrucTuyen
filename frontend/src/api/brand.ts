import axios from 'axios';
import { mockBrandService } from '../mocks/productData';

const API_BASE_URL = '/api/brands';
const USE_MOCK = false; // Set to true for development without backend

export interface BrandRequest {
  name: string;
  slug: string;
  logoUrl: string;
}

export interface BrandResponse {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllBrands = async (): Promise<BrandResponse[]> => {
  if (USE_MOCK) return mockBrandService.getAllBrands();
  const response = await axios.get<BrandResponse[]>(API_BASE_URL);
  return response.data;
};

export const getBrandById = async (brandId: number): Promise<BrandResponse> => {
  if (USE_MOCK) return mockBrandService.getBrandById(brandId);
  const response = await axios.get<BrandResponse>(`${API_BASE_URL}/${brandId}`);
  return response.data;
};

export const getBrandBySlug = async (slug: string): Promise<BrandResponse> => {
  if (USE_MOCK) return mockBrandService.getBrandBySlug(slug);
  const response = await axios.get<BrandResponse>(
    `${API_BASE_URL}/slug/${slug}`,
  );
  return response.data;
};

export const createBrand = async (
  request: BrandRequest,
): Promise<BrandResponse> => {
  if (USE_MOCK) return mockBrandService.createBrand(request);
  const response = await axios.post<BrandResponse>(API_BASE_URL, request);
  return response.data;
};

export const updateBrand = async (
  brandId: number,
  request: BrandRequest,
): Promise<BrandResponse> => {
  if (USE_MOCK) return mockBrandService.updateBrand(brandId, request);
  const response = await axios.put<BrandResponse>(
    `${API_BASE_URL}/${brandId}`,
    request,
  );
  return response.data;
};

export const deleteBrand = async (
  brandId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockBrandService.deleteBrand(brandId);
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${brandId}`,
  );
  return response.data;
};
