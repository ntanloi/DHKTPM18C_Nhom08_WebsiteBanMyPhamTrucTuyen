import axios from 'axios';

const API_BASE_URL = '/api/coupons';

export interface CreateCouponRequest {
  code: string;
  description: string;
  isActive: boolean;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxUsageValue: number;
  validFrom: string;
  validTo: string;
  createdByUserId: number;
}

export interface UpdateCouponRequest {
  code?: string;
  description?: string;
  isActive?: boolean;
  discountType?: string;
  discountValue?: number;
  minOrderValue?: number;
  maxUsageValue?: number;
  validFrom?: string;
  validTo?: string;
}

export interface CouponResponse {
  id: number;
  code: string;
  description: string;
  isActive: boolean;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxUsageValue: number;
  validFrom: string;
  validTo: string;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export const createCoupon = async (
  request: CreateCouponRequest,
): Promise<CouponResponse> => {
  const response = await axios.post<CouponResponse>(API_BASE_URL, request);
  return response.data;
};

export const getCouponById = async (
  couponId: number,
): Promise<CouponResponse> => {
  const response = await axios.get<CouponResponse>(
    `${API_BASE_URL}/${couponId}`,
  );
  return response.data;
};

export const getCouponByCode = async (
  code: string,
): Promise<CouponResponse> => {
  const response = await axios.get<CouponResponse>(
    `${API_BASE_URL}/code/${code}`,
  );
  return response.data;
};

export const getAllCoupons = async (): Promise<CouponResponse[]> => {
  const response = await axios.get<CouponResponse[]>(API_BASE_URL);
  return response.data;
};

export const getActiveCoupons = async (): Promise<CouponResponse[]> => {
  const response = await axios.get<CouponResponse[]>(`${API_BASE_URL}/active`);
  return response.data;
};

export const updateCoupon = async (
  couponId: number,
  request: UpdateCouponRequest,
): Promise<CouponResponse> => {
  const response = await axios.put<CouponResponse>(
    `${API_BASE_URL}/${couponId}`,
    request,
  );
  return response.data;
};

export const deactivateCoupon = async (
  couponId: number,
): Promise<{ message: string }> => {
  const response = await axios.put<{ message: string }>(
    `${API_BASE_URL}/${couponId}/deactivate`,
  );
  return response.data;
};

export const deleteCoupon = async (
  couponId: number,
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${couponId}`,
  );
  return response.data;
};
