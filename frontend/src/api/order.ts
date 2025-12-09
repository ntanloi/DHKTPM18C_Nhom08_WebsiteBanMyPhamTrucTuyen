import api from '../lib/api';

const API_BASE_URL = '/orders';

export interface OrderItemRequest {
  productVariantId: number;
  quantity: number;
}

export interface RecipientInfoRequest {
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientEmail: string;
  shippingRecipientAddress: string;
  isAnotherReceiver: boolean;
}

export interface CreateOrderRequest {
  userId: number;
  orderItems: OrderItemRequest[];
  notes?: string;
  couponId?: number;
  recipientInfo: RecipientInfoRequest;
  paymentMethodId: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface OrderItemResponse {
  id: number;
  orderId?: number;
  productVariantId: number;
  quantity: number;
  price?: number;
  productName?: string;
  variantName?: string;
  imageUrl?: string; // Product image URL
  productSlug?: string; // Product slug for navigation
  subtotal?: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  status: string;
  subtotal: number;
  totalAmount: number;
  notes: string;
  discountAmount: number;
  shippingFee: number;
  estimateDeliveryFrom: string;
  estimateDeliveryTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipientInfoResponse {
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientEmail: string;
  shippingRecipientAddress: string;
  isAnotherReceiver: boolean;
}

export interface PaymentInfoResponse {
  id: number;
  amount: number;
  status: string;
  transactionCode?: string;
  createdAt: string;
}

export interface OrderDetailResponse {
  id: number;
  userId: number;
  status: string;
  subtotal: number;
  totalAmount: number;
  notes: string;
  discountAmount: number;
  shippingFee: number;
  estimateDeliveryFrom: string;
  estimateDeliveryTo: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemResponse[];
  recipientInfo?: RecipientInfoResponse;
  paymentInfo?: PaymentInfoResponse;
}

export const createOrder = async (
  request: CreateOrderRequest,
): Promise<OrderDetailResponse> => {
  const response = await api.post<OrderDetailResponse>(API_BASE_URL, request);
  return response.data;
};

export const getOrderDetail = async (
  orderId: number,
): Promise<OrderDetailResponse> => {
  const response = await api.get<OrderDetailResponse>(
    `${API_BASE_URL}/${orderId}`,
  );
  return response.data;
};

export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const response = await api.get<OrderResponse[]>(API_BASE_URL);
  return response.data;
};

export const getOrdersByUserId = async (
  userId: number,
): Promise<OrderResponse[]> => {
  const response = await api.get<OrderResponse[]>(
    `${API_BASE_URL}/user/${userId}`,
  );
  return response.data;
};

export const getOrdersByStatus = async (
  status: string,
): Promise<OrderResponse[]> => {
  const response = await api.get<OrderResponse[]>(
    `${API_BASE_URL}/status/${status}`,
  );
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  request: UpdateOrderStatusRequest,
): Promise<OrderResponse> => {
  const response = await api.put<OrderResponse>(
    `${API_BASE_URL}/${orderId}/status`,
    request,
  );
  return response.data;
};

export const cancelOrder = async (orderId: number): Promise<OrderResponse> => {
  const response = await api.put<OrderResponse>(
    `${API_BASE_URL}/${orderId}/cancel`,
  );
  return response.data;
};

export const deleteOrder = async (
  orderId: number,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_BASE_URL}/${orderId}`,
  );
  return response.data;
};

// ==================== Guest Order APIs ====================

export interface CreateGuestOrderRequest {
  orderItems: OrderItemRequest[];
  notes?: string;
  recipientInfo: RecipientInfoRequest;
  paymentMethodId: number;
}

export const createGuestOrder = async (
  request: CreateGuestOrderRequest,
): Promise<OrderDetailResponse> => {
  const response = await api.post<OrderDetailResponse>(
    `${API_BASE_URL}/guest`,
    request,
  );
  return response.data;
};

export const getGuestOrderDetail = async (
  orderId: number,
  email: string,
): Promise<OrderDetailResponse> => {
  const response = await api.get<OrderDetailResponse>(
    `${API_BASE_URL}/guest/${orderId}`,
    { params: { email } },
  );
  return response.data;
};
