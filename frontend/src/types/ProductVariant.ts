import type { Product } from './Product';
import type { VariantAttribute } from './VariantAttribute';
import type { CartItem } from './CartItem';
import type { OrderItem } from './OrderItem';
import type { FavoriteList } from './FavoriteList';

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  product?: Product;
  variantAttributes?: VariantAttribute[];
  cartItem?: CartItem;
  orderItem?: OrderItem;
  favoriteList?: FavoriteList;
}
