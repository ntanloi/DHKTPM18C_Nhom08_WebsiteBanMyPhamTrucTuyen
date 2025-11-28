import type { Return } from '../types/Return';
import { mockOrders } from '../mocks/orderMockData';

// Mock returns data
export const mockReturns: Return[] = [
  {
    id: 1,
    orderId: 1,
    reason: 'Sản phẩm bị lỗi màn hình, có vết xước khi nhận hàng',
    createdAt: '2025-01-18T10:00:00',
    updatedAt: '2025-01-18T10:00:00',
  },
  {
    id: 2,
    orderId: 2,
    reason: 'Giao sai màu sản phẩm, đặt màu đen nhưng nhận màu trắng',
    createdAt: '2025-01-21T15:30:00',
    updatedAt: '2025-01-21T15:30:00',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockReturnService = {
  /**
   * GET /api/returns
   */
  getAllReturns: async (): Promise<Return[]> => {
    await delay(300);
    return [...mockReturns];
  },

  /**
   * GET /api/orders/{orderId}/return
   */
  getReturnByOrderId: async (orderId: number): Promise<Return | null> => {
    await delay(300);
    const returnInfo = mockReturns.find((r) => r.orderId === orderId);
    return returnInfo ? { ...returnInfo } : null;
  },

  /**
   * GET /api/returns/{returnId}
   */
  getReturnById: async (returnId: number): Promise<Return> => {
    await delay(200);
    const returnInfo = mockReturns.find((r) => r.id === returnId);
    if (!returnInfo) {
      throw new Error('Return request not found');
    }
    return { ...returnInfo };
  },

  /**
   * POST /api/orders/{orderId}/return
   */
  createReturn: async (orderId: number, reason: string): Promise<Return> => {
    await delay(500);

    // Check if return already exists
    const exists = mockReturns.some((r) => r.orderId === orderId);
    if (exists) {
      throw new Error('Yêu cầu hoàn trả đã tồn tại cho đơn hàng này');
    }

    // Check if order can be returned
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'DELIVERED') {
      throw new Error('Chỉ có thể hoàn trả đơn hàng đã giao');
    }

    const newReturn: Return = {
      id: Math.max(...mockReturns.map((r) => r.id), 0) + 1,
      orderId,
      reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReturns.push(newReturn);

    // Update order
    order.returnInfo = newReturn;

    return newReturn;
  },

  /**
   * PUT /api/returns/{returnId}
   */
  updateReturn: async (
    returnId: number,
    data: Partial<Return>,
  ): Promise<Return> => {
    await delay(500);

    const index = mockReturns.findIndex((r) => r.id === returnId);
    if (index === -1) {
      throw new Error('Return request not found');
    }

    mockReturns[index] = {
      ...mockReturns[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update order's returnInfo
    const order = mockOrders.find((o) => o.id === mockReturns[index].orderId);
    if (order) {
      order.returnInfo = mockReturns[index];
    }

    return mockReturns[index];
  },

  /**
   * POST /api/returns/{returnId}/approve
   */
  approveReturn: async (returnId: number, notes?: string): Promise<Return> => {
    await delay(500);

    const returnInfo = await mockReturnService.getReturnById(returnId);

    // Update return with notes
    const updated = await mockReturnService.updateReturn(returnId, {
      reason: notes
        ? `${returnInfo.reason}\n\nGhi chú: ${notes}`
        : returnInfo.reason,
    });

    // Update order status
    const order = mockOrders.find((o) => o.id === returnInfo.orderId);
    if (order && order.payment) {
      // Mark payment as pending refund
      order.payment.status = 'REFUNDED';
      order.payment.updatedAt = new Date().toISOString();
    }

    return updated;
  },

  /**
   * POST /api/returns/{returnId}/reject
   */
  rejectReturn: async (returnId: number, reason: string): Promise<Return> => {
    await delay(500);

    const returnInfo = await mockReturnService.getReturnById(returnId);

    const updated = await mockReturnService.updateReturn(returnId, {
      reason: `${returnInfo.reason}\n\nLý do từ chối: ${reason}`,
    });

    return updated;
  },

  /**
   * POST /api/returns/{returnId}/process-refund
   */
  processRefund: async (returnId: number): Promise<Return> => {
    await delay(800);

    const returnInfo = await mockReturnService.getReturnById(returnId);

    // Update payment status
    const order = mockOrders.find((o) => o.id === returnInfo.orderId);
    if (order && order.payment) {
      order.payment.status = 'REFUNDED';
      order.payment.updatedAt = new Date().toISOString();
      order.payment.providerResponse = 'Refund processed successfully';
    }

    const updated = await mockReturnService.updateReturn(returnId, {
      reason: `${returnInfo.reason}\n\n✅ Đã hoàn tiền thành công`,
    });

    return updated;
  },

  /**
   * DELETE /api/returns/{returnId}
   */
  deleteReturn: async (returnId: number): Promise<{ message: string }> => {
    await delay(400);

    const index = mockReturns.findIndex((r) => r.id === returnId);
    if (index === -1) {
      throw new Error('Return request not found');
    }

    const orderId = mockReturns[index].orderId;
    mockReturns.splice(index, 1);

    // Remove from order
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      order.returnInfo = undefined;
    }

    return { message: 'Xóa yêu cầu hoàn trả thành công' };
  },

  /**
   * GET /api/returns/statistics
   */
  getStatistics: async () => {
    await delay(300);
    return {
      total: mockReturns.length,
      pending: 0, // All are pending in this mock
      approved: 0,
      rejected: 0,
      refunded: 0,
    };
  },
};

// Service wrapper with feature flag
const USE_MOCK = true;

export const returnService = USE_MOCK ? mockReturnService : mockReturnService; // Replace with real service when available
