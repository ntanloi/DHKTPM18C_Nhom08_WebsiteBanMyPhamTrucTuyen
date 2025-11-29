import React from 'react';
import OrderStatusBadge from '../order/OrderStatusBadge';
import { formatCurrency } from '../../../utils/orderStatusUtils';

interface Payment {
  id: number;
  orderId: number;
  paymentMethodId: number;
  amount: number;
  status: string;
  transactionCode: string;
  providerResponse: string;
  createdAt: string;
  updatedAt: string;
  paymentMethods?: Array<{
    id: number;
    name: string;
    code: string;
    isActive: boolean;
  }>;
}

interface PaymentInfoCardProps {
  payment: Payment;
  onViewHistory?: () => void;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({ payment }) => {
  const paymentMethod = payment.paymentMethods?.[0];

  const getPaymentMethodIcon = (code: string) => {
    const icons: Record<string, string> = {
      COD: '💵',
      BANK_TRANSFER: '🏦',
      CREDIT_CARD: '💳',
      MOMO: '📱',
      ZALOPAY: '💰',
      VNPAY: '🔷',
    };
    return icons[code] || '💳';
  };

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      PENDING: 'Đang chờ thanh toán từ khách hàng',
      COMPLETED: 'Thanh toán đã được xử lý thành công',
      FAILED: 'Giao dịch thanh toán không thành công',
      REFUNDED: 'Đã hoàn tiền cho khách hàng',
    };
    return descriptions[status] || '';
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          Thông Tin Thanh Toán
        </h3>
        <OrderStatusBadge status={payment.status} type="payment" size="lg" />
      </div>

      {getStatusDescription(payment.status) && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-blue-700">
            {getStatusDescription(payment.status)}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
            <svg
              className="h-5 w-5 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Mã thanh toán</p>
            <p className="font-mono text-sm font-medium text-gray-900">
              #PAY-{String(payment.id).padStart(6, '0')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
            {paymentMethod && getPaymentMethodIcon(paymentMethod.code)}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Phương thức thanh toán</p>
            <p className="text-sm font-medium text-gray-900">
              {paymentMethod?.name || 'N/A'}
            </p>
            {paymentMethod && (
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  {paymentMethod.code}
                </span>
                {paymentMethod.isActive && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Đang hoạt động
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
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
          <div>
            <p className="text-xs text-gray-500">Số tiền</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(payment.amount)}
            </p>
          </div>
        </div>

        {payment.transactionCode && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="h-5 w-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Mã giao dịch</p>
              <p className="font-mono text-sm font-medium text-gray-900">
                {payment.transactionCode}
              </p>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(payment.transactionCode)
                }
                className="mt-1 text-xs text-pink-600 hover:text-pink-800"
              >
                Sao chép
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInfoCard;
