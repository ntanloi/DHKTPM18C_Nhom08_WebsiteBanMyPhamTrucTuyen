import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types/Order';
import { getOrderDetail, updateOrderStatus } from '../../../api/order';
import OrderStatusUpdateForm from '../../../components/admin/order/OrderStatusUpdateForm';
import { formatOrderId, formatDateTime } from '../../../utils/orderStatusUtils';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Toast, type ToastType } from '../../../components/user/ui/Toast';

interface OrderStatusUpdatePageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const OrderStatusUpdatePage: React.FC<OrderStatusUpdatePageProps> = ({
  orderId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

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
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch order details:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setSubmitting(true);

      // Call real API to update order status
      await updateOrderStatus(Number(orderId), { status: newStatus });

      showToast('Cập nhật trạng thái thành công!', 'success');
      // Navigate back to order list after a short delay
      setTimeout(() => {
        onNavigate('/admin/orders');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      showToast(
        err.response?.data?.error ||
          err.message ||
          'Có lỗi xảy ra khi cập nhật trạng thái',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    // Navigate back to order list instead of detail page
    onNavigate('/admin/orders');
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
        <div className="mx-auto max-w-3xl">
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
              Quay lại danh sách đơn hàng
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cập Nhật Trạng Thái
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Thay đổi trạng thái cho đơn hàng {formatOrderId(order.id)}
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
                <p className="text-xs text-gray-500">Khách hàng</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.user?.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ngày đặt hàng</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng tiền</p>
                <p className="text-sm font-bold text-pink-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-bold text-gray-800">
              Thay Đổi Trạng Thái
            </h3>
            <OrderStatusUpdateForm
              orderId={order.id}
              currentStatus={order.status}
              onSubmit={handleUpdateStatus}
              onCancel={handleCancel}
              loading={submitting}
            />
          </div>

          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Lưu ý quan trọng
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-yellow-700">
                  <li>
                    Việc thay đổi trạng thái sẽ được lưu vào lịch sử và không
                    thể hoàn tác
                  </li>
                  <li>
                    Khách hàng có thể nhận được thông báo về thay đổi trạng thái
                  </li>
                  <li>
                    Đảm bảo bạn đã kiểm tra kỹ thông tin trước khi xác nhận
                  </li>
                  <li>
                    Một số trạng thái không thể chuyển đổi trực tiếp (ví dụ: từ
                    Đã giao về Đang xử lý)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </AdminLayout>
  );
};

export default OrderStatusUpdatePage;
