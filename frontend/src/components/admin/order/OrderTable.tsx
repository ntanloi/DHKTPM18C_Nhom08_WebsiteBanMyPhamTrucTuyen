import React from 'react';
import type { Order } from '../../../types/Order';
import OrderStatusBadge from './OrderStatusBadge';
import {
  formatCurrency,
  formatDateTime,
  formatOrderId,
} from '../../../utils/orderStatusUtils';

interface OrderTableProps {
  orders: Order[];
  onViewDetail: (orderId: number) => void;
  onUpdateStatus?: (orderId: number) => void;
  onCancelOrder?: (orderId: number) => void;
  onDeleteOrder?: (orderId: number) => void;
  loading?: boolean;
  activeTab?: 'all' | 'processing' | 'completed' | 'cancelled';
  selectedOrders?: number[];
  onSelectAll?: (checked: boolean) => void;
  onSelectOrder?: (orderId: number, checked: boolean) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewDetail,
  onUpdateStatus,
  onCancelOrder,
  onDeleteOrder,
  loading = false,
  activeTab = 'all',
  selectedOrders = [],
  onSelectAll,
  onSelectOrder,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-gray-600">Không tìm thấy đơn hàng nào</p>
      </div>
    );
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { text: string; bg: string; border: string; textColor: string }
    > = {
      PENDING: {
        text: 'Chờ thanh toán',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        textColor: 'text-yellow-700',
      },
      COMPLETED: {
        text: 'Đã thanh toán',
        bg: 'bg-green-50',
        border: 'border-green-200',
        textColor: 'text-green-700',
      },
      FAILED: {
        text: 'Thất bại',
        bg: 'bg-red-50',
        border: 'border-red-200',
        textColor: 'text-red-700',
      },
      CANCELLED: {
        text: 'Đã hủy',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        textColor: 'text-gray-700',
      },
      REFUNDED: {
        text: 'Đã hoàn tiền',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        textColor: 'text-orange-700',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${config.bg} ${config.border} ${config.textColor}`}
      >
        {config.text}
      </span>
    );
  };

  const allSelected = orders.length > 0 && orders.every((o) => selectedOrders.includes(o.id));
  const someSelected = orders.some((o) => selectedOrders.includes(o.id)) && !allSelected;

  return (
    <div className="space-y-4">
      {onSelectAll && orders.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {allSelected ? 'Bỏ chọn tất cả' : someSelected ? `Đã chọn ${selectedOrders.length} đơn` : 'Chọn tất cả đơn hàng trên trang này'}
            </span>
          </label>
        </div>
      )}
      {orders.map((order) => (
        <div
          key={order.id}
          className={`overflow-hidden rounded-lg border ${
            selectedOrders.includes(order.id) ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'
          } bg-white shadow-sm transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3">
            <div className="flex items-center gap-4">
              {onSelectOrder && (
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={(e) => onSelectOrder(order.id, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <span className="font-mono text-sm font-semibold text-pink-600">
                {formatOrderId(order.id)}
              </span>
              <span className="text-sm text-gray-500">
                {formatDateTime(order.createdAt)}
              </span>
              <OrderStatusBadge status={order.status} type="order" />
            </div>
            <button
              onClick={() => onViewDetail(order.id)}
              className="text-sm font-medium text-pink-600 hover:text-pink-800"
            >
              Xem chi tiết →
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {order.recipientInformation?.recipientFirstName && order.recipientInformation?.recipientLastName
                      ? `${order.recipientInformation.recipientFirstName} ${order.recipientInformation.recipientLastName}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="ml-7 text-sm text-gray-600">
                  <div>{order.recipientInformation?.recipientPhone || 'N/A'}</div>
                  <div>{order.recipientInformation?.recipientEmail || 'N/A'}</div>
                </div>
              </div>
              <div className="text-right">
                {order.payment ? (
                  <>
                    {getPaymentBadge(order.payment.status)}
                    <div className="mt-1 text-xs text-gray-500">
                      {order.payment.paymentMethods?.[0]?.name || 'COD'}
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Chưa có</span>
                )}
              </div>
            </div>

            <div className="mb-4 space-y-3">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {item.productVariant?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      x{item.quantity}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(
                        (item.productVariant?.price || 0) * item.quantity,
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                {order.orderItems?.length || 0} sản phẩm
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tổng tiền:</span>
                <span className="text-xl font-bold text-pink-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {onDeleteOrder && (
                <button
                  onClick={() => onDeleteOrder(order.id)}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:border-red-600 hover:bg-red-50"
                >
                  Xóa đơn
                </button>
              )}

              {activeTab === 'processing' && (
                <>
                  {onCancelOrder &&
                    ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(
                      order.status,
                    ) && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Hủy đơn
                      </button>
                    )}
                  {onUpdateStatus && (
                    <button
                      onClick={() => onUpdateStatus(order.id)}
                      className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
                    >
                      Cập nhật trạng thái
                    </button>
                  )}
                </>
              )}

              {activeTab === 'completed' && (
                <button
                  onClick={() => onViewDetail(order.id)}
                  className="rounded-lg border border-pink-600 bg-white px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50"
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTable;
