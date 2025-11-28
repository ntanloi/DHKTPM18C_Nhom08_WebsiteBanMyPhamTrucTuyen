import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types/Order';
import type { Return } from '../../../types/Return';

import { getOrderById } from '../../../mocks/orderMockData';
import { mockReturnService } from '../../../mocks/mockReturnService';
import ReturnRequestCard from '../../../components/admin/return/ReturnRequestCard';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { formatOrderId } from '../../../utils/orderStatusUtils';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface OrderReturnManagePageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const OrderReturnManagePage: React.FC<OrderReturnManagePageProps> = ({
  orderId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [returnInfo, setReturnInfo] = useState<Return | null>(null);

  const [showRefundDialog, setShowRefundDialog] = useState(false);

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

      const returnData = await mockReturnService.getReturnByOrderId(
        Number(orderId),
      );
      setReturnInfo(returnData);

      if (!returnData) {
        throw new Error('Không tìm thấy yêu cầu hoàn trả cho đơn hàng này');
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (notes?: string) => {
    if (
      !window.confirm(
        'Xác nhận chấp nhận yêu cầu hoàn trả? Trạng thái thanh toán sẽ được cập nhật.',
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      await mockReturnService.approveReturn(returnInfo!.id, notes);
      alert('Đã chấp nhận yêu cầu hoàn trả!');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi chấp nhận yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      setSubmitting(true);
      await mockReturnService.rejectReturn(returnInfo!.id, reason);
      alert('Đã từ chối yêu cầu hoàn trả!');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessRefund = async () => {
    try {
      setSubmitting(true);
      setShowRefundDialog(false);
      await mockReturnService.processRefund(returnInfo!.id);
      alert('Xử lý hoàn tiền thành công!');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi xử lý hoàn tiền');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewOrder = (orderId: number) => {
    onNavigate(`/admin/orders/${orderId}`);
  };

  const handleCancel = () => {
    if (submitting) return;
    onNavigate(`/admin/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin hoàn trả...</p>
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

  if (!order || !returnInfo) return null;

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
                Quản Lý Hoàn Trả
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Xử lý yêu cầu hoàn trả cho đơn hàng {formatOrderId(order.id)}
              </p>
            </div>
          </div>

          <ReturnRequestCard
            returnInfo={returnInfo}
            order={order}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcessRefund={() => setShowRefundDialog(true)}
            onViewOrder={handleViewOrder}
            loading={submitting}
          />

          <ConfirmDialog
            open={showRefundDialog}
            title="Xác nhận xử lý hoàn tiền"
            message={`Bạn có chắc chắn muốn xử lý hoàn tiền cho đơn hàng ${formatOrderId(order.id)}? Số tiền ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)} sẽ được hoàn về cho khách hàng.`}
            onConfirm={handleProcessRefund}
            onCancel={() => setShowRefundDialog(false)}
            confirmText="Xử lý hoàn tiền"
            cancelText="Hủy"
            variant="warning"
            loading={submitting}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderReturnManagePage;
