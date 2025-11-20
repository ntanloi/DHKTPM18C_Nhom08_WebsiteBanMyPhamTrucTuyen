import type { User } from './User';

export interface Coupon {
  id: number;
  code: string;
  description: string;
  isActive: boolean;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxUsageValue: number;
  validFrom: string;
  validTo: string;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
