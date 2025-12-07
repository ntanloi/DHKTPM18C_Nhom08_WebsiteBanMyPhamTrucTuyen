import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  onNavigate,
}: CartSidebarProps) {
  const {
    cart,
    loading,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
    fetchCart,
  } = useCart();
  const [activeTab, setActiveTab] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Fetch cart khi mở sidebar
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  // Select all items by default khi cart thay đổi
  useEffect(() => {
    if (cart?.cartItems) {
      setSelectedItems(new Set(cart.cartItems.map((item) => item.id)));
    }
  }, [cart?.cartItems]);

  const cartItems = cart?.cartItems || [];
  const selectAll =
    cartItems.length > 0 &&
    cartItems.every((item) => selectedItems.has(item.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartQuantity(id, newQuantity);
    } catch (error: any) {
      alert(error.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await removeCartItem(id);
      } catch (error: any) {
        alert(error.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    if (!selectedItems.has(item.id)) return sum;
    return sum + item.subtotal;
  }, 0);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  // Hàm xử lý khi nhấn nút tiếp tục
  const handleCheckout = () => {
    onClose(); // Đóng sidebar
    onNavigate('/checkout'); // Chuyển đến trang checkout
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="bg-opacity-10 fixed inset-0 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="animate-slideInRight fixed top-0 right-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold">Giỏ hàng của tôi</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 bg-white px-6 py-4">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
              activeTab === 'delivery'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Giao hàng ({cartItems.length})
          </button>
          <button
            onClick={() => setActiveTab('pickup')}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
              activeTab === 'pickup'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lấy tại cửa hàng (0)
          </button>
        </div>

        {/* Content */}
        <div className="hide-scrollbar flex-1 overflow-y-auto bg-white">
          {loading && cartItems.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="text-sm text-gray-500">Đang tải giỏ hàng...</p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-gray-500">
              <svg
                className="mb-4 h-20 w-20 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="mb-2 text-base font-medium">Giỏ hàng trống</p>
              <p className="text-center text-sm">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
            </div>
          ) : (
            <div className="px-6">
              {/* Select All */}
              <div className="mb-4 flex items-center gap-2 border-b border-gray-200 py-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#ab2328]"
                  id="select-all"
                />
                <label
                  htmlFor="select-all"
                  className="cursor-pointer text-base font-medium"
                >
                  Chọn tất cả
                </label>
              </div>

              {/* Items */}
              <div className="space-y-4 py-4">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex flex-row items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#ab2328]"
                      />

                      <div className="flex flex-1 gap-3">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          <img
                            src={
                              item.imageUrl || 'https://via.placeholder.com/80'
                            }
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-start justify-between">
                            <h3 className="flex-1 pr-2 text-sm leading-tight font-medium">
                              {item.productName}
                            </h3>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={loading}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <p className="mb-3 text-xs text-gray-500">
                            Phân loại: {item.variantName}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex max-w-20 rounded-full border border-gray-300">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={loading || item.quantity <= 1}
                                className="rounded-l-full px-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                -
                              </button>
                              <span className="min-w-5 px-1 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                                disabled={loading}
                                className="rounded-r-full px-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex flex-col items-end">
                              <span className="text-xs font-bold">
                                {formatPrice(item.subtotal)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-xs text-gray-500">
                                  {formatPrice(item.price)} x {item.quantity}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Giao hàng</span>
                <span className="text-xl font-bold">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Click & Collect</span>
                <span>0 đ</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-purple-600 py-3.5 text-base font-semibold text-white shadow-md hover:opacity-90"
            >
              Tiếp tục với hình thức giao hàng
            </button>
          </div>
        )}
      </div>
    </>
  );
}
