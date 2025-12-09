import { useEffect } from 'react';

interface VNPayPaymentModalProps {
  isOpen: boolean;
  paymentUrl: string;
  orderId: number;
  amount: number;
  orderInfo: string;
  onClose: () => void;
  onSuccess: () => void;
  onCheckStatus: () => Promise<{ isPaid: boolean; status: string }>;
}

export default function VNPayPaymentModal({
  isOpen,
  paymentUrl,
  orderId,
  amount,
  orderInfo,
  onClose,
  onSuccess,
  onCheckStatus,
}: VNPayPaymentModalProps) {
  // Auto-redirect to VNPay when modal opens and payment URL is ready
  useEffect(() => {
    if (isOpen && paymentUrl) {
      // Small delay to ensure UI renders before redirect
      const timer = setTimeout(() => {
        window.location.href = paymentUrl;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, paymentUrl]);

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Đóng"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
              <svg
                className="h-12 w-12 text-white animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đang chuyển đến VNPay
          </h2>
          <p className="text-sm text-gray-600">
            Vui lòng chờ trong giây lát...
          </p>
        </div>

        {/* Order Info */}
        <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Mã đơn hàng
            </span>
            <span className="font-mono text-sm font-bold text-gray-900">
              #{orderId}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between border-t border-blue-200/50 pt-3">
            <span className="text-sm font-medium text-gray-700">
              Nội dung
            </span>
            <span className="ml-3 flex-1 text-right text-sm text-gray-900">
              {orderInfo}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-200/50 pt-3">
            <span className="text-sm font-medium text-gray-700">
              Số tiền
            </span>
            <span className="text-xl font-bold text-pink-600">
              {formatPrice(amount)}
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full rounded-full border-2 border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Hủy thanh toán
        </button>
      </div>
    </div>
  );
}
