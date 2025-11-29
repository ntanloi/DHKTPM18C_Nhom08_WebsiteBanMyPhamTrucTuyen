import { useState, useEffect } from 'react';
import { productService } from '../services/user.service';

interface Product {
  id?: string;
  images: string[];
  brand: string;
  category?: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating: number;
  reviewCount: number;
  colors?: string[];
  freeShip: boolean;
  badge?: string;
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

  // Hàm fetch products theo slug
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
      const response = await productService.getProductsByCategorySlug(slug);

      if (response?.data) {
        // Xử lý các format response khác nhau
        const { category, products: productsList, name } = response.data;

        // Set category name
        const catName = category?.name || name || 'SẢN PHẨM';
        setCategoryName(catName);

        // Set products
        if (productsList && Array.isArray(productsList)) {
          setProducts(productsList);
        } else if (Array.isArray(response.data)) {
          // Nếu response.data trực tiếp là array
          setProducts(response.data);
        } else {
          setProducts([]);
        }
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

  // Auto fetch khi categorySlug thay đổi
  useEffect(() => {
    if (categorySlug) {
      fetchProducts(categorySlug);
    } else {
      // Reset khi không có categorySlug
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
    refetch: fetchProducts, // Cho phép refetch thủ công
  };
}
