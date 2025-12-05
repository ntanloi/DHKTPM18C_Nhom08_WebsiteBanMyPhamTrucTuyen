import api from '../lib/api';

// ==================== Types ====================

export interface VNPayRequest {
  orderId: number;
  amount: number;
  orderInfo: string;
  bankCode?: string;
  language?: string;
}

export interface VNPayResponse {
  paymentUrl: string;
  transactionNo: string;
  orderId: string;
  message: string;
  success: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  icon?: string;
  isRecommended?: boolean;
  sortOrder?: number;
}

export interface PaymentInfo {
  id: number;
  orderId: number;
  amount: number;
  status: string;
  transactionCode?: string;
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
}

// ==================== VNPay APIs ====================

/**
 * Create VNPay payment URL
 */
export const createVNPayPayment = async (request: VNPayRequest): Promise<VNPayResponse> => {
  const response = await api.post<VNPayResponse>('/payments/vnpay/create', request);
  return response.data;
};

/**
 * Process VNPay callback (usually handled by redirect)
 */
export const processVNPayCallback = async (params: Record<string, string>): Promise<VNPayResponse> => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get<VNPayResponse>(`/payments/vnpay/callback?${queryString}`);
  return response.data;
};

// ==================== Payment Methods APIs ====================

/**
 * Get available payment methods
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await api.get<PaymentMethod[]>('/payment-methods');
  return response.data;
};

/**
 * Get payment info by order ID
 */
export const getPaymentByOrderId = async (orderId: number): Promise<PaymentInfo> => {
  const response = await api.get<PaymentInfo>(`/payments/order/${orderId}`);
  return response.data;
};
