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
};

export const productVariantService = {
  // Get all variants
  getAll: () => api.get('/product-variants'),

  // Get variant by ID
  getById: (id: number) => api.get(`/product-variants/${id}`),

  // Get variants by product ID
  getByProductId: (productId: number) =>
    api.get(`/product-variants/product/${productId}`),

  // Get variant by SKU
  getBySku: (sku: string) => api.get(`/product-variants/sku/${sku}`),

  // Get in-stock variants
  getInStock: () => api.get('/product-variants/in-stock'),

  // Create variant
  create: (data: {
    productId: number;
    name: string;
    sku: string;
    price: number;
    salePrice?: number;
    stockQuantity: number;
  }) => api.post('/product-variants', data),

  // Update variant
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

  // Update stock
  updateStock: (id: number, quantity: number) =>
    api.patch(`/product-variants/${id}/stock?quantity=${quantity}`),

  // Delete variant
  delete: (id: number) => api.delete(`/product-variants/${id}`),
};

export const productImageService = {
  // Get all product images
  getAll: () => api.get('/product-images'),

  // Get product image by ID
  getById: (id: number) => api.get(`/product-images/${id}`),

  // Get images by product ID
  getByProductId: (productId: number) =>
    api.get(`/product-images/product/${productId}`),

  // Create product image
  create: (data: { productId: number; imageUrl: string }) =>
    api.post('/product-images', data),

  // Update product image
  update: (id: number, data: { productId: number; imageUrl: string }) =>
    api.put(`/product-images/${id}`, data),

  // Delete product image
  delete: (id: number) => api.delete(`/product-images/${id}`),
};
