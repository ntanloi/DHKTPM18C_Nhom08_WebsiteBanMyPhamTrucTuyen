import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/auth-context';
import CartItemCard from '../../components/user/ui/CartItemCard';
import { Toast, type ToastType } from '../../components/user/ui/Toast';
import { useEffect, useContext, useState } from 'react';

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
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

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
      showToast('Đã cập nhật số lượng', 'success');
    } catch (error: any) {
      showToast(error.message || 'Không thể cập nhật số lượng', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');

    if (confirmDelete) {
      try {
        await removeItem(cartItemId);
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
      } catch (error: any) {
        showToast(error.message || 'Không thể xóa sản phẩm', 'error');
      }
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  if (loading && !cart) {
    return (
      <>
        <style>
          {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out;
          }
        `}
        </style>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'info' })}
          />
        )}

        <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <>
        <style>
          {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out;
          }
        `}
        </style>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'info' })}
          />
        )}
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

          <div className="mx-auto max-w-[1200px] px-3 py-8 text-center sm:px-6 sm:py-16">
            <div className="mb-4 sm:mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 sm:h-24 sm:w-24"
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
            <h2 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
              Giỏ hàng trống
            </h2>
            <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <button
              onClick={() => onNavigate?.('/products')}
              className="rounded-full bg-gradient-to-r from-[#f59e0b] via-[#d4145a] to-[#9333ea] px-6 py-2.5 text-sm font-semibold text-white sm:px-8 sm:py-3 sm:text-base"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}
      </style>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-white">
          <div className="mx-auto max-w-[1200px] px-3 py-2 sm:px-6 sm:py-3">
            <div className="flex items-center text-xs text-gray-500 sm:text-sm">
              <span>Trang chủ</span>
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-900">Giỏ hàng</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-[1200px] px-3 py-4 sm:px-6 sm:py-8">
          <h1 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl lg:text-[28px]">
            Giỏ hàng của bạn ({cart.cartItems.length} sản phẩm)
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
            {/* Left Column - Cart Items */}
            <div className="space-y-4 sm:space-y-5 lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
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
                  className="w-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#d4145a] to-[#9333ea] py-3.5 text-[14px] font-bold tracking-wide text-white uppercase shadow-lg transition hover:opacity-95 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  );
}
