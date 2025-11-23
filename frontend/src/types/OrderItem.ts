import type { Order } from './Order';
import type { ProductVariant } from './ProductVariant';

export interface OrderItem {
  id: number;
  orderId: number;
  productVariantId: number;
  quantity: number;
  order?: Order;
  productVariant?: ProductVariant;
}
