import type { Cart } from './Cart';
import type { ProductVariant } from './ProductVariant';

export interface CartItem {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
  cart?: Cart;
  productVariant?: ProductVariant;
}
