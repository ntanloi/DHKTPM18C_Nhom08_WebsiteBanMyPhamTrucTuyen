import type { Order } from './Order';

export interface Return {
  id: number;
  orderId: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
}
