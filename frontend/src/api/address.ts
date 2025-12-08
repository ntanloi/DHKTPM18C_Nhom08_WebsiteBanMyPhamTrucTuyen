import { api } from '../lib/api';
import { mockAddressService } from '../mocks/userData';

const API_BASE_URL = '/addresses';
const USE_MOCK = false; // Set to true for development without backend

export interface CreateAddressRequest {
  recipientName: string;
  recipientPhone: string;
  streetAddress: string;
  ward: string;
  district: string;
  city: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  recipientName?: string;
  recipientPhone?: string;
  streetAddress?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}

export interface AddressResponse {
  id: number;
  userId: number;
  recipientName: string;
  recipientPhone: string;
  streetAddress: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createAddress = async (
  userId: number,
  request: CreateAddressRequest,
): Promise<AddressResponse> => {
  const response = await api.post<AddressResponse>(
    `${API_BASE_URL}/user/${userId}`,
    request,
  );
  return response.data;
};

export const getAddressById = async (
  addressId: number,
): Promise<AddressResponse> => {
  const response = await api.get<AddressResponse>(
    `${API_BASE_URL}/${addressId}`,
  );
  return response.data;
};

export const getAddressesByUserId = async (
  userId: number,
): Promise<AddressResponse[]> => {
  if (USE_MOCK) return mockAddressService.getAddressesByUserId(userId);
  const response = await api.get<AddressResponse[]>(
    `${API_BASE_URL}/user/${userId}`,
  );
  return response.data;
};

export const getDefaultAddress = async (
  userId: number,
): Promise<AddressResponse> => {
  const response = await api.get<AddressResponse>(
    `${API_BASE_URL}/user/${userId}/default`,
  );
  return response.data;
};

export const updateAddress = async (
  addressId: number,
  request: UpdateAddressRequest,
): Promise<AddressResponse> => {
  const response = await api.put<AddressResponse>(
    `${API_BASE_URL}/${addressId}`,
    request,
  );
  return response.data;
};

export const deleteAddress = async (
  addressId: number,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_BASE_URL}/${addressId}`,
  );
  return response.data;
};
