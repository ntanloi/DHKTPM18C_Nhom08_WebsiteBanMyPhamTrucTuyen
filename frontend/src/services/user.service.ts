import api from '../lib/api';

export const categoriesService = {
  getAll() {
    return api.get('/categories');
  },
  getBySlug(slug: string) {
    return api.get(`/categories/slug/${slug}`);
  },
  getById(categoryId: string) {
    return api.get(`/categories/${categoryId}`);
  },
};

export const productService = {
  getProductsByCategoryId(categoryId: string) {
    return api.get(`/products/category/${categoryId}`);
  },
  getProductsByCategorySlug(categorySlug: string) {
    return api.get(`/products/category/slug/${categorySlug}`);
  },
  getProductsByBrandId(brandId: number) {
    return api.get(`/products/brand/${brandId}`);
  },
  getAll() {
    return api.get('/products');
  },
  getById(productId: number) {
    return api.get(`/products/${productId}`);
  },
  getBySlug(slug: string) {
    return api.get(`/products/slug/${slug}`);
  },
  getAllProducts() {
    return api.get('/products');
  },

  // NEW: Search functions
  search(keyword: string) {
    return api.get(`/products/search`, {
      params: { keyword },
    });
  },
  getSearchSuggestions(keyword: string) {
    return api.get(`/products/search/suggestions`, {
      params: { keyword },
    });
  },
};

export const productVariantService = {
  getAll: () => api.get('/product-variants'),
  getById: (id: number) => api.get(`/product-variants/${id}`),
  getByProductId: (productId: number) =>
    api.get(`/product-variants/product/${productId}`),
  getBySku: (sku: string) => api.get(`/product-variants/sku/${sku}`),
  getInStock: () => api.get('/product-variants/in-stock'),
  create: (data: {
    productId: number;
    name: string;
    sku: string;
    price: number;
    salePrice?: number;
    stockQuantity: number;
  }) => api.post('/product-variants', data),
  update: (
    id: number,
    data: {
      productId: number;
      name: string;
      sku: string;
      price: number;
      salePrice?: number;
      stockQuantity: number;
    },
  ) => api.put(`/product-variants/${id}`, data),
  updateStock: (id: number, quantity: number) =>
    api.patch(`/product-variants/${id}/stock?quantity=${quantity}`),
  delete: (id: number) => api.delete(`/product-variants/${id}`),
};

export const productImageService = {
  getAll: () => api.get('/product-images'),
  getById: (id: number) => api.get(`/product-images/${id}`),
  getByProductId: (productId: number) =>
    api.get(`/product-images/product/${productId}`),
  create: (data: { productId: number; imageUrl: string }) =>
    api.post('/product-images', data),
  update: (id: number, data: { productId: number; imageUrl: string }) =>
    api.put(`/product-images/${id}`, data),
  delete: (id: number) => api.delete(`/product-images/${id}`),
};
