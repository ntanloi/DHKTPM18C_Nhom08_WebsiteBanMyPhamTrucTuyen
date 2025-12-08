import { useEffect, useState, useContext } from 'react';
import { CheckCircle, XCircle, Loader2, Home, FileText } from 'lucide-react';
import { type VNPayResponse } from '../../api/payment';
import {
  createOrder,
  createGuestOrder,
  type CreateOrderRequest,
  type CreateGuestOrderRequest,
} from '../../api/order';
import { AuthContext } from '../../context/auth-context';
import { useCart } from '../../context/CartContext';
import api from '../../lib/api';

interface PaymentCallbackPageProps {
  onNavigate?: (path: string) => void;
}

export default function PaymentCallbackPage({
  onNavigate,
}: PaymentCallbackPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  );
  const [paymentResult, setPaymentResult] = useState<VNPayResponse | null>(
    null,
  );
  const [error, setError] = useState<string>('');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const authContext = useContext(AuthContext);
  const { clearCart } = useCart();
  const user = authContext?.user || null;

  useEffect(() => {
    processPaymentCallback();
  }, []);

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

      // Check payment response code
      const responseCode = params.vnp_ResponseCode;
      const transactionStatus = params.vnp_TransactionStatus;

      // Payment successful
      if (responseCode === '00' && transactionStatus === '00') {
        // Create order after successful payment
        try {
          let orderId: number | null = null;

          // Check if user is logged in
          if (user) {
            // Logged in user - get pending order from localStorage
            const pendingOrderStr = localStorage.getItem(
              'pending_logged_order',
            );
            if (pendingOrderStr) {
              const orderRequest: CreateOrderRequest =
                JSON.parse(pendingOrderStr);
              const order = await createOrder(orderRequest);
              orderId = order.id;

              // Clear localStorage
              localStorage.removeItem('pending_logged_order');
              localStorage.removeItem('pending_cart');
            }
          } else {
            // Guest user - get pending order from localStorage
            const pendingOrderStr = localStorage.getItem('pending_guest_order');
            if (pendingOrderStr) {
              const orderRequest: CreateGuestOrderRequest =
                JSON.parse(pendingOrderStr);
              const order = await createGuestOrder(orderRequest);
              orderId = order.id;

              // Clear localStorage
              localStorage.removeItem('pending_guest_order');
              localStorage.removeItem('pending_cart');
            }
          }

          if (orderId) {
            setCreatedOrderId(orderId);

            // Mark payment as completed
            try {
              await api.put(`/orders/${orderId}/payment/complete`);
              console.log('Payment marked as completed for order:', orderId);
            } catch (e) {
              console.warn('Failed to mark payment as completed:', e);
            }

            // Clear cart after successful order creation
            try {
              await clearCart();
            } catch (e) {
              console.warn('Failed to clear cart:', e);
            }

            // Set success result
            setPaymentResult({
              success: true,
              orderId: orderId.toString(),
              transactionNo: params.vnp_BankTranNo || params.vnp_TxnRef,
              message: 'Thanh toán thành công',
              paymentUrl: '',
            });
            setStatus('success');

            // Auto redirect to order success page after 2 seconds
            setTimeout(() => {
              onNavigate?.(`/order-success/${orderId}`);
            }, 2000);
          } else {
            throw new Error('Không tìm thấy thông tin đơn hàng');
          }
        } catch (orderError: any) {
          console.error('Error creating order after payment:', orderError);
          setStatus('failed');
          setError(
            'Thanh toán thành công nhưng không thể tạo đơn hàng. Vui lòng liên hệ hỗ trợ.',
          );
        }
      } else {
        // Payment failed
        setStatus('failed');
        setError(getVNPayErrorMessage(responseCode));

        // Restore cart if payment failed
        const pendingCartStr = localStorage.getItem('pending_cart');
        if (pendingCartStr) {
          console.log('Payment failed, cart items preserved in localStorage');
        }
      }
    } catch (err) {
      console.error('Payment callback error:', err);
      setStatus('failed');
      setError('Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const getVNPayErrorMessage = (code: string): string => {
    const errorMessages: Record<string, string> = {
      '07': 'Giao dịch bị nghi ngờ gian lận',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
      '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Đã hết hạn chờ thanh toán',
      '12': 'Thẻ/Tài khoản bị khóa',
      '13': 'Sai mật khẩu xác thực giao dịch (OTP)',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
      '99': 'Lỗi không xác định',
    };
    return errorMessages[code] || 'Thanh toán không thành công';
  };

  const handleGoHome = () => {
    onNavigate?.('/');
  };

  const handleViewOrder = () => {
    const orderId = createdOrderId || paymentResult?.orderId;
    if (orderId) {
      // Use order-success page for better UX
      onNavigate?.(`/order-success/${orderId}`);
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
              <p className="text-gray-500">Vui lòng đợi trong giây lát...</p>
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
                    #{createdOrderId || paymentResult?.orderId}
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
          <p className="text-sm text-gray-400">Thanh toán được xử lý bởi</p>
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
