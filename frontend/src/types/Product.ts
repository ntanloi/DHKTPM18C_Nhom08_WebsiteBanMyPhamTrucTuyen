import type { Category } from './Category';
import type { Brand } from './Brand';
import type { ProductVariant } from './ProductVariant';
import type { ProductImage } from './ProductImage';
import type { Review } from './Review';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  brandId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  brand?: Brand;
  productVariant?: ProductVariant;
  images?: ProductImage[];
  reviews?: Review[];
}
