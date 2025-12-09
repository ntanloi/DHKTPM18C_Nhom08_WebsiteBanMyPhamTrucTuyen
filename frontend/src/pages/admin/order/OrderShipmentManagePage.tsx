import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types/Order';
import type { Shipment } from '../../../types/Shipment';
import { getOrderById } from '../../../mocks/orderMockData';
import { mockShipmentService } from '../../../mocks/mockShipmentService';
import ShipmentManagementForm, {
  type ShipmentFormData,
} from '../../../components/admin/shipment/ShipmentManagementForm';
import OrderStatusBadge from '../../../components/admin/order/OrderStatusBadge';
import {
  formatOrderId,
  formatCurrency,
  formatDateTime,
} from '../../../utils/orderStatusUtils';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Toast, type ToastType } from '../../../components/user/ui/Toast';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';

interface OrderShipmentManagePageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const OrderShipmentManagePage: React.FC<OrderShipmentManagePageProps> = ({
  orderId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchData();
  }, [orderId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const orderData = getOrderById(Number(orderId));
      if (!orderData) {
        throw new Error('Không tìm thấy đơn hàng');
      }
      setOrder(orderData);

      const shipmentData = await mockShipmentService.getShipmentByOrderId(
        Number(orderId),
      );
      setShipment(shipmentData);

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ShipmentFormData) => {
    try {
      setSubmitting(true);

      if (shipment) {
        await mockShipmentService.updateShipment(Number(orderId), data);
        setToast({
          message: 'Cập nhật thông tin vận chuyển thành công!',
          type: 'success',
        });
      } else {
        await mockShipmentService.createShipment(Number(orderId), data);
        setToast({
          message: 'Tạo thông tin vận chuyển thành công!',
          type: 'success',
        });
      }

      setTimeout(() => {
        onNavigate(`/admin/orders/${orderId}`);
      }, 1500);
    } catch (err: any) {
      setToast({
        message: err.message || 'Có lỗi xảy ra khi lưu thông tin vận chuyển',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    onNavigate(`/admin/orders/${orderId}`);
  };

  const handleQuickAction = async (action: 'SHIPPED' | 'DELIVERED') => {
    setConfirmDialog({
      open: true,
      title: 'Xác nhận cập nhật trạng thái',
      message: `Xác nhận đánh dấu đơn hàng là ${action === 'SHIPPED' ? 'Đã giao' : 'Đã giao thành công'}?`,
      variant: 'info',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        try {
          setSubmitting(true);

          if (action === 'SHIPPED') {
            await mockShipmentService.markAsShipped(Number(orderId));
            setToast({
              message: 'Đã đánh dấu đơn hàng là Đã giao!',
              type: 'success',
            });
          } else {
            await mockShipmentService.markAsDelivered(Number(orderId));
            setToast({
              message: 'Đã đánh dấu đơn hàng là Đã giao thành công!',
              type: 'success',
            });
          }

          await fetchData();
        } catch (err: any) {
          setToast({
            message: err.message || 'Có lỗi xảy ra',
            type: 'error',
          });
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
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
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <button
              onClick={handleCancel}
              disabled={submitting}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
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
              Quay lại chi tiết đơn hàng
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản Lý Vận Chuyển
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {shipment
                  ? 'Cập nhật thông tin vận chuyển cho đơn hàng'
                  : 'Tạo thông tin vận chuyển cho đơn hàng'}{' '}
                {formatOrderId(order.id)}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Thông Tin Đơn Hàng
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Mã đơn hàng</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatOrderId(order.id)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Trạng thái đơn</p>
                <OrderStatusBadge status={order.status} type="order" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Khách hàng</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.user?.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng tiền</p>
                <p className="text-sm font-bold text-pink-600">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                <p className="text-sm text-gray-900">
                  {order.recipientInformation?.shippingRecipientAddress ||
                    'N/A'}
                </p>
              </div>
            </div>
          </div>

          {shipment && shipment.status !== 'DELIVERED' && (
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-bold text-gray-800">
                Hành Động Nhanh
              </h3>
              <div className="flex flex-wrap gap-3">
                {shipment.status === 'PENDING' && (
                  <button
                    onClick={() => handleQuickAction('SHIPPED')}
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Đánh dấu đã giao cho ĐVVC
                  </button>
                )}
                {['SHIPPED', 'IN_TRANSIT'].includes(shipment.status) && (
                  <button
                    onClick={() => handleQuickAction('DELIVERED')}
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      className="h-5 w-5"
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
                    Đánh dấu đã giao thành công
                  </button>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Sử dụng các nút này để nhanh chóng cập nhật trạng thái vận
                chuyển
              </p>
            </div>
          )}

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-bold text-gray-800">
              {shipment ? 'Cập Nhật Thông Tin' : 'Tạo Thông Tin Vận Chuyển'}
            </h3>
            <ShipmentManagementForm
              orderId={order.id}
              shipment={shipment}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={submitting}
            />
          </div>

          {shipment && (
            <div className="mt-6 rounded-lg bg-gray-100 p-4">
              <h4 className="mb-3 text-sm font-bold text-gray-800">
                Thông Tin Hiện Tại
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-medium text-gray-700">Tạo lúc: </span>
                  <span className="text-gray-900">
                    {formatDateTime(shipment.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Cập nhật lần cuối:{' '}
                  </span>
                  <span className="text-gray-900">
                    {formatDateTime(shipment.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        variant={confirmDialog.variant}
      />
    </AdminLayout>
  );
};

export default OrderShipmentManagePage;
