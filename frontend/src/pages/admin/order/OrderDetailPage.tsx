import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types/Order';
import type { OrderStatusHistory } from '../../../types/OrderStatusHistory';

import { getOrderDetail, cancelOrder } from '../../../api/order';
import OrderStatusBadge from '../../../components/admin/order/OrderStatusBadge';
import OrderSummaryCard from '../../../components/admin/order/OrderSummaryCard';
import CustomerInfoCard from '../../../components/admin/order/CustomerInfoCard';
import RecipientInfoCard from '../../../components/admin/recipient/RecipientInfoCard';
import OrderItemsTable from '../../../components/admin/order/OrderItemsTable';
import PaymentInfoCard from '../../../components/admin/payment/PaymentInfoCard';
import ShipmentTrackingCard from '../../../components/admin/shipment/ShipmentTrackingCard';
import OrderStatusTimeline from '../../../components/admin/order/OrderStatusTimeline';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import {
  formatOrderId,
  formatDateTime,
  canCancelOrder,
} from '../../../utils/orderStatusUtils';

import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface OrderDetailPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await getOrderDetail(Number(orderId));
      if (!orderData) {
        throw new Error('Không tìm thấy đơn hàng');
      }
      
      // Transform OrderDetailResponse to Order type
      const transformedOrder: Order = {
        id: orderData.id,
        userId: orderData.userId || 0,
        status: orderData.status || 'PENDING',
        subtotal: orderData.subtotal || 0,
        totalAmount: orderData.totalAmount || 0,
        notes: orderData.notes || '',
        discountAmount: orderData.discountAmount || 0,
        shippingFee: orderData.shippingFee || 0,
        estimateDeliveryFrom: orderData.estimateDeliveryFrom || '',
        estimateDeliveryTo: orderData.estimateDeliveryTo || '',
        createdAt: orderData.createdAt || new Date().toISOString(),
        updatedAt: orderData.updatedAt || new Date().toISOString(),
        orderItems: (orderData.orderItems || []) as any,
        payment: orderData.paymentInfo as any,
        recipientInformation: orderData.recipientInfo as any,
      };
      setOrder(transformedOrder);

      // TODO: Get real order status history from backend
      // For now, create basic history from order status
      const history: OrderStatusHistory[] = [
        {
          id: 1,
          orderId: transformedOrder.id,
          status: transformedOrder.status,
          createdAt: transformedOrder.updatedAt,
          updatedAt: transformedOrder.updatedAt,
        },
      ];
      setStatusHistory(history);

      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch order details:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = () => {
    onNavigate(`/admin/orders/${orderId}/status`);
  };

  const handleManageShipment = () => {
    onNavigate(`/admin/orders/${orderId}/shipment`);
  };

  const handleManageReturn = () => {
    onNavigate(`/admin/orders/${orderId}/return`);
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      
      // Call real API to cancel order
      await cancelOrder(Number(orderId));
      
      // Refetch order details to get updated status
      await fetchOrderDetails();
      
      setShowCancelDialog(false);
      alert('Hủy đơn hàng thành công!');
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      alert(error.response?.data?.error || error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">{error}</p>
          <button
            onClick={() => onNavigate('/admin/orders')}
            className="mt-4 rounded-lg bg-pink-600 px-6 py-2 text-white hover:bg-pink-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <button
              onClick={() => onNavigate('/admin/orders')}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {formatOrderId(order.id)}
                  </h1>
                  <OrderStatusBadge
                    status={order.status}
                    type="order"
                    size="lg"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Đặt hàng lúc: {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleUpdateStatus}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Cập nhật trạng thái
                </button>

                {order.shipment && (
                  <button
                    onClick={handleManageShipment}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Quản lý vận chuyển
                  </button>
                )}

                {canCancelOrder(order.status) && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    Hủy đơn hàng
                  </button>
                )}

                <button
                  onClick={handlePrintInvoice}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="mb-6 rounded-lg bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Ghi chú:
                  </p>
                  <p className="mt-1 text-sm text-yellow-700">{order.notes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Sản Phẩm Trong Đơn Hàng
                </h2>
                <OrderItemsTable items={order.orderItems || []} />
              </div>

              {order.user && (
                <CustomerInfoCard
                  user={order.user}
                  onViewProfile={(userId) =>
                    onNavigate(`/admin/users/${userId}`)
                  }
                />
              )}

              {order.recipientInformation && (
                <RecipientInfoCard recipient={order.recipientInformation} />
              )}

              {statusHistory.length > 0 && (
                <OrderStatusTimeline
                  history={statusHistory}
                  currentStatus={order.status}
                />
              )}
            </div>

            <div className="space-y-6">
              <OrderSummaryCard
                subtotal={order.subtotal}
                discountAmount={order.discountAmount}
                shippingFee={order.shippingFee}
                totalAmount={order.totalAmount}
              />

              {order.payment && (
                <PaymentInfoCard
                  payment={order.payment}
                  onViewHistory={() => {
                    console.log('View payment history');
                  }}
                />
              )}

              {order.shipment && (
                <ShipmentTrackingCard
                  shipment={order.shipment}
                  estimateDeliveryFrom={order.estimateDeliveryFrom}
                  estimateDeliveryTo={order.estimateDeliveryTo}
                  onUpdateTracking={handleManageShipment}
                />
              )}

              {order.returnInfo && (
                <div className="rounded-lg bg-white p-6 shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                      Yêu Cầu Hoàn Trả
                    </h3>
                    {order.payment?.status === 'REFUNDED' && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Đã hoàn tiền
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-yellow-50 p-3">
                      <p className="text-xs font-medium text-yellow-800">
                        Lý do:
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.returnInfo.reason}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Yêu cầu lúc:</p>
                        <p className="text-sm text-gray-900">
                          {formatDateTime(order.returnInfo.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cập nhật:</p>
                        <p className="text-sm text-gray-900">
                          {formatDateTime(order.returnInfo.updatedAt)}
                        </p>
                      </div>
                    </div>
                    {order.payment?.status !== 'REFUNDED' && (
                      <button
                        onClick={handleManageReturn}
                        className="w-full rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
                      >
                        Xử lý hoàn trả
                      </button>
                    )}
                    {order.payment?.status === 'REFUNDED' && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-xs text-green-700">
                            Đã hoàn tiền thành công
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <span className="font-medium text-gray-700">Ngày tạo: </span>
                <span className="text-gray-900">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Cập nhật lần cuối:{' '}
                </span>
                <span className="text-gray-900">
                  {formatDateTime(order.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={showCancelDialog}
          title="Xác nhận hủy đơn hàng"
          message={`Bạn có chắc chắn muốn hủy đơn hàng ${formatOrderId(order.id)}? Hành động này không thể hoàn tác.`}
          onConfirm={handleCancelOrder}
          onCancel={() => setShowCancelDialog(false)}
          confirmText="Hủy đơn hàng"
          cancelText="Không"
          variant="danger"
          loading={cancelling}
        />
      </div>
    </AdminLayout>
  );
};

export default OrderDetailPage;
