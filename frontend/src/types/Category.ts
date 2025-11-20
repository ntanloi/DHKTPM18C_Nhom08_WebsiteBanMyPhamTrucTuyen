import type { Product } from './Product';

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}
