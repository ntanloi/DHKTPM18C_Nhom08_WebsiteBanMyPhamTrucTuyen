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

  // NEW: Search functions
  search(keyword: string) {
    return axiosClient.get(`/products/search`, {
      params: { keyword },
    });
  },
  getSearchSuggestions(keyword: string) {
    return axiosClient.get(`/products/search/suggestions`, {
      params: { keyword },
    });
  },
};

export const productVariantService = {
  getAll: () => axiosClient.get('/product-variants'),
  getById: (id: number) => axiosClient.get(`/product-variants/${id}`),
  getByProductId: (productId: number) =>
    axiosClient.get(`/product-variants/product/${productId}`),
  getBySku: (sku: string) => axiosClient.get(`/product-variants/sku/${sku}`),
  getInStock: () => axiosClient.get('/product-variants/in-stock'),
  create: (data: {
    productId: number;
    name: string;
    sku: string;
    price: number;
    salePrice?: number;
    stockQuantity: number;
  }) => axiosClient.post('/product-variants', data),
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
  updateStock: (id: number, quantity: number) =>
    axiosClient.patch(`/product-variants/${id}/stock?quantity=${quantity}`),
  delete: (id: number) => axiosClient.delete(`/product-variants/${id}`),
};

export const productImageService = {
  getAll: () => axiosClient.get('/product-images'),
  getById: (id: number) => axiosClient.get(`/product-images/${id}`),
  getByProductId: (productId: number) =>
    axiosClient.get(`/product-images/product/${productId}`),
  create: (data: { productId: number; imageUrl: string }) =>
    axiosClient.post('/product-images', data),
  update: (id: number, data: { productId: number; imageUrl: string }) =>
    axiosClient.put(`/product-images/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/product-images/${id}`),
};
