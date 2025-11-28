import axios from 'axios';

const API_BASE_URL = '/api/orders';

export interface CreateOrderRequest {
  userId: number;
  subtotal: number;
  totalAmount: number;
  notes?: string;
  discountAmount?: number;
  shippingFee: number;
  estimateDeliveryFrom: string;
  estimateDeliveryTo: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface OrderItemResponse {
  id: number;
  orderId: number;
  productVariantId: number;
  quantity: number;
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
}

export const createOrder = async (
  request: CreateOrderRequest,
): Promise<OrderDetailResponse> => {
  const response = await axios.post<OrderDetailResponse>(API_BASE_URL, request);
  return response.data;
};

export const getOrderDetail = async (
  orderId: number,
): Promise<OrderDetailResponse> => {
  const response = await axios.get<OrderDetailResponse>(
    `${API_BASE_URL}/${orderId}`,
  );
  return response.data;
};

export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const response = await axios.get<OrderResponse[]>(API_BASE_URL);
  return response.data;
};

export const getOrdersByUserId = async (
  userId: number,
): Promise<OrderResponse[]> => {
  const response = await axios.get<OrderResponse[]>(
    `${API_BASE_URL}/user/${userId}`,
  );
  return response.data;
};

export const getOrdersByStatus = async (
  status: string,
): Promise<OrderResponse[]> => {
  const response = await axios.get<OrderResponse[]>(
    `${API_BASE_URL}/status/${status}`,
  );
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  request: UpdateOrderStatusRequest,
): Promise<OrderResponse> => {
  const response = await axios.put<OrderResponse>(
    `${API_BASE_URL}/${orderId}/status`,
    request,
  );
  return response.data;
};

export const cancelOrder = async (orderId: number): Promise<OrderResponse> => {
  const response = await axios.put<OrderResponse>(
    `${API_BASE_URL}/${orderId}/cancel`,
  );
  return response.data;
};

export const deleteOrder = async (
  orderId: number,
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${orderId}`,
  );
  return response.data;
};
