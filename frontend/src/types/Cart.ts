import type { User } from './User';
import type { CartItem } from './CartItem';

export interface Cart {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  user?: User;
  cartItems?: CartItem[];
}
