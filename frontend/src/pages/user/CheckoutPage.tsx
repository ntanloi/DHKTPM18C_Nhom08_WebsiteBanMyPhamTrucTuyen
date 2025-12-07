import { useEffect, useContext } from 'react';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/auth-context';
import CartItemCard from '../../components/user/ui/CartItemCard';

interface CheckoutPageProps {
  onNavigate?: (path: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, loading, updateQuantity, removeItem, fetchCart } = useCart();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('CheckoutPage must be used within AuthProvider');
  }
  const { user } = authContext;

  useEffect(() => {
    // Fetch cart cho cả logged in user và guest user
    fetchCart();
  }, [user?.userId]);

  const handleContinue = () => {
    if (onNavigate) {
      onNavigate('/checkout-info');
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await updateQuantity(cartItemId, quantity);
    } catch (error: any) {
      alert(error.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await removeItem(cartItemId);
      } catch (error: any) {
        alert(error.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="border-b bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-3">
            <div className="flex items-center text-sm text-gray-500">
              <span>Trang chủ</span>
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-900">Giỏ hàng</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <button
            onClick={() => onNavigate?.('/products')}
            className="rounded-full bg-gradient-to-r from-[#f59e0b] via-[#d4145a] to-[#9333ea] px-8 py-3 text-white font-semibold"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span>Trang chủ</span>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-900">Giỏ hàng</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="mb-6 text-[28px] font-bold text-gray-900">
          Giỏ hàng của bạn ({cart.cartItems.length} sản phẩm)
        </h1>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left Column - Cart Items */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
                Sản phẩm trong giỏ hàng
              </h2>

              <div className="space-y-5">
                {cart.cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
                Tóm tắt đơn hàng
              </h2>

              <div className="mb-4 border-t border-gray-200 pt-4">
                <div className="mb-2 flex justify-between text-[13px]">
                  <span className="text-gray-600">Tổng giá trị đơn hàng</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mb-5 rounded-lg bg-gray-50 p-3.5">
                <p className="text-[12px] leading-relaxed text-gray-600">
                  Mã giảm giá, voucher có thể thêm vào ở màn hình kế tiếp
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#d4145a] to-[#9333ea] py-3.5 text-[14px] font-bold tracking-wide text-white uppercase shadow-lg transition hover:opacity-95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'TIẾP TỤC'}
              </button>

              <button
                onClick={() => onNavigate?.('/products')}
                className="mt-3 w-full rounded-full border-2 border-gray-300 py-3 text-[14px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
