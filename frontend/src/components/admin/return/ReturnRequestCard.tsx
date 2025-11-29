import React, { useState } from 'react';
import type { Order } from '../../../types/Order';
import type { Return } from '../../../types/Return';

import {
  formatDateTime,
  formatCurrency,
  getRelativeTime,
} from '../../../utils/orderStatusUtils';

interface ReturnRequestCardProps {
  returnInfo: Return;
  order?: Order;
  onApprove: (notes?: string) => void;
  onReject: (reason: string) => void;
  onProcessRefund: () => void;
  onViewOrder?: (orderId: number) => void;
  loading?: boolean;
}

const ReturnRequestCard: React.FC<ReturnRequestCardProps> = ({
  returnInfo,
  order,
  onApprove,
  onReject,
  onProcessRefund,
  onViewOrder,
  loading = false,
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const isRefunded = order?.payment?.status === 'REFUNDED';

  const handleApproveSubmit = () => {
    onApprove(approveNotes);
    setShowApproveModal(false);
    setApproveNotes('');
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    onReject(rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Yêu Cầu Hoàn Trả #{returnInfo.id}
          </h3>
          <p className="text-sm text-gray-500">
            {getRelativeTime(returnInfo.createdAt)}
          </p>
        </div>
        {isRefunded && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Đã hoàn tiền
          </span>
        )}
      </div>

      {/* Order Info */}
      {order && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Thông tin đơn hàng
            </h4>
            {onViewOrder && (
              <button
                onClick={() => onViewOrder(order.id)}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                Xem chi tiết →
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Mã đơn:</p>
              <p className="font-mono font-medium text-gray-900">
                #ORD-{String(order.id).padStart(6, '0')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Khách hàng:</p>
              <p className="font-medium text-gray-900">
                {order.user?.fullName || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Tổng tiền:</p>
              <p className="font-bold text-pink-600">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Ngày giao:</p>
              <p className="text-gray-900">
                {order.shipment?.deliveredAt
                  ? formatDateTime(order.shipment.deliveredAt)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">
          Lý do hoàn trả:
        </h4>
        <div className="rounded-lg bg-yellow-50 p-4">
          <p className="text-sm whitespace-pre-wrap text-gray-900">
            {returnInfo.reason}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Yêu cầu lúc:</p>
          <p className="text-gray-900">
            {formatDateTime(returnInfo.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Cập nhật lúc:</p>
          <p className="text-gray-900">
            {formatDateTime(returnInfo.updatedAt)}
          </p>
        </div>
      </div>

      {!isRefunded && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowApproveModal(true)}
            disabled={loading}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Chấp nhận hoàn trả
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Từ chối
          </button>
          <button
            onClick={onProcessRefund}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xử lý hoàn tiền
          </button>
        </div>
      )}

      {order?.payment && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-start gap-2">
            <svg
              className="h-5 w-5 flex-shrink-0 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Trạng thái thanh toán: {order.payment.status}
              </p>
              {order.payment.paymentMethods?.[0] && (
                <p className="text-xs text-blue-700">
                  Phương thức: {order.payment.paymentMethods[0].name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showApproveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="bg-opacity-50 fixed inset-0 bg-black"
            onClick={() => setShowApproveModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Chấp nhận yêu cầu hoàn trả
              </h3>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  rows={4}
                  placeholder="Nhập ghi chú về việc chấp nhận hoàn trả..."
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApproveSubmit}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="bg-opacity-50 fixed inset-0 bg-black"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Từ chối yêu cầu hoàn trả
              </h3>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="Nhập lý do từ chối yêu cầu hoàn trả..."
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRejectSubmit}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                >
                  Xác nhận từ chối
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnRequestCard;
