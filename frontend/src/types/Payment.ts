import type { Order } from './Order';
import type { PaymentMethod } from './PaymentMethod';

export interface Payment {
  id: number;
  orderId: number;
  paymentMethodId: number;
  amount: number;
  status: string;
  transactionCode: string;
  providerResponse: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  paymentMethods?: PaymentMethod[];
}
