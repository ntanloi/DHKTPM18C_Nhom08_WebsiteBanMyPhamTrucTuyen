import type { Order } from './Order';

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
}
