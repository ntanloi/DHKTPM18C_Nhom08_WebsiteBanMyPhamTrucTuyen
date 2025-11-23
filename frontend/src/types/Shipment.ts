import type { Order } from './Order';

export interface Shipment {
  id: number;
  orderId: number;
  status: string;
  trackingCode: string;
  shippingProviderName: string;
  shippedAt: string;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
}
