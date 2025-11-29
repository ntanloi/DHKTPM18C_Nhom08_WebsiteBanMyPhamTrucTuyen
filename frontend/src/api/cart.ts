import axios from 'axios';

const API_BASE_URL = '/api/cart';

export interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItemResponse[];
}

export const getCartByUserId = async (
  userId: number,
): Promise<CartResponse> => {
  const response = await axios.get<CartResponse>(
    `${API_BASE_URL}/user/${userId}`,
  );
  return response.data;
};

export const addToCart = async (
  userId: number,
  request: AddToCartRequest,
): Promise<CartResponse> => {
  const response = await axios.post<CartResponse>(
    `${API_BASE_URL}/user/${userId}/items`,
    request,
  );
  return response.data;
};

export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  request: UpdateCartItemRequest,
): Promise<CartResponse> => {
  const response = await axios.put<CartResponse>(
    `${API_BASE_URL}/user/${userId}/items/${cartItemId}`,
    request,
  );
  return response.data;
};

export const removeCartItem = async (
  userId: number,
  cartItemId: number,
): Promise<CartResponse> => {
  const response = await axios.delete<CartResponse>(
    `${API_BASE_URL}/user/${userId}/items/${cartItemId}`,
  );
  return response.data;
};

export const clearCart = async (
  userId: number,
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/user/${userId}/clear`,
  );
  return response.data;
};
