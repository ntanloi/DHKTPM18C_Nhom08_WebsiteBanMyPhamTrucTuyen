import axios from 'axios';

const API_BASE_URL = '/api/product-variants';
// const USE_MOCK = true;

export interface ProductVariantRequest {
  productId: number;
  name: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
}

export interface ProductVariantResponse {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
}

export const getAllProductVariants = async (): Promise<
  ProductVariantResponse[]
> => {
  const response = await axios.get<ProductVariantResponse[]>(API_BASE_URL);
  return response.data;
};

export const getProductVariantById = async (
  variantId: number,
): Promise<ProductVariantResponse> => {
  const response = await axios.get<ProductVariantResponse>(
    `${API_BASE_URL}/${variantId}`,
  );
  return response.data;
};

export const getProductVariantsByProductId = async (
  productId: number,
): Promise<ProductVariantResponse[]> => {
  const response = await axios.get<ProductVariantResponse[]>(
    `${API_BASE_URL}/product/${productId}`,
  );
  return response.data;
};

export const createProductVariant = async (
  request: ProductVariantRequest,
): Promise<ProductVariantResponse> => {
  const response = await axios.post<ProductVariantResponse>(
    API_BASE_URL,
    request,
  );
  return response.data;
};

export const updateProductVariant = async (
  variantId: number,
  request: ProductVariantRequest,
): Promise<ProductVariantResponse> => {
  const response = await axios.put<ProductVariantResponse>(
    `${API_BASE_URL}/${variantId}`,
    request,
  );
  return response.data;
};

export const deleteProductVariant = async (
  variantId: number,
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${variantId}`,
  );
  return response.data;
};
