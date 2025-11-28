import React from 'react';
import { formatCurrency } from '../../../utils/orderStatusUtils';

interface OrderSummaryCardProps {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  subtotal,
  discountAmount,
  shippingFee,
  totalAmount,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Tóm Tắt Đơn Hàng</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tạm tính:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Giảm giá:</span>
            <span className="text-sm font-medium text-red-600">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Phí vận chuyển:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(shippingFee)}
          </span>
        </div>

        <div className="border-t border-gray-200"></div>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">Tổng cộng:</span>
          <span className="text-xl font-bold text-pink-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
