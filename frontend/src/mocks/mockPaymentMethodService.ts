import type { PaymentMethod } from '../types/PaymentMethod';

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: 'Thanh toán khi nhận hàng (COD)',
    code: 'COD',
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
  },
  {
    id: 2,
    name: 'Chuyển khoản ngân hàng',
    code: 'BANK_TRANSFER',
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
  },
  {
    id: 3,
    name: 'Thẻ tín dụng/Ghi nợ',
    code: 'CREDIT_CARD',
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
  },
  {
    id: 4,
    name: 'Ví Momo',
    code: 'MOMO',
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
  },
  {
    id: 5,
    name: 'ZaloPay',
    code: 'ZALOPAY',
    isActive: false,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-06-01T00:00:00',
  },
  {
    id: 6,
    name: 'VNPay',
    code: 'VNPAY',
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockPaymentMethodService = {
  /**
   * GET /api/payment-methods
   */
  getAllPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await delay(300);
    return [...mockPaymentMethods];
  },

  /**
   * GET /api/payment-methods/active
   */
  getActivePaymentMethods: async (): Promise<PaymentMethod[]> => {
    await delay(300);
    return mockPaymentMethods.filter((m) => m.isActive);
  },

  /**
   * GET /api/payment-methods/{id}
   */
  getPaymentMethodById: async (id: number): Promise<PaymentMethod> => {
    await delay(200);
    const method = mockPaymentMethods.find((m) => m.id === id);
    if (!method) {
      throw new Error('Payment method not found');
    }
    return { ...method };
  },

  /**
   * POST /api/payment-methods
   */
  createPaymentMethod: async (
    data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentMethod> => {
    await delay(500);

    // Check if code already exists
    const exists = mockPaymentMethods.some(
      (m) => m.code.toUpperCase() === data.code.toUpperCase(),
    );
    if (exists) {
      throw new Error('Mã phương thức thanh toán đã tồn tại');
    }

    const newMethod: PaymentMethod = {
      id: Math.max(...mockPaymentMethods.map((m) => m.id)) + 1,
      ...data,
      code: data.code.toUpperCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPaymentMethods.push(newMethod);
    return newMethod;
  },

  /**
   * PUT /api/payment-methods/{id}
   */
  updatePaymentMethod: async (
    id: number,
    data: Partial<Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<PaymentMethod> => {
    await delay(500);

    const index = mockPaymentMethods.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Payment method not found');
    }

    // Check if new code conflicts with existing ones (excluding current)
    if (data.code) {
      const codeExists = mockPaymentMethods.some(
        (m) => m.id !== id && m.code.toUpperCase() === data.code!.toUpperCase(),
      );
      if (codeExists) {
        throw new Error('Mã phương thức thanh toán đã tồn tại');
      }
    }

    mockPaymentMethods[index] = {
      ...mockPaymentMethods[index],
      ...data,
      code: data.code
        ? data.code.toUpperCase()
        : mockPaymentMethods[index].code,
      updatedAt: new Date().toISOString(),
    };

    return mockPaymentMethods[index];
  },

  /**
   * DELETE /api/payment-methods/{id}
   */
  deletePaymentMethod: async (id: number): Promise<{ message: string }> => {
    await delay(400);

    const index = mockPaymentMethods.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Payment method not found');
    }

    // Check if payment method is being used
    // In real app, check if any orders use this method
    const method = mockPaymentMethods[index];
    if (method.isActive) {
      throw new Error(
        'Không thể xóa phương thức thanh toán đang hoạt động. Vui lòng tắt hoạt động trước.',
      );
    }

    mockPaymentMethods.splice(index, 1);
    return { message: 'Xóa phương thức thanh toán thành công' };
  },

  /**
   * PATCH /api/payment-methods/{id}/toggle
   */
  togglePaymentMethod: async (id: number): Promise<PaymentMethod> => {
    await delay(300);

    const index = mockPaymentMethods.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Payment method not found');
    }

    mockPaymentMethods[index].isActive = !mockPaymentMethods[index].isActive;
    mockPaymentMethods[index].updatedAt = new Date().toISOString();

    return mockPaymentMethods[index];
  },

  /**
   * GET /api/payment-methods/statistics
   */
  getStatistics: async () => {
    await delay(300);
    return {
      total: mockPaymentMethods.length,
      active: mockPaymentMethods.filter((m) => m.isActive).length,
      inactive: mockPaymentMethods.filter((m) => !m.isActive).length,
    };
  },
};

// Service wrapper with feature flag
const USE_MOCK = false; // Set to true for development without backend

export const paymentMethodService = USE_MOCK
  ? mockPaymentMethodService
  : mockPaymentMethodService; // Replace with real service when available
