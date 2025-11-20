import type { Product } from './Product';

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  product?: Product;
}
