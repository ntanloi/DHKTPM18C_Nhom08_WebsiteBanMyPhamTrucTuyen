// Utility function để thay thế window.confirm
export const showConfirmDialog = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Tạm thời sử dụng window.confirm, sau này có thể thay thế bằng modal
    const result = window.confirm(message);
    resolve(result);
  });
};

// Các message templates thường dùng
export const CONFIRM_MESSAGES = {
  DELETE_PRODUCT: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
  DELETE_CATEGORY: 'Bạn có chắc chắn muốn xóa danh mục này?',
  DELETE_BRAND: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
  DELETE_USER: 'Bạn có chắc chắn muốn xóa người dùng này?',
  DELETE_ORDER: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
  CANCEL_ORDER: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
  DELETE_REVIEW: 'Bạn có chắc chắn muốn xóa review này?',
  DELETE_IMAGE: 'Bạn có chắc chắn muốn xóa ảnh này?',
  DELETE_FAVORITE: 'Bạn có chắc chắn muốn xóa favorite này?',
  DELETE_ADDRESS: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
  CLEAR_FAVORITES: 'Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?',
  REMOVE_CART_ITEM: 'Bạn có chắc muốn xóa sản phẩm này?',
};