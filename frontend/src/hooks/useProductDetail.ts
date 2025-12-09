import { useState, useEffect } from 'react';
import {
  productService,
  productVariantService,
  productImageService,
} from '../services/user.service';

interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  attributes?: Array<{
    id: number;
    productVariantId: number;
    name: string;
    value: string;
  }>;
}

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  variants?: ProductVariant[];
}

interface UseProductDetailReturn {
  product: ProductDetail | null;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  loading: boolean;
  error: string | null;
  refetch: (slugOrId: string | number) => Promise<void>;
  selectVariant: (variantId: number) => void;
}

export function useProductDetail(
  slugOrId: string | number | null,
  type: 'slug' | 'id' = 'slug',
): UseProductDetailReturn {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = async (identifier: string | number) => {
    if (!identifier) {
      setProduct(null);
      setVariants([]);
      setSelectedVariant(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch product detail
      const productResponse =
        type === 'slug'
          ? await productService.getBySlug(identifier as string)
          : await productService.getById(identifier as number);

      if (productResponse?.data) {
        const productData = productResponse.data;

        // Fetch product images
        let imageUrls: string[] = [];
        try {
          const imagesResponse = await productImageService.getByProductId(
            productData.id,
          );
          imageUrls =
            imagesResponse?.data?.map((img: any) => img.imageUrl) || [];
        } catch (imgError) {
          console.error('Error fetching product images:', imgError);
        }

        setProduct({
          ...productData,
          images: imageUrls,
        });

        // Fetch product variants
        if (productData.id) {
          try {
            const variantsResponse = await productVariantService.getByProductId(
              productData.id,
            );

            if (
              variantsResponse?.data &&
              Array.isArray(variantsResponse.data)
            ) {
              setVariants(variantsResponse.data);

              // Auto-select first variant or in-stock variant
              const inStockVariant = variantsResponse.data.find(
                (v: ProductVariant) => v.stockQuantity > 0,
              );
              setSelectedVariant(
                inStockVariant || variantsResponse.data[0] || null,
              );
            } else {
              setVariants([]);
              setSelectedVariant(null);
            }
          } catch (variantError) {
            console.error('Error fetching variants:', variantError);
            setVariants([]);
            setSelectedVariant(null);
          }
        }
      }
    } catch (err: any) {
      // Only log errors that are not 404 (missing products are expected)
      if (err?.response?.status !== 404) {
        console.error('Error fetching product detail:', err);
      }
      setError(err?.message || 'Không thể tải thông tin sản phẩm');
      setProduct(null);
      setVariants([]);
      setSelectedVariant(null);
    } finally {
      setLoading(false);
    }
  };

  const selectVariant = (variantId: number) => {
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  useEffect(() => {
    if (slugOrId) {
      fetchProductDetail(slugOrId);
    } else {
      setProduct(null);
      setVariants([]);
      setSelectedVariant(null);
      setLoading(false);
    }
  }, [slugOrId, type]);

  return {
    product,
    variants,
    selectedVariant,
    loading,
    error,
    refetch: fetchProductDetail,
    selectVariant,
  };
}
