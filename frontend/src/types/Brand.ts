import type { Product } from './Product';

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}
