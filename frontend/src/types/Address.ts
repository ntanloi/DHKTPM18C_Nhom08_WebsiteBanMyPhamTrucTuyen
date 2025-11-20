import type { User } from './User';

export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  recipientPhone: string;
  streetAddress: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
