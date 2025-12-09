import { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { Toast, type ToastType } from '../../components/user/ui/Toast';

interface GuestOrderTrackingPageProps {
  onNavigate: (path: string) => void;
}

export default function GuestOrderTrackingPage({
  onNavigate,
}: GuestOrderTrackingPageProps) {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId || !email) {
      setToast({
        message: 'Vui lòng nhập đầy đủ thông tin',
        type: 'warning',
      });
      return;
    }

    try {
      setLoading(true);

      // Validate order exists with this email
      const { getGuestOrderDetail } = await import('../../api/order');
      await getGuestOrderDetail(parseInt(orderId), email);

      // Save to localStorage for OrderSuccessPage
      localStorage.setItem(`guestOrder_${orderId}_email`, email);

      // Navigate to order success page
      onNavigate(`/order-success/${orderId}`);
    } catch (error: any) {
      console.error('Error tracking order:', error);
      setToast({
        message:
          error.response?.data?.error ||
          'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
        <div className="mx-auto max-w-md px-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Tra Cứu Đơn Hàng
            </h1>
            <p className="text-gray-600">
              Nhập thông tin để xem chi tiết đơn hàng của bạn
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order ID */}
              <div>
                <label
                  htmlFor="orderId"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Mã đơn hàng
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Ví dụ: 123"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mã đơn hàng được gửi qua email sau khi đặt hàng
                </p>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email nhận hàng
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email bạn đã dùng khi đặt hàng
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Đang tìm kiếm...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Tra cứu đơn hàng</span>
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Nếu bạn không tìm thấy email xác nhận
                đơn hàng, vui lòng kiểm tra hộp thư spam hoặc liên hệ với chúng
                tôi để được hỗ trợ.
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate('/')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
