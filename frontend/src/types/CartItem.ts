import type { Cart } from './Cart';
import type { ProductVariant } from './ProductVariant';

export interface CartItem {
  id: number;
  cartId?: number;
  productVariantId: number;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl?: string;
  cart?: Cart;
  productVariant?: ProductVariant;
}
