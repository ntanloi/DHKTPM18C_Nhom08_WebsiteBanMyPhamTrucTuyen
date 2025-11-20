import type { Payment } from './Payment';

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
}
