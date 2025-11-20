import type { Address } from './Address';
import type { Review } from './Review';
import type { Coupon } from './Coupon';
import type { Cart } from './Cart';
import type { Order } from './Order';
import type { FavoriteList } from './FavoriteList';
import type { Role } from './Role';

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl: string;
  birthDay: string;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  reviews?: Review[];
  coupons?: Coupon[];
  cart?: Cart;
  orders?: Order[];
  favoriteList?: FavoriteList;
  role?: Role;
}
