import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Home, FileText } from 'lucide-react';
import { processVNPayCallback, type VNPayResponse } from '../../api/payment';

interface PaymentCallbackPageProps {
  onNavigate?: (path: string) => void;
}

export default function PaymentCallbackPage({ onNavigate }: PaymentCallbackPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentResult, setPaymentResult] = useState<VNPayResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    processPaymentCallback();
  }, []);

  // Notify opener tab (checkout) so it can refresh payment status immediately
  useEffect(() => {
    if (!paymentResult) return;
    if (!window.opener || window.opener === window) return;

    window.opener.postMessage(
      {
        type: 'VNPAY_PAYMENT_RESULT',
        success: paymentResult.success,
        orderId: paymentResult.orderId,
        transactionNo: paymentResult.transactionNo,
      },
      window.location.origin,
    );
  }, [paymentResult]);

  const processPaymentCallback = async () => {
    try {
      // Get URL params from current URL
      const urlParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      
      urlParams.forEach((value, key) => {
        params[key] = value;
      });

      // Check if we have VNPay params
      if (!params.vnp_ResponseCode) {
        setStatus('failed');
        setError('Không tìm thấy thông tin thanh toán');
        return;
      }

      // Process callback
      const result = await processVNPayCallback(params);
      setPaymentResult(result);
      
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('failed');
        setError(result.message || 'Thanh toán không thành công');
      }
    } catch (err) {
      console.error('Payment callback error:', err);
      setStatus('failed');
      setError('Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const handleGoHome = () => {
    onNavigate?.('/');
  };

  const handleViewOrder = () => {
    if (paymentResult?.orderId) {
      onNavigate?.(`/orders/${paymentResult.orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Đang xử lý thanh toán
              </h2>
              <p className="text-gray-500">
                Vui lòng đợi trong giây lát...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Thanh toán thành công!
              </h2>
              <p className="mb-6 text-gray-500">
                Cảm ơn bạn đã mua hàng tại BeautyBox
              </p>

              {/* Transaction Info */}
              <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
                <div className="mb-3 flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-semibold text-gray-900">
                    #{paymentResult?.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã giao dịch</span>
                  <span className="font-semibold text-gray-900">
                    {paymentResult?.transactionNo}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleViewOrder}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  <FileText className="h-5 w-5" />
                  Xem đơn hàng
                </button>
                <button
                  onClick={handleGoHome}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Home className="h-5 w-5" />
                  Về trang chủ
                </button>
              </div>
            </div>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Thanh toán thất bại
              </h2>
              <p className="mb-6 text-gray-500">
                {error || 'Có lỗi xảy ra trong quá trình thanh toán'}
              </p>

              {paymentResult?.orderId && (
                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <span className="text-gray-500">Mã đơn hàng: </span>
                  <span className="font-semibold text-gray-900">
                    #{paymentResult.orderId}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => window.history.back()}
                  className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Thử lại thanh toán
                </button>
                <button
                  onClick={handleGoHome}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Home className="h-5 w-5" />
                  Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* VNPay Logo */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Thanh toán được xử lý bởi
          </p>
          <img
            src="https://vnpay.vn/wp-content/uploads/2019/09/logo-vnpay-768x254.png"
            alt="VNPay"
            className="mx-auto mt-2 h-8 object-contain opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
