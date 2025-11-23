import type { ProductVariant } from './ProductVariant';

export interface VariantAttribute {
  id: number;
  productVariantId: number;
  name: string;
  value: string;
  productVariant?: ProductVariant;
}
