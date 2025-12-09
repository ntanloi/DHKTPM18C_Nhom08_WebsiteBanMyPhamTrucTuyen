import api from '../lib/api';

const API_BASE_URL = '/coupons';

export interface CouponResponse {
  id: number;
  code: string;
  description: string;
  isActive: boolean;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue?: number;
  maxUsageValue?: number;
  validFrom?: string;
  validTo?: string;
  createdByUserId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateCouponRequest {
  couponCode: string;
  subtotal: number;
  userId?: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  couponId?: number;
  couponCode?: string;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  discountAmount?: number;
  description?: string;
  error?: string;
}

export interface CreateCouponRequest {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue?: number;
  maxUsageValue?: number;
  validFrom?: string;
  validTo?: string;
  createdByUserId?: number;
}

export interface UpdateCouponRequest {
  description?: string;
  isActive?: boolean;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  minOrderValue?: number;
  maxUsageValue?: number;
  validFrom?: string;
  validTo?: string;
}

export const getCouponById = async (
  couponId: number,
): Promise<CouponResponse> => {
  const response = await api.get<CouponResponse>(`${API_BASE_URL}/${couponId}`);
  return response.data;
};

export const getCouponByCode = async (
  code: string,
): Promise<CouponResponse> => {
  const response = await api.get<CouponResponse>(
    `${API_BASE_URL}/code/${code}`,
  );
  return response.data;
};

export const validateAndCalculateDiscount = async (
  request: ValidateCouponRequest,
): Promise<ValidateCouponResponse> => {
  const response = await api.post<ValidateCouponResponse>(
    `${API_BASE_URL}/validate`,
    request,
  );
  return response.data;
};

export const getActiveCoupons = async (): Promise<CouponResponse[]> => {
  const response = await api.get<CouponResponse[]>(`${API_BASE_URL}/active`);
  return response.data;
};

export const getAllCoupons = async (): Promise<CouponResponse[]> => {
  const response = await api.get<CouponResponse[]>(API_BASE_URL);
  return response.data;
};

export const deactivateCoupon = async (
  couponId: number,
): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>(
    `${API_BASE_URL}/${couponId}/deactivate`,
  );
  return response.data;
};

export const deleteCoupon = async (
  couponId: number,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_BASE_URL}/${couponId}`,
  );
  return response.data;
};

export const createCoupon = async (
  request: CreateCouponRequest,
): Promise<CouponResponse> => {
  const response = await api.post<CouponResponse>(API_BASE_URL, request);
  return response.data;
};

export const updateCoupon = async (
  couponId: number,
  request: UpdateCouponRequest,
): Promise<CouponResponse> => {
  const response = await api.put<CouponResponse>(
    `${API_BASE_URL}/${couponId}`,
    request,
  );
  return response.data;
};
