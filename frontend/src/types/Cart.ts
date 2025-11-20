import type { User } from './User';
import type { CartItem } from './CartItem';

export interface Cart {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  cartItems?: CartItem[];
}
