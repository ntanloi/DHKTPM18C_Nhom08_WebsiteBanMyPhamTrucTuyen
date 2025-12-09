import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';

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

const COUNTDOWN_SECONDS = 15 * 60; // 15 minutes

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
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [isChecking, setIsChecking] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handlePaymentSuccess = useCallback(() => {
    if (hasCompleted) return;
    setHasCompleted(true);
    onSuccess();
  }, [hasCompleted, onSuccess]);

  // Reset timer mỗi lần mở modal
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(COUNTDOWN_SECONDS);
      setHasCompleted(false);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Auto-check payment status every 5 seconds (chỉ khi còn thời gian)
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0 || hasCompleted) return;

    const statusChecker = setInterval(async () => {
      try {
        const result = await onCheckStatus();
        if (result.isPaid) {
          handlePaymentSuccess();
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);

    return () => clearInterval(statusChecker);
  }, [isOpen, timeLeft, hasCompleted, onCheckStatus, handlePaymentSuccess]);

  // Check lại khi user quay lại tab (đã thanh toán ở tab khác)
  useEffect(() => {
    if (!isOpen || hasCompleted) return;

    const checkOnFocus = async () => {
      try {
        const result = await onCheckStatus();
        if (result.isPaid) {
          handlePaymentSuccess();
        }
      } catch (error) {
        console.error('Error checking payment on focus:', error);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void checkOnFocus();
      }
    };

    window.addEventListener('focus', checkOnFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', checkOnFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isOpen, hasCompleted, onCheckStatus, handlePaymentSuccess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ';

  const handleCheckPayment = async () => {
    if (timeLeft <= 0) {
      alert('Phiên thanh toán đã hết hạn. Vui lòng đặt hàng lại.');
      return;
    }

    setIsChecking(true);
    try {
      const result = await onCheckStatus();
      if (result.isPaid) {
        alert('Thanh toán thành công! Đang chuyển đến trang đơn hàng...');
        handlePaymentSuccess();
      } else {
        alert('Chưa nhận được thanh toán. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      alert('Có lỗi khi kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleOpenVNPay = () => {
    if (timeLeft <= 0) {
      alert('Phiên thanh toán đã hết hạn. Vui lòng đặt hàng lại.');
      return;
    }

    if (!paymentUrl) {
      alert('Không tìm thấy liên kết thanh toán. Vui lòng thử lại.');
      return;
    }

    const newTab = window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    if (!newTab) {
      alert(
        'Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép pop-up cho trang này và thử lại.',
      );
    }
  };

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
        <div className="mb-5 text-center">
          <div className="mb-2 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Thanh toán VNPay
          </h2>
          <p className="mt-1 text-xs md:text-sm text-gray-600">
            Quét mã QR bằng app ngân hàng hoặc mở VNPay để thanh toán
          </p>
        </div>

        {/* QR Code */}
        <div className="mb-5 flex justify-center">
          <div className="rounded-2xl border-4 border-gray-100 bg-white p-3 shadow-lg">
            <QRCodeSVG
              value={paymentUrl}
              size={220} // giảm nhẹ cho đỡ chiếm chiều cao
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Order Info */}
        <div className="mb-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-gray-700">
              Mã đơn hàng
            </span>
            <span className="font-mono text-sm font-bold text-gray-900">
              #{orderId}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between border-t border-blue-200/50 pt-3">
            <span className="text-xs md:text-sm font-medium text-gray-700">
              Nội dung
            </span>
            <span className="ml-3 flex-1 text-right text-xs md:text-sm text-gray-900">
              {orderInfo}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-200/50 pt-3">
            <span className="text-xs md:text-sm font-medium text-gray-700">
              Số tiền
            </span>
            <span className="text-lg md:text-xl font-bold text-pink-600">
              {formatPrice(amount)}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-yellow-50 py-3 px-3">
          <svg
            className="h-5 w-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs md:text-sm font-medium text-yellow-800">
            Thời gian còn lại:{' '}
            <span className="font-mono font-bold">
              {formatTime(timeLeft)}
            </span>
          </span>
        </div>

        {/* Instructions */}
        <div className="mb-5 space-y-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">
            Hướng dẫn thanh toán:
          </p>
          <ol className="ml-4 space-y-1 text-xs md:text-sm text-gray-700">
            <li className="list-decimal">
              Mở app ngân hàng hoặc ví điện tử có hỗ trợ VNPay
            </li>
            <li className="list-decimal">Quét mã QR ở trên</li>
            <li className="list-decimal">
              Xác nhận thông tin và hoàn tất thanh toán
            </li>
            <li className="list-decimal">
              Nhấn &quot;Đã thanh toán&quot; hoặc đợi hệ thống tự động
              xác nhận
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCheckPayment}
            disabled={isChecking || timeLeft <= 0}
            className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {timeLeft <= 0
              ? 'PHIÊN HẾT HẠN'
              : isChecking
              ? 'ĐANG KIỂM TRA...'
              : 'ĐÃ THANH TOÁN'}
          </button>

          <button
            onClick={handleOpenVNPay}
            disabled={timeLeft <= 0}
            className="w-full rounded-full border-2 border-blue-500 bg-white py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mở cổng thanh toán VNPay
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-full border-2 border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Hủy thanh toán
          </button>
        </div>

        {/* Warning */}
        {timeLeft === 0 && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center">
            <p className="text-sm font-medium text-red-800">
              Phiên thanh toán đã hết hạn. Vui lòng đặt hàng lại.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
