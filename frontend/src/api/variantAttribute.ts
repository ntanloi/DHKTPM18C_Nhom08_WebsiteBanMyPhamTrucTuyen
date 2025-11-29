import axios from 'axios';

const API_BASE_URL = '/api/variant-attributes';
// const USE_MOCK = true;

export interface VariantAttributeRequest {
  productVariantId: number;
  name: string;
  value: string;
}

export interface VariantAttributeResponse {
  id: number;
  productVariantId: number;
  name: string;
  value: string;
}

export const getAllVariantAttributes = async (): Promise<
  VariantAttributeResponse[]
> => {
  const response = await axios.get<VariantAttributeResponse[]>(API_BASE_URL);
  return response.data;
};

export const getVariantAttributeById = async (
  attributeId: number,
): Promise<VariantAttributeResponse> => {
  const response = await axios.get<VariantAttributeResponse>(
    `${API_BASE_URL}/${attributeId}`,
  );
  return response.data;
};

export const getVariantAttributesByProductVariantId = async (
  productVariantId: number,
): Promise<VariantAttributeResponse[]> => {
  const response = await axios.get<VariantAttributeResponse[]>(
    `${API_BASE_URL}/variant/${productVariantId}`,
  );
  return response.data;
};

export const createVariantAttribute = async (
  request: VariantAttributeRequest,
): Promise<VariantAttributeResponse> => {
  const response = await axios.post<VariantAttributeResponse>(
    API_BASE_URL,
    request,
  );
  return response.data;
};

export const updateVariantAttribute = async (
  attributeId: number,
  request: VariantAttributeRequest,
): Promise<VariantAttributeResponse> => {
  const response = await axios.put<VariantAttributeResponse>(
    `${API_BASE_URL}/${attributeId}`,
    request,
  );
  return response.data;
};

export const deleteVariantAttribute = async (
  attributeId: number,
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${attributeId}`,
  );
  return response.data;
};
