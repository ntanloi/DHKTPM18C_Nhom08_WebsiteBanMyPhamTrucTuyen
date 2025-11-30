import axiosClient from './axiosClient';

export const categoriesService = {
  getAll() {
    return axiosClient.get('/categories');
  },
  getBySlug(slug: string) {
    return axiosClient.get(`/categories/slug/${slug}`);
  },
  getById(categoryId: string) {
    return axiosClient.get(`/categories/${categoryId}`);
  },
};

export const productService = {
  getProductsByCategoryId(categoryId: string) {
    return axiosClient.get(`/products/category/${categoryId}`);
  },
  getProductsByCategorySlug(categorySlug: string) {
    return axiosClient.get(`/products/category/slug/${categorySlug}`);
  },
  getProductsByBrandId(brandId: number) {
    return axiosClient.get(`/products/brand/${brandId}`);
  },
  getAll() {
    return axiosClient.get('/products');
  },
  getById(productId: number) {
    return axiosClient.get(`/products/${productId}`);
  },
  getBySlug(slug: string) {
    return axiosClient.get(`/products/slug/${slug}`);
  },
  getAllProducts() {
    return axiosClient.get('/products');
  },
};

export const productVariantService = {
  // Get all variants
  getAll: () => axiosClient.get('/product-variants'),

  // Get variant by ID
  getById: (id: number) => axiosClient.get(`/product-variants/${id}`),

  // Get variants by product ID
  getByProductId: (productId: number) =>
    axiosClient.get(`/product-variants/product/${productId}`),

  // Get variant by SKU
  getBySku: (sku: string) => axiosClient.get(`/product-variants/sku/${sku}`),

  // Get in-stock variants
  getInStock: () => axiosClient.get('/product-variants/in-stock'),

  // Create variant
  create: (data: {
    productId: number;
    name: string;
    sku: string;
    price: number;
    salePrice?: number;
    stockQuantity: number;
  }) => axiosClient.post('/product-variants', data),

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
  ) => axiosClient.put(`/product-variants/${id}`, data),

  // Update stock
  updateStock: (id: number, quantity: number) =>
    axiosClient.patch(`/product-variants/${id}/stock?quantity=${quantity}`),

  // Delete variant
  delete: (id: number) => axiosClient.delete(`/product-variants/${id}`),
};

export const productImageService = {
  // Get all product images
  getAll: () => axiosClient.get('/product-images'),

  // Get product image by ID
  getById: (id: number) => axiosClient.get(`/product-images/${id}`),

  // Get images by product ID
  getByProductId: (productId: number) =>
    axiosClient.get(`/product-images/product/${productId}`),

  // Create product image
  create: (data: { productId: number; imageUrl: string }) =>
    axiosClient.post('/product-images', data),

  // Update product image
  update: (id: number, data: { productId: number; imageUrl: string }) =>
    axiosClient.put(`/product-images/${id}`, data),

  // Delete product image
  delete: (id: number) => axiosClient.delete(`/product-images/${id}`),
};
