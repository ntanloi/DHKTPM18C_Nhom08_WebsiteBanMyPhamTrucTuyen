import api from '../lib/api';
import type { PaymentMethod } from '../types/PaymentMethod';

/**
 * API service for payment method endpoints
 */

/**
 * Get all active payment methods (public)
 */
export const getActivePaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get<PaymentMethod[]>('/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching active payment methods:', error);
    throw error;
  }
};

/**
 * Get all payment methods including inactive (admin only)
 */
export const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get<PaymentMethod[]>('/payment-methods/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all payment methods:', error);
    throw error;
  }
};

/**
 * Get payment method by ID
 */
export const getPaymentMethodById = async (id: number): Promise<PaymentMethod> => {
  try {
    const response = await api.get<PaymentMethod>(`/payment-methods/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment method ${id}:`, error);
    throw error;
  }
};

/**
 * Get payment method by code
 */
export const getPaymentMethodByCode = async (code: string): Promise<PaymentMethod> => {
  try {
    const response = await api.get<PaymentMethod>(`/payment-methods/code/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment method with code ${code}:`, error);
    throw error;
  }
};

/**
 * Create new payment method (admin only)
 */
export const createPaymentMethod = async (data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> => {
  try {
    const response = await api.post<PaymentMethod>('/payment-methods', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

/**
 * Update payment method (admin only)
 */
export const updatePaymentMethod = async (id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  try {
    const response = await api.put<PaymentMethod>(`/payment-methods/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment method ${id}:`, error);
    throw error;
  }
};

/**
 * Toggle payment method active status (admin only)
 */
export const togglePaymentMethod = async (id: number): Promise<PaymentMethod> => {
  try {
    const response = await api.patch<PaymentMethod>(`/payment-methods/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling payment method ${id}:`, error);
    throw error;
  }
};

/**
 * Delete payment method (admin only)
 */
export const deletePaymentMethod = async (id: number): Promise<void> => {
  try {
    await api.delete(`/payment-methods/${id}`);
  } catch (error) {
    console.error(`Error deleting payment method ${id}:`, error);
    throw error;
  }
};
