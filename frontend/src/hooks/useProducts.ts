import { useState, useEffect } from 'react';
import {
  categoriesService,
  productService,
  productImageService,
} from '../services/user.service';

interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  images: string[];
  freeShip?: boolean;
  badge?: string;
  averageRating?: number;
  reviewCount?: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  categoryName: string;
  refetch: (slug: string) => Promise<void>;
}

export function useProducts(categorySlug: string | null): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const fetchProducts = async (slug: string) => {
    if (!slug) {
      setProducts([]);
      setCategoryName('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch products by category slug
      const productsResponse =
        await productService.getProductsByCategorySlug(slug);

      // Fetch category info
      const categoryResponse = await categoriesService.getBySlug(slug);

      // Set category name
      const catName = categoryResponse?.data?.name || 'SẢN PHẨM';
      setCategoryName(catName);

      // Process products
      if (productsResponse?.data) {
        let productsList: any[] = [];

        // Handle different response formats
        if (Array.isArray(productsResponse.data)) {
          productsList = productsResponse.data;
        } else if (
          productsResponse.data.products &&
          Array.isArray(productsResponse.data.products)
        ) {
          productsList = productsResponse.data.products;
        }

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          productsList.map(async (product: any) => {
            try {
              const imagesResponse = await productImageService.getByProductId(
                product.id,
              );

              const imageUrls =
                imagesResponse?.data?.map((img: any) => img.imageUrl) || [];

              return {
                ...product,
                id: Number(product.id),
                images: imageUrls,
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
              };
            } catch (err) {
              console.error(
                `Error fetching images for product ${product.id}:`,
                err,
              );
              return {
                ...product,
                id: Number(product.id),
                images: [],
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
              };
            }
          }),
        );

        setProducts(productsWithImages);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err?.message || 'Không thể tải sản phẩm');
      setProducts([]);
      setCategoryName('SẢN PHẨM');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchProducts(categorySlug);
    } else {
      setProducts([]);
      setCategoryName('');
      setLoading(false);
    }
  }, [categorySlug]);

  return {
    products,
    loading,
    error,
    categoryName,
    refetch: fetchProducts,
  };
}

// Hook to fetch all products (for homepage)
export function useAllProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getAll();

      if (response?.data) {
        const productsList = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          productsList.map(async (product: any) => {
            try {
              const imagesResponse = await productImageService.getByProductId(
                product.id,
              );

              const imageUrls =
                imagesResponse?.data?.map((img: any) => img.imageUrl) || [];

              return {
                ...product,
                id: Number(product.id),
                images: imageUrls,
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
              };
            } catch (err) {
              return {
                ...product,
                id: Number(product.id),
                images: [],
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
              };
            }
          }),
        );

        setProducts(productsWithImages);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching all products:', err);
      setError(err?.message || 'Không thể tải sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return {
    products,
    loading,
    error,
    categoryName: 'TẤT CẢ SẢN PHẨM',
    refetch: () => fetchAllProducts(),
  };
}

// Hook to fetch products by brand
export function useProductsByBrand(brandId: number | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (id: number) => {
    if (!id) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProductsByBrandId(id);

      if (response?.data) {
        const productsList = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          productsList.map(async (product: any) => {
            try {
              const imagesResponse = await productImageService.getByProductId(
                product.id,
              );

              const imageUrls =
                imagesResponse?.data?.map((img: any) => img.imageUrl) || [];

              return {
                ...product,
                id: Number(product.id),
                images: imageUrls,
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
              };
            } catch (err) {
              return {
                ...product,
                id: Number(product.id),
                images: [],
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
              };
            }
          }),
        );

        setProducts(productsWithImages);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products by brand:', err);
      setError(err?.message || 'Không thể tải sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      fetchProducts(brandId);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [brandId]);

  return {
    products,
    loading,
    error,
    categoryName: '',
    refetch: fetchProducts,
  };
}
