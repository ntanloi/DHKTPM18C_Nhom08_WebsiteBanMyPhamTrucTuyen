import { X } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
  id: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  selected: boolean;
  gift?: {
    name: string;
    image: string;
    quantity: number;
  };
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void; // Thêm prop này
}

// Mock data
const mockCartItems: CartItem[] = [
  {
    id: '1',
    sku: '11112251',
    name: 'Bảng Phấn Mắt 9 Ô Thuần Chay Amuse Eye Color Palette 11g',
    image:
      'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
    price: 593100,
    originalPrice: 659000,
    quantity: 1,
    selected: true,
    gift: {
      name: '(GWP) Gương Trang Điểm Amuse My Amuse Mirror 87g',
      image:
        'https://image.hsv-tech.io/150x0/bbx/common/4873f479-daba-4074-bd62-be3de38377dd.webp',
      quantity: 1,
    },
  },
  {
    id: '2',
    sku: '11112251',
    name: 'Bảng Phấn Mắt 9 Ô Thuần Chay Amuse Eye Color Palette 11g',
    image:
      'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
    price: 593100,
    originalPrice: 659000,
    quantity: 1,
    selected: true,
    gift: {
      name: '(GWP) Gương Trang Điểm Amuse My Amuse Mirror 87g',
      image:
        'https://image.hsv-tech.io/150x0/bbx/common/4873f479-daba-4074-bd62-be3de38377dd.webp',
      quantity: 1,
    },
  },
];

export default function CartSidebar({
  isOpen,
  onClose,
  onNavigate,
}: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [activeTab, setActiveTab] = useState<'delivery' | 'pickup'>('delivery');

  const selectAll = cartItems.length > 0 && cartItems.every((i) => i.selected);

  const handleSelectAll = (checked: boolean) => {
    setCartItems((items) => items.map((i) => ({ ...i, selected: checked })));
  };

  const toggleItem = (id: string) => {
    setCartItems((items) =>
      items.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    if (!item.selected) return sum;
    return sum + item.price * item.quantity;
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
          {cartItems.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Bạn chưa có sản phẩm nào trong giỏ hàng
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
                        checked={item.selected}
                        onChange={() => toggleItem(item.id)}
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#ab2328]"
                      />

                      <div className="flex flex-1 gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded object-cover p-1"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-start justify-between">
                            <h3 className="flex-1 pr-2 text-sm leading-tight font-medium">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <p className="mb-3 text-xs text-gray-500">
                            SKU: {item.sku}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex max-w-20 rounded-full border border-gray-300">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="rounded-l-full px-2 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="min-w-5 px-1 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="rounded-r-full px-2 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex flex-row items-end gap-x-1 font-medium">
                              {item.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                              <span className="text-xs font-bold">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.gift && (
                      <div className="mt-3 ml-8 flex items-start gap-3 rounded-lg bg-pink-50 p-3">
                        <img
                          src={item.gift.image}
                          alt={item.gift.name}
                          className="h-14 w-14 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="mb-1 inline-block rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                            Quà Tặng
                          </span>
                          <p className="mt-1 text-sm">{item.gift.name}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            SKU: {item.sku.replace('11112251', '11112291')}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            x{item.gift.quantity}
                          </p>
                        </div>
                      </div>
                    )}
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
