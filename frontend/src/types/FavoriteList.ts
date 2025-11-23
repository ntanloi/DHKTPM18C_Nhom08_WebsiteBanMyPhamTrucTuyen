import type { ProductVariant } from './ProductVariant';
import type { User } from './User';

export interface FavoriteList {
  id: number;
  userId: number;
  productId: number;
  productVariants?: ProductVariant[];
  user?: User;
}
