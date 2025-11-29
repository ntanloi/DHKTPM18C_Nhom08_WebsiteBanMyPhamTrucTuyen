import axiosClient from './axiosClient';

export const categoriesService = {
  getAll() {
    return axiosClient.get('/categories');
  },
  getBySlug(slug: string) {
    return axiosClient.get(`/categories/slug/${slug}`);
  },
};

export const productService = {
  getProductsByCategoryId(categoryId: string) {
    return axiosClient.get(`/products/category/${categoryId}`);
  },
  getProductsByCategorySlug(categorySlug: string) {
    return axiosClient.get(`/products/category/slug/${categorySlug}`);
  },
  getAll() {
    return axiosClient.get('/products');
  },
  getBySlug(slug: string) {
    return axiosClient.get(`/products/slug/${slug}`);
  },
};
