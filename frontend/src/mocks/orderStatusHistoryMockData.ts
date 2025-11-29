import type { OrderStatusHistory } from '../types/OrderStatusHistory';

export const mockOrderStatusHistory: OrderStatusHistory[] = [
  // Order 1 - DELIVERED
  {
    id: 1,
    orderId: 1,
    status: 'PENDING',
    createdAt: '2025-01-10T10:30:00',
    updatedAt: '2025-01-10T10:30:00',
  },
  {
    id: 2,
    orderId: 1,
    status: 'CONFIRMED',
    createdAt: '2025-01-10T11:00:00',
    updatedAt: '2025-01-10T11:00:00',
  },
  {
    id: 3,
    orderId: 1,
    status: 'PROCESSING',
    createdAt: '2025-01-11T09:00:00',
    updatedAt: '2025-01-11T09:00:00',
  },
  {
    id: 4,
    orderId: 1,
    status: 'SHIPPED',
    createdAt: '2025-01-12T09:00:00',
    updatedAt: '2025-01-12T09:00:00',
  },
  {
    id: 5,
    orderId: 1,
    status: 'DELIVERED',
    createdAt: '2025-01-17T14:20:00',
    updatedAt: '2025-01-17T14:20:00',
  },

  // Order 2 - SHIPPED
  {
    id: 6,
    orderId: 2,
    status: 'PENDING',
    createdAt: '2025-01-20T14:15:00',
    updatedAt: '2025-01-20T14:15:00',
  },
  {
    id: 7,
    orderId: 2,
    status: 'CONFIRMED',
    createdAt: '2025-01-20T14:30:00',
    updatedAt: '2025-01-20T14:30:00',
  },
  {
    id: 8,
    orderId: 2,
    status: 'PROCESSING',
    createdAt: '2025-01-20T16:00:00',
    updatedAt: '2025-01-20T16:00:00',
  },
  {
    id: 9,
    orderId: 2,
    status: 'SHIPPED',
    createdAt: '2025-01-21T09:00:00',
    updatedAt: '2025-01-21T09:00:00',
  },

  // Order 3 - PROCESSING
  {
    id: 10,
    orderId: 3,
    status: 'PENDING',
    createdAt: '2025-01-23T09:45:00',
    updatedAt: '2025-01-23T09:45:00',
  },
  {
    id: 11,
    orderId: 3,
    status: 'CONFIRMED',
    createdAt: '2025-01-23T09:50:00',
    updatedAt: '2025-01-23T09:50:00',
  },
  {
    id: 12,
    orderId: 3,
    status: 'PROCESSING',
    createdAt: '2025-01-23T10:00:00',
    updatedAt: '2025-01-23T10:00:00',
  },

  // Order 4 - CONFIRMED
  {
    id: 13,
    orderId: 4,
    status: 'PENDING',
    createdAt: '2025-01-24T11:20:00',
    updatedAt: '2025-01-24T11:20:00',
  },
  {
    id: 14,
    orderId: 4,
    status: 'CONFIRMED',
    createdAt: '2025-01-24T11:30:00',
    updatedAt: '2025-01-24T11:30:00',
  },

  // Order 5 - PENDING
  {
    id: 15,
    orderId: 5,
    status: 'PENDING',
    createdAt: '2025-01-25T15:00:00',
    updatedAt: '2025-01-25T15:00:00',
  },

  // Order 6 - CANCELLED
  {
    id: 16,
    orderId: 6,
    status: 'PENDING',
    createdAt: '2025-01-22T08:30:00',
    updatedAt: '2025-01-22T08:30:00',
  },
  {
    id: 17,
    orderId: 6,
    status: 'CONFIRMED',
    createdAt: '2025-01-22T09:00:00',
    updatedAt: '2025-01-22T09:00:00',
  },
  {
    id: 18,
    orderId: 6,
    status: 'CANCELLED',
    createdAt: '2025-01-23T14:00:00',
    updatedAt: '2025-01-23T14:00:00',
  },
];

/**
 * Get order status history by order ID
 */
export const getOrderStatusHistory = (
  orderId: number,
): OrderStatusHistory[] => {
  return mockOrderStatusHistory
    .filter((h) => h.orderId === orderId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
};

/**
 * Get latest status for order
 */
export const getLatestStatus = (orderId: number): OrderStatusHistory | null => {
  const history = getOrderStatusHistory(orderId);
  return history.length > 0 ? history[history.length - 1] : null;
};

/**
 * Add new status to history (for mock purposes)
 */
export const addStatusHistory = (
  orderId: number,
  status: string,
): OrderStatusHistory => {
  const newHistory: OrderStatusHistory = {
    id: Math.max(...mockOrderStatusHistory.map((h) => h.id)) + 1,
    orderId,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockOrderStatusHistory.push(newHistory);
  return newHistory;
};
